// ── hamburger nav toggle ──────────────────────────────────────────────────
(function () {
  const toggle = document.getElementById('nav-toggle');
  const links  = document.getElementById('nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.classList.toggle('open', open);
  });

  links.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
    })
  );

  document.addEventListener('click', e => {
    if (!toggle.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('open');
      toggle.classList.remove('open');
    }
  });
})();

// ── inline video player — replaces thumbnail in place ────────────────────
(function () {
  function embedVideo(container, videoId) {
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    iframe.frameBorder = '0';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;border:none;';
    container.innerHTML = '';
    container.appendChild(iframe);
  }

  // homepage / blog video grid
  document.querySelectorAll('.video-card .video-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      const id = thumb.closest('.video-card').dataset.id;
      if (id) embedVideo(thumb, id);
    });
  });

  // portfolio card play button
  document.querySelectorAll('.card-play-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      e.preventDefault();
      const wrap = btn.closest('.card-thumb-wrap');
      if (wrap) embedVideo(wrap, btn.dataset.id);
    });
  });

  // post / project page inline embed
  document.querySelectorAll('.post-video-embed').forEach(embed => {
    embed.addEventListener('click', () => {
      const thumb = embed.querySelector('.pve-thumb');
      if (thumb) embedVideo(thumb, embed.dataset.id);
    });
  });

  // project banner "▶ watch demo" button
  document.querySelectorAll('.pb-play').forEach(btn => {
    btn.addEventListener('click', () => {
      const embed = document.querySelector('.post-video-embed');
      if (embed) {
        embed.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const thumb = embed.querySelector('.pve-thumb');
        if (thumb) embedVideo(thumb, btn.dataset.id);
      }
    });
  });
})();

// ── blog tag filter + more/less toggle ───────────────────────────────────
(function () {
  const tabs    = document.querySelectorAll('.tag-tab');
  const posts   = document.querySelectorAll('.post-item');
  const moreBtn = document.getElementById('tag-more-btn');

  if (!tabs.length) return;

  // tag filter
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      if (tab.id === 'tag-more-btn') return;   // ignore the more button

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const sel = tab.dataset.tag;
      posts.forEach(post => {
        const tags = post.dataset.tags ? post.dataset.tags.split(',') : [];
        post.style.display = (sel === 'all' || tags.includes(sel)) ? '' : 'none';
      });
    });
  });

  // more / less toggle
  if (moreBtn) {
    let expanded = false;
    const hiddenTabs = document.querySelectorAll('.tag-tab-hidden');

    moreBtn.addEventListener('click', e => {
      e.stopPropagation();
      expanded = !expanded;
      hiddenTabs.forEach(tab => tab.style.display = expanded ? 'inline-flex' : 'none');
      moreBtn.textContent = expanded ? 'less ↑' : 'more ↓';
    });
  }
})();
