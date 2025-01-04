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
            window.location.href = './admin.html'; 

        }else{
            throw new Error("Mauvais identifiants");

        }

    } catch (error) {
        console.error("Erreur lors de l'appel à l'API:", error);
        document.querySelector('#error').textContent = error.message;
    }
});

