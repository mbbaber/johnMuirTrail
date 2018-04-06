//PROBLEMS I FIXED
// clean up code  => ongoing but better
// how to get . next to hiker to turn into trail. => DONE
// money and supplies in store need to update automatically 1) when health changes and 2) when stuff is bought
// trail left behind guy => DONE! 
// when end, disable buttons => DONE!
// when game over, diasble buttons => DONE! (need to test)
// status currently does not show @ beginning => FIXED!
// Events text should last longer so user can read => just called stop walking for each event
// health: "dying", print when game over instead of health.string =NAN => DONE.
//PROBLEMS I FIXED
// clean up code  => ongoing but better
// how to get . next to hiker to turn into trail. => DONE
// money and supplies in store need to update automatically 1) when health changes and 2) when stuff is bought
// trail left behind guy => DONE! 
// when end, disable buttons => DONE!
// when game over, diasble buttons => DONE! (need to test)
// status currently does not show @ beginning => FIXED!
// Events text should last longer so user can read => just called stop walking for each event
// health: "dying", print when game over instead of health.string =NAN => DONE.
// right now when you rest with no food, you dont die => FIXED!
// make PP presentation => DONE

//TODO:
// layout issue - can do Fri morn.

//constants
var PRICE_FOOD = 10 //$10 for 10lbs
var PRICE_AID = 5 //$5 for 1.

//Set up hiker stats (will be updated each mile of play, each day of play, and during events)
function Party(food, money, pace, rations, hikers, aid){ 
    this.food = food;
    this.money = money;
    this.pace = pace;
    this.rations = rations;
    this.hikers = hikers;
    this.aid = aid;

    Party.prototype.health = function () { // total Health is the average of each hiker's health.
        var totalHealth = 0;
        for (i = 0; i < this.hikers.length; i++){
            totalHealth += this.hikers[i].health;
        };
        return totalHealth / this.hikers.length;
    };

    Party.prototype.paceString = function () { // set strings for pace setting.
        if (this.pace === 5) {
            return "Slow"
        }else if (this.pace === 10) {
            return "Normal"
        } else if (this.pace === 15) {
            return "Fast"
        } else {
            return "Cannot determine"
        };
    };

    Party.prototype.rationString = function () { // set strings for ration setting.
        if (this.rations === 3) {
            return "Big Meals"
        }else if (this.rations === 2) {
            return "Normal Meals"
        } else if (this.rations === 1) {
            return "Small Meals"
        } else {
            return "Cannot determine"
        };
    };

    Party.prototype.healthString = function () { // set strings for health percentages.
        var health = this.health()
        if (health >= 100) {
            return "Perfect"
        } else if (health > 75) {
            return "Good"
        }else if (health > 50) {
            return "Fair"
        }else if (health > 25) {
            return "Poor"
        }else if (health > 0) {
            return "Dying"
        } else if (health <= 0) {
            return "Dead"
        }else {
            return "Cannot determine"
        };
    };

    Party.prototype.removeHiker = function(hikerName) {
        this.hikers = this.hikers.filter(function(hiker) {
            return hiker.name !== hikerName;
        });
    }

    Party.prototype.isStillAlive = function() {
        return this.hikers.length > 0;
    }
};

function Hiker(name, health) {
    this.name = name;
    this.health = health;

    Hiker.prototype.healthString = function () { // set strings for health percentages.
        var health = this.health;
        if (health >= 100) {
            return "Perfect"
        } else if (health > 75) {
            return "Good"
        }else if (health > 50) {
            return "Fair"
        }else if (health > 25) {
            return "Poor"
        }else if (health > 0) {
            return "Dying"
        } else if (health <= 0) {
            return "Dead"
        }else {
            return "Cannot determine"
        };
    };
};


//pick random hiker names from IronHack roster: 
var IRON_HACK_ROSTER = ['Bertrand', 'Billy', 'Brianna', 'Clément', 'Arthur', 'Elise', 'J-B', 'Jeremie', 'Leo P.', 'Luke', 'Louis', 'Lucas', 'Maggie', 'Michael', 'Nizar', 'Patrycja', 'Renaud', 'Rodrigo', 'Vivian', 'Léo W.', 'Mostafa', 'Pierre', 'Sami'];

