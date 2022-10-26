window.onload = async function () {
    localStorage.clear()
    displayOrderId()
}


function displayOrderId () {
    let orderId = new URLSearchParams(window.location.search).get('orderId')
    let orderIdSpan = document.getElementById("orderId")
    orderIdSpan.innerHTML = orderId
}