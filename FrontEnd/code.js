if (localStorage.getItem("token")) {
    console.log(localStorage.getItem("token"));
    const logginBtn = document.querySelectorAll(".log");
    const filtre = document.querySelector(".mes-projet-filtre");
    filtre.classList.toggle("loginSwitchButDisplay");
    logginBtn.forEach((element) => {
        element.classList.toggle("loginSwitch");
    });
}

const buttonLogOut = document.querySelector(".logOut");
buttonLogOut.addEventListener("click", function () {
    localStorage.removeItem("token");
    window.location.reload();
});

/** 
 * @param {string} url  - API endpoint
 * @param {function} callback  - function to call once the data is reached
 */
const fetchData = async (url, callback) => {
    const res = await fetch(url);
    const data = await res.json();
    callback(data);
};

/** fetch datas from API and build elements from filter datas
 * @param {integer} btnFiltre number of button
*/
const fetchFilteredDataAndDisplay = async (btnFiltre) => {
    const res = await fetch('http://localhost:5678/api/works/');
    const data = await res.json();
    const dataFiltre = data.filter(element => element.categoryId == btnFiltre);
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
    dataFiltre.forEach(elements => {
        const { imageUrl, title } = elements;
        const figureElements = document.createElement('figure');
        figureElements.innerHTML = `<img src="${imageUrl}"><figcaption>${title}`;
        gallery.appendChild(figureElements);
    });
}

/*  manip du DOM */
const showData = (data) => {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
    for (let i = 0; i < data.length; i++) {
        const img = createElemt("img", "");
        img.src = data[i].imageUrl;
        const titre = data[i].title;
        const article = createElemt("figure", `<img src="${img.src}">${titre}`);
        gallery.appendChild(article);
    }
};

/**
 * Creates a new HTML element with the specified tag and content.
 * @param {string} elem - The HTML tag name of the element to be created.
 * @param {string} content - The text content to be set for the created element.
 * @returns {HTMLElement} - The newly created HTML element with the specified tag and content.
 */
const createElemt = (elem, content) => {
    const elemCreated = document.createElement(elem);
    elemCreated.innerHTML += content;
    return elemCreated;
};

const filtre = document.querySelector(".mes-projets-filtre-ul");
const li = filtre.querySelectorAll("li");
const btn1 = document.querySelector(".mes-projets-filtre-li-1");
const btn2 = document.querySelector(".mes-projets-filtre-li-2");
const btn3 = document.querySelector(".mes-projets-filtre-li-3");
const btn4 = document.querySelector(".mes-projets-filtre-li-4");
const gallery = document.querySelector(".gallery");

function changeColorInFiltre(btnFiltre) {
    gallery.innerHTML = ``;
    li.forEach((el) => {
        el.classList.remove("color");
    });
    btnFiltre.classList.add("color")
};

btn1.addEventListener("click", function () {
    changeColorInFiltre(btn1);
    fetchData("http://localhost:5678/api/works/", showData);
});

btn2.addEventListener("click", function () {
    changeColorInFiltre(btn2)
    fetchFilteredDataAndDisplay(1);
});

btn3.addEventListener("click", function () {
    changeColorInFiltre(btn3)
    fetchFilteredDataAndDisplay(2);
});

btn4.addEventListener("click", function () {
    changeColorInFiltre(btn4)
    fetchFilteredDataAndDisplay(3);
});

