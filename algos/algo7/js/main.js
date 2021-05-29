/************************** The Final way **************************/
                  /******************** CONSTS *****************/


//PRET FIFO CORDS
let STARTING_PRET_X = 600;
let STARTING_PRET_Y = 200;

//BLOCKED FIFO COORDS
let STARTING_BLOCK_X = 50;
let STARTING_BLOCK_Y = 350;


//PROCS COORDS
let STARTING_PROC_X = 150;
let STARTING_PROC_Y = 150;
let PROC_TEXT_SPACE = 20;

let PROC_R = 10;
let PROCS_SPACE = PROC_R*2 + PROC_R/2;

//GENERAL FIFO INFO
let FIFO_CAPACITY = 15;
let FIFO_WIDTH = FIFO_CAPACITY * (PROCS_SPACE) + 2*PROC_R;
let FIFO_HEIGHT = PROC_R * 4;

//PROCESSOR COORDS
let PROCESSOR_X = (STARTING_PRET_X - STARTING_BLOCK_X - FIFO_WIDTH)/2 + FIFO_WIDTH + STARTING_BLOCK_X;
let PROCESSOR_Y = 50;
let PROCESSOR_H = 30;
let PROCESSOR_W = 30;

//RPOCS GENERAL INFO
let MIN_PROC_TIME = 2
let MAX_PROC_TIME = 12
let MAX_PROC_PRIORITY = 0
let MIN_PROC_PRIORITY = 4
let MAX_PROC_INTRS = 3
let MAX_PROC_DEGREE = 3
let MAX_INTR_DURATION = 10
let INT_TYPES = ["memory","function","input"]
let MIN_INT_TYPES = ["memory","input"]
//Genreal info
var SPEED = 500;
var TIME_UNIT = 500;

var QUANTUMS = [4,3,2,1];
var ALLL = []
                  /********************************************/


/***************************** GENERAL FUNCTIONS *********************/
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function randomChoice(aMULTI_NV) {
  return aMULTI_NV[Math.floor(Math.random() * aMULTI_NV.length)];
}

function isNumber(b){
    return isNaN(b)||typeof(b)!=="number"?false:true;
}

function randint(min,max){

  var r =  Math.floor(Math.random() * (max - min) ) + min
  return r
}

function rand_intrs(exec_time,deg){ //function that chooses a random intr from the list of intrs
  var possible_ints = MIN_INT_TYPES

  if (deg < MAX_PROC_DEGREE){
    possible_ints = INT_TYPES
  }
  if (exec_time > 2*MAX_PROC_INTRS){
    var nb_intrs = randint(0,MAX_PROC_INTRS)
    }else{
      var nb_intrs = 1
    }
  intrs = []
  int_t = 0
  for (let i = 0 ; i < nb_intrs ; i++){
    int_t = randint(int_t+1,exec_time-1)
    intr = [int_t,randint(1,MAX_INTR_DURATION),randomChoice(possible_ints)]
    intrs.push(intr)
    if (exec_time - int_t < 3 ){
      break
    }
  }
  return intrs
}

function add_process(pere,deg,entrance, Config){
  var exec_t = randint(Config["MIN_PROC_TIME"],Config["MAX_PROC_TIME"])
  var prio  =  randint(Config["MAX_PROC_PRIORITY"],Config["MIN_PROC_PRIORITY"] + 1)
  id_proc++;
  ints = rand_intrs(exec_t,deg)
  return [id_proc, entrance, exec_t, prio, ints.s, ints]
}

function create_process() {
  nb_procs = parseInt(document.getElementById("nb_processes").value)
  checked  = document.getElementById("INT_TYPE_FUNCTION_CHECK_BOX").checked
  for (let i = 0 ; i<nb_procs ; i++){
      if (checked){add_process(-1,0)}
      else{add_process(-1,MAX_PROC_DEGREE)}
    }
}




/*****************************************************************/

/****** MAIN SVG ************/
var svg = d3.select("main_svg")
    .append("svg")
    .attr("width", 1000)
    .attr("height", 700);
/**************************/

/************************ CLASS *********************/

