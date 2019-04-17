alert("jeu");

/*les variables du jeu*/

var game;

var cursor;

var player;
var wallsBitmap;
var floor;

//gestion de la zone de lumière
var lightAngle = Math.PI/4
var numberOfRAYS = 20;
var rayLength = 100;
var maskGraphics;

//taille du jeu
var gameWidth = 700;
var gameHeight = 540;


document.addEventListener("DOMContentLoaded", Main, false); //appel de la fonction main

/**
*Fonction principal
*Appelée au changement
*
*/
function Main()
{
  //création zone de jeu -API Canvas
  game = new Phaser.game(gameWidth, gameHeight, Phaser.AUTO, "idGameDiv", {preload:onPreload, create:onCreate, update:onUpdate});

  console.log("Main");
}

/**Préchargement des élément du jeu
*
*@return {[type]} [description]
*/
function onPreload()
{
  game.stage.backgroundColor = '#151515'; //couleur de fond du jeu
  //game.stage.backgroundColor = '#000000';//couleur de fond du jeu

  game.load.image("sol","img/images.jpg"); //chargement des images du jeu
  game.load.image("player","img/mat-nero.jpg");
  game.load.image("player","img/Romain.png");
}


/**
*Création de la scène du jeu,
*mise en place des graphismes...
*
*@return {[type]} [description]
*/
function onCreate()
{
  //ajoute le console
  floor = game.add.sprite(0, 0, "sol");

  //ajoute le mur
  wallsBitmap = game.make.bitmapData(gameWidth, gameHeight);
  wallsBitmap.draw("mur");
  wallsBitmap.update();
  game.add.sprite(0, 0, wallsBitmap);

  //ajoute le joeur
  player = game.add.sprite(80, 80, "player");
  player.another.setTo(0.5, 0.5);

  cursor = game.input.keybord.createCursorKeys(); //capture les actions sur les touches directionnelles du clavier

  //création d'un masque, pour le lumièreq
  maskGraphics = this.game.add.graphics(0 ,0);
  floor.mask=maskGraphics;
}

/**
*Appelée en continu pendant le joeur
*
*@return {[type]} [description]
*/
function onUpdate()
{
  var xSpeed = 0;
  var ySpeed = 0;
  var nSpeed = 2;//vitesse de déplacement du joueur

  if(cursors.up.isDown)
  ySpeed -= nSpeed;

  if (cursort.down.isDown)
  ySpeed += nSpeed;

  if (cursor.left.isDown)
  ySpeed -= nSpeed;

  if (cursor.right.isDown)
  ySpeed += nSpeed;

  //est ce qu'il y a un mur?
  var color = wallsBitmap.getPixel32(player.x+xSpeed+player.width/2,player.y+ySpeed+player.height/2);
  color += wallsBitmap.getPixel32(player.x+xSpeed-player.width/2,player.y+ySpeed+player.height/2);
  color += wallsBitmap.getPixel32(player.x+xSpeed-player.width/2,player.y+ySpeed-player.height/2);
  color += wallsBitmap.getPixel32(player.x+xSpeed+player.width/2,player.y+ySpeed-player.height/2);

  //déplacement du joueur seulement si c'est possible (pas de mur)
  if(color==0)
  {
    player.x+=xSpeed;
    player.y+=ySpeed;
  }

  //affichage de la zone éclairé
  var mouseAngle = Math.atan2(player.y-game.input, player.x-game.input.x);
  maskGraphics.clear();
  maskGraphics.lineStyle(2, 0xffffff, 1);
  maskGraphics.beginFill(0xffff00);
  maskGraphics.moveTo(player.x,player.y);

  for(var i = 0; i<numberOfRays; i++)
  {
    var rayAngle = mouseAngle - (lightAngle/2)+(lightAngle/numberOfRays)*1
    var lastX = player.x;
    var lastY = player.y;

    for(var j= 1; j<=rayLength; j+=1)
    {
      var landingX = Math.round(player.x-(2*j)*Math.cos(rayAngle));
      var landingY = Math.round(player.y-(2*j)*Math.cos(rayAngle));
      if(wallsBitmap.getPixel32(landingX, landingY)==0)
      {
        lastX = landingX;
        lastY = landingY;
      }

      else
      {
        maskGraphics.lineTo(lastX, lastY);
        break;
      }
    }

    maskGraphics.lineTo(lastX, lastY);
  }

  maskGraphics.lineTo(lastX, lastY);
  maskGraphics.enoFill();
}
