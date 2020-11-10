let currentStepIdx = 0; // Current step is set to be the first step (0)
const allStepsHTML = document.getElementsByClassName("step");

updateStep(currentStepIdx); // Display the current step

function updateStep(currentStepIdx) {
    
    showStep(currentStepIdx);

    updateButtons(currentStepIdx);

    updateStepIndicator(currentStepIdx)
}
function showStep(currentStepIdx){
    // This function will display the specified step of the form ...
    allStepsHTML[currentStepIdx].style.display = "block";
}
function updateButtons(currentStepIdx){
    if (currentStepIdx == 0) {
        document.getElementById("prevBtn").style.display = "none";
    } else {
        document.getElementById("prevBtn").style.display = "inline";
    }

    if (currentStepIdx == (allStepsHTML.length - 1)) {
        document.getElementById("nextBtn").innerHTML = "Vai ai risultati";
    } else {
        document.getElementById("nextBtn").innerHTML = "Avanti";
    }
}
function updateStepIndicator(currentStepIdx) {
    // This function removes the "active" class of all steps...
    const dots = document.getElementsByClassName("dot");

    for ( const dot of dots ) {
        let test = dot.className.replace(" active", "");
        dot.className = test;
    }
    //... and adds the "active" class to the current step:
    dots[currentStepIdx].className += " active";
}

function switchStep(switchDirection) {

    // reset error msg
    toggleErrorMsg(true);

    // validate current step fields
    const valid = validateStepFields(currentStepIdx);

    // if tring to switch next and any field in the current step is invalid:
    if (switchDirection == 1 && !valid){
        toggleErrorMsg(false);
        return false;
    }
    
    // mark the curresponding step indicator as finished and valid:
    const currentDot = document.getElementsByClassName("dot")[currentStepIdx];
    if ( valid && !(currentDot.className.search(" finish") >= 0) ) {
        currentDot.className += " finish";
    }

    // Hide the current step:
    allStepsHTML[currentStepIdx].style.display = "none";

    // Increase or decrease the current step by 1:
    currentStepIdx = currentStepIdx + switchDirection;

    // if you have reached the end of the form... :
    if (currentStepIdx >= allStepsHTML.length) {
        //...the form gets submitted:
        //document.getElementById("quizLib").submit();
        redirectToResultPage(calcQuizScore());
        return false;
    }
    // Otherwise, display the correct step:
    updateStep(currentStepIdx);
}
function validateStepFields(currentStepIdx) {

    // get all input of current step
    const inputFieldsHTML = document.getElementsByClassName("step")[currentStepIdx].getElementsByTagName("input");
    let valid = true;
    let isChecked = 0;

    // loop every input field in the current step:
    for ( const input of inputFieldsHTML ) {
        if (input.checked == true) isChecked++;
    }

    // set validation condition
    valid = isChecked == 1;

    // return the valid status
    return valid;
}
function toggleErrorMsg(valid){
    if (valid) document.getElementById("error-msg").style.display = "none";
    else document.getElementById("error-msg").style.display = "block";
}

function calcQuizScore(){
    const inputFieldsHTML = document.getElementById("quizLib").getElementsByTagName("input");
    let quizScore = {
        "libClass"  : 0,
        "libCon"    : 0,
        "vol"       : 0,
        "con"       : 0,
        "libSoc"    : 0
    };

    // increment profile score based on each data attribs from all radios
    for (const currentInput of inputFieldsHTML) {
        if (currentInput.checked) {
            for( const attribute in currentInput.dataset) {
                quizScore[attribute]++
            };
        }
    }

    return quizScore;
}
function redirectToResultPage(quizScore){
    let max = 0;
    let result;
    let queryString = "";

    const profilePageUrl = {
        "libClass"  : "liberale-classico",
        "libCon"    : "liberale-conservatore",
        "vol"       : "volontarista",
        "con"       : "conservatore",
        "libSoc"    : "liberale-sociale"
    };

    // loop score obj
    for (const key in quizScore) {
        // find out max score and corresponding key
        if ( quizScore[key] > max ) {
            max = quizScore[key];
            result = key;      
        }
        // compose queryString from profiles and scores
        queryString = queryString+key+"="+quizScore[key]+"&";
    }

    // finalize redirection relative URL adding result page to queryString
    queryString = "/"+profilePageUrl[result]+"?"+queryString;

    window.location = queryString;
}