function createRandomParty (numberHikers) {
    var hikers = [];
    var INITIAL_HEALTH = 100;
    for(var i = 0; i < numberHikers; i++){
        //randomly pick a name
        var randomHikerPosition = Math.floor(Math.random() * IRON_HACK_ROSTER.length);
        var name = IRON_HACK_ROSTER[randomHikerPosition];

        //remove hiker from the roster
        IRON_HACK_ROSTER.splice(randomHikerPosition, 1);

        //Create new hiker
        var hiker = new Hiker(name, INITIAL_HEALTH);

        //Add hiker to party
        hikers.push(hiker)
    }
    //Create the party with stats
    return new Party(0, 300, 10, 3, hikers, 0);
}

var party = createRandomParty(5);

//Welcome Message
var printEvent = document.getElementById('print-event');
function welcomeMessage() {
    var teamNames = party.hikers.map(function(hiker) { return hiker.name }).join(", ");

    printEvent.innerHTML = "<h1 class = 'center-text'>JOHN MUIR TRAIL</h1>"+
        "<h3 class = 'center-text'> Welcome! <br><br>"+
        "Team: " + teamNames + "<br><br>"+
        "Your goal is to survive 233 miles along the trail. <br><br>"+
        "Most groups start by buying supplies. <br><br>"+
        "You can check status, change rations, rest, and change pace along the way. <br><br>"+
        "You can only buy supplies at campsites with stores. <br><br>"+
        "BEWARE: Your actions may affect your health! <br><br>Ready, Set, Hike!</h3>"
}
welcomeMessage();


function subtractFood () {
    if (miles %party.pace === 0) {
        if (party.rations === 3) {
            party.food -= 3 * party.hikers.length;  
        } else if (party.rations === 2) {
            party.food -= 2 * party.hikers.length;
        } else if (party.rations === 1) {
            party.food -= 1 * party.hikers.length;
        } else {
            party.food
        };
    };
    if (party.food <0) {
        party.food = 0
    };
};
    

//adjust hiker stats by weather, pace, and ration
function adjustHikerStats () {
    function adjustForWeather (){ // hikers health decreases in poor weather (and inverse);
        for (i = 0; i < party.hikers.length; i++){
            if (weather === "Sunny") {
                party.hikers[i].health;
            } else if (weather === "Rainy") {
                party.hikers[i].health -= 1;
            } else if (weather === "Snowy") {
                party.hikers[i].health -= 2;
            } else if (weather === "Heat Wave") {
                party.hikers[i].health -= 2;
            } else if (weather === "Thunderstorm") {
                party.hikers[i].health -= 2;
            } else {
                party.hikers[i].health;
            };
        };
    };
    function adjustForPace (){ // if hikers walk slowly, they get healthier (and inverse)
        for (i = 0; i < party.hikers.length; i++){
            if (party.pace === 15) {
                party.hikers[i].health -= 1;
            } else if (party.pace === 5) {
                party.hikers[i].health += 1;
            } else {
                party.hikers[i].health
            };
        };
    };
    function adjustForRation (){ // if hikers eat well, they get healthier (and inverse)
        for (i = 0; i < party.hikers.length; i++){
            if (party.food > 0) {
                if (party.rations === 3) {
                    party.hikers[i].health += 1;
                } else if (party.rations === 1) {
                    party.hikers[i].health -= 1;
                } else {
                    party.hikers[i].health;
                };
            };
        };
    };
    function adjustForFood () { // if food falls to zero, hiker health will deteriorate fast.
        for (i = 0; i < party.hikers.length; i++){
            if ((party.food <= 0) && (miles %party.pace === 0)) {
                party.hikers[i].health -= 20; // hiker will die in 5 days.
            }
        };
    };

    function makeSureHealthIsValid() {
        party.hikers.forEach(function(hiker){
            if (hiker.health < 0) {
                hiker.health = 0;
            }
            if (hiker.health > 100) {
                hiker.health = 100;
            }
        })
    }

    function removeDeadHikers() {
        party.hikers.forEach(function(hiker){
            if (hiker.health <= 0) {
                //Print the death event
                printEvent.innerText = hiker.name + "'s health is too low to continue.  " + hiker.name + " has been airlifted to the nearest hospital."
                stopWalking();
                //remove hiker from party
                party.removeHiker(hiker.name)
            }
        })
    };

    adjustForWeather();
    adjustForPace();
    adjustForRation();
    adjustForFood();
    makeSureHealthIsValid();
    removeDeadHikers();
};

var miles = 0;
var totalMiles = 0;
var days = 0;
var weather;

