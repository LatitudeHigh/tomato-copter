var DELAY = 40;
var SPEED = 5;
var MAX_DY = 12;

var OBSTACLE_WIDTH = 40;
var OBSTACLE_HEIGHT = 200;

var TERRAIN_WIDTH = 10;
var MIN_TERRAIN_HEIGHT = 20;
var MAX_TERRAIN_HEIGHT = 50;

var POINTS_PER_ROUND = 5;

var DUST_RADIUS = 3;
var DUST_BUFFER = 10;

var NUM_OBSTACLES = 3;

var copter;
var background;
var powerup;
var dy = 0;
var clicking = false;

var points = 0;
var score;	

var obstacles = [];
var top_terrain = [];
var bottom_terrain = [];
var dust = [];

var powerupinterval;

var answeredCorrectly = false;
var homeScreen = true;





function start() {
    displayInstructions();
    mouseClickMethod(startGame);
}

function startGame() {
  if(homeScreen){
    powerupinterval = Randomizer.nextInt(3, 4);
    setup();
    setTimer(game, DELAY);
    keyDownMethod(onMouseDown);
    keyUpMethod(onMouseUp);
    var theSong = new Audio("https://codehs.com/uploads/95b6ddf3cd432a9cd1b022398263ab78");
    theSong.play()
    theSong.loop = true;
    homeScreen = false;
  }
}

function setup() {
	background = new WebImage("https://codehs.com/uploads/580b879b31f5914dd33cf685163407c2");
	background.setPosition(0, 0);
	background.setSize(getWidth(), getHeight());
	add(background);
    
	copter = new WebImage("https://codehs.com/uploads/bcdc97426158c4e945c9ed0acdb3b38d");
	copter.setSize(50, 25);
	copter.setPosition(getWidth()/3, getHeight()/2);
	copter.setColor(Color.green);
    
	add(copter);
	
	addObstacles();
	addTerrain();
	// This is the score
	score = new Text("0");
	score.setColor(Color.red);
	score.setPosition(10, 30);
	add(score);
}

function updateScore() {
	points += POINTS_PER_ROUND;
	score.setText(points);
}


function game() {
	updateScore();
	if (hitWall()) {
		lose();
		return;
	}
	var collider = getCollider();
	if (collider != null) { 
		if (collider != copter) {
      if(collider.getColor() == Color.GREEN) {
  			lose();
		  	return;
      } else if (collider.getColor() == Color.RED) {
        // do what yozzu want to do for a red block
        var firstnum = Randomizer.nextInt(0, 30);
        var secondnum = Randomizer.nextInt(0, 30);
        guess = parseInt(prompt("What is " + firstnum + " x " + secondnum + "?"));
        var answer = firstnum * secondnum;
        if (guess == answer) {
        //This gets rid of the collider
        remove(collider);
        }
      } else if (collider.getColor() == Color.BLUE) {
        prompt(parseInt("Ask math question here"))
        SPEED -= 1;
        remove(collider)
      }
      clicking = false;
		}
	}
	if (clicking) {
		dy -= 1;
		if (dy < -MAX_DY) {
			dy = -MAX_DY;
		}
	} else {
		dy += 1;
		if (dy > MAX_DY) {
			dy = MAX_DY;
		}
	}
	copter.move(0, dy);
	moveObstacles();
	moveTerrain();
	moveDust();
	addDust();
}

function onMouseDown(e) {
  if (e.keyCode == Keyboard.UP) {
        clicking = true;
    }
  
}

function onMouseUp(e) {
  if (e.keyCode == Keyboard.UP) {
        clicking = false;
    }

}

function addObstacles() {
	for (var i = 0; i < NUM_OBSTACLES; i++) {
		var obstacle = new Rectangle(OBSTACLE_WIDTH, OBSTACLE_HEIGHT);
		obstacle.setColor(Color.green);
		obstacle.setPosition(getWidth() + i * (getWidth()/NUM_OBSTACLES),
		Randomizer.nextInt(0, getHeight() - OBSTACLE_HEIGHT));
		obstacles.push(obstacle);
		add(obstacle);
	}
}

function moveObstacles() {
	for (var i=0; i < obstacles.length; i++) {
		var obstacle = obstacles[i];
		obstacle.move(-SPEED, 0);
		if(obstacle.getX() < 0) {
      powerupinterval -= 1;
      if(powerupinterval == 0){
        obstacle.setColor(Color.red);
        powerupinterval = Randomizer.nextInt(3,4);
      } else {
        obstacle.setColor(Color.green);
      }
      obstacle.setPosition(
        getWidth(),
        Randomizer.nextInt(0, getHeight() - OBSTACLE_HEIGHT));
      add(obstacle);
		}
	}
}