//Modal1//
// Get the modal
var modal = document.getElementById("myModal");
var modal2 = document.getElementById("myModal2");
var modalValidation = document.getElementById("deleteConfirmationModal");
// Get gallery on the modal
const fetchDataAndDisplayOnModal = async () => {

    const res = await fetch('http://localhost:5678/api/works/');
    const data = await res.json();
    const galleryModeEdition = document.querySelector(".modal-content-galery");
    galleryModeEdition.innerHTML = "";
    for (let i = 0; i < data.length; i++) {
        const id = data[i].id;
        const imageUrl = data[i].imageUrl;
        const figureElements = document.createElement('figure');
        figureElements.innerHTML = `<img src="${imageUrl}"><i data-article-id="${id}" class="image-delete fa-solid fa-trash-can fa-sm"></i><button  class="modal-btn-edite">éditer</button>`;
        if (i === 0) {
            figureElements.innerHTML += `<i class="fa-solid fa-arrows-up-down-left-right fa-sm"></i>`;
        }
        galleryModeEdition.appendChild(figureElements);
        const btnDelete = document.querySelectorAll(".image-delete");

        btnDelete[i].addEventListener("click", function (event) {
            event.preventDefault();
            const id = event.target.dataset.articleId;
            deleteWork(`http://localhost:5678/api/works/${id}`)
                .then(() => {
                    console.log(`L'article avec l'ID ${id} a été supprimé.`);
                    fetchDataAndDisplayOnModal();
                    fetchData("http://localhost:5678/api/works/", showData);
                })
        })
    };
};

//delete work with token
const deleteWork = async (url) => {
    const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    };
    const res = await fetch(url, {
        method: "DELETE",
        headers,
    });
};

//delete all work with token
const btnDeleteAllWork = document.querySelector('.modal-content-btn-delete-galery');

//validation de suppression
// Sélectionner le bouton de suppression
const btnDeleteAllWorkb = document.querySelector('.modal-content-btn-delete-galery');

// Sélectionner la modal de confirmation
const modalb = document.getElementById('deleteConfirmationModal');

// Sélectionner le bouton "Oui" dans la modal
const modalConfirmBtn = modalb.querySelector('.modal-confirm-btn');

// Sélectionner le bouton "Annuler" dans la modal
const modalCancelBtn = modalb.querySelector('.modal-cancel-btn');

// Gérer le clic sur le bouton de suppression
btnDeleteAllWork.addEventListener("click", function (event) {
    // Afficher la modal de confirmation
    modalb.style.display = "block";

});

// Gérer le clic sur le bouton "Oui" dans la modal
modalConfirmBtn.addEventListener("click", async function (event) {
    // Fermer la modal de confirmation
    modalb.style.display = "none";

    // Supprimer les articles après confirmation
    event.preventDefault();
    const res = await fetch("http://localhost:5678/api/works/");
    const data = await res.json();

    for (let i = 0; i < data.length; i++) {
        const id = data[i].id;
        setTimeout(async () => {
            await deleteWork(`http://localhost:5678/api/works/${id}`);
            fetchDataAndDisplayOnModal();
            fetchData("http://localhost:5678/api/works/", showData);
        }, i * 400);
    }
});

// Gérer le clic sur le bouton "Annuler" dans la modal
modalCancelBtn.addEventListener("click", function (event) {
    // Fermer la modal de confirmation
    modalb.style.display = "none";
});

//fin validation de suppression*/

// open the modal with all btn edition
const categoryWorkCreated = document.querySelector("#categorie");

const allBtn = document.querySelectorAll(".myBtn");
allBtn.forEach((btn) => {
    btn.onclick = function () {
        modal.style.display = "block";
        fetchDataAndDisplayOnModal();
        categoryWorkCreated.innerHTML = "";
    };

});

// Get the <span> element that closes the modal
var span = document.querySelectorAll(".close");
modalValidation.addEventListener("click", function () {
    modalValidation.style.display = "none";
    categoryWorkCreated.innerHTML = "";
    reset();
});

// When the user clicks on <span> (x), close the modal
span.forEach(span => {
    span.onclick = function () {
        modal.style.display = "none";
        modal2.style.display = "none";
        categoryWorkCreated.innerHTML = "";
        fetchData("http://localhost:5678/api/works/", showData);
        reset();
    };
});

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal || event.target == modal2) {
        modal.style.display = "none";
        modal2.style.display = "none";
        document.querySelector(".modal-validation").style.display = "none";
        fetchData("http://localhost:5678/api/works/", showData);
        reset();
        categoryWorkCreated.innerHTML = "";
    } else if (event.target == modalValidation) {
        modalValidation.style.display = "none";
    };
};