//My Main Function (loops through miles of game and updates/prints events)
function walking () {  // TODO: would like to clean this up eventually/combine functions
    if (miles <= camps[camps.length-1].distance){
        printWalkingText(miles)
        printCamp(miles);

        countDays(miles);
        getRandomWeatherByDay(miles); 

        randomEvent(miles);

        stopAtStore();
        subtractFood();
        adjustHikerStats();

        printDistanceBox();
        
        getIndividualHealth();

        printStatsBox();

        if (!party.isStillAlive()) {
            printEvent.innerText = "GAME OVER, everyone in your party was airlifted from the John Muir Trail and was taken to the nearest hospital.";
            disableButtons();
        }
        endMessage();
        miles++
        updateCanvas();
    } else {
        clearInterval(mainInterval);
    }
};

//TODO: put @ top of page, sets variables to use for printing in HTML
var weatherCount = document.getElementById('weather');
var nextCampCount = document.getElementById('nextCamp');
var logCount = document.getElementById('logCount');
var milesCount = document.getElementById('milesCount');
var daysCount = document.getElementById('daysCount');
var paceCount = document.getElementById('paceCount');
var rationCount = document.getElementById('rationCount');
var healthCount = document.getElementById('healthCount');
var remainingFoodCount = document.getElementById('rfCount');

//prints everything in the Distance box: distance to next camp and miles trav
function printDistanceBox () {
    function printNextCamp () {
        for (var i = 0; i < camps.length; i++){ 
            var camp = camps[i];
            if (miles <= camp.distance) {
                var milesNextCamp = (camp.distance - miles).toFixed(1);
                nextCampCount.innerText = "Miles to Next Camp: " +milesNextCamp;
                break;
            }
        };
    };
    function printMilesText() {
        milesCount.innerText = "Total miles traveled: " +miles;
    };
printNextCamp();
printMilesText();
};

//function for printing all informaiton that goes into stats box: pace, ration, health, remaining food
function printStatsBox () {
    function printPace () {
        paceCount.innerText = "Pace: " + party.paceString();
    };
    function printRation() {
        rationCount.innerText = "Ration: " + party.rationString();
    };
    function printHealth () {
        //create a true/false flag we can test against
        var partyIsHealthy = party.health() >= 50;
        if (party.hikers.length > 0){ 
            if (partyIsHealthy){
                healthCount.className = "";
            } else { 
                healthCount.className = "red"; 
            }
            healthCount.innerText = "Health: " + party.healthString() + " ("+party.health()+")" 
        } else {
            healthCount.innerText = "Health: Dying" 
        }  
    };
    function printRemainingFood() { //TODO: never have negative food count and never display negative food count.
        //create a true/false flag we can test against
        var mealsPerDay = 3;
        var thereIsEnoughFood = party.food >= (party.hikers.length * party.rations * mealsPerDay);
        //We make sure we don't have negative food
        var remainingFood = party.food > 0 ? party.food : 0;

        if (thereIsEnoughFood){
            remainingFoodCount.className = "";
        } else {
            remainingFoodCount.className = "red";
        }
        remainingFoodCount.innerText = "Remaining Food: " + remainingFood + " lbs"
    };

    printPace();
    printRation();
    printHealth();
    printRemainingFood();
};

//changes weather every 10 mile, defined as 1 day;
function getRandomWeatherByDay (miles){ //assuming day = 10miles
    if ((miles %party.pace === 0) && (miles !== 0)){
        getRandomWeather();
    };
};

//creates function that changes weather every day and writes result in HTML.
function getRandomWeather (){
        var num=Math.random();
        if(num < 0.5) weather = "Sunny";  //probability 0.5
        else if(num < 0.65) weather = "Rainy";  // probability 0.15
        else if(num < 0.75) weather = "Snowy"; //probability 0.1
        else if(num < 0.9) weather = "Heat Wave"; //probability 0.15
        else weather = "Thunderstorm";  //probability 0.1
        weatherCount.innerText = "Weather: " +weather;
};

//create countDay function, which sets 1 day = 10 miles, and prints when each day changes
function countDays () {
    if (miles %party.pace === 0){
        days++;
        daysCount.innerText = "Days on Trail: " +days;
    }
};

//create printWalk function, which prints "walking..." message when hiker is in between camps
function printWalkingText() {
    camps.forEach(function(camp) {
        if (miles === 1) {
            logCount.innerText = 'On the trail...';
        }
        else if (miles === Math.floor(camp.distance +1)) {
            logCount.insertAdjacentHTML( "afterbegin",'<div class="log-font">On the trail...</div><br>');
        }  
    });
};