function hitWall() {
	var hit_top = copter.getY() < 0;
	var hit_bottom = copter.getY() + copter.getHeight() > getHeight();
	return hit_top || hit_bottom;
}


function lose() {
	stopTimer(game);
	var text = new Text("Game Over!");
	text.setColor(Color.black);
	text.setPosition(getWidth()/2 - text.getWidth()/2,
					 getHeight()/2);
	add(text);

  var textTwo = new Text("Retry");
  textTwo.setColor(Color.black)
  var rect = new Rectangle(100,50);
    retry.setPosition((getWidth()-100)/2,(getHeight()/2)+10);
    retry.setColor(Color.red);
  add(retry)
}




function getCollider() {
	var topLeft = getElementAt(copter.getX()-1, copter.getY()-1);
	if (topLeft != null && topLeft != background) {
		return topLeft;
	}
	
	var topRight = getElementAt(copter.getX() + copter.getWidth() + 1,
								copter.getY() - 1);
	if (topRight != null && topRight != background) {
		return topRight;
	}
	
	var bottomLeft = getElementAt(copter.getX()-1, 
								  copter.getY() + copter.getHeight() + 1);
	if (bottomLeft != null && bottomLeft != background) {
		return bottomLeft;
	}
	
	var bottomRight = getElementAt(copter.getX() + copter.getWidth() + 1,
									copter.getY() + copter.getHeight() + 1);
	if (bottomRight != null && bottomRight != background) {
		return bottomRight; 
	}
	
	return null;
}
                                                                                                                                                                      

function addTerrain() {
	for (var i=0; i <= getWidth() / TERRAIN_WIDTH; i++) {
		var height = Randomizer.nextInt(MIN_TERRAIN_HEIGHT, MAX_TERRAIN_HEIGHT);
		var terrain = new Rectangle(TERRAIN_WIDTH, height);
		terrain.setPosition(TERRAIN_WIDTH * i, 0);
		terrain.setColor(Color.green);
		top_terrain.push(terrain);
		add(terrain);
		
		height = Randomizer.nextInt(MIN_TERRAIN_HEIGHT, MAX_TERRAIN_HEIGHT);
		var bottomTerrain = new Rectangle(TERRAIN_WIDTH, height);
		bottomTerrain.setPosition(TERRAIN_WIDTH * i, 
								  getHeight() - bottomTerrain.getHeight());
		bottomTerrain.setColor(Color.green);
		bottom_terrain.push(bottomTerrain);
		add(bottomTerrain);
	}
}


function moveTerrain() {
	for (var i=0; i < top_terrain.length; i++) {
		var obj = top_terrain[i];
		obj.move(-SPEED, 0);
		if (obj.getX() < -obj.getWidth()) {
			obj.setPosition(getWidth(), 0);
		}
	}
	
	for (var i=0; i < bottom_terrain.length; i++) {
		var obj = bottom_terrain[i];
		obj.move(-SPEED, 0);
		if (obj.getX() < -obj.getWidth()) {
			obj.setPosition(getWidth(), getHeight() - obj.getHeight());
		}
	}
}

function addDust() {
	var d = new Circle(DUST_RADIUS);
	d.setColor("#cccccc");
	d.setPosition(copter.getX() - d.getWidth(),
				  copter.getY() + DUST_BUFFER);
	dust.push(d);
	add(d);
}


function moveDust() {
	for (var i=0; i < dust.length; i++) {
		var d = dust[i];
		d.move(-SPEED, 0);
		d.setRadius(d.getRadius() - 0.1);
		if(d.getX() < 0) {
			remove(d);
			dust.remove(i);
			i--;
		}
	
  }
}
function displayInstructions(){
  var backg = new WebImage("https://codehs.com/uploads/14cdc7093dadc5decee3b3a69d9f0ff1");
  backg.setSize(getWidth(), getHeight());
  backg.setPosition(0,0);
  add(backg);
  
  var rect = new Rectangle(getWidth(), 45);
  rect.setPosition(0,220);
  rect.setColor(Color.BLACK);
  add(rect);
  
  var instructions = new Text ("Press up arrow to make tomato avoid obstacles!");
  instructions.setColor(Color.WHITE);
  instructions.setPosition(
    (getWidth() - instructions.getWidth())/2, getHeight()/2
  );
  add(instructions);
}
