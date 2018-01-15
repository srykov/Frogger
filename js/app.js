// Enemies our player must avoid
var Enemy = function(x = 0, y = 0, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    this.x = x;
    this.y = y;
    this.speed = speed;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(column = 2, row = 5){
    this.sprite = 'images/char-boy.png';

    this.column = column;
    this.row = row;

    this.x = column * 101;
    this.y = (row * 83) - 10;
};

Player.prototype.update = function(dt){
    this.x = this.column * 101;
    this.y = (this.row * 83) - 10;
}

Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.handleInput = function(action){
    console.log(action);
    if(action === 'up' && this.row > 0){
        this.row--;
    } else if(action === 'down' && this.row < 5){
        this.row++;
    } else if(action ==='left' && this.column > 0){
        this.column--;
    } else if(action === 'right' && this.column < 4){
        this.column++;
    }
    console.log('x=' + this.x + ' y=' + this.y);
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
const numEnemies = 5;
const allEnemies = [];
for (let i = 0; i < numEnemies; i++){
    const enemy = new Enemy();
    allEnemies.push(enemy);
}

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
        const keyValue = allowedKeys.get(e.keyCode);
        e.preventDefault();
        player.handleInput(keyValue);
    }

});