// create printCamp function, which prints message when hiker has arrived at a camp.
function printCamp (miles){
    camps.forEach(function(camp){
        if (miles === Math.floor(camp.distance)) {
            camp.printCamp();
            logCount.insertAdjacentHTML("afterbegin",'<div>You have arrived at '+ camp.name + '.</div><br>');    
        };
    });
};

//set up object constructor for camp information: name, distance from start, and weather or not there is a store at camp (0 no, 1 yes)
function Camp (name, distance, store) {
    this.name = name;
    this.distance = distance;
    this.store = store;

    Camp.prototype.printCamp = function () {
        console.log("You have arrived at " + this.name + ".");
    }
};

// enter information for each camp

var camp1 = new Camp("Half Dome Junction", 12.3, 0,);
var camp2 = new Camp("Sunrise Camp", 19.9, 0);
var camp3 = new Camp("Tuolume Meadows", 31.3, 1);
var camp4 = new Camp("Upper Lyell Canyon", 40.8, 0);
var camp5 = new Camp("Thousand Island Lake", 50.5, 0);
var camp6 = new Camp("Devil’s Postpile", 66.7, 1);
var camp7 = new Camp("Deer Creek", 75.7, 0);
var camp8 = new Camp("Tully Hole", 88, 0);
var camp9 = new Camp("Edison Lake", 99.8, 0);
var camp10 = new Camp("Rosemarie Meadow", 112.1, 0);
var camp11 = new Camp("Muir Trail Ranch", 121.6, 1);
var camp12 = new Camp("McClure Meadow", 132.2, 0);
var camp13 = new Camp("Helen Lake", 144.4, 0);
var camp14 = new Camp("Deer Meadow", 155.7, 0);
var camp15 = new Camp("Kings River", 167.7, 0);
var camp16 = new Camp("Woods Creek", 179.3, 1);
var camp17 = new Camp("Vidette Meadow", 192.5, 0);
var camp18 = new Camp("Tyndall Creek", 204.5, 0);
var camp19 = new Camp("Guitar Lake", 216.6, 0);
var camp20 = new Camp("Trail Camp", 226.6, 0);
var camp21 = new Camp("Whitney Portal", 233.4, 0);

// put each camp into an array, called camps
var camps =[];
camps.push(camp1, camp2, camp3, camp4, camp5, camp6, camp7, camp8, camp9, camp10, camp11, camp12, camp13, camp14, camp15, camp16, camp17, camp18, camp19, camp20, camp21);

//create, print random event, and change associated stats
function randomEvent () {
    if ((Math.random() > 0.8) && (miles !== 0)) { //10% probabilty that an event happens each mile (can change this).
        newEvent = events[Math.floor(Math.random()*events.length)];

        newEvent.userInput();
        newEvent.changeStats();
    } else {
        printEvent.innerHTML = ' ';
    };
};

function disableButtons () {
    document.getElementById('pause-btn').disabled = true; 
    document.getElementById('continue-btn').disabled = true; 
    document.getElementById('rest-btn').disabled = true; 
};

function enableButtons () {
    document.getElementById('pause-btn').disabled = false; 
    document.getElementById('continue-btn').disabled = false; 
    document.getElementById('rest-btn').disabled = false;
};

//set up object constructor for event information: type (stat-change), notification (positive or negative), value (-/+ value to change in stats), stat (which stat will be changed), text (message to show);
var statusBox = document.getElementById('status-box');

var newEvent;
var yesOrNoInfo = document.getElementById('yesOrNo-info');
var randomHiker;
var text;

