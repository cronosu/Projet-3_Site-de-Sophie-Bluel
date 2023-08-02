

if (localStorage.getItem("token")) {
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
        } else {
            console.log(err);
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
        } else if (err.code === '404') {
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
const btn1 = document.querySelector(".mes-projets-filtre-li-1")
const btn2 = document.querySelector(".mes-projets-filtre-li-2")
const btn3 = document.querySelector(".mes-projets-filtre-li-3")
const btn4 = document.querySelector(".mes-projets-filtre-li-4")
const gallery = document.querySelector(".gallery");

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
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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

    };

});

console.log(modalValidation);
// Get the <span> element that closes the modal
var span = document.querySelectorAll(".close");
modalValidation.addEventListener("click",function (){
    modalValidation.style.display = "none";
     
    }) ;

// When the user clicks on <span> (x), close the modal
span.forEach(span => {
    span.onclick = function () {
        modal.style.display = "none";
        modal2.style.display = "none";
      
        fetchData("http://localhost:5678/api/works/", showData);
    };
});

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal || event.target == modal2) {
        modal.style.display = "none";
        modal2.style.display = "none";
        document.querySelector(".modal-validation").style.display = "none";
        fetchData("http://localhost:5678/api/works/", showData);

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

})
const btnReturn = document.querySelector(".fa-arrow-left");

btnReturn.addEventListener("click", function () {
    var modal = document.getElementById("myModal");
    var modal2 = document.getElementById("myModal2");
    modal.style.display = "block";
    modal2.style.display = "none";

});
//Add work//




//fin Modal2//






const init = () => {
    fetchData("http://localhost:5678/api/works/", showData);
};

init();