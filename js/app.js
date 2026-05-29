document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. SCROLL TO TOP LOGIC
    // ==========================================================================
    const scrollBtn = document.getElementById("scrollTopBtn");
    if (scrollBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300 || document.documentElement.scrollTop > 300) {
                scrollBtn.classList.add("show");
            } else {
                scrollBtn.classList.remove("show");
            }
        });
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ==========================================================================
    // 2. FETCH DATA & ROUTING ENGINE (ALL PAGES)
    // ==========================================================================
    const projectGrid = document.getElementById('projects-grid');
    const categoryGrid = document.getElementById('category-projects-grid');
    const isProductPage = document.body.classList.contains('dynamic-product-page');
    const isCategoryPage = document.body.classList.contains('category-page');

    fetch('data/portfolio.json')
        .then(response => response.json())
        .then(data => {
            
            // الف: رندر صفحات اصلی گرید
            if (projectGrid) {
                const isGamePage = document.body.classList.contains('game-page');
                const targetCategory = isGamePage ? 'gameart' : 'archviz';
                const filteredProjects = data.projects.filter(p => p.category === targetCategory);
                
                if (filteredProjects.length === 0) {
                    projectGrid.innerHTML = `<p style="color: #5c6470;">No projects added yet.</p>`;
                } else {
                    projectGrid.innerHTML = filteredProjects.map(project => `
                        <a href="${project.url}" class="card-link">
                            <div class="card">
                                <div class="card-img-holder">
                                    <img src="${project.image}" alt="${project.title}">
                                </div>
                                <div class="card-info">
                                    <span class="card-title">${project.title}</span>
                                    <span class="card-category">${project.type}</span>
                                </div>
                            </div>
                        </a>
                    `).join('');
                }
            }

            // ب: صفحه کتگوری معماری و اتصال به مودال شیشه‌ای
            if (isCategoryPage && categoryGrid) {
                const urlParams = new URLSearchParams(window.location.search);
                const catId = urlParams.get('id'); 
                
                const categoryTitleEl = document.getElementById('categoryTitle');
                if (categoryTitleEl) categoryTitleEl.textContent = catId;
                document.title = `${catId ? catId.toUpperCase() : 'Category'} - CGArc Studio`;

                const filteredProducts = data.projects.filter(p => p.category === catId);
                
                if (filteredProducts.length === 0) {
                    categoryGrid.innerHTML = `<p style="color: #5c6470; text-align:center; width:100%; grid-column:1/-1;">No assets listed in this category yet.</p>`;
                } else {
                    categoryGrid.innerHTML = filteredProducts.map(p => `
                        <div class="card-link qv-trigger" data-id="${p.id}" style="cursor: pointer;">
                            <div class="card">
                                <div class="card-img-holder">
                                    <img src="${p.image}" alt="${p.title}">
                                </div>
                                <div class="card-info">
                                    <span class="card-title">${p.title}</span>
                                    <span class="card-category">${p.type}</span>
                                </div>
                            </div>
                        </div>
                    `).join('');

                    document.querySelectorAll('.qv-trigger').forEach(card => {
                        card.addEventListener('click', () => {
                            const prodId = card.getAttribute('data-id');
                            const product = filteredProducts.find(p => p.id === prodId);
                            openQuickViewModal(product);
                        });
                    });
                }
            }

            // ج: صفحه محصول گیم
            if (isProductPage) {
                const urlParams = new URLSearchParams(window.location.search);
                const projectId = urlParams.get('id');
                const project = data.projects.find(p => p.id === projectId);

                if (project && project.details) {
                    const details = project.details;
                    document.title = `${project.title} - CGArc Studio`;
                    document.getElementById('dynamicTitle').textContent = details.page_title;
                    document.getElementById('dynamicSubtitle').textContent = details.page_subtitle;
                    
                    const buyBtn = document.getElementById('dynamicBuyLink');
                    if (buyBtn) {
                        buyBtn.href = details.buy_link;
                        buyBtn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-9.83-3.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4l-3.86 7H8.53L4.27 2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1 1 2 2.1 2h13.9v-2H7.42c-.13 0-.25-.11-.25-.25z"/></svg>${details.button_text || "PURCHASE ASSET"}`;
                    }
                    
                    const backBtn = document.getElementById('dynamicBackBtn');
                    if (backBtn && project.category === 'archviz') backBtn.href = 'arch.html';

                    const videoFrame = document.getElementById('dynamicVideo');
                    if (details.video_link) { if (videoFrame) videoFrame.src = details.video_link; }
                    else { const wrapper = document.getElementById('videoWrapper'); if (wrapper) wrapper.style.display = 'none'; }

                    const featuresList = document.getElementById('dynamicFeatures');
                    if (details.features && details.features.length > 0) { if (featuresList) featuresList.innerHTML = details.features.map(f => `<li>${f}</li>`).join(''); }
                    else { const block = document.getElementById('featuresBlock'); if (block) block.style.display = 'none'; }

                    const specsList = document.getElementById('dynamicSpecs');
                    if (details.specifications && details.specifications.length > 0) { if (specsList) specsList.innerHTML = details.specifications.map(s => `<li>${s}</li>`).join(''); }
                    else { const block = document.getElementById('specsBlock'); if (block) block.style.display = 'none'; }

                    const overviewBox = document.getElementById('dynamicOverview');
                    if (overviewBox) {
                        let overviewHTML = '';
                        details.overview.forEach(sec => {
                            if (sec.type === 'paragraph') overviewHTML += `<p>${sec.content}</p>`;
                            else if (sec.type === 'warning') overviewHTML += `<p class="warning-text">${sec.content}</p>`;
                            else if (sec.type === 'heading') overviewHTML += `<h5>${sec.content}</h5>`;
                        });
                        overviewBox.innerHTML = overviewHTML;
                    }

                    const thumbContainer = document.getElementById('thumbContainer');
                    const currentRender = document.getElementById('currentRender');
                    if (details.gallery && details.gallery.length > 0) {
                        if (currentRender) currentRender.src = details.gallery[0];
                        if (thumbContainer) {
                            thumbContainer.innerHTML = details.gallery.map((imgUrl, idx) => `
                                <div class="thumb-item ${idx === 0 ? 'active' : ''}"><img src="${imgUrl}" alt="Render"></div>
                            `).join('');
                        }
                        initProductSlider(details.gallery);
                    }
                }
            }

            // د: تنظیم مودال درباره ما
            const modalTitle = document.getElementById('modalTitle');
            const modalContent = document.getElementById('modalContent');
            if (modalTitle && modalContent && data.profile) {
                modalTitle.textContent = data.profile.about_title;
                let contentHTML = `<p class="modal-subtitle">${data.profile.about_subtitle}</p>`;
                if (data.profile.about_sections) {
                    data.profile.about_sections.forEach(sec => {
                        if (sec.type === "paragraph") contentHTML += `<p>${sec.content}</p>`;
                        else if (sec.type === "heading") contentHTML += `<h4>${sec.content}</h4>`;
                        else if (sec.type === "quote") contentHTML += `<p class="modal-quote">${sec.content}</p>`;
                    });
                }
                modalContent.innerHTML = contentHTML;
            }
        })
        .catch(error => console.error('Error loading data:', error));

    // ==========================================================================
    // 3. MENUS & MODALS INTERACTION 
    // ==========================================================================
    const aboutMenuBtn = document.getElementById("aboutMenuBtn");
    const aboutModal = document.getElementById("aboutModal");
    const closeModal = document.getElementById("closeModal");

    if (aboutMenuBtn && aboutModal && closeModal) {
        aboutMenuBtn.addEventListener("click", (e) => { e.preventDefault(); aboutModal.classList.add("active"); });
        closeModal.addEventListener("click", () => { aboutModal.classList.remove('active'); });
        aboutModal.addEventListener("click", (e) => { if (e.target === aboutModal) aboutModal.classList.remove('active'); });
    }

    const contactMenuBtn = document.getElementById("contactMenuBtn");
    const contactModal = document.getElementById("contactModal");
    const closeContactModal = document.getElementById("closeContactModal");

    if (contactMenuBtn && contactModal && closeContactModal) {
        contactMenuBtn.addEventListener("click", (e) => { e.preventDefault(); contactModal.classList.add("active"); });
        closeContactModal.addEventListener("click", () => { contactModal.classList.remove('active'); });
        contactModal.addEventListener("click", (e) => { if (e.target === contactModal) contactModal.classList.remove('active'); });
    }

    const storesMenuBtn = document.getElementById("storesMenuBtn");
    const storesModal = document.getElementById("storesModal");
    const closeStoresModal = document.getElementById("closeStoresModal");

    if (storesMenuBtn && storesModal && closeStoresModal) {
        storesMenuBtn.addEventListener("click", (e) => { e.preventDefault(); storesModal.classList.add("active"); });
        closeStoresModal.addEventListener("click", () => { storesModal.classList.remove('active'); });
        storesModal.addEventListener("click", (e) => { if (e.target === storesModal) storesModal.classList.remove('active'); });
    }

    // کنترل دکمه همبرگری موبایل (حل مشکل کلیک)
    const menuToggleBtn = document.getElementById("menuToggleBtn");
    const mainNav = document.getElementById("mainNav");
    if (menuToggleBtn && mainNav) {
        menuToggleBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            mainNav.classList.toggle("active-mobile");
        });
        document.addEventListener("click", (e) => {
            if (!mainNav.contains(e.target)) {
                mainNav.classList.remove("active-mobile");
            }
        });
    }

    // ==========================================================================
    // 3.5. QUICK VIEW MODAL CLOSING LOGIC
    // ==========================================================================
    const qvModal = document.getElementById('quickViewModal');
    const closeQVBtn = document.getElementById('closeQuickView');
    if (qvModal && closeQVBtn) {
        closeQVBtn.addEventListener('click', () => qvModal.classList.remove('active'));
        qvModal.addEventListener('click', (e) => { if (e.target === qvModal) qvModal.classList.remove('active'); });
    }
});

