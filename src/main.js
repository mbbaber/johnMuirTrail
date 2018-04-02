priceFood = 10 //$10 for 10lbs
priceAid = 5 //$5 for 1.

//Set up hiker stats (will be updated each mile of play, each day of play, and during events)
function Party(food, money, pace, rations, hikers, aid){
    this.food = food;
    this.money = money;
    this.pace = pace;
    this.rations = rations;
    this.hikers = hikers;
    this.aid = aid;

    Party.prototype.health = function () {
        var totalHealth = 0;
        for (i = 0; i < this.hikers.length; i++){
            totalHealth += this.hikers[i].health;
        };
        return totalHealth / this.hikers.length;
    };

    Party.prototype.paceString = function () {
        if (this.pace === 1) {
            return "Slow"
        }else if (this.pace === 2) {
            return "Normal"
        } else if (this.pace === 3) {
            return "Fast"
        } else {
            return "Cannot determine"
        };
    };

    Party.prototype.rationString = function () {
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

    Party.prototype.healthString = function () {
        var health = this.health()
        if (health >= 100) {
            return "Perfect"
        } else if (health > 75) {
            return "Good"
        }else if (health > 50) {
            return "Fair"
        }else if (health > 25) {
            return "Poor"
        }else if (health >0) {
            return "Dying"
        } else if (health <= 0) {
            return "Dead"
        }else {
            return "Cannot determine"
        };
    };
};

function Hiker(name, health) {
    this.name = name;
    this.health = health;
};

//introduce hikers
var hiker1 = new Hiker("Maggie", 100);
var hiker2 = new Hiker("Louis", 100);
var hiker3 = new Hiker("Hiker3", 100);
var hiker4 = new Hiker("Hiker3", 100);
var hiker5 = new Hiker("Hiker3", 100);

//create party array with hikers inside
var party = new Party(50, 300, 2, 3,[hiker1, hiker2, hiker3, hiker4, hiker5], 1);

function subtractFood () {
    if (miles %10 === 0) {
        if (party.rations === 3) {
            party.food -= 3 * party.hikers.length;  
        } else if (party.rations === 2) {
            party.food -= 2 * party.hikers.length;
        } else if (party.rations === 1) {
            party.food -= 1 * party.hikers.length;
        } else {
            party.food
        };
    } else {
       remainingFoodCount.innerText = "Remaining Food: " + party.food + " lbs"; 
    }
};  

//adjust hiker stats by weather, pace, and ration
function adjustHikerStats () {
    function adjustForWeather (){ // hikers health decreases in poor weather (and inverse);
        for (i = 0; i < party.hikers.length; i++){
            if (weather === "Sunny") {
                party.hikers[i].health += 1;
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
            if (party.pace === 3) {
                party.hikers[i].health -= 1;
            } else if (party.pace === 1) {
                party.hikers[i].health += 1;
            } else {
                party.hikers[i].health
            };
        };
    };

    function adjustForRation (){ // if hikers eat well, they get healthier (and inverse)
        for (i = 0; i < party.hikers.length; i++){
            if (party.rations === 3) {
                party.hikers[i].health += 1;
            } else if (party.pace === 1) {
                party.hikers[i].health -= 1;
            } else {
                party.hikers[i].health;
            };
        };
    };

    function adjustForFood () { // if food falls to zero, hiker health will deteriorate fast.
        for (i = 0; i < party.hikers.length; i++){
            if (party.rations < 0) {
                party.hikers[i].health -= 20;
                console.log("decrease health bc of food shortage.") //not working
            }
        };
    };
    adjustForWeather();
    adjustForPace();
    adjustForRation();
    adjustForFood();
};

//My Main Function (loops through miles of game and updates/prints events)
//declare variables
var miles = 0;
var totalMiles = 0;
var days = 0;
var weather;

function walking () {  //would like to clean this up eventually
    if (miles <= camps[camps.length-1].distance){
        printWalkingText(miles)
        printCamp(miles);
        countDays(miles);
        getRandomWeatherByDay(miles);
        
        randomEvent(miles);
        printRed();
        stopAtStore();
        subtractFood();
        adjustHikerStats();
        printDistanceBox();
        printStatsBox();
        endMessage();
        miles++
    } else {
        clearInterval(mainInterval);
    }
};

//sets variables to use for printing in HTML
var weatherCount = document.getElementById('weather');
var nextCampCount = document.getElementById('nextCamp');
var logCount = document.getElementById('logCount');
var milesCount = document.getElementById('milesCount');
var daysCount = document.getElementById('daysCount');
var paceCount = document.getElementById('paceCount');
var rationCount = document.getElementById('rationCount');
var healthCount = document.getElementById('healthCount');
var remainingFoodCount = document.getElementById('rfCount');

function printRed () { //not working
    if (party.health <= 50){
        healthCount.innerText = "<div class='red'>Health: " + party.health() + "</div>"; //party.healthString
    } else if (party.food < (party.hikers.length * party.ration*3)) { // if group is running out of food, print in red
        console.log('hey this test')
        rationCount.innerText = "<div class='red'>Ration: " + party.rationString() + "</div>";
    } else {
    };
};

/*
function healthPrompts () {
    if party.hikers
}*/

//function for printing all informaiton that goes into stats box: pace, ration, health, remaining food
function printStatsBox () {
    function printPace () {
        paceCount.innerText = "Pace: " + party.paceString();
    };
    function printRation() {
        rationCount.innerText = "Ration: " + party.rationString();
    };
    function printHealth () {
        healthCount.innerText = "Health: " + party.health(); //party.healthString
    };
    function printRemainingFood() {
        remainingFoodCount.innerText = "Remaining Food: " + party.food + " lbs"; 
    };

printPace();
printRation();
printHealth();
printRemainingFood();
};

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

function getRandomWeatherByDay (miles){ //assuming day = 10miles
    if ((miles %10 === 0) && (miles !== 0)){
        getRandomWeather();
    };
};

//creates function that changes weather every day and writes result in HTML.
function getRandomWeather (){
        var num=Math.random();
        if(num < 0.5) weather = "Sunny";  //probability 0.5
        else if(num < 0.65) weather = "Rainy";  // probability 0.2
        else if(num < 0.8) weather = "Snowy"; //probability 0.1
        else if(num < 0.9) weather = "Heat Wave"; //probability 0.1
        else weather = "Thunderstorm";  //probability 0.1
        weatherCount.innerText = "Weather: " +weather;
};



//create countDay function, which sets 1 day = 10 miles, and prints when each day changes
function countDays () {
    if (miles %10 === 0){
        days++;
        daysCount.innerText = "Days on Trail: " +days;
    }
};


//function printMessages () //need to group together functions that display messages in 1) status box 2 )log box?


//create printWalk function, which prints "walking..." message when hiker is in between camps
function printWalkingText() {
    camps.forEach(function(camp) {
        if (miles === 1) {
            logCount.innerText = 'Walking...';
        }
        else if (miles === Math.floor(camp.distance +1)) {
            logCount.insertAdjacentHTML( "afterbegin",'<div class="log-font">Walking...</div><br>');
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
var camp1 = new Camp("Half Dome Junction", 12.3, 0);
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
var printEvent = document.getElementById('print-event');
function randomEvent () {
    if ((Math.random() > 0.8) && (miles !== 0)) { //20% probabilty that an event happens each mile (can change this).
        var newEvent = events[Math.floor(Math.random()*events.length)];
        if (newEvent.stopHike){
            stopWalking();
        }
        
        newEvent.changeStats();
    } else {
        printEvent.innerHTML = ' ';
    };
};

//set up object constructor for event information: type (stat-change), notification (positive or negative), value (-/+ value to change in stats), stat (which stat will be changed), text (message to show);

function Event (type, notification, value, stat, text, stopHike) { //setting up object constructor
    this.type = type;
    this.notification = notification;
    this.value = value;
    this.stat = stat;
    this.text = text;
    this.stopHike = stopHike;

    Event.prototype.changeStats = function() {
        if (this.type === 'stat-change') {
            var randomHiker = party.hikers[Math.floor(Math.random() * party.hikers.length)]
            var text = randomHiker.name + this.text;
            if (this.stat === 'health'){
                randomHiker.health += this.value;
            } else {
                party[this.stat] += this.value;
            }
        } else {
            var text = this.text; // if event in not a stat change, this line makes sure text is defined.
        };
        
        printEvent.innerHTML = '<div class = "center-text">'+ text + '</div><br>'
    };
};

// enter information for each event
var event1 = new Event('stat-change', 'positive', (party.rations * party.hikers.length), 'food', " found wild berries." );
var event2 = new Event('stat-change', 'positive', (party.rations * party.hikers.length), 'food', " found wild mushrooms." );
var event3 = new Event('stat-change', 'negative', -5, 'health', " sprained an ankle." );
var event4 = new Event('stat-change', 'negative', -20, 'health', " was attacked by a bear!", true);
var event5 = new Event('stat-change', 'negative', -5, 'food', "'s food spoiled.");
var event6 = new Event('stat-change', 'negative', -10, 'health', " drank bad water.");
var event7 = new Event('stat-change', 'negative', -10, 'health', " is dehydrated.");
var event8 = new Event('stat-change', 'negative', -15, 'health', " was bitten by a snake!");
var event9 = new Event('stat-change', 'negative', -15, 'health', " drank downstream from camp and got E. Coli!");
var event10 = new Event('stat-change', 'negative', (-party.rations * party.hikers.length), 'food', " fell in a river and lost a entire day's food ration!");
var event11 = new Event('stat-change', 'negative', -10, 'health', " is exhausted from walking.");

// put each event into an array, called events
var events = [];
events.push(event1, event2, event3, event4, event5, event6, event7, event8, event9, event10, event11);

/* Need to figure out how to incorporate these events
//Event happens, prompt: would you like to use first aid kit? yes -5 health, no -10health.
var event= new Event ('stat-change', 'negative', -1, 'first-aid', "'s backpack broke and a first aid kit was lost!");
var event= new Event ('stat-change', 'negative', -party.hikers.length, 'clothing', " forgot to put on the campfire. Your group lost " +party.hikers.length+ " items of clothing!");
var event= new Event ('stat-change', 'negative', 1, 'clothing', "A fellow backpacker gave you extra set of clothing.");

//rest event (stop clock AND stat change)
var event = newEvent('stat-change', 'negative', (2 * party.hikers.length), "food", "Trail impassable. Rest 2 days.");
var event = newEvent('stat-change', 'negative', (-party.hikers.length), "food", "You took the wrong trail. Lost one day.");
var event = newEvent('stat-change', 'negative', (-party.hikers.length), "food", " got lost. Lost 1 day.");
*/


var mainInterval;
function startWalking(){
    $('.status-info').hide();
    $('.buy-info').hide();
    $('.pace-info').hide();
    $('.map-info').hide();
    $('.rations-info').hide();
    $('.map-info').show();
    mainInterval = setInterval(walking, 200);
    statusBox.innerHTML = "Status: Walking";
};

function stopWalking(){
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
            printEvent.innerHTML = "You have reached a camp with a store.";
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
    party.food -= (2* party.hikers.length);
    days += 1
    for (i = 0; i < party.hikers.length; i++){
        party.hikers[i].health += 100;
    };
    getRandomWeather(); //update and print weather also (need to figure out how to deal with days)
    remainingFoodCount.innerText = "Remaining Food: " + party.food + " lbs";
    daysCount.innerText = "Days on Trail: " +days;
    healthCount.innerText = "Health: " + party.health(); //party.healthString
};

// making buttons work;
var continueButton = document.getElementById('continue-btn');
continueButton.onclick = startWalking;

var pauseButton = document.getElementById('pause-btn');
pauseButton.onclick = stopWalking;

var statusBox = document.getElementById('status-box');

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
};

var statusInfo = document.getElementById('status-info');
statusInfo.innerHTML = "<div class= 'col-md-6'><br><b>Supplies:</b><br>Money: $"+party.money+"<br>Food (lbs): "+party.food+"<br>First Aid Kits: "+party.aid+"<br></div><div class= 'col-md-6'><br><b>Current Health:</b><br>"+party.hikers[0].name+": "+party.hikers[0].health+"<br></div>";

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
//end rations box


var buyButton = document.getElementById('buy-btn');
buyButton.onclick = buyButtonEvents;

$('.buy-info').hide();
function buyButtonEvents () {
    stopWalking();
    $('.rations-info').hide();
    $('.status-info').hide();
    $('.map-info').hide();
    $('.pace-info').hide();
    $('.buy-info').show();
};

var buyInfo = document.getElementById('buy-info');
buyInfo.innerHTML = "<div class = 'col-md-9'><br><b>Store:</b> <br> <button id= 'buy-food-btn' type='button' class='btn-default btn-sm'>Buy</button>  10 lbs of food: $" +priceFood+ " <br><button id= 'buy-aid-btn' type='button' class='btn-default btn-sm'>Buy</button>  1 First Aid Kit: $" +priceAid+"</div><div class ='col-md-3' right-align'><br><b>Money: $"+party.money+"<b><div>"

var buyFood = document.getElementById('buy-food-btn');
buyFood.onclick = buyFoodEvents;

function buyFoodEvents (){
    if (party.money >= priceFood) {
        printEvent.innerHTML = ' ';
        party.food += 10;
        party.money -= priceFood;
        printStatsBox(); 
    } else {
        printEvent.innerHTML = "<div class = 'center-text'>You don't have enough money for this item.</div><br>"
    }
};

var buyAid = document.getElementById('buy-aid-btn');
buyAid.onclick = buyAidEvents;

function buyAidEvents (){
    if (party.money >= priceAid) { 
        printEvent.innerHTML = ' ';
        party.aid += 1;
        party.money -= priceAid;
        //print price
    } else {
        printEvent.innerHTML = "<div class = 'center-text'>You don't have enough money for this item.</div><br>"
    }
};


// if @ mile X, stop game and print "You have reached a store. Click buy to purchase supplies."
// if @ mile X, buyButton.removeClass('disabled')
//buyButton.addClass('')

//start pace buttons box
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
    party.pace = 1;
    printStatsBox();
};

function normalEvent (){
    party.pace = 2;
    printStatsBox();
};

function fastEvent (){
    party.pace = 3;
    printStatsBox();
};
//end pace buttons box


function endMessage () { 
    if (miles >= Math.floor(camps[camps.length-1].distance)) {
        printEvent.innerHTML = "<div class = 'center-text'>Congratulations! You have survived the John Muir Trail!</div><br>";
        $('.status-info').show();
        $('.map-info').hide();
    };
};

