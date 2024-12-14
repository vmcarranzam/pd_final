document.addEventListener("DOMContentLoaded", () => {
    // Cargar los datos de deficiencias.json, condiciones.json y entidades.json
    Promise.all([
        fetch("deficiencias.json").then(response => response.json()),
        fetch("condiciones.json").then(response => response.json()),
        fetch("entidades.json").then(response => response.json())
    ])
    .then(([deficiencias, condiciones, entidades]) => {
        const deficienciasContainer = document.getElementById("deficiencias-container");
        const gridContainer = document.getElementById("grid-container");
        const showCentersButton = document.getElementById("showCentersButton");

        // Mostrar las deficiencias seleccionadas
        const selectedCategories = JSON.parse(sessionStorage.getItem("selectedCategories")) || [];
        const filteredDeficiencias = deficiencias.filter(def => selectedCategories.includes(def.tag));
        displayDeficiencias(filteredDeficiencias, condiciones);

        // Configurar el botón para mostrar centros de atención
        showCentersButton.addEventListener("click", () => {
            if (gridContainer.classList.contains("hidden")) {
                gridContainer.classList.remove("hidden");
                showCentersButton.textContent = "Ocultar centros de atención";
                loadEntities(entidades, selectedCategories, gridContainer);
            } else {
                gridContainer.classList.add("hidden");
                showCentersButton.textContent = "Ver posibles centros de atención";
            }
        });
    })
    .catch(error => {
        console.error("Error al cargar los datos:", error);
        alert(`Hubo un error al cargar los datos: ${error.message}`);
    });
});

function displayDeficiencias(deficiencias, condiciones) {
    const deficienciasContainer = document.getElementById("deficiencias-container");
    deficienciasContainer.innerHTML = ''; // Limpia el contenedor antes de agregar nuevas tarjetas

    deficiencias.forEach(def => {
        // Crear la tarjeta
        const card = document.createElement('div');
        card.classList.add('card');

        // Imagen de la tarjeta
        const img = document.createElement('img');
        img.src = def.icon;
        img.alt = def.nombre;
        card.appendChild(img);

        // Contenido de la tarjeta
        const content = document.createElement('div');
        content.classList.add('card-content');

        // Nombre y descripción
        const title = document.createElement('h3');
        title.textContent = def.nombre;
        content.appendChild(title);

        const description = document.createElement('p');
        description.textContent = def.descripcion;
        content.appendChild(description);

        // Botón Mostrar/Ocultar condiciones
        const button = document.createElement('button');
        button.textContent = "Ver condiciones";
        content.appendChild(button);

        // Sección para el slideshow
        const slideshowContainer = document.createElement('div');
        slideshowContainer.classList.add('slideshow-container');
        slideshowContainer.style.display = 'none'; // Oculto al inicio

        let currentSlide = 0;

        // Obtener condiciones relacionadas con el tag
        const relatedConditions = condiciones.filter(condicion => condicion.categoria === def.tag);

        // Crear slides y puntos de navegación
        relatedConditions.forEach((condicion, index) => {
            const slide = document.createElement('div');
            slide.classList.add('slide');
            slide.style.display = index === 0 ? 'block' : 'none'; // Mostrar solo la primera

            const conditionImage = document.createElement('img');
            conditionImage.src = condicion.imagen;
            conditionImage.alt = condicion.nombre;
            slide.appendChild(conditionImage);

            const conditionName = document.createElement('h4');
            conditionName.textContent = condicion.nombre;
            slide.appendChild(conditionName);

            const conditionSymptoms = document.createElement('p');
            conditionSymptoms.textContent = `Síntomas: ${condicion.sintomas}`;
            slide.appendChild(conditionSymptoms);

            const conditionCauses = document.createElement('p');
            conditionCauses.textContent = `Causas: ${condicion.causas}`;
            slide.appendChild(conditionCauses);

            const conditionPreclinical = document.createElement('p');
            conditionPreclinical.textContent = `Preclínico: ${condicion.preclinico}`;
            slide.appendChild(conditionPreclinical);

            slideshowContainer.appendChild(slide);
        });

        // Crear controles de navegación
        const prevButton = document.createElement('button');
        prevButton.classList.add('prev');
        prevButton.textContent = "❮";
        prevButton.onclick = () => changeSlide(-1);
        slideshowContainer.appendChild(prevButton);

        const nextButton = document.createElement('button');
        nextButton.classList.add('next');
        nextButton.textContent = "❯";
        nextButton.onclick = () => changeSlide(1);
        slideshowContainer.appendChild(nextButton);

        // Puntos de navegación
        const dotsContainer = document.createElement('div');
        dotsContainer.classList.add('dots-container');

        relatedConditions.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.onclick = () => setCurrentSlide(index);
            dotsContainer.appendChild(dot);
        });
        slideshowContainer.appendChild(dotsContainer);

        // Funciones de navegación del slideshow
        function changeSlide(n) {
            currentSlide = (currentSlide + n + relatedConditions.length) % relatedConditions.length;
            showSlide();
        }

        function setCurrentSlide(n) {
            currentSlide = n;
            showSlide();
        }

        function showSlide() {
            const slides = slideshowContainer.querySelectorAll(".slide");
            const dots = dotsContainer.querySelectorAll(".dot");

            slides.forEach((slide, index) => {
                slide.style.display = index === currentSlide ? 'block' : 'none';
            });

            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }

        // Toggle del slideshow y texto del botón
        button.addEventListener("click", () => {
            const isHidden = slideshowContainer.style.display === 'none';
            slideshowContainer.style.display = isHidden ? 'block' : 'none';
            button.textContent = isHidden ? 'Ocultar condiciones' : 'Ver condiciones';
            currentSlide = 0; // Reinicia al primer slide al mostrar
            showSlide();
        });

        content.appendChild(slideshowContainer);
        card.appendChild(content);
        deficienciasContainer.appendChild(card);
    });
}

function loadEntities(entidades, selectedCategories, gridContainer) {
    gridContainer.innerHTML = ''; // Limpia el contenedor antes de agregar nuevas entidades

    const filteredEntities = entidades.filter(entity =>
        entity.categorias.some(cat => selectedCategories.includes(cat))
    );

    filteredEntities.forEach(entity => {
        const entityDiv = document.createElement('div');
        entityDiv.classList.add('grid-item');

        entityDiv.innerHTML = `
            <img src="${entity.logo}" alt="Logo de ${entity.nombre}">
            <h4>${entity.nombre}</h4>
            <p>Dirección: ${entity.direccion}</p>
            <p>Teléfono: ${entity.telefono}</p>
            <p>Email: <a href="mailto:${entity.email}">${entity.email}</a></p>
        `;

        gridContainer.appendChild(entityDiv);
    });
}
