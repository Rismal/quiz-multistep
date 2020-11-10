var currentTab = 0; // Current tab is set to be the first tab (0)
showTab(currentTab); // Display the current tab

function showTab(n) {
    // This function will display the specified tab of the form ...
    var x = document.getElementsByClassName("tab");
    x[n].style.display = "block";
    // ... and fix the Previous/Next buttons:
    if (n == 0) {
        document.getElementById("prevBtn").style.display = "none";
    } else {
        document.getElementById("prevBtn").style.display = "inline";
    }
    if (n == (x.length - 1)) {
        document.getElementById("nextBtn").innerHTML = "Submit";
    } else {
        document.getElementById("nextBtn").innerHTML = "Next";
    }
    // ... and run a function that displays the correct step indicator:
    fixStepIndicator(n)
}

function nextPrev(n) {
    // This function will figure out which tab to display
    var x = document.getElementsByClassName("tab");

    // validate current step fields
    const valid = validateStep();

    // handle error msg
    if (n > 0) toggleErrorMsg(valid);
    else toggleErrorMsg(true);    

    // Exit the function if any field in the current tab is invalid:
    if (n == 1 && !valid) return false;

    // Hide the current tab:
    x[currentTab].style.display = "none";
    // Increase or decrease the current tab by 1:
    currentTab = currentTab + n;
    // if you have reached the end of the form... :
    if (currentTab >= x.length) {
        //...the form gets submitted:
        //document.getElementById("quizLib").submit();
        redirectResultPage(calcQuizScore());
        return false;
    }
    // Otherwise, display the correct tab:
    showTab(currentTab);
}

function validateForm() {
    // This function deals with validation of the form fields
    var x, y, i, valid = true;
    let isChecked = 0;
    x = document.getElementsByClassName("tab");
    y = x[currentTab].getElementsByTagName("input");

    // A loop that checks every input field in the current tab:
    for (i = 0; i < y.length; i++) {
        console.log(y[i]);
        console.log(y[i].checked);
        // If a field is empty...
        if (y[i].checked == true) {
            isChecked++;
        }
        console.log(isChecked);
    }

    if (isChecked != 1) valid = setFieldInvalid(y[i]);

    // If the valid status is true, mark the step as finished and valid:
    if (valid) {
        document.getElementsByClassName("step")[currentTab].className += " finish";
    }

    return valid; // return the valid status
}

function toggleErrorMsg(valid){
    if (valid) document.getElementById("error-msg").style.display = "none";
    else document.getElementById("error-msg").style.display = "block";
}

function fixStepIndicator(n) {
    // This function removes the "active" class of all steps...
    var i, x = document.getElementsByClassName("step");
    for (i = 0; i < x.length; i++) {
        x[i].className = x[i].className.replace(" active", "");
    }
    //... and adds the "active" class to the current step:
    x[n].className += " active";
}


function calcQuizScore(){
    let inputFields = document.getElementById("quizLib").getElementsByTagName("input");
    let quizScore = {
        "libClass"  : 0,
        "libCon"    : 0,
        "vol"       : 0,
        "con"       : 0,
        "libSoc"    : 0
    };
    console.log(quizScore);

    for (const currentInput of inputFields) {
        console.log(currentInput);
        if (currentInput.checked) {
            console.log("IN");
            for( const attribute in currentInput.dataset) {
                console.log(attribute);
                console.log(quizScore[attribute]);
                quizScore[attribute]++
                console.log(quizScore[attribute]);
            };
        }
    }
    console.log(quizScore);
    return quizScore;
}

function redirectResultPage(quizScore){
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

    for (const key in quizScore) {
        if ( quizScore[key] > max ) {
            max = quizScore[key];
            result = key;      
        }
        queryString = queryString+key+"="+quizScore[key]+"&";
    }

    queryString = "/"+profilePageUrl[result]+"?"+queryString;
    console.log(queryString);

    window.location = queryString;
}