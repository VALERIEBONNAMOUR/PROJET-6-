const apiUrl = 'http://localhost:5678/api/';
const gallery = document.getElementById('project-gallery');
const filtreContainer = document.getElementById('filtre-container');
let works = []

// la fonction fetchProjects permet d'envoyer une requête HTTP vers l'URL de l'API.
// response.json() permet de traiter la réponse de l'API qui est en JSON et de la convertir en un objet JavaScript.
// les données JSON sont stockées dans la variable works.

async function fetchProjects() {
    const response = await fetch(apiUrl + "works")
    const data = await response.json()
    works = data
    return data
}

// la fonction displayProjects affiche les projets dans la galerie principale 
// (pour chaque projet elle va créer un élément figure qui contiendra une image et une légende)

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

// la fonction getCategories tente de récupérer une liste de catégories depuis l'API.
// Elle envoie une requête HTTP GET pour récupérer les catégories, Si la requête réussit, 
// elle récupère les données JSON de la réponse et les renvoie.
// Si la requête échoue ou si un autre problème se produit, elle renvoie l'erreur pour pouvoir la traiter.

async function getCategories() {
    try {
        const response = await fetch(apiUrl + 'categories');
        if (response.ok) {
            const categories = await response.json();
            return categories
        }
        throw new Error("erreur dans le fetch")
    } catch (erreur) {
        return erreur
    }
}

// la fonction createFilters a pour but de créer et afficher des filtres interactifs 
// pour filtrer des projets par catégorie. 

async function createFilters() {
    try {
        const projects = await fetchProjects()
        const categories = await getCategories()
        // création du filtre tous
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
        // création des filtres pour chaques catégories
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

// la fonction filterByCategory permet de filtrer les projets par catégorie
function filterByCategory(categoryId, projects) {
    if (categoryId === "tous") {
        displayProjects(projects);
    }
    else{
   // projects.filter(...) est utilisé pour créer un nouveau tableau contenant 
    // uniquement les projets qui ont une categoryId
    displayProjects(projects.filter(item => item.categoryId === categoryId));
    }
 
}

// la fonction init() initialise diverses actions (gérer des images, avec des modales, 
// des filtres, des événements sur des formulaires)
async function init() {

    // Création des filtres
    if (filtreContainer) {
        await createFilters();
    }
    // affichage des projets dans la modale
    await displayProjects();
}


document.addEventListener('DOMContentLoaded', init);