import{generateFilters, generatePhotos, generateWorks} from "./works.js";
let modal = null;
const focusableSelector = "button, a, input, textarea";
let focusables = [];
let token = window.sessionStorage.getItem('token');

const openModal = function (e) {
    e.preventDefault();
    modal = document.querySelector(e.target.getAttribute("href"));
    focusables = Array.from(modal.querySelectorAll(focusableSelector));
    modal.style.display = null;
    modal.removeAttribute("aria-hidden");
    modal.setAttribute("aria-modal", "true");
    modal.addEventListener("click", closeModal);
    let closes = modal.querySelectorAll(".js-modal-close");
    for(let i = 0; i < closes.length; i++)
    {
        closes[i].addEventListener("click", closeModal);
    }
    modal.querySelector(".btn-add-photo").addEventListener("click", returnModal);
    modal.querySelector(".js-modal-return").addEventListener("click", returnModal);
    let stops = modal.querySelectorAll(".js-modal-stop");
    for(let i = 0; i < stops.length; i++)
    {
        stops[i].addEventListener("click", stopPropagation);
    }

    document.getElementById("buttonFile").addEventListener("click", triggerAddFile);
    document.getElementById("inputFile").addEventListener("change", checkFile);
    document.getElementById("title").addEventListener("change", checkForm);
    document.getElementById("category-select").addEventListener("change",checkForm);
    document.querySelector(".add-photo-form").addEventListener("submit", sendForm);
    
    let sendValidation = document.querySelector(".send-validation");
    sendValidation.style.display = "none";
    
    const event = new Event("click");
    emptyForm(event);
};

const closeModal = function (e) {
    if(modal === null){ return }   
    e.preventDefault();
    window.setTimeout(function () {
        modal.style.display = "none";
        modal = null;
        // Reinitialise l'état des écrans de la modale
        let modalScreens = document.querySelectorAll(".modal-wrapper");
        modalScreens[0].style.display = null;
        modalScreens[1].style.display = "none";        
        const event = new Event("click");
        emptyForm(event);
    }, 500);
    modal.setAttribute("aria-hidden", "true");
    modal.removeAttribute("aria-modal");    
    modal.removeEventListener("click", closeModal);
    let closes = modal.querySelectorAll(".js-modal-close");
    for(let i = 0; i < closes.length; i++)
    {
        closes[i].removeEventListener("click", closeModal);
    }
    modal.querySelector(".btn-add-photo").removeEventListener("click", returnModal);
    modal.querySelector(".js-modal-return").removeEventListener("click", returnModal);
    let stops = modal.querySelectorAll(".js-modal-stop");
    for(let i = 0; i < stops.length; i++)
    {
        stops[i].removeEventListener("click", stopPropagation);
    }

    document.getElementById("buttonFile").removeEventListener("click", triggerAddFile);
    document.getElementById("inputFile").removeEventListener("change", checkFile);
    document.querySelector(".add-photo-form").removeEventListener("submit", sendForm);
    
    let sendValidation = document.querySelector(".send-validation");
    sendValidation.style.display = "none";
};

const returnModal = function (e) {
    if(modal === null){ return }   
    e.preventDefault();    
    let modalScreens = document.querySelectorAll(".modal-wrapper");
    for(let i = 0; i < modalScreens.length; i++)
    {
        if(modalScreens[i].style.display === "none")
        {
            modalScreens[i].style.display = null;
        }
        else
        {
            modalScreens[i].style.display = "none";
        }
    }
    const event = new Event("click");
    emptyForm(event);

    let sendValidation = document.querySelector(".send-validation");
    sendValidation.style.display = "none"; 
}

const triggerAddFile = function (e) {    
    e.preventDefault();    
    document.getElementById("inputFile").click();
}

