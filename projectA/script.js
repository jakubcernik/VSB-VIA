$(document).ready(function () {
    const API_LINKS = {
        general: {
            easy: "https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=boolean",
            medium: "https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=boolean",
            hard: "https://opentdb.com/api.php?amount=10&category=9&difficulty=hard&type=boolean",
        },
        games: {
            easy: "https://opentdb.com/api.php?amount=10&category=15&difficulty=easy&type=boolean",
            medium: "https://opentdb.com/api.php?amount=10&category=15&difficulty=medium&type=boolean",
            hard: "https://opentdb.com/api.php?amount=10&category=15&difficulty=hard&type=boolean",
        },
        history: {
            easy: "https://opentdb.com/api.php?amount=10&category=23&difficulty=easy&type=boolean",
            medium: "https://opentdb.com/api.php?amount=10&category=23&difficulty=medium&type=boolean",
            hard: "https://opentdb.com/api.php?amount=10&category=23&difficulty=hard&type=boolean",
        },
        computers: {
            easy: "https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=boolean",
            medium: "https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=boolean",
            hard: "https://opentdb.com/api.php?amount=10&category=18&difficulty=hard&type=boolean",
        },
    };

    let currentCategory = "general";
    let currentDifficulty = "easy";
    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let isLoadingQuestions = false; // Prevent duplicate API calls
    let lastRequestTime = 0; // last API call
    const API_COOLDOWN = 5000; // 5 seconds
    let questionCache = JSON.parse(localStorage.getItem("questionCache")) || {};
    let answerCache = Array(10).fill(null);

    $(document).on("click", "#previous-question", function () {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            showQuestion();
        }
    });

    $(document).on("click", "#next-question", function () {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            showQuestion();
        }
    });


    function setActiveCategory(category) {
        $(".category-button").removeClass("active");
        $(`.category-button[data-category="${category}"]`).addClass("active");
        currentCategory = category;
    }

    function setActiveDifficulty(difficulty) {
        $(".difficulty-button").removeClass("active");
        $(`.difficulty-button[data-difficulty="${difficulty}"]`).addClass("active");
        currentDifficulty = difficulty;
    }

    function loadQuestions() {
        if (isLoadingQuestions) {
            console.log("Duplicate API call prevented");
            return;
        }

        const url = API_LINKS[currentCategory][currentDifficulty]; // API URL as cache key

        // Global cooldown
        const now = Date.now();
        if (now - lastRequestTime < API_COOLDOWN) {
            console.log("Global cooldown in effect. Skipping API call.");
            showError("Too many requests. Please wait and try again.");
            return;
        }

        lastRequestTime = now;
        isLoadingQuestions = true;

        console.log(`Fetching data from API: ${url}`);
        $.getJSON(url)
            .done(function (data) {
                console.log("API response received");
                if (data && data.results && data.results.length > 0) {
                    questionCache[url] = data.results; // Cache  result
                    saveCacheToLocalStorage(); // Persist
                    questions = data.results;
                    currentQuestionIndex = 0;
                    score = 0;
                    showQuestion();
                    $("#quizModal").addClass("active");
                    gsap.from(".modal", { scale: 0.8, opacity: 0, duration: 0.5 });
                } else {
                    showError("No questions found. Please try again later.");
                }
            })
            .fail(function () {
                console.log("API request failed");
                if (questionCache[url]) {
                    console.log("Using cached questions due to API failure");
                    questions = questionCache[url];
                    currentQuestionIndex = 0;
                    score = 0;
                    showQuestion();
                    $("#quizModal").addClass("active");
                } else {
                    showError("Error fetching data and no cached data available. Please try again later.");
                }
            })
            .always(function () {
                isLoadingQuestions = false; // Reset loading state
                console.log("API call completed");
            });
    }


    function saveCacheToLocalStorage() {
        localStorage.setItem("questionCache", JSON.stringify(questionCache));
    }


    function showQuestion() {
        if (questions.length === 0) {
            showError("No questions available. Please try reloading.");
            return;
        }

        const question = questions[currentQuestionIndex];
        const decodedQuestion = decodeHtmlEntities(question.question);

        $(".question").text(`${currentQuestionIndex + 1}. ${decodedQuestion}`);
        $(".answer-button").removeClass("correct incorrect jump shake disabled");

        const userAnswer = answerCache[currentQuestionIndex];
        if (userAnswer !== null) {
            // Grey out buttons
            $(".answer-button").addClass("disabled");
            $(`.answer-button[data-answer="${userAnswer}"]`).addClass("correct");
        }

        updateIndicators();

        gsap.from(".question", { opacity: 0, duration: 1, y: -30 });
        gsap.from(".answer-button", { opacity: 0, duration: 0.5, stagger: 0.2, scale: 0.8 });
    }

    // Handle answers
    function handleAnswer(userAnswer) {
        if (questions.length === 0 || answerCache[currentQuestionIndex] !== null) return;

        answerCache[currentQuestionIndex] = userAnswer;

        const correctAnswer = questions[currentQuestionIndex].correct_answer;
        const selectedButton = $(`.answer-button[data-answer="${userAnswer}"]`);

        if (userAnswer === correctAnswer) {
            score++;
            selectedButton.addClass("correct jump");
        } else {
            selectedButton.addClass("incorrect shake");
        }

        $(".answer-button").addClass("disabled");

        setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
                currentQuestionIndex++;
                showQuestion();
            } else {
                showScore();
            }
        }, 500);
    }

    function updateIndicators() {
        const indicatorsContainer = $(".question-indicators");
        indicatorsContainer.empty();

        questions.forEach((_, index) => {
            const indicator = $("<span></span>");
            if (index === currentQuestionIndex) {
                indicator.addClass("active");
            } else if (answerCache[index] !== null) {
                indicator.addClass("answered");
            }
            indicatorsContainer.append(indicator);
        });
    }

    // Decode HTML entities in question text
    function decodeHtmlEntities(str) {
        const textArea = document.createElement("textarea");
        textArea.innerHTML = str;
        return textArea.value;
    }

    // Show the final score
    function showScore() {
        const scoreHtml = `
        <div class="score-card">
            <h2>Quiz Finished!</h2>
            <p>Your Score: <strong>${score}/${questions.length}</strong></p>
            <button id="close-quiz" class="btn close-btn">Close</button>
        </div>
    `;
        $(".modal").html(scoreHtml); // Replace question with scorecard
    }

    function showError(message) {
        const errorHtml = `
        <div class="error-message">
            <h2>Error</h2>
            <p>${message}</p>
            <button id="close-error" class="btn close-btn">Close</button>
        </div>
        `;
        $(".modal").html(errorHtml);
        $("#quizModal").addClass("active");
    }

    // Event listeners
    $(document).off("click", ".category-button").on("click", ".category-button", function () {
        setActiveCategory($(this).data("category"));
        gsap.fromTo(this, { scale: 1.1 }, { scale: 1, duration: 0.3, ease: "elastic.out(1, 0.3)" });
    });

    $(document).off("click", ".difficulty-button").on("click", ".difficulty-button", function () {
        setActiveDifficulty($(this).data("difficulty"));
        gsap.fromTo(this, { scale: 1.1 }, { scale: 1, duration: 0.3, ease: "elastic.out(1, 0.3)" });
    });

    $(document).off("click", "#start-quiz").on("click", "#start-quiz", function () {
        loadQuestions();
    });

    $(document).off("click", ".answer-button").on("click", ".answer-button", function () {
        handleAnswer($(this).data("answer"));
    });

    $(document).off("click", "#close-quiz").on("click", "#close-quiz", function () {
        $("#quizModal").removeClass("active"); // Close modal
        window.location.reload(); // Reload the page
    });

    $(document).off("click", "#close-error").on("click", "#close-error", function () {
        $("#quizModal").removeClass("active"); // Close error modal
    });

});
