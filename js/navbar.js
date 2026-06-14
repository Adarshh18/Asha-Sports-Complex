(function(){
/* ─── Elements ─── */
    const navbar      = document.getElementById('navbar');
    const hamburger   = document.getElementById('hamburger');
    const mobileMenu  = document.getElementById('mobileMenu');
    const navLinks    = document.querySelectorAll('.nav-links a');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    /* ─── Scroll: add .scrolled class ─── */
    let lastScroll = 0;

    const onScroll = () => {
      const y = window.scrollY;

      // Scrolled state for deeper glass + shadow
      navbar.classList.toggle('scrolled', y > 40);

      lastScroll = y;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // init

    /* ─── Mobile menu toggle ─── */
    const openMenu = () => {
      hamburger.classList.add('open');
      mobileMenu.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('open');
      isOpen ? closeMenu() : openMenu();
    });

    /* ─── Close mobile menu on link click ─── */
    mobileLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    /* ─── Close on Escape key ─── */
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
    });

    /* ─── Active nav link on click (desktop) ─── */
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      });
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      });
    });

    /* ─── Subtle hover ripple on CTA buttons ─── */
    document.querySelectorAll('.btn-book').forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        btn.style.setProperty('--glow', '1');
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.setProperty('--glow', '0');
      });
    });
})();