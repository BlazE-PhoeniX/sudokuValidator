var cells, squareSize=3;

//create a responsive table width responsive fontsize
var table = document.querySelector(".table tbody");
function createTable(size) {
    table.innerHTML="";
    for(i=1; i<=size; i++) {
        var temp=table.innerHTML;
        table.innerHTML=temp+"\n<tr class='row row--"+i+"'>";
        for(j=1; j<=size; j++) {
            var row=document.querySelector(".row--"+i);
            temp = row.innerHTML;
            row.innerHTML = temp + "\n<td class='cell cell--" + i + j + "'><input class='input input--"+i+j+"' type='number' min='1' max='" + size + "'></td>";
        }
        temp = table.innerHTML;
        table.innerHTML = temp + "\n</tr>";
        
    }
    squareSize=size*1;
    
    document.querySelector('.sizeSet').value=size;
    
    cells = document.querySelectorAll(".cell");
    
    cells.forEach( function(cell) {
        cell.height= cell.clientWidth;
        cell.querySelector('.input').style.fontSize = cell.clientWidth*0.7+"px";
        cell.querySelector(".input").addEventListener("input", function () {
            if (this.value < 1 && this.value != "") {
                this.value = "";
                alert("Minimum value is 1");
            } else if (this.value > squareSize) {
                this.value = "";
                alert("Maximum value is " + squareSize);
            }
        });
    })
    document.querySelector(".getSize-bg").style.transform = "skewX(90deg)";
    
}

//make the table adapt on resizing
window.onresize = function() {
    cells.forEach(function (cell) {
        cell.height = cell.clientWidth;
        cell.querySelector(".input").style.fontSize = cell.clientWidth * 0.7 + "px";
    });
}




//pop up functionality
function showPopUp(popup) {
    document.querySelector("."+popup).style.transform = "translateX(-50%) translateY(-50%) scale(1)";
    document.querySelector(".pop-up-bg").style.transform = "scale(1)";
}

function closePopUp(popup) {
    document.querySelector("."+popup).style.transform = "translateX(-50%) translateY(-50%) scale(0)";
    document.querySelector(".pop-up-bg").style.transform = "scale(0)";
}




//sudoku validation
var sudoku = new Array();
//check a particular row
function checkRow(row, sudoku) {
    for(var i=0; i<squareSize; i++) {
        for(var j=0; j<squareSize; j++) {
            if(i==j)
            continue;
            else if(sudoku[row][j] == sudoku[row][i])
            return false;
        }
    }
    return true;
}

//check a particular column
function checkColumn(col, sudoku) {
    for(var i=0; i<squareSize; i++) {
        for(var j=0; j<squareSize; j++) {
            if(i==j)
                continue;
            else if(sudoku[j][col] == sudoku[i][col])
                return false;
        }
    }
    return true;
}

//check all tha cage squares
function checkSquares(sudoku) {
    var row_start=0, col_start=0;
    var row_increment=squareSize==9?2:1;
    for(square= 1; square<=squareSize; square++) {
        for(var i=row_start; i<=row_start+row_increment; i++) {
            for(var j=col_start; j<=col_start+2; j++) {
                for(var x=row_start; i<=row_start+row_increment; i++) {
                    for(var y=col_start; j<=col_start+2; j++) {
                        if(i==x && j==y)
                        continue;
                        else if(sudoku[i][j]==sudoku[x][y])
                            return false;
                        }
                    }
            }
        }
        if(col_start==squareSize-3){
            row_start+=(row_increment+1);
            col_start=0;
        } else {
            col_start+=3;
        }
    }
    return true;
}

//combining the above functions
function validateSudoku() {
    var sudoku=new Array();
    for(var i=0; i<squareSize; i++) {
        temp=new Array();
        for(var j=0; j<squareSize; j++) {
            var input=document.querySelector('.input--'+(i+1)+(j+1));
            input.style.background="#fff";
            if(input.value != "") {
                temp[j]=input.value;
            }
            else {
                document.querySelector(".validate-fail .error").textContent="Please Fill In All The Squares";
                showPopUp('validate-fail');
                return;
            }
        }
        sudoku.push(temp);
    }
    
    for(var i=0; i < squareSize; i++) {
        if(! ( checkRow(i,sudoku) && checkColumn(i,sudoku) ) ) {
            showPopUp('validate-fail');
            checkRow(i,sudoku)? paintError('col', i+1): paintError('row', i+1);
            return;
        }
    }
    if(squareSize > 3) {
        if (! checkSquares(sudoku) ) {
            document.querySelector(".validate-fail .error").textContent="Error in one of the artitions of the square";
            showPopUp('validate-fail');
            return;
        }
    }
    showPopUp('validate-success');
}

//color the error row or column
function paintError(part, no) {
    if(part=="row") {
        document.querySelector(".validate-fail .error").textContent="Error in Row "+no;
        for(var i=1; i<=squareSize; i++) {
            document.querySelector('.input--'+no+i).style.background="#ffdbc5";
        }
    }
    else if(part=="col") {
        document.querySelector(".validate-fail .error").textContent="Error in Column "+no;
        for(var i=1; i<=squareSize; i++) {
            document.querySelector('.input--'+i+no).style.background="#ffdbc5";
        }
    }
}




//voice transcription functionality
var mic=document.querySelector("i.fa");
var micButton=document.querySelector(".voice-button");
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

//check if browser supports
if( SpeechRecognition ) {
    const Recognition = new SpeechRecognition();
    Recognition.continuous=true;

    //toggle the functionality
    function startRec() {
        if( mic.classList.contains('fa-microphone')) {
            mic.classList.remove('fa-microphone');
            mic.classList.add('fa-microphone-slash');
            micButton.style.animation = "micActive .67s linear infinite";  
            Recognition.start();
        } else {
            mic.classList.remove('fa-microphone-slash');
            mic.classList.add('fa-microphone');
            micButton.style.animation = "none";       
            Recognition.stop();
        }
    }
    
    //get the transcript string and place its characters in their respective squares
    Recognition.onresult = function (event) {
        var transcript = event.results[0][0].transcript;
        for (var i = 1; i <= squareSize; i++) {
            for (var j = 1; j <= squareSize; j++) {
                var input = document.querySelector(".input--" + i + j);
                input.value= "";
            }
        }
        var i=1,j=1;
        for(let char of transcript) {
            char*=1;
            if(Number.isInteger(char) && char>0 && char<=squareSize ) {
                if(j <= squareSize) {
                    document.querySelector('.input--'+i+j).value=char;
                    j++;
                } else {
                    j=1;
                    i++;
                    document.querySelector(".input--" + i + j).value = char;
                    j++;
                }
            } else {
                continue;
            }
        }
    }
}
else {
    micButton.disabled="disabled";
}



