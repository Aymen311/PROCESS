
                  /******************** CONSTS *****************/


//PRET FIFO CORDS
let STARTING_PRET_X = 550;
let STARTING_PRET_Y = 300;

//BLOCKED FIFO COORDS
let STARTING_BLOCK_X = 50;
let STARTING_BLOCK_Y = 300;


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
let MAX_PROC_TIME = 10
let MAX_PROC_INTRS = 3
let MAX_PROC_DEGREE = 3
let MAX_INTR_DURATION = 10
let INT_TYPES = ["memory","function","input"]
let MIN_INT_TYPES = ["memory","input"]

//Genreal info
var SPEED = 500;
var TIME_UNIT = 1000;
var ALL_PROCS = []
var current_time = 0

                  /********************************************/


/***************************** GENERAL FUNCTIONS *********************/
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function isNumber(b){
    return isNaN(b)||typeof(b)!=="number"?false:true;
}

function randint(min,max){

  var r =  Math.floor(Math.random() * (max - min) ) + min
  return r
}

function rand_intrs(exec_time,deg, Config){ //function that chooses a random intr from the list of intrs
  var possible_ints = MIN_INT_TYPES

          /*if (deg < Config["MAX_PROC_DEGREE"]){
            possible_ints = INT_TYPES
        }*/
  if (exec_time > 2*Config["MAX_PROC_INTRS"]){
    var nb_intrs = randint(0,Config["MAX_PROC_INTRS"])
    }else{
      var nb_intrs = 1
    }
  intrs = []
  int_t = 0
  for (let i = 0 ; i < nb_intrs ; i++){
    int_t = randint(int_t+1,exec_time-1)
    intr = [int_t,randint(Config["MIN_INTR_DURATION"],Config["MAX_INTR_DURATION"]),randomChoice(possible_ints)]
    intrs.push(intr)
    if (exec_time - int_t < 3 ){
      break
    }
  }
  return intrs
}

function add_process(pere,deg,entrance, Config){
  var exec_t = randint(Config["MIN_PROC_TIME"],Config["MAX_PROC_TIME"])
  id_proc++;
  ints = rand_intrs(exec_t,deg,Config)
  return [id_proc, entrance, exec_t, -1, ints.length, ints]
}


function log_comment(comment, color, elem_color){
    var x = document.getElementById("logs");
    var c = `<li style="color:${color}">   ${comment}
        <span style="position: relative;bottom: -7px;">  <svg  height='30' width='30'>  <circle cx='15' cy='15' r='10' stroke='black' stroke_width='3' fill='rgb(${elem_color},1)'/> </svg> </span>
    </li>`;
    x.innerHTML = c + x.innerHTML;
}



/*****************************************************************/

/****** MAIN SVG ************/
var svg = d3.select("main_svg")
    .append("svg")
    .attr("width", 1000)
    .attr("height", 400);
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
            sleep(SPEED).then(() => {
                proc.elem.remove();
            });
        }
    }

    isready(){
      return this.inProcess.length == 0
    }
}

var ALLL = []