//fin Modal1//

//Modal2//
const btnModal2 = document.querySelector(".modal-content-btn-ajout-photo");
btnModal2.addEventListener("click", function () {
    document.querySelector("#myModal").style.display = "none";
    document.querySelector("#myModal2").style.display = "block";
    if (categoryWork.children.length === 0) {

        fetchDataCategory();
    };
})
const btnReturn = document.querySelector(".fa-arrow-left");

btnReturn.addEventListener("click", function () {
    categoryWorkCreated.innerHTML = "";
    var modal = document.getElementById("myModal");
    var modal2 = document.getElementById("myModal2");
    modal.style.display = "block";
    modal2.style.display = "none";
    reset();
});

//Add categorie at modal 2//
const fetchDataCategory = async () => {
    const res = await fetch('http://localhost:5678/api/categories/');
    const data = await res.json();
    const choise0 = createElemt("option", " ");
    categoryWorkCreated.appendChild(choise0);
    data.forEach((element) => {
        const name = element.name;
        const id = element.id;
        const categoryWorkChoise = createElemt("option", `${name}`);
        categoryWorkChoise.value = `${name}`;
        categoryWorkChoise.setAttribute("id", `${id}`);
        categoryWorkCreated.appendChild(categoryWorkChoise);
    });
};
//récupére l'id de la catégorie choisi

const selectCategorie = document.getElementById("categorie");

let selectedCategoryIdInSelect = "";
selectCategorie.addEventListener("change", function () {
    const selectedCategoryId = selectCategorie.options[selectCategorie.selectedIndex].id;
    selectedCategoryIdInSelect = selectedCategoryId;
});

//add picture to new work
const btnAjoutImage = document.querySelector('.btn-ajout-Image');
let inputImage = document.getElementById('image-work');
const ajouterPhotoBtn = document.getElementById('ajouterPhotoBtn');
let titleWork = document.getElementById('titre');
const categoryWork = document.getElementById('categorie');
const imagePreview = document.getElementById('imagePreview');
const imageFail = document.getElementById('image-fail');

let imageWork = "";

//function reset 
const reset = () => {
    imageFail.style.display = "block";
    imagePreview.style.display = "none";
    imageWork = "";
    titleWork.value = "";
    document.querySelector('.fa-regular').style.display = "block";
    document.querySelector('.btn-ajout-Image').style.display = "block";
    document.querySelector('.fa-regular').style.display = "block";
    document.querySelector('.modal-content-div-Ajout').style.padding = "40px 0 40px";
    categoryWork.value = "";
    inputImage.value = "";
    selectedCategoryIdInSelect = "";
    document.querySelector(".modal2-div-btn-valide").style.backgroundColor = "#A7A7A7";
    imageFail.innerHTML = "jpg, png : 4mo max";
    imageFail.style.color = "black";
};


btnAjoutImage.addEventListener('click', (event) => {
    // Déclencher le clic sur l'élément input
    inputImage.click();
    event.preventDefault(); // Utilisez event.preventDefault() pour empêcher le comportement par défaut du bouton
});

//  Default btn valider
const btn = document.querySelector(".modal2-div-btn-valide");
let workSendBoxTimeout; // Variable pour stocker le délai actif

/**
 * @param {string} message  - message for formulaire ok or not
 * @param {string} color  - color of message
 */
function SendPush(message, color) {
    const workSendBox = document.querySelector(".modal2-div-envoi-valide");
    workSendBox.innerHTML = message;
    workSendBox.style.fontSize = "25px";
    workSendBox.style.color = color;

    clearTimeout(workSendBoxTimeout);

    // Effacer le message
    workSendBoxTimeout = setTimeout(() => {

        workSendBox.style.transition = "opacity 1s ease-out, font-size 0.5s ease-out";
        workSendBox.style.opacity = "0";
        workSendBox.style.fontSize = "12px";

        // Supprime le contenu après la transition
        setTimeout(() => {
            workSendBox.innerHTML = "";
            workSendBox.style.fontSize = "0px";
            workSendBox.style.opacity = "1"; // Réinitialiser l'opacité
            workSendBox.style.transition = "";
        }, 500); // Attendre pour la transition de disparition
    }, 5000);
};

