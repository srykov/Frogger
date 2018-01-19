/*******************************************
 * Entity Class: The base class that
 * represents the objects in the games.
 ******************************************/
class Entity{
    constructor(key){
        switch(key.toLowerCase()){
            case 'jimmy':
                this.sprite =  'images/char-boy.png';
            break;
            case 'jane':
                this.sprite =  'images/char-princess-girl.png';
            break;
            case 'sabrina':
                this.sprite =  'images/char-cat-girl.png';
            break;
            case 'bug':
                this.sprite = 'images/enemy-bug.png';
            break;
            case 'key':
                this.sprite = 'images/Key.png';
            break;
            case 'star':
                this.sprite = 'images/Star.png';
            break;
            case 'heart':
            default:
                this.sprite = 'images/Heart.png';
         }
     }
    xPosition(){
        return this.column * 101;
    }
    yPosition(){
        return (this.row * 83) - 10;
    }

    //draw the entity on the canvas
    render(){
        ctx.drawImage(Resources.get(this.sprite), this.xPosition(), this.yPosition());
    }

    //returns a random integer between the min and max values
    getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    }
}


/*******************************************
 * Enemy Class: The enemies that  our player
 * must avoid!
 ******************************************/
class Enemy extends Entity{
    constructor(startRow = 0, game) {
        super('bug');
        const startColumn = super.getRandomInt(1,3);//between 1 & 3 (stone rows)
        this.x = startColumn * 101;
        this.y = (startRow * 83) - 10;
        this.speed = super.getRandomInt(30, 60);
        this.game = game;
    }

    xPosition(){
        return this.x;
    }
    yPosition(){
        return this.y;
    }

    //Returns the row that this enemy is currently occupying
    //(should only ever be one row)
    row(){
        return Math.floor((this.y + 10)/83);
    }

    // Update the enemy's position
    // Parameter: dt, a time delta between ticks
    update(dt) {
        //this enemy has made it all the way across the screen, send him back to the start
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
    }
} //end Enemy definition


/*******************************************
 * Treasure Class
 * Represents the hidden treasures!
 ******************************************/
class Treasure extends Entity{
    constructor(type){
        super(type);
        this.column = super.getRandomInt(0,5);//between 0 & 4
        this.row = super.getRandomInt(1,6); //between 1 & 5
        this.points = 1;
        this.awarded = false;
    }

    render(){
        if(this.awarded === false){
            super.render();
        }
    }
} //end Treasure definition


/*******************************************
 * Player Class
 * Represents the Hero of Our Game!
 ******************************************/
class Player extends Entity{
    constructor(game){
        super('sabrina');
        this.startColumn = super.getRandomInt(0,5); //between 0 & 4
        this.startRow = super.getRandomInt(4,6); //between 4 & 5 (the grass rows)
        this.column = this.startColumn;
        this.row = this.startRow;
        this.points = 0;
        this.game = game;
    }

    //update the Player's sprite, after the user chooses a character
    updateSprite(characterName){
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

    //check if the player's new position earns any points
    update(dt){
        if(this.points >= 4){
            const modalDiv = document.getElementById('winner-modal');
            modalDiv.style.display = 'block';
        }
        for(let treasure of this.game.allTreasures){
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

    //move the player back to the start position
    resetPosition(){
        this.column = this.startColumn;
        this.row = this.startRow;
        this.update();
        this.render();
    }

    //have the player move according to user input
    handleInput(action){
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
    }
} //end Player Definition


/*******************************************
 * Game Class: represents the game itself
 ******************************************/
class Game {
    constructor(){
        this.allEnemies = [];
        this.allTreasures = [];
        this.initializeEnemies();
        this.initializeTreasures();
        this.player = new Player(this);
    }

    //reset the various parts of the game
    reset(){
        this.allEnemies = [];
        this.allTreasures = [];

        this.initializeEnemies();
        this.initializeTreasures();
        this.player = new Player(this);

    }

    //check whether the given enemy is occupying the same row/column as the player
    checkCollision(enemy){
        const widthOfEnemies = 100;
        const widthOfPlayers = 80;

        if( (enemy.row() === this.player.row) &&
                (enemy.x + widthOfEnemies > this.player.xPosition() + 15) &&
                (enemy.x < widthOfPlayers - 15 + this.player.xPosition()) ){
            return true;
        } else {
            return false;
        }
    }

    //create new enemies
    initializeEnemies(){
        const enemy1 = new Enemy(1,this);//row 1
        this.allEnemies.push(enemy1);
        const enemy2 = new Enemy(2,this); //row 2
        this.allEnemies.push(enemy2);
        const enemy3 = new Enemy(3,this); //row3
        this.allEnemies.push(enemy3);
    }

    //create new treasures
    initializeTreasures(){
        const heart = new Treasure('heart');
        this.allTreasures.push(heart);
        const star = new Treasure('star');
        this.allTreasures.push(star);
        const key = new Treasure('key');
        this.allTreasures.push(key);
    }
} //end Game definition


const theGame = new Game();



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
