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

initStep(); // Display the first step
function initStep() {
    updateButtons(currentStep);
    showStep(currentStep.index);
    markDotActive(currentStep.index);
    markDotNext(currentStep.index);
}

function updateNewStep(currentStep) {
    toggleErrorMsg(false);
    updateButtons(currentStep);
    showStep(currentStep.index);
    markDotActive(currentStep.index);
    updateErrorMsg(currentStep.isLastStep());
}
function switchStep(switchDirection) {

    const valid = validateAllRadiosInStep(allStepsHTML[currentStep.index]);

    // if tring to switch next and any field in the current step is invalid:
    if (switchDirection == 1 && !valid){
        toggleErrorMsg(true);
        return false;
    }

    // if you have reached the end of the form... :
    if (currentStep.isLastStep()) {
        markDotCompleted(currentStep.index);
        toggleWaitMsg(true);
        validateAllRadiosInForm();
        redirectToResultPage(calcQuizScore());
        return true;
    }
    toggleWaitMsg(false);

    if ( valid ) {
        markDotCompleted(currentStep.index);
        if( isDotNext(document.getElementsByClassName("dot")[currentStep.index]) ) markDotNext(currentStep.index+1);
    }

    // updateCurrentStep
    // Hide the current step:
    hideStep(currentStep.index);

    // Increase or decrease the current step by 1:
    currentStep.increment(switchDirection);

    // Otherwise, display the correct step:
    updateNewStep(currentStep);
}
function jumpToStep(dot){

    // jump only to validated dot
    if ( !isDotCompleted(dot) && !isDotNext(dot) ) return false;
    
    // updateCurrentStep
    // Hide the current step:
    hideStep(currentStep.index);

    // update the current step:
    currentStep.index = Array.prototype.indexOf.call(dot.parentNode.children, dot);

    // display the selected step:
    updateNewStep(currentStep);
}


function showStep(stepIdx){
    // This function will display the specified step of the form ...
    allStepsHTML[stepIdx].style.display = "block";
}
function hideStep(stepIdx) {
    allStepsHTML[stepIdx].style.display = "none";
}

function updateButtons(currentStep){
    if (currentStep.isFirstStep()) {
        document.getElementById("prevBtn").style.display = "none";
    } else {
        document.getElementById("prevBtn").style.display = "inline";
    }

    if (currentStep.isLastStep()) {
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