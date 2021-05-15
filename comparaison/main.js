let MIN_PROC_TIME = 5 /**/
let MAX_PROC_TIME = 15 /**/
let MAX_PROC_INTRS = 4 /**/
let MAX_PROC_DEGREE = 3 /**/
let MAX_INTR_DURATION = 10 /**/
let MIN_INTR_DURATION = 5 /**/
let INT_TYPES = ["memory","function","input"]
let MIN_INT_TYPES = ["memory","input"]

let TIME_UNIT = 1 ;
let FIFO_CAPACITY = 15;

// PRIORITE STATIQUE
let MAX_PROC_PRIORITY = 0 /**/
let MIN_PROC_PRIORITY = 10 /**/


var Config = {
    "MIN_PROC_TIME":5,
    "MAX_PROC_TIME":15, /**/
    "MAX_PROC_PRIORITY":0, /**/
    "MIN_PROC_PRIORITY":10, /**/
    "MAX_PROC_INTRS":4, /**/
    "MAX_PROC_DEGREE":3, /**/
    "MAX_INTR_DURATION":10, /**/
    "MIN_INTR_DURATION":5,
    "allow_function_int": 0,
    "UPDATE_TIME":20,
    "MAX_ENTRANCE":7,
    "MIN_ENTRANCE":5,
}
//Genreal info
var ALL_PROCS = []

var id_proc = 0;


var all_histories = {}

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




class Processor {
    constructor() {this.inProcess = []}
    block_process(fifo) {
        if (this.inProcess.length != 0) {
            var elem = this.inProcess.shift()
            elem.block(fifo)
        }
    }
    finish_process() {
        if (this.inProcess.length != 0) {
            var proc = this.inProcess.shift()
        }
    }
    isready(){return this.inProcess.length == 0}
}

