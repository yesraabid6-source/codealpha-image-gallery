/**
 * Lumina Interactive Image Gallery
 * Core Application Logic: Filtering, Search, Lightbox Navigation, Animations, Touch & Keyboard Support
 */

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    images: [...GALLERY_DATA],
    filteredImages: [...GALLERY_DATA],
    currentCategory: 'all',
    searchQuery: '',
    currentLightboxIndex: 0,
    isZoomed: false,
    favorites: new Set(JSON.parse(localStorage.getItem('lumina_favorites') || '[]')),
    theme: localStorage.getItem('lumina_theme') || 'dark',
    touchStartX: 0,
    touchEndX: 0
  };

  // DOM Elements Cache
  const elements = {
    html: document.documentElement,
    themeToggleBtn: document.getElementById('themeToggleBtn'),
    searchInput: document.getElementById('searchInput'),
    clearSearchBtn: document.getElementById('clearSearchBtn'),
    categoryFilters: document.getElementById('categoryFilters'),
    filterPills: document.querySelectorAll('.filter-pill'),
    itemsCountDisplay: document.getElementById('itemsCountDisplay'),
    galleryGrid: document.getElementById('galleryGrid'),
    emptyState: document.getElementById('emptyState'),
    resetFiltersBtn: document.getElementById('resetFiltersBtn'),

    // Lightbox Elements
    lightbox: document.getElementById('lightbox'),
    lightboxOverlay: document.getElementById('lightboxOverlay'),
    lbCloseBtn: document.getElementById('lbCloseBtn'),
    lbPrevBtn: document.getElementById('lbPrevBtn'),
    lbNextBtn: document.getElementById('lbNextBtn'),
    lbMainImage: document.getElementById('lbMainImage'),
    lbLoader: document.getElementById('lbLoader'),
    imageWrapper: document.getElementById('imageWrapper'),
    lbCurrentIndex: document.getElementById('lbCurrentIndex'),
    lbTotalCount: document.getElementById('lbTotalCount'),
    lbFavoriteBtn: document.getElementById('lbFavoriteBtn'),
    lbZoomBtn: document.getElementById('lbZoomBtn'),
    lbDownloadBtn: document.getElementById('lbDownloadBtn'),
    lbTitle: document.getElementById('lbTitle'),
    lbDescription: document.getElementById('lbDescription'),
    lbCategoryTag: document.getElementById('lbCategoryTag'),
    lbAuthorName: document.getElementById('lbAuthorName'),
    thumbnailsTrack: document.getElementById('thumbnailsTrack'),

    // Toast
    toast: document.getElementById('toastNotification'),
    toastMessage: document.getElementById('toastMessage')
  };

  // Theme Management
  function initTheme() {
    elements.html.setAttribute('data-theme', state.theme);
    updateThemeIcon();
  }

  function toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    elements.html.setAttribute('data-theme', state.theme);
    localStorage.setItem('lumina_theme', state.theme);
    updateThemeIcon();
    showToast(`Switched to ${state.theme} mode`);
  }

  function updateThemeIcon() {
    const icon = elements.themeToggleBtn.querySelector('i');
    if (state.theme === 'dark') {
      icon.className = 'fa-solid fa-moon';
      elements.themeToggleBtn.setAttribute('title', 'Switch to Light Mode');
    } else {
      icon.className = 'fa-solid fa-sun';
      elements.themeToggleBtn.setAttribute('title', 'Switch to Dark Mode');
    }
  }

  // Toast Notifications
  let toastTimeout;
  function showToast(message, iconClass = 'fa-solid fa-check') {
    if (!elements.toast) return;
    clearTimeout(toastTimeout);
    
    elements.toastMessage.textContent = message;
    const icon = elements.toast.querySelector('i');
    if (icon) icon.className = iconClass;

    elements.toast.classList.add('show');
    toastTimeout = setTimeout(() => {
      elements.toast.classList.remove('show');
    }, 2800);
  }

  // Category Badges
  function updateCategoryBadges() {
    const counts = {
      all: state.images.length,
      nature: 0,
      architecture: 0,
      travel: 0,
      wildlife: 0,
      favorites: state.favorites.size
    };

    state.images.forEach(img => {
      if (counts[img.category] !== undefined) {
        counts[img.category]++;
      }
    });

    Object.keys(counts).forEach(cat => {
      const badge = document.getElementById(`badge-${cat}`);
      if (badge) badge.textContent = counts[cat];
    });
  }

  // Filtering & Search
  function applyFilters() {
    const query = state.searchQuery.trim().toLowerCase();

    state.filteredImages = state.images.filter(img => {
      let matchesCategory = true;
      if (state.currentCategory === 'favorites') {
        matchesCategory = state.favorites.has(img.id);
      } else if (state.currentCategory !== 'all') {
        matchesCategory = img.category === state.currentCategory;
      }

      let matchesSearch = true;
      if (query) {
        const titleMatch = img.title.toLowerCase().includes(query);
        const descMatch = img.description.toLowerCase().includes(query);
        const authorMatch = img.author.toLowerCase().includes(query);
        const catMatch = img.category.toLowerCase().includes(query);
        const tagsMatch = img.tags.some(tag => tag.toLowerCase().includes(query));

        matchesSearch = titleMatch || descMatch || authorMatch || catMatch || tagsMatch;
      }

      return matchesCategory && matchesSearch;
    });

    renderGallery();
  }

  function handleCategoryClick(e) {
    const pill = e.target.closest('.filter-pill');
    if (!pill) return;

    elements.filterPills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');

    state.currentCategory = pill.dataset.category;
    applyFilters();
  }

  function handleSearchInput(e) {
    state.searchQuery = e.target.value;
    elements.clearSearchBtn.style.display = state.searchQuery ? 'block' : 'none';
    applyFilters();
  }

  function clearSearch() {
    elements.searchInput.value = '';
    state.searchQuery = '';
    elements.clearSearchBtn.style.display = 'none';
    elements.searchInput.focus();
    applyFilters();
  }

  function resetAllFilters() {
    state.currentCategory = 'all';
    state.searchQuery = '';
    elements.searchInput.value = '';
    elements.clearSearchBtn.style.display = 'none';

    elements.filterPills.forEach(pill => {
      if (pill.dataset.category === 'all') pill.classList.add('active');
      else pill.classList.remove('active');
    });

    applyFilters();
  }

  // Gallery Rendering
  function renderGallery() {
    const count = state.filteredImages.length;
    elements.itemsCountDisplay.textContent = `Showing ${count} image${count === 1 ? '' : 's'}`;

    if (count === 0) {
      elements.galleryGrid.style.display = 'none';
      elements.emptyState.style.display = 'block';
      return;
    }

    elements.emptyState.style.display = 'none';
    elements.galleryGrid.style.display = 'grid';
    elements.galleryGrid.innerHTML = '';

    const fragment = document.createDocumentFragment();

    state.filteredImages.forEach((image, index) => {
      const isFav = state.favorites.has(image.id);

      const card = document.createElement('article');
      card.className = 'gallery-card';
      card.dataset.id = image.id;
      card.dataset.index = index;
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `View image: ${image.title}`);

      card.innerHTML = `
        <div class="card-media">
          <img src="${image.thumbUrl}" alt="${escapeHtml(image.title)}" loading="lazy">
          
          <div class="card-badges">
            <span class="category-tag">${image.category}</span>
          </div>

          <button class="card-fav-btn ${isFav ? 'favorited' : ''}" 
                  data-id="${image.id}" 
                  title="${isFav ? 'Remove from favorites' : 'Add to favorites'}"
                  aria-label="Favorite image">
            <i class="fa-${isFav ? 'solid' : 'regular'} fa-heart"></i>
          </button>

          <div class="card-overlay">
            <span class="view-btn">
              <i class="fa-solid fa-magnifying-glass-plus"></i> View Image
            </span>
          </div>
        </div>

        <div class="card-info">
          <h2 class="card-title">${escapeHtml(image.title)}</h2>
          <p class="card-description">${escapeHtml(image.description)}</p>
          <div class="card-footer-meta">
            <span class="card-author"><i class="fa-solid fa-camera"></i> ${escapeHtml(image.author)}</span>
            <span class="card-tag">#${image.tags[0] || image.category}</span>
          </div>
        </div>
      `;

      card.addEventListener('click', (e) => {
        if (e.target.closest('.card-fav-btn')) return;
        openLightbox(index);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (!e.target.closest('.card-fav-btn')) {
            e.preventDefault();
            openLightbox(index);
          }
        }
      });

      const favBtn = card.querySelector('.card-fav-btn');
      favBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavorite(image.id);
      });

      fragment.appendChild(card);
    });

    elements.galleryGrid.appendChild(fragment);
  }

  // Favorites Management
  function toggleFavorite(imageId) {
    const id = Number(imageId);
    const isFav = state.favorites.has(id);
    const imgObj = state.images.find(img => img.id === id);
    const title = imgObj ? imgObj.title : 'Image';

    if (isFav) {
      state.favorites.delete(id);
      showToast(`Removed "${title}" from favorites`, 'fa-solid fa-heart-crack');
    } else {
      state.favorites.add(id);
      showToast(`Saved "${title}" to favorites!`, 'fa-solid fa-heart');
    }

    localStorage.setItem('lumina_favorites', JSON.stringify([...state.favorites]));
    updateCategoryBadges();

    if (state.currentCategory === 'favorites') {
      applyFilters();
    } else {
      const favButtons = document.querySelectorAll(`.card-fav-btn[data-id="${id}"]`);
      favButtons.forEach(btn => {
        btn.classList.toggle('favorited', !isFav);
        const icon = btn.querySelector('i');
        if (icon) icon.className = !isFav ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
      });
    }

    if (elements.lightbox.classList.contains('active')) {
      updateLightboxFavoriteState();
    }
  }

  function updateLightboxFavoriteState() {
    const currentImg = state.filteredImages[state.currentLightboxIndex];
    if (!currentImg) return;

    const isFav = state.favorites.has(currentImg.id);
    elements.lbFavoriteBtn.classList.toggle('favorited', isFav);
    const icon = elements.lbFavoriteBtn.querySelector('i');
    if (icon) icon.className = isFav ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
  }

  // Lightbox Navigation
  function openLightbox(index) {
    if (state.filteredImages.length === 0) return;
    
    state.currentLightboxIndex = index;
    state.isZoomed = false;
    elements.imageWrapper.classList.remove('zoomed');

    renderLightboxThumbnails();

    elements.lightbox.style.display = 'flex';
    void elements.lightbox.offsetWidth;
    elements.lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';

    updateLightboxContent();
  }

  function closeLightbox() {
    elements.lightbox.classList.remove('active');
    state.isZoomed = false;
    elements.imageWrapper.classList.remove('zoomed');
    document.body.style.overflow = '';

    setTimeout(() => {
      elements.lightbox.style.display = 'none';
      elements.lbMainImage.src = '';
    }, 350);
  }

  function nextImage() {
    if (state.filteredImages.length <= 1) return;
    state.currentLightboxIndex = (state.currentLightboxIndex + 1) % state.filteredImages.length;
    resetZoom();
    updateLightboxContent();
  }

  function prevImage() {
    if (state.filteredImages.length <= 1) return;
    state.currentLightboxIndex = (state.currentLightboxIndex - 1 + state.filteredImages.length) % state.filteredImages.length;
    resetZoom();
    updateLightboxContent();
  }

  function updateLightboxContent() {
    const currentImg = state.filteredImages[state.currentLightboxIndex];
    if (!currentImg) return;

    elements.lbCurrentIndex.textContent = state.currentLightboxIndex + 1;
    elements.lbTotalCount.textContent = state.filteredImages.length;

    elements.lbTitle.textContent = currentImg.title;
    elements.lbDescription.textContent = currentImg.description;
    elements.lbCategoryTag.textContent = currentImg.category;
    elements.lbAuthorName.textContent = currentImg.author;
    elements.lbDownloadBtn.href = currentImg.fullUrl;

    updateLightboxFavoriteState();

    elements.lbLoader.classList.add('active');
    elements.lbMainImage.classList.add('fade-out');
    elements.lbMainImage.classList.remove('fade-in');

    const tempImg = new Image();
    tempImg.src = currentImg.fullUrl;

    tempImg.onload = () => {
      elements.lbMainImage.src = currentImg.fullUrl;
      elements.lbMainImage.alt = currentImg.title;
      elements.lbLoader.classList.remove('active');
      elements.lbMainImage.classList.remove('fade-out');
      elements.lbMainImage.classList.add('fade-in');
    };

    tempImg.onerror = () => {
      elements.lbMainImage.src = currentImg.thumbUrl;
      elements.lbLoader.classList.remove('active');
      elements.lbMainImage.classList.remove('fade-out');
      elements.lbMainImage.classList.add('fade-in');
    };

    syncActiveThumbnail();
  }

  function renderLightboxThumbnails() {
    elements.thumbnailsTrack.innerHTML = '';
    const fragment = document.createDocumentFragment();

    state.filteredImages.forEach((img, idx) => {
      const thumb = document.createElement('div');
      thumb.className = `thumb-item ${idx === state.currentLightboxIndex ? 'active' : ''}`;
      thumb.dataset.index = idx;
      thumb.innerHTML = `<img src="${img.thumbUrl}" alt="Thumbnail ${idx + 1}">`;

      thumb.addEventListener('click', () => {
        state.currentLightboxIndex = idx;
        resetZoom();
        updateLightboxContent();
      });

      fragment.appendChild(thumb);
    });

    elements.thumbnailsTrack.appendChild(fragment);
  }

  function syncActiveThumbnail() {
    const thumbs = elements.thumbnailsTrack.querySelectorAll('.thumb-item');
    thumbs.forEach((thumb, idx) => {
      const isActive = idx === state.currentLightboxIndex;
      thumb.classList.toggle('active', isActive);

      if (isActive) {
        thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });
  }

  function toggleZoom() {
    state.isZoomed = !state.isZoomed;
    elements.imageWrapper.classList.toggle('zoomed', state.isZoomed);
    const icon = elements.lbZoomBtn.querySelector('i');
    if (icon) {
      icon.className = state.isZoomed ? 'fa-solid fa-compress' : 'fa-solid fa-expand';
    }
  }

  function resetZoom() {
    state.isZoomed = false;
    elements.imageWrapper.classList.remove('zoomed');
    const icon = elements.lbZoomBtn.querySelector('i');
    if (icon) icon.className = 'fa-solid fa-expand';
  }

  // Touch Gestures
  function handleTouchStart(e) {
    state.touchStartX = e.changedTouches[0].screenX;
  }

  function handleTouchEnd(e) {
    state.touchEndX = e.changedTouches[0].screenX;
    const threshold = 45;
    const diff = state.touchEndX - state.touchStartX;

    if (Math.abs(diff) > threshold) {
      if (diff < 0) nextImage();
      else prevImage();
    }
  }

  // Keyboard Shortcuts
  function handleKeyboardNav(e) {
    if (elements.lightbox.classList.contains('active')) {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevImage();
      } else if (e.key.toLowerCase() === 'z') {
        e.preventDefault();
        toggleZoom();
      } else if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        const currentImg = state.filteredImages[state.currentLightboxIndex];
        if (currentImg) toggleFavorite(currentImg.id);
      }
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function setupEventListeners() {
    elements.themeToggleBtn.addEventListener('click', toggleTheme);
    elements.searchInput.addEventListener('input', handleSearchInput);
    elements.clearSearchBtn.addEventListener('click', clearSearch);
    elements.categoryFilters.addEventListener('click', handleCategoryClick);
    elements.resetFiltersBtn.addEventListener('click', resetAllFilters);

    elements.lbCloseBtn.addEventListener('click', closeLightbox);
    elements.lightboxOverlay.addEventListener('click', closeLightbox);
    elements.lbNextBtn.addEventListener('click', nextImage);
    elements.lbPrevBtn.addEventListener('click', prevImage);
    elements.lbZoomBtn.addEventListener('click', toggleZoom);
    elements.imageWrapper.addEventListener('click', (e) => {
      if (e.target === elements.lbMainImage) toggleZoom();
    });

    elements.lbFavoriteBtn.addEventListener('click', () => {
      const currentImg = state.filteredImages[state.currentLightboxIndex];
      if (currentImg) toggleFavorite(currentImg.id);
    });

    elements.lightboxStage.addEventListener('touchstart', handleTouchStart, { passive: true });
    elements.lightboxStage.addEventListener('touchend', handleTouchEnd, { passive: true });

    window.addEventListener('keydown', handleKeyboardNav);
  }

  function init() {
    initTheme();
    updateCategoryBadges();
    applyFilters();
    setupEventListeners();
  }

  init();
});