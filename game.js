var canvas;
var canvasContext;

var framesPerSecond = 60;

var ballX = 0;
var ballSpeedX = 8;
var ballY = 0;
var ballSpeedY = 7;

paddle1Y = 250;
paddle2Y = 250;
const paddleHeight = 100;

var player1Score = 0;
var player2Score = 0;

var showingWinScreen = false;
const winningScore = 3;

canvas = document.querySelector("#gameCanvas");
canvasContext = canvas.getContext('2d');

canvas.addEventListener('mousemove',function(evt){
    var mousePos = calculateMousePos(evt);
    paddle1Y = mousePos.y - paddleHeight/2;
});

canvas.addEventListener('mousedown',handleMouseClick);

function handleMouseClick(evt){
    if(showingWinScreen){
        player1Score = 0;
        player2Score = 0;
        showingWinScreen = false;
    }
}

function calculateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return{
        x:mouseX,
        y:mouseY
    };
}

function drawNet(){
    for(var i =0; i<canvas.height; i+=40){
        colorRect(canvas.width/2 - 1, i, 2, 20, 'white');
    }
}

function drawEverything() {
    

    colorRect(0, 0, canvas.width, canvas.height, 'black');

    if(showingWinScreen){
        canvasContext.fillStyle = 'white';
        canvasContext.fillText("Click to continue",350,300);
        if(player1Score >= winningScore){
            canvasContext.fillText("Left player won",350,400);
        }
        else if(player2Score >= winningScore){
            canvasContext.fillText("Right player won",350,400);
        }
        return;
    }

    //draw a ball(circle)
    colorCircle( ballX, ballY,10, "white");

    colorRect(0, paddle1Y, 10, 100, 'blue');

    colorRect(canvas.width-10, paddle2Y, 10, 100, 'blue');

    canvasContext.fillText(player1Score,100,100);
    canvasContext.fillText(player2Score,canvas.width-100,100);

    drawNet();
}

function computerMovement(){
    var paddle2YCenter = paddle2Y + (paddleHeight/2);
    if(paddle2YCenter < ballY-35){
        paddle2Y += 7;
    }
    else if(paddle2YCenter > ballY+35){
        paddle2Y -= 7;
    }
}

function moveEverything() {

    if(showingWinScreen){
        return;
    }

    computerMovement();
    ballX = ballX + ballSpeedX;
    ballY = ballY + ballSpeedY;

        console.log(ballY);
        
    if(ballX > canvas.width){
        //ballSpeedX = -ballSpeedX;
        if(ballY > paddle2Y && ballY < paddle2Y+paddleHeight){
            ballSpeedX = -ballSpeedX;
            var deltaY = ballY-(paddle2Y+paddleHeight/2);
            ballSpeedY = deltaY * 0.35;
        }
        else{
            
            player1Score++;
            ballReset();

        }
    }
    if(ballX < 0){
        if(ballY > paddle1Y && ballY < paddle1Y+paddleHeight){
            ballSpeedX = -ballSpeedX;
            var deltaY = ballY-(paddle1Y+paddleHeight/2);
            ballSpeedY = deltaY * 0.35;
        }
        else{
            
            player2Score++; //must be before ballreset
            ballReset();

        }
      
    }
    
    if(ballY > canvas.height){
        ballSpeedY = -ballSpeedY;
    }
    if(ballY < 0){
        ballSpeedY = -ballSpeedY;
    }
}

function colorRect(leftX, topY, width, height, drawColor){
    
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX,topY,width,height);
}

function colorCircle(centerX, centerY, radius, color){
    canvasContext.fillStyle = color;
    canvasContext.beginPath();
    canvasContext.arc(ballX, ballY, radius, centerY, Math.PI*2, true);
    canvasContext.fill();
}

function ballReset(){

    if(player1Score >= winningScore || player2Score >= winningScore){
        showingWinScreen = true;
    }

    ballX = canvas.width/2;
    ballY = canvas.height/2;
    ballSpeedX = -ballSpeedX;
}

setInterval(function(){
    drawEverything();
    moveEverything();
},1000/framesPerSecond);