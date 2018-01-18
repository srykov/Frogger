// Enemies our player must avoid
var Enemy = function(startColumn = 0, startRow = 0, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.speed = speed;

    this.x = startColumn * 101;
    this.y = (startRow * 83) - 10;
};

//Returns a set containing the columns that this enemy is currently
//occupying
Enemy.prototype.columns = function(){

    const columns = new Set();

    const widthOfColumn = 101;
    const widthOfEnemy = 101

    //add column for left side of enemy
    columns.add(Math.floor(this.x/widthOfColumn));
    //add column for right side of enemy
    columns.add(Math.floor((this.x + widthOfEnemy)/widthOfColumn));

    return columns;
}

//Returns the row that the enemy is currently occupying
Enemy.prototype.row = function(){
    return Math.floor((this.y + 10)/83);
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if(this.x >= 500){
        this.x = 0;
    } else if(this.checkCollision(player)) {
        player.loseAPoint();
        player.resetPosition();
    } else{
        this.x = this.x + (this.speed*dt);
    }
};

Enemy.prototype.checkCollision = function(){

    const columns = this.columns();
    if(this.row() === player.row && columns.has(player.column)) {
        return true;
    } else {
        return false;
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(column = 2, row = 5){
    this.sprite = 'images/char-princess-girl.png';

    this.column = column;
    this.row = row;
    this.points = 0;
};

Player.prototype.loseAPoint = function(){
    if(this.points > 0){
        this.points--;
        const pointsSpan = document.querySelector('.points');
        pointsSpan.textContent = this.points > 1? this.points + " points" : this.points + " point";
    }

}

Player.prototype.update = function(dt){
    if(this.row === 0){
        this.points++;
        const pointsSpan = document.querySelector('.points');
        pointsSpan.textContent = this.points > 1? this.points + " points" : this.points + " point";
        this.resetPosition();
    }
}

Player.prototype.render = function(){
    const xPosition = this.column * 101;
    const yPosition = (this.row * 83) - 10;
    ctx.drawImage(Resources.get(this.sprite), xPosition, yPosition);
}

Player.prototype.resetPosition = function(){
    this.column = 2;
    this.row = 5;
    this.render();
}

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

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

const allEnemies = [];

const enemy1 = new Enemy(0,1,40);
allEnemies.push(enemy1);

const enemy2 = new Enemy(-6,1,50);
allEnemies.push(enemy2);

const enemy3 = new Enemy(-1,2,100);
allEnemies.push(enemy3);

const enemy4 = new Enemy(-6,2,30);
//allEnemies.push(enemy4);

const enemy5 = new Enemy(0,3,60);
allEnemies.push(enemy5);

const player = new Player(2,5);


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
