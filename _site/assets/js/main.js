// ── video modal ───────────────────────────────────────────────────────────
(function () {
  const modal = document.getElementById('video-modal');
  if (!modal) return;

  const iframe = document.getElementById('modal-iframe');
  const closeBtn = modal.querySelector('.modal-close');
  const backdrop = modal.querySelector('.modal-backdrop');

  function openModal(videoId) {
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    iframe.src = '';
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.video-card').forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.id));
  });

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
})();

// ── blog tag filter ───────────────────────────────────────────────────────
(function () {
  const tabs = document.querySelectorAll('.tag-tab');
  const posts = document.querySelectorAll('.post-item');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const selected = tab.dataset.tag;
      posts.forEach(post => {
        const tags = post.dataset.tags ? post.dataset.tags.split(',') : [];
        post.style.display = (selected === 'all' || tags.includes(selected)) ? '' : 'none';
      });
    });
  });
})();
