
const cart = [];
retrieveItemsFromCache();
cart.forEach((item) => showItem(item));

/*Une fois notre url récupérée on récupére le prix et on le passe à makeCartContent
on ajoute les enfants de l'article pour pouvoir afficher tout ce que contient notre article*/
async function showItem(item) {
  const response = await fetch(
    `http://localhost:3000/api/products/${item.id}`
  );

  const data = await response.json();
  price = data.price;


  const article = makeArticle(item);
  const imageDiv = makeImageDiv(item);
  article.appendChild(imageDiv);
  const cardItemContent = makeCartContent(item,price);
  article.appendChild(cardItemContent);

  displayArticle(article);
  showTotalQtyPrice();

  return data.price;
}

// Le formulaire et le bouton commander : 

const BoutonCommander = document.querySelector("#order")
BoutonCommander.addEventListener("click", (e) => submitForm(e))

function submitForm(e) {
  e.preventDefault()
  if (cart.length === 0) {
    alert("Veuillez sélectionner un article à acheter")
    return
  } 

  if (isFormInvalid()) return
  if (validFirstNameCheck()) return
  if (validLastNameCheck()) return
  if (validAddressCheck()) return
  if (validCityCheck()) return
  if (validEmailCheck()) return
//  Pour envoyer les données vers l'API on utilise fetch en envoyant une requête de type "POST" :
  const body = makeRequestBody()
  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then((res) => res.json())
  .then((data) => {
    const orderId = data.orderId
    window.location.href = "confirmation.html" + "?orderId=" + orderId
 
    return console.log(data)
  })

  
  .catch((err) => console.error(err))
}

// Vérifier que tous les champs du formulaire sont bien remplis : 
function isFormInvalid() {
  const form = document.querySelector(".cart__order__form");
  const inputs = form.querySelectorAll("input");
  const validInputs = Array.from(inputs).filter((input) => input.value !== "");
  if (validInputs.length < 6) {
    alert("Veuillez remplir tous les champs du formulaire");
    return true;
  }
  return false;
}

