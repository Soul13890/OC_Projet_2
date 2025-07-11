const formulaireLogin = document.querySelector(".login-form");
const formulaireError = document.querySelector(".error");

formulaireLogin.addEventListener("submit", async function (event) {
    event.preventDefault();
    // Création de l'objet de connexion
    const login = {        
        email: event.target.querySelector("[name=email]").value,
        password: event.target.querySelector("[name=password]").value       
    }
    // Création de la charge utile au format JSON
    const chargeUtile = JSON.stringify(login);
    const response = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: chargeUtile  
    });

    // Vérification de la réponse
    console.log(response.status);
    if(response.status == "200")
    {        
        // Accéder au token
        const obj = await response.json();       
        window.location.href = "index.html";

        // Stockage du token dans le localStorage
        window.sessionStorage.setItem("token", obj.token);
    }
    else if(response.status == "401")
    {      
        // Création du message d'erreur
        const errorText = document.createElement("p");
        errorText.innerHTML = "Mot de passe erroné";       
        formulaireError.innerHTML = "";
        formulaireError.appendChild(errorText);        
    }
    else if(response.status == "404")
    {
        // Création du message d'erreur
        const errorText = document.createElement("p");
        errorText.innerHTML = "Cet utilisateur n'existe pas";        
        formulaireError.innerHTML = "";
        formulaireError.appendChild(errorText);
    }
});