// Component: Generates Project Card HTML dynamically
function createCard(project) {
    return `
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
    `;
}
