

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
/*
 * @param {string} url  - API endpoint
 * @param {function} callback  - function to call once the data is reached
 */
const fetchData = async (url, callback) => {
    try {
        const res = await fetch(url);
        const data = await res.json();
        callback(data);
    } catch (err) {
        if (err.code === "ECONNREFUSED") {
            console.log("L'API est indisponible.");
        } else if (err.code === "404") {
            console.log("L'API n'a pas été trouvée.");
        }
        else {

            console.table(err);
        }
    }
};

/** fetch datas from API and build elements from filter datas
 * @param {integer} btnFiltre number of button
*/
const fetchFilteredDataAndDisplay = async (btnFiltre) => {
    try {
        const res = await fetch('http://localhost:5678/api/works/');
        const data = await res.json();
        const dataFiltre = data.filter(element => element.categoryId == btnFiltre);
        console.log(dataFiltre);
        const gallery = document.querySelector(".gallery");
        gallery.innerHTML = "";
        dataFiltre.forEach(elements => {
            const { imageUrl, title } = elements;
            const figureElements = document.createElement('figure');
            figureElements.innerHTML = `<img src="${imageUrl}"><figcaption>${title}`;
            gallery.appendChild(figureElements);

        });
    } catch (err) {
        if (err.code === 'ECONNREFUSED') {
            console.log("L'API est indisponible.")
        } else if (err.code === 404) {
            console.log("L'API n'a pas été trouvée.")
        } else {
            console.log(err)
        }
    }
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
const categoryWorkCreated = document.querySelector("#categorie");


btn1.addEventListener("click", function () {
    gallery.innerHTML = ``;
    li.forEach((el) => {
        el.classList.remove("color");
    });
    btn1.classList.add("color")
    fetchData("http://localhost:5678/api/works/", showData);
});

btn2.addEventListener("click", function () {
    gallery.innerHTML = ``;
    li.forEach((el) => {
        el.classList.remove("color");
    });
    btn2.classList.add("color")
    fetchFilteredDataAndDisplay(1);
});

btn3.addEventListener("click", function () {
    gallery.innerHTML = ``;
    li.forEach((el) => {
        el.classList.remove("color");
    });
    btn3.classList.add("color")
    fetchFilteredDataAndDisplay(2);
});

btn4.addEventListener("click", function () {
    gallery.innerHTML = ``;
    li.forEach((el) => {
        el.classList.remove("color");
    });
    btn4.classList.add("color")
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
            const id = event.target.dataset.articleId;
            event.preventDefault();
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
    try {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        };
        const res = await fetch(url, {
            method: "DELETE",
            headers,
        });

    } catch (err) {
        console.log(err);
    }
};

//delete all work with token
const btnDeleteAllWork = document.querySelector('.modal-content-btn-delete-galery');
/*btnDeleteAllWork.addEventListener("click", async function (event) {
    event.preventDefault();
    const res = await fetch("http://localhost:5678/api/works/");
    const data = await res.json();
    for (let i = 0; i < data.length; i++) {
        const id = data[i].id;
        setTimeout(async () => {
            await deleteWork(`http://localhost:5678/api/works/${id}`);
            console.log(`L'article avec l'ID ${id} a été supprimé.`);
            fetchDataAndDisplayOnModal();
            fetchData("http://localhost:5678/api/works/", showData);
        }, i * 400);
    }
});*/
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
            console.log(`L'article avec l'ID ${id} a été supprimé.`);
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
/* Get the button that opens the modal
var btn = document.getElementById("myBtn"); When the user clicks the button, open the modal 
btn.onclick = function() {
    modal.style.display = "block";
}*/


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
    const choise0 = createElemt("option", "");
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
    console.log(selectedCategoryIdInSelect);
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
    imageFail.innerHTML = "";
    titleWork.value = "";
    console.log(document.querySelector('.fa-regular'));
    document.querySelector('.fa-regular').style.display = "block";
    document.querySelector('.btn-ajout-Image').style.display = "block";
    document.querySelector('.fa-regular').style.display = "block";
    document.querySelector('.modal-content-div-Ajout').style.padding = "40px 0 40px";
    categoryWork.value = "";
    console.log(inputImage.files);
    inputImage.value = "";
    selectedCategoryIdInSelect = "";
    document.querySelector(".modal2-div-btn-valide").style.backgroundColor = "#A7A7A7";
};
btnAjoutImage.addEventListener('click', (event) => {
    // Déclencher le clic sur l'élément input
    inputImage.click();
    event.preventDefault(); // Utilisez event.preventDefault() pour empêcher le comportement par défaut du bouton
});