function Event (type, notification, value, stat, text, stopHike) { //setting up object constructor
    this.type = type;
    this.notification = notification;
    this.value = value;
    this.stat = stat;
    this.text = text;
    this.stopHike = stopHike;

    Event.prototype.changeStats = function() {
        randomHiker = party.hikers[Math.floor(Math.random() * party.hikers.length)];
        text = randomHiker.name + this.text;
        stopWalking();
        if (this.type === 'stat-change') {
            if (this.stat === 'health'){
                randomHiker.health += this.value;
            } else if (this.stat == 'aid' && party.aid <= 0){
                //do nothing and don't display anything
                text = "";
            } else if (this.stat == 'money' && party.money <= 0){
                //do nothing and don't display anything
                text = "";
            } else if (this.stat == 'food' && party.food <= 0) {
                //do nothing and don't display anything
                text = "";
            } else {
                party[this.stat] += this.value;
            }
        } else if (this.type === 'rest') {
            clearInterval(mainInterval);
            statusBox.innerHTML = "Status: Resting";
            setTimeout(updateRestStats, 1500);
            setTimeout(stopWalking, 2000);
        }
        printEvent.innerHTML = '<div class = "center-text">'+ text + '</div><br>'
    };

    Event.prototype.yesButtonEvent = function() {
        party.aid -= 1;
        randomHiker.health -= this.value;  //variable, can change
        setTimeout(startWalking, 2000);
        setTimeout(enableButtons, 2000);
    };
    
    Event.prototype.noButtonEvent = function() {
        randomHiker.health -= this.value*2; //variable, can change
        setTimeout(startWalking, 2000);
        setTimeout(enableButtons, 2000);
    };

    Event.prototype.userInput = function() {
        if (this.type === 'user-input') {
            randomHiker = party.hikers[Math.floor(Math.random() * party.hikers.length)]
            text = randomHiker.name + this.text;
            stopWalking();
            if ((party.aid > 0) && (this.stat === 'health')) {
                yesOrNoInfo.innerHTML = "<div id = 'yesOrNo-info' class= 'yesOrNo-info col-md-12'><b>Would you like to use a first-aid kit?</b><br><span><button class = '.btn-sm btn-success 'id= 'yes-btn' type='button'>Yes</button><button class = '.btn-sm btn-danger' id= 'no-btn' type='button'>No </button></span>";
                var yesButton = document.getElementById('yes-btn');
                var noButton = document.getElementById('no-btn');
                disableButtons();
                yesButton.onclick = function () {
                    newEvent.yesButtonEvent();
                };
                noButton.onclick = function () {
                    newEvent.noButtonEvent();
                };
            } else if (this.stat === 'health') {
                yesOrNoInfo.innerHTML = "<div id = 'yesOrNo-info' class= 'yesOrNo-info col-md-12'><b>You have no first-aid kits.<b></div>";
            } else {
                console.log("user-input stat != health was found")
            };
        } else {
            var text = this.text; // if event in not a user-input, this line makes sure text is defined.
        };
        printEvent.innerHTML = '<div class = "center-text">'+ text + '</div><br>';
    };

};

// information for each event
//food positive
var event1 = new Event('stat-change', 'positive', (party.rations * party.hikers.length), 'food', " found wild berries." );
var event2 = new Event('stat-change', 'positive', (party.rations * party.hikers.length), 'food', " found wild mushrooms." );

//food negative
var event3 = new Event('stat-change', 'negative', -5, 'food', "'s food spoiled.");
var event4 = new Event('stat-change', 'negative', (-party.rations * party.hikers.length), 'food', " fell in a river and lost a entire day's food ration!");

//health negative
var event5 = new Event('user-input', 'negative', -5, 'health', " sprained an ankle." );
var event6 = new Event('user-input', 'negative', -10, 'health', " was attacked by a bear!");
var event7 = new Event('stat-change', 'negative', -10, 'health', " drank bad water.");
var event8 = new Event('stat-change', 'negative', -10, 'health', " is dehydrated.");
var event9 = new Event('user-input', 'negative', -7.5, 'health', " was bitten by a snake!");
var event10 = new Event('user-input', 'negative', -7.5, 'health', " drank downstream from camp and got E. Coli!");
var event11 = new Event('stat-change', 'negative', -10, 'health', " is exhausted from walking.");

//lost supplies
var event12 = new Event ('stat-change', 'negative', -1, 'aid', "'s backpack got wet and a first aid kit was ruined.");
var event13 = new Event ('stat-change', 'negative', -10, 'money', "'s backpack broke and 10€ was lost.");

//rest event (lose food, but gain health and more like to have events happen to you.)

var event14 = new Event('rest', 'negative', (-party.hikers.length), "food", " took the wrong trail. Lost 1 day.");
var event15 = new Event('rest', 'negative', (-party.hikers.length), "food", " got lost. Lost 1 day.");

// put each event into an array, called events
var events = [];
events.push(event1, event2, event3, event4, event5, event6, event7, event8, event9, event10, event11, event12, event13, event14, event15);

var mainInterval;
function startWalking(){
    $('.status-info').hide();
    $('.buy-info').hide();
    $('.pace-info').hide();
    $('.map-info').hide();
    $('.rations-info').hide();
    $('.yesOrNo-info').hide();
    $('.map-info').show();
    mainInterval = setInterval(walking, 750);
    statusBox.innerHTML = "Status: Walking";
};