class Processor {
    constructor(id, x, y) {
        this.id = id
        this.x = x
        this.y = y
        this.inProcess = []
        this.rect = -1
    }
    createProcessor() {
        var elem = svg.append("svg:image")
            .attr('x', this.x - 35.5) // 465
            .attr('y', 15) //15
            .attr('width', 70)
            .attr('height', 70)
            .attr("xlink:href", "../../image/processor_2.svg")

        this.rect = svg.append("rect")
            .attr("x", this.x - 10.5)
            .attr("y", 65)
            .attr("width", 20).attr("height", 20)
            .attr("opacity","0.95")
            .attr("position", "fixed")
            .attr("fill", "white")
    }
    block_process(fifo) {
        if (this.inProcess.length != 0) {
            var elem = this.inProcess.shift()
            elem.block(fifo)
        }
    }
    finish_process() {
        if (this.inProcess.length != 0) {
            var proc = this.inProcess.shift()
            proc.elem.transition()
                .duration(SPEED)
                .attr("cx", 1400)
                .style("opacity", "0");
            proc.text.transition()
                .duration(SPEED)
                .attr("x", 1400)
                .style("opacity", "0");
            proc.p_text.transition()
                .duration(SPEED)
                .attr("x",1400)
                .style("opacity","0")
            sleep(SPEED).then(() => {
                proc.elem.remove();
            });
        }
    }

    isready(){
      return this.inProcess.length == 0
    }
}

class Fifo {
    constructor(x, y, capacite, quantum, name=-1) {
        this.x = x;
        this.y = y;
        this.capacite = capacite;
        this.processors = [];
        this.UniqueProcessAvailable = false;
        this.name = name
        this.quantum = quantum;
        this.elem = -1;

    }
    createFifo() {
        for ( let i = 0; i < FIFO_CAPACITY; i++){
            svg.append("rect")
                .attr("x", this.x + i*PROCS_SPACE + PROC_R - 3)
                .attr("y", this.y)
                .attr("stroke", "black")
                .attr("width", PROCS_SPACE).attr("height", FIFO_HEIGHT)
                .attr("position", "fixed")
                .attr("fill", "#bdb4d0")
                //.attr("rx", 5).attr("ry", 5)
        }

        if (this.name != -1){
            this.elem = svg.append('text')
                .text(this.name)
                .attr('dy','10')
                .attr("x", this.x +  PROCS_SPACE*FIFO_CAPACITY / 2 - 40)
                .attr("y", this.y + 60)
        }


    }
    fifoAddProcess(p) {
        this.processors.push(p)
        return this.processors.length;
    }
    fifoAddPhysicProcess(p) {
        this.processorsPhysic.push(p)
        return this.processorsPhysic.length;
    }
    treat(n) {
        if (this.processors.length != 0 ) {
              if (processor.isready()){
              var elem = this.processors.splice(n,1)[0];
              processor.inProcess.push(elem);
              elem.treat();
              this.shift(n)
              return elem
          }
        }
      }
    resume(elem, fifo) {
        //if elem in numerical; resume the "elem"th element
        //else (ie elem is Process) resume elem
        //it returns the indice of the elemt in the Fifo.processors aMULTI_NVay
        if (isNumber(elem)){
            if (elem < this.processors.length){
              var elem_ = this.processors[elem]
              this.processors.splice(elem, 1)
              this.shift(elem);
              elem_.resume(fifo);
              return elem
            }
        }
        else {
            var n = 0;
            for (n=0; n<this.processors.length;n++){
                if (this.processors[n].id == elem.id){
                    break;
                }
            }
            this.processors.splice(n, 1)
            this.shift(n);
            elem.resume(fifo);
            return n;
        }
    }
    shift(n) {
        for (let i = n; i < this.processors.length; i++) {
            this.processors[i].shift()
        } //SHIFT
    }
}

