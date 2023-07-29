


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

/*  manip du DOM */
const showData = (data) => {
    const gallery = document.querySelector(".gallery");
    for (let i = 0; i < data.length; i++) {
      const img = createElemt("img","");
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
      fetchFilteredDataAndDisplay(1) ;
  });
  
  btn3.addEventListener("click", function () {
      gallery.innerHTML = ``;   
      li.forEach((el) => {
          el.classList.remove("color");
      });
      btn3.classList.add("color")
      fetchFilteredDataAndDisplay(2) ;
  });
  
  btn4.addEventListener("click", function () {
      gallery.innerHTML = ``;   
      li.forEach((el) => {
          el.classList.remove("color");
      });
      btn4.classList.add("color")
      fetchFilteredDataAndDisplay(3) ;
  });

const init = () => {
    fetchData("http://localhost:5678/api/works/", showData);
};

init();