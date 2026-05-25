// Component: Generates Project Card HTML dynamically
function createCard(project) {
    const isGameArt = project.category === 'gameart';
    const glowClass = isGameArt ? 'game-art-card' : 'arch-viz-card';
    
    return `
        <a href="${project.link}?id=${project.id}" class="card ${glowClass}">
            <div class="card-image" style="background-image: url('${project.image}');"></div>
            <div class="card-info">
                <h3 style="font-size: 1.2rem; color: #ffffff;">${project.title}</h3>
                <div class="card-details">
                    <p style="color: #5c6470; font-size: 0.9rem; line-height: 1.4;">${project.description}</p>
                </div>
            </div>
        </a>
    `;
}
