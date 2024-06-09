const question = document.getElementById("question").innerText;
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById("progressBarFull");
const loader = document.getElementById("loader");
const game = document.getElementById("game");
// console.log(question);
// console.log(choices);


let currentQuestion = {};
let acceptingAnswers = true;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];
fetch("https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple").then(res => {
    return res.json();
}).then(loadedQuestions => {
    console.log(loadedQuestions.results);
    questions = loadedQuestions.results.map(loadedQuestion => {
        const formattedQuestion = {
            question: loadedQuestion.question
        };
        const answerChoice = [ ... loadedQuestion.incorrect_answers];
        formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
        answerChoice.splice(formattedQuestion.answer - 1, 0, loadedQuestion.correct_answer);
        answerChoice.forEach((choice, index) => {
            formattedQuestion["choice" + (index + 1)] = choice;
        });
        return formattedQuestion;
    });
    startGame();
}).catch(err => {
    console.error(err);
});

// console.log(questions);

// Constants
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 5;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [ ... questions];
    console.log(availableQuestions);
    getNewQuestion();
    game.classList.remove("hidden");
    loader.classList.add("hidden");
};

getNewQuestion = () => {
    if (availableQuestions.length == 0 || questionCounter >= MAX_QUESTIONS){
        localStorage.setItem("mostRecentScore", score);
        // go to the end page
        return window.location.assign("../end.html");
    }

    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;

    // Update the Progress Bar
    document.getElementById('progressBarFull').style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    document.getElementById("question").innerText = currentQuestion.question;

    choices.forEach(choice => {
        // console.log(choice);
        // const number = choice.dataset["number"];
        const number = choice.dataset["number"];
        // console.log(number);
        choice.innerText = currentQuestion["choice" + number];
    });
    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;
};

choices.forEach(choice => {
    choice.addEventListener('click', e =>{
        // console.log(e.target);
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];
        // console.log(selectedAnswer);

        //one liner stetement
        const ans = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect'; 

        if (ans == 'correct'){
            incrementScore(CORRECT_BONUS);
        }

        selectedChoice.parentElement.classList.add(ans);
        setTimeout( () => {
            selectedChoice.parentElement.classList.remove(ans);
            getNewQuestion();
            
        }, 1000);
    });
});

incrementScore = num => {
    score += num;
    scoreText.innerText = score;
};
