const primaryColor = '#4834d4'
const warningColor = '#f0932b'
const successColor = '#6ab04c'
const dangerColor = '#eb4d4b'

const themeCookieName = 'theme'
const themeDark = 'dark'
const themeLight = 'light'

var THEME = -1;

const body = document.getElementsByTagName('body')[0]

function setCookie(cname, cvalue, exdays) {
    var d = new Date()
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
    var expires = "expires=" + d.toUTCString()
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/"
}

function getCookie(cname) {
    var name = cname + "="
    var ca = document.cookie.split(';')
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1)
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length)
        }
    }
    return ""
}

loadTheme()

function loadTheme() {
    var theme = getCookie(themeCookieName)
    THEME = theme
    body.classList.add(theme === "" ? themeLight : theme)
    //body.classList.add(theme)
    if (theme == "dark") {

        processor.rect.attr("fill", "#23242d")
        svg.attr("fill", "white")
        for (a of document.getElementsByClassName("container")) {
            a.classList.remove("container_light");
            a.classList.add("container_dark")
        }
        for (a of document.getElementsByClassName("small_container")) {
            a.classList.remove("small_container_light");
            a.classList.add("small_container_dark")
        }
        for (a of document.getElementsByClassName("button_")) {
            a.getElementsByTagName("input")[0].classList.remove("button_input_light")
            a.getElementsByTagName("input")[0].classList.add("button_input_dark")
        }
        for (a of document.getElementsByClassName("number_controller")) {
            a.classList.remove("number_controller_light");
            a.classList.add("number_controller_dark")
        }
        for (a of document.getElementsByClassName("info_div")) {
            a.classList.remove("info_div_light");
            a.classList.add("info_div_dark")
        }
        for (a of document.getElementsByTagName("bodypopup")) {
            for (b of a.getElementsByTagName("table")) {
                for (c of a.getElementsByTagName("th")) {
                    c.classList.remove("bodypopup_table_th_light")
                    c.classList.add("bodypopup_table_th_dark")
                }
            }
        }
    } else {
        processor.rect.attr("fill", "white")
        svg.attr("fill", "black")
        for (a of document.getElementsByClassName("container")) {
            a.classList.remove("container_dark");
            a.classList.add("container_light")
        }
        for (a of document.getElementsByClassName("small_container")) {
            a.classList.remove("small_container_dark");
            a.classList.add("small_container_light")
        }
        for (a of document.getElementsByClassName("button_")) {
            a.getElementsByTagName("input")[0].classList.remove("button_input_dark")
            a.getElementsByTagName("input")[0].classList.add("button_input_light")
        }
        for (a of document.getElementsByClassName("number_controller")) {
            a.classList.remove("number_controller_dark");
            a.classList.add("number_controller_light")
        }
        for (a of document.getElementsByClassName("info_div")) {
            a.classList.remove("info_div_dark");
            a.classList.add("info_div_light")
        }
        for (a of document.getElementsByTagName("bodypopup")) {
            for (b of a.getElementsByTagName("table")) {
                for (c of a.getElementsByTagName("th")) {
                    c.classList.remove("bodypopup_table_th_dark")
                    c.classList.add("bodypopup_table_th_light")
                }
            }
        }
    }
}

