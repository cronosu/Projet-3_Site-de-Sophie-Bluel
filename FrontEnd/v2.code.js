/** fetch datas from API and build elements from these datas */
const fetchDatasAndDisplay = async () => {
    try {
        const res = await fetch('http://localhost:5678/api/works/');
        const data = await res.json();
        const gallery = document.querySelector(".gallery");
        gallery.innerHTML = "";
        data.forEach(elements => {
            const { imageUrl, title } = elements;
            const figureElements = document.createElement('figure');
            figureElements.innerHTML = `<img src="${imageUrl}"><figcaption>${title}`;
            gallery.appendChild(figureElements);
        });
    }catch (err) {
        if (err.code === 'ECONNREFUSED') {
            console.log("L'API est indisponible.")
        } else if (err.code === '404') {
            console.log("L'API n'a pas été trouvée.")
        } else {
            console.log(err)
        }
    }
}

/** fetch datas from API and build elements from filter datas
 * @param {integer} btnFiltre number of button
*/
const fetchFilteredDataAndDisplay = async (btnFiltre) => {
    try {
        const res = await fetch('http://localhost:5678/api/works/');
        const data = await res.json();
        const dataFiltre = data.filter(element => element.categoryId == btnFiltre);
        console.log(dataFiltre.map(elements=>elements.categoryId));
        const gallery = document.querySelector(".gallery");
        gallery.innerHTML = "";
        dataFiltre.forEach(elements => {
            const { imageUrl, title } = elements;
            const figureElements = document.createElement('figure');
            figureElements.innerHTML = `<img src="${imageUrl}"><figcaption>${title}`;
            gallery.appendChild(figureElements);
        });
    }catch (err) {
        if (err.code === 'ECONNREFUSED') {
            console.log("L'API est indisponible.")
        } else if (err.code === '404') {
            console.log("L'API n'a pas été trouvée.")
        } else {
            console.log(err)
        }
    }
}

/** attach the listeners to each filter buttons*/
const attachFilterEventsListeners = () => {
    const btn1 = document.querySelector(".mes-projets-filtre-li-1");
    const btn2 = document.querySelector(".mes-projets-filtre-li-2");
    const btn3 = document.querySelector(".mes-projets-filtre-li-3");
    const btn4 = document.querySelector(".mes-projets-filtre-li-4");

    btn1.addEventListener ("click",function(){
        const li = document.querySelectorAll(".mes-projets-filtre-ul li");
        li.forEach(el=> el.classList.remove("color"));
        btn1.classList.add("color");
        fetchDatasAndDisplay();
    });

    btn2.addEventListener ("click",function(){
        const li = document.querySelectorAll(".mes-projets-filtre-ul li");
        li.forEach(el=> el.classList.remove("color"));
        btn2.classList.add("color");
       fetchFilteredDataAndDisplay(1);
    });

    btn3.addEventListener ("click",function(){
        const li = document.querySelectorAll(".mes-projets-filtre-ul li");
        li.forEach(el=> el.classList.remove("color"));
        btn3.classList.add("color");
        fetchFilteredDataAndDisplay(2);
    });
    
    btn4.addEventListener ("click",function(){
        const li = document.querySelectorAll(".mes-projets-filtre-ul li");
        li.forEach(el=> el.classList.remove("color"));
        btn4.classList.add("color");
        fetchFilteredDataAndDisplay(3);
    });
 
};

fetchDatasAndDisplay();
document.addEventListener("DOMContentLoaded" ,attachFilterEventsListeners);
