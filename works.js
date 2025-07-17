let token = window.sessionStorage.getItem('token');

//Récupération des travaux depuis l'API
const responseWork = await fetch('http://localhost:5678/api/works');   
let works = await responseWork.json();

//Récupération des catégories depuis l'API
const responseCategories = await fetch('http://localhost:5678/api/categories');    
let categories = await responseCategories.json();

if(token !== null)
{
    const navLogin = document.querySelector(".nav-login");
    navLogin.innerText = "logout";
    const divModal = document.querySelector(".div-modal");
    divModal.style.display = null;
    const btnModify = document.querySelector(".btn-modify");
    btnModify.style.display = null;
}

export function generateWorks(works)
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
export function generateFilters(works)
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

export function generatePhotos(works)
{
    // Récupération de l'élément du DOM qui accueillera les fiches
    const galleyPhotos = document.querySelector(".edit-gallery-container");
    galleyPhotos.innerHTML = "";

    for(let i = 0; i < works.length; i++)
    {        
        const work = works[i];        
        // Création d’une balise dédiée à un projet
        const photoElement = document.createElement("figure");
        // Création des balises
        const imageElement = document.createElement("img");
        imageElement.src = work.imageUrl;
        imageElement.alt = work.title;

        const buttonElement = document.createElement("button");       
        const iconElement = document.createElement("i");
        //Suppression d'un élément      
        buttonElement.addEventListener("click", async function(e){
            e.preventDefault();
            const workURL = "http://localhost:5678/api/works/" + works[i].id;
            const response = await fetch(workURL,{
                method: "DELETE",
                headers: {
                "Accept": "*/*",
                "Authorization": 'Bearer ' + token
                }
            });
            
            if(response.status == "204")
            {   
                // Actualise les différents éléments de la page                
                //Récupération des travaux depuis l'API
                const reponse = await fetch('http://localhost:5678/api/works');    
                works = await reponse.json();
                // Transformation des travaux en JSON
                const valeurWorks = JSON.stringify(works);
                // Stockage des informations dans le localStorage
                window.localStorage.setItem("works", valeurWorks);
                generateWorks(works);
                generatePhotos(works);
                generateFilters(works);
            }
        });
        iconElement.classList.add("fa-solid");
        iconElement.classList.add("fa-trash-can");
        
        // On rattache la balise figure à la section gallery
        galleyPhotos.appendChild(photoElement);
        photoElement.appendChild(imageElement);
        photoElement.appendChild(buttonElement);
        buttonElement.appendChild(iconElement);
    }
}

generatePhotos(works);

function generateCategories(categories)
{
    // Récupération de l'élément du DOM qui accueillera les options
    const categorySelector = document.querySelector("#category-select");
    // Création d’une balise dédiée à une option de défaut
    const optionElement = document.createElement("option");        
    optionElement.value = "";
    optionElement.innerHTML = "Veuillez choisir une catégorie";
        
    // On rattache la balise option de défaut au select
    categorySelector.appendChild(optionElement);

    // On crée le reste des catégories
    for(let i = 0; i < categories.length; i++)
    {  
        const category = categories[i];    
       
        // Création d’une balise dédiée à une option de catégorie
        const optionElement = document.createElement("option");        
        optionElement.value = category.name;
        optionElement.innerHTML = category.name;
        
        // On rattache la balise option au select
        categorySelector.appendChild(optionElement);  
    }
}

generateCategories(categories);

