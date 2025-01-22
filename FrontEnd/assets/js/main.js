const apiUrl = 'http://localhost:5678/api/';
const gallery = document.getElementById('project-gallery');
const modalDelete = document.getElementById('modal1');
const modalGallery = document.querySelector('#modal-project-gallery');
let works = []
const filtreContainer = document.getElementById('filtre-container');
const modalAdd = document.querySelector('#modal2')
const form = document.getElementById('form-modal2')
const submitter = document.querySelector("input[value=submit]")
const inputFile = document.getElementById("photo");
const buttonLabel = document.querySelector(".button");
const containerImg = document.getElementById("container-img");
const textModal2 = document.querySelector(".text-modal2");
const btnModalOne = document.querySelector('#modal1-btn')
const closeModalOne = document.getElementById('modal-delete-icon');
const closeModalTwo = document.getElementById('modal-add-icon');
const rewind = document.querySelector('#rewind');



// les blocs try et catch permettent de gérer les erreurs qui peuvent survenir. 
// La fonction newImage permet d'envoyer une requête HTTP POST à une API afin d'ajouter une nouvelle image dans la gestion de projets.
// La fonction async permet d'utiliser l'opération await (permet d'attendre que  que certaines promesses soient résolues avant de continuer l'exécution du code.)
// Un objet FormData est créé, ce qui permet d'envoyer des données (title, img, category) dans une requête HTTP.
// fetch est utilisé pour envoyer une requête HTTP asynchrone à l'API.
// Le header Authorization est configuré pour envoyer un jeton JWT stocké dans le localStorage sous la clé 'token' pour authentifier l'utilisateur.

async function newImage() {
    try {
        const title = document.querySelector('#title-rectangle').value
        const img = document.querySelector('#photo').files[0]
        const category = document.querySelector('#categoriesSelect').value
        const formData = new FormData()
        formData.append('title', title)
        formData.append('image', img)
        formData.append('category', category)
        const response = await fetch(apiUrl + "works", {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: formData,
        });

        if (response.ok) {
            await displayProjects();
            await displayProjetModal()
            closeModal(modalAdd)
        } else {
            console.error('Erreur lors de l\'ajout de l\'image');
            console.log(response)
        }
    } catch (error) {
        console.error('Erreur de réseau:', error);
    }
}

// la fonction fetchProjects permet d'envoyer une requête HTTP vers l'URL de l'API.
// response.json() permet de traiter la réponse de l'API qui est en JSON et de la convertir en un objet JavaScript.
// les données JSON sont stockées dans la variable works.

async function fetchProjects() {
    const response = await fetch(apiUrl + "works")
    const data = await response.json()
    works = data
    return data
}

// la fonction displayProjectModal s'occupe de l'affichage des projets dans une modale.
// forEach (parcours chaque projet dans le tableau works)
// création d'une icone corbeille pour supprimer les images

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

// la fonction displayProjects affiche les projets dans la galerie principale (pour chaque projet elle va créer un élément figure qui contiendra une image et une légende)

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
        return projects;
    }
// projects.filter(...) est utilisé pour créer un nouveau tableau contenant 
// uniquement les projets qui ont une categoryId
    displayProjects(projects.filter(item => item.categoryId === categoryId));
}

// la fonction openModal permet d'afficher la modale et affiche la liste des projets
function openModal(modal) {
    console.log("openModal")
    modal.classList.remove('hidden')
    modal.setAttribute('aria-hidden', 'false');
    fetchProjects().then(projects => {
        displayProjects(projects);
    });
}
// ouverture de la modale lorsque le bouton est cliqué
if (document.querySelector("#edit-button")) {
    document.querySelector("#edit-button").addEventListener("click", () => {
        openModal(modalDelete)
    })
}

// fermeture de la modale via la croix
if (document.querySelector("#modal-delete-icon")) {
    document.querySelector('#modal-delete-icon').addEventListener("click", () => {
        closeModal(modalDelete)
    })
}

// la fonction closeModal(modal) sert à fermer la modale en la cachant visuellement 
function closeModal(modal) {
    modal.classList.add('hidden')
    modal.setAttribute('aria-hidden', 'true');
   
    
      

        // buttonLabel.classList.remove("button");
        

        containerImg.innerHTML = ' <i class="fa-regular fa-image" id="label-img"></i>';
        if (!buttonLabel.classList.contains("button")) {
            buttonLabel.classList.add("button");
            buttonLabel.textContent="+ Ajouter photo";
        }

        document.querySelector("#title-rectangle").value='';
        textModal2.style.display = 'block';
    
}

// La fonction deleteImage(imageId, element) permet de supprimer une image
// depuis un serveur via une requête HTTP DELETE.
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

// la fonction init() initialise diverses actions (gérer des images, avec des modales, 
// des filtres, des événements sur des formulaires)
async function init() {
    // Vérification et gestion du bouton de déconnexion (#logout)
    // Suppression du token et redirection de l'utilisateur vers la page de connexion
    if (document.querySelector('#logout')) {
        document.querySelector('#logout').addEventListener('click', () => {
            localStorage.removeItem('token')
            window.location.href = "./login.html"
        })
    }
    // Création des filtres
    if (filtreContainer) {
        await createFilters();
    }
    // affichage des projets dans la modale
    await displayProjects();
    if (modalGallery) {
        await displayProjetModal();
    }
    // Gestion du formulaire d'ajout d'image
    if (form) {
        form.addEventListener('input', function () {
            const inputs = form.querySelectorAll('input');
            const submitButton = document.getElementById('modal2-btn');
            let isValide = true;
          
            // Vérifier si tous les inputs sont remplis
            inputs.forEach(function(input) {
                console.log(input);
              if (input.value.trim() === '') {
                isValide = false;
              }
            });
          
            // Activer ou désactiver le bouton en fonction de la vérification
            
            if (isValide){
                submitButton.disabled = false;
                submitButton.classList.add("active");
            }
            
          });
        const category = await getCategories();
        category.forEach(cat => {
            console.log(document.querySelector('#categoriesSelect'));

            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            document.querySelector('#categoriesSelect').appendChild(option);
        });

        form.addEventListener("submit", function (event) {
            event.preventDefault();
            newImage();
        })
    }
    // Gestion du changement de fichier d'image dans la modale 2
    if (inputFile) {
        inputFile.addEventListener("change", function (event) {
            const file = event.target.files[0];
            if (file) {
                const imgURL = URL.createObjectURL(file);
                const imgElement = document.createElement("img");
                imgElement.src = imgURL;

                buttonLabel.classList.remove("button");
                buttonLabel.textContent = "";

                containerImg.innerHTML = '';
                containerImg.appendChild(imgElement);

                textModal2.style.display = 'none';
            }
        });
    }
    // Gestion des modales de suppression et d'ajout 
    if (btnModalOne) {
        btnModalOne.addEventListener('click', () => {
            closeModal(modalDelete)
            openModal(modalAdd)
        })
    }
    
    if (modalDelete && modalAdd) {
        closeModalOne.addEventListener('click', (e) => {
         closeModal(modalDelete)
        })
        closeModalTwo.addEventListener('click', (e) => {
            closeModal(modalAdd)
        })
        rewind.addEventListener('click', (e) => {
            closeModal(modalAdd)
            openModal(modalDelete)
        })
    }
}


document.addEventListener('DOMContentLoaded', init);