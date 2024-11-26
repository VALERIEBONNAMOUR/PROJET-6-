[
    { "id": "1,2,3", "name": "Tous" },
    { "id": "1", "name": "Objets" },
    { "id": "2", "name": "Appartements" },
    { "id": "3", "name": "Hotels & restaurants" }
]

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('http://localhost:5678/api/categories');

        if (response.ok) {
            const categories = await response.json();
            const filtreContainer = document.getElementById('filtre-container');

            categories.forEach(category => {
                const div = document.createElement('div');
                div.classList.add('espacefiltre');

                const a = document.createElement('a');
                a.href = `#${category.id}`;
                a.classList.add('filtre-link');
                a.textContent = category.name;

                a.addEventListener('click', (event) => {
                    event.preventDefault();
                    const allFilters = document.querySelectorAll('.filtre-link');
                    allFilters.forEach(link => link.classList.remove('selected'));
                    a.classList.add('selected');
                });

                div.appendChild(a);
                filtreContainer.appendChild(div);
            });
        } else {
            console.error('Erreur lors de la récupération des filtres', response.status);
        }
    } catch (error) {
        console.error('Erreur de réseau:', error);
    }
});

