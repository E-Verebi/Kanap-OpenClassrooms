window.onload = function () {
    let cartButton = document.getElementById("addToCart")
    cartButton.onclick = addProductToCart;
}

let urlId = new URLSearchParams(window.location.search).get('id')
console.log(urlId)

/*Grâce à l’ID récupéré dans l’URL, fetch va pouvoir appeler l’API correspondant au bon produit*/
fetch(`http://localhost:3000/api/products/${urlId}`)
    .then((response) => response.json())
    .then((data) => {
        console.log(data.colors)
        displayProduct2(data)
        data.colors.forEach(displayColors)
    })
    .catch(err => {
        alert("Impossible de traiter la demande, veuillez réessayer plus tard.");
    });

/*La fonction displayProduct2 récupère en argument les données du produit (récupéré sur l'API grâce à fetch) pour ajouter ses caractéristiques sur la page*/
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

/*Utilisée avec data.colors.forEach, la fonction displayColors récupère les couleurs disponibles de l’API du produit et les affiche dans le menu déroulant*/
function displayColors(colorsArray) {
    document.getElementById("colors").innerHTML += `<option value="${colorsArray}">${colorsArray}</option>`
}

/*La fonction addProductToCart ajoute sous forme d’objet l’ID, la couleur, et la quantité du produit demandé dans le tableau récupéré par getCart. La fonction n’autorise pas l’utilisateur à ajouter un produit si une couleur ou une quantité n’est pas sélectionnée. La fonction permet également de ne pas créer de nouvel objet dans le tableau si celui-ci existe déjà, et remplace donc la quantité de l’objet concerné*/
function addProductToCart() {
    const cart = getCart()
    const productToAdd = {
        id: urlId,
        color: document.getElementById("colors").value,
        quantity: document.getElementById("quantity").value,
    }
    if (productToAdd.color == "" || productToAdd.quantity == "0") { alert("Sélection invalide") } else {
        const existingProduct = cart.find(element => element.id == urlId && element.color == document.getElementById("colors").value)
        if (existingProduct !== undefined) {
            existingProduct.quantity = String(Number(existingProduct.quantity) + Number(productToAdd.quantity))
            localStorage.setItem("cartKey", JSON.stringify(cart))
            alert("Produit ajouté au panier !")
        } else {
            cart.push(productToAdd)
            localStorage.setItem("cartKey", JSON.stringify(cart))
            alert("Produit ajouté au panier !")
        }
    }
}

/*La fonction getCart retourne le contenu de localStorage sous forme de tableau*/
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
