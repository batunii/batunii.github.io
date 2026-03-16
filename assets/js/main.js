// ── hamburger nav toggle ──────────────────────────────────────────────────
(function () {
  const toggle = document.getElementById('nav-toggle');
  const links  = document.getElementById('nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  });

  // close menu when a link is clicked
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
    });
  });

  // close on outside click
  document.addEventListener('click', e => {
    if (!toggle.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('open');
      toggle.classList.remove('open');
    }
  });
})();

// ── video modal ───────────────────────────────────────────────────────────
(function () {
  const modal   = document.getElementById('video-modal');
  if (!modal) return;
  const iframe  = document.getElementById('modal-iframe');
  const closeBtn = modal.querySelector('.modal-close');
  const backdrop = modal.querySelector('.modal-backdrop');

  function openModal(id) {
    iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    iframe.src = '';
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.video-card').forEach(c =>
    c.addEventListener('click', () => openModal(c.dataset.id))
  );

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
})();

// ── blog tag filter ───────────────────────────────────────────────────────
(function () {
  const tabs  = document.querySelectorAll('.tag-tab');
  const posts = document.querySelectorAll('.post-item');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const sel = tab.dataset.tag;
      posts.forEach(post => {
        const tags = post.dataset.tags ? post.dataset.tags.split(',') : [];
        post.style.display = (sel === 'all' || tags.includes(sel)) ? '' : 'none';
      });
    });
  });
})();
