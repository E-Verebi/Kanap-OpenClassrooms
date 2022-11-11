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
let totalArticles = 0
let totalPrice = 0

window.onload = async function () {
  apiProducts = await getProducts()
  const cart = getCart()
  console.log(cart)
  cart.forEach(displayProductsInCart)
  changingQuantity();
  addPriceAndArticleToTotal()
  changePriceAndArticleInTotal()
  deleteItemFromLocalStorage()
  isTheFormValid()
  orderOnClick()
}

/*La fonction deleteItemFromLocalStorage permet de supprimer l’objet correspondant au produit du localStorage, supprime son élément dans le DOM pour le rendre inaccessible à l’utilisateur, et met à jour le total des prix et articles*/
function deleteItemFromLocalStorage() {
  let deleteButtons = document.getElementsByClassName('deleteItem');
  const arrElement2 = Array.from(deleteButtons)
  arrElement2.forEach(element => {
    element.addEventListener('click', function (event) {
      let correctArticle = element.closest('article')
      let correctId = correctArticle.getAttribute("data-id")
      let correctColor = correctArticle.getAttribute("data-color")
      let cart = getCart()
      let correctObject = cart.find(element => element.id == correctId && element.color == correctColor)
      let indexOfCorrectObject = cart.indexOf(correctObject)
      cart.splice(indexOfCorrectObject, 1)
      localStorage.setItem("cartKey", JSON.stringify(cart))
      correctArticle.remove()
      totalArticles = 0
      totalPrice = 0
      addPriceAndArticleToTotal()
    })
  })
}

/*La fonction addPriceAndArticleToTotal récupère le contenu du panier et ajoute aux variables déclarées au préalable à 0 (totalArticles et totalPrice) les prix et quantités correspondants*/
function addPriceAndArticleToTotal() {
  const cart = getCart()
  cart.forEach(element => totalArticles += Number(element.quantity));
  cart.forEach(element => getTotalPrice(element))
  document.getElementById("totalQuantity").innerHTML = totalArticles
  document.getElementById("totalPrice").innerHTML = totalPrice
}

/*La fonction changePriceAndArticleInTotal est en écoute sur les inputs de changement de quantité, lors d’un changement, les variables totalArticles et totalPrice sont remises à 0 et un nouveau calcul du contenu du panier est effectué grâce à addPriceAndArticleToTotal*/
function changePriceAndArticleInTotal() {
  let inputs = document.getElementsByClassName('itemQuantity');
  const arrElement = Array.from(inputs)
  arrElement.forEach(element => {
    element.addEventListener('change', function () {
      totalArticles = 0
      totalPrice = 0
      addPriceAndArticleToTotal()
    })
  })
}

/*Pour le produit concerné dans le panier, la fonction getTotalPrice récupère le prix total du même produit (prix unitaire * quantité) et l’ajoute à la variable totalPrice*/
function getTotalPrice(product) {
  let id = product.id
  let quantity = product.quantity
  let correctProductInApi = apiProducts.find(element => element._id == id)
  var price = Number(correctProductInApi.price) * Number(quantity)
  totalPrice += price
}

/*La fonction changingQuantity est en écoute sur les inputs de changement de quantité, elle change le contenu du localStorage en conséquence ainsi que le prix du produit dans le panier*/
function changingQuantity() {
  let inputs = document.getElementsByClassName('itemQuantity');
  const arrElement = Array.from(inputs)
  arrElement.forEach(element => {
    element.addEventListener('change', function (event) {
      let correctArticle = element.closest('article')
      let correctId = correctArticle.getAttribute("data-id")
      let correctColor = correctArticle.getAttribute("data-color")
      const cart = getCart()
      let correctObject = cart.find(element => element.id == correctId && element.color == correctColor)
      let newQuantity = event.target.value
      correctObject.quantity = newQuantity
      localStorage.setItem("cartKey", JSON.stringify(cart))
      let correctProductInApi2 = apiProducts.find(element => element._id == correctId)
      let correctTotalPrice = String(Number(correctProductInApi2.price) * Number(newQuantity))
      let replacement = `<p>${correctTotalPrice} € (${correctProductInApi2.price} € x ${newQuantity})</p>`
      let lastParagraphOfDiv = correctArticle.querySelector(".cart__item__content__description").lastElementChild
      console.log(lastParagraphOfDiv)
      lastParagraphOfDiv.innerHTML = replacement
    })
  })

}

