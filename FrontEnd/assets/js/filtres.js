document.addEventListener('DOMContentLoaded', async () => {
    let categories= null
    async function getCategories(){
      try {
        const response = await fetch('http://localhost:5678/api/categories');
        if (response.ok){
          categories = await response.json();
          return categories
        }
        throw new Error ("erreur dans lee fetch")
      } catch (erreur){
        return erreur
      }
      
    }
    
    try {
        const response = await fetch('http://localhost:5678/api/categories');

        if (response.ok) {
            categories = await response.json();
            console.log(categories)
            const filtreContainer = document.getElementById('filtre-container');
            const divall=document.createElement("div")
            divall.classList.add('espacefiltre');
            const btn= document.createElement("a");
            btn.classList.add("selected")
            btn.href= "#";
            btn.classList.add('filtre-link');
            btn.textContent = "tous";
            divall.appendChild(btn);
            filtreContainer.appendChild(divall);

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



window.filterByCategory = (categoryName) => {
    let result = [];

    if (categoryName === "Tous") {
      return tab;  
    }
    return categories.filter(item => item.name === categoryName);
  }
  

