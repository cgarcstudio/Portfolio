document.addEventListener('DOMContentLoaded', () => {
    const mainWrapper = document.getElementById('mainWrapper');
    const navToggle = document.getElementById('navToggle');

    // 1. Hamburger Menu Blur Interaction
    if (navToggle && mainWrapper) {
        navToggle.addEventListener('mouseenter', () => {
            mainWrapper.style.filter = 'blur(12px)';
        });
        navToggle.addEventListener('mouseleave', () => {
            mainWrapper.style.filter = 'none';
        });
    }

    // 2. Fetch Portfolio Data and Render dynamic content
    const projectGrid = document.getElementById('projectGrid');
    if (projectGrid) {
        // Determine page category context based on body class or URL
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

                // Inject cards into the container
                projectGrid.innerHTML = filteredProjects.map(project => createCard(project)).join('');
            })
            .catch(error => console.error('Error fetching data:', error));
    }
});
