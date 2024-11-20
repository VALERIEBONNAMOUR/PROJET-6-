const apiUrl = 'http://localhost:5678/api/works';
const gallery = document.getElementById('project-gallery');

async function fetchProjects() {
    const response = await fetch(apiUrl)
    const data = await response.json()
    return data
}

async function displayProjects() {
    const projects = await fetchProjects()
    gallery.innerHTML = '';
    projects.forEach(project => {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        img.src = project.imageUrl;
        img.alt = project.title;
        const figcaption = document.createElement('figcaption');
        figcaption.textContent = project.title;
        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    });
    
}
document.addEventListener('DOMContentLoaded', displayProjects());

