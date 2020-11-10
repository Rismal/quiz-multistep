let currentStepIdx = 0; // Current step is set to be the first step (0)
const allStepsHTML = document.getElementsByClassName("step");

updateStep(currentStepIdx); // Display the current step

function updateStep(currentStepIdx) {
    
    showStep(currentStepIdx);

    updateButtons(currentStepIdx);

    updateStepIndicator(currentStepIdx)
}

function switchStep(switchDirection) {
    // This function will figure out which step to display

    // validate current step fields
    const valid = validateStep(currentStepIdx);

    // handle error msg
    if (switchDirection > 0) toggleErrorMsg(valid);
    else toggleErrorMsg(true);    

    // Exit the function if any field in the current step is invalid:
    if (switchDirection == 1 && !valid) return false;

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

function showStep(currentStepIdx){
    // This function will display the specified step of the form ...
    allStepsHTML[currentStepIdx].style.display = "block";
}
function validateStep(currentStepIdx) {

    // get all input of current step
    const inputFieldsHTML = document.getElementsByClassName("step")[currentStepIdx].getElementsByTagName("input");
    let valid = true;
    let isChecked = 0;

    // loops every input field in the current step:
    for ( const input of inputFieldsHTML ) {
        if (input.checked == true) isChecked++;
    }

    // set validation condition
    valid = isChecked == 1;

    // If the valid status is true, mark the step as finished and valid:
    if (valid) {
        document.getElementsByClassName("step")[currentStepIdx].className += " finish";
    }

    // return the valid status
    return valid;
}
function updateButtons(currentStepIdx){
    if (currentStepIdx == 0) {
        document.getElementById("prevBtn").style.display = "none";
    } else {
        document.getElementById("prevBtn").style.display = "inline";
    }

    if (currentStepIdx == (allStepsHTML.length - 1)) {
        document.getElementById("nextBtn").innerHTML = "Submit";
    } else {
        document.getElementById("nextBtn").innerHTML = "Next";
    }
}
function updateStepIndicator(currentStepIdx) {
    // This function removes the "active" class of all steps...
    
    for ( const step of allStepsHTML ) {
        let test = step.className.replace(" active", "");
        console.log(test);
        step.className = test;
    }
    //... and adds the "active" class to the current step:
    allStepsHTML[currentStepIdx].className += " active";
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

    // loops score obj
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