function switchTheme() {
    if (body.classList.contains(themeLight)) {
        THEME = "dark"
        body.classList.remove(themeLight)
        body.classList.add(themeDark)
        processor.rect.attr("fill", "#23242d")
        svg.attr("fill", "white")
        for (a of document.getElementsByClassName("container")) {
            a.classList.remove("container_light");
            a.classList.add("container_dark")
        }
        for (a of document.getElementsByClassName("small_container")) {
            a.classList.remove("small_container_light");
            a.classList.add("small_container_dark")
        }
        for (a of document.getElementsByClassName("button_")) {
            a.getElementsByTagName("input")[0].classList.remove("button_input_light")
            a.getElementsByTagName("input")[0].classList.add("button_input_dark")
        }
        for (a of document.getElementsByClassName("number_controller")) {
            a.classList.remove("number_controller_light");
            a.classList.add("number_controller_dark")
        }
        for (a of document.getElementsByClassName("info_div")) {
            a.classList.remove("info_div_light");
            a.classList.add("info_div_dark")
        }
        console.log("PIPI");
        for (a of document.getElementsByTagName("bodypopup")) {
            for (b of a.getElementsByTagName("table")) {
                for (c of a.getElementsByTagName("th")) {
                    c.classList.remove("bodypopup_table_th_light")
                    c.classList.add("bodypopup_table_th_dark")
                }
            }
        }

        setCookie(themeCookieName, themeDark)
    } else {
        THEME = "light"
        body.classList.remove(themeDark)
        body.classList.add(themeLight)
        processor.rect.attr("fill", "white")
        svg.attr("fill", "black")
        for (a of document.getElementsByClassName("container")) {
            a.classList.remove("container_dark");
            a.classList.add("container_light")
        }
        for (a of document.getElementsByClassName("small_container")) {
            a.classList.remove("small_container_dark");
            a.classList.add("small_container_light")
        }
        for (a of document.getElementsByClassName("button_")) {
            a.getElementsByTagName("input")[0].classList.remove("button_input_dark")
            a.getElementsByTagName("input")[0].classList.add("button_input_light")
        }
        for (a of document.getElementsByClassName("number_controller")) {
            a.classList.remove("number_controller_dark");
            a.classList.add("number_controller_light")
        }
        for (a of document.getElementsByClassName("info_div")) {
            a.classList.remove("info_div_dark");
            a.classList.add("info_div_light")
        }
        for (a of document.getElementsByTagName("bodypopup")) {
            for (b of a.getElementsByTagName("table")) {
                for (c of a.getElementsByTagName("th")) {
                    c.classList.remove("bodypopup_table_th_dark")
                    c.classList.add("bodypopup_table_th_light")
                }
            }
        }
        setCookie(themeCookieName, themeLight)
    }

    if (end_of_simulation) {
        if (data_FCFS.length) {
            draw_gantt_(data_FCFS, "FCFS_");
        } else if (data_SJF.length) {
            draw_gantt_(data_SJF, "FCFS_");
        } else if (data_SRJF.length) {
            draw_gantt_(data_SRJF, "FCFS_");
        } else if (data_PS.length) {
            draw_gantt_(data_PS, "FCFS_");
        } else if (data_PD.length) {
            draw_gantt_(data_PD, "FCFS_");
        } else if (data_RR.length) {
            draw_gantt_(data_RR, "FCFS_");
        } else if (data_MULTI_NV.length) {
            draw_gantt_(data_MULTI_NV, "FCFS_");
        } else if (data_MULTI_NV_PRIO.length) {
            draw_gantt_(data_MULTI_NV_PRIO, "FCFS_");
        }
    }

}

function collapseSidebar() {
    body.classList.toggle('sidebar-expand')
}

window.onclick = function (event) {
    openCloseDropdown(event)
}

function closeAllDropdown() {
    var dropdowns = document.getElementsByClassName('dropdown-expand')
    for (var i = 0; i < dropdowns.length; i++) {
        dropdowns[i].classList.remove('dropdown-expand')
    }
}

function openCloseDropdown(event) {
    if (!event.target.matches('.dropdown-toggle')) {
        //
        // Close dropdown when click out of dropdown menu
        //
        closeAllDropdown()
    } else {
        var toggle = event.target.dataset.toggle
        var content = document.getElementById(toggle)
        if (content.classList.contains('dropdown-expand')) {
            closeAllDropdown()
        } else {
            closeAllDropdown()
            content.classList.add('dropdown-expand')
        }
    }
}

/* Get the documentElement (<html>) to display the page in fullscreen */
var elem = document.documentElement;

