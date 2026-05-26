document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Scroll to top button logic
    const scrollBtn = document.getElementById("scrollTopBtn");
    if (scrollBtn) {
        window.onscroll = function() {
            if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
                scrollBtn.classList.add("show");
            } else {
                scrollBtn.classList.remove("show");
            }
        };
        scrollBtn.onclick = function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
    }

    // 2. Fetch Portfolio Data
    const projectGrid = document.getElementById('projects-grid');
    const isGamePage = document.body.classList.contains('game-page');
    const targetCategory = isGamePage ? 'gameart' : 'archviz';

    fetch('data/portfolio.json')
        .then(response => response.json())
        .then(data => {
            
            // پر کردن کارت‌های محصولات
            if (projectGrid) {
                const filteredProjects = data.projects.filter(p => p.category === targetCategory);
                if (filteredProjects.length === 0) {
                    projectGrid.innerHTML = `<p style="color: #5c6470;">No projects added yet.</p>`;
                } else {
                    projectGrid.innerHTML = filteredProjects.map(project => createCard(project)).join('');
                }
            }

            // پر کردن داینامیک محتوای About Us از JSON
            const modalTitle = document.getElementById('modalTitle');
            const modalContent = document.getElementById('modalContent');
            
            if (modalTitle && modalContent && data.profile) {
                modalTitle.textContent = data.profile.about_title;
                
                let contentHTML = `<p class="modal-subtitle">${data.profile.about_subtitle}</p>`;
                data.profile.about_paragraphs.forEach(paragraph => {
                    contentHTML += `<p>${paragraph}</p>`;
                });
                
                modalContent.innerHTML = contentHTML;
            }
        })
        .catch(error => console.error('Error fetching data:', error));

    // 3. About Us Modal Interaction
    const aboutMenuBtn = document.getElementById("aboutMenuBtn");
    const aboutModal = document.getElementById("aboutModal");
    const closeModal = document.getElementById("closeModal");

    if(aboutMenuBtn && aboutModal && closeModal) {
        aboutMenuBtn.addEventListener("click", (e) => {
            e.preventDefault();
            aboutModal.classList.add("active");
        });

        closeModal.addEventListener("click", () => {
            aboutModal.classList.remove('active');
        });

        aboutModal.addEventListener("click", (e) => {
            if (e.target === aboutModal) {
                aboutModal.classList.remove('active');
            }
        });
    }
});