function stopWalking(){ //stops the interval
    clearInterval(mainInterval);
    statusBox.innerHTML = "Status: Stopped";
};

document.getElementById('buy-btn').disabled = false; // So I can buy items at beginning of game

function stopAtStore () { // So I can buy items only when I arrive at a campsite with a store
    document.getElementById('buy-btn').disabled = true;
    camps.forEach(function(camp) {
        var roundedCampDistance = Math.floor(camp.distance)
        if ((miles === roundedCampDistance) && (camp.store === 1)) {
            clearInterval(mainInterval);
            statusBox.innerHTML = "Status: Stopped";
            document.getElementById('buy-btn').disabled = false;
            printEvent.innerHTML = "<div class = 'center-text'>You have reached a camp with a store.</div>";
        };
    });
};  

function restOneDay() {
    clearInterval(mainInterval);
    printRest();
    setTimeout(updateRestStats, 2500);
    setTimeout(stopWalking, 5000);
};

function printRest(){
    printEvent.innerHTML = '<div class = "center-text">You are resting 1 day.</div><br>'
    statusBox.innerHTML = "Status: Resting";
};

function updateRestStats(){
    party.food -= (party.rations* party.hikers.length);
    days += 1
    for (i = 0; i < party.hikers.length; i++){
        party.hikers[i].health += 5;
    };
    getRandomWeather(); //update and print weather also (need to figure out how to deal with days)
    countDays();
    printStatsBox ();
};

// Button assignments
var continueButton = document.getElementById('continue-btn');
continueButton.onclick = startWalking;

var pauseButton = document.getElementById('pause-btn');
pauseButton.onclick = stopWalking;

var restButton = document.getElementById('rest-btn');
restButton.onclick = restOneDay;

var mapButton = document.getElementById('map-btn');
mapButton.onclick = mapButtonEvents;

$('.map-info').show();
function mapButtonEvents () {
    //stopWalking(); //not sure if I need this, since it will be default
    $('.rations-info').hide();
    $('.status-info').hide();
    $('.buy-info').hide();
    $('.pace-info').hide();
    $('.map-info').show();
};

var statusButton = document.getElementById('status-btn');
statusButton.onclick = statusButtonEvents;

$('.status-info').hide();
function statusButtonEvents () {
    stopWalking();
    $('.map-info').hide();
    $('.rations-info').hide();
    $('.buy-info').hide();
    $('.pace-info').hide();
    $('.status-info').show();
    getIndividualHealth();
};

var statusInfo = document.getElementById('status-info');

function getIndividualHealth () {

    //We get the first column of the status-info box and write the HTML for each supply (easier than creating a div everytime)
    var supplyColumn = document.getElementById("status-supplies");
    supplyColumn.innerHTML= "<b>Supplies:</b><br/>"+
        "Money: $"+party.money+"<br/>"+
        "Food (lbs): "+party.food+"<br/>"+
        "First Aid Kits: "+party.aid+"<br/>";

    //We get the individual health column
    var individualHealthColumn = document.getElementById("status-individual-health");
    //We edit the inner HTML appending a new line for each hiker
    var innerHTML = "<b>Health of the team:</b><br/>"
    party.hikers.forEach (function (hiker){
        innerHTML += (hiker.name + ": " + hiker.healthString() + " ("+hiker.health+")<br/>");
    });
    //We change the DOM once here
    individualHealthColumn.innerHTML = innerHTML;
};

//start rations button and box
var rationsButton = document.getElementById('rations-btn');
rationsButton.onclick = rationsButtonEvents;

$('.rations-info').hide();
function rationsButtonEvents () {
    stopWalking();
    $('.status-info').hide();
    $('.buy-info').hide();
    $('.pace-info').hide();
    $('.map-info').hide();
    $('.rations-info').show();
};

var bigMealButton = document.getElementById('big-meals-btn');
bigMealButton.onclick = bigMealEvent;

var normalMealButton = document.getElementById('normal-meals-btn');
normalMealButton.onclick = normalMealEvent;

var smallMealButton = document.getElementById('small-meals-btn');
smallMealButton.onclick = smallMealEvent;

function bigMealEvent (){
    party.rations = 3;
    printStatsBox();
};

function normalMealEvent (){
    party.rations = 2;
    printStatsBox();
};

function smallMealEvent (){
    party.rations = 1;
    printStatsBox();
};