/* View in fullscreen */
function openFullscreen() {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
    }
}

/* Close fullscreen */
function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
    }
}


function switchScreen() {
    if ((window.fullScreen) ||
        (window.innerWidth == screen.width && window.innerHeight == screen.height)) {
        closeFullscreen();

    } else {
        openFullscreen();
    }
}


////////////////////////////////////////////////////////////////////////////////
// Critere :


/************COMPARAISON ALGORITHMS**************/

//C'est le temps passé par le processus dans le système.
function turn_around_time(process_history) {
    return process_history[process_history.length - 1][0]
}

//C’est le temps passé dans la file des processus prêts
function waiting_time(process_history) {
    let sum = 0;
    for (const process_event of process_history) {
        if (process_event[2].localeCompare("Pret") == 0) {
            sum += process_event[1] - process_event[0];
        }
    }
    return sum;
}

function expected_time(process_history) {
    let sum = 0;
    for (const process_event of process_history) {
        if (process_event[2].localeCompare("In process") == 0) {
            sum += process_event[1] - process_event[0];
        }
    }
    return sum;
}

function blocked_time(process_history) {
    let sum = 0;
    for (const process_event of process_history) {
        if (process_event[2].localeCompare("Blocked") == 0) {
            sum += process_event[1] - process_event[0];
        }
    }
    return sum;
}

//to get simulation finish time
function get_finish_time(process_info_list) {
    max = 0;
    for (const process_history of process_info_list) {
        if (process_history.slice(-1)[0][0] > max) max = process_history.slice(-1)[0][0];
    }
    return max;
}

//this functions returns a list of the number of processes finished per TIME UNIT
// nous donne une liste chronologique suivant l'unité de temps du nombres de processus terminé par UT(ici on prends 8 ) .
function throughput(process_info_list) {
    let time = 0;
    let cpt = 0;
    let throughput_list = [];
    let condition = false;
    let finish_time = get_finish_time(process_info_list);
    while (!condition) {
        cpt = 0;
        for (const process_history of process_info_list) {
            if (((time) < process_history.slice(-1)[0][0]) && (time + 8 * TIME_UNIT) >= process_history.slice(-1)[0][0]) {
                cpt++;
            }
            if (time >= finish_time) condition = true;
        }
        time += 8 * TIME_UNIT;
        throughput_list.push(cpt);
    }

    return throughput_list;
}


// It is the average number of processes residing in the ready queue waiting for their turn to get into the CPU.
// temps moyens des
function load_average(process_info_list) {
    let time = 0;
    let cpt = 0;
    let ready_list = [];
    let condition = false;
    let finish_time = get_finish_time(process_info_list);
    while (!condition) {
        cpt = 0;
        for (const process_history of process_info_list) {
            for (const process_event of process_history) {
                if (process_event[2].localeCompare("Pret") == 0) {
                    if (process_event[0] <= time && process_event[1] > time) cpt++;
                }
            }
            if (time >= finish_time) condition = true;
        }
        time += TIME_UNIT;
        ready_list.push(cpt);
    }

    return ((ready_list.reduce((a, b) => a + b, 0)) / ready_list.length).toFixed(2);
}


function get_unused_time(list) {
    var max = 0;
    for (var p = 0; p < list.length; p++) {
        if (max < list[p][list[p].length - 1][0]) {
            max = list[p][list[p].length - 1][0]
        }
    }

    var cpt = 0;
    for (var i = 0; i < max; i++) {
        var b = 1;
        for (var p = 0; p < list.length; p++) {
            for (var state = 0; state < list[p].length; state++) {
                if ((list[p][state][0] <= i) && (i <= list[p][state][1])) {
                    if (list[p][state][2] != "Blocked") {
                        b = 0
                    }
                    break;
                }
            }
            if (b == 0) {
                break
            }
        }
        cpt = cpt + b;
    }
    return cpt;
}