//vérifie que le prénom est valide
function validFirstNameCheck() {
  const firstName = document.querySelector("#firstName").value;
  const firstNameError = document.querySelector("#firstNameErrorMsg");
  const regex = /^[a-zA-Z\-]+$/;
  if (regex.test(firstName) === false) {
    firstNameError.innerHTML =
      "Les chiffres ou les caractères spéciaux ne sont pas admis";
    firstNameError.style.color = "red";
    firstNameError.style.fontSize = '23px';
    return true;
  }
  return false;
}
//vérifie que le nom est valide
function validLastNameCheck() {
  const lastName = document.querySelector("#lastName").value;
  const lastNameError = document.querySelector("#lastNameErrorMsg");
  const regex = /^[a-zA-Z\-]+$/;
  if (regex.test(lastName) === false) {
    lastNameError.innerHTML =
      "Les chiffres ou les caractères spéciaux ne sont pas admis";
    lastNameError.style.color = "red";
    lastNameError.style.fontSize = '23px';
    return true;
  }
  return false;
}
//vérifie que l'adresse est valide
function validAddressCheck() {
  const address = document.querySelector("#address").value;
  const addressError = document.querySelector("#addressErrorMsg");
  const regex = /^[0-9a-zA-Z '\-éèêëçäàï]*[^ ]$/;
  if (regex.test(address) === false) {
    addressError.innerHTML =
      "Merci de saisir une adresse valide, les caractères spéciaux ne sont pas admis";
    addressError.style.color = "red";
    addressError.style.fontSize = '23px';
    return true;
  }
  return false;
}
//verifie que la ville est valide
function validCityCheck() {
  const city = document.querySelector("#city").value;
  const cityError = document.querySelector("#cityErrorMsg");
  const regex = /^[^ ][a-zA-Z '\-éèêëçäà]*[^ ]$/;
  if (regex.test(city) === false) {
    cityError.innerHTML =
      "Les chiffres ou les caractères spéciaux ne sont pas admis";
    cityError.style.color = "red";
    cityError.style.fontSize = '23px';
    return true;
  }
  return false;
}

//vérifie que l'email est valide
function validEmailCheck() {
  const email = document.querySelector("#email").value;
  const emailError = document.querySelector("#emailErrorMsg");
  const regex = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;
  if (regex.test(email) === false) {
    emailError.innerHTML = "Veuillez entrer une adresse mail valide";
    emailError.style.color = "red";
    emailError.style.fontSize = '23px';
    return true;
  }
  return false;
}


function retrieveItemsFromCache() {
  const numberOfItems = localStorage.length;
  for (let i = 0; i < numberOfItems; i++) {
    const item = localStorage.getItem(localStorage.key(i)) || "";
    const itemObject = JSON.parse(item);
    cart.push(itemObject);
  }
}

function displayItem(item) {
  const article = makeArticle(item);
  const imageDiv = makeImageDiv(item);
  article.appendChild(imageDiv);
  const cardItemContent = makeCartContent(item);
  article.appendChild(cardItemContent);
  displayArticle(article);
  displayTotalQuantity()
  displayTotalPrice()
}
function displayTotalQuantity() {
  const totalQuantity = document.querySelector("#totalQuantity")
  const total = cart.reduce((total, item) => total + item.quantity, 0)
  totalQuantity.textContent = total
}

function  displayTotalPrice() {
  let total = 0
  const totalPrice = document.querySelector("#totalPrice")
  cart.forEach((item) => {
    const totalUnitPrice = item.price * item.quantity
    total += totalUnitPrice
  })
  totalPrice.textContent = total
}

function makeCartContent(item,price) {
  const cardItemContent = document.createElement("div");
  cardItemContent.classList.add("cart__item__content");

  const description = makeDescription(item,price);
  const settings = makeSettings(item);

  cardItemContent.appendChild(description);
  cardItemContent.appendChild(settings);

  return cardItemContent;
}

function makeSettings(item) {
  const settings = document.createElement("div");
  settings.classList.add("cart__item__content__settings");
  addQuantityToSettings(settings, item);
  addDeleteToSettings(settings, item);
  return settings;
}

function addDeleteToSettings(settings, item) {
  const div = document.createElement("div");
  div.classList.add("cart__item__content__settings__delete");
  div.addEventListener("click", () => deleteItem(item))
  const p = document.createElement("p");
  p.textContent = "Supprimer";
  div.appendChild(p);
  settings.appendChild(div);
}

function deleteItem(item) {
  const itemToDelete = cart.findIndex((product) => product.id === item.id && product.color === item.color)
  cart.splice(itemToDelete, 1)
showTotalQtyPrice();
 deleteDataFromCache(item)
 deleteArticleFromPage(item)
}

function deleteArticleFromPage(item) {
  const articleToDelete = document.querySelector(`article[data-id="${item.id}"][data-color="${item.color}"]`)
  articleToDelete.remove()
}

function addQuantityToSettings(settings, item) {
  const quantity = document.createElement("div");
  quantity.classList.add("cart__item__content__settings__quantity");
  const p = document.createElement("p");
  p.textContent = "Qté : ";
  const input = document.createElement("input");
  input.type = "number";
  input.classList.add("itemQuantity");
  input.name = "itemQuantity";
  input.min = "1";
  input.max = "100";
  input.value = item.quantity;
  input.addEventListener("input", () => updatePriceAndQuantity(item.id, input.value, item))
  quantity.appendChild(p);
  quantity.appendChild(input);
  settings.appendChild(quantity)
}
function updatePriceAndQuantity(id, newValue, item) {
const itemToUpdate = cart.find((item) => item.id === id)
itemToUpdate.quantity = Number(newValue)
item.quantity = itemToUpdate.quantity
showTotalQtyPrice();
saveNewDataToCache(item)
}

function deleteDataFromCache(item) {
  const key = `${item.id}-${item.color}`
  localStorage.removeItem(key)
}
function saveNewDataToCache(item) {
  const dataToSave = JSON.stringify(item)
  const key = `${item.id}-${item.color}`
  localStorage.setItem(key, dataToSave)
}

function makeDescription(item,price) {
  const description = document.createElement("div");
  description.classList.add("cart__item__content__description");
  const h2 = document.createElement("h2");
  h2.textContent = item.name;
  const p = document.createElement("p");
  p.textContent = item.color;
  const p2 = document.createElement("p");
  p2.textContent = price + "€";
  description.appendChild(h2);
  description.appendChild(p);
  description.appendChild(p2);
  return description;
}


function displayArticle(article) {
  document.querySelector("#cart__items").appendChild(article);
}
function makeArticle(item) {
  const article = document.createElement("article");
  article.classList.add("cart__item");
  article.dataset.id = item.id;
  article.dataset.color = item.color;
  return article;
}
function makeImageDiv(item) {
  const div = document.createElement("div");
  div.classList.add("cart__item__img");
  const image = document.createElement("img");
  image.src = item.imageUrl;
  image.alt = item.altTxt;
  div.appendChild(image);
  return div;
}

function makeRequestBody() {
  const form = document.querySelector(".cart__order__form")
  const firstName = form.elements.firstName.value
  const lastName = form.elements.lastName.value
  const address = form.elements.address.value
  const city = form.elements.city.value
  const email = form.elements.email.value

  const body = {
    contact: {
      firstName: firstName,
      lastName: lastName,
      address: address,
      city: city,
      email: email
    },
    products: getIdsFromCache()
  }

  console.log(body)
  return body
}
function getIdsFromCache() {
  const numberOfProducts = localStorage.length
  const ids = []
  for (let i = 0; i < numberOfProducts; i++) {
    const key = localStorage.key(i)
    console.log(key)
    const id = key.split("-")[0]
    ids.push(id)
  }
  return ids
}

//Pour récupérer toutes les données des produits qui se trouvent dans l'API
const getItems = async () => {
  let response = await fetch("http://localhost:3000/api/products/");
  return await response.json();
};

//Pour  récupérer tous les prix des produits qui se trouvent dans le localStorage
const getPrice = async () => {
  articles = await getItems();
  let res = [];
  for (let i = 0; i < localStorage.length; i++) {
    let item = localStorage.getItem(localStorage.key(i));
    let data = JSON.parse(item);
    let id_product = data.id;
    result = articles.filter((article) => article._id === id_product);
    res.push(result[0]);
  }
  return res;
};

// Pour Calculer les totaux, prix et quantité et les injecter sur notre page
async function showTotalQtyPrice() {
  let productPrice = await getPrice();
  let totalQuantity = 0;
  let totalPrice = 0;

  document.querySelectorAll(".itemQuantity").forEach((element, i) => {
    totalQuantity += parseInt(element.value);
    totalPrice += productPrice[i].price * parseInt(element.value);
  });
  
  document.getElementById("totalPrice").innerText = totalPrice;
  document.getElementById("totalQuantity").innerText = totalQuantity;
}


