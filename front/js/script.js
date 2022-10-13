fetch('http://localhost:3000/api/products')
    .then((response) => response.json())
    .then((data) => {
        console.log (data)
/*La boucle répète jusqu'à ce qu'il n'y ait plus de data[i] dans l'API, son typeof sera donc "undefined" et la boucle se brisera*/
        for (var i = 0;; i++) {
            if (typeof data[i] === "undefined") break
            displayProduct(data[i])
        }
    });

/*La fonction displayProduct récupère en argument les données d'un produit (récupéré sur l'API grâce à fetch) pour les ajouter à la section "items" de la page d'accueil*/    
function displayProduct(product) {
    let id = product._id
    let image = product.imageUrl
    let alt = product.altTxt
    let name = product.name
    let description = product.description
    let productCard = `
    <a href="./product.html?id=${id}">
        <article>
            <img src="${image}" alt="${alt}">
            <h3 class="productName">${name}</h3>
            <p class="productDescription">${description}</p>
        </article>
    </a> `
    document.getElementById("items").innerHTML += productCard
    
}
