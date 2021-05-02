let translate = document.querySelectorAll('.translate')  ; 
let box = document.querySelector('.textBox') ;
let sec = document.querySelector('.sec') ;
let header  =document.querySelector('header') ; 
let h2_sec = document.querySelector('div.sec h2') ; 
let p_sec = document.querySelector('div.sec p') ; 

let container = document.getElementById('Explore_algo') ; 

let card1 = document.getElementById('algo1') ;
let card2 = document.getElementById('algo2') ;
let card3 = document.getElementById('algo3') ;




let header_height = header.offsetHeight;
let box_height = box.offsetHeight ; 
let section_height = sec.offsetHeight ; 
let container_height = container.offsetHeight ; 



window.addEventListener('scroll', function(){
    let scroll = window.pageYOffset ;

    translate.forEach(element => {
        let speed = element.dataset.speed ; 
        element.style.transform = `translateY(${scroll * speed}px)` ; 
    })
    
    

    box.style.opacity = - scroll / (header_height+545 / 2) + 1 ;
    header.style.opacity = - scroll / (header_height+200 / 2) + 1 ;
    header.style.top = scroll + 'px' ;
    h2_sec.style.opacity = 1-(-scroll / (section_height / 2) + 1);
    p_sec.style.opacity = 1-(-scroll / (section_height / 2) + 1) ;
    
    let p_sec_opacity = - scroll / (container_height/ 2) + 1 ;
    
    console.log(scroll)
    if (scroll >= 1400)
    {
    p_sec.style.opacity = (p_sec_opacity + 6) * 0.5 ;
    }
    let container_opacity = 1-(-scroll / (container_height+50 / 2) + 1) ;
    console.log(container_opacity-2.8) ;
    card1.style.opacity = container_opacity-2.2 ;
    card2.style.opacity = container_opacity-2.2 ;
    card3.style.opacity = container_opacity-2.2 ;
})