var buyButton = document.getElementById('buy-btn');
buyButton.onclick = buyButtonEvents;
var buyInfo = document.getElementById('buy-info');

$('.buy-info').hide();
function buyButtonEvents () {
    stopWalking();
    $('.rations-info').hide();
    $('.status-info').hide();
    $('.map-info').hide();
    $('.pace-info').hide();
    $('.buy-info').show();
};

var clearfix = document.createElement("div");
clearfix.className = "clearfix";
document.getElementById('store-buy-button').disabled = true;
function updatePrices () {
    document.getElementById('store-buy-button').disabled = false;
    var items = document.getElementsByClassName("item");
    var runningCost = 0;

    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var individualCost = item.getElementsByClassName("cost");
        var stringCost= individualCost[0].innerText;
        var cost = parseFloat(stringCost);

        var individualQuantity = item.getElementsByClassName("quantity");
        var stringQuantity= individualQuantity[0].value;
        var quantity = parseFloat(stringQuantity);

        var total = cost * quantity;
  
        runningCost += total;

        var divTotal = item.getElementsByClassName("item-total");
        divTotal[0].innerText = total.toFixed(2) + "€" ;
    }
    var totalPrice = document.getElementById("total");
    totalPrice.innerText = runningCost.toFixed(2) + "€";

    //var rMoney = document.getElementById("r-money");
    //rMoney.innerText = party.money.toFixed(2) + "€";
};
function buyCart () {
    var items = document.getElementsByClassName("item");
    var totalAll = 0;
    for (var i = 0; i < items.length; i++) {
        var item = items[i];

        var names = item.getElementsByClassName("product-name");
        var name = names[0].innerText;

        var individualCost = item.getElementsByClassName("cost");
        var stringCost= individualCost[0].innerText;
        var cost = parseFloat(stringCost);

        var individualQuantity = item.getElementsByClassName("quantity");
        var stringQuantity= individualQuantity[0].value;
        var quantity = parseFloat(stringQuantity);

        if (name == 'First-Aid Kit') {
            party.aid += quantity;
        } else if (name == '1 lb Food') {
            party.food += quantity;
        }

        var total = cost * quantity;
        totalAll +=total;
        }
        if (party.money >= totalAll) {
            party.money -= totalAll;  
            var rMoney = document.getElementById("r-money");
              rMoney.innerText = party.money.toFixed(2) + "€";
          } else {
              printEvent.innerHTML = "You don't have enough money for this purchase."
              setTimeout(function(){printEvent.innerHTML=""}, 2000);
    }
    }



var calcButton = document.getElementById("store-calc-button");
calcButton.onclick = updatePrices;

var storeBuyButton = document.getElementById("store-buy-button");
storeBuyButton.onclick = buyCart;

//pace buttons box
var paceInfo = document.getElementById('pace-info');
var paceButton = document.getElementById('pace-btn');
paceButton.onclick = paceButtonEvents;

$('.pace-info').hide();
function paceButtonEvents () {
    stopWalking();
    $('.rations-info').hide();
    $('.status-info').hide();
    $('.buy-info').hide();
    $('.map-info').hide();
    $('.pace-info').show();
};

var slowButton = document.getElementById('slow-btn');
slowButton.onclick = slowEvent;

var normalButton = document.getElementById('normal-btn');
normalButton.onclick = normalEvent;

var fastButton = document.getElementById('fast-btn');
fastButton.onclick = fastEvent;

function slowEvent (){
    party.pace = 5;
    printStatsBox();
};

function normalEvent (){
    party.pace = 10;
    printStatsBox();
};

function fastEvent (){
    party.pace = 15;
    printStatsBox();
};

//When game ends, print message
function endMessage () { 
    if (miles >= Math.floor(camps[camps.length-1].distance)) {
        printEvent.innerHTML = "<div class = 'center-text'><h1>Congratulations! You have survived!</h1><h3>You completed the John Muir Trail in " + days + " days.<h3></div>";
        $('.status-info').show();
        $('.map-info').hide();
        statusBox.innerHTML = "Status: Completed";
        disableButtons();
    };
};

//starting CANVAS

var canvas = document.querySelector('.canvas');

canvas.width = window.innerWidth; 
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");

var personImg = new Image(); 
personImg.src = "./img/littleHiker.png";

var tentImg = new Image(); 
tentImg.src = "./img/tent.png";

var storeImg = new Image(); 
storeImg.src = "./img/store.png";

var drawingConstant = 4.5
var xCamp = 0;

