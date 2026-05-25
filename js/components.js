// Function to generate a project card
function createCard(project) {
    const glowClass = project.category === 'gameart' ? 'game-art-card' : 'arch-viz-card';
    
    return `
        <div class="card ${glowClass}">
            <div class="card-image" style="background-image: url('${project.image}'); height: 200px; background-size: cover; border-radius: 8px 8px 0 0;"></div>
            <div class="card-info" style="padding: 15px;">
                <h3 style="margin-bottom: 8px;">${project.title}</h3>
                <p style="color: #5c6470; font-size: 0.9rem;">${project.description}</p>
            </div>
        </div>
    `;
}
