// Set active nav link based on current page
function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    console.log(currentPath);
 
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      console.log(href)
      if (currentPath === href) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
  
  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    // Set initial active link
    setActiveNavLink();
  });