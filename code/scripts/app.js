//rename to controlIndex
var pageIndex = 0;

//The form node which will be the parent of the changing views
var formNode;

//form values
var age = null;
var gender = null;
var totalCol = null;
var HDLCol = null;
var smoker = null;
var systolicBP = null;
var BPTreated = null;

var Points = null; 
var Score = null;

//Array of descriptions which will also be the control classes
const descriptionArray = ["Age","Gender","total_cholesterol","HDL_cholesterol","Smoker","Systolic_blood_pressure","Blood_pressure_being_treated"];
//Array of coltrols, each control for the corresponding class is sepreated by a newline and follows the same order as descriptionArray
const controlArray = ['<input type="range" min="20" max="79" id="ageSlider" onclick="sliderUpdate()" class="Age"><p1 class="Age" id="sliderValue">50</p1>',
'<input type="radio" name="gender" value="Male" id="male" class="Gender"><label for="male" class="Gender">Male<label><br><input type="radio" id="female" name="gender" value="Female" class="Gender"><label for="female" class="Gender">Female<label><br>',
'<select id="totalCholList" class="total_cholesterol"><option>Select</option><option>160 or less</option><option>160-199</option><option>200-239</option><option>240-279</option><option>280+</option></select>',
'<select id="HDLCholList" class="HDL_cholesterol"><option>Select</option><option>40 or less</option><option>40-49</option><option>50-59</option><option>60+</option></select>',
'<input type="radio" name="smoker" value="No" id="no" class="Smoker"><label for="no" class="Smoker">No<label><br><input type="radio" id="yes" name="smoker" value="Yes" class="Smoker"><label for="yes" class="Smoker">Yes<label><br>',
'<select id="SBPList" class="Systolic_blood_pressure"><option>Select</option><option>120 or less</option><option>120-129</option><option>130-139</option><option>140-159</option><option>160+</option></select>',
'<input type="radio" name="bloodTreated" id="bYes" value="Yes" class="Blood_pressure_being_treated"><label for="bYes" class="Blood_pressure_being_treated">Yes<label><br><input type="radio" id="bNo" value="No" name="bloodTreated" class="Blood_pressure_being_treated"><label for="bNo" class="Blood_pressure_being_treated">No<label><br>'];

//Move to the next or previous page depending on the input
function navigate(direction){
    if((pageIndex > 0 && direction == -1) || (pageIndex < 6 && direction == 1)){
        if(savePage() == false && direction == 1){
            alert("ERORR: Please fill out form");
            return;
        }
        removePage();
        pageIndex = pageIndex + direction;
        //Some pages require multiple controls, if so, then skip ahead
        if(direction == 1 && (pageIndex == 1 || pageIndex == 3 || pageIndex == 6)){
            pageIndex++;
        }
        //Some pages require multiple controls, if so, then skip downwards
        if(direction == -1 && (pageIndex == 3 || pageIndex == 1)){
            pageIndex = pageIndex - 1;
        }
        loadPage();
    }
    //If the have fulled out the forms THEN calculate their Score
    else if(direction == 1 && pageIndex == 6){
        if(savePage() == false){
            alert("ERORR: Please fill out form");
            return;
        }
        removePage();
        document.getElementById("previous_button").style.visibility = "hidden";
        document.getElementById("next_button").style.visibility = "hidden";
        document.getElementById("instructions").style.visibility = "hidden";
        CalculateScore();
    }
}

//nothing has been loaded, set up the first page
function start(){
    document.getElementById("displayCanvas").style.visibility = "hidden";
    formNode = document.getElementById("main_form");
    loadPage();
}

//Reset the form and clear all the inputs
function RestartForm(){
    try{
        var el = document.getElementById("scoreDisplay");
        formNode.removeChild(el);
    }
    catch{
    }
    removePage();
    pageIndex = 0;
    age = null;
    gender = null;
    totalCol = null;
    HDLCol = null;
    smoker = null;
    systolicBP = null;
    BPTreated = null;
    Points = null; 
    Score = null;
    document.getElementById("displayCanvas").style.visibility = "hidden";
    document.getElementById("next_button").style.visibility = "visible";
    loadPage();
}

