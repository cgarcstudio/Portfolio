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

    // 2. Fetch Portfolio Data and Render dynamic content
    const projectGrid = document.getElementById('projects-grid');
    
    if (projectGrid) {
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

                projectGrid.innerHTML = filteredProjects.map(project => createCard(project)).join('');
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }
});
