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
  cart.forEach(displayProductsInCart)
  changingQuantity();
  addPriceAndArticleToTotal()
  changePriceAndArticleInTotal()
  deleteItemFromLocalStorage()
}

function deleteItemFromLocalStorage() {
  let deleteButtons = document.getElementsByClassName('deleteItem');
  const arrElement2 = Array.from(deleteButtons)
  console.log(arrElement2)
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

function addPriceAndArticleToTotal() {
  const cart = getCart()
  cart.forEach(element => totalArticles += Number(element.quantity));
  cart.forEach(element => getTotalPrice(element))
  document.getElementById("totalQuantity").innerHTML = totalArticles
  document.getElementById("totalPrice").innerHTML = totalPrice
}

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

function getTotalPrice(product) {
  let id = product.id
  let quantity = product.quantity
  let correctProductInApi = apiProducts.find(element => element._id == id)
  var price = Number(correctProductInApi.price) * Number(quantity)
  totalPrice += price
}

function changingQuantity() {
  let inputs = document.getElementsByClassName('itemQuantity');
  const arrElement = Array.from(inputs)
  console.log(arrElement)
  arrElement.forEach(element => {
    element.addEventListener('change', function (event) {
      let correctArticle = element.closest('article')
      let correctId = correctArticle.getAttribute("data-id")
      const cart = getCart()
      let correctObject = cart.find(element => element.id == correctId)
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

function getCart() {
  return JSON.parse(localStorage.getItem("cartKey"))
}
