document.addEventListener('DOMContentLoaded', () => {
    // Fetch data from JSON
    fetch('data/portfolio.json')
        .then(response => response.json())
        .then(data => {
            console.log("Website Data Loaded:", data.profile.name);
            // Here we can inject data into project pages later
        })
        .catch(error => console.error('Error loading JSON:', error));

    // Hamburger Menu Blur Effect
    const navToggle = document.getElementById('navToggle');
    const mainWrapper = document.getElementById('mainWrapper');

    if(navToggle && mainWrapper) {
        navToggle.addEventListener('mouseenter', () => {
            mainWrapper.style.filter = 'blur(12px)';
        });
        navToggle.addEventListener('mouseleave', () => {
            mainWrapper.style.filter = 'none';
        });
    }
});