function cpu_unused_time(process_info_list) {
    let unused_time = get_unused_time(process_info_list);
    let cpt = 0;
    let sum_of_respond_time = 0;
    for (const process_history of process_info_list) {
        for (const process_event of process_history) {
            if (process_event[2].localeCompare("In process") == 0) {
                sum_of_respond_time += respond_time(process_history);
            }
        }
    }
    return unused_time + sum_of_respond_time;
}


function respond_time(process_history) {
    let random_request = ((Math.random() * (0.05 - 0.01) + 0.01).toFixed(4)) * (process_history.length);
    if (random_request > 1) return 1;
    else return random_request;
}


function mean_turn_around_time(process_info_list) {
    let sum = 0;
    for (const process_history of process_info_list) {
        sum += turn_around_time(process_history);
    }
    return (sum / process_info_list.length).toFixed(2);
}

function mean_waiting_time(process_info_list) {
    let sum = 0;
    for (const process_history of process_info_list) {
        sum += waiting_time(process_history);
    }
    return (sum / process_info_list.length).toFixed(2);
}

function mean_respond_time(process_info_list) {
    let sum = 0;
    for (const process_history of process_info_list) {
        sum += respond_time(process_history);
    }
    return (sum / process_info_list.length).toFixed(2);
}


function plot_time_table(history, id) {
    let tbody = document.createElement("tbody");
    let index = 0;
    for (const process_history of history) {

        let row = document.createElement("tr");
        let element_row1 = document.createElement("td");
        let text1 = document.createTextNode("P" + (index + 1));
        index++;
        element_row1.appendChild(text1);
        row.appendChild(element_row1);

        let element_row2 = document.createElement("td");
        let text2 = document.createTextNode((expected_time(process_history)).toString());
        element_row2.appendChild(text2);
        row.appendChild(element_row2);

        let element_row3 = document.createElement("td");
        let text3 = document.createTextNode((turn_around_time(process_history).toString()));
        element_row3.appendChild(text3);
        row.appendChild(element_row3);

        let element_row4 = document.createElement("td");
        let text4 = document.createTextNode((blocked_time(process_history).toString()));
        element_row4.appendChild(text4);
        row.appendChild(element_row4);

        let element_row5 = document.createElement("td");
        let text5 = document.createTextNode((turn_around_time(process_history)).toString() + " - " + (expected_time(process_history)).toString() + " - " + (blocked_time(process_history)).toString() + " = " + (waiting_time(process_history)).toString());
        element_row5.appendChild(text5);
        row.appendChild(element_row5);

        tbody.appendChild(row);
    }

    let row = document.createElement("tr");
    let element_row1 = document.createElement("td");
    let text1 = document.createTextNode("Moyenne");
    element_row1.appendChild(text1);
    row.appendChild(element_row1);

    let element_row2 = document.createElement("td");

    let text2 = document.createTextNode("");
    element_row2.appendChild(text2);
    row.appendChild(element_row2);

    let element_row3 = document.createElement("td");
    let text3 = document.createTextNode((mean_turn_around_time(history).toString()));
    element_row3.appendChild(text3);
    row.appendChild(element_row3);

    let element_row4 = document.createElement("td");
    let text4 = document.createTextNode("");
    element_row4.appendChild(text4);
    row.appendChild(element_row4);

    let element_row5 = document.createElement("td");
    let text5 = document.createTextNode((mean_waiting_time(history)).toString());
    element_row5.appendChild(text5);
    row.appendChild(element_row5);

    tbody.appendChild(row);

    let tab = document.getElementById(id);
    tab.appendChild(tbody);
}


//plot_time_table(process_info_list, "tab");


function modify_interuptions(id) {
    if (id.includes("number")) {
        nb = parseInt(document.getElementById(id).value);
        id_ = parseInt(id.slice(18));
    } else {
        nb = parseInt(document.getElementById("number_" + id).value);
        id_ = parseInt(id.slice(11))
    }
    int_table = document.getElementById("interuption_table_" + id_);

    if (THEME == "dark") {
        button_theme = "button_input_dark"
        th_theme = "bodypopup_table_th_dark"
    } else {
        button_theme = "button_input_light"
        th_theme = "bodypopup_table_th_light"
    }
    int_table_innerHtml = `<div class="input_box">
                <span>Priorite</span>
                <div class="button_">
                  <div class="number_controller plus" id="prio${id_}" onclick="add_nb(id)"> <span>+</span></div>
                  <input id="number_prio${id_}" type="text" name="" value="0" maxlength="2" class="${button_theme}">
                  <div class="number_controller minus" id="prio${id_}" onclick="sub_nb(id)"><span id="minus_caracter">_</span></div>
                </div>
              </div>
              <table id="table">
              <tr>
                <th style="width:100px" class="${th_theme}">Interuption</th>
                <th class="${th_theme}">debut</th>
                <th class="${th_theme}">Duree</th>
                <th style="width:150px" class="${th_theme}">Type</th>
              </tr>`
    for (var i = 0; i < nb; i++) {
        int_table_innerHtml = int_table_innerHtml + `<tr>
                            <td>Int ${i}</td>
                            <td>
                              <div class="button_">
                                <div class="number_controller plus" id="start_time_${id_}_${i}" onclick="add_nb(id)"> <span>+</span></div>
                                <input id="number_start_time_${id_}_${i}" type="text" name="" value="0" maxlength="2" class="${button_theme}">
                                <div class="number_controller minus" id="start_time_${id_}_${i}" onclick="sub_nb(id)"><span id="minus_caracter">_</span></div>
                              </div>
                            </td>
                            <td>
                              <div class="button_">
                                <div class="number_controller plus" id="duration_${id_}_${i}" onclick="add_nb(id)"> <span>+</span></div>
                                <input id="number_duration_${id_}_${i}" type="text" name="" value="0" maxlength="2" class="${button_theme}">
                                <div class="number_controller minus" id="duration_${id_}_${i}" onclick="sub_nb(id)"><span id="minus_caracter">_</span></div>
                              </div>
                            </td>
                            <td>
                              <select class="select" id="int_type_${id_}_${i}">
                                <option value="input"> I/O </option>
                                <option value="memory"> Memoire </option>
                              </select>
                            </td>

                          </tr>`
    }

    int_table.innerHTML = int_table_innerHtml;

    if (THEME == "dark") {
        for (a of document.getElementsByClassName("number_controller")) {
            a.classList.remove("number_controller_light");
            a.classList.add("number_controller_dark")
        }
    } else {
        for (a of document.getElementsByClassName("number_controller")) {
            a.classList.remove("number_controller_dark");
            a.classList.add("number_controller_light")
        }
    }

}


max_index = 1

