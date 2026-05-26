document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. SCROLL TO TOP LOGIC (رویداد امن‌تر و بدون تداخل با استفاده از addEventListener)
    // ==========================================================================
    const scrollBtn = document.getElementById("scrollTopBtn");
    if (scrollBtn) {
        window.addEventListener('scroll', () => {
            // محاسبه دقیق میزان اسکرول در تمامی مرورگرها
            if (window.scrollY > 300 || document.documentElement.scrollTop > 300 || document.body.scrollTop > 300) {
                scrollBtn.classList.add("show");
                scrollBtn.classList.add("visible"); // سازگاری کامل با کلاس استایل شما
            } else {
                scrollBtn.classList.remove("show");
                scrollBtn.classList.remove("visible");
            }
        });

        scrollBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ==========================================================================
    // 2. FETCH DATA & ROUTING
    // ==========================================================================
    const projectGrid = document.getElementById('projects-grid');
    const isProductPage = document.body.classList.contains('dynamic-product-page');

    fetch('data/portfolio.json')
        .then(response => response.json())
        .then(data => {
            
            // الف: اگر در صفحه گرید (Game/Arch) بودیم، کارت‌ها را رندر کن
            if (projectGrid) {
                const isGamePage = document.body.classList.contains('game-page');
                const targetCategory = isGamePage ? 'gameart' : 'archviz';
                const filteredProjects = data.projects.filter(p => p.category === targetCategory);
                
                if (filteredProjects.length === 0) {
                    projectGrid.innerHTML = `<p style="color: #5c6470;">No projects added yet.</p>`;
                } else {
                    projectGrid.innerHTML = filteredProjects.map(project => createCard(project)).join('');
                }
            }

            // ب: اگر در صفحه قالب محصول (product.html) بودیم، اطلاعات تفصیلی را لود کن
            if (isProductPage) {
                const urlParams = new URLSearchParams(window.location.search);
                const projectId = urlParams.get('id');
                const project = data.projects.find(p => p.id === projectId);

                if (project && project.details) {
                    const details = project.details;

                    // پر کردن متون اصلی صفحه
                    document.title = `${project.title} - CGArc Studio`;
                    document.getElementById('dynamicTitle').textContent = details.page_title;
                    document.getElementById('dynamicSubtitle').textContent = details.page_subtitle;
                    
                    // مدیریت لینک و متن داینامیک دکمه خرید
                    const buyBtn = document.getElementById('dynamicBuyLink');
                    if (buyBtn) {
                        buyBtn.href = details.buy_link;
                        buyBtn.innerHTML = `
                            <svg viewBox="0 0 24 24"><path d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-9.83-3.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4l-3.86 7H8.53L4.27 2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1 1 2 2.1 2h13.9v-2H7.42c-.13 0-.25-.11-.25-.25z"/></svg>
                            ${details.button_text ? details.button_text : "PURCHASE ASSET"}
                        `;
                    }
                    
                    // مدیریت دکمه بازگشت هوشمند بر اساس دسته بندی
                    const backBtn = document.getElementById('dynamicBackBtn');
                    if (backBtn && project.category === 'archviz') {
                        backBtn.href = 'arch.html';
                    }

                    // لود ویدیو (اگر وجود داشت، وگرنه باکس ویدیو پنهان می‌شود)
                    const videoFrame = document.getElementById('dynamicVideo');
                    if (details.video_link) {
                        if (videoFrame) videoFrame.src = details.video_link;
                    } else {
                        const videoWrapper = document.getElementById('videoWrapper');
                        if (videoWrapper) videoWrapper.style.display = 'none';
                    }

                    // پر کردن لیست ویژگی‌ها (Features)
                    const featuresList = document.getElementById('dynamicFeatures');
                    if (details.features && details.features.length > 0) {
                        if (featuresList) featuresList.innerHTML = details.features.map(f => `<li>${f}</li>`).join('');
                    } else {
                        const featuresBlock = document.getElementById('featuresBlock');
                        if (featuresBlock) featuresBlock.style.display = 'none';
                    }

                    // پر کردن لیست مشخصات فنی (Specifications)
                    const specsList = document.getElementById('dynamicSpecs');
                    if (details.specifications && details.specifications.length > 0) {
                        if (specsList) specsList.innerHTML = details.specifications.map(s => `<li>${s}</li>`).join('');
                    } else {
                        const specsBlock = document.getElementById('specsBlock');
                        if (specsBlock) specsBlock.style.display = 'none';
                    }

                    // پر کردن باکس توضیحات کلی (Overview)
                    const overviewBox = document.getElementById('dynamicOverview');
                    if (overviewBox) {
                        let overviewHTML = '';
                        details.overview.forEach(sec => {
                            if (sec.type === 'paragraph') {
                                overviewHTML += `<p>${sec.content}</p>`;
                            } else if (sec.type === 'warning') {
                                overviewHTML += `<p class="warning-text">${sec.content}</p>`;
                            } else if (sec.type === 'heading') {
                                overviewHTML += `<h5>${sec.content}</h5>`;
                            }
                        });
                        overviewBox.innerHTML = overviewHTML;
                    }

                    // ساخت داینامیک گالری رندرها و ریزعکس‌ها
                    const thumbContainer = document.getElementById('thumbContainer');
                    const currentRender = document.getElementById('currentRender');
                    
                    if (details.gallery && details.gallery.length > 0) {
                        if (currentRender) currentRender.src = details.gallery[0];
                        if (thumbContainer) {
                            thumbContainer.innerHTML = details.gallery.map((imgUrl, idx) => `
                                <div class="thumb-item ${idx === 0 ? 'active' : ''}">
                                    <img src="${imgUrl}" alt="Render ${idx + 1}">
                                </div>
                            `).join('');
                        }
                        
                        // فعال سازی موتور اسلایدر و لایت باکس پس از رندر تصاویر
                        initProductSlider(details.gallery);
                    }

                } else {
                    const dynamicTitle = document.getElementById('dynamicTitle');
                    if (dynamicTitle) dynamicTitle.textContent = "Project Not Found";
                }
            }

            // ج: پر کردن مودال درباره ما (About Us) در صفحات گرید
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
        .catch(error => console.error('Error fetching data:', error));

    // ==========================================================================
    // 3. ABOUT US MODAL INTERACTION
    // ==========================================================================
    const aboutMenuBtn = document.getElementById("aboutMenuBtn");
    const aboutModal = document.getElementById("aboutModal");
    const closeModal = document.getElementById("closeModal");

    if (aboutMenuBtn && aboutModal && closeModal) {
        aboutMenuBtn.addEventListener("click", (e) => { e.preventDefault(); aboutModal.classList.add("active"); });
        closeModal.addEventListener("click", () => { aboutModal.classList.remove('active'); });
        aboutModal.addEventListener("click", (e) => { if (e.target === aboutModal) aboutModal.classList.remove('active'); });
    }
});

// ==========================================================================
// 4. LIGHTBOX & SLIDER ENGINE FOR PRODUCT PAGE
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

    currentRender.addEventListener('click', () => {
        if (lightboxImg) {
            lightboxImg.src = currentRender.src;
            if (lightbox) lightbox.classList.add('active');
        }
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => lightbox.classList.remove('active'));
    }
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) lightbox.classList.remove('active');
        });
    }

    // جلوگیری از راست کلیک برای امنیت تصاویر
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('contextmenu', e => e.preventDefault());
    });
    if (lightbox) lightbox.addEventListener('contextmenu', e => e.preventDefault());
}