/*Utilisée sur chaque produit du panier grâce à cart.forEach , la fonction displayProductsInCart permet d’ajouter du code HTML permettant l’affichage de tout le panier*/
function displayProductsInCart(product) {
  let id = product.id
  let color = product.color
  let quantity = product.quantity
  let correctProductInApi = apiProducts.find(element => element._id == id)
  let image = correctProductInApi.imageUrl
  let alt = correctProductInApi.altTxt
  let name = correctProductInApi.name
  let price = String(Number(correctProductInApi.price) * Number(quantity))
  let cartElement = `
    <article class="cart__item" data-id="${id}" data-color="${color}">
            <div class="cart__item__img">
              <img src="${image}" alt="${alt}">
            </div>
            <div class="cart__item__content">
              <div class="cart__item__content__description">
                <h2>${name}</h2>
                <p>${color}</p>
                <p>${price} € (${correctProductInApi.price} € x ${quantity})</p>
              </div>
              <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                  <p>Qté : </p>
                  <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${quantity}">
                </div>
                <div class="cart__item__content__settings__delete">
                  <p class="deleteItem">Supprimer</p>
                </div>
              </div>
            </div>
          </article> `
  document.getElementById("cart__items").innerHTML += cartElement
}

/*La fonction getCart retourne le contenu de localStorage sous forme de tableau*/
function getCart() {
  if (JSON.parse(localStorage.getItem("cartKey") == null)) { return [] } else {
    return JSON.parse(localStorage.getItem("cartKey"))
  }
}

var contact = { "firstName": "", "lastName": "", "address": "", "city": "", "email": "" };
console.log(contact)
var produits = []

/*La fonction isTheFormValid regroupe les vérifications de chaque input et s'assure également que les valeurs des inputs redeviennent "" à chaque chargement de la page*/
function isTheFormValid() {
  document.querySelectorAll('.cart__order__form__question input').forEach(element => element.value = "")
  isItValid("firstName", /^\D{1,}$/)
  isItValid("lastName", /^\D{1,}$/)
  isItValid("city", /^\D{1,}$/)
  isItValid("address", /^(?=.*\d).{3,}$/)
  isItValid("email", /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
}

/*La fonction isItValid prend pour les 5 inputs de la page un id et un regex, elle valide ou non les données rentrées par l'utilisateur et les ajoute à l'objet contact qui sera envoyé à l'API*/
function isItValid(inputId, regex) {
  let contactInput = document.getElementById(inputId)
  contactInput.addEventListener('change', function (event) {
    let inputContent = event.target.value
    let isItValid = regex.test(inputContent)
    let errorMsgP = document.getElementById(`${inputId}ErrorMsg`)
    if (isItValid == true) {
      contact[inputId] = inputContent
      errorMsgP.innerHTML = ""
      console.log(contact)
    }
    else {
      errorMsgP.innerHTML = "Format incorrect"
      contact[inputId] = ""
      console.log(contact)
    }
  })
}

/*La fonction orderOnClick déclenche la requête POST si le panier n'est pas vide et si le formulaire est valide*/
function orderOnClick() {
  let orderButton = document.getElementById("order")
  orderButton.addEventListener('click', function (e) {
    e.preventDefault()
    cart = getCart()
    console.log(cart.length)
    if (cart.length == 0) { alert("Panier vide !") }
    else {
      if (Object.values(contact).includes('')) { alert("Formulaire incomplet !") }
      else { postRequest() }
    }
  })
}

/*La fonction postRequest envoie à l'API les données de contact et les id des produits commandés regroupés en un seul objet. L'id de la commande est récupéré et intégré à l'URL de la page de confirmation*/
function postRequest() {
  var produits = []
  cart.forEach(element => produits.push(element.id))
  var toPost = {
    contact: contact,
    products: produits
  }
  let config = {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(toPost)
  };
  fetch("http://localhost:3000/api/products/order", config)
    .then(res => res.json())
    .then(data => window.location.href = "./confirmation.html?orderId=" + data.orderId)
    .catch(err => {
      alert("Impossible de traiter la demande, veuillez réessayer plus tard.");
    });
}