class Process {
    constructor(id, exe_time,ints,pere,deg,priority, color="-1") {
        this.level = priority;
        this.id = id
        this.exe_time = exe_time
        this.previous_int_time = 0
        this.ints = ints
        this.left_time = exe_time
        this.left_time_anime = exe_time
        this.pere = pere
        this.deg = deg
        this.priority = priority;
        this.int_counter = 0
        this.elem = svg.append("circle")
            .attr("id", id)
            .attr("cx", STARTING_PROC_X)
            .attr("cy", STARTING_PROC_Y)
            .attr("r" , PROC_R)
            .attr("stroke", "black")
            .attr("stroke_width", 2)
            .attr("position", "fixed");

        if (color == -1){this.color = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
                        this.elem.attr("fill", "rgb("+this.color+")")}
        else{this.color = color;
            this.elem.attr("fill",color)}


            //.attr("fill", "rgb("+this.color+")")


        this.text = svg.append('text')
            .attr("id", "text_"+id)
            .text(exe_time)
            .attr('dy','10')
            .attr("x", STARTING_PROC_X - 4)
            .attr("y", STARTING_PROC_Y + PROC_TEXT_SPACE)
            //.attr("font-size","30px")

        this.x = 0;
        this.y = 0;

        this.p_text = svg.append('text')
            .attr("id", "ptext_"+id)
            .text(priority)
            .attr('dy','7')
            .attr('dx','-5')
            .attr("x", STARTING_PROC_X )
            .attr("y", STARTING_PROC_Y)
    }
    move2fifo(fifo) {
        var l = fifo.fifoAddProcess(this);
        var elem_ = this.elem;
        this.x = fifo.x + (fifo.processors.length - 1) * PROCS_SPACE + 2*PROC_R;
        this.y = fifo.y + FIFO_HEIGHT/2;
        elem_.transition()
            .duration(SPEED)
            .attr("cy", this.y).attr("cx", this.x);
        this.text.transition()
            .duration(SPEED)
            .attr("y", this.y + PROC_TEXT_SPACE).attr("x", this.x);
        this.p_text.transition()
            .duration(SPEED)
            .attr("y",this.y).attr("x",this.x)


    }
    block(fifo) {
        var l = fifo.fifoAddProcess(this);
        var elem_ = this.elem;
        this.x = fifo.x + (fifo.processors.length - 1) * PROCS_SPACE + 2*PROC_R;
        this.y = fifo.y + FIFO_HEIGHT/2;
        elem_.transition()
            .duration(SPEED)
            .attr("cx", this.x)
            .attr("cy", this.y)
        this.text.transition()
            .duration(SPEED)
            .attr("y", this.y + PROC_TEXT_SPACE).attr("x", this.x);
        this.p_text.transition()
            .duration(SPEED)
            .attr("y",this.y).attr("x",this.x)
    }
    treat() {
        var elem_ = this.elem;
        this.x = PROCESSOR_X;
        this.y = PROCESSOR_Y;
        elem_.transition()
            .duration(SPEED)
            .attr("cx", this.x)
            .attr("cy", this.y)
        this.text.transition()
            .duration(SPEED)
            .attr("y", this.y + PROC_TEXT_SPACE).attr("x", this.x);
        this.p_text.transition()
            .duration(SPEED)
            .attr("y",this.y).attr("x",this.x) ;
    }
    shift() {
        var elem_ = this.elem;
        this.x -= PROCS_SPACE;
        elem_.transition()
            .duration(SPEED)
            .attr("cx", this.x)
            .attr("cy", this.y)
        this.text.transition()
            .duration(SPEED)
            .attr("y", this.y + PROC_TEXT_SPACE).attr("x", this.x);
        this.p_text.transition()
            .duration(SPEED)
            .attr("y",this.y).attr("x",this.x) ;
    }
    resume(fifo) {
        var l = fifo.fifoAddProcess(this);
        var elem_ = this.elem;
        this.x = fifo.x + (fifo.processors.length - 1) * PROCS_SPACE + 2*PROC_R;
        this.y = fifo.y + FIFO_HEIGHT/2;
        elem_.transition()
            .duration(SPEED)
            .attr("cx", this.x)
           . attr("cy", this.y)
        this.text.transition()
            .duration(SPEED)
            .attr("y", this.y + PROC_TEXT_SPACE).attr("x", this.x);
        this.p_text.transition()
            .duration(SPEED)
            .attr("y",this.y).attr("x",this.x)
    }

