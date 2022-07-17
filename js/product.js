// Avec URLSearchParams.get() on a récupéré la valeur "id" 'parmi les autres paramètres pour chaque produit :
const partieDroiteUrl = window.location.search;
const urlParams = new URLSearchParams(partieDroiteUrl);
const id = urlParams.get("id");

// On utilise fetch() de la façon suivant pour récupérer les données en fonction du produit (donc son "id") :
fetch(`http://localhost:3000/api/products/${id}`)
  .then((response) => response.json())
  .then((res) => handleData(res));

function handleData(canap) {
  const { altTxt, colors, description, imageUrl, name, price } = canap;
  itemPrice = price;
  imgUrl = imageUrl;
  altText = altTxt;
  articleName = name;
  makeImage(imageUrl, altTxt);
  makeTitle(name);
  makePrice(price);
  makeCartContent(description);
  makeColors(colors);
}

function makeImage(imageUrl, altTxt) {
  const image = document.createElement("img");
  image.src = imageUrl;
  image.alt = altTxt;
  const parent = document.querySelector(".item__img");
  parent.appendChild(image);
}
function makeTitle(name) {
  const h1 = document.querySelector("#title");
  if (h1 != null) h1.textContent = name;
}

function makePrice(price) {
  const span = document.querySelector("#price");
  if (span != null) span.textContent = price;
}

function makeCartContent(description) {
  const p = document.querySelector("#description");
  if (p != null) p.textContent = description;
}
// On a utilisé le loop "forEach" afin d'afficher les otpions de couleurs dans "select": 
function makeColors(colors) {
  const select = document.querySelector("#colors");
  if (select != null) {
    colors.forEach((color) => {
      const option = document.createElement("option");
      option.value = color;
      option.textContent = color;
      select.appendChild(option);
    });
  }
}

// La méthode addEventListener sert à écouter le clique sur "Ajouter au panier" et exécuté la fn handleClick : 

const button = document.querySelector("#addToCart");
button.addEventListener("click", handleClick);
function handleClick() {
  {
    const color = document.getElementById("colors").value;
    const quantity = document.getElementById("quantity").value;
    if (isOrderInvalid(color, quantity)) return;

// On a utilisé des "id" et des colors pour pouvoir récuprer le même produit avec deux couleurs différentes :
// localStorage.getItem() récupère les données dans le local storage. 
    const key = `${id}-${color}`
    let item = localStorage.getItem(key)
    if (item == null) {
      saveOrder(color, quantity);
    }
    else {
      let dataCart = JSON.parse(item)
      let totalQuantity = Number(dataCart.quantity) + Number(quantity)
      saveOrder(color, totalQuantity);
    }
    redirectToCart();
  }
}

function saveOrder(color, quantity) {
  const key = `${id}-${color}`
  const data = {
    id: id,
    color: color,
    quantity: Number(quantity),
    // price: itemPrice,
    imageUrl: imgUrl,
    altTxt: altText,
    name: articleName
  };
  // On ajoute les données (quantité et couleur) à local storage avec localStorage.setItem :
  localStorage.setItem(key, JSON.stringify(data));
}

function isOrderInvalid(color, quantity) {
  if (
    color == null ||
    color == "" ||
    quantity == null ||
    quantity == 0 ||
    quantity >= 100
  ) {
    alert(" Veuillez choisir une couleur et une quantité entre 1 et 100 articles");
    return true;
  }
}

function redirectToCart() {
  window.location.href = "cart.html";
}
