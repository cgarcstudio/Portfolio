// Component: Generates Project Card HTML dynamically
function createCard(project) {
    const isGameArt = project.category === 'gameart';
    const glowClass = isGameArt ? 'game-art-card' : 'arch-viz-card';
    
    return `
        <a href="${project.url}" class="card card-link ${glowClass}">
            <div class="card-img-holder">
                <img src="${project.image}" alt="${project.title}">
            </div>
            <div class="card-info">
                <span class="card-title">${project.title}</span>
                <span class="card-category">${project.type}</span>
            </div>
        </a>
    `;
}