    hasint(){return this.ints.length != this.int_counter}
    treat_int(upd){
      let int = this.ints[this.int_counter]
      if (upd == "RR"){
        this.left_time = this.exe_time-this.real_int_time()
      }else {
      this.left_time = this.left_time - ( int[0] - this.previous_int_time )
      }
      this.previous_int_time = int[0]
      this.int_counter += 1
      this.left_time_anime = this.left_time
    }
    type_int(){return this.ints[this.int_counter][2]}
    int_time(){return this.ints[this.int_counter][0] - this.previous_int_time}
    real_int_time(){return this.ints[this.int_counter][0]}
    int_duration(){return this.ints[this.int_counter][1]}

}

/********************************************************/

/********************** INITS *****************************/


function update_fifos(){
    q_l = document.getElementById("quantums").value.split(",");
    q_l_ = []
    for ( var j = 0; j < q_l.length; j++){
        if (! isNaN(parseInt(q_l[j]))) {q_l_.push(parseInt(q_l[j]))}
    }

    q_l_ = q_l_.sort(function(a, b) {return a - b;})
    QUANTUMS = q_l_
    document.getElementById("main_svg").innerHTML = ""

    svg = d3.select("main_svg")
        .append("svg")
        .attr("width", 1000)
        .attr("height", 550);

    var NB_FIFO = [4, q_l_.length ].sort(function(a, b) {return a - b;})[0];
    list_fifos = [];
    for (var i = 0; i<NB_FIFO; i++){
        var f = new Fifo(STARTING_PRET_X, STARTING_PRET_Y + i*(SPACE_BETWEEN_FIFO+FIFO_HEIGHT), FIFO_CAPACITY,q_l_[i],  "Q = "+(q_l_[i]))
        list_fifos.push(f)
        f.createFifo();
    }

    var blocked = new Fifo(STARTING_BLOCK_X, STARTING_BLOCK_Y, FIFO_CAPACITY,0, "FIFO BLOQUE")
    blocked.createFifo();

    var processor = new Processor(0, PROCESSOR_X, PROCESSOR_Y);
    processor.createProcessor();

    ALL_PROCS = []; ALLL = []; data = [];all_processes_list = [];

}




const SPACE_BETWEEN_FIFO = 50;
var NB_FIFO = 4;

var list_fifos = [];
for (var i = 0; i<NB_FIFO; i++){
    var f = new Fifo(STARTING_PRET_X, STARTING_PRET_Y + i*(SPACE_BETWEEN_FIFO+FIFO_HEIGHT), FIFO_CAPACITY,QUANTUMS[i],  "Q = "+(QUANTUMS[i]))
    list_fifos.push(f)
    f.createFifo();
}


var blocked = new Fifo(STARTING_BLOCK_X, STARTING_BLOCK_Y, FIFO_CAPACITY,0, "FIFO BLOQUE")
blocked.createFifo();

var processor = new Processor(0, PROCESSOR_X, PROCESSOR_Y);
processor.createProcessor();

var id_proc = 0;

/*************************************************************/

/****************** ALIAS FUNCS ********************/
function treat_process(n) {
    for (var i = 0; i < NB_FIFO; i++){
        if (list_fifos[i].processors.length != 0){
            return list_fifos[i].treat(n)
        }
    }
}

function finish_process() {
    processor.finish_process()
}

function block_process(lvl) {
    new_level = lvl
    processor.inProcess[0].level = new_level
    processor.block_process(blocked)
}

function change_process(lvl) {
    new_level = lvl
    processor.inProcess[0].level = new_level
    console.log("xxxxx", new_level);
    processor.block_process(list_fifos[new_level])
}

function resume_process(elem) {
    var i_elem = blocked.resume(elem, list_fifos[elem.level]);
}

/***************************************************/


/****** SPEED - TU **********/


//var speed_slider = document.getElementById("myspeed");
//var TU_slider = document.getElementById("myTU")

/*speed_slider.oninput = function() {
  SPEED = parseInt(this.value)
}*/

