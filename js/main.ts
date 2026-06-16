const PREFERS_REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const MOBILE_BREAKPOINT = 900;

interface FancyboxLike {
  bind: (selector: string, options?: Record<string, unknown>) => void;
}

declare global {
  interface Window {
    Fancybox?: FancyboxLike;
  }
}

type NavLink = HTMLAnchorElement;

type NavLinkPayload = {
  href: string;
  path: string;
};

function normalizePath(value: string): string {
  try {
    const url = new URL(value, window.location.origin);
    let path = url.pathname.replace(/\/+$/g, '');

    if (!path || path === '/') {
      return '/';
    }

    if (path === '/index.html') {
      return '/';
    }

    return path;
  } catch {
    return '/';
  }
}

function getCurrentPath(): string {
  return normalizePath(window.location.pathname);
}

function getNavEntries(): NavLinkPayload[] {
  const links = Array.from(document.querySelectorAll<NavLink>('.nav-link')).filter(link => Boolean(link.getAttribute('href')));

  return links.map(link => {
    const href = link.getAttribute('href') ?? '/';
    return {
      href,
      path: normalizePath(href)
    };
  });
}

function setActiveNavLink(): void {
  const navEntries = getNavEntries();
  const currentPath = getCurrentPath();

  document.querySelectorAll<NavLink>('.nav-link').forEach(link => {
    const href = link.getAttribute('href') ?? '/';
    const found = navEntries.find(item => item.href === href);
    const linkPath = found?.path ?? '/';

    if (linkPath === currentPath) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
      return;
    }

    link.classList.remove('active');
    link.removeAttribute('aria-current');
  });
}

function getFixedOffsetTop(): number {
  if (window.innerWidth <= MOBILE_BREAKPOINT) {
    return 0;
  }

  const navbar = document.querySelector<HTMLElement>('.navbar');
  if (!navbar) {
    return 0;
  }

  const topbar = document.querySelector<HTMLElement>('.site-topbar');
  const topbarHeight = topbar ? topbar.offsetHeight : 0;

  return navbar.offsetHeight + topbarHeight + 16;
}

function setupFloatingBookingButton(): void {
  const bookingExists = Boolean(document.getElementById('booking_iframe'));
  const existing = document.querySelector<HTMLAnchorElement>('.floating-booking');

  if (window.innerWidth > MOBILE_BREAKPOINT) {
    if (existing) {
      existing.remove();
    }
    return;
  }

  if (!bookingExists || existing) {
    return;
  }

  const bookingButton = document.createElement('a');
  bookingButton.className = 'floating-booking';
  bookingButton.href = '#booking_iframe';
  bookingButton.textContent = 'Забронировать';
  bookingButton.setAttribute('aria-label', 'Перейти к блоку бронирования');

  document.body.appendChild(bookingButton);
}

function setupRevealAnimations(): void {
  const candidates = document.querySelectorAll<HTMLElement>(
    'main section, .card, .gallery-item, .review-card, .hero-section, .hero-section1, .hero-content, .hero-content1'
  );

  if (PREFERS_REDUCED_MOTION) {
    candidates.forEach((item, idx) => {
      item.classList.add('reveal', 'in-view');
      item.style.transitionDelay = `${Math.min(idx * 30, 250)}ms`;
    });
    return;
  }

  candidates.forEach((item, idx) => {
    item.classList.add('reveal');
    item.style.transitionDelay = `${Math.min(idx * 30, 250)}ms`;
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px -12% 0px'
    }
  );

  candidates.forEach(card => observer.observe(card));
}

function setupQuickScroll(): void {
  const anchors = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'));

  anchors.forEach(anchor => {
    const rawHref = anchor.getAttribute('href') ?? '';
    if (!rawHref || rawHref === '#') {
      return;
    }

    const targetId = rawHref.slice(1);
    if (!targetId) {
      return;
    }

    const target = document.getElementById(targetId);
    if (!target) {
      return;
    }

    anchor.addEventListener('click', event => {
      event.preventDefault();

      const top = target.getBoundingClientRect().top + window.scrollY - getFixedOffsetTop();
      window.scrollTo({
        top: Math.max(0, top),
        behavior: 'smooth'
      });

      history.pushState(null, '', `#${targetId}`);
    });
  });
}

function setupGalleryFallback(): void {
  if (!document.querySelector('[data-fancybox]')) {
    return;
  }

  if (window.Fancybox) {
    window.Fancybox.bind('[data-fancybox]');
  }
}

function setupNavAccessibility(): void {
  const nav = document.querySelector<HTMLElement>('.navbar');
  if (!nav) {
    return;
  }

  nav.addEventListener('focusin', event => {
    const item = event.target as HTMLElement;
    const target = item.closest('.nav-link');
    if (!target) {
      return;
    }

    target.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest'
    });
  });
}

function init(): void {
  setActiveNavLink();
  setupFloatingBookingButton();
  setupRevealAnimations();
  setupQuickScroll();
  setupGalleryFallback();
  setupNavAccessibility();

  window.addEventListener('resize', setupFloatingBookingButton);
  window.addEventListener('popstate', setActiveNavLink);
}

window.addEventListener('DOMContentLoaded', init);
