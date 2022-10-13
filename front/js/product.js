let irlId = new URLSearchParams(window.location.search).get('id')
console.log(irlId)

fetch(`http://localhost:3000/api/products/${irlId}`)
    .then((response) => response.json())
    .then((data) => {
        console.log(data.colors)
        displayProduct2(data)
        data.colors.forEach(displayColors)
    });

function displayProduct2(product) {
    let img = product.imageUrl
    let alt = product.altTxt
    let title = product.name
    let price = product.price
    let description = product.description
    document.getElementsByClassName("item__img")[0].innerHTML = `<img src="${img}" alt="${alt}">`
    document.getElementById("title").innerHTML = title
    document.getElementById("price").innerHTML = price
    document.getElementById("description").innerHTML = description
}

function displayColors(colorsArray) {
    document.getElementById("colors").innerHTML += `<option value="${colorsArray}">${colorsArray}</option>`
}