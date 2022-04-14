/*
Assignment: Javascript Assignment
Filename: game.js
@author: KITSANTAS FOTIOS (17421808)
Date: 30/04/17
*/

/*Create a Javascript Object for a horse with 3 parameters: HTML ID, position x and y*/
function Horse(id, x, y) {
	this.element = document.getElementById(id);/*HTML element of the horse*/
	this.speed = Math.random() * 10 + 10; /*Initiate a random speed for each horse, the greater speed, the faster horse. The value is between 10 and 20*/
	this.originX = x;/*Original X position*/
	this.originY = y;/*Original Y position*/
	this.x = x; /*Current X*/
	this.y = y; /*Current Y*/
	this.number = parseInt(id.replace(/[\D]/g, '')); /*Number of horse, number will be 1 or 2 or 3 or 4*/
	this.lap = 0; //Current lap of the horse

	this.moveRight = function () {
		var horse = this;/*Assign horse to this object*/

		/*Use setTimeout to have the delay in moving the horse*/
		setTimeout(function () {
			//Move the horse to right 1vw
			horse.x++;
			horse.element.style.left = horse.x + 'vw';

			//Check if goes through the start line, if horse runs enough number of laps and has pass the start line then stop
			if (horse.lap == num_lap && horse.x > horse.originX + 6) {
				horse.arrive();
			} else {
				//Make decision to move Down or not
				//The width of the Down Road is 10wh, then the distance of each horse is 2.5vw (4 horses). The right position of the road is 82.5vw
				//Continue to move right if not reach the point to turn
				if (horse.x < 82.5 - horse.number * 2.5) {
					horse.moveRight();
				} else {
					//Change HTML class of horse to runDown
					horse.element.className = 'horse runDown';
					//Change the speed, will be random value from 10 to 20
					horse.speed = Math.random() * 10 + 10;
					horse.moveDown();
				}
			}

		}, 1000 / this.speed);
		/* 1000/this.speed is timeout time*/
	}

	/*Do the same for moveDown, moveLeft, moveUp*/
	this.moveDown = function () {
		var horse = this;
		setTimeout(function () {
			horse.y++;
			horse.element.style.top = horse.y + 'vh';
			if (horse.y < horse.originY + 65) {
				horse.moveDown();
			} else {
				horse.element.className = 'horse runLeft';
				horse.speed = Math.random() * 10 + 10;
				horse.moveLeft();
			}
		}, 1000 / this.speed)
	}
	this.moveLeft = function () {
		var horse = this;
		setTimeout(function () {
			horse.x--;
			horse.element.style.left = horse.x + 'vw';
			if (horse.x > 12.5 - horse.number * 2.5) {
				horse.moveLeft();
			} else {
				horse.element.className = 'horse runUp';
				horse.speed = Math.random() * 10 + 10;
				horse.moveUp();
			}
		}, 1000 / this.speed)
	}
	this.moveUp = function () {
		var horse = this;
		setTimeout(function () {
			horse.y--;
			horse.element.style.top = horse.y + 'vh';
			if (horse.y > horse.originY) {
				horse.speed = Math.random() * 10 + 10;
				horse.moveUp();
			} else {
				horse.element.className = 'horse runRight';
				//Nearly finish the lap
				horse.lap++;
				horse.moveRight();
			}
		}, 1000 / this.speed)
	}

	/*Trigger the horse by run*/
	this.run = function () {
		this.element.className = 'horse runRight';
		this.moveRight();
	}
	this.arrive = function () {
		//Stop the horse run by change class to standRight
		this.element.className = 'horse standRight';
		this.lap = 1;//Reset the lap

		/*Show the result*/
		var tds = document.querySelectorAll('#results .result');//Get all table cell to display the result
		//results.length is the current arrive position
		tds[results.length].className = 'result horse' + this.number;//The class of result look like: result horse1...

		//Push the horse number to results array, according the the results array, we know the order of race results
		results.push(this.number);

		//Win horse
		if (results.length == 1) {
			//If win horse is the bet horse, then add the fund
			if (this.number == bethorse) {
				document.getElementById("resultText").innerHTML = "YOU WON";
				funds += amount;
			} else {
				document.getElementById("resultText").innerHTML = "YOU LOST";
				funds -= amount;
			}
			document.getElementById('funds').innerText = funds;

		} else if (results.length == 4) {
			//All horse arrived, enable again the Start Button
		}
	}
}

var num_lap = 1, results = [], funds = 100, bethorse, amount;

