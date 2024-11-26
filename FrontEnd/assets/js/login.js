const loginUrl= 'http://localhost:5678/api/users/login';
const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault(); 

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loginData = {email: email,password: password};

    try {
        const response = await fetch(loginUrl, {
            method: 'POST',
            headers: {'Content-Type':'application/json' },
            body: JSON.stringify(loginData)
        });

        if (response.ok) {
            const data = await response.json(); 
            localStorage.setItem('token', data.token);
            // redirection vers la page admin
            window.location.href = '/admin'; 

        }else{
            throw new Error("Mauvais identifiants");

        }

    } catch (error) {
        console.error("Erreur lors de l'appel à l'API:", error);
        document.querySelector('#error').textContent = error.message;
    }
});

// Utilisation du token dans les requêtes suivantes

const token = localStorage.getItem('token');
const protectedUrl = 'http://localhost:5678/api/users/login'; 

async function fetchProtectedData() {
    try {
        const response = await fetch(protectedUrl, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,  
            },
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data); 
        } else {
            throw new Error("Accès non autorisé ou token invalide");
        }
    } catch (error) {
        console.error("Erreur lors de la requête protégée:", error);
    }
}

fetchProtectedData();