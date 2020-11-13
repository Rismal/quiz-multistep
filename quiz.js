const formHTML = document.getElementById("quizLib");
const allStepsHTML = document.getElementsByClassName("step");
const currentStep = {
    startingIndex: 0,
    index: 0,
    direction: 0,
    isFirstStep: function() {
        return this.index == this.startingIndex;
    },
    isLastStep: function() {
        return this.index == (allStepsHTML.length-1);
    },
    increment: function (direction) {
        return this.index = this.index + direction;
    }
}

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

function markDot(stepIdx, className) {
    const dots = document.getElementsByClassName("dot");
    
    // remove the "active" class of all steps...
    for ( const dot of dots ) {
        dot.className = dot.className.replace(" "+className, "");
    }
    //... and add the "active" class to the current step:
    dots[stepIdx].className += " "+className;
}
function markDotActive(stepIdx) {
    markDot(stepIdx, "active");    
}
function markDotNext(stepIdx) {
    markDot(stepIdx, "next");    
}
function markDotCompleted(stepIdx) {
    const dotHTML = document.getElementsByClassName("dot")[stepIdx];

    // mark the step indicator as valid:
    if ( !isDotCompleted(dotHTML) ) {
        dotHTML.className += " completed";
    }
}
//OPT use stepIdx instead of dotHTML
function isDotNext(dotHTML) {
    return (dotHTML.className.search("next") >= 0);   
}
function isDotCompleted(dotHTML) {
    return (dotHTML.className.search("completed") >= 0);   
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
function jumpToStep(dot){
    
    // Hide the current step:
    allStepsHTML[currentStepIdx].style.display = "none";

    // update the current step:
    currentStepIdx = Array.prototype.indexOf.call(dot.parentNode.children, dot);

    // display the selected step:
    updateStep(currentStepIdx);
}

function validateRadio(questionIdx){
    return formHTML.elements["q"+(parseInt(questionIdx)+1)].value != "";
}
function validateAllRadiosInStep(stepHTML){

    for ( const fieldset of stepHTML.getElementsByTagName("fieldset") ) {

        let index = Array.prototype.indexOf.call(formHTML.getElementsByTagName("fieldset"), fieldset);

        if (!validateRadio(index)) return false;
    }

    return true;
}
function validateAllRadiosInForm(){
    
    for ( const index in formHTML.getElementsByTagName("fieldset") ) {
        if ( formHTML.getElementsByTagName("fieldset").hasOwnProperty(index) && !validateRadio(index)) return false;
    }

    return true;
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
    const inputsHTML = formHTML.getElementsByTagName("input");
    let quizScore = {
        "libClass"  : 0,
        "libCon"    : 0,
        "vol"       : 0,
        "con"       : 0,
        "libSoc"    : 0
    };

    // increment profile score based on each data attribs from all radios
    for (const currentInput of inputsHTML) {
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