/*Dès le chargement de la page de confirmation, le localStorage est vidé afin de vider le panier*/
window.onload = async function () {
    localStorage.clear()
    displayOrderId()
}

/*Afin de ne pas avoir à stocker localement l'id de commande, la fonction displayOrderId va chercher celui-ci dans l'URL de la page, et l'affiche à l'utilisateur*/
function displayOrderId() {
    let orderId = new URLSearchParams(window.location.search).get('orderId')
    let orderIdSpan = document.getElementById("orderId")
    orderIdSpan.innerHTML = orderId
}