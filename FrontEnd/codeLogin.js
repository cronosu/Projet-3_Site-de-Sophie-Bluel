const formulaire = document.querySelector('#formulaire');

formulaire.addEventListener('submit', async function (e) {
    e.preventDefault();
    const mail = document.getElementById('eMail').value.trim();
    const motDePasse = document.getElementById('motDePasse').value.trim();
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;


    function messageErrorLogin(querySelector, message) {
        document.querySelector(querySelector).innerHTML = message;
        console.log(document.querySelector(querySelector));
    }

    if (mail == '') {
        messageErrorLogin('#errorMail', 'Le champ E-Mail est vide')
     

    } else if (regexEmail.test(mail) == false) {

        messageErrorLogin('#errorMail', "L'e-mail est invalide");

    } else {
        const errorMail = document.querySelector('#errorMail');
        errorMail.innerHTML = '';

    }

    if (motDePasse.trim() == '') {
        messageErrorLogin('#errorMotDePasse', 'Le champ Mot de passe est vide')

    } else {
        const errorMotDePasse = document.querySelector('#errorMotDePasse');
        errorMotDePasse.innerHTML = '';
    }

    await loggin(mail, motDePasse);

});


const loggin = async (mail, motDePasse) => {
    let user = {
        email: mail,
        password: motDePasse
    };


    let response = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(user)
    });

    let result = await response.json();

    if (response.status === 200) {
        const token = localStorage.setItem("token", result.token);
        document.location.href = "index.html";

    } else if (response.status === 404) {
        const errorMotDePasse = document.querySelector('#errorMotDePasse');
        if (motDePasse == '') {
            messageErrorLogin('#errorMotDePasse', 'Le champ Mot de passe est vide');
        } else {
            errorMotDePasse.innerHTML = 'Mot de passe ou identifiant incorrect ou API non disponible';
        }
    }

    else if (response.status === 401) {
        const errorMotDePasse = document.querySelector('#errorMotDePasse');

        if (motDePasse == '') {

            messageErrorLogin('#errorMotDePasse', 'Le champ Mot de passe est vide');

        } else {
            errorMotDePasse.innerHTML = 'Mot de passe ou identifiant incorrect';
        }
    }
};
