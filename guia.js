document.addEventListener("DOMContentLoaded", () => {
    // Cargar los datos de deficiencias.json y condiciones.json
    Promise.all([
        fetch("deficiencias.json").then(response => response.json()),
        fetch("condiciones.json").then(response => response.json())
    ]).then(([deficiencias, condiciones]) => {
        const container = document.getElementById("cards-container");

        deficiencias.forEach(deficiencia => {
            // Crear la tarjeta
            const card = document.createElement("div");
            card.classList.add("card");

            // Imagen de la tarjeta
            const img = document.createElement("img");
            img.src = deficiencia.icon;
            img.alt = deficiencia.nombre;
            card.appendChild(img);

            // Contenido de la tarjeta
            const content = document.createElement("div");
            content.classList.add("card-content");

            // Nombre y descripción
            const title = document.createElement("h3");
            title.textContent = deficiencia.nombre;
            content.appendChild(title);

            const description = document.createElement("p");
            description.textContent = deficiencia.descripcion;
            content.appendChild(description);

            // Botón Ver condiciones
            const button = document.createElement("button");
            button.textContent = "Ver condiciones";
            content.appendChild(button);

            // Sección para el slideshow
            const slideshowContainer = document.createElement("div");
            slideshowContainer.classList.add("slideshow-container");
            slideshowContainer.style.display = "none"; // Oculto al inicio

            let currentSlide = 0;

            // Obtener y mostrar condiciones relacionadas con el tag
            const relatedConditions = condiciones.filter(condicion => condicion.categoria === deficiencia.tag);

            // Crear slides y puntos de navegación
            relatedConditions.forEach((condicion, index) => {
                const slide = document.createElement("div");
                slide.classList.add("slide");
                slide.style.display = index === 0 ? "block" : "none"; // Mostrar solo la primera

                const conditionImage = document.createElement("img");
                conditionImage.src = condicion.imagen;
                conditionImage.alt = condicion.nombre;
                slide.appendChild(conditionImage);

                const conditionName = document.createElement("h4");
                conditionName.textContent = condicion.nombre;
                slide.appendChild(conditionName);

                const conditionSymptoms = document.createElement("p");
                conditionSymptoms.textContent = `Síntomas: ${condicion.sintomas}`;
                slide.appendChild(conditionSymptoms);

                const conditionCauses = document.createElement("p");
                conditionCauses.textContent = `Causas: ${condicion.causas}`;
                slide.appendChild(conditionCauses);

                const conditionPreclinical = document.createElement("p");
                conditionPreclinical.textContent = `Preclínico: ${condicion.preclinico}`;
                slide.appendChild(conditionPreclinical);

                slideshowContainer.appendChild(slide);
            });

            // Crear controles de navegación
            const prevButton = document.createElement("button");
            prevButton.classList.add("prev");
            prevButton.textContent = "❮";
            prevButton.onclick = () => changeSlide(-1);
            slideshowContainer.appendChild(prevButton);

            const nextButton = document.createElement("button");
            nextButton.classList.add("next");
            nextButton.textContent = "❯";
            nextButton.onclick = () => changeSlide(1);
            slideshowContainer.appendChild(nextButton);

            // Puntos de navegación
            const dotsContainer = document.createElement("div");
            dotsContainer.classList.add("dots-container");

            relatedConditions.forEach((_, index) => {
                const dot = document.createElement("span");
                dot.classList.add("dot");
                dot.onclick = () => setCurrentSlide(index);
                dotsContainer.appendChild(dot);
            });
            slideshowContainer.appendChild(dotsContainer);

            // Función para cambiar de slide
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
                    slide.style.display = index === currentSlide ? "block" : "none";
                });

                dots.forEach((dot, index) => {
                    dot.classList.toggle("active", index === currentSlide);
                });
            }

            // Toggle del slideshow y texto del botón
            button.addEventListener("click", () => {
                const isHidden = slideshowContainer.style.display === "none";

                // Cambia el estado del slideshow
                slideshowContainer.style.display = isHidden ? "block" : "none";

                // Actualiza el texto del botón
                button.textContent = isHidden ? "Ocultar condiciones" : "Ver condiciones";
            });

            content.appendChild(slideshowContainer);
            card.appendChild(content);
            container.appendChild(card);
        });
    }).catch(error => console.error("Error al cargar los archivos JSON:", error));
});