//Start the function when the document loaded
document.addEventListener("DOMContentLoaded", function (event) {

	var horse1 = new Horse('horse1', 20, 4);
	var horse2 = new Horse('horse2', 20, 8);

	//Event listener to the Start button
	document.getElementById('start').onclick = function () {
		amount = parseInt(document.getElementById('number').value);
		//	console.log(amount);
		num_lap = 1;
		bethorse = selectedAnimal();
		//	console.log(bethorse);

		if (funds < amount) {
			alert('Not enough funds.');
		}
		else if (num_lap <= 0) {
			alert('Number of lap must be greater than 1.');
		} else {

			/*Started the game*/
			this.disabled = true;/*Disable the start button*/
			var tds = document.querySelectorAll('#results .result');//Get all cells of result table.
			for (var i = 0; i < tds.length; i++) {
				tds[i].className = 'result';//Reset the result.
			}

			document.getElementById('funds').innerText = funds;
			results = [];//Results array is to save the horse numbers when the race is finished.
			horse1.run();
			horse2.run();
		}
	}
});

// Input button function

function increaseValue() {
	var value = parseInt(document.getElementById('number').value, 10);
	value = isNaN(value) ? 0 : value;
	value++;
	document.getElementById('number').value = value;
}

function decreaseValue() {
	var value = parseInt(document.getElementById('number').value, 10);
	value = isNaN(value) ? 0 : value;
	value < 1 ? value = 1 : '';
	value--;
	document.getElementById('number').value = value;
}


// Timer function
function startTimer(duration, display) {
	var timer = duration, minutes, seconds;
	setInterval(function () {
		minutes = parseInt(timer / 60, 10);
		seconds = parseInt(timer % 60, 10);

		minutes = minutes < 10 ? "0" + minutes : minutes;
		seconds = seconds < 10 ? "0" + seconds : seconds;

		display.textContent = minutes + ":" + seconds;

		if (--timer < 0) {
			//when countdown time reaches 00 display property
			//will be changed to none for 15 seconds.
			document.getElementById('countdownTimer').innerHTML = "Running";
			//Trigerring the start button.
			document.getElementById('start').click();
			//This async function will check the winner. Till then
			// the innerHtml will be Running
			timer = duration;
		}
	}, 1000);
}

window.onload = function () {
	var fiveMinutes = 60 * 5;
	var tenSeconds = 10;
	display = document.querySelector('#countdownTimer');
	startTimer(tenSeconds, display);
	animalSelect();
	window.resizeTo(
		window.screen.availWidth / 1.3,
		window.screen.availHeight / 1.3
	);
};

// This function will change the css property of selected button

async function animalSelect() {
	// Add active class to the current button (highlight it)
	var animalSelect = await document.getElementById("animalSelect");
	var btns = await animalSelect.getElementsByClassName("bn28");
	for (var i = 0; i < btns.length; i++) {
		btns[i].addEventListener("click", function () {
			var current = document.getElementsByClassName("active");
			current[0].className = current[0].className.replace(" active", "");
			this.className += " active";
		});
	}
}

function selectedAnimal() {
	//Checking the selected button from the player by looking
	//at the active class into the className

	let btns = document.getElementById('animalSelect');
	let CheckAnimal = btns.getElementsByClassName('bn28');

	for (let i = 0; i < CheckAnimal.length; i++) {

		if (CheckAnimal[i].classList.contains('active')) {

			if (CheckAnimal[i].classList[2] == "blue-btn") {
				return 2
			}
			else {
				return 1
			}
		}
	}
}

async function confirmBet() {
	// confirm button will first check the non-active button from
	// animalSelect then disabled it. It will also disabled confirm btn.
	document.getElementById('increase').setAttribute('style', 'pointer-events: none;');
	document.getElementById('decrease').setAttribute('style', 'pointer-events: none;');
	var animalSelect = await document.getElementById("animalSelect");
	var btns = await animalSelect.getElementsByClassName("bn28");
	for (var i = 0; i < btns.length; i++) {
		if (btns[i].classList.contains('active')) {
			var activeHorse = btns[i].innerText;
			if (btns[i].classList.contains('white-btn')) {
				document.getElementById('blue-btn').disabled = true;
				document.getElementById('confirm').disabled = true;
			}
			else {
				document.getElementById('white-btn').disabled = true;
				document.getElementById('confirm').disabled = true;
			}
		}
	}
	//Confirm button will change the text under Status.
	document.getElementById('status').innerHTML = activeHorse + " Confirmed";
}


