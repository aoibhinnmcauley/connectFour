
//Connect 4 
//Created by Aoibhinn McAuley

//Class varibles 
var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite;
 

var gridImage = null;
var player = null;
var boardArray = new Array();
var maxRow = 7;
var maxCol = 6;
var playerRow = 0;
var lastPlacedSlotX = null;
var lastPlacedSlotY = null;
var gameOver = false;


var turns = {
    RTURN:0,
    YTURN:1
};

var gameOverText = null;
var turnText = null;
var countCheckers = 0;

//Styles the text displayed on screen
var TextDefualtStyle = {
    font : 'bold italic 32px Arial',
    fill : '#F7EDCA',
    stroke : '#4a1850',
    strokeThickness : 5,
    dropShadow : true,
    dropShadowColor : '#000000',
    dropShadowAngle : Math.PI / 6,
    dropShadowDistance : 6,
    wordWrap: true,
    wordWrapWidth: 520
};

//Styles the text displayed on screen
var TextYellowStyle = {
    font: 'bold italic 32px Arial',
    fill: '#ffff00',
    stroke: '#4a1850',
    strokeThickness: 5,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
};

//Styles the text displayed on screen
var TextRedStyle = {
    font: 'bold italic 32px Arial',
    fill: '#ff0000',
    stroke: '#4a1850',
    strokeThickness: 5,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: false,
};

//Create a Pixi stage, renderer and add the 
//renderer.view to the DOM
var stage = new Container(),
    renderer = autoDetectRenderer(256, 256);
renderer.backgroundColor = 0xb3b3cc;
document.body.appendChild(renderer.view);

//Load all the sprites
loader
  .add("sprites/spriteSheet.json")
  .load(setup);

function setup() {
    var id = PIXI.loader.resources["sprites/spriteSheet.json"].textures;
    //Create and place the grid sprite
    gridImage = new Sprite(id["4connectBG.png"]);
    gridImage.pivot.set(gridImage.width / 2, gridImage.height / 2);
    gridImage.position.set(screen.width / 2, screen.height / 2);
    //Create and place the checker that can be moved with the arrow keys
    player = new Sprite(id["checker.png"]);
    player.tint = 0xffff00;
    player.position.set(gridImage.position.x - gridImage.width / 2, 150);
    //Add sprites to the stage
    stage.addChild(gridImage);
    stage.addChild(player);
    //Create the 2D array of Slots
    boardArray = createGrid();
    displayText(); 
    //Render the stage
    renderer.render(stage); 
    //Start the game loop
    gameLoop();
}


function gameLoop() {

  //Loop this function at 60 frames per second
  requestAnimationFrame(gameLoop);
    
  //Render the stage to see the animation
  renderer.render(stage);
}

function displayText()
{
    //Header text
    headerText = new PIXI.Text('Welcome to connect four! Play using left, right and space! ', TextDefualtStyle);
    headerText.x = (screen.width / 2) - (gridImage.width / 2);
    headerText.y = 10;
    stage.addChild(headerText);

    //Display who's turn it currently is
    turnTextYellow = new PIXI.Text("Its yellow's turn!", TextYellowStyle);
    turnTextYellow.x = (screen.width / 2) - (gridImage.width / 2);
    turnTextYellow.y = 80;
    stage.addChild(turnTextYellow);

    turnTextRed = new PIXI.Text("Its red's turn!", TextRedStyle);
    turnTextRed.x = (screen.width / 2) - (gridImage.width / 2);
    turnTextRed.y = 80;
    turnTextRed.visible = false;
    stage.addChild(turnTextRed)

    //Game over text
    gameOverText = new PIXI.Text('Game over press ESC to replay!', TextDefualtStyle);
    gameOverText.position.set((screen.width / 2) - (gridImage.width / 2),120);
    gameOverText.visible = false;
    stage.addChild(gameOverText);

 
}

function updateTurnText(color)
{
    if (gameOver == false) {
        if (color == "red") {
            turnTextYellow.visible = false;
            turnTextRed.visible = true;
        }
        else {
            turnTextYellow.visible = true;
            turnTextRed.visible = false;
        }
    }
}

//Creates a 2D array of Slot objects to represent the grid.
function createGrid() {

    var id = PIXI.loader.resources["sprites/spriteSheet.json"].textures;

    for (let i = 0; i < maxRow; i++) {
        boardArray[i] = new Array();

        for (j = 0; j < maxCol; j++) {
            var s = new slot("null", null);
            s.sprite = new Sprite(id["checker.png"]);
            boardArray[i][j] = s;
            s.sprite.visible = false;
            s.sprite.position.set(70 * i, 70 * j);
            //Positon the elements of the array inside the background image.
            s.sprite.position.x += (gridImage.position.x - gridImage.width / 2);
            s.sprite.position.y += (gridImage.position.y - gridImage.height / 2);
            stage.addChild(s.sprite);
        }
    }

    return boardArray;
}
//Represents a single slot object in the grid
var slot = class {
    constructor(color, sprite) {
        this.color = color;
        this.sprite = sprite;
    }
}

