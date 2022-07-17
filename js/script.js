// Commencer par envoyer une requête de type "get" pour récupérer les données de l'API avec la fonction fetch : 
fetch("http://localhost:3000/api/products")
.then((res) => res.json())
.then((data) => {
      ajoutProduits(data)
})
.catch(function(err) {
    // Une erreur est survenue
  });
// On va utiliser une loop "forEach" afin d'appliquer les fonctions pour chaque produit :
function ajoutProduits(data) {  
    data.forEach((canap) => {
        const { _id, imageUrl, altTxt, name, description} = canap
        const lien = lienA(_id)
        const image = makeImage(imageUrl, altTxt)
        const article = document.createElement("article")
        const h3 = makeH3(name)
        const p = makeParagraph(description)        
        ajouterElementsAArticle(article, image, h3, p)
        ajouterAuLien(lien, article)
    });
    }
    
// Créer le lien "a", l'article, img, h3, et p sous forme de fonction :

function lienA(id) {
    const lien = document.createElement("a")
    lien.href = "./product.html?id=" +id
    return lien
}

function makeImage(imageUrl, altTxt) {
    const image = document.createElement("img")
    image.src = imageUrl
    image.alt = altTxt
    return image
}

function makeH3(name) {
    const h3 = document.createElement("h3")
    h3.textContent = name
    h3.classList.add("productName")
    return h3
}
function makeParagraph(description) {
    const p = document.createElement("p")
    p.textContent = description
    p.classList.add("productDescription")
    return p
}
// Imbriquer les éléments dans le bon ordre avec la méthode element.appendChild(otherElement) :
//  items contient "a" qui contient article qui contient img, h3, et p.

function ajouterAuLien(lien, article) {
    const items = document.getElementById("items")
        items.appendChild(lien)
        lien.appendChild(article)
}

function ajouterElementsAArticle(article, image, h3, p){
    article.appendChild(image)
    article.appendChild(h3)
    article.appendChild(p)   
}





    

    
    
   