// ==========================================================================
// 4. QUICK VIEW ENGINE (ARCHVIZ PRODUCTS)
// ==========================================================================
let currentQvIndex = 0; 
let currentQvGallery = []; 

function openQuickViewModal(product) {
    const modal = document.getElementById('quickViewModal');
    if (!product || !modal) return;

    const details = product.details || {};
    currentQvGallery = details.gallery || [];
    currentQvIndex = 0;
    
    document.getElementById('qvTitle').textContent = details.page_title || product.title;
    document.getElementById('qvSubtitle').textContent = details.page_subtitle || '';
    document.getElementById('qvBuyBtn').href = details.buy_link || '#';
    document.getElementById('qvDescription').innerHTML = `<p>${details.description || 'No description provided.'}</p>`;

    const mainImg = document.getElementById('qvMainImage');
    const thumbContainer = document.getElementById('qvThumbContainer');
    
    if (currentQvGallery.length > 0) {
        mainImg.src = currentQvGallery[0];
        if (thumbContainer) {
            thumbContainer.innerHTML = currentQvGallery.map((imgUrl, idx) => `
                <div class="qv-thumb ${idx === 0 ? 'active' : ''}" data-index="${idx}">
                    <img src="${imgUrl}" alt="Thumbnail">
                </div>
            `).join('');

            const thumbs = thumbContainer.querySelectorAll('.qv-thumb');
            thumbs.forEach(thumb => {
                thumb.addEventListener('click', () => {
                    updateQvGallery(parseInt(thumb.getAttribute('data-index')));
                });
            });
        }
    } else {
        mainImg.src = product.image;
        if (thumbContainer) thumbContainer.innerHTML = '';
    }

    modal.classList.add('active');
    modal.querySelectorAll('img').forEach(img => img.addEventListener('contextmenu', e => e.preventDefault()));
}

