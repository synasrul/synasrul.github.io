var calcDisplay = ""

function btnClick(e){
    if (e == "1" || e == "2" || e == "3" || e == "4" || e == "/" || e == "*"){
        if (e == "AC"){
            calcDisplay = ""
        }
        else {
            calcDisplay = calcDisplay + e
        }
    }
    else {
        console.log("Input harus angka atau simbol")
    }
    
    console.log(calcDisplay)
    document.getElementById("display").value = calcDisplay
}

document.getElementById("display").addEventListener('input', function displayChange() {
    console.log(this.value)
    let e = this.value;
    let chars = /^[0-9]+$/

    if (chars.test(e)){
        console.log("DIGIT")
    }
    else {
        console.log("NOT DIGIT")
    }
})
