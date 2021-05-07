var database ,dog,dog1,dog2
var position
//var form
var feed,add
var foodobject
var Feedtime
var Lastfeed
var gameState
var bedroomimg,washroomimg,gardenimg
var feedTime,lastFed;
//Create variables here

function preload()

{
  dogimg1 = loadImage("images/dogImg.png")
  dogimg2 = loadImage("images/dogImg1.png")
  bedroomimg = loadImage("images/Bed Room.png")
  gardenimg = loadImage("images/Garden.png")
  washroomimg = loadImage("images/Wash Room.png")
	//load images here
}

function setup() {
	createCanvas(1000, 500);
  
  database = firebase.database();
  console.log(database);

  var readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });
 
  foodobject=new Food()
  dog = createSprite(550,250,10,10);
  dog.addImage(dogimg1)
  dog.scale=0.2
 
  var dogo = database.ref('Food');
  dogo.on("value", readPosition, showError);
  feed = createButton("FEED DRAGO")
  feed.position(500,15)
  feed.mousePressed(FeedDog)
  add = createButton("ADD FOOD")
  add.position(400,15)
  add.mousePressed(AddFood)

} 

function draw(){
 background(46,139,87);

 foodobject.display()

 if(gameState!="Hungry"){
   feed.hide();
   add.hide();
   dog.remove();
 }else{
   feed.show();
   add.show();
   dog.addImage(dogimg1);
 }
 feedTime = database.ref("FeedTime")
 feedTime.on("value",function(data){
   lastFed = data.val();
 })
 currentTime=hour();
 if(currentTime==(lastFed+1)){
   update("Playing");
   foodobject.garden();

 }else if(currentTime ==(lastFed+2)){
  update("Sleeping");
  foodobject.bedroom();

 }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
   update("Bathing");
   foodobject.washroom();
 }else{
   update("Hungry")
   foodobject.display();
 }

 
 
 
  
 fill(255,255,254);
 textSize(15);

drawSprites();
}
function readPosition(data){
  position = data.val();
  foodobject.updateFoodStock(position)
}

function showError(){
  console.log("Error in writing to the database");
}

function writePosition(nazo){
  if(nazo>0){
    nazo=nazo-1
  }
  else{
    nazo=0
  }
  database.ref('/').set({
    'Food': nazo
  })

}
function AddFood(){
position++
database.ref('/').update({
  Food:position
}

)
}
function FeedDog(){

dog.addImage(dogimg2)
foodobject.updateFoodStock(foodobject.getFoodStock()-1)
 database.ref('/').update({
   Food:foodobject.getFoodStock(),
   FeedTime:hour ()
 })
}

function update(state){
  database.ref("/").update({
    gameState:state
  });
}