//when the user clicks on the slider show its value
function sliderUpdate(){
    
    document.getElementById("sliderValue").innerText = document.getElementById("ageSlider").value;
    
}

//Display the chart to show the users score
function ShowChart(){
    var canvas = document.getElementById("displayCanvas");
    var bar = canvas.getContext("2d");
    var barTwo = canvas.getContext("2d");
    var getIt = Score/100;
    getIt = getIt * 500;
    var notIt = 500-Score;


    //fill the rectangle with the score
    bar.fillStyle="#ff0000";
    bar.fillRect(0,0,getIt,20);
    barTwo.fillStyle="#1877f2";
    barTwo.fillRect(getIt,0,notIt,20);
    document.getElementById("displayCanvas").style.visibility = "visible";
}

//save the page data at the current pageIndex
function savePage(){
   if(pageIndex == 1){
        try{
        //get the age from the age slider
        var ageSlider = document.getElementById("ageSlider");
        age = ageSlider.value;
        //get the gender from the radio buttons
        gender = document.querySelector('input[name="gender"]:checked').value;
        }
        catch{
            return false;
        }
   }
   else if(pageIndex == 3){
        try{
        //get the total cholesterol input
        var tCol = document.getElementById("totalCholList");
        if(tCol.options[tCol.selectedIndex].text == "Select")
            return false
        totalCol = tCol.options[tCol.selectedIndex].text;
        
        //get the HDL cholesterol input
        var HCol = document.getElementById("HDLCholList");
        if(HCol.options[HCol.selectedIndex].text == "Select")
            return false
        HDLCol = HCol.options[HCol.selectedIndex].text;
        }
        catch{
            return false;
        }
   }
   else if(pageIndex ==  4){
    try{
        //get the smoker status from the radio buttons
        smoker = document.querySelector('input[name="smoker"]:checked').value;
    }
    catch{
        return false;
    }
   }
   else if(pageIndex == 6){
    try{
        //get the blood pressure treatment from the radio buttons
        BPTreated = document.querySelector('input[name="bloodTreated"]:checked').value;
        //get the systonic blood pressure
        var BP = document.getElementById("SBPList");
        if(BP.options[BP.selectedIndex].text == "Select")
            return false
        systolicBP = BP.options[BP.selectedIndex].text;
    }
    catch{
        return false;
    }
   }
}

//remove the page controls and descriptions at the current pageIndex
function removePage(){
    //remove all elements of the current class
    var elementsArray = document.getElementsByClassName(descriptionArray[pageIndex]);
    var numElements = elementsArray.length;
    for(let i = numElements-1; i >= 0; i--){
        elementsArray[i].parentNode.removeChild(elementsArray[i]);
    }

    //Some pages require multiple controls, if so, then remove
    if(pageIndex == 1 || pageIndex == 3 || pageIndex == 6){
        pageIndex = pageIndex - 1;
        removePage();
    }
}

//load the page controls and descriptions at the current pageIndex
function loadPage(){
    //if its the first page THEN hide the previous button
    if(pageIndex == 1)
        document.getElementById("previous_button").style.visibility = "hidden";
    else
        document.getElementById("previous_button").style.visibility = "visible";

    //if its the last page THEN change the button text to submit
    if(pageIndex == 6)
        document.getElementById("next_button").textContent = "submit";
    else
        document.getElementById("next_button").textContent = "next";
   
    var className = descriptionArray[pageIndex];
    //create description HTML
    formNode.innerHTML+='<p class="' + className + '">' + descriptionArray[pageIndex] + "</p>";
    //create control HTML
    formNode.innerHTML+=controlArray[pageIndex];

    //Some pages require multiple controls, if so, then add them
    if(pageIndex == 0 || pageIndex == 2 || pageIndex == 5){
        pageIndex += 1;
        loadPage();
    }
}

/*       /////////////          REST OF PROGRAM IS USED TO CALCULATE THE FRAMINGHAM RISK SCORE         \\\\\\\\\\\\\\\\       */