//  Default btn valider
const btn = document.querySelector(".modal2-div-btn-valide");
btn.addEventListener('click', (event) => {
    event.preventDefault();

    const workSendBox = document.querySelector(".modal2-div-envoi-valide");
    workSendBox.innerHTML = "Veuillez remplir le formulaire";
    workSendBox.style.fontSize = "25px";
    workSendBox.style.color = "red";
    // Effacer le message après 10 secondes avec un effet cool
    setTimeout(() => {
        // Ajoutez ici l'effet de disparition cool, par exemple une transition CSS
        workSendBox.style.transition = "opacity 1s ease-out, font-size 0.5s ease-out";
        workSendBox.style.opacity = "0";
        workSendBox.style.fontSize = "12px";
      

        // Supprimer le contenu après la transition
        setTimeout(() => {
            workSendBox.innerHTML = "";
            workSendBox.style.fontSize = "0px";
            workSendBox.style.opacity = "1"; // Réinitialiser l'opacité
            workSendBox.style.transition = "";

        }, 500); // Attendre 1 seconde pour la transition de disparition
    }, 5000);
}
);



inputImage.addEventListener('change', () => {

    // Réagir aux changements de l'élément input (par exemple, téléchargement d'une image)
    const selectedImage = inputImage.files;

    if (selectedImage) {
        // Vérifier la taille de l'image (en octets)
        if (selectedImage[0].size < 4 * 1024 * 1024) { // 4 Mo en octets
            // Afficher l'aperçu de l'image sélectionnée
            imagePreview.src = URL.createObjectURL(selectedImage[0]);
            imageFail.innerHTML = "";
            console.log(document.querySelector('.fa-regular'));
            document.querySelector('.fa-regular').style.display = "none";
            document.querySelector('.btn-ajout-Image').style.display = "none";
            document.querySelector('.fa-regular').style.display = "none";
            document.querySelector('.modal-content-div-Ajout').style.padding = "0";
            imageFail.style.display = "none";
            imageWork = "ok";
            imagePreview.style.display = "block";


        } else if (selectedImage[0].size >= 4 * 1024 * 1024) {
            imageFail.innerHTML = "L'image est trop volumineuse. Veuillez sélectionner une image de moins de 4 Mo.";
            imageFail.style.color = "red";
            inputImage.value = ''; // Réinitialiser le champ de téléchargement
            imageWork = "";
        }

        updateButtonColor();
    }

});
function SendPush(message, color) {
    const workSendBox = document.querySelector(".modal2-div-envoi-valide");
    workSendBox.innerHTML = message;
    workSendBox.style.fontSize = "25px";
    workSendBox.style.color = color;
    // Effacer le message après 10 secondes avec un effet cool
    setTimeout(() => {
        // Ajoutez ici l'effet de disparition cool, par exemple une transition CSS
        workSendBox.style.transition = "opacity 1s ease-out, font-size 0.5s ease-out";
        workSendBox.style.opacity = "0";
        workSendBox.style.fontSize = "12px";

        // Supprimer le contenu après la transition
        setTimeout(() => {
            workSendBox.innerHTML = "";
            workSendBox.style.fontSize = "0px";
            workSendBox.style.opacity = "1"; // Réinitialiser l'opacité
            workSendBox.style.transition = "";

        }, 500); // Attendre 1 seconde pour la transition de disparition
    }, 5000);
    formData = "";
    reset();
};



const sendWork = async () => {
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
    console.log(response.status);
    if (response.ok) {
        SendPush("Projet envoyé", "green");
    } else if (response.status === 400 || response.status === 401 || response.status === 500) {
        SendPush("Erreur de l'API", "red");
    } else {
        SendPush("Veuillez remplir le formulaire", "red");
    }

    fetchData("http://localhost:5678/api/works/", showData);
    fetchDataAndDisplayOnModal();
};

function updateButtonColor() {

    if (imageWork == "ok" && titleWork.value !== "" && categoryWork.value !== "") {
        console.log(imageWork);
        console.log(titleWork.value);
        console.log(categoryWork.value);
        const btn = document.querySelector(".modal2-div-btn-valide");
        btn.style.backgroundColor = "#1D6154";
        btn.removeEventListener('click', sendWork, true);
        btn.addEventListener('click', sendWork, true);

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