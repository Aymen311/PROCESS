const question = document.querySelector("#question") ; 
const choices = Array.from(document.querySelectorAll(".choice-text")) ; 
const progressText = document.querySelector("#progressText") ;
const scoreText = document.querySelector("#score") ; 
const progressBarFull = document.querySelector("#progressBarFull") ; 

let currentQuestion = {} 
let acceptingAnswers = true 
let score = 0 
let questionCounter = 0 
let availableQuestions = [] 
let correctAnswerscounter = 0 ; 


let questions = [
{
    question: "La file d'attente prête peut être implémentée en tant que _______________.",
    choice1 : "file d'attente FIFO",
    choice2:  "file d'attente prioritaire",
    choice3: "Arbre",
    choice4: "tout ce qui précède",
    answer: 4,
},
{
    question: "Lequel des algorithmes d'ordonnancement suivants peut souffrir de la famine?",
    choice1 : "SJF",
    choice2:  "FCFS",
    choice3: "RR",
    choice4: "File d'attente à plusieurs niveaux",
    answer: 2,
},
{
    question: "Lequel des algorithmes de planification suivants est non préventif?",
    choice1 : "SJF",
    choice2:  "RR",
    choice3: "FCFS",
    choice4: "Algorithmes de priorité",
    answer: 3,
},

{
    question: "Le ______ se produit dans la planification du premier arrivé, premier servi lorsqu'un processus avec une long temps d’usage du CPU occupe le processeur.",
    choice1 : "temps de réponse",
    choice2:  "temps d'attente",
    choice3: "effet de convoi(famine)",
    choice4: "bloquage",
    answer: 3,
},

{
    question: "Lequel des algorithmes de planification suivants donne le temps de réponse moyen minimum?",
    choice1 : "SJF",
    choice2:  "FCFS ",
    choice3: "RR",
    choice4: "File d'attente à plusieurs niveaux",
    answer: 1,
},

{
    question: "Quel est le rôle d’un ordonnanceur scheduler au sein d’un O.S. ?",
    choice1 : "Ordonnancer l'utilisation de la mémoire virtuelle.",
    choice2:  "Ordonnancer les opérations d’E/S.",
    choice3: "Ordonnancer les interruptions provoquées par les opérations d’E/S.",
    choice4: "Ordonnancer les processus à exécuter selon un ou des critères.",
    answer: 4,
},

{
    question: "Un processus est :",
    choice1 : "Un programme exécutable",
    choice2:  "Une instance d’un programme exécutable",
    choice3: "un contexte processeur",
    choice4: "Un programme non exécutable.",
    answer: 2,
},

{
    question: "La planification dans laquelle un processus en cours ne peut être interrompu par aucun autre processus?",
    choice1 : "Dispatcher.",
    choice2:  "Planification préemptive.",
    choice3: "Planification non préemptive",
    choice4: "CPU Scheduler.",
    answer: 3,
},

{
    question: "Il s'agit du mode préemptif de l'algorithme SJF dans lequel l'exécution est planifiée en fonction du temps restant le plus court.",
    choice1 : "First Come First Serve",
    choice2:  "Shortest Job First",
    choice3: "Shortest Remaining Time First",
    choice4: "Priority Scheduling",
    answer: 3,
},

{
    question: "Chaque processus se voit attribuer un temps fixe de manière cyclique",
    choice1 : "First Come First Serve",
    choice2:  "Round Robin Scheduling",
    choice3: "Shortest Job First",
    choice4: "Shortest Remaining Time First",
    answer: 2,
},

{
    question: "L'intervalle entre la soumission d'un processus et le moment de sa fin est appelé ____",
    choice1 : "Temps d'attente",
    choice2:  "Débit",
    choice3: "Temps d'exécution",
    choice4: "Temps de réponse",
    answer: 3,
},

{
    question: "L'intervalle entre la soumission d'un processus et le moment de sa fin est appelé ____",
    choice1 : "Temps d'attente",
    choice2:  "Débit",
    choice3: "Temps d'exécution",
    choice4: "Temps de réponse",
    answer: 3,
}


]

const MAX_QUESTIONS = 12 

startGame = () =>{
    questionCounter = 0 ; 
    correctAnswerscounter = 0 ; 
    score = 0 ;
    availableQuestions = [...questions] ; 
    localStorage.setItem('nbQuestions', availableQuestions.length) ; 
    getNewQuestion() ; 
}

getNewQuestion = () =>{
    if(availableQuestions.length == 0 || questionCounter > MAX_QUESTIONS)
    {
        return window.location.assign("./end.html") ; 
    }
   
    questionCounter++ ; 
    progressText.innerText = `Question ${questionCounter} of ${MAX_QUESTIONS}` ; 
    progressBarFull.style.width = `${(questionCounter/MAX_QUESTIONS) * 100}%` ; 

    const questionIndex = Math.floor(Math.random() * availableQuestions.length) ; 

    currentQuestion = availableQuestions[questionIndex] ; 
    question.innerText = currentQuestion.question  ; 

    choices.forEach(choice => {
        const number = choice.dataset['number']; 
        choice.innerText = currentQuestion['choice'+number] ; 
    })
    // try to use innerHTML

    availableQuestions.splice(questionIndex, 1) ; 

    acceptingAnswers = true ; 

}



choices.forEach(choice => {
    choice.addEventListener('click' , e => {
        if(!acceptingAnswers) return
        

        acceptingAnswers = false ; 
        const selectedChoice = e.target ; 
        const selectedAnswer = selectedChoice.dataset['number'] ; 

        let classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect' ;  

        selectedChoice.parentElement.classList.add(classToApply) ; 

        if(selectedAnswer == currentQuestion.answer)
        {
            console.log('Hey')
            correctAnswerscounter++ ; 
            localStorage.setItem('final_score' , correctAnswerscounter) ;  
        }

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply) ; 
            getNewQuestion() ; 
        }, 1000) ; 
    })    
})


startGame() ; 




