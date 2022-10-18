window.onload = function () {
    let cartButton = document.getElementById("addToCart")
    cartButton.onclick = addProductToCart
}

let urlId = new URLSearchParams(window.location.search).get('id')
console.log(urlId)

fetch(`http://localhost:3000/api/products/${urlId}`)
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

function addProductToCart() {
    const cart = getCart()
    const productToAdd = {
        id: urlId,
        color: document.getElementById("colors").value,
        quantity: document.getElementById("quantity").value,
    }
    console.log(typeof productToAdd.quantity)
    if (productToAdd.color == "" || productToAdd.quantity == "0") { alert("Sélection invalide") } else {
        const existingProduct = cart.find(element => element.id == urlId && element.color == document.getElementById("colors").value)
        if (existingProduct !== undefined) {
            existingProduct.quantity = Number(existingProduct.quantity) + Number(productToAdd.quantity)   
            localStorage.setItem("cartKey", JSON.stringify(cart))
        } else {
            console.log("objet absent")
            cart.push(productToAdd)
            localStorage.setItem("cartKey", JSON.stringify(cart))
        }
    }
}

function getCart() {
    let cartTab
    const cart = localStorage.getItem("cartKey")
    console.log(cart)
    if (cart === null) {
        cartTab = []
        localStorage.setItem("cartKey", JSON.stringify(cartTab))
    } else {
        cartTab = JSON.parse(cart)
    }
    return cartTab
}
