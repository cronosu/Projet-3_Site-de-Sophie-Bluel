
const database = async () => {
    try {
        const res = await fetch('http://localhost:5678/api/works/');
        const data = await res.json();
        const imgUrl = data.map(data => data.imageUrl);
        const imgTitre = data.map(data => data.title);

        //console.table(data);
        //console.table(imgUrl, imgTitre);

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
database()

