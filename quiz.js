let currentStepIdx = 0; // Current step is set to be the first step (0)
const formId = "quizLib";
const allStepsHTML = document.getElementsByClassName("step");

updateStep(currentStepIdx); // Display the current step

function updateStep(currentStepIdx) {
    
    showStep(currentStepIdx);

    updateButtons(currentStepIdx);

    updateStepIndicator(currentStepIdx)
}
function showStep(stepIdx){
    // This function will display the specified step of the form ...
    allStepsHTML[stepIdx].style.display = "block";
}
function hideStep(stepIdx) {
    allStepsHTML[stepIdx].style.display = "none";
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
    const dots = document.getElementsByClassName("dot");
    
    // remove the "active" class of all steps...
    for ( const dot of dots ) {
        let test = dot.className.replace(" active", "");
        dot.className = test;
    }
    //... and add the "active" class to the current step:
    dots[currentStepIdx].className += " active";
}
function validateDot(currentStepIdx) {
    const currentDot = document.getElementsByClassName("dot")[currentStepIdx];

    // mark the step indicator as valid:
    if ( !(currentDot.className.search(" finish") >= 0) ) {
        currentDot.className += " finish";
    }
}

function switchStep(switchDirection) {

    const isLastStep = currentStepIdx == allStepsHTML.length-1;
    let fields;
    let valid;

    // reset error msg
    toggleErrorMsg(false);
    updateErrorMsg(isLastStep);

    // get fields to validate
    if (isLastStep) {
        // if you have reached the end of the form... :
        // all steps fields
        fields = document.querySelectorAll(".step input");
    }
    else {
        // only current step fields
        fields = document.querySelectorAll(".step")[currentStepIdx].querySelectorAll("input");
    }

    // validate fields
    valid = validateFields(fields);


    // if tring to switch next and any field in the current step is invalid:
    if (switchDirection == 1 && !valid){
        toggleErrorMsg(true);
        return false;
    }

    // if you have reached the end of the form... :
    if (isLastStep) {
        //...the form gets submitted:
        toggleWaitMsg(true);
        redirectToResultPage(calcQuizScore());
        //document.getElementById("formId").submit();
        return true;
    }
    // reset wait msg
    toggleWaitMsg(false);

    if ( valid ) validateDot(currentStepIdx);


    // Hide the current step:
    hideStep(currentStepIdx);

    // Increase or decrease the current step by 1:
    currentStepIdx = currentStepIdx + switchDirection;

    // Otherwise, display the correct step:
    updateStep(currentStepIdx);
}
function jumpStep(dot){
    // reset error msg
    toggleErrorMsg(false);
    
    // Hide the current step:
    allStepsHTML[currentStepIdx].style.display = "none";

    // update the current step:
    currentStepIdx = Array.prototype.indexOf.call(dot.parentNode.children, dot);

    // display the selected step:
    updateStep(currentStepIdx);
}

function validateFields(inputFieldsHTML) {

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
function toggleMsg(msgId, show){
    if (show) document.getElementById(msgId).style.display = "block";
    else document.getElementById(msgId).style.display = "none";
}
function toggleErrorMsg(show){
    toggleMsg("error-msg", show);
}
function toggleWaitMsg(show){
    toggleMsg("wait-msg", show);
}
function updateErrorMsg(isLastStep){
    const errorMsg = document.querySelector("#error-msg > p");

    if (isLastStep) errorMsg.innerHTML = "COMPLETA TUTTE LE DOMANDE!";
    else errorMsg.innerHTML = "SELEZIONA UNA RISPOSTA!";
    
}

function calcQuizScore(){
    const inputFieldsHTML = document.getElementById(formId).getElementsByTagName("input");
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