let x = 450 / 2;
let y = 450 / 2;
let rect_w = 15;
let rect_h = 15;
let food_x;
let food_y;
let score = 0;
let food_w = 15;
let food_h = 15;
let dir_x = null;
let dir_y = null;
let current_score = document.querySelector('.current-score');
let past_scores = document.querySelector('.past-scores');
let past = [];
let snake = [{ x: x, y: y, dir_x: dir_x, dir_y: dir_y }];
let coord;
let fm = 20;
let end = false;

function showModal(text, show) {
  if (show) {
    let body = document.getElementsByTagName('body')[0];
    let div = document.querySelector('.modal-start') || document.createElement('div')
    div.innerHTML = text || 'Press a key to start';
    div.style.display = 'block';
    div.className = 'modal-start';
    body.appendChild(div);
    return;
  }
  let modal = document.querySelector('.modal-start');
  modal.style.display = 'none';
}

function displayScores(score) {
  if (past.length > 4) {
    past.shift();
    console.log(past)
  }

  past_scores.innerHTML = '<b>Past scores (5 last ones)</b><br>';
  past.push(score);
  //past.sort().reverse();
  past.forEach((el, index) => past_scores.innerHTML += `Score: ${el}<br>`);
}

function endGame() {
  displayScores(score);
  score = 0;
  current_score.innerHTML = `<h3>Current: ${score}</h3>`;

  //array gets back to square one
  snake.splice(1, snake.length);
  coord = null;
  fm = 20;
  frameRate(fm);
  snake[0].x = x;
  snake[0].y = y;
  food_x = Math.floor(Math.random() * (((width - (food_w)) - food_w) / 15)) * 15 + food_w;
  food_y = Math.floor(Math.random() * (((height - (food_h)) - food_h) / 15)) * 15 + food_h;
}

function setup() {
  createCanvas(450, 450);
  frameRate(fm)
  food_x = Math.floor(Math.random() * (((width - (food_w)) - food_w) / 15)) * 15 + food_w;
  food_y = Math.floor(Math.random() * (((height - (food_h)) - food_h) / 15)) * 15 + food_h;
  showModal('', true);
}


function draw() {
	// head controls
	if (keyIsDown(RIGHT_ARROW) && coord !== 'left') {
		coord = 'right';
  } else if (keyIsDown(LEFT_ARROW) && coord !== 'right') {
		coord = 'left';
  } else if (keyIsDown(UP_ARROW) && coord !== 'down') {
		coord = 'up';
  } else if (keyIsDown(DOWN_ARROW) && coord !== 'up') {
		coord = 'down';
  }

  if (keyIsDown(RIGHT_ARROW) || keyIsDown(LEFT_ARROW) || keyIsDown(UP_ARROW) || keyIsDown(DOWN_ARROW)) {
    showModal('', false)
  }

  if (coord === 'right') {
  	snake[0].x = snake[0].x + rect_w;
  	snake[0].dir_x = snake[0].x - rect_w;
  	snake[0].dir_y = snake[0].y;
  } else if (coord === 'left') {
  	snake[0].x = snake[0].x - rect_w;
  	snake[0].dir_x = snake[0].x + rect_w;
  	snake[0].dir_y = snake[0].y;
  } else if (coord === 'up') {
  	snake[0].y = snake[0].y - rect_h;
  	snake[0].dir_y = snake[0].y + rect_h;
  	snake[0].dir_x = snake[0].x;
  } else if (coord === 'down') {
  	snake[0].y = snake[0].y + rect_h;
  	snake[0].dir_y = snake[0].y - rect_h;
  	snake[0].dir_x = snake[0].x;
  }

  // collisions with walls
  if (snake[0].x > width - (rect_w) || snake[0].x < 0 || snake[0].y < 0 || snake[0].y > height - (rect_h)) {
    endGame();
  }

  // collisions with food
  if ((snake[0].x > (food_x - rect_w) && snake[0].x < (food_x + food_w)) && (snake[0].y > (food_y - rect_h) && snake[0].y < (food_y + food_h))) {
  	score++;
  	current_score.innerHTML = `<h3>Current: ${score}</h3>`;
	  food_x = Math.floor(Math.random() * (((width - (food_w)) - food_w) / 15)) * 15 + food_w;
	  food_y = Math.floor(Math.random() * (((height - (food_h)) - food_h) / 15)) * 15 + food_h;
		snake.push({ x: x, y: y, dir_x: dir_x, dir_y: dir_y });

		// increase framerate by increment of 1 every 10pts
		if ((score % 10) == 0) {
			fm = fm + (score / 10)
			frameRate(fm)
		}
  }

	background(220);
	fill(255, 0, 0);
	rect(food_x, food_y, food_w, food_h);
	fill(255);
	noStroke()
	rect(snake[0].x, snake[0].y, rect_w, rect_h);

	for (let i = 1; i < snake.length; i++) {
		// tail controls
		if (coord === 'right') {
			snake[i].x = snake[i].x + rect_w;
			snake[i].dir_x = snake[i].x - rect_w;
			snake[i].dir_y = snake[i].y;
		} else if (coord === 'left') {
	  	snake[i].x = snake[i].x - rect_w;
	  	snake[i].dir_x = snake[i].x + rect_w;
	  	snake[i].dir_y = snake[i].y;
	  } else if (coord === 'up') {
	  	snake[i].y = snake[i].y - rect_h;
	  	snake[i].dir_y = snake[i].y + rect_h;
	  	snake[i].dir_x = snake[i].x;
	  } else if (coord === 'down') {
	  	snake[i].y = snake[i].y + rect_h;
	  	snake[i].dir_y = snake[i].y - rect_h;
	  	snake[i].dir_x = snake[i].x;
	  }

	  snake[i].x = snake[i-1].dir_x? snake[i-1].dir_x : snake[i-1].x;
		snake[i].y = snake[i-1].dir_y? snake[i-1].dir_y : snake[i-1].y;

		rect(snake[i].x, snake[i].y, rect_w, rect_h);

		// collision with tail
		if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
      endGame();
		}
	}
}