function updateQvGallery(index) {
    if (currentQvGallery.length === 0) return;
    const mainImg = document.getElementById('qvMainImage');
    const thumbContainer = document.getElementById('qvThumbContainer');
    
    currentQvIndex = index;
    mainImg.src = currentQvGallery[currentQvIndex];
    
    if (thumbContainer) {
        const activeThumb = thumbContainer.querySelector('.qv-thumb.active');
        if (activeThumb) activeThumb.classList.remove('active');
        const nextThumb = thumbContainer.querySelector(`.qv-thumb[data-index="${currentQvIndex}"]`);
        if (nextThumb) nextThumb.classList.add('active');
        
        if(nextThumb) nextThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
}

// اتصال فلش‌ها و Swipe (ورق زدن لمسی) در موبایل
document.addEventListener('DOMContentLoaded', () => {
    const qvPrevBtn = document.getElementById('qvPrevBtn');
    const qvNextBtn = document.getElementById('qvNextBtn');
    const qvMainImg = document.getElementById('qvMainImage');
    
    if (qvPrevBtn) {
        qvPrevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            let prevIndex = (currentQvIndex - 1) < 0 ? currentQvGallery.length - 1 : currentQvIndex - 1;
            updateQvGallery(prevIndex);
        });
    }
    
    if (qvNextBtn) {
        qvNextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            let nextIndex = (currentQvIndex + 1) >= currentQvGallery.length ? 0 : currentQvIndex + 1;
            updateQvGallery(nextIndex);
        });
    }

    // 📱 تشخیص کشیدن انگشت در موبایل (Swipe)
    let touchStartX = 0;
    let touchEndX = 0;
    if (qvMainImg) {
        qvMainImg.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, {passive: true});

        qvMainImg.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            if (touchStartX - touchEndX > 40) { // کشیدن به چپ (عکس بعدی)
                let nextIndex = (currentQvIndex + 1) >= currentQvGallery.length ? 0 : currentQvIndex + 1;
                updateQvGallery(nextIndex);
            }
            if (touchEndX - touchStartX > 40) { // کشیدن به راست (عکس قبلی)
                let prevIndex = (currentQvIndex - 1) < 0 ? currentQvGallery.length - 1 : currentQvIndex - 1;
                updateQvGallery(prevIndex);
            }
        }, {passive: true});
    }
});

