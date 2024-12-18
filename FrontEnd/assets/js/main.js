const apiUrl = 'http://localhost:5678/api/works';
const gallery = document.getElementById('project-gallery');
const openModal = document.getElementById('modal');


async function fetchProjects() {
    const response = await fetch(apiUrl)
    const data = await response.json()
    return data
}

async function displayProjects(projects = null) {
    if (projects == null) {
        projects = await fetchProjects()
    }
 

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


async function getCategories() {
    try {
        const response = await fetch('http://localhost:5678/api/categories');
        if (response.ok) {
            const categories = await response.json();
            return categories
        }
        throw new Error("erreur dans lee fetch")
    } catch (erreur) {
        return erreur
    }
}

async function createFilters() {
    try {
        const projects = await fetchProjects()
        const categories = await getCategories()
        const filtreContainer = document.getElementById('filtre-container');
        const divall = document.createElement("div")
        divall.classList.add('espacefiltre');
        const btn = document.createElement("a");
        btn.classList.add("selected")
        btn.href = "#";
        btn.classList.add('filtre-link');
        btn.textContent = "tous";
        btn.addEventListener("click", () => { filterByCategory("tous", projects) })
        divall.appendChild(btn);
        filtreContainer.appendChild(divall);
        categories.forEach(category => {
            const div = document.createElement('div');
            div.classList.add('espacefiltre');

            const a = document.createElement('a');
            a.href = `#${category.id}`;
            a.classList.add('filtre-link');
            a.textContent = category.name;
            a.addEventListener('click', () => {
                filterByCategory(category.id, projects)
            })

            a.addEventListener('click', (event) => {
                event.preventDefault();
                const allFilters = document.querySelectorAll('.filtre-link');
                allFilters.forEach(link => link.classList.remove('selected'));
                a.classList.add('selected');
            });

            div.appendChild(a);
            filtreContainer.appendChild(div);
        });

    } catch (error) {
        console.error('Erreur de réseau:', error);
    }
}


function filterByCategory(categoryId, projects) {
    if (categoryId === "tous") {
        return projects;
    }
    displayProjects(projects.filter(item => item.categoryId === categoryId));
}

function init() {
    createFilters();
    displayProjects();
}


function openModal() {
    modal.style.display = 'block'; 
    modal.setAttribute('aria-hidden', 'false');
    fetchProjects().then(projects => {
        displayProjects(projects); 
    });
}


function closeModal() {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
}



document.addEventListener('DOMContentLoaded', init());
