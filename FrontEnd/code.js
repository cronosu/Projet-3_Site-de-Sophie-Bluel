

const database = async () => {
    try {
        const res = await fetch('http://localhost:5678/api/works/');
        const data = await res.json();

        console.log(data);

        const imgUrl = await data.map(data => data.imageUrl);
        const imgTitre = await data.map(data => data.title);
        for (let i = 0; i < data.length; i++) {
            const gallery = document.querySelector(".gallery");
            const nomElement = document.createElement('figure');
            nomElement.innerHTML = `<img src="${imgUrl[i]}"><figcaption>${imgTitre[i]}`;
            gallery.appendChild(nomElement)

        }

    } catch (err) {
        if (err.code === 'ECONNREFUSED') {
            console.log('L\'API est indisponible.')
        } else if (err.code === '404') {
            console.log('L\'API n\'a pas été trouvée.')
        } else {
            console.log(err)
        }
    }

}

const gallery = document.querySelector(".gallery");
const filtre = document.querySelector(".mes-projet-filtre-ul");
const li = filtre.querySelectorAll("li");
/*li.forEach((el) => {
    el.addEventListener("click", function () {
               
        const gallery = document.querySelector(".gallery");
        gallery.innerHTML = ``;   
        li.forEach((el) => {
            el.classList.remove("color");
        });
        el.classList.add("color")
      
    });
});  */

const newDatabase = async (btnFiltre) => {
    try {
        
        const res = await fetch('http://localhost:5678/api/works/');
        let data = await res.json();
        let dataFiltre = data.filter((element) => element.categoryId == btnFiltre);

        console.log(filtre)
        for (let i = 0; i < dataFiltre.length; i++) {

            const imgUrl = await dataFiltre.map(dataFiltre => dataFiltre.imageUrl);
            const imgTitre = await dataFiltre.map(dataFiltre => dataFiltre.title);
            const nomElement = document.createElement('figure');
            nomElement.innerHTML = `<img src="${imgUrl[i]}"><figcaption>${imgTitre[i]}`;
            gallery.appendChild(nomElement)
            
        }
        
    } catch (err) {
        if (err.code === 'ECONNREFUSED') {
            console.log('L\'API est indisponible.')
        } else if (err.code === '404') {
            console.log('L\'API n\'a pas été trouvée.')
        } else {
            console.log(err)
        }
    }
    
}
const btn1 = document.querySelector(".mes-projet-filtre-li-1")
const btn2 = document.querySelector(".mes-projet-filtre-li-2")
const btn3 = document.querySelector(".mes-projet-filtre-li-3")
const btn4 = document.querySelector(".mes-projet-filtre-li-4")

btn1.addEventListener("click", function () {
    gallery.innerHTML = ``;   
    li.forEach((el) => {
        el.classList.remove("color");
    });
    btn1.classList.add("color")
    database()
});

btn2.addEventListener("click", function () {
               
  
    gallery.innerHTML = ``;   
    li.forEach((el) => {
        el.classList.remove("color");
    });
    btn2.classList.add("color")
    newDatabase(1)
});

btn3.addEventListener("click", function () {
             

    gallery.innerHTML = ``;   
    li.forEach((el) => {
        el.classList.remove("color");
    });
    btn3.classList.add("color")
    newDatabase(2)
});

btn4.addEventListener("click", function () {
    gallery.innerHTML = ``;   
    li.forEach((el) => {
        el.classList.remove("color");
    });
    btn4.classList.add("color")
    newDatabase(3)
});

database()


