const calc = document.querySelector("#calc");
const result = document.querySelector("#result");
const nums = document.querySelectorAll(".num");
const operators = document.querySelectorAll(".operator");
const clear = document.querySelector("#clear");
const ce = document.querySelector("#ce");
const equals = document.querySelector("#equals");

let array, total;

let sum = (num1, num2) => +num1 + +num2;
let substract = (num1, num2) => +num1 - +num2;
let multiply = (num1, num2) => +num1 * +num2;
let divide = (num1, num2) => +num1 / +num2;

function operate() {
    for(let i = 0; i < array.length; i++) {
        if(array[i] == "/") {
            total = divide(array[i-1], array[i+1]);
            array.splice(i-1, 3, total);
            i = 0;
        } else if(array[i] == "x") {
            total = multiply(array[i-1], array[i+1]);
            array.splice(i-1, 3, total);
            i = 0;
        } 
    }
    for(let i = 0; i < array.length; i++) {   
        if(array[i] == "+") {
            total = sum(array[i-1], array[i+1]);
            array.splice(i-1, 3, total);
            i = 0;
        } else if(array[i] == "-") {
            total = substract(array[i-1], array[i+1]);
            array.splice(i-1, 3, total);
            i = 0;
        }
    }
    return total;
}

function getResult() {
    array = calc.textContent.split(/([-+x\/])/g);
    
    //Puts a "0." if "." is clicked after an operator
    if((["/","x","+","-"].includes(array[array.length-2]) || array.length < 2) 
    && array[array.length-1] == ".") {
        calc.textContent = calc.textContent.slice(0, -1) + "0.";
        array = calc.textContent.split(/([-+x\/])/g);
    }

    //Avoids adding second period to a number
    if(array[array.length-1].includes(".") &&
        array[array.length-1].indexOf(".") !== array[array.length-1].lastIndexOf(".")) {
            calc.textContent = calc.textContent.slice(0, -1);
            array = calc.textContent.split(/([-+x\/])/g);
    }

    if(array.length > 2) {
        operate();
        //Displays max 9 digits and round decimals
        if(total.toString().indexOf(".") !== -1) {
            let newTotal = Math.round(total * Math.pow(10, 5)) / Math.pow(10, 5);
            (newTotal.toString().length > 9) ? 
                result.textContent = newTotal.toExponential(5) : result.textContent = newTotal;
        } else {
            (total.toString().length > 9) ? 
            result.textContent = total.toExponential(5) : result.textContent = total;
        }
    }      
}

nums.forEach((num) => {
    num.onclick = (e) => {
        calc.textContent += num.textContent;
        getResult();
    }
});

operators.forEach((operator) => {
    operator.onclick = () => {
        //Avoids adding two operators successively
        let lastChar = calc.textContent.substr(-1);
        ["/","x","+","-"].includes(lastChar) ?
                calc.textContent = calc.textContent.slice(0, -1) + operator.textContent :
        (calc.textContent == "") ? calc.textContent == "" : calc.textContent += operator.textContent;
        result.textContent = "";
    }
});

clear.onclick = () => {
    calc.textContent = "";
    result.textContent = "";
}

ce.onclick = () => {
    //The result is displayed, if last input character is a number
    calc.textContent = calc.textContent.slice(0, -1);
    let lastChar = calc.textContent.substr(-1);
    ["/","x","+","-"].includes(lastChar) ?
        result.textContent = "" : getResult();
};

equals.addEventListener("click", () => {
    if(result.textContent !== "") {
        calc.textContent = result.textContent;
        result.textContent = "";
    }
});


//Makes it possible to use the keyboard
window.onkeypress = (e) => {
    let str = String.fromCharCode(e.keyCode)
    if(!isNaN(str)) {
        calc.textContent += str;
        getResult();
        //Changes background color when key is pressed
        nums.forEach((num) => { 
            if(str == num.textContent) {
                num.classList.add("keyPressed");
            }
            num.ontransitionend = () => num.classList.remove("keyPressed");
        });
    } else if(["/","*","+","-"].includes(str)) {
        str = str.replace("*", "x");
        let lastChar = calc.textContent.substr(-1);
        ["/","x","+","-"].includes(lastChar) ?
                calc.textContent = calc.textContent.slice(0, -1) + str :
        (calc.textContent == "") ? calc.textContent == "" : calc.textContent += str;
        result.textContent = "";
        operators.forEach((operator) => {
            if(str == operator.textContent) {
                operator.classList.add("keyPressed");
            }
            operator.ontransitionend = () => operator.classList.remove("keyPressed");
        });
    } else if(str == "," || str == ".") {
        str = str.replace(",", ".");
        calc.textContent += str;
        getResult();
        nums.forEach((num) => { 
            if(str == num.textContent) {
                num.classList.add("keyPressed");
            }
            num.ontransitionend = () => num.classList.remove("keyPressed");
        });
    }

    if(e.keyCode == 13) {
        if(result.textContent !== "") {
            calc.textContent = result.textContent;
            result.textContent = "";
        }    
    }
}

window.onkeydown = (e) => {
    if(e.keyCode == 27) {
        calc.textContent = "";
        result.textContent = "";
        clear.classList.add("keyPressed");
        clear.ontransitionend = () => clear.classList.remove("keyPressed");
    } 
    if(e.keyCode == 8) {
        calc.textContent = calc.textContent.slice(0, -1);
        let lastChar = calc.textContent.substr(-1);
        ["/","x","+","-"].includes(lastChar) ?
            result.textContent = "" : getResult(); 
        ce.classList.add("keyPressed");
        ce.ontransitionend = () => ce.classList.remove("keyPressed");       
    } 
}