/*
TU_slider.oninput = function() {
  TIME_UNIT = parseInt(this.value)
}


/****************************/

/***************** FUNCTION TO TEST AREA **************/
function update_left_time(elem, t,end,sub){
    console.log(sub)
    if (t > end){
        sleep(TIME_UNIT).then(() => {
          elem.left_time_anime -= sub;
          // To update the text
          elem.text.text(elem.left_time_anime)
          document.getElementById("menu_proc_exe_time_"+elem.id).innerHTML = ", Temps restant: "+elem.left_time_anime
          update_left_time(elem, t-1,end,sub)})
    }
}

var mem = svg.append("circle")
            .attr("cx",PROCESSOR_X+200)
            .attr("cy", PROCESSOR_Y-20)
            .attr("r" , PROC_R+2)
            .attr("stroke","black")
            .attr("fill","white")
            .attr("position", "fixed");

svg.append("text")
            .attr("x",PROCESSOR_X+250)
            .attr("y", PROCESSOR_Y-20+5)
            .attr("position", "fixed")
            .text("Interuption Memoire/IO");

var func = svg.append("circle")
            .attr("cx",PROCESSOR_X+200)
            .attr("cy", PROCESSOR_Y+20)
            .attr("r" , PROC_R+2)
            .attr("stroke","black")
            .attr("fill","white")
            .attr("position", "fixed");

svg.append("text")
            .attr("x",PROCESSOR_X+250)
            .attr("y", PROCESSOR_Y+25)
            .attr("position", "fixed")
            .text("Interuption function");

function mem_intr(){
  mem.transition()
  .attr("fill","red")
  mem.transition()
  .attr("fill","white")
  .delay(SPEED*2)
}

function func_intr(){
  func.transition()
  .attr("fill","red")
  func.transition()
  .attr("fill","white")
  .delay(SPEED*2)
}


/***************************************************/

/****************** ALGORITHM ***********************/
function log_comment(comment, color, elem_color){
    var x = document.getElementById("logs");
    console.log(elem_color);
    var c = `<li style="color:${color}">   ${comment}
        <span style="position: relative;bottom: -7px;">  <svg  height='30' width='30'>  <circle cx='15' cy='15' r='10' stroke='black' stroke_width='3' fill='rgb(${elem_color},1)'/> </svg> </span>
    </li>`;
    x.innerHTML = c + x.innerHTML;
}



// ALGORITHM 3 : //
//////////////////

function list_fifos_not_empty(){
    for (var i = 0; i < NB_FIFO; i++){
        if (list_fifos[i].processors.length != 0){
            if (list_fifos[i].processors.length == 1 && list_fifos[i].UniqueProcessAvailable){
                return true;
            }
            else {return true}
        }
    }
    return false
}


