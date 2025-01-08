const apiUrl = 'http://localhost:5678/api/works';
const gallery = document.getElementById('project-gallery');
const modalDelete = document.getElementById('modal1');
const modalGallery = document.querySelector('#modal-project-gallery');
let works = []
const filtreContainer = document.getElementById('filtre-container');
const modalAdd = document.querySelector('#modal2')
const form = document.getElementById('form-modal2')
const submitter = document.querySelector("input[value=submit]")


form.addEventListener("submit",function(event){
    event.preventDefault();
    const formData = new FormData(form, submitter);
    newImage(formData, updateGallery);
})

async function newImage(formData, element) {
    try {
        const response = await fetch(`http://localhost:5678/api/works/${imageId}`, {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            element()
        } else {
            console.error('Erreur lors de l\'ajout de l\'image');
            console.log(response)
        }
    } catch (error) {
        console.error('Erreur de réseau:', error);
    }
}


document.querySelector('#modal1-btn').addEventListener('click', () => {
    closeModal(modalDelete)
    openModal(modalAdd)
})

modalDelete.addEventListener('click', (e) => {
    console.log(e.target.getAttribute('id'));

    if (e.target.getAttribute('id') === 'modal1') {
        closeModal(modalDelete)
    }
})

async function fetchProjects() {
    const response = await fetch(apiUrl)
    const data = await response.json()
    works = data
    return data
}


async function displayProjetModal() {
    modalGallery.innerHTML = '';

    works.forEach(work => {
        const div = document.createElement('div')
        div.classList.add("work-container")
        modalGallery.appendChild(div)
        const icone = document.createElement('i')
        icone.classList.add("fa-solid", "fa-trash-can")
        icone.addEventListener('click', () => {
            deleteImage(work.id, div)
        })
        div.appendChild(icone)
        const image = document.createElement('img')
        image.src = work.imageUrl
        div.appendChild(image)
    })
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

async function init() {
    if (document.querySelector('#logout')) {
        document.querySelector('#logout').addEventListener('click', () => {
            localStorage.removeItem('token')
            window.location.href = "./login.html"
        })
    }
    if (filtreContainer) {
        await createFilters();
    }

    await displayProjects();
    if (modalGallery) {
        await displayProjetModal()
    }
}


function openModal(modal) {
    console.log("openModal")
    modal.classList.remove('hidden')
    modal.setAttribute('aria-hidden', 'false');
    fetchProjects().then(projects => {
        displayProjects(projects);
    });
}

if (document.querySelector("#edit-button")) {
    document.querySelector("#edit-button").addEventListener("click", () => {
        openModal(modalDelete)
    })
}


if (document.querySelector("#modal-delete-icon")) {
    document.querySelector('#modal-delete-icon').addEventListener("click", () => {
        closeModal(modalDelete)
    })
}

function closeModal(modal) {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
}

async function deleteImage(imageId, element) {
    try {
        const response = await fetch(`http://localhost:5678/api/works/${imageId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            element.remove()
        } else {
            console.error('Erreur lors de la suppression de l\'image');
            console.log(response)
        }
    } catch (error) {
        console.error('Erreur de réseau:', error);
    }
}

async function init() {
    if (filtreContainer) {
        await createFilters();
    }
    await displayProjects();
    if (modalGallery) {
        await displayProjetModal();
    }
}


document.addEventListener('DOMContentLoaded', init());
