document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const toggle = document.getElementById("menuToggle");
  const mobile = document.getElementById("mobileMenu");
  if (toggle && mobile) {
    toggle.setAttribute("aria-controls", "mobileMenu");
    toggle.setAttribute("aria-expanded", "false");

    toggle.addEventListener("click", () => {
      const isHidden = mobile.classList.toggle("hidden");
      toggle.setAttribute("aria-expanded", String(!isHidden));
    });
  }
  // Inject GitHub link (site-wide) next to existing footer-social icons if not present
  try{
    const footers = document.querySelectorAll('.footer-social');
    footers.forEach(f => {
      if (f && !f.querySelector('.github-link')){
        const a = document.createElement('a');
        a.href = 'https://github.com/danud3';
        a.target = '_blank';
        a.rel = 'noopener';
        a.className = 'github-link';
        a.setAttribute('aria-label','GitHub');
        a.innerHTML = ` <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor"><path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.38 7.86 10.9.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.36-1.3-1.72-1.3-1.72-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.76.41-1.27.75-1.56-2.55-.29-5.24-1.28-5.24-5.71 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.04 11.04 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.5 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.44-2.69 5.41-5.26 5.69.42.37.8 1.1.8 2.22 0 1.6-.01 2.89-.01 3.28 0 .31.21.68.8.56C20.71 21.38 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z"/></svg>`;
        // small spacing
        a.style.color = 'var(--text)';
        a.style.opacity = '0.9';
        a.style.marginLeft = '8px';
        f.appendChild(a);
      }
      // Add contact email link next to GitHub
      if (f && !f.querySelector('.contact-link')) {
        const contactA = document.createElement('a');
        contactA.href = 'mailto:danylin1907@gmail.com';
        contactA.className = 'contact-link';
        contactA.setAttribute('aria-label', 'Contacter par email');
        contactA.innerHTML = ` <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>`;
        contactA.style.color = 'var(--text)';
        contactA.style.opacity = '0.9';
        contactA.style.marginLeft = '8px';
        f.appendChild(contactA);
      }
    });
  }catch(e){
    // non-fatal
    console.warn('Could not inject links', e);
  }

  // Simple intersection-based animation for bilan cards
  try{
    const cards = document.querySelectorAll('.bilan-card');
    if(cards.length){
      cards.forEach(c=>{
        // set initial hidden state (quick, via JS to avoid flash)
        c.style.opacity = '0';
        c.style.transform = 'translateY(12px)';
      });

      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if(entry.isIntersecting){
            const el = entry.target;
            el.classList.add('in-view');
            // stagger children micro blocks
            const items = el.querySelectorAll('.bilan-micro');
            items.forEach((it, i) => {
              it.classList.add('in-view');
              it.style.animationDelay = `${i * 80}ms`;
            });
            obs.unobserve(el);
          }
        });
      }, { threshold: 0.12 });

      cards.forEach(c => observer.observe(c));
    }
  }catch(e){
    console.warn('bilan animation failed', e);
  }

  // E5-E6 Page Enhancements - Scroll Animations & Accessibility
  try {
    const e6Cards = document.querySelectorAll('.competence-card, .tech-badge, .projet-card, .preuve-box');
    if (e6Cards.length) {
      e6Cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(16px)';
      });

      const observerE6 = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry, idx) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            setTimeout(() => {
              el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
              el.style.opacity = '1';
              el.style.transform = 'translateY(0)';
            }, idx * 40);
            obs.unobserve(el);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

      e6Cards.forEach(card => observerE6.observe(card));
    }
  } catch (e) {
    console.warn('E6 scroll animation failed', e);
  }

  // E5-E6 Keyboard Navigation
  try {
    const e6Links = document.querySelectorAll('.btn-projet, .btn-link');
    e6Links.forEach(link => {
      link.addEventListener('keydown', (ev) => {
        if (ev.code === 'Enter' || ev.code === 'Space') {
          ev.preventDefault();
          link.click();
        }
      });
      link.addEventListener('focus', () => {
        link.style.outline = '2px solid #2563eb';
        link.style.outlineOffset = '2px';
      });
      link.addEventListener('blur', () => {
        link.style.outline = 'none';
      });
    });
  } catch (e) {
    console.warn('E6 keyboard nav failed', e);
  }

  // Obfuscate visible mailto links and make them clickable via JS to reduce scraping
  try{
    document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
      try{
        const email = a.getAttribute('href').replace('mailto:','').trim();
        a.dataset.email = email.split('').reverse().join(''); // store reversed
        a.removeAttribute('href');
        a.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>`;
        a.title = 'Envoyer un email';
        a.style.textDecoration = 'none';
        a.style.cursor = 'pointer';
        a.addEventListener('click', (ev)=>{
          ev.preventDefault();
          const rev = a.dataset.email.split('').reverse().join('');
          window.location.href = `mailto:${rev}`;
        });
      }catch(_e){}
    });
  }catch(e){ console.warn('email obfuscation failed', e) }



});
