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

