//Creates the all the variables
var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var highestScore = 0;

var gameover;
    
var restart;

var jumpSound;

var checkPointSound;

var dieSound;

function preload(){
  
  // Loads all the animations
    trex_running=loadAnimation("trex1.png","trex3.png","trex4.png");      
    trex_collided = loadAnimation("trex_collided.png");

  jumpSound = loadSound("jump.mp3");
  
  dieSound = loadSound("die.mp3");
  
  checkPointSound = loadSound("checkPoint.mp3")
  
  // Loads all the images
    groundImage = loadImage("ground2.png");

    cloudImage = loadImage("cloud.png");
  
    obstacle1 = loadImage("obstacle1.png");
    obstacle2 = loadImage("obstacle2.png");
    obstacle3 = loadImage("obstacle3.png");
    obstacle4 = loadImage("obstacle4.png");
    obstacle5 = loadImage("obstacle5.png");
    obstacle6 = loadImage("obstacle6.png");
  
    gameoverImage = loadImage("gameOver.png");
  
    restartImage = loadImage("restart.png");
  
}

function setup() {
  
  //creates the canvas
  createCanvas(600, 200);
  
  
  //creates all the sprites, scales all the sprites and if needed adds the animation or image
    trex = createSprite(50,180,20,50);
    trex.addAnimation("running", trex_running);
    trex.addAnimation("collided" , trex_collided)
    trex.scale = 0.5;
  
    ground = createSprite(200,180,400,20);
    ground.addImage("ground",groundImage);
    ground.x = ground.width /2;

    gameover = createSprite(300,80);
    gameover.addImage("gameover",gameoverImage);
    gameover.scale = 0.5;
  
    restart = createSprite(300,120);
    restart.addImage("restart",restartImage);
    restart.scale = 0.3;
  
    invisibleGround = createSprite(200,190,400,10);
  //Makes it so the invisible ground is not visible
    invisibleGround.visible = false;
  
  
    //creates Obstacle and Cloud Groups
    obstaclesGroup = createGroup();
    cloudsGroup = createGroup();
  
  //creates a collider around the trex that is a circle 
    trex.setCollider("rectangle",0,0,90,90);
   
  //sets the default score to 0
  score = 0
  
}

function draw() {
  
  //Creates a background that is gray
  background(180);
  
    //displaying score
    text("Score: "+ score, 500,50);
  
    text("Highest Score:" + highestScore,380,50);  
  
  //adds an if statement
    if(gameState === PLAY){
        //move the ground
        ground.velocityX = -4;
        //scoring
        score = score + Math.round(getFrameRate()/60);
      
       if(highestScore < score) {
          highestScore = score;
        }
      
      //Makes the gameover and restart sprites not visible
        gameover.visible = false;
        restart.visible = false;
    
      //Creates an infinite ground
        if (ground.x < 0){
          
        ground.x = ground.width/2;
          
        }
    
      //jump when the space key is pressed
      if(keyDown("space")&& trex.y >=150) {
        
            trex.velocityY = -13;
            jumpSound.play();
        
      }
      if (score % 100 === 0 && score>0) {
       
        checkPointSound.play();
      }
      //add gravity to the trex
    trex.velocityY = trex.velocityY + 0.8
  
      //spawn the clouds
      spawnClouds();
  
      //spawn obstacles on the ground
      spawnObstacles();
    
      // Adds an if statement saying if the obstacles touch the trex make the gamestate end
      if(obstaclesGroup.isTouching(trex)){
          score = 0;
          dieSound.play();
          gameState = END;
      }
  }
   
  else if (gameState === END) {
    
    //Sets the velocity of the ground and trex to 0
        ground.velocityX = 0;
       trex.velocityY = 0;
    
    //Changes the animation of the trex to trex collided
       trex.changeAnimation("collided",trex_collided);
    
    //Sets the velocity's of both groups to 0
       obstaclesGroup.setVelocityXEach(0);
       cloudsGroup.setVelocityXEach(0);
    
    if(mousePressedOver(restart)) {
      
      reset();
      
    }
    //Sets the life time of the groups to -1 so they don't dissapear slowly
       obstaclesGroup.setLifetimeEach(-1);
       cloudsGroup.setLifetimeEach(-1);
    
    //Makes it so the gameover and restart sprites to true
       gameover.visible = true;
       restart.visible = true;
    
   }
  
 
    //stop trex from falling down
    trex.collide(invisibleGround);
  
  
  //draws the sprites
    drawSprites();
}

function spawnObstacles(){
  //If the framecount is multiples of 60
   if (frameCount % 60 === 0){
     //creates the obstacle sprite
   var obstacle = createSprite(600,165,10,40);
     //sets the velocity of the obstacle to -6
   obstacle.velocityX = -(6 + score/1000);
   
      //generate random obstacles
      var rand = Math.round(random(1,6));
     
      switch(rand) {
          
        case 1: obstacle.addImage(obstacle1);
                break;
                
        case 2: obstacle.addImage(obstacle2);
                break;
                
        case 3: obstacle.addImage(obstacle3);
                break;
                
        case 4: obstacle.addImage(obstacle4);
                break;
                
        case 5: obstacle.addImage(obstacle5);
                break;
                
        case 6: obstacle.addImage(obstacle6);
                break;
                
        default: break;
        
    }
   
      //assign scale and lifetime to the obstacle           
      obstacle.scale = 0.5;
      obstacle.lifetime = 300;
   
     //add each obstacle to the group
      obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  
    //spawns the clouds
  // If the framecount is a multiple of 60
     if (frameCount % 60 === 0) {
       //creates the clouds image and velocity
         cloud = createSprite(600,100,40,10);
       //Makes the clouds y random from 10-60
        cloud.y = Math.round(random(10,60));
        cloud.addImage(cloudImage);
        cloud.scale = 0.5;
        cloud.velocityX = -3;
    
         //assign lifetime to the variable
        cloud.lifetime = 200;
    
        //adjust the depth
        cloud.depth = trex.depth;
        trex.depth = trex.depth + 1;
    
        //adding cloud to the group
       cloudsGroup.add(cloud);
    }
  
}

function reset () {
      
       if(highestScore < score) {
          highestScore = score;
        }
      score = 0;
      trex.changeAnimation("running",trex_running)
      cloudsGroup.destroyEach();
      obstaclesGroup.destroyEach();
      gameState = PLAY;
  
}


