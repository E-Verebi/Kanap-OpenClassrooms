/*La fonction getProducts retourne le contenu de l’API sous forme de tableau, ce tableau contient tous les produits disponibles sous formes d’objets.*/
async function getProducts() {
    const response = await fetch('http://localhost:3000/api/products')
        .catch(err => {
            alert("Impossible de traiter la demande, veuillez réessayer plus tard.");
        });
    const jsonData = await response.json();
    return jsonData;
}
let apiProducts = []

window.onload = async function () {
    apiProducts = await getProducts();
    apiProducts.forEach(displayProduct);
}

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
