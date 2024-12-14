const hamMenu = document.querySelector('.ham-menu');
const offScreenMenu = document.querySelector('.off-screen-menu');

// Toggle del menú al hacer clic en el icono
hamMenu.addEventListener('click', (event) => {
    hamMenu.classList.toggle('active');
    offScreenMenu.classList.toggle('active');
    event.stopPropagation(); // Prevenir que el clic en el icono cierre el menú
});

const menuLinks = document.querySelectorAll('.off-screen-menu a');

// Añadir un evento a cada enlace del menú
menuLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault(); // Evita el comportamiento predeterminado de enlace

        // Cierra el menú
        hamMenu.classList.remove('active');
        offScreenMenu.classList.remove('active');

        const target = link.getAttribute('href');

        // Verifica si el href no contiene "#"
        if (!target.includes('#')) {
            // Si no contiene "#", redirige a la página especificada
            window.location.href = target;
        } else {
            // Si contiene "#", hace scroll suave al elemento dentro de la misma página
            const targetElement = document.querySelector(target);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Cerrar el menú al hacer clic fuera de él
document.addEventListener('click', (event) => {
    // Verificar si el clic ocurrió fuera del menú y del icono de hamburguesa
    if (!offScreenMenu.contains(event.target) && !hamMenu.contains(event.target)) {
        hamMenu.classList.remove('active');
        offScreenMenu.classList.remove('active');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.querySelector('.start-button');
    const welcomeScreen = document.querySelector('.welcome-screen');
    const questionContainer = document.querySelector('.question-container');
    const questionScreens = document.querySelectorAll('.question-screen');
    const progress = document.querySelector('.progress');
    const keywords = ['cognitiva', 'cognitiva', 'cognitiva', 'visual', 'auditiva', 'fisica'];
    let currentQuestionIndex = 0;
    let queryConditions = [];

    // Start questionnaire
    startButton.addEventListener('click', () => {
        welcomeScreen.style.opacity = '0';
        setTimeout(() => {
            welcomeScreen.style.display = 'none';
            questionContainer.style.display = 'flex';
            questionContainer.style.opacity = '1';
        }, 500);
    });

    // Handle question responses
    questionScreens.forEach((screen, index) => {
        const yesButton = screen.querySelectorAll('.response-button')[0];
        const noButton = screen.querySelectorAll('.response-button')[1];

        yesButton.addEventListener('click', () => handleAnswer(index, 'Yes'));
        noButton.addEventListener('click', () => handleAnswer(index, 'No'));
    });

    // Function to handle answers and build query
    function handleAnswer(index, answer) {
        if (answer === 'Yes') {
            // Get the keyword corresponding to the current question
            const keyword = keywords[index];
            queryConditions.push(`${keyword} = TRUE`);
        }

        // Move to the next question or show the final query
        currentQuestionIndex++;
        if (currentQuestionIndex < questionScreens.length) {
            showNextQuestion(currentQuestionIndex);
        } else {
            showFinalQuery();
        }
    }

    // Show the next question
    function showNextQuestion(index) {
        questionScreens.forEach(screen => {
            screen.classList.remove('active');
            screen.style.opacity = '0';
        });

        setTimeout(() => {
            questionScreens[index].classList.add('active');
            questionScreens[index].style.opacity = '1';
            updateProgressBar(index);
        }, 300);
    }

    // Update the progress bar
    function updateProgressBar(index) {
        const progressPercentage = ((index + 1) / questionScreens.length) * 100;
        progress.style.width = `${progressPercentage}%`;
    }

    // Show the final query string in a popup
    function showFinalQuery() {
        const queryString = `SELECT * FROM conectandoDB.centros WHERE ${queryConditions.join(' AND ')};`;

        // Create the popup elements
        const popupOverlay = document.createElement('div');
        const popupContent = document.createElement('div');
        const popupText = document.createElement('p');
        const closeButton = document.createElement('button');

        // Set class names and content
        popupOverlay.className = 'popup-overlay';
        popupContent.className = 'popup-content';
        popupText.textContent = `Query Generated: ${queryString}`;
        closeButton.textContent = 'Close';
        closeButton.className = 'popup-close-button';

        // Append elements
        popupContent.appendChild(popupText);
        popupContent.appendChild(closeButton);
        popupOverlay.appendChild(popupContent);
        document.body.appendChild(popupOverlay);

        // Show the popup
        popupOverlay.style.display = 'flex';
        setTimeout(() => {
            popupContent.style.opacity = '1';
        }, 100);

        // Close the popup when the button is clicked
        closeButton.addEventListener('click', () => {
            popupContent.style.opacity = '0';
            setTimeout(() => {
                popupOverlay.style.display = 'none';
                popupOverlay.remove();
            }, 300);
        });
    }
});



document.addEventListener('DOMContentLoaded', () => {
    const categoryFilter = document.getElementById('category-filter');
    const entityCards = document.querySelectorAll('.entity-card');

    categoryFilter.addEventListener('change', function() {
        const selectedCategory = this.value;

        entityCards.forEach(card => {
            if (selectedCategory === 'all' || card.dataset.category === selectedCategory) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});
 