// listener par defaut du btn valider

const eventCallback = (event) => {
    event.preventDefault();
    SendPush("Veuillez remplir le formulaire", "red");
};

btn.addEventListener('click', eventCallback);


// listener a l'input image

inputImage.addEventListener('change', () => {
    // Réagir aux changements de l'élément input (par exemple, téléchargement d'une image)
    const selectedImage = inputImage.files;

    if (selectedImage) {
        function messageImage(message) {
            imageFail.style.color = "red";
            inputImage.value = ''; // Réinitialiser le champ de téléchargement
            imageWork = "";
            imageFail.innerHTML = message;

        };

        if (selectedImage[0].type == "image/jpeg" || selectedImage[0].type == "image/png") {
            console.log(selectedImage[0].type);
            //
            if (selectedImage[0].size < 4 * 1024 * 1024) { // 4 Mo en octets
                // Afficher l'aperçu de l'image sélectionnée
                imagePreview.src = URL.createObjectURL(selectedImage[0]);
                imageFail.innerHTML = "";
                document.querySelector('.fa-regular').style.display = "none";
                document.querySelector('.btn-ajout-Image').style.display = "none";
                document.querySelector('.fa-regular').style.display = "none";
                document.querySelector('.modal-content-div-Ajout').style.padding = "0";
                imageFail.style.display = "none";
                imageWork = "ok";
                imagePreview.style.display = "block";

            } else if (selectedImage[0].size >= 4 * 1024 * 1024) {
                messageImage("L'image est trop volumineuse.<br> Veuillez sélectionner une image de moins de 4 Mo.");

            }
        } else {
            console.log(selectedImage[0].type);
            messageImage("L'image doit être au format jpeg ou png <br> et doit faire moins de 4 Mo.");

        };

        // Vérifier la taille de l'image (en octets)
        updateButtonColor();

    }

});

function resetAfterSendPush() {
    formData = "";
    reset();
};

const sendWork = async (event) => {
    event.preventDefault();
    let formData = new FormData();

    if (inputImage.files[0].type === "image/jpeg") {
        formData.append("image", inputImage.files[0], 'image.jpeg');

    } else if (inputImage.files[0].type === "image/png") {
        formData.append("image", inputImage.files[0], 'image.png');
    }
    formData.append("title", titleWork.value);
    formData.append("category", selectedCategoryIdInSelect);

    const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: formData
    });
    if (response.ok) {
        SendPush("Projet envoyé", "green");
        resetAfterSendPush();
        fetchData("http://localhost:5678/api/works/", showData);
        fetchDataAndDisplayOnModal();
    } else if (response.status === 400 && titleWork.value.trim() == "") {
        SendPush("Veuillez remplir le formulaire", "red");

    } else if (response.status === 400 && categoryWork.value == "") {
        SendPush("Veuillez remplir le formulaire", "red");

    } else if (response.status === 400 || response.status === 401 || response.status === 500) {
        SendPush("Erreur de l'API", "red");
        resetAfterSendPush();
    } else {
        SendPush("Veuillez remplir le formulaire", "red");

    }

};

function updateButtonColor() {

    if (imageWork == "ok" && titleWork.value !== "" && categoryWork.value !== "") {
        btn.style.backgroundColor = "#1D6154";
        btn.removeEventListener('click', eventCallback);
        btn.addEventListener('click', sendWork);

    } else {
        document.querySelector(".modal2-div-btn-valide").style.backgroundColor = "#A7A7A7";
    }
};

titleWork.addEventListener('change', updateButtonColor);
categoryWork.addEventListener('change', updateButtonColor);

//fin Modal2//

const init = () => {
    fetchData("http://localhost:5678/api/works/", showData);
};

init();