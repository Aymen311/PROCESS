const score_elem = document.getElementById('Score') ; 


const final_score = JSON.parse(localStorage.getItem('final_score')) ; 

const nbQuestions = JSON.parse(localStorage.getItem('nbQuestions')) ; 

score_elem.innerText = `${final_score} / ${nbQuestions}`;  