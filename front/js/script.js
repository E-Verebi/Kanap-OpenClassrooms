fetch('http://localhost:3000/api/products')
    .then((response) => response.json())
    .then((data) => {
        console.log (data)
        displayProduct(data[0])
    });

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
    let productSection = document.getElementById("items")
    productSection.append(productCard)
}