function clearCanvas () {
    ctx.clearRect(0,0, canvas.width, canvas.height);//clear everything before starting to draw 
};

function updateCanvas () {
    clearCanvas();
    drawBackgroundMap();
    drawHiker();
    drawTents();
};

personImg.onload = updateCanvas;

function drawHiker() {
    var hikerX = miles * drawingConstant;
    ctx.drawImage(personImg, hikerX, 150, personImg.width*0.35, personImg.height); 
};

function drawTents() {

    camps.forEach(function(camp) {
        
        var logo = tentImg;
        var height = logo.height*0.5;
        var width = logo.width*0.15;

        if (camp.store == true) {// == checks that the VALUE is the same (1 == true), === checks that they are the SAME (1===1) (1 !== true)
            logo = storeImg;
            height = logo.height*0.25;
            width = logo.width*0.09;
        }

        var campX = camp.distance * drawingConstant + width;
        ctx.drawImage(logo, campX, 50, width, height); 
    })

};

function drawBackgroundMap() {
    var dotX = miles * drawingConstant;
    ctx.fillStyle = "black";
    ctx.fillRect(5,315, dotX, 15); 
};


/* NOTES: THINGS I THOUGHT ABOUT DOING

var thumbImg = new Image();
thumbImg.src = "./img/thumb.png"

var feverImg = new Image();
feverImg.src = "./img/fever.png"

var heloImg = new Image();
heloImg.src = "./img/helo.png"
function endAnimation () {
    ctx.fillStyle = "#FF0000";
    var y1 = 0;
    var y2 = 0;
    var y3 = 0;
    
    function updateEndAnimation(){
      y1 += 1;
      y2 += 2;
      y3 += 3;
      clearCanvas();
      ctx.fillRect( 50,y1,50,50);
      ctx.fillRect(150,y2,50,50);
      ctx.fillRect(250,y3,50,50);  
      window.requestAnimationFrame(updateEndAnimation);
    }
    
    window.requestAnimationFrame(updateEndAnimation);
};

function deathAnimation () {
        clearCanvas();
        ctx.drawImage(thumbImg, 500, 200, thumbImg.width, thumbImg); 
};
*/

/* REFACTORED SOME CODE.. this is old code (for notes/study)
// var randomHiker1;
// var randomHiker2;
// var randomHiker3;
// var randomHiker4;
// var randomHiker5;

// function getRandomIronHacker () {
//     randomHiker1 = IronHackRoster[Math.floor(Math.random()*IronHackRoster.length)];
    
//     for (var i=IronHackRoster.length-1; i>=0; i--) {
//         if (IronHackRoster[i] === randomHiker1) {
//         IronHackRoster.splice(i, 1); 
//         }
//     };
    
//     randomHiker2 = IronHackRoster[Math.floor(Math.random()*IronHackRoster.length)];
        
//     for (var i=IronHackRoster.length-1; i>=0; i--) {
//         if (IronHackRoster[i] === randomHiker2) {
//         IronHackRoster.splice(i, 1); 
//         }
//     };

//     randomHiker3 = IronHackRoster[Math.floor(Math.random()*IronHackRoster.length)];

//     for (var i=IronHackRoster.length-1; i>=0; i--) {
//         if (IronHackRoster[i] === randomHiker3) {
//         IronHackRoster.splice(i, 1); 
//         }
//     };

//     randomHiker4 = IronHackRoster[Math.floor(Math.random()*IronHackRoster.length)];

//     for (var i=IronHackRoster.length-1; i>=0; i--) {
//         if (IronHackRoster[i] === randomHiker4) {
//         IronHackRoster.splice(i, 1); 
//         }
//     };

//     randomHiker5 = IronHackRoster[Math.floor(Math.random()*IronHackRoster.length)];

//     console.log(randomHiker1)
//     console.log(randomHiker2)
//     console.log(randomHiker3)
//     console.log(randomHiker4)
//     console.log(randomHiker5)
// }
    
// getRandomIronHacker();

//introduce hikers
// var hiker1 = new Hiker(randomHiker1, 60);
// var hiker2 = new Hiker(randomHiker2, 60);
// var hiker3 = new Hiker(randomHiker3, 60);
// var hiker4 = new Hiker(randomHiker4, 60);
// var hiker5 = new Hiker(randomHiker5, 60);

//create party array with hikers inside
// var party = new Party(50, 300, 10, 3,[hiker1, hiker2, hiker3, hiker4, hiker5], 1);
*/