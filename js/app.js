document.addEventListener('DOMContentLoaded', () => {
    const mainWrapper = document.getElementById('main-content-wrapper') || document.getElementById('mainWrapper');
    const navToggle = document.getElementById('menu-trigger') || document.getElementById('navToggle');

    // 1. Hamburger Menu Blur Interaction
    if (navToggle && mainWrapper) {
        navToggle.addEventListener('mouseenter', () => mainWrapper.classList.add('menu-active'));
        navToggle.addEventListener('mouseleave', () => mainWrapper.classList.remove('menu-active'));
    }

    // 2. Scroll to top button logic
    const scrollBtn = document.getElementById("scrollTopBtn");
    if (scrollBtn) {
        window.onscroll = function() {
            if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
                scrollBtn.classList.add("visible");
            } else {
                scrollBtn.classList.remove("visible");
            }
        };
        scrollBtn.onclick = function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
    }

    // 3. Fetch Portfolio Data and Render dynamic content
    const projectGrid = document.getElementById('projects-grid') || document.getElementById('projectGrid');
    
    if (projectGrid) {
        // تشخیص می‌دهیم که الان توی کدوم صفحه هستیم
        const isGamePage = document.body.classList.contains('game-page');
        const targetCategory = isGamePage ? 'gameart' : 'archviz';

        fetch('data/portfolio.json')
            .then(response => response.json())
            .then(data => {
                const filteredProjects = data.projects.filter(p => p.category === targetCategory);
                
                if (filteredProjects.length === 0) {
                    projectGrid.innerHTML = `<p style="color: #5c6470;">No projects added yet.</p>`;
                    return;
                }

                // تزریق کارت‌ها به داخل صفحه
                projectGrid.innerHTML = filteredProjects.map(project => createCard(project)).join('');
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }
});
