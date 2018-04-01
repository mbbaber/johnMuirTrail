//Set up hiker stats (will be updated each mile of play, each day of play, and during events)
function Party(food, money, pace, rations, hikers){
    this.food = food;
    this.money = money;
    this.pace = pace;
    this.rations = rations;
    this.hikers = hikers;

    Party.prototype.health = function () {
        var totalHealth = 0;
        for (i = 0; i < this.hikers.length; i++){
            totalHealth += this.hikers[i].health;
        };
        return totalHealth / this.hikers.length;
    }

    Party.prototype.paceString = function () {
        if (this.pace === 1) {
            return "Slow"
        }else if (this.pace === 2) {
            return "Normal"
        } else if (this.pace === 3) {
            return "Fast"
        } else {
            return "Cannot determine"
        }
    }

    Party.prototype.rationString = function () {
        if (this.rations === 3) {
            return "Big Meals"
        }else if (this.rations === 2) {
            return "Normal Meals"
        } else if (this.rations === 1) {
            return "Small Meals"
        } else {
            return "Cannot determine"
        }
    }

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
        }
    }
};

function Hiker(name, health) {
    this.name = name;
    this.health = health;
}

var hiker1 = new Hiker("Maggie", 100);
var hiker2 = new Hiker("Louis", 100);
var hiker3 = new Hiker("Hiker3", 100);
var hiker4 = new Hiker("Hiker3", 100);
var hiker5 = new Hiker("Hiker3", 100);

var party = new Party(50, 300, 2, 3,[hiker1, hiker2, hiker3, hiker4, hiker5])


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

function adjustHikerStats () {
    function adjustForWeather (){
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
    function adjustForPace (){
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

    function adjustForRation (){
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
    adjustForWeather();
    adjustForPace();
    adjustForRation();
};

//My Main Function (loops through miles of game and updates/prints events)
//declare variables
var miles = 0;
var totalMiles = 0;
var days = 0;
var weather;

function walking () {  
    if (miles <= camps[camps.length-1].distance){
        printMilesText();
        printWalkingText(miles)
        printCamp(miles);
        countDays(miles);
        printNextCamp(miles);
        getRandomWeather(miles);
        
        randomEvent(miles);

        subtractFood();
        adjustHikerStats();
        printStatsBox();
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
printPace();
printRation();
printHealth();
};

//creates getRandomWeather, which changes weather every day and writes result in HTML.
function getRandomWeather (){
    if ((miles %10 === 0) && (miles !== 0)){
        var num=Math.random();
        if(num < 0.5) weather = "Sunny";  //probability 0.5
        else if(num < 0.65) weather = "Rainy";  // probability 0.2
        else if(num < 0.8) weather = "Snowy"; //probability 0.1
        else if(num < 0.9) weather = "Heat Wave"; //probability 0.1
        else weather = "Thunderstorm";  //probability 0.1
        weatherCount.innerText = "Weather: " +weather;
        console.log(weather);
    };
};

//create printNextCamp function, which calculates and writes how many miles the hiker has until reaching the next camp.
function printNextCamp () {
    for (var i = 0; i < camps.length; i++){ 
        var camp = camps[i];
        if (miles <= camp.distance) {
            var milesNextCamp = camp.distance - miles;
            nextCampCount.innerText = "Miles to Next Camp: " +milesNextCamp;
            break;
        }
    };
};

//create countDay function, which sets 1 day = 10 miles, and prints when each day changes
function countDays () {
    if (miles %10 === 0){
        days++;
        daysCount.innerText = "Days on Trail: " +days;
    }
};

function printMilesText() {
    milesCount.innerText = "Total miles traveled: " +miles;
};

//create printWalk function, which prints "walking..." message when hiker is in between camps
function printWalkingText() {
    camps.forEach(function(camp) {
        if (miles === 1) {
            logCount.innerText = 'Walking...';
        }
        else if (miles === camp.distance +1) {
            logCount.insertAdjacentHTML( "afterbegin",'<div class="log-font">Walking...</div><br>');
        }  
    });
};

// create printCamp function, which prints message when hiker has arrived at a camp.
function printCamp (miles){
    camps.forEach(function(camp){
        if (miles === camp.distance) {
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
var camp1  = new Camp("Half Dome Junction", 5, 0);
var camp2  = new Camp("Sunrise Camp", 11, 0);
var camp3  = new Camp("Tuolume Meadows", 14, 0);
var camp4  = new Camp("Upper Lyell Canyon", 20, 0);
var camp5  = new Camp("Thousand Island Lake", 24, 0);
var camp6  = new Camp("Devil’s Postpile", 31, 0);
var camp7  = new Camp("Deer Creek", 35, 0);
var camp8  = new Camp("Tully Hole", 40, 0);

// put each camp into an array, called camps
var camps =[];
camps.push(camp1, camp2, camp3, camp4, camp5, camp6, camp7, camp8);


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
var event1 = new Event('stat-change', 'positive', (1 * party.hikers.length), 'food', " found wild berries." );
var event2 = new Event('stat-change', 'positive', (2 * party.hikers.length), 'food', " found wild mushrooms." );
var event3 = new Event('stat-change', 'negative', -5, 'health', " sprained an ankle." );
var event4 = new Event('stat-change', 'negative', -20, 'health', " was attacked by a bear!", true);
var event5 = new Event('stat-change', 'negative', -5, 'food', "'s food spoiled.");
var event6 = new Event('stat-change', 'negative', -10, 'health', " drank bad water.");
var event7 = new Event('stat-change', 'negative', -10, 'health', " is dehydrated.");
var event8 = new Event('stat-change', 'negative', -15, 'health', " was bitten by a snake!");
var event9 = new Event('stat-change', 'negative', -15, 'health', " drank downstream from camp and got E. Coli!");
var event10 = new Event('stat-change', 'negative', (-2 * party.hikers.length), 'food', " fell in a river and lost a entire day's food ration!");
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



/*


var constants = {};
constants.weightPerPerson = 50;
constants.foodWeight = 1;
constants.gameSpeed = 1; // 1 mile per second?
constants.finalDistance = 200; //distance of entire trail
eventProbibility? 

*/
var mainInterval;
function startWalking(){
    mainInterval = setInterval(walking, 500);
    statusBox.innerHTML = "Status: Walking";
}
function stopWalking(){
    clearInterval(mainInterval);
    statusBox.innerHTML = "Status: Stopped";
}

function restOneDay() {
    clearInterval(mainInterval);
    party.food -= (2* party.hikers.length);
    days += 1
    //print the day
    //increase health and other stuff
    printEvent.innerHTML = '<div class = "center-text">You are resting.</div><br>'
    statusBox.innerHTML = "Status: Resting";
    window.setTimeout(function() {return true;}, 30000); //need to fix the length of this
    startWalking();
}

var continueButton = document.getElementById('continue-btn');
continueButton.onclick = startWalking;

var pauseButton = document.getElementById('pause-btn');
pauseButton.onclick = stopWalking; //Now you need to create a pause button

var statusBox = document.getElementById('status-box');

var restButton = document.getElementById('rest-btn');
restButton.onclick = restOneDay;