class Fifo {
    constructor(x, y, capacite, name=-1) {
        this.x = x;
        this.y = y;
        this.capacite = capacite;
        this.processors = [];
        this.name = name

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
            svg.append('text')
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
        //it returns the indice of the elemt in the Fifo.processors array
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
    constructor(id, exe_time,ints,pere,deg, color="-1",entrance=0) {
        this.id = id
        this.exe_time = exe_time
        this.previous_int_time = 0
        this.ints = ints
        this.left_time = exe_time
        this.left_time_anime = exe_time
        this.pere = pere
        this.deg = deg
        this.entrance = entrance
        this.last_treated = entrance
        this.end = 0
        this.int_counter = 0
        this.block_time = 0
        this.elem = svg.append("circle")
            .attr("id", id)
            .attr("cx", STARTING_PROC_X)
            .attr("cy", STARTING_PROC_Y)
            .attr("r" , PROC_R)
            .attr("stroke", "black")
            .attr("stroke_width", 2)
            .attr("position", "fixed");
        console.log(color);
        if (color == -1){this.color = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
                        this.elem.attr("fill", "rgb("+this.color+")")
                    }
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

        this.history = [[0, -1, "pret"]]

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
            .attr("y", this.y + PROC_TEXT_SPACE).attr("x", this.x -4);


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
            .attr("y", this.y + PROC_TEXT_SPACE).attr("x", this.x - 4);
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
            .attr("y", this.y + PROC_TEXT_SPACE).attr("x", this.x - 4);
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
            .attr("y", this.y + PROC_TEXT_SPACE).attr("x", this.x - 4);
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
            .attr("y", this.y + PROC_TEXT_SPACE).attr("x", this.x - 4);
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

class standard {
  constructor(avrg_time){
    this.avrg_time = avrg_time
  }
}


/********************************************************/

/********************** INITS *****************************/
var pret = new Fifo(STARTING_PRET_X, STARTING_PRET_Y, FIFO_CAPACITY, "FIFO PRET")
pret.createFifo();

var blocked = new Fifo(STARTING_BLOCK_X, STARTING_BLOCK_Y, FIFO_CAPACITY, "FIFO BLOQUE")
blocked.createFifo();

var processor = new Processor(0, PROCESSOR_X, PROCESSOR_Y);
processor.createProcessor();

var std = new standard(0)

var id_proc = 0;

/*************************************************************/

/****************** ALIAS FUNCS ********************/
function treat_process(n) {
    return pret.treat(n)
}

function finish_process() {
    processor.finish_process()
}

function block_process() {
    processor.block_process(blocked)
}

function change_process() {
    processor.block_process(pret)
}

function resume_process(elem) {
    var i_elem = blocked.resume(elem, pret);
}

/***************************************************/


/****** SPEED  **********/

function change_speed(x){
    SPEED = 500*x
    
    elem3 = document.getElementById("speed1")  
    elem2 = document.getElementById("speed2")
    elem1 = document.getElementById("speed3")

    if (x == 1){
        elem1.className = "icon_sim speed_select"
        elem2.className = "icon_sim "
        elem3.className = "icon_sim "

    }else if (x == 2 ){
        elem1.className = "icon_sim "
        elem2.className = "icon_sim speed_select"
        elem3.className = "icon_sim "

    }else{
        elem1.className = "icon_sim "
        elem2.className = "icon_sim "
        elem3.className = "icon_sim speed_select"

    }
}


/****************************/

/***************** FUNCTION TO TEST AREA **************/
function update_left_time(elem, t,end,sub){
    if (t > end){
        sleep(TIME_UNIT).then(() => {
          elem.left_time_anime -= sub;
          // To update the text
          elem.text.text(elem.left_time_anime)
          document.getElementById("menu_proc_exe_time_"+elem.id).innerHTML = ", Temps restant: "+elem.left_time_anime
          update_left_time(elem, t-1,end,sub)})
    }
}

function push_history_inProcess_pret(proc, time){
    /*var a = proc.history[proc.history.length][1]
    proc.history.push([ a, a + time, "In process"])*/

    var l = proc.history.length
    var b = proc.history[l-1][0] + time
    proc.history[l-1][1] = b;
    proc.history[l-1][2] = "In process"
    proc.history.push([b, -1, ""])

    for ( var i = 0; i < pret.processors.length; i++){
        var p = pret.processors[i]
        var l = p.history.length
        if (p.history[l-1][0] > b){
            p.history[l-1][1] = p.history[l-1][0]
            p.history[l-1][2] = "Pret"
            p.history.push([p.history[l-1][0], -1, ""])
        }
        else{
            p.history[l-1][1] = b;
            p.history[l-1][2] = "Pret"
            p.history.push([b, -1, ""])
        }
    }
}

function push_history_blocked(proc, time){
    var l = proc.history.length
    proc.history[l-1][1] = proc.history[l-1][0] + time;
    proc.history[l-1][2] = "Blocked"
    proc.history.push([proc.history[l-1][1], -1, ""])
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
            .text("Interruption Memoire/IO");

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
            .text("Interruption fonction");

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

function find_the_shortest(){
    var i = 0 ;
    for (let index = 1; index < pret.processors.length; index++) {
        if (pret.processors[index].left_time < pret.processors[i].left_time) {i = index ;}
    }
    return i ;
  }

// ALGORITHM 2 : //
//////////////////

function SRJF(mode , proc){
  if (pret.processors.length != 0 || blocked.processors.length != 0 || processor.inProcess.length != 0){
    if (processor.isready() && pret.processors.length != 0 ){
      let elem = treat_process(find_the_shortest());
      log_comment("Traintement du processus "+elem.id,"green", elem.color);
      if (! elem.hasint()){
        current_time+=elem.left_time
        sleep(SPEED).then( () => { update_left_time(elem, elem.left_time,0,1);})
        ALL_PROCS.push((current_time-elem.entrance)-elem.exe_time-elem.block_time)
        if (elem.pere == -1 ){
            sleep(SPEED + elem.left_time * TIME_UNIT).then(() => {
                log_comment("Termination du processus "+elem.id,"blue", elem.color);
                push_history_inProcess_pret(elem, elem.left_time) // CORRECT
                finish_process();SRJF()})
        }else {
              elem.pere.block_time +=current_time-elem.entrance
              sleep(SPEED + elem.left_time * TIME_UNIT).then(() => {
                  log_comment("Termination du processus "+elem.id,"blue", elem.color);
                  log_comment("Debloquage du processus "+elem.pere.id,"orange", elem.color);
                  push_history_inProcess_pret(elem, elem.left_time) // CORRECT
                  finish_process();elem.pere.treat_int();resume_process(elem.pere);sleep(SPEED).then(() => {SRJF()})})
        }
        }else{
          sleep(SPEED).then( () => { update_left_time(elem, elem.left_time,(elem.left_time-elem.int_time()+elem.previous_int_time),1);})
          current_time+=elem.int_time()
          if (elem.type_int() != "function"){
            sleep(SPEED + elem.int_time() * TIME_UNIT).then(() => {
                log_comment("Interuption "+elem.type_int()+" du processus "+elem.id, "red", elem.color);
                mem_intr();
                push_history_inProcess_pret(elem, elem.left_time) // CORRECT
                block_process();SRJF("block",elem)})
          }else{
            sleep(SPEED + elem.int_time() * TIME_UNIT).then(() => {
                func_intr();
                push_history_inProcess_pret(elem, elem.left_time) // CORRECT
                block_process();
                log_comment("Interuption "+elem.type_int()+" du processus "+elem.id, "red", elem.color);
                log_comment("Appel de processus fils du processus "+elem.id, "black", elem.color);
                add_process(elem,elem.deg+1,current_time);sleep(SPEED).then(() => {SRJF()})})
          }
       }
    }
    if (mode == "block"){
      push_history_blocked(proc, proc.int_duration())
      sleep(SPEED + proc.int_duration() * TIME_UNIT ).then(() => {
          log_comment("Resume du processus "+proc.id, "orange", proc.color);
          resume_process(proc);proc.treat_int(); sleep(SPEED).then(() => {SRJF()})})
    }

  }
  else {
      std.avrg_time = ALL_PROCS.reduce((a, b) => a + b, 0) / ALL_PROCS.length
      clean_data(ALLL)
      sleep(SPEED).then(() => { alert("Simualation SRJF have finished")})
      sleep(2000).then(() => {
        document.getElementById('gantt_div').style.display = "block" ;
        document.getElementById('tab_div').style.display = "block" ;
          draw_gantt_(data_SRJF, "FCFS_");
          plot_time_table(all_histories["SRJF"], "plot_time")
          end_of_simulation = true;
      })
  }
}



function clean_data(){
  for(let i = 0 ; i < ALLL.length ; i++){
    let arr = ALLL[i].history
    arr.splice(arr.length,1)
    let passed = false
    while (!passed){
      passed = true
      for (let i = 0 ; i < arr.length -1 ; i++){
        let sub_arr1 = arr[i]
        let sub_arr2 = arr[i+1]
          passed = true
          if (sub_arr1[2]==sub_arr2[2]){
              sub_arr1[1] = sub_arr2[1]
              arr.splice(i+1,1)
              passed = false
              break
            }
        }
    }
  }
}
/*************************************************************/


/************************ UI ********************************/

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
                <table class="info_process_table_new">
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
            <table class="info_process_table_new">
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
