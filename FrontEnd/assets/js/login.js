const loginUrl= 'http://localhost:5678/api/users/login';

async function ajoutListenerCreationLogin(){
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
            console.log('Réponse de l\'API:', data);
            alert('Connexion réussie !');
          
        } else {
            const errorData = await response.json();
            alert('Erreur: ' + errorData.message || 'Erreur inconnue');
        }

    } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API:', error);
        alert('Une erreur est survenue, veuillez réessayer plus tard.');
    }
});
}