function CalculateScore(){
    Points = 0;
    Score = 0;
    
    //HDL cholesterol 60 or higher: Minus 1 point. 50-59: 0 points. 40-49: 1 point. Under 40: 2 points
    switch(HDLCol){
        case "40 or less":
         Points += 2; break;
        case "40-49":
         Points += 1; break;
        case "50-59":
         Points += 0; break;
        case "60+":
         Points = Points -1; break;
        default:
            alert("HDL cholesterol not found");
    }

    console.log("Points after HDL cholesterol: " + Points);

    //total cholesterol
    //age
    if(age < 20)
        alert("Invalid age entered for cholesterol (too low)");
    else if(age <= 39){
        if(smoker == "Yes")
            if(gender == "Female")
                Points += 9;
            else
                Points += 8;
        //Calculate for for total Cholesterol
        if(totalCol == "160-199")
            Points += 4; //gender doesn't matter
        else if(totalCol == "200-239"){
            if(gender == "Female")
                Points += 8;
            else
                Points += 7;
        }
        else if(totalCol == "240-279"){
            if(gender == "Female")
                Points += 11;
            else
                Points += 9;
        }
        else if(totalCol == "280+"){
            if(gender == "Female")
                Points += 13;
            else
                Points += 11;
        }
    }
    else if(age <= 49){
        if(smoker == "Yes")
            if(gender == "Female")
                Points += 7;
            else
                Points += 5;
        //Calculate for for total Cholesterol
        if(totalCol == "160-199")
            Points += 3; //gender doesn't matter
        else if(totalCol == "200-239"){
            if(gender == "Female")
                Points += 6;
            else
                Points += 5;
        }
        else if(totalCol == "240-279"){
            if(gender == "Female")
                Points += 8;
            else
                Points += 6;
        }
        else if(totalCol == "280+"){
            if(gender == "Female")
                Points += 10;
            else
                Points += 8;
        }
    }
    else if(age <= 59){
        if(smoker == "Yes")
            if(gender == "Female")
                Points += 4;
            else
                Points += 3;
        //Calculate for for total Cholesterol
        if(totalCol == "160-199")
            Points += 2; //gender doesn't matter
        else if(totalCol == "200-239"){
            if(gender == "Female")
                Points += 4;
            else
                Points += 3;
        }
        else if(totalCol == "240-279"){
            if(gender == "Female")
                Points += 5;
            else
                Points += 4;
        }
        else if(totalCol == "280+"){
            if(gender == "Female")
                Points += 7;
            else
                Points += 5;
        }
    }
    else if(age <= 69){
        if(smoker == "Yes")
            if(gender == "Female")
                Points += 2;
            else
                Points += 1;
        //Calculate for for total Cholesterol
        if(totalCol == "160-199")
            Points += 1; //gender doesn't matter
        else if(totalCol == "200-239"){
            if(gender == "Female")
                Points += 2;
            else
                Points += 1;
        }
        else if(totalCol == "240-279"){
            if(gender == "Female")
                Points += 3;
            else
                Points += 2;
        }
        else if(totalCol == "280+"){
            if(gender == "Female")
                Points += 4;
            else
                Points += 3;
        }
    }
    else if(age <= 79){
        if(smoker == "Yes")
            Points += 1;
        //Calculate for for total Cholesterol
        if(totalCol == "160-199")
            if(gender == "Female")
                Points += 1;
        else if(totalCol == "200-239"){
            if(gender == "Female")
                Points += 1;
        }
        else if(totalCol == "240-279"){
            if(gender == "Female")
                Points += 2;
            else
                Points += 1;
        }
        else if(totalCol == "280+"){
            if(gender == "Female")
                Points += 2;
            else
                Points += 1;
        }
    }
    else
        alert("Invalid age entered for cholesterol");

    console.log("Points after total cholesterol and smoker: " + Points);

    //age
    if(age < 20)
        alert("Invalid age entered (too low)");
    else if(age <= 34)
        if(gender == "Female")
            Points = Points - 7;
        else
            Points = Points - 9;
    else if(age <= 39)
        if(gender == "Female")
            Points = Points - 3;
        else
            Points = Points - 4;
    else if(age <= 44)
        Points += 0;
    else if(age <= 49)
        Points += 3;
    else if(age <= 54)
        Points += 6;
    else if(age <= 59)
        Points += 8;
    else if(age <= 64)
        Points += 10;
    else if(age <= 69)
        if(gender == "Female")
            Points += 12;
        else
            Points += 11;
    else if(age <= 74)
        if(gender == "Female")
            Points += 14;
        else
            Points += 12
    else if(age <= 79)
        if(gender == "Female")
            Points += 16;
        else
            Points += 13;
    else
        alert("Invalid age entered");

    console.log("Points after age: " + Points);

    var ScoreDisplay = document.createElement("h2");
    var text;

    //calculate the score for the gender and add it to ScoreDisplay
    switch(gender){
        case "Female":
            text = CalcFemaleScore(); break;
        case "Male":
            text = CalcMaleScore(); break;
        default:
            alert("gender not found");
    }

    if(text == 30)
        text = "Over 30"
    
    ScoreDisplay.textContent = "10-year cardiovascular risk: " + text + "%"

    //display the score
    formNode.appendChild(ScoreDisplay);
    ScoreDisplay.id = "scoreDisplay";
    ShowChart();
}