class Fifo {
    constructor(capacite, quantum=-1, algorithm="") {
        this.capacite = capacite;
        this.processors = [];
        this.quantum = quantum;
        this.algorithm = algorithm;
    }
    fifoAddProcess(p) {
        this.processors.push(p)
        return this.processors.length;
    }
    treat(n, processor) {
        if (this.processors.length != 0 ) {
              if (processor.isready()){
              var elem = this.processors.splice(n,1)[0];
              processor.inProcess.push(elem);
              return elem
          }
        }
      }
    resume(elem, fifo) {
        if (isNumber(elem)){
            if (elem < this.processors.length){
              var elem_ = this.processors[elem]
              this.processors.splice(elem, 1)
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
            elem.resume(fifo);
            return n;
        }
    }
}

class Process {
    constructor(id, exe_time, ints, pere, deg, priority=0, entrance=0) {
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

        this.level = priority;
        this.priority = priority;

        this.history = [[entrance, -1, "pret"]]

        this.update_on = true;


    }
    move2fifo(fifo) {
        var l = fifo.fifoAddProcess(this);
    }
    block(fifo) {
        var l = fifo.fifoAddProcess(this);
    }
    resume(fifo) {
        var l = fifo.fifoAddProcess(this);
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
    update_priority(TIME_UNIT){
        if ( this.update_on ){
            sleep(Config["UPDATE_TIME"] * TIME_UNIT).then(() => {
                if (this.priority > 0){
                    this.priority = this.priority - 1;
                    this.update_priority(TIME_UNIT)
                }
            })
        }
    }
}



function push_history_inProcess_pret(proc, time, pret){
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

function push_history_inProcess_pret_MULTI(proc, time, list_fifos){

    var l = proc.history.length

    var b = proc.history[l-1][0] + time
    proc.history[l-1][1] = b;
    proc.history[l-1][2] = "In process"
    proc.history.push([b, -1, ""])

    for (var j = 0; j < list_fifos.length; j++){
        for ( var i = 0; i < list_fifos[j].processors.length; i++){
            var p = list_fifos[j].processors[i]
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
}

function push_history_blocked(proc, time){
    var l = proc.history.length
    proc.history[l-1][1] = proc.history[l-1][0] + time;
    proc.history[l-1][2] = "Blocked"
    proc.history.push([proc.history[l-1][1], -1, ""])
}

function get_cpu_usage(){
    var max = 0;
    for (var p = 0; p < ALLL.length; p++){
        if (max < ALLL[p].history[[ALLL[p].history.length-1]][0]){max = ALLL[p].history[[ALLL[p].history.length-1]][0]}
    }

    var cpt = 0;
    for ( var i = 0; i < max; i++){
        var b = 1;
        for (var p = 0; p < ALLL.length; p++){
            for (var state = 0; state < ALLL[p].history.length; state++){
                if ( (ALLL[p].history[state][0] <= i) && (i <=  ALLL[p].history[state][1])){
                    if  (ALLL[p].history[state][2] != "Blocked"){b = 0}
                    break;
                }
            }
            if (b == 0){break}
        }
        cpt = cpt + b;
    }
    console.log((max - cpt)/max);
}



var list_processes = []

function rand_intrs(exec_time, deg, Config) {
  var possible_ints = MIN_INT_TYPES

  if (deg < Config["MAX_PROC_DEGREE"]) {
    possible_ints = INT_TYPES
  }
  if (exec_time > 2 * Config["MAX_PROC_INTRS"]) {
    var nb_intrs = randint(0, Config["MAX_PROC_INTRS"])
  } else {
    var nb_intrs = 1
  }
  intrs = []
  int_t = 0
  for (let i = 0; i < nb_intrs; i++) {
    int_t = randint(int_t + 1, exec_time - 1)
    intr = [int_t, randint(Config["MIN_INTR_DURATION"], Config["MAX_INTR_DURATION"]), randomChoice(possible_ints)]
    intrs.push(intr)
    if (exec_time - int_t < 3) {
      break
    }
  }
  return intrs
}

function add_process(pere, deg, entrance, Config) {
  var exec_t = randint(Config["MIN_PROC_TIME"], Config["MAX_PROC_TIME"])
  var priority = randint(Config["MAX_PROC_PRIORITY"] , Config["MIN_PROC_PRIORITY"])
  var ints =  rand_intrs(exec_t, deg, Config)

  //p : [id, entrance, exe_time, priority, nb_int, [[int_start, int_duration, int_type],[int_start, int_duration, int_type],...]]

  var p = [id_proc, entrance, exec_t, priority, ints.length, ints]
  id_proc++;
  return p;
}

function create_processes(nb_procs, Config) {
  for (let i = 0; i < nb_procs; i++) {
    var entrance = randint(Config["MIN_ENTRANCE"], Config["MAX_ENTRANCE"])*randint(0, 2)*(i != 0)
    //var entrance = 0;
    if (Config["allow_function_int"]) {
      list_processes.push(add_process(-1, 0, entrance, Config))
    } else {
      list_processes.push(add_process(-1, Config["MAX_PROC_DEGREE"], entrance, Config))
    }
  }
  return list_processes
}

function clean_data(ALLL){
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
function history2ganttdata(ALLL, decoration=""){
    var data = []
    for ( var i = 0; i < ALLL.length; i++){
        for ( var j = 0; j < ALLL[i].history.length; j++){
            var state = ALLL[i].history[j][2];


            if (state == "In process"){c = "green"}
            else if (state == "Blocked") {c = "red"}
            else if (state == "Pret") {c = "blue"}
            else {c = "black"}

            if (decoration == ""){
                if ( ALLL[i].history[j][1] == -1 ){
                    data.push(["id:"+i, state, c, ALLL[i].history[j][0], 1+ALLL[i].history[j][0]]);
                }
                else {
                    data.push(["id:"+i, state, c, ALLL[i].history[j][0], ALLL[i].history[j][1]]);
                }
            }
            else if (decoration == "priority"){
                if ( ALLL[i].history[j][1] == -1 ){
                    data.push(["id:"+i+" priority:"+ALLL[i].priority, state, c, ALLL[i].history[j][0], 1+ALLL[i].history[j][0]]);
                }
                else {
                    data.push(["id:"+i+" priority:"+ALLL[i].priority, state, c, ALLL[i].history[j][0], ALLL[i].history[j][1]]);
                }
            }
            else if (decoration == "execution_time"){
                if ( ALLL[i].history[j][1] == -1 ){
                    data.push(["id:"+i+" temps d'execution:"+ALLL[i].exe_time, state, c, ALLL[i].history[j][0], 1+ALLL[i].history[j][0]]);
                }
                else {
                    data.push(["id:"+i+" temps d'execution:"+ALLL[i].exe_time, state, c, ALLL[i].history[j][0], ALLL[i].history[j][1]]);
                }
            }
        }
    }
    return data;
}
function draw_gantt(data, div){
    google.charts.load("current", {packages:["timeline"]});
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {

      var container = document.getElementById(div);
        var chart = new google.visualization.Timeline(container);
        var dataTable = new google.visualization.DataTable();
        dataTable.addColumn({ type: 'string', id: 'Role' });
        dataTable.addColumn({ type: 'string', id: 'Name' });
        dataTable.addColumn({ type: 'string', id: 'style', role: 'style' });
        dataTable.addColumn({ type: 'number', id: 'Start' });
        dataTable.addColumn({ type: 'number', id: 'End' });
      dataTable.addRows(data);
      var options = {
          colors: ['#cbb69d', '#603913'],
        };
      chart.draw(dataTable);
    }
}

function FCFS_init( list_processes, TIME_UNIT, SPEED, draw=false){

    var ALLL = [];
    var ALLL_id = [];

    function treat_process(n) {
        return pret.treat(n, processor)
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


    //FIFO, PROCESSOR INITS
    var pret = new Fifo(FIFO_CAPACITY)
    var blocked = new Fifo(FIFO_CAPACITY)
    var processor = new Processor();

    var waiting_procs = []
    function create_processes_objects(list_processes) {
        for (let i = 0; i < list_processes.length; i++) {
            var info = list_processes[i]
            var p = new Process(info[0],
                                info[2],
                                info[5],
                                -1,
                                0,
                                info[3],
                                info[1])
            if (info[1] == 0){p.move2fifo(pret)}
            else{waiting_procs.push(p)}
            ALLL_id.push(p.id)
            ALLL.push(p)
        }
    }

    function history2ganttdata_2(H){
        data = [];
        for ( var i = 0; i < H.length; i++){
            for ( var j = 0; j < H[i].length; j++){
                var state = H[i][j][2];


                if (state == "In process"){c = "green"}
                else if (state == "Blocked") {c = "red"}
                else if (state == "Pret") {c = "blue"}
                else {c = "black"}

                if ( H[i][j][1] == -1 ){
                    data.push(["id"+i, state, c, H[i][j][0], 1+H[i][j][0]]);
                }
                else {
                    data.push(["id"+i, state, c, H[i][j][0], H[i][j][1]]);
                }
            }
        }
    }

    var first = true;

    function FCFS(mode , proc){
      if (pret.processors.length != 0 || blocked.processors.length != 0 || processor.inProcess.length != 0){
        if (processor.isready() && pret.processors.length != 0 ){
          let elem = treat_process(0);
          if (! elem.hasint()){
            if (elem.pere == -1 ){
                sleep(SPEED + elem.left_time * TIME_UNIT).then(() => {
                    push_history_inProcess_pret(elem, elem.left_time, pret) // CORRECT
                    ALLL_id.splice(ALLL_id.indexOf(elem.id), 1)
                    finish_process();FCFS()})
            }else {
              //elem.pere.block_time +=current_time-elem.entrance
                  sleep(SPEED + elem.left_time * TIME_UNIT).then(() => {
                      push_history_inProcess_pret(elem, elem.left_time, pret)
                      ALLL_id.splice(ALLL_id.indexOf(elem.id), 1)
                      finish_process();elem.pere.treat_int();resume_process(elem.pere);sleep(SPEED).then(() => {FCFS()})})
            }
            }else{
              if (elem.type_int() != "function"){
                elem.block_time+=elem.int_time()
                sleep(SPEED + elem.int_time() * TIME_UNIT).then(() => {
                        sleep(SPEED).then( () => {
                        push_history_inProcess_pret(elem, elem.int_time(), pret)
                        block_process();
                        FCFS("block",elem)})
                })
              }else{
                sleep(SPEED + elem.int_time() * TIME_UNIT).then(() => {
                    block_process();
                    push_history_inProcess_pret(elem, elem.int_time(), pret)
                    //add_process(elem,elem.deg+1,current_time);
                    sleep(SPEED).then(() => {
                        FCFS()
                    })
                })
              }
           }
        }
        if (mode == "block"){
          push_history_blocked(proc, proc.int_duration())
          sleep(SPEED + proc.int_duration() * TIME_UNIT  ).then(() => {
              resume_process(proc);proc.treat_int();
              sleep(SPEED).then(() => {
                  FCFS()})})
        }

      }
      else {
        if (ALLL_id.length == 0){
            console.log("[FINISH] FCFS");
            clean_data(ALLL);
            data = history2ganttdata(ALLL);
            if (draw){draw_gantt(data, "FCFS");}
            var Hist = [];
            for ( var i = 0; i < list_processes.length; i++){
                Hist.push(ALLL[i].history)
            }
            all_histories["FCFS"] = Hist
        }
      }
    }

    //Generate processes and add add process with entrance == 0 to pret
    create_processes_objects(list_processes)
    //Set timer for processes that will be sent to pret after sleep(entrance * TIME_UNIT)
    for (let i = 0; i < waiting_procs.length; i++){
        sleep(waiting_procs[i].entrance * TIME_UNIT).then(() => {
            waiting_procs[i].move2fifo(pret)
            FCFS()
        })
    }
    //The algorithme
    FCFS();
}

function RR_init( list_processes, TIME_UNIT, SPEED, quantum, draw=false){

    var ALLL = [];
    var ALLL_id = [];

    function treat_process(n) {
        return pret.treat(n, processor)
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


    //FIFO, PROCESSOR INITS
    var pret = new Fifo(FIFO_CAPACITY, quantum)
    var blocked = new Fifo(FIFO_CAPACITY)
    var processor = new Processor();
    var waiting_procs = []

    function create_processes_objects(list_processes) {
        for (let i = 0; i < list_processes.length; i++) {
            var info = list_processes[i]
            var p = new Process(info[0],
                                info[2],
                                info[5],
                                -1,
                                0,
                                info[3],
                                info[1])
            if (info[1] == 0){p.move2fifo(pret)}
            else{waiting_procs.push(p)}
            ALLL_id.push(p.id)
            ALLL.push(p)
        }
    }

    function RR(mode,proc) {
      if (pret.processors.length != 0 || blocked.processors.length != 0 || processor.inProcess.length != 0){
        if (processor.isready() && pret.processors.length != 0 ){
          let elem = treat_process(0);
          if (! elem.hasint()){
            if (elem.left_time <= quantum){
              //current_time+=elem.left_time
              if (elem.pere == -1 ){
                  sleep(SPEED + elem.left_time * TIME_UNIT).then(() => {
                      push_history_inProcess_pret(elem, elem.left_time, pret)
                      ALLL_id.splice(ALLL_id.indexOf(elem.id), 1)
                      finish_process();RR()})
              }else {
                    //elem.pere.block_time +=current_time-elem.entrance
                    sleep(SPEED + elem.left_time * TIME_UNIT).then(() => {
                        push_history_inProcess_pret(elem, elem.left_time, pret)
                        ALLL_id.splice(ALLL_id.indexOf(elem.id), 1)
                        finish_process();elem.pere.treat_int();resume_process(elem.pere);sleep(SPEED).then(() => {RR()})})
              }
            }else{
              //current_time+=quantum
                sleep(SPEED + quantum * TIME_UNIT).then(() => {
                    push_history_inProcess_pret(elem, quantum, pret)
                    change_process();elem.left_time-=quantum;sleep(SPEED).then(() => {RR()})})
            }
            }else{
              if (elem.real_int_time()-(elem.exe_time-elem.left_time) <= quantum){
               var t = elem.real_int_time()-(elem.exe_time-elem.left_time)
               //current_time+=t
               if (elem.type_int() != "function"){
                elem.block_time+=elem.int_time()
                sleep(SPEED + t * TIME_UNIT).then(() => {
                    push_history_inProcess_pret(elem, t, pret);
                    block_process();RR("block",elem)})
              }else{
                sleep(SPEED +  t * TIME_UNIT).then(() => {
                    push_history_inProcess_pret(elem, t, pret);
                    block_process();add_process(elem,elem.deg+1,current_time);sleep(SPEED).then(() => {RR()})})
              }
            }
            else {
               //current_time+=quantum
               sleep(SPEED + quantum * TIME_UNIT).then(() => {
                   push_history_inProcess_pret(elem, quantum, pret);
                   change_process();elem.left_time-=quantum;sleep(SPEED).then(() => { RR()})})
            }
           }
        }
        if (mode == "block"){
            push_history_blocked(proc, proc.int_duration())
          sleep(SPEED + proc.int_duration() * TIME_UNIT ).then(() => {
              resume_process(proc);proc.treat_int("RR");;sleep(SPEED).then(() => {RR()})})

        }

      }
      else {
          if ( ALLL_id.length == 0){
              console.log("[FINISH] RR");
          clean_data(ALLL);
          data = history2ganttdata(ALLL);
          if (draw){draw_gantt(data, "RR");}
          var Hist = [];
          for ( var i = 0; i < list_processes.length; i++){
              Hist.push(ALLL[i].history)
          }
          all_histories["RR"] = Hist}
      }
    }

    create_processes_objects(list_processes)
    for (let i = 0; i < waiting_procs.length; i++){
        sleep(waiting_procs[i].entrance * TIME_UNIT).then(() => {
            waiting_procs[i].move2fifo(pret)
            //If the algorithm is finished, then run it again
            RR()
        })
    }
    RR();
}

function MULTI_NV_init( list_processes, TIME_UNIT, SPEED, QUANTUMS, draw=false){

    var ALLL = [];
    var ALLL_id = [];

    function treat_process(n) {
        for (var i = 0; i < NB_FIFO; i++){
            if (list_fifos[i].processors.length != 0){
                return list_fifos[i].treat(n, processor)
            }
        }
    }
    function finish_process() {
        processor.finish_process()
    }
    function block_process(lvl) {
        new_level = (lvl - 1)*(lvl > 0)
        processor.inProcess[0].level = new_level
        processor.block_process(blocked)
    }
    function change_process(lvl) {
        new_level = (lvl + 1)*(lvl < NB_FIFO - 1) + (lvl)*(lvl == NB_FIFO - 1)
        processor.inProcess[0].level = new_level
        processor.block_process(list_fifos[new_level])
    }
    function resume_process(elem) {
        var i_elem = blocked.resume(elem, list_fifos[elem.level]);
    }

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

    //FIFO, PROCESSOR INITS
    var NB_FIFO = QUANTUMS.length;

    var list_fifos = [];
    for (var i = 0; i<NB_FIFO; i++){
        var f = new Fifo(FIFO_CAPACITY,QUANTUMS[i])
        list_fifos.push(f)
    }

    var blocked = new Fifo(FIFO_CAPACITY)
    var processor = new Processor();

    function create_processes_objects(list_processes) {
        for (let i = 0; i < list_processes.length; i++) {
            var info = list_processes[i]
            var p = new Process(info[0],
                                info[2],
                                info[5],
                                -1,
                                0,
                                info[3],
                                info[1])
            if (info[1] == 0){p.move2fifo(list_fifos[0])}
            else{waiting_procs.push(p)}
            ALLL_id.push(p.id)
            ALLL.push(p)
        }
    }

    function MULTI_NV(mode,proc) {
      if (list_fifos_not_empty() || blocked.processors.length != 0 || processor.inProcess.length != 0){
        if (processor.isready() && list_fifos_not_empty() != 0 ){
          let elem = treat_process(0); //Send process to processor
          let lvl = elem.level;
          let qntm = list_fifos[lvl].quantum
          if (! elem.hasint()){ //If processor doesn't have int
            if (elem.left_time <= qntm){
              if (elem.pere == -1 ){
                  sleep(SPEED + elem.left_time * TIME_UNIT).then(() => {
                      push_history_inProcess_pret_MULTI(elem, elem.left_time, list_fifos)
                      ALLL_id.splice(ALLL_id.indexOf(elem.id), 1)
                      finish_process();MULTI_NV()})
              }else {
                    sleep(SPEED + elem.left_time * TIME_UNIT).then(() => {
                        push_history_inProcess_pret_MULTI(elem, elem.left_time, list_fifos)
                        ALLL_id.splice(ALLL_id.indexOf(elem.id), 1)
                        finish_process();elem.pere.treat_int();resume_process(elem.pere);sleep(SPEED).then(() => {MULTI_NV()})})
              }
          }
            else{
                sleep(SPEED + qntm * TIME_UNIT).then(() => {
                    push_history_inProcess_pret_MULTI(elem, qntm, list_fifos)
                    change_process(lvl);elem.left_time-=qntm;sleep(SPEED).then(() => {MULTI_NV()})})
            }
            }
          else{
              if (elem.real_int_time()-(elem.exe_time-elem.left_time) <= qntm){
               var t = elem.real_int_time()-(elem.exe_time-elem.left_time)
               if (elem.type_int() != "function"){
                sleep(SPEED + t * TIME_UNIT).then(() => {
                    push_history_inProcess_pret_MULTI(elem, t, list_fifos);
                    block_process(lvl);MULTI_NV("block",elem)})
              }
              else{
                sleep(SPEED +  t * TIME_UNIT).then(() => {
                    push_history_inProcess_pret_MULTI(elem, t, list_fifos);
                    block_process();add_process(elem,elem.deg+1);sleep(SPEED).then(() => {MULTI_NV()})})
              }
              }else {
               sleep(SPEED + qntm * TIME_UNIT).then(() => {
                   push_history_inProcess_pret_MULTI(elem, qntm, list_fifos);
                   change_process(lvl);elem.left_time-=qntm;sleep(SPEED).then(() => { MULTI_NV()})})
            }
           }
        }
        if (mode == "block"){
            push_history_blocked(proc, proc.int_duration())
          sleep(SPEED + proc.int_duration() * TIME_UNIT ).then(() => {
              resume_process(proc);proc.treat_int("RR");sleep(SPEED).then(() => {MULTI_NV()})})
        }

      }
      else {
          if ( ALLL_id.length == 0){
              console.log("[FINISH] MULTI_NV");
              clean_data(ALLL);
              data = history2ganttdata(ALLL);
              if (draw){draw_gantt(data, "MULTI_NV");}
              var Hist = [];
              for ( var i = 0; i < list_processes.length; i++){
                  Hist.push(ALLL[i].history)
              }
              all_histories["MULTI_NV"] = Hist  ;

          }

      }
    }

    var waiting_procs = []
    create_processes_objects(list_processes)
    for (let i = 0; i < waiting_procs.length; i++){
        sleep(waiting_procs[i].entrance * TIME_UNIT).then(() => {
            waiting_procs[i].move2fifo(list_fifos[0])
            //If the algorithm is finished, then run it again
            MULTI_NV();
        })
    }
    MULTI_NV();
}

function MULTI_NV_PRIO_init( list_processes, TIME_UNIT, SPEED, QUANTUMS, draw=false){

    var ALLL = [];
    var ALLL_id = [];

    function treat_process(n) {
        for (var i = 0; i < NB_FIFO; i++){
            if (list_fifos[i].processors.length != 0){
                return list_fifos[i].treat(n, processor)
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
        processor.block_process(list_fifos[new_level])
    }
    function resume_process(elem) {
        var i_elem = blocked.resume(elem, list_fifos[elem.level]);
    }

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

    //FIFO, PROCESSOR INITS
    var NB_FIFO = QUANTUMS.length;

    var list_fifos = [];
    for (var i = 0; i<NB_FIFO; i++){
        var f = new Fifo(FIFO_CAPACITY,QUANTUMS[i])
        list_fifos.push(f)
    }

    var blocked = new Fifo(FIFO_CAPACITY)
    var processor = new Processor();


    function create_processes_objects(list_processes) {
        for (var i = 0; i < list_processes.length; i++) {
            var info = list_processes[i]
            var p = new Process(info[0],
                                info[2],
                                info[5],
                                -1,
                                0,
                                info[3],
                                info[1])
            if (info[1] == 0){p.move2fifo(list_fifos[info[3]])}
            else{waiting_procs.push(p)}
            ALLL_id.push(p.id)
            ALLL.push(p)
        }
    }

    function MULTI_NV(mode,proc) {
      if (list_fifos_not_empty() || blocked.processors.length != 0 || processor.inProcess.length != 0){
        if (processor.isready() && list_fifos_not_empty() != 0 ){
          let elem = treat_process(0); //Send process to processor
          let lvl = elem.level;
          let qntm = list_fifos[lvl].quantum
          if (! elem.hasint()){ //If processor doesn't have int
            if (elem.left_time <= qntm){
              if (elem.pere == -1 ){
                  sleep(SPEED + elem.left_time * TIME_UNIT).then(() => {
                      push_history_inProcess_pret_MULTI(elem, elem.left_time, list_fifos)
                      ALLL_id.splice(ALLL_id.indexOf(elem.id), 1)
                      finish_process();MULTI_NV()})
              }else {
                    sleep(SPEED + elem.left_time * TIME_UNIT).then(() => {
                        push_history_inProcess_pret_MULTI(elem, elem.left_time, list_fifos)
                        ALLL_id.splice(ALLL_id.indexOf(elem.id), 1)
                        finish_process();elem.pere.treat_int();resume_process(elem.pere);sleep(SPEED).then(() => {MULTI_NV()})})
              }
          }
            else{
                sleep(SPEED + qntm * TIME_UNIT).then(() => {
                    push_history_inProcess_pret_MULTI(elem, qntm, list_fifos)
                    change_process(lvl);elem.left_time-=qntm;sleep(SPEED).then(() => {MULTI_NV()})})
            }
            }
          else{
              if (elem.real_int_time()-(elem.exe_time-elem.left_time) <= qntm){
               var t = elem.real_int_time()-(elem.exe_time-elem.left_time)
               if (elem.type_int() != "function"){
                sleep(SPEED + t * TIME_UNIT).then(() => {
                    push_history_inProcess_pret_MULTI(elem, t, list_fifos);
                    block_process(lvl);MULTI_NV("block",elem)})
              }
              else{
                sleep(SPEED +  t * TIME_UNIT).then(() => {
                    push_history_inProcess_pret_MULTI(elem, t, list_fifos);
                    block_process();add_process(elem,elem.deg+1);sleep(SPEED).then(() => {MULTI_NV()})})
              }
              }else {
               sleep(SPEED + qntm * TIME_UNIT).then(() => {
                   push_history_inProcess_pret_MULTI(elem, qntm, list_fifos);
                   change_process(lvl);elem.left_time-=qntm;sleep(SPEED).then(() => { MULTI_NV()})})
            }
           }
        }
        if (mode == "block"){
            push_history_blocked(proc, proc.int_duration())
          sleep(SPEED + proc.int_duration() * TIME_UNIT ).then(() => {
              resume_process(proc);proc.treat_int("RR");sleep(SPEED).then(() => {MULTI_NV()})})
        }

      }
      else {
          if (ALLL_id.length == 0){
          console.log("[FINISH] MULTI_NV_PRIO");
          clean_data(ALLL);
          data = history2ganttdata(ALLL, "priority"); // draw priority in the gantt chart
          if (draw){draw_gantt(data, "MULTI_NV_PRIO");}
          var Hist = [];
          for ( var i = 0; i < list_processes.length; i++){
              Hist.push(ALLL[i].history)
          }
          all_histories["MULTI_NV_PRIO"] = Hist}

      }
    }

    var waiting_procs = []
    create_processes_objects(list_processes)
    for (let i = 0; i < waiting_procs.length; i++){
        sleep(waiting_procs[i].entrance * TIME_UNIT).then(() => {
            waiting_procs[i].move2fifo(list_fifos[waiting_procs[i].priority])
            //If the algorithm is finished, then run it again
            MULTI_NV();
        })
    }
    MULTI_NV();
}

function SJF_init( list_processes, TIME_UNIT, SPEED, draw=false){

    var ALLL = [];
    var ALLL_id = [];

    function treat_process(n) {
        return pret.treat(n, processor)
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


    //FIFO, PROCESSOR INITS
    var pret = new Fifo(FIFO_CAPACITY)
    var blocked = new Fifo(FIFO_CAPACITY)
    var processor = new Processor();

    function create_processes_objects(list_processes) {
        for (let i = 0; i < list_processes.length; i++) {
            var info = list_processes[i]
            var p = new Process(info[0],
                                info[2],
                                info[5],
                                -1,
                                0,
                                info[3],
                                info[1])
            if (info[1] == 0){p.move2fifo(pret)}
            else{waiting_procs.push(p)}
            ALLL_id.push(p.id)
            ALLL.push(p)
        }
    }

    function history2ganttdata_2(H){
        data = [];
        for ( var i = 0; i < H.length; i++){
            for ( var j = 0; j < H[i].length; j++){
                var state = H[i][j][2];


                if (state == "In process"){c = "green"}
                else if (state == "Blocked") {c = "red"}
                else if (state == "Pret") {c = "blue"}
                else {c = "black"}

                if ( H[i][j][1] == -1 ){
                    data.push(["id"+i, state, c, H[i][j][0], 1+H[i][j][0]]);
                }
                else {
                    data.push(["id"+i, state, c, H[i][j][0], H[i][j][1]]);
                }
            }
        }
    }

    function find_the_shortest(){
      var i = 0 ;
      for (let index = 1; index < pret.processors.length; index++) {
        if (pret.processors[index].exe_time < pret.processors[i].exe_time) {
          i = index ;
        }
      }
      return i ;
    }

    function SJF(mode , proc){
      if (pret.processors.length != 0 || blocked.processors.length != 0 || processor.inProcess.length != 0){
        if (processor.isready() && pret.processors.length != 0 ){
          let elem = treat_process(find_the_shortest());
          if (! elem.hasint()){
            //current_time+=elem.left_time
            if (elem.pere == -1 ){
                sleep(SPEED + elem.left_time * TIME_UNIT).then(() => {
                    ALLL_id.splice(ALLL_id.indexOf(elem.id), 1)
                   push_history_inProcess_pret(elem, elem.left_time, pret);finish_process();SJF()})
            }else {
                 // elem.pere.block_time +=current_time-elem.entrance
                  sleep(SPEED + elem.left_time * TIME_UNIT).then(() => {
                      ALLL_id.splice(ALLL_id.indexOf(elem.id), 1)
                  push_history_inProcess_pret(elem, elem.left_time, pret);finish_process();elem.pere.treat_int();resume_process(elem.pere);sleep(SPEED).then(() => {SJF()})})
            }
            }else{
              //current_time+=elem.int_time()
              if (elem.type_int() != "function"){
                  sleep(SPEED + elem.int_time() * TIME_UNIT).then(() => {sleep(SPEED).then(() => {
                      push_history_inProcess_pret(elem, elem.int_time(), pret)
                      block_process();SJF("block",elem)})})
              }else{
                  sleep(SPEED + elem.int_time() * TIME_UNIT).then(() => {
                      block_process();
                      push_history_inProcess_pret(elem, elem.int_time(), pret)
                      add_process(elem,elem.deg+1,current_time);sleep(SPEED).then(() => {SJF()})})
              }
           }
        }
        if (mode == "block"){
            push_history_blocked(proc, proc.int_duration())
            sleep(SPEED + proc.int_duration() * TIME_UNIT ).then(() => {
                resume_process(proc);proc.treat_int(); sleep(SPEED).then(() => {SJF()})})
        }

      }
      else {
            if (ALLL_id.length == 0){
                console.log("[FINISH] SJF");
                clean_data(ALLL);
                data = history2ganttdata(ALLL, "execution_time");
                if (draw){draw_gantt(data, "SJF");}
                var Hist = [];
                for ( var i = 0; i < list_processes.length; i++){
                    Hist.push(ALLL[i].history)
                }
                all_histories["SJF"] = Hist
            }

      }
    }

    var waiting_procs = []
    create_processes_objects(list_processes)
    for (let i = 0; i < waiting_procs.length; i++){
        sleep(waiting_procs[i].entrance * TIME_UNIT).then(() => {
            waiting_procs[i].move2fifo(pret)
            SJF()
        })
    }
    SJF();
}

function SRJF_init( list_processes, TIME_UNIT, SPEED, draw=false){

    var ALLL = [];
    var ALLL_id = [];

    function treat_process(n) {
        return pret.treat(n, processor)
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


    //FIFO, PROCESSOR INITS
    var pret = new Fifo(FIFO_CAPACITY)
    var blocked = new Fifo(FIFO_CAPACITY)
    var processor = new Processor();

    function create_processes_objects(list_processes) {
        for (let i = 0; i < list_processes.length; i++) {
            var info = list_processes[i]
            var p = new Process(info[0],
                                info[2],
                                info[5],
                                -1,
                                0,
                                info[3],
                                info[1])
            if (info[1] == 0){p.move2fifo(pret)}
            else{waiting_procs.push(p)}
            ALLL_id.push(p.id)
            ALLL.push(p)
        }
    }

    function history2ganttdata_2(H){
        data = [];
        for ( var i = 0; i < H.length; i++){
            for ( var j = 0; j < H[i].length; j++){
                var state = H[i][j][2];


                if (state == "In process"){c = "green"}
                else if (state == "Blocked") {c = "red"}
                else if (state == "Pret") {c = "blue"}
                else {c = "black"}

                if ( H[i][j][1] == -1 ){
                    data.push(["id"+i, state, c, H[i][j][0], 1+H[i][j][0]]);
                }
                else {
                    data.push(["id"+i, state, c, H[i][j][0], H[i][j][1]]);
                }
            }
        }
    }

    function find_the_shortest(){
        var i = 0 ;
        for (let index = 1; index < pret.processors.length; index++) {
            if (pret.processors[index].left_time < pret.processors[i].left_time) {
                i = index ;
            }
        }
        return i ;
    }

    function SRJF(mode , proc){
      if (pret.processors.length != 0 || blocked.processors.length != 0 || processor.inProcess.length != 0){
        if (processor.isready() && pret.processors.length != 0 ){
          let elem = treat_process(find_the_shortest());
          if (! elem.hasint()){
            //current_time+=elem.left_time
            if (elem.pere == -1 ){
                sleep(SPEED + elem.left_time * TIME_UNIT).then(() => {
                    ALLL_id.splice(ALLL_id.indexOf(elem.id), 1)
                   push_history_inProcess_pret(elem, elem.left_time, pret);finish_process();SRJF()})
            }else {
                 // elem.pere.block_time +=current_time-elem.entrance
                  sleep(SPEED + elem.left_time * TIME_UNIT).then(() => {
                      ALLL_id.splice(ALLL_id.indexOf(elem.id), 1)
                  push_history_inProcess_pret(elem, elem.left_time, pret);finish_process();elem.pere.treat_int();resume_process(elem.pere);sleep(SPEED).then(() => {SRJF()})})
            }
            }else{
              //current_time+=elem.int_time()
              if (elem.type_int() != "function"){
                  sleep(SPEED + elem.int_time() * TIME_UNIT).then(() => {sleep(SPEED).then(() => {
                      push_history_inProcess_pret(elem, elem.int_time(), pret)
                      block_process();SRJF("block",elem)})})
              }else{
                  sleep(SPEED + elem.int_time() * TIME_UNIT).then(() => {
                      block_process();
                      push_history_inProcess_pret(elem, elem.int_time(), pret)
                      add_process(elem,elem.deg+1,current_time);sleep(SPEED).then(() => {SRJF()})})
              }
           }
        }
        if (mode == "block"){
            push_history_blocked(proc, proc.int_duration())
            sleep(SPEED + proc.int_duration() * TIME_UNIT ).then(() => {
                resume_process(proc);proc.treat_int(); sleep(SPEED).then(() => {SRJF()})})
        }

      }
      else {
          if (ALLL_id.length == 0){
              console.log("[FINISH] SRJF");
            clean_data(ALLL);
            data = history2ganttdata(ALLL, "execution_time");
            if (draw) {draw_gantt(data, "SRJF");}
            var Hist = [];
            for ( var i = 0; i < list_processes.length; i++){
                Hist.push(ALLL[i].history)
            }
            all_histories["SRJF"] = Hist}
      }
    }

    var waiting_procs = []
    create_processes_objects(list_processes)
    for (let i = 0; i < waiting_procs.length; i++){
        sleep(waiting_procs[i].entrance * TIME_UNIT).then(() => {
            waiting_procs[i].move2fifo(pret)
            SRJF()
        })
    }
    SRJF();
}

function PS_init( list_processes, TIME_UNIT, SPEED, draw=false){

    var ALLL = [];
    var ALLL_id = [];


    function treat_process(n) {
        return pret.treat(n, processor)
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


    //FIFO, PROCESSOR INITS
    var pret = new Fifo(FIFO_CAPACITY)
    var blocked = new Fifo(FIFO_CAPACITY)
    var processor = new Processor();

    function create_processes_objects(list_processes) {
        for (let i = 0; i < list_processes.length; i++) {
            var info = list_processes[i]
            var p = new Process(info[0],
                                info[2],
                                info[5],
                                -1,
                                0,
                                info[3],
                                info[1])
            if (info[1] == 0){p.move2fifo(pret)}
            else{waiting_procs.push(p)}
            ALLL_id.push(p.id)
            ALLL.push(p)
        }
    }

    function history2ganttdata_2(H){
        data = [];
        for ( var i = 0; i < H.length; i++){
            for ( var j = 0; j < H[i].length; j++){
                var state = H[i][j][2];


                if (state == "In process"){c = "green"}
                else if (state == "Blocked") {c = "red"}
                else if (state == "Pret") {c = "blue"}
                else {c = "black"}

                if ( H[i][j][1] == -1 ){
                    data.push(["id"+i, state, c, H[i][j][0], 1+H[i][j][0]]);
                }
                else {
                    data.push(["id"+i, state, c, H[i][j][0], H[i][j][1]]);
                }
            }
        }
    }

    function find_the_highest_priority(){
        var i = 0 ;
        for (let index = 1; index < pret.processors.length; index++) {
            if (pret.processors[index].priority < pret.processors[i].priority) {
                i = index ;
            }
        }
        return i ;
    }


    function PS(mode , proc){
      if (pret.processors.length != 0 || blocked.processors.length != 0 || processor.inProcess.length != 0){
        if (processor.isready() && pret.processors.length != 0 ){
          let elem = treat_process(find_the_highest_priority());
          if (! elem.hasint()){
            //current_time+=elem.left_time
            if (elem.pere == -1 ){
                sleep(SPEED + elem.left_time * TIME_UNIT).then(() => {
                    ALLL_id.splice(ALLL_id.indexOf(elem.id), 1)
                   push_history_inProcess_pret(elem, elem.left_time, pret);finish_process();PS()})
            }else {
                 // elem.pere.block_time +=current_time-elem.entrance
                  sleep(SPEED + elem.left_time * TIME_UNIT).then(() => {
                      ALLL_id.splice(ALLL_id.indexOf(elem.id), 1)
                  push_history_inProcess_pret(elem, elem.left_time, pret);finish_process();elem.pere.treat_int();resume_process(elem.pere);sleep(SPEED).then(() => {PS()})})
            }
            }else{
              //current_time+=elem.int_time()
              if (elem.type_int() != "function"){
                  sleep(SPEED + elem.int_time() * TIME_UNIT).then(() => {sleep(SPEED).then(() => {
                      push_history_inProcess_pret(elem, elem.int_time(), pret)
                      block_process();PS("block",elem)})})
              }else{
                  sleep(SPEED + elem.int_time() * TIME_UNIT).then(() => {
                      block_process();
                      push_history_inProcess_pret(elem, elem.int_time(), pret)
                      add_process(elem,elem.deg+1,current_time);sleep(SPEED).then(() => {PS()})})
              }
           }
        }
        if (mode == "block"){
            push_history_blocked(proc, proc.int_duration())
            sleep(SPEED + proc.int_duration() * TIME_UNIT ).then(() => {
                resume_process(proc);proc.treat_int(); sleep(SPEED).then(() => {PS()})})
        }

      }
      else {
          if ( ALLL_id.length == 0){
              console.log("[FINISH] PRIO STATIQUE");
            clean_data(ALLL);
            data = history2ganttdata(ALLL, "priority");
            if (draw){ draw_gantt(data, "PS");}
            var Hist = [];
            for ( var i = 0; i < list_processes.length; i++){
                Hist.push(ALLL[i].history)
            }
            all_histories["PS"] = Hist}
      }
    }

    var waiting_procs = []
    create_processes_objects(list_processes)
    for (let i = 0; i < waiting_procs.length; i++){
        sleep(waiting_procs[i].entrance * TIME_UNIT).then(() => {
            waiting_procs[i].move2fifo(pret)
            PS()
        })
    }
    PS();
}

function PD_init( list_processes, TIME_UNIT, SPEED, draw=false){

    var ALLL = [];
    var ALLL_id = [];

    function treat_process(n) {
        return pret.treat(n, processor)
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
    function start_update_counter(proc, TIME_UNIT){
        proc.update_on = true;
        proc.update_priority(TIME_UNIT);
    }


    //FIFO, PROCESSOR INITS
    var pret = new Fifo(FIFO_CAPACITY)
    var blocked = new Fifo(FIFO_CAPACITY)
    var processor = new Processor();

    function create_processes_objects(list_processes) {
        for (let i = 0; i < list_processes.length; i++) {
            var info = list_processes[i]
            var p = new Process(info[0],
                                info[2],
                                info[5],
                                -1,
                                0,
                                info[3],
                                info[1])
            if (info[1] == 0){p.move2fifo(pret)}
            else{waiting_procs.push(p)}
            ALLL.push(p)
            ALLL_id.push(p.id)
        }
    }

    function find_the_highest_priority(){
        var i = 0 ;
        for (let index = 1; index < pret.processors.length; index++) {
            if (pret.processors[index].priority < pret.processors[i].priority) {
                i = index ;
            }
        }
        return i ;
    }

    var first = true;

    function PD(mode , proc){
       if (pret.processors.length != 0 || blocked.processors.length != 0 || processor.inProcess.length != 0){
         if (first){
             for (var i = 0; i < pret.processors.length; i++){
                 start_update_counter(pret.processors[i], TIME_UNIT);
             }
             first = false;
         }
        if (processor.isready() && pret.processors.length != 0 ){
          let elem = treat_process(find_the_highest_priority());
          elem.update_on = false;
          if (! elem.hasint()){
            //current_time+=elem.left_time
            if (elem.pere == -1 ){
                sleep(SPEED + elem.left_time * TIME_UNIT).then(() => {
                    ALLL_id.splice(ALLL_id.indexOf(elem.id), 1)
                   push_history_inProcess_pret(elem, elem.left_time, pret);finish_process();PD()})
            }else {
                 // elem.pere.block_time +=current_time-elem.entrance
                  sleep(SPEED + elem.left_time * TIME_UNIT).then(() => {
                      ALLL_id.splice(ALLL_id.indexOf(elem.id), 1)
                  push_history_inProcess_pret(elem, elem.left_time, pret);finish_process();elem.pere.treat_int();resume_process(elem.pere);sleep(SPEED).then(() => {PD()})})
            }
            }else{
              //current_time+=elem.int_time()
              if (elem.type_int() != "function"){
                  sleep(SPEED + elem.int_time() * TIME_UNIT).then(() => {sleep(SPEED).then(() => {
                      push_history_inProcess_pret(elem, elem.int_time(), pret)
                      block_process();PD("block",elem)})})
              }else{
                  sleep(SPEED + elem.int_time() * TIME_UNIT).then(() => {
                      block_process();
                      push_history_inProcess_pret(elem, elem.int_time(), pret)
                      add_process(elem,elem.deg+1,current_time);sleep(SPEED).then(() => {PD()})})
              }
           }
        }
        if (mode == "block"){
            push_history_blocked(proc, proc.int_duration())
            sleep(SPEED + proc.int_duration() * TIME_UNIT ).then(() => {
                resume_process(proc);proc.treat_int(); sleep(SPEED).then(() => {PD()})})
        }

      }
      else {
          if ( ALLL_id.length == 0){
              console.log("[FINISH] PRIO DYNAMIQUE");
            clean_data(ALLL);
            data = history2ganttdata(ALLL, "priority");
            if (draw) {draw_gantt(data, "PD");}
            var Hist = [];
            for ( var i = 0; i < list_processes.length; i++){
                Hist.push(ALLL[i].history)
            }
            all_histories["PD"] = Hist}
      }
    }

    var waiting_procs = []
    create_processes_objects(list_processes)
    for (let i = 0; i < waiting_procs.length; i++){
        sleep(waiting_procs[i].entrance * TIME_UNIT).then(() => {
            waiting_procs[i].move2fifo(pret)
            PD()
        })
    }
    PD();
}



/************COMPARAISON ALGORITHMS**************/

//C'est le temps passé par le processus dans le système.
function turn_around_time_(process_history){
  let sum = 0 ;
  for(const process_event of process_history)
  {
      if(process_event[1] == -1) sum += process_event[0] ;
      else sum += process_event[1] - process_event[0]   ;
  }
  return sum ;
}

function turn_around_time(process_history){
    return process_history[process_history.length-1][0]
}

//C’est le temps passé dans la file des processus prêts
function waiting_time(process_history){
  let sum = 0 ;
  for(const process_event of process_history)
  {
      if(process_event[2].localeCompare("Pret") == 0)
      {
          sum += process_event[1] - process_event[0] ;
      }
  }
  return sum ;
}

//to get simulation finish time
function get_finish_time(process_info_list){
  max = 0 ;
  for(const process_history of process_info_list)
  {
      if(process_history.slice(-1)[0][0] > max) max = process_history.slice(-1)[0][0] ;
  }
  return max ;
}

//this functions returns a list of the number of processes finished per TIME UNIT
// nous donne une liste chronologique suivant l'unité de temps du nombres de processus terminé par UT(ici on prends 8 ) .
function throughput(process_info_list){
  let time = 0  ;
  let cpt = 0 ;
  let throughput_list = [] ;
  let condition = false ;
  let finish_time = get_finish_time(process_info_list) ;
  while(!condition)
  {
      cpt = 0 ;
      for(const process_history of process_info_list)
      {
          if( ((time)  < process_history.slice(-1)[0][0] ) && (time + 8*TIME_UNIT)  >= process_history.slice(-1)[0][0] )
          {
              cpt++ ;
          }
          if(time >= finish_time) condition = true  ;
      }
      time += 8*TIME_UNIT ;
      throughput_list.push(cpt) ;
  }

  return throughput_list ;
}


// It is the average number of processes residing in the ready queue waiting for their turn to get into the CPU.
// temps moyens des
function load_average(process_info_list){
  let time = 0  ;
  let cpt = 0 ;
  let ready_list = [] ;
  let condition = false ;
  let finish_time = get_finish_time(process_info_list) ;
  while(!condition)
  {
      cpt = 0 ;
      for(const process_history of process_info_list)
      {
          for(const process_event of process_history)
          {
              if(process_event[2].localeCompare("Pret") == 0)
              {
                  if(process_event[0] <= time && process_event[1] > time) cpt++ ;
              }
          }
          if(time >= finish_time) condition = true  ;
      }
      time += TIME_UNIT ;
      ready_list.push(cpt) ;
  }

  return ((ready_list.reduce((a, b) => a + b, 0)) / ready_list.length).toFixed(2) ;
}



function get_unused_time(list){
  var max = 0;
  for (var p = 0; p < list.length; p++){
  if (max < list[p][list[p].length-1][0]){max = list[p][list[p].length-1][0]}
  }

  var cpt = 0;
  for ( var i = 0; i < max; i++){
      var b = 1;
      for (var p = 0; p < list.length; p++){
          for (var state = 0; state < list[p].length; state++){
              if ( (list[p][state][0] <= i) && (i <=  list[p][state][1])){
                  if  (list[p][state][2] != "Blocked"){b = 0}
                  break;
              }
          }
          if (b == 0){break}
      }
      cpt = cpt + b;
  }
  return cpt ;
}

function cpu_unused_time(process_info_list){
  let unused_time = get_unused_time(process_info_list) ;
  let cpt = 0 ;
  let sum_of_respond_time = 0 ;
  for (const process_history of process_info_list)
  {
  for(const process_event of process_history)
  {
      if(process_event[2].localeCompare("In process") == 0)
      {
          sum_of_respond_time += respond_time(process_history) ;
      }
  }
  }
  return unused_time + sum_of_respond_time  ;
}


function respond_time(process_history){
  let random_request = ((Math.random() * (0.05 - 0.01) + 0.01).toFixed(4))*(process_history.length)  ;
 if(random_request > 1 ) return 1 ;
 else return random_request ;
}



function mean_turn_around_time(process_info_list)
{
    let sum = 0 ;
    for (const process_history of process_info_list)
    {
        sum += turn_around_time(process_history)  ;
    }
    return (sum / process_info_list.length ).toFixed(2)  ;
}

function mean_waiting_time(process_info_list)
{
    let sum = 0 ;
    for (const process_history of process_info_list)
    {
        sum += waiting_time(process_history)  ;
    }
    return (sum / process_info_list.length ).toFixed(2)  ;
}

function mean_respond_time(process_info_list)
{
    let sum = 0 ;
    for (const process_history of process_info_list)
    {
        sum += respond_time(process_history)  ;
    }
    return (sum / process_info_list.length ).toFixed(2)  ;
}


function afficher_criteres(simulation_history)
{
  for (const [key, value] of Object.entries(simulation_history))
  {
    let i ;
    console.log("********************   Critères de l'algorithmes " + `${key}` + ": ****************" ) ;
    console.log("Critères des Processus : ") ;
    i = 1

  for (const process_history of value)
  {
    console.log("---Processus--- " + i ) ; i++ ;
    console.log("Temps de résidence : "  +  turn_around_time(process_history)+ " UT") ;
    console.log("Temps d'attente : " + waiting_time(process_history)+ " UT") ;
    console.log("Temps de réponse : " + respond_time(process_history) + " UT") ;
  }

  console.log("----Critères de la Simulation-----") ;
  console.log("nombres de processus finie en chaque  8 UT: "  + throughput(value)) ;
  console.log("Nombre de processus pret moyen: " + load_average(value) + " 1/UT") ;
  console.log("Temps de résidence moyen: "  + mean_turn_around_time(value)+ " UT") ;
  console.log("Temps d'attente moyen: "  + mean_waiting_time(value)+ " UT") ;
  console.log("Temps de réponse moyen: "  + mean_respond_time(value)+ " UT") ;
  console.log("temps de la non utilisation du CPU: " + get_unused_time(value)+ " UT") ;
  console.log("finish time: " + get_finish_time(value)+ " UT") ;
  console.log("usage du CPU(%): " +  (100 - (get_unused_time(value)*100)/get_finish_time(value)).toFixed() + "%") ;

 }
}