function MULTI_NV(mode,proc) {
  if (list_fifos_not_empty() || blocked.processors.length != 0 || processor.inProcess.length != 0){
    if (processor.isready() && list_fifos_not_empty() != 0 ){
      let elem = treat_process(0); //Send process to processor
      let lvl = elem.level;
      let qntm = list_fifos[lvl].quantum
      log_comment("Traintement du processus "+elem.id,"green", elem.color);
      if (! elem.hasint()){ //If processor doesn't have int
        if (elem.left_time <= qntm){
          sleep(SPEED).then( () => {update_left_time(elem, elem.left_time,0,1);})
          if (elem.pere == -1 ){
              sleep(SPEED + elem.left_time * TIME_UNIT).then(() => {
                  log_comment("Terminaison du processus "+elem.id,"blue", elem.color);
                  finish_process();MULTI_NV()})
          }else {
                sleep(SPEED + elem.left_time * TIME_UNIT).then(() => {
                    log_comment("Terminaison du processus "+elem.id,"blue", elem.color);
                    log_comment("Debloquage du processus "+elem.pere.id,"orange", elem.color);
                    finish_process();elem.pere.treat_int();resume_process(elem.pere);sleep(SPEED).then(() => {MULTI_NV()})})
          }
        }
        else{
            sleep(SPEED).then( () => {update_left_time(elem, elem.left_time,elem.left_time-qntm,1);})
            sleep(SPEED + qntm * TIME_UNIT).then(() => {
                log_comment("Processus "+elem.id+" -> Fifo "+(lvl+2),"black", elem.color);
                change_process(lvl);elem.left_time-=qntm;sleep(SPEED).then(() => {MULTI_NV()})})
        }
        }
      else{
          if (elem.real_int_time()-(elem.exe_time-elem.left_time) <= qntm){
           var t = elem.real_int_time()-(elem.exe_time-elem.left_time)
           sleep(SPEED).then( () => {update_left_time(elem, elem.left_time,elem.exe_time - elem.real_int_time(),1);})
           if (elem.type_int() != "function"){
            sleep(SPEED + t * TIME_UNIT).then(() => {
                log_comment("Interuption "+elem.type_int()+" du processus "+elem.id, "red", elem.color);
                mem_intr();block_process(lvl);MULTI_NV("block",elem)})
          }
          else{
            sleep(SPEED +  t * TIME_UNIT).then(() => {
                log_comment("Interuption "+elem.type_int()+" du processus "+elem.id, "red", elem.color);
                log_comment("Appel de processus fils du processus "+elem.id, "black", elem.color);
                func_intr();block_process();add_process(elem,elem.deg+1);sleep(SPEED).then(() => {MULTI_NV()})})
          }
          }else {
          console.log("here")
           sleep(SPEED).then( () => {update_left_time(elem, elem.left_time,elem.left_time-qntm,1);})
           sleep(SPEED + qntm * TIME_UNIT).then(() => {
               log_comment("Processus "+elem.id+" -> Fifo "+(lvl+2), "black", elem.color);
               change_process(lvl);elem.left_time-=qntm;sleep(SPEED).then(() => { MULTI_NV()})})
        }
       }
    }
    if (mode == "block"){
      sleep(SPEED + proc.int_duration() * TIME_UNIT ).then(() => {
          log_comment("Resume du processus "+proc.id+" vers Fifo "+proc.level, "orange", proc.color);
          resume_process(proc);proc.treat_int("MULTI_NV");sleep(SPEED).then(() => {MULTI_NV()})})
    }

  }
  else {
    sleep(SPEED).then(() => { alert("Simualation Round Robin have finished")})
    sleep(2000).then(() => {
        document.getElementById('gantt_div').style.display = "block" ; 
        document.getElementById('tab_div').style.display = "block" ; 
        draw_gantt_(data_MULTI_NV_PRIO, "FCFS_");
        plot_time_table(all_histories["MULTI_NV_PRIO"], "plot_time")
        end_of_simulation = true;
    })
  }
}



/*************************************************************/


/************************ UI ********************************/
function create_process_html(){
  var value = document.getElementById("nb_procs").value
  var x = document.getElementById("menu")
  x.innerHTML = ""
  for (let i = 0; i < value; i++){
    var int_html = ""

    int_html += '<label >Process '+i+' :</label>'
    int_html += '<label >Execution time:</label>      <input id="exe_time_'+i+'" type="text"   maxlength="2"  size="2">'
    int_html += '<label >Interuption number:</label>       <input id="int_n_'+i+'" type="text" maxlength="1"  size="2" onchange="create_int_html(id, value);">'

    x.innerHTML += "<div id='int_"+i+"' style='cursor: pointer'  onclick='open_menu(id)' > " + int_html +" </div>"
    x.innerHTML += '<div id="int_menu_'+i+'" ></div>'
  }
  x.innerHTML += '<br><input id="scrap"  value="Create process"  type="button" onclick="scrap(document);" />'
}
function create_int_html(id, value){
  let x = document.getElementById('int_menu_'+id.slice(6))
  x.innerHTML = ""
  for (let i = 0; i < value; i++){
    var int_html = ""
    int_html += "<div>"
    int_html += '<div style="background-color: #FAAAAA;">'
    int_html += '<label >&nbsp &nbsp &nbsp &nbsp &nbsp &nbspStart time:</label>     <input id="start_time_'+id.slice(6)+"_"+i+'"  maxlength="2"  size="2" type="text">'
    int_html += '<label >Duration:</label>       <input id="duration_'+id.slice(6)+"_"+i+'" type="text"  maxlength="2"  size="2">'
    int_html += '<label for="cars">Int type:</label>'
    int_html += '<select id="type_int_'+id.slice(6)+'_'+i+'" name="cars">'
    int_html += '  <option value="memory">Memory</option>'
    int_html += '  <option value="input">Input</option>'
    int_html += '  <option value="function">Function</option>'
    int_html += '</select>'
    int_html += "</div>"
    x.innerHTML += int_html
  }



}
function open_menu(id){
    var x = document.getElementById('int_menu_'+id.slice(4))
    if (x.style.display === "none") {
       x.style.display = "block";
    }
    else {
       x.style.display = "none";
    }
}
function open_menu_proc_ints(id){
    var x = document.getElementById("menu_proc_ints_"+id)
    if (x.style.display === "none") {
       x.style.display = "block";
    }
    else {
       x.style.display = "none";
    }
}