function CalcFemaleScore(){
    //Systolic blood pressure
    if(systolicBP == "120-129"){
        if(BPTreated == "No")
            Points += 1;
        else
            Points += 3;
    }
    else if(systolicBP == "130-139"){
        if(BPTreated == "No")
            Points += 2;
        else
            Points += 4;
    }
    else if(systolicBP == "140-159"){
        if(BPTreated == "No")
            Points += 3;
        else
            Points += 5;
    }
    else if(systolicBP == "160+"){
        if(BPTreated == "No")
            Points += 4;
        else
            Points += 6;
    }
    else{
        alert("Systolic blood pressure not valid at: " + systolicBP);
    }
        
    //Calculate the results
    if(Points < 9){
        Score = 1;}
    else if(Points <= 12){
        Score = 1;}
    else if(Points <= 14){
        Score = 2;}
    else if(Points == 15){
        Score = 3;}
    else if(Points == 16){
        Score = 4;} 
    else if(Points == 17){
        Score = 5;}
    else if(Points == 18){
        Score = 6;}
    else if(Points == 19){
        Score = 8;}
    else if(Points == 20){
        Score = 11;}
    else if(Points == 21){
        Score = 14;}
    else if(Points == 22){
        Score = 17;}
    else if(Points == 23){
        Score = 22;}
    else if(Points == 24){
        Score = 27;}
    else if(Points > 25){
        Score = 30;}
    else{
        alert("points not valid");
    }
    return Score;
}

function CalcMaleScore(){

    //Systolic blood pressure
    if(systolicBP == "120-129"){
        if(BPTreated == "No")
            Points += 0;
        else
            Points += 1;
    }
    else if(systolicBP == "130-139"){
        if(BPTreated == "No")
            Points += 1;
        else
            Points += 2;
    }
    else if(systolicBP <= "140-159"){
        if(BPTreated == "No")
            Points += 1;
        else
            Points += 2;
    }
    else if(systolicBP >= "160+"){
        if(BPTreated == "No")
            Points += 2;
        else
            Points += 3;
    }
    else{
        alert("Systolic blood pressure not valid");
    }

    console.log("Points after Systolic blood pressure: " + Points);
    console.log("TOTAL POINTS: " + Points);

    //Calculate the results
    if(Points == 0){
        Score = 1;}
    else if(Points <= 4){
        Score = 1;}
    else if(Points <= 6){
        Score = 2;}
    else if(Points == 7){
        Score = 3;}
    else if(Points == 8){
        Score = 4;} 
    else if(Points == 9){
        Score = 5;}
    else if(Points == 10){
        Score = 6;}
    else if(Points == 11){
        Score = 8;}
    else if(Points == 12){
        Score = 10;}
    else if(Points == 13){
        Score = 12;}
    else if(Points == 14){
        Score = 16;}
    else if(Points == 15){
        Score = 20;}
    else if(Points == 16){
        Score = 25;}
    else if(Points >= 17){
        Score = 30;}
    else{
        alert("points not valid");
    }
    return Score;
}