// ==========================================================================
// 5. LIGHTBOX & SLIDER ENGINE FOR PRODUCT PAGE
// ==========================================================================
function initProductSlider(galleryArray) {
    const thumbItems = document.querySelectorAll('.thumb-item');
    const currentRender = document.getElementById('currentRender');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    let currentIndex = 0;

    if (!currentRender || thumbItems.length === 0) return;

    function updateSlider(index) {
        const activeThumb = document.querySelector('.thumb-item.active');
        if (activeThumb) activeThumb.classList.remove('active');
        thumbItems[index].classList.add('active');
        currentRender.src = galleryArray[index];
        currentIndex = index;
    }

    thumbItems.forEach((thumb, index) => {
        thumb.addEventListener('click', () => updateSlider(index));
    });

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            let nextIndex = (currentIndex + 1) >= galleryArray.length ? 0 : currentIndex + 1;
            updateSlider(nextIndex);
        });
    }
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            let prevIndex = (currentIndex - 1) < 0 ? galleryArray.length - 1 : currentIndex - 1;
            updateSlider(prevIndex);
        });
    }
    if (currentRender) {
        currentRender.addEventListener('click', () => {
            if (lightboxImg) { lightboxImg.src = currentRender.src; if (lightbox) lightbox.classList.add('active'); }
        });
    }
    if (lightboxClose) lightboxClose.addEventListener('click', () => lightbox.classList.remove('active'));
    if (lightbox) lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('active'); });
}