function scrap(document){
    var exe_time = document.getElementById("Exe_time").value
    var nb_int   = document.getElementById("Int_nb").value
    var ints = []
    for (var i = 1; i <= nb_int; i++){

      ints.push([parseInt(document.getElementById(`Start_time_${i}`).value),
                 parseInt(document.getElementById(`Duration_${i}`).value),
                 document.getElementById(`Interuption_type_${i}`).value])
    }
    var color = document.getElementById("Process_color").value
    var priority = document.getElementById("process priority").value
    var process = new Process(id_proc, parseInt(exe_time), ints, -1, 0, priority ,color)
    id_proc += 1
    add_to_proc_info_menu(process, "proc_info_menu")
    process.move2fifo(list_fifos[priority])

    }

/*************************************************************/

function add_to_proc_info_menu(p, id){
    var menu = document.getElementById(id)
    var proc_html = ""
    var ints = p.ints
    var color;
    if (p.color[0] != "#"){color = `rgb(${p.color},1)`}
    else {color = `${p.color}`}

    proc_html += `
        <div  id='${p.id}'  onclick='open_menu_proc_ints(id)' style='cursor: pointer' class='int_class_header'>
            <svg  height='30' width='30'>  <circle cx='15' cy='15' r='10' stroke='black' stroke_width='3' fill='${color}'/> </svg>
            <span> Processus: ${p.id}  </span>
            <span  id='menu_proc_exe_time_${p.id}'> , Temps restant: ${p.left_time} </span>
        </div>

        <div  id='menu_proc_ints_${p.id}' style='display: none'  class='int_class'>
    `
    for (var i = 0; i < ints.length; i++){
        if (p.ints[i][2] != "function"){
            proc_html += `
                <table>
                    <tr style="background: #0000003d">
                        <th> Interuption: </th>
                        <th> ${i + 1} </th>
                    </tr>
                    <tr>
                        <th> Debut: </th>
                        <th> ${p.ints[i][0]} </th>
                    </tr>
                    <tr>
                        <th> Duree: </th>
                        <th> ${p.ints[i][1]} </th>
                    </tr>
                    <tr>
                        <th> Type d'interuption: </th>
                        <th> ${p.ints[i][2]} </th>
                    </tr>
                </table>
            `
        }
        else {
            proc_html += `
                <table>
                    <tr style="background: #0000003d">
                        <th> Interuption: </th>
                        <th> ${i + 1} </th>
                    </tr>
                    <tr>
                        <th> Debut: </th>
                        <th> ${p.ints[i][0]} </th>
                    </tr>
                    <tr>
                        <th> Type d'interuption: </th>
                        <th> ${p.ints[i][2]} </th>
                    </tr>
                </table>
            `
        }
    }

    if (ints.length == 0){
        proc_html += `
            <table>
                <tr style="background: #0000003d">
                    <th> Pas d'interuption </th>
                </tr>
            </table>
        `
    }
    proc_html += "</div>"
    menu.innerHTML += proc_html

}

/**************************************************/