//Detect key presses and keep the player's checker on screen.
document.onkeydown = checkKey;
function checkKey(e) {

    e = e || window.event;
    //Left arrow key
    if (e.keyCode == '37' && player.x >= (gridImage.x - gridImage.width / 2) + player.width) {
        player.x -= 70;
        playerRow--;
        if (playerRow < 0) {
            playerRow = 0;
        }
    }
    //Right arrow key
    else if (e.keyCode == '39' && player.x <= (gridImage.x + gridImage.width / 2) - player.height) {
        player.x += 70;
        playerRow++;
        if (playerRow > maxRow) {
            playerRow = maxRow;
        }
    }
    //Insert a new checker with the 'SPACE' key 
    if (e.keyCode == '32') {

        if (gameOver == false) {
            insertChecker();
        }

    }
    //Rest the game
    if (e.keyCode == '27')
    {
        if (gameOver == true) {
            gameOverText.visible = false;
            //Reset the player's checker
            player.position.set(gridImage.position.x - gridImage.width / 2, 150);
            player.visible = true;
            playerRow = 0;
            //Yellow goes first
            turns = 1;
            player.tint = 0xffff00;
            updateTurnText("yellow");
            //Empty grid
            for (let i = 0; i < maxRow; i++) {

                for (j = 0; j < maxCol; j++) {
                    boardArray[i][j].sprite.visible = false;
                }
            }
            countCheckers = 0;
            gameOver = false;
        }
    }

}

//Place a cheker in the row the player is currently over
function insertChecker()
{
    countCheckers++;
    var x = playerRow;
    
    for(let y = maxCol-1; y > -1; y--)
    {
        if(boardArray[x][y].sprite.visible == false)
            {
                boardArray[x][y].sprite.visible = true;
                if(turns == 0)
                {
                    boardArray[x][y].sprite.tint = 0xff0000;
                    boardArray[x][y].color = "red";
                }
                else
                {
                    boardArray[x][y].sprite.tint = 0xffff00;
                    boardArray[x][y].color = "yellow";
                }
                renderer.render(stage);
                checkForWin(x,y,boardArray[x][y].color);
                break;
            }

    }
    //Update player's checker's color
    if(turns == 0)
    {
        turns =1
        player.tint = 0xffff00;
        updateTurnText("yellow");
    }
    else
    {
        turns =0;
        player.tint = 0xff0000;
        updateTurnText("red");
    }
    
}
//Check if a player has connected four
function checkForWin (x,y,color)
{    
    checkSlotsBelow(x, y, color);
    checkSlotsAcross(x, y, color);
    checkSlotsDiagonallyLeft(x, y, color);
    checkSlotsDiagonallyRight(x, y, color);

    if (countCheckers >= 42)
    {
        gameOver = true;
    }

    if (gameOver) {

        gameOverText.visible = true;
        player.visible = false;
    }
}


function checkSlotsBelow(x,y,color)
{
    if(y >= 3)
        return;//Can't win from this slot
    
    var score = 1;
    //Check the next slot under last entered slot
    for (let i = y + 1; i < maxCol; i++) {
        if ((boardArray[x][i].sprite.visible == true) && (boardArray[x][i].color == color)) {
            score++;
        }
        else
        { return; }
    }
    
    if (score == 4) {
        gameOver = true;
    }
}

function checkSlotsAcross(x,y,color)
{
    var score = 1; 
    //check left
    for (let i = x - 1; i >= 0; i--) {
        if ((boardArray[i][y].sprite.visible == true) && (boardArray[i][y].color == color)) {
            score++;
        }
        else {
            break;
        }
    }
    //check right
    for (i = x + 1; i < maxRow; i++) {

        if ((boardArray[i][y].sprite.visible == true) && (boardArray[i][y].color == color)) {
            score++;
        }
        else {
            break;
        }

    }
    
    if (score >= 4) {
        gameOver = true;
    }

}

function checkSlotsDiagonallyLeft(x,y,color)
{
    //Up and left
    var score = 1;
    var j = y-1;
    for(let i = x-1; i > 0; i--)
        {  
                
            if(j < 0)
            {
                return;//We are at the top of the board there are no more rows
            }
            if((boardArray[i][j].sprite.visible == true) && (boardArray[i][j].color == color))
            {
                score++;   
                if (score == 4) {
                    gameOver = true;
                    return;
                }
            } 
            else 
            {
                break;
            }
          j--;              
        }
    
     //Down and left
    j =y+1;
    for(i = x-1; i >= 0; i--)
        {          
            if(j > 5 || j < 0)
            {
                return;
            }
            if((boardArray[i][j].sprite.visible == true) && (boardArray[i][j].color == color))
                {
                   score++; 
                   if(score == 4)
                    {
                       gameOver = true;
                        return;
                    }
                } 
                else 
                {
                    break;
                }
          j++;              
        }
       
}

function checkSlotsDiagonallyRight(x,y,color)
{
    //Up and right
    var score = 1;
    var j = y-1;
    for(let i = x+1; i < maxRow; i++)
        {       
            if(j < 0)
            {
                return;//We are at the top of the board there are no more rows
            }
                if((boardArray[i][j].sprite.visible == true) && (boardArray[i][j].color == color))
                {
                    score++; 
                    if(score == 4)
                    {
                        gameOver = true;
                    }
                } 
                else 
                {
                    break;
                }
              j--;              
        }
     
    j = y+1;
    
    for(let i = x+1; i < maxRow; i++)
    {    
        if(j > 5)
        {
            return;
        }      
        if((boardArray[i][j].sprite.visible == true) && (boardArray[i][j].color == color))
        {
            score++;
            if(score == 4)
            {
                gameOver = true;
            }
        } 
        else 
        {
            break;
        }
      j++;              
    } 
}






