let token = window.sessionStorage.getItem('token');

if(token !== null)
{
    const navLogin = document.querySelector(".nav-login");
    navLogin.innerText = "logout";    
}

//Récupération des travaux depuis l'API
const responseWork = await fetch('http://localhost:5678/api/works');   
let works = await responseWork.json();

//Récupération des catégories depuis l'API
const responseCategories = await fetch('http://localhost:5678/api/categories');    
let categories = await responseCategories.json();

function generateWorks(works)
{
    // Récupération de l'élément du DOM qui accueillera les fiches
    const sectionFiches = document.querySelector(".gallery");
    sectionFiches.innerHTML = "";

    for(let i = 0; i < works.length; i++)
    {
        const work = works[i];
        
        // Création d’une balise dédiée à un projet
        const workElement = document.createElement("figure");
        // Création des balises
        const imageElement = document.createElement("img");
        imageElement.src = work.imageUrl;
        imageElement.alt = work.title;
        const nomElement = document.createElement("figcaption");
        nomElement.innerText = work.title;
        
        // On rattache la balise figure à la section gallery
        sectionFiches.appendChild(workElement);
        workElement.appendChild(imageElement);
        workElement.appendChild(nomElement);       
    }
}

generateWorks(works);

// Gestion des boutons
function generateFilters(works)
{ 
    // Création du bouton "Tous"
    const buttonContainer = document.querySelector(".filters");
    buttonContainer.innerHTML = "";
    const buttonAllElement = document.createElement("button");
    buttonAllElement.innerText = "Tous";    
    buttonAllElement.classList.add("active");
    buttonAllElement.addEventListener("click", function () {
        // Vidage de la galerie
        const gallery = document.querySelector(".gallery");
        gallery.innerHTML = "";
        // Enlever la classe active de tous les filtres
        for(let i = 0; i < buttonContainer.children.length; i++)
        {
            if(buttonContainer.children[i].classList.contains("active"))
            {
                buttonContainer.children[i].classList.remove("active");
            }
        }
        // Activer le bouton concerné
        buttonAllElement.classList.add("active");
        generateWorks(works);
    });
    buttonContainer.appendChild(buttonAllElement);

    // Récupération des différentes catégories
    const categoriesSet = new Set();
    for(let i = 0; i < categories.length; i++)
    {
        if(!categoriesSet.has(categories[i].name))
        {
            categoriesSet.add(categories[i].name);
        }
    }

    // Création d'un bouton de filtrage pour chaque catégories existantes
    for(let item of categoriesSet)
    {
        const buttonTemp = document.createElement("button");
        buttonTemp.innerText = item;        
        buttonTemp.addEventListener("click", function () {
            // Empty the gallery
            const gallery = document.querySelector(".gallery");
            gallery.innerHTML = "";
            // Enlever la classe active de tous les filtres
            for(let i = 0; i < buttonContainer.children.length; i++)
            {
                if(buttonContainer.children[i].classList.contains("active"))
                {
                    buttonContainer.children[i].classList.remove("active");
                }
            }
            // Activer le bouton concerné
            buttonTemp.classList.add("active");
            // Repopulate the gallery
            const worksFiltered = works.filter(function (work){
            return work.category.name === item;           
            });
            generateWorks(worksFiltered);
        });
        buttonContainer.appendChild(buttonTemp);
    }
}

generateFilters(works);