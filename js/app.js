/*******************************************
 * Enemy Class: represents the enemies that
 * our player must avoid!
 ******************************************/
var Enemy = function(startRow = 0, game) {
    startColumn = getRandomInt(1,3);//between 1 & 3 (stone rows)
    startRow = startRow;
    this.x = startColumn * 101;
    this.y = (startRow * 83) - 10;
    this.sprite = 'images/enemy-bug.png';
    this.speed = getRandomInt(4, 7);
    this.game = game;
};

//Returns the row that this enemy is currently occupying
//(should only ever be one row)
Enemy.prototype.row = function(){
    return Math.floor((this.y + 10)/83);
};

// Update the enemy's position
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    //this enemy is off the screen, send him back to the start
    if(this.x >= 500){
        this.x = -5;
    } //player collided with this enemy - reset the game
    else if(this.game.checkCollision(this)){
        this.game.reset();
    } //otherwise just keep the enemy moving along
    else{
        // multiply any movement by the dt parameter which will
        // ensure the game runs at the same speed for all computers
        this.x = this.x + (this.speed*dt);
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/*******************************************
 * Treasure Class
 * Represents the hidden treasures!
 ******************************************/
var Treasure = function(type = 'heart'){
    switch(type.toLowerCase()){
        case 'key':
            this.sprite = 'images/Key.png';
        break;
        case 'star':
            this.sprite = 'images/Star.png';
        break;
        default:
            this.sprite = 'images/Heart.png';
    }

    this.column = getRandomInt(0,5);//between 0 & 4
    this.row = getRandomInt(1,6); //between 1 & 5
    this.points = 1;
    this.awarded = false;
    this.xPosition = function(){
        return this.column * 101;
    }
    this.yPosition = function(){
        return (this.row * 83) - 10;
    }
};


Treasure.prototype.render =  function(){
    if(this.awarded === false){
        ctx.drawImage(Resources.get(this.sprite), this.xPosition(), this.yPosition());
    }
};

/*******************************************
 * Player Class
 * Represents the Hero of Our Game!
 ******************************************/
var Player = function(game){
    this.sprite = 'images/char-princess-girl.png';

    this.startColumn = getRandomInt(0,5); //between 0 & 4
    this.startRow = getRandomInt(4,6); //between 4 & 5 (the grass rows)
    this.column = this.startColumn;
    this.row = this.startRow;
    this.xPosition = function(){
        return this.column * 101;
    };
    this.yPosition = function(){
        return (this.row * 83) - 10;
    };
    this.points = 0;
    this.game = game;
};

//update the Player's sprite, after the user chooses a character
Player.prototype.updateSprite = function(characterName){
    switch(characterName){
        case 'jimmy':
            this.sprite =  'images/char-boy.png';
        break;
        case 'jane':
            this.sprite =  'images/char-princess-girl.png';
        break;
        case 'sabrina':
            this.sprite =  'images/char-cat-girl.png';
        break;
    }
};

//check if the player's new position earns any points
Player.prototype.update = function(dt){

    if(this.points >= 4){
        const modalDiv = document.getElementById('winner-modal');
        modalDiv.style.display = 'block';
    }

    for(treasure of this.game.allTreasures){
        if(this.row === treasure.row && this.column === treasure.column && treasure.awarded === false){
            this.points = this.points + treasure.points;
            treasure.awarded = true;
        }
    }

    //if the player reaches the water, give them a point and move them back
    //to the starting position
    if(this.row === 0){
        this.points++;
        this.resetPosition();
    }

    const pointsSpan = document.querySelector('.points');
    pointsSpan.textContent = this.points > 1? this.points + " points" : this.points + " point";
};

//user the player's  x/y coordinates to render the
// player in the correct position on the canvas
Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.xPosition(), this.yPosition());
};

//move the player back to the start position
Player.prototype.resetPosition = function(){
    this.column = this.startColumn;
    this.row = this.startRow;
    this.update();
    this.render();
};

//have the player move according to user input
Player.prototype.handleInput = function(action){

    const topRow = 0;
    const bottomRow = 5;
    const firstColumn = 0;
    const lastColumn = 4;
    if(action === 'up' && this.row > topRow){
        this.row--;
    } else if(action === 'down' && this.row < bottomRow){
        this.row++;
    } else if(action ==='left' && this.column > firstColumn){
        this.column--;
    } else if(action === 'right' && this.column < lastColumn){
        this.column++;
    }
};


/*******************************************
 * Game Class: represents the game
 ******************************************/
var Game = function(){
    this.allEnemies = [];
    this.allTreasures = [];
    this.initializeEnemies();
    this.initializeTreasures();
    this.player = new Player(this);
};

//reset the various parts of the game
Game.prototype.reset = function(){
    this.allEnemies = [];
    this.allTreasures = [];

    this.initializeEnemies();
    this.initializeTreasures();
    this.player = new Player(this);

};

//check whether the given enemy is occupying the same row/column as the player
Game.prototype.checkCollision = function(enemy){
    const widthOfEnemies = 85;
    debugger;
    if( (enemy.row() === this.player.row) &&
            (enemy.x < this.player.xPosition() + widthOfEnemies) &&
            (enemy.x + widthOfEnemies > this.player.xPosition())){
        return true;
    } else {
        return false;
    }
};

//create new enemies
Game.prototype.initializeEnemies = function(){
    const enemy1 = new Enemy(1,this);//row 1
    this.allEnemies.push(enemy1);
    const enemy2 = new Enemy(2,this); //row 2
    this.allEnemies.push(enemy2);
    const enemy3 = new Enemy(3,this); //row3
    this.allEnemies.push(enemy3);
};

//create new treasures
Game.prototype.initializeTreasures = function(){
    const heart = new Treasure('heart');
    this.allTreasures.push(heart);
    const star = new Treasure('star');
    this.allTreasures.push(star);
    const key = new Treasure('key');
    this.allTreasures.push(key);
};

const theGame = new Game();

//returns a random integer between the min and max values
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

//set up the click events on the init-modal
const initModalDiv = document.getElementById('init-modal');
initModalDiv.addEventListener('click', function(e) {
    const clickTarget = e.target;
    if(clickTarget.nodeName === 'IMG'){
        const characterDiv = clickTarget.parentElement;
        const charName = characterDiv.attributes.getNamedItem("data-key").value;
        theGame.player.updateSprite(charName);
        initModalDiv.style.display = 'none';
    }

    if(clickTarget.nodeName === 'SPAN' && clickTarget.classList.contains('close')){
        initModalDiv.style.display = 'none';
    }

});

//set up the click events on the winner-modal
const winnerModalDiv = document.getElementById('winner-modal');
winnerModalDiv.addEventListener('click', function(e) {

    const clickTarget = e.target;
    if((clickTarget.nodeName === 'SPAN' && clickTarget.classList.contains('close')) ||
        clickTarget.classList.contains('restart') ){
        winnerModalDiv.style.display = 'none';
        theGame.reset();
    }

});


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {

    const allowedKeys = new Map();
    allowedKeys.set(37, 'left');
    allowedKeys.set(38, 'up');
    allowedKeys.set(39, 'right');
    allowedKeys.set(40, 'down');

    if(allowedKeys.has(e.keyCode)){

        const scorePanel = document.querySelector('.score-panel');
        scorePanel.style.display = 'block';

        const keyValue = allowedKeys.get(e.keyCode);
        e.preventDefault();
        theGame.player.handleInput(keyValue);
    }

});
