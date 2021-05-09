/************COMPARAISON ALGORITHMS**************/
let process_info_list = [[ 
  [ 0 , 1 , "In process" ], 
  [ 1 , 20 , "Blocked" ] , 
  [ 20 , 31 , "Pret" ] , 
  [ 31 , 33 , "In process" ],  
  [ 33 , -1 , "Fin" ] , 
] , 
[ 
  [ 0 , 1 , "Pret" ] , 
  [ 1 , 2 , "In process" ]  , 
  [ 2 , 8 , "Blocked" ]  , 
  [ 8 , 13 , "Pret" ]  , 
  [ 13 , 14 , "In process" ] , 
  [ 14 , 24 , "Blocked" ],
  [ 24 , 28 , "Pret" ]  , 
  [ 28 , 29 , "In process" ] ,
  [ 29 , -1 , "Fin" ]  , 
], 
[ 
  [ 0 , 2 , "Pret" ] , 
  [ 2 , 3 , "In process" ]  , 
  [ 3 , 9 , "Blocked" ] , 
  [ 9 , 14 , "Pret" ] ,
  [ 14 , 17 , "In process" ] ,
  [ 17 , 22 , "Blocked" ] ,
  [ 22 , 26 , "In process" ] ,
  [ 26 , -1 , "Fin" ] ,
] ,
[ 
  [ 0 , 3 , "Pret" ] ,
  [ 3 , 4 , "In process" ] ,
  [ 4 , 8 , "Blocked" ] ,
  [ 8 , 17 , "Pret" ] ,
  [ 17 , 19 , "In process" ] ,
  [ 19 , 22 , "Blocked" ] ,
  [ 22 , 25 , "Pret" ] ,
  [ 25 , -1 , "Fin" ] ,
]]




function turn_around_time(process_history)
{
  let sum = 0 ; 
  for(const process_event of process_history)
  {
      if(process_event[1] == -1) sum += process_event[0] ; 
      else sum += process_event[1] - process_event[0]   ; 
  }
  return sum ; 
}

function waiting_time(process_history)
{
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


function get_finish_time(process_info_list)
{
  max = 0 ; 
  for(const process_history of process_info_list)
  {
      if(process_history.slice(-1)[0][0] > max) max = process_history.slice(-1)[0][0] ;    
  }
  return max ; 
}

//this functions returns a list of the number of processes finished per TIME UNIT
function throughput(process_info_list)
{
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
          if( ((time)  < process_history.slice(-1)[0][0] ) && (time + TIME_UNIT)  >= process_history.slice(-1)[0][0] )
          {
              cpt++ ;  
          }
          if(time >= finish_time) condition = true  ;
      }
      time += TIME_UNIT ;
      throughput_list.push(cpt) ; 
  }

return throughput_list ; 
}


// It is the average number of processes residing in the ready queue waiting for their turn to get into the CPU.
function load_average(process_info_list)
{
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

function cpu_unused_time(process_info_list)
{
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


function respond_time(process_history)
{ 
  let random_request = ((Math.random() * (0.05 - 0.01) + 0.01).toFixed(4))*(process_history.length)  ; 
 if(random_request > 1 ) return 1 ;
 else return random_request ;
}

console.log(cpu_unused_time(process_info_list));  ;
