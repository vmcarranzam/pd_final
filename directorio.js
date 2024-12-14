// Función para cargar entidades desde un archivo JSON
async function loadEntities() {
    try {
        // Cargar el archivo JSON desde la misma carpeta que el HTML y JS
        const response = await fetch('entidades.json');
        
        if (!response.ok) {
            throw new Error(`Error al cargar el archivo JSON: ${response.statusText}`);
        }
        
        const entities = await response.json(); // Convertir el archivo JSON a un objeto JavaScript
        displayEntities(entities); // Llamar a la función para mostrar las entidades
    } catch (error) {
        console.error('Error al cargar las entidades:', error);
        alert('Hubo un error al cargar las entidades. Revisa la consola para más detalles.');
    }
}

// Función para mostrar las entidades en el grid
function displayEntities(entities) {
    const container = document.getElementById('grid-container');
    container.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevas tarjetas

    entities.forEach(entity => {
        const entityDiv = document.createElement('div');
        entityDiv.classList.add('grid-item');
        entityDiv.setAttribute('data-categories', entity.categorias.join(','));

        entityDiv.innerHTML = `
            <img src="${entity.logo}" alt="Logo de ${entity.nombre}">
            <h4>${entity.nombre}</h4>
            <p>Dirección: ${entity.direccion}</p>
            <p>Teléfono: ${entity.telefono}</p>
            <p>Email: <a href="mailto:${entity.email}">${entity.email}</a></p>
        `;
        container.appendChild(entityDiv);
    });

    // Aplicar el filtrado después de mostrar las entidades
    filterEntities();
}

// Filtrado dinámico basado en las categorías seleccionadas
document.querySelectorAll('.filter').forEach(filter => {
    filter.addEventListener('change', filterEntities);
});

function filterEntities() {
    const selectedFilters = Array.from(document.querySelectorAll('.filter:checked')).map(filter => filter.value);
    const items = document.querySelectorAll('.grid-item');

    items.forEach(item => {
        const itemCategories = item.getAttribute('data-categories').split(',');
        if (selectedFilters.length === 0 || selectedFilters.some(filter => itemCategories.includes(filter))) {
            item.style.display = 'block'; // Mostrar la tarjeta
        } else {
            item.style.display = 'none'; // Ocultar la tarjeta
        }
    });
}

// Llamar a la función para cargar las entidades al cargar la página
window.onload = loadEntities;

// script.js
document.getElementById('boton-scroll').addEventListener('click', function() {
    // Desplazarse hacia arriba hasta el inicio de la página
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Hace que el desplazamiento sea suave
    });
  });
  