const checkFile = function (e) 
{   
    e.preventDefault();
    let fileLimit = 4; // 4Mo max
    let fileInput = document.getElementById("inputFile");
    let files = fileInput.files;
    let fileSize = files[0].size;
    let fileSizeInMo = fileSize / (1024*1024).toFixed(2);
    let errorBadFile = document.querySelector(".file-bad");
    let errorBigFile = document.querySelector(".file-big");
    errorBadFile.style.display = "none";
    errorBigFile.style.display = "none";
    
    var filePath = fileInput.value;
    // Allowed file extensions
    var allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
    if (!allowedExtensions.exec(filePath)) 
    {        
        errorBadFile.style.display = null;
        alert("Format de fichier invalide");       

        if(fileInput.value){ //for IE5 ~ IE10
            var form = document.createElement('form'),
                parentNode = fileInput.parentNode, ref = fileInput.nextSibling;
            form.appendChild(fileInput);
            form.reset();
            parentNode.insertBefore(fileInput,ref);
        }
        return false;
    }
    else
    {
        let imgSlot = document.querySelector(".previewImg");
        let imgContainer = document.querySelector(".preview-container");
        let addFileContainer = document.querySelector(".add-file-container");
        
        if(fileSizeInMo < fileLimit)
        {          
            let reader = new FileReader();
            reader.readAsDataURL(files[0]);
            reader.onload = function(event){
                                   
                imgSlot.src = event.target.result;
                imgContainer.style.display = null;
                addFileContainer.style.display = "none";
                let tempEvent = new Event("click");
                checkForm(tempEvent);
            }
            
            errorBadFile.style.display = "none";            
            errorBigFile.style.display = "none";
        }
        else
        {            
            errorBigFile.style.display = null;
            alert("Fichier trop volumineux");
                        
            if(fileInput.value){
                var form = document.createElement('form'),
                    parentNode = fileInput.parentNode, ref = fileInput.nextSibling;
                form.appendChild(fileInput);
                form.reset();
                parentNode.insertBefore(fileInput,ref);
            }
            imgSlot.src = "";
            return false;
        }
    }
}

const checkForm = function (e) {   
    e.preventDefault();
    let fileInput = document.querySelector("#inputFile");
    let title = document.getElementById("title");
    let category = document.getElementById("category-select");
    let btnSubmit = document.querySelector(".btn-validation");
    
    if(fileInput.value != "" && title.value !== "" && category.value !== "")
    {
        btnSubmit.removeAttribute("disabled");
    }
    else
    {
        btnSubmit.setAttribute("disabled", "");
    }
}

const sendForm = async function (e) {   
    e.preventDefault();

    let fileInput = document.querySelector("#inputFile");
    let file = fileInput.files[0];    
    let titleName = document.querySelector("#title");
    let categoryId = document.getElementById("category-select");

    const data = new FormData();

    data.append("image", file);
    console.log(data.get("image"));

    data.append("title", titleName.value);
    console.log(data.get("title"));

    data.append("category", categoryId.selectedIndex);
    console.log(data.get("category"));

    console.log('Bearer ' + token);
    const response = await fetch("http://localhost:5678/api/works",{
        method: 'POST',
        headers: {
            "accept": "application/json",
            "Authorization": 'Bearer ' + token            
        },
        body: data
    });

    console.log(response.status);
            
    if(response.status == "201")
    {        
        // Actualise les différents éléments de la page                
        //Récupération des travaux depuis l'API
        const reponse = await fetch('http://localhost:5678/api/works');    
        let works = await reponse.json();
        generateWorks(works);
        generatePhotos(works);
        generateFilters(works);
        let sendValidation = document.querySelector(".send-validation");
        sendValidation.style.display = null;
    }

    const event = new Event("click");
    emptyForm(event);
}

const emptyForm = function (e) {   
    e.preventDefault();
    let form = document.querySelector(".add-photo-form");
    let imgSlot = document.querySelector(".previewImg");
    let imgContainer = document.querySelector(".preview-container");
    let addFileContainer = document.querySelector(".add-file-container");
    let btnSubmit = document.querySelector(".btn-validation");
    
    imgSlot.src = "";
    imgContainer.style.display = "none";
    addFileContainer.style.display = null;
    form.reset();
    btnSubmit.setAttribute("disabled", "");     
}

const stopPropagation = function(e) {
    e.stopPropagation();
}

const focusInModal = function (e) {
    e.preventDefault();
    let index = focusables.findIndex(f => f === modal.querySelector(":focus"));
    if(e.shiftKey === true)
    {
        index--;
    }
    else
    {
        index++;
    }
    
    if(index >= focusables.length)
    {
        index = 0;
    }
    if(index < 0)
    {
        index = focusables.length - 1;
    }
    focusables[index].focus();
}

document.querySelectorAll(".js-modal").forEach(a => {
    a.addEventListener("click", openModal);    
});

window.addEventListener("keydown", function(e){
    if(e.key === "Escape" || e.key === "Esc")
    {
        closeModal(e);
    }

    if(e.key === "Tab" && modal !== null)
    {
        focusInModal(e);
    }
});
