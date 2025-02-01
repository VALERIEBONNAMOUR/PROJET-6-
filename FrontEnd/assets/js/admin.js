const modalDelete = document.getElementById('modal1');
const modalGallery = document.querySelector('#modal-project-gallery');
const modalAdd = document.querySelector('#modal2')
const form = document.getElementById('form-modal2')
const submitter = document.querySelector("input[value=submit]")
const containerImg = document.getElementById("container-img");
const textModal2 = document.querySelector(".text-modal2");
const btnModalOne = document.querySelector('#modal1-btn')
const buttonLabel = document.querySelector(".button");
const rewind = document.querySelector('#rewind');
const inputFile = document.getElementById("photo");
const closeModalOne = document.getElementById('modal-delete-icon');
const closeModalTwo = document.getElementById('modal-add-icon');


// les blocs try et catch permettent de gérer les erreurs qui peuvent survenir. 
// La fonction newImage permet d'envoyer une requête HTTP POST à une API afin d'ajouter une nouvelle image dans la gestion de projets.
// La fonction async permet d'utiliser l'opération await (permet d'attendre que  que certaines promesses soient résolues avant de continuer l'exécution du code.)
// Un objet FormData est créé, ce qui permet d'envoyer des données (title, img, category) dans une requête HTTP.
// fetch est utilisé pour envoyer une requête HTTP asynchrone à l'API.
// Le header Authorization est configuré pour envoyer un jeton JWT stocké dans le localStorage sous la clé 'token' pour authentifier l'utilisateur.

async function postWork() {
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

function validateForm() {
    form.addEventListener('input', function () {
        const inputs = form.querySelectorAll('input');
        const submitButton = document.getElementById('modal2-btn');
        let isValide = true;
        // Vérifier si tous les inputs sont remplis
        inputs.forEach(function (input) {
            console.log(input);
            if (input.value === '') {
                isValide = false;
            }
        });

        // Activer ou désactiver le bouton en fonction de la vérification

        if (isValide == true) {
            submitButton.disabled = false;
            submitButton.classList.add("active");
        }
    });
}

// la fonction openModal permet d'afficher la modale et affiche la liste des projets
function openModal(modal) {
    modal.classList.remove('hidden')
    modal.setAttribute('aria-hidden', 'false');
    fetchProjects().then(projects => {
        displayProjects(projects);
    });
}

//creer l'image dans la seconde modale
function createImage() {
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

async function insertCategoryToSelectInput() {
    const category = await getCategories();
    category.forEach(cat => {
        console.log(document.querySelector('#categoriesSelect'));

        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        document.querySelector('#categoriesSelect').appendChild(option);
    });
}

// la fonction closeModal(modal) sert à fermer la modale en la cachant visuellement 
function closeModal(modal) {
    modal.classList.add('hidden')
    modal.setAttribute('aria-hidden', 'true');

    // buttonLabel.classList.remove("button");
    containerImg.innerHTML = ' <i class="fa-regular fa-image" id="label-img"></i>';
    if (!buttonLabel.classList.contains("button")) {
        buttonLabel.classList.add("button");
        buttonLabel.textContent = "+ Ajouter photo";
    }
    document.querySelector("#title-rectangle").value = '';
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
            await displayProjects();
            await displayProjetModal()
        } else {
            console.error('Erreur lors de la suppression de l\'image');
            console.log(response)
        }
    } catch (error) {
        console.error('Erreur de réseau:', error);
    }
}

async function initModal() {
    if (localStorage.getItem('token') == "") {
        window.location.href ="../index.html"
    }
    // Vérification et gestion du bouton de déconnexion (#logout)
    // Suppression du token et redirection de l'utilisateur vers la page de connexion
    document.querySelector('#logout').addEventListener('click', () => {
        localStorage.removeItem('token')
        window.location.href = "./login.html"
    })
    document.querySelector('#modal-delete-icon').addEventListener("click", () => {
        closeModal(modalDelete)
    })

    document.querySelector("#edit-button").addEventListener("click", () => {
        openModal(modalDelete)
    })

    // Gestion du formulaire d'ajout d'image
    validateForm() // ajout de l'ecouteur d'evenement qui permet de verifier si le form est valide
    await insertCategoryToSelectInput()

    // Gestion du changement de fichier d'image dans la modale 2

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        postWork();
    })
    createImage()

    //affiche les images dans la modale
    await displayProjetModal()

    // Gestion des modales de suppression et d'ajout 

    btnModalOne.addEventListener('click', () => {
        closeModal(modalDelete)
        openModal(modalAdd)
    })

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

document.addEventListener('DOMContentLoaded', initModal)











