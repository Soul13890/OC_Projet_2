//Récupération des travaux depuis l'API
const responseWork = await fetch('http://localhost:5678/api/works');   
let works = await responseWork.json();

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