function generate_processes_table(mode = "-1") {
    var rows = document.getElementById("table").rows;
    if (mode == "add") {
        // save the old values
        var nb = parseInt(document.getElementById("number_8").value);
        var table = document.getElementById("table").children[0];

        new_row = document.createElement("TR")
        new_row.innerHTML = `<td>Proc ${processes_index}</td>
                <td>
                  <div class="button_">
                    <div class="number_controller plus" id="entrance${processes_index}" onclick="add_nb(id)"> <span>+</span></div>
                    <input id="number_entrance${processes_index}" type="text" name="" value="0" maxlength="2">
                    <div class="number_controller minus" id="entrance${processes_index}" onclick="sub_nb(id)"><span id="minus_caracter">_</span></div>
                  </div>
                </td>
                <td>
                  <div class="button_">
                    <div class="number_controller plus" id="execution${processes_index}" onclick="add_nb(id)"> <span>+</span></div>
                    <input id="number_execution${processes_index}" type="text" name="" value="1" maxlength="2">
                    <div class="number_controller minus" id="execution${processes_index}" onclick="sub_nb(id)"><span id="minus_caracter">_</span></div>
                  </div>
                </td>
                <td>
                  <div class="button_">
                    <div class="number_controller plus" id="interuption${processes_index}"  onclick="add_nb(id); modify_interuptions(id)"> <span>+</span></div>
                    <input id="number_interuption${processes_index}" onclick="modify_interuptions(id)" type="text" name="" value="0" maxlength="2">
                    <div class="number_controller minus" id="interuption${processes_index}" onclick="sub_nb(id); modify_interuptions(id)"><span id="minus_caracter">_</span></div>
                  </div>
                </td>
                <td>
                  <button class="button_suprimer" id="suprimer${processes_index}" onclick="delete_row(id)">Suprimer</button>
                </td>
                <td>
                  <button class="button_modifier" id="modifier${processes_index}"  onclick="modify_row(id)">Modifier</button>
                </td>
                <td>
                  <div class="deplacer_buttons">
                    <button type="button" name="button" class="UpDownButton UpButton"   id="upNdown${processes_index}" onclick="upNdown('up', id)">&ShortUpArrow;</button>
                    <button type="button" name="button" class="UpDownButton DownButton" id="upNdown${processes_index}" onclick="upNdown('down', id)">&ShortDownArrow;</button>
                  </div>
                </td>`
        table.appendChild(new_row)

        new_div = document.createElement("DIV")
        new_div.className = "small_container"
        new_div.id = "interuption_table_" + processes_index;
        new_div.style.display = "none";
        new_div.innerHTML = `
                <div class="input_box">
                  <span>Priorite</span>
                  <div class="button_">
                    <div
                     class="number_controller plus" id="prio${processes_index}" onclick="add_nb(id)"> <span>+</span></div>
                    <input id="number_prio${processes_index}" type="text" name="" value="0" maxlength="2">
                    <div class="number_controller minus" id="prio${processes_index}" onclick="sub_nb(id)"><span id="minus_caracter">_</span></div>
                  </div>
                </div>
                <table id="table">
                  <tr>
                    <th style="width:100px">Interuption</th>
                    <th>debut</th>
                    <th>Duree</th>
                    <th style="width:200px">Type</th>
                  </tr>
                </table>`
        document.getElementById("stock").appendChild(new_div);

        processes_index++;

    } else {
        var nb_processes = parseInt(document.getElementById("number_8").value);
        if (nb_processes != 0) {
            var table = document.getElementById("table").children[0];
            var stock = document.getElementById("stock");

            table_innerHtml = `<tr>
              <th>Processus</th>
              <th style="width:130px">Temps d'entrée</th>
              <th>Temps éstimé d'éxécution</th>
              <th>Nombre d'interuptions</th>
              <th>Suprimer</th>
              <th>Modifier</th>
              <th>Deplacer</th></tr>`;
            stock_innerHtml = `<div class="small_container_blur_background" id="blur_background"  style="display:none" onclick="close_popup()"></div>`;


            for (var i = max_index; i < max_index + nb_processes; i++) {
                table_innerHtml = table_innerHtml + `<tr>
                <td>Proc ${i}</td>
                <td>
                  <div class="button_">
                    <div class="number_controller plus" id="entrance${i}" onclick="add_nb(id)"> <span>+</span></div>
                    <input id="number_entrance${i}" type="text" name="" value="0" maxlength="2">
                    <div class="number_controller minus" id="entrance${i}" onclick="sub_nb(id)"><span id="minus_caracter">_</span></div>
                  </div>
                </td>
                <td>
                  <div class="button_">
                    <div class="number_controller plus" id="execution${i}" onclick="add_nb(id)"> <span>+</span></div>
                    <input id="number_execution${i}" type="text" name="" value="0" maxlength="2">
                    <div class="number_controller minus" id="execution${i}" onclick="sub_nb(id)"><span id="minus_caracter">_</span></div>
                  </div>
                </td>
                <td>
                  <div class="button_">
                    <div class="number_controller plus" id="interuption${i}" onclick="add_nb(id); modify_interuptions(id)"> <span>+</span></div>
                    <input id="number_interuption${i}" onclick="modify_interuptions(id)" type="text" name="" value="0" maxlength="2">
                    <div class="number_controller minus" id="interuption${i}" onclick="sub_nb(id); modify_interuptions(id)"><span id="minus_caracter">_</span></div>
                  </div>
                </td>
                <td>
                  <button class="button_suprimer" id="suprimer${i}" onclick="delete_row(id)">Suprimer</button>
                </td>
                <td>
                  <button class="button_modifier" id="modifier${i}" onclick="modify_row(id)">Modifier</button>
                </td>
                <td>
                  <div class="deplacer_buttons">
                    <button type="button" name="button" class="UpDownButton UpButton"   id="upNdown${i}" onclick="upNdown('up', id)">&ShortUpArrow;</button>
                    <button type="button" name="button" class="UpDownButton DownButton" id="upNdown${i}" onclick="upNdown('down', id)">&ShortDownArrow;</button>
                  </div>
                </td></tr>`
                stock_innerHtml = stock_innerHtml + `<div class="small_container" id="interuption_table_${i}" style="display:none">
                                  <div class="input_box">
                                    <span>Priorite</span>
                                    <div class="button_">
                                      <div class="number_controller plus" id="prio${i}" onclick="add_nb(id)"> <span>+</span></div>
                                      <input id="number_prio${i}" type="text" name="" value="0" maxlength="2">
                                      <div class="number_controller minus" id="prio${i}" onclick="sub_nb(id)"><span id="minus_caracter">_</span></div>
                                    </div>
                                  </div>
                                  <table id="table">
                                    <tr>
                                      <th style="width:100px">Interuption</th>
                                      <th>debut</th>
                                      <th>Duree</th>
                                      <th style="width:150px">Type</th>
                                    </tr>
                                  </table></div>`
            }

            table.innerHTML = table_innerHtml
            stock.innerHTML = stock_innerHtml

            processes_index = max_index + nb_processes
        }
    }

    if (THEME == "dark") {
        for (a of document.getElementsByClassName("button_")) {
            a.getElementsByTagName("input")[0].classList.remove("button_input_light")
            a.getElementsByTagName("input")[0].classList.add("button_input_dark")
        }
        for (a of document.getElementsByClassName("small_container")) {
            a.classList.remove("small_container_light");
            a.classList.add("small_container_dark")
        }
        for (a of document.getElementsByClassName("number_controller")) {
            a.classList.remove("number_controller_light");
            a.classList.add("number_controller_dark")
        }
        for (a of document.getElementsByTagName("bodypopup")) {
            for (b of a.getElementsByTagName("table")) {
                for (c of a.getElementsByTagName("th")) {
                    c.classList.remove("bodypopup_table_th_light")
                    c.classList.add("bodypopup_table_th_dark")
                }
            }
        }

    } else {
        for (a of document.getElementsByClassName("button_")) {
            a.getElementsByTagName("input")[0].classList.remove("button_input_dark")
            a.getElementsByTagName("input")[0].classList.add("button_input_light")
        }
        for (a of document.getElementsByClassName("small_container")) {
            a.classList.remove("small_container_dark");
            a.classList.add("small_container_light")
        }
        for (a of document.getElementsByClassName("number_controller")) {
            a.classList.remove("number_controller_dark");
            a.classList.add("number_controller_light")
        }
        for (a of document.getElementsByTagName("bodypopup")) {
            for (b of a.getElementsByTagName("table")) {
                for (c of a.getElementsByTagName("th")) {
                    c.classList.remove("bodypopup_table_th_dark")
                    c.classList.add("bodypopup_table_th_light")
                }
            }
        }
    }

}
