const loginUrl = 'http://localhost:5678/api/users/login';
const loginForm = document.getElementById('login-form');

// la méthode addEventListener permet d'ajouter un écouteur d'évènement sur l'évènement (submit) du formulaire
// les valeurs (email et password) seront envoyées à l'API pour connexion
// ensuite on envoie une requête HTTP de type POST à l'API en utilisant la méthode fetch

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loginData = { email: email, password: password };

    try {
        const response = await fetch(loginUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData)
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            window.location.href = './admin.html';

        } else {
            throw new Error("Mauvais identifiants");

        }

    } catch (error) {
        console.error("Erreur lors de l'appel à l'API:", error);
        document.querySelector('#error').textContent = error.message;
    }
});

