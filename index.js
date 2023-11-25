console.log("Hello World!");

// document.getElementsByClassName("row2 col1")[0].innerHTML = "Hi 1x1";

function initializeBoard(destination, num_rows, num_cols, num_bombs) {
    let h3 = document.getElementsByTagName("H3")[0]
    h3.innerHTML = "("+num_rows+"x"+num_cols+" with "+num_bombs+" bombs)";

    let game  = document.getElementById(destination);
    game.innerHTML = "";

    let table = document.createElement("table");
    // <table>
    for (let row = 1; row <= num_rows; row++) {
        let tr = document.createElement("tr")
        tr.id = "tr"+row;

    //     <tr id="tr1">
    for (let col = 1; col <= num_cols; col++){
        let td = document.createElement("td");
        td.classList = "row"+row+" col"+col;
    //         <td class="row1 col1"></td>
    //         <td class="row1 col2"></td>
    //         <td class="row1 col3"></td>
        tr.appendChild(td);
        }
    //     </tr>

        table.appendChild(tr);
    }
    // </table>
    game.appendChild(table);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function createRandomCell(num_rows, num_cols) {
    let randomRow = getRandomInt(num_rows) + 1;
    let randomCol = getRandomInt(num_cols) + 1;
    let randomCell = randomRow + "x" + randomCol;
    return randomCell;
}

function createRandomBombs(bombs_locations, num_rows, num_cols, num_bombs){
    while (true) {
        if (bombs_locations.length == num_bombs) {
            break;
        } else {
            let randomCell = createRandomCell(num_rows, num_cols);
            if (bombs_locations.includes(randomCell)) {
                continue;
            } else {
                bombs_locations.push(randomCell);
            }
        }
    }
}

function addClickEvents(element, num_rows, num_cols, num_bombs) {
    element.onclick = function(ev) { checkForBombs(ev, this, num_rows, num_cols, num_bombs); };

    let markCell = function(ev, el) {
        ev.preventDefault();
        // console.log("this", this);
        // console.log("ev", ev);
        // alert('right click!');
        markBomb(el);
        return false;
    };

    let markCellTo = function(ev, el) {
        console.warn("TOUCH: MARK");
        document.getElementById("mod").innerHTML = "TOUCH: MARK";
        markCell(ev, el);
    };

    let markCellCM = function(ev, el) {
        console.warn("CONTEXT: MARK");
        document.getElementById("mod").innerHTML = "CONTEXT: MARK";
        markCell(ev, el);
    };
    
    // https://codepen.io/eleviven/pen/eYmwzLp
    let timer = false;
    let duration = 800;

    function touchStart(ev, el){
        console.warn("touchStart", ev, el);
        if (!timer) {
            timer = setTimeout(function(){ markCellTo(ev, el); timer=false; }, duration);
        }
    }

    function touchEnd(ev){
        console.warn("touchEnd");
        if (timer) {
            clearTimeout(timer)
            timer = false;
        }
    }

    element.addEventListener("contextmenu", function(ev) { markCellCM(ev, element); }, false);
    // element.addEventListener("touchstart", function(ev) { touchStart(ev, element); }, false);
    // element.addEventListener("touchend", touchEnd, false);
}

function pupulateGame(destinationId, num_rows, num_cols, num_bombs) {
    var bombs_locations = [];
    // var bombs_locations = ['1x3', '1x2']
    
    initializeBoard(destinationId, num_rows, num_cols, num_bombs);

    createRandomBombs(bombs_locations, num_rows, num_cols, num_bombs);
    // bombs_locations = ['3x1', '4x1', '3x2', '1x1'];

    console.log("bombs_locations", bombs_locations);

    for (let row = 1; row < num_rows+1; row++) {
        console.log("row", row);

        for (let col = 1; col < num_cols+1; col++) {
            let cell_id = row+"x"+col;
            let element = document.getElementsByClassName("row"+row+" col"+col)[0];
            element.classList.toggle("notClicked");
            element.setAttribute("row", row);
            element.setAttribute("col", col);

            addClickEvents(element, num_rows, num_cols, num_bombs);

            if (bombs_locations.includes(cell_id)) {
                console.log("BOMB");
                element.classList.toggle("isBomb");
                element.classList.remove("isNeighbourToBomb");
                element.removeAttribute("numberNeighbourBombs");
                // element.innerHTML = "BOMB";

                for (let row_round = row - 1; row_round <= row + 1; row_round++) {
                    if (row_round < 1) {
                        continue;
                    }
                    if (row_round > num_rows) {
                        continue;
                    }

                    // console.log("row_round", row_round);

                    for (let col_round = col - 1; col_round <= col + 1; col_round++) {
                        if (col_round < 1) {
                            continue;
                        }
                        if (col_round > num_cols) {
                            continue;
                        }
                        if ((row_round == row) && (col_round == col)) {
                            continue;
                        }

                        // console.log("col_round", col_round);
                        let neighbour_el = document.getElementsByClassName("row"+row_round+" col"+col_round)[0];
                        // neighbour_el.innerHTML = "neighbour from bomb";

                        if (!neighbour_el.classList.contains("isBomb")) {
                            neighbour_el.classList.add("isNeighbourToBomb");
                            let number_neighbour_bombs = parseInt(neighbour_el.getAttribute("numberNeighbourBombs") || 0);
                            number_neighbour_bombs += 1;
                            neighbour_el.setAttribute("numberNeighbourBombs", number_neighbour_bombs);

                            // neighbour_el.innerHTML = number_neighbour_bombs;
                        }
                    }
                }
            }

            // console.log("row", row, "col", col);
            // element.innerHTML = "Hi "+row+"x"+col;
        }
    }
}

function checkForBombs(ev, element, num_rows, num_cols, num_bombs) {
    console.warn("CLICK. checkForBombs");

    let row     = parseInt(element.getAttribute("row"));
    let col     = parseInt(element.getAttribute("col"));
 
    if (element.classList.contains("isMarked") || element.classList.contains("isQuestion")) {
        return;
    }

    // console.log("CLICKED! Checking for bombs at ", element);
    element.classList.remove("notClicked");
    
    if (element.classList.contains("isBomb")) {
        console.log("BOMB!!!!!!!!!!!!!!!!!");
        clearAll(num_rows, num_cols);
        alert("you lost!");
    } else {
        console.log("not a bomb. phew!!");
        for (let row_round = row - 1; row_round <= row + 1; row_round++) {
            if (row_round < 1) {
                continue;
            }
            if (row_round > num_rows) {
                continue;
            }
            for (let col_round = col - 1; col_round <= col + 1; col_round++) {
                if (col_round < 1) {
                    continue;
                }
                if (col_round > num_cols) {
                    continue;
                }
                if ((row_round == row) && (col_round == col)) {
                    continue;
                }

                let neighbour_el = document.getElementsByClassName("row"+row_round+" col"+col_round)[0];

                if (neighbour_el.classList.contains("isMarked") || neighbour_el.classList.contains("isQuestion")) {
                    continue;
                }
            
                if (neighbour_el.hasAttribute("numberNeighbourBombs") || (!neighbour_el.classList.contains("isBomb"))) {
                    neighbour_el.classList.remove("notClicked");

                    if (!neighbour_el.hasAttribute("numberNeighbourBombs")) {
                        // console.log("IS WHITE", neighbour_el);
                        spreadWhites(row_round, col_round, num_rows, num_cols);
                    }
                }
            }
        }
    }

    checkForWin(num_rows, num_cols, num_bombs);
}

function spreadWhites(row, col, num_rows, num_cols) {
    for (let row_round = row - 1; row_round <= row + 1; row_round++) {
        if (row_round < 1) {
            continue;
        }
        if (row_round > num_rows) {
            continue;
        }
        for (let col_round = col - 1; col_round <= col + 1; col_round++) {
            if (col_round < 1) {
                continue;
            }
            if (col_round > num_cols) {
                continue;
            }
            if ((row_round == row) && (col_round == col)) {
                continue;
            }

            let neighbour_el = document.getElementsByClassName("row"+row_round+" col"+col_round)[0];
            if (!neighbour_el.classList.contains("notClicked")) {
                continue;
            }

            if ((!neighbour_el.classList.contains("isNeighbourToBomb")) && (!neighbour_el.classList.contains("isBomb")) && (neighbour_el.classList.contains("notClicked"))) {
                // console.log("IS NEIGHBOUR WHITE", neighbour_el);
                neighbour_el.classList.remove("notClicked");
                spreadWhites(row_round, col_round, num_rows, num_cols);
            }
        }
    }
}

function checkForWin(num_rows, num_cols, num_bombs) {
    let notClicked = document.getElementsByClassName("notClicked");
    if (notClicked.length == num_bombs) {
        clearAll(num_rows, num_cols);
        alert("YOU WON");
        console.warn("YOU WON");
    }
}

function clearAll(num_rows, num_cols) {
    for (let row_round = 1; row_round <= num_rows; row_round++) {
        for (let col_round = 1; col_round <= num_cols; col_round++) {
            let neighbour_el = document.getElementsByClassName("row"+row_round+" col"+col_round)[0];
            neighbour_el.classList.remove("notClicked");
            neighbour_el.classList.remove("isMarked");
        }
    }
}

function markBomb(element) {
    if (!element.classList.contains("notClicked")) {
        return;
    }
    if (element.classList.contains("isMarked")) {
        element.classList.toggle("isMarked"); //take mark out
        element.classList.toggle("isQuestion"); //set question
    } else
    if (element.classList.contains("isQuestion")) {
        element.classList.toggle("isQuestion"); //take question out
    } else {
        element.classList.toggle("isMarked"); //add mark
    }
}

function processForm() {
    let num_rows = parseInt(document.getElementById("num_rows").value);
    let num_cols = parseInt(document.getElementById("num_cols").value);
    let num_bombs = parseInt(document.getElementById("num_bombs").value);
    pupulateGame("game", num_rows, num_cols, num_bombs);
}

processForm();
