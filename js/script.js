fetch("http://localhost:3000/api/products")
.then((res) => res.json())
.then((data) => {
      addProducts(data)
})

// const _id = data[0]._id
function addProducts (canaps) {
    // const imageUrl = canaps[0].imageUrl
    // const altTxt = canaps[0].altTxt
    // const name = canaps[0].name
    // const description = canaps[0].description

  
    canaps.forEach((canap) => {
        console.log("canap:", canap)        
        const { _id, imageUrl, altTxt, name, description} = canap
        
        const anchor = makeAnchor(_id)
        
        const image = makeImage(imageUrl, altTxt)
        const article = document.createElement("article")
        const h3 = makeH3(name)
        const p = makeParagraph(description)        
        AppendElementsToArticle(article, [image, h3, p])
        appendArticleToAnchor(anchor, article)
    });
    }
    
function AppendElementsToArticle(article, array) {
    array.forEach((item) => {
        article.appendChild(item)        
    });
    // article.appendChild(image)
    // article.appendChild(h3)
    // article.appendChild(p)
}


function makeAnchor(id) {
    const anchor = document.createElement("a")
    anchor.href = "./product.html?id=" +id
    return anchor
}

function appendArticleToAnchor(anchor, article) {
    const items = document.getElementById("items")
    if (items != null) {
        items.appendChild(anchor)
        anchor.appendChild(article)
    }

}
function makeImage(imageUrl, altTxt) {
    const image = document.createElement("img")
    image.src = imageUrl
    image.alt = altTxt
    image.removeAttribute("title")
    image.removeAttribute("style")
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

    

    
    
   


