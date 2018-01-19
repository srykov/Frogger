/*******************************************
 * Enemy Class: represents the enemies that
 * our player must avoid!
 ******************************************/
var Enemy = function(startColumn = 0, startRow = 0, speed) {
    this.sprite = 'images/enemy-bug.png';
    this.speed = speed;
    this.startColumn = startColumn;
    this.startRow = startRow;

    this.x = startColumn * 101;
    this.y = (startRow * 83) - 10;
};

//Returns a set containing the columns that this enemy is currently
//occupying (may be one or two columns)
Enemy.prototype.columns = function(){

    const columns = new Set();

    const widthOfColumn = 101;
    const widthOfEnemy = 101

    //add column for left side of enemy
    columns.add(Math.floor(this.x/widthOfColumn));
    //add column for right side of enemy
    columns.add(Math.floor((this.x + widthOfEnemy)/widthOfColumn));

    return columns;
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
    } //player collided with this enemy
    else if(this.checkCollision(player)) {
        player.loseAPoint();
        player.resetPosition();
    } //otherwise just keep the enemy moving along
    else{
        // multiply any movement by the dt parameter which will
        // ensure the game runs at the same speed for all computers
        this.x = this.x + (this.speed*dt);
    }
};

//check whether this enenmy is occupying the same row/column as the player
Enemy.prototype.checkCollision = function(){

    const columns = this.columns();
    if(this.row() === player.row && columns.has(player.column)) {
        return true;
    } else {
        return false;
    }
}

//move the enemy back to its starting position
Enemy.prototype.resetPosition = function(){
    this.column = this.startColumn;
    this.row = this.startRow;
    this.render();
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
};

Treasure.prototype.render =  function(){
    if(this.awarded === false){
        const xPosition = this.column * 101;
        const yPosition = (this.row * 83) - 10;
        ctx.drawImage(Resources.get(this.sprite), xPosition, yPosition);
    }
}

/*******************************************
 * Player Class
 * Represents the Hero of Our Game!
 ******************************************/
var Player = function(column = 2, row = 5){
    this.sprite = 'images/char-princess-girl.png';

    this.column = column;
    this.row = row;
    this.points = 0;
};

Player.prototype.updateCharacter = function(characterName){
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
}

//make the player lose a point
Player.prototype.loseAPoint = function(){
    if(this.points > 0){
        this.points--;
        //update score panel
        const pointsSpan = document.querySelector('.points');
        pointsSpan.textContent = this.points > 1? this.points + " points" : this.points + " point";
    }

}

//check if the player's new position earns any points
Player.prototype.update = function(dt){

    if(this.points >= 5){
        const modalDiv = document.getElementById('winner-modal');
        modalDiv.style.display = 'block';
    }

    for(treasure of allTreasures){
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
}



//translate the player's column/row into x/y coordinates
//and use that to render the player in the correct position
//on the canvas
Player.prototype.render = function(){
    const xPosition = this.column * 101;
    const yPosition = (this.row * 83) - 10;
    ctx.drawImage(Resources.get(this.sprite), xPosition, yPosition);
}

//move the player back to the start position
Player.prototype.reset = function(){
    this.resetPosition();
    this.points = 0;
    this.update();
    this.render();
}


//move the player back to the start position
Player.prototype.resetPosition = function(){
    this.column = 2;
    this.row = 5;
    this.update();
    this.render();
}

//have the player move according to user input
Player.prototype.handleInput = function(action){
    if(action === 'up' && this.row > 0){
        this.row--;
    } else if(action === 'down' && this.row < 5){
        this.row++;
    } else if(action ==='left' && this.column > 0){
        this.column--;
    } else if(action === 'right' && this.column < 4){
        this.column++;
    }
}


// Place all enemy objects in an array called allEnemies
const allEnemies = [];

const enemy1 = new Enemy(0,1,40);
allEnemies.push(enemy1);
const enemy2 = new Enemy(-6,1,50);
allEnemies.push(enemy2);
const enemy3 = new Enemy(-1,2,70);
allEnemies.push(enemy3);
const enemy4 = new Enemy(0,3,60);
allEnemies.push(enemy4);


const allTreasures = [];
const heart = new Treasure('heart');
allTreasures.push(heart);
const star = new Treasure('star');
allTreasures.push(star);
const key = new Treasure('key');
allTreasures.push(key);

// Place the player object in a variable called player
const player = new Player(2,5);

//returns a random integer between the min and max values
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}


const initModalDiv = document.getElementById('init-modal');
initModalDiv.addEventListener('click', function(e) {
    const clickTarget = e.target;
    if(clickTarget.nodeName === 'IMG'){
        const characterDiv = clickTarget.parentElement;
        const charName = characterDiv.attributes.getNamedItem("data-key").value;
        console.log(charName);
        player.updateCharacter(charName);
        initModalDiv.style.display = 'none';
    }

    if(clickTarget.nodeName === 'SPAN' && clickTarget.classList.contains('close')){
        initModalDiv.style.display = 'none';
    }

});

const winnerModalDiv = document.getElementById('winner-modal');
winnerModalDiv.addEventListener('click', function(e) {
    player.reset();
    const clickTarget = e.target;
    if(clickTarget.nodeName === 'SPAN' && clickTarget.classList.contains('close')){
        winnerModalDiv.style.display = 'none';
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
        player.handleInput(keyValue);
    }

});
