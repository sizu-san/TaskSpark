
export function animatedNavBar() {
  const menuBtn = document.querySelector('.menu-bar');
  const nav = document.querySelector('nav');

  menuBtn.addEventListener('click', () => {
    nav.classList.toggle('nav-open');
  });
}
