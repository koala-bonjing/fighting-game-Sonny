// Main JS File
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

// Background Image
const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/background.png",
});

// Shop Image
const shop = new Sprite({
  position: {
    x: 620, // Set to the desired x position
    y: 130, // Set to the desired y position
  },
  imageSrc: "./img/shop.png",
  scale: 2.75,
  frames: 6, // Optional if not animating
});

// Player and Enemy Sprites
const player = new Fighter({
  position: { x: 0, y: 10 },
  velocity: { x: 0, y: 0 },
  offSet: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/Evil_Wizard/Sprites/Idle.png",
  frames: 8,
  scale: 2.2,
  offSet: {
    x: 200,
    y: 215,
  },
  sprites: {
    idle: {
      imageSrc: "./img/Evil_Wizard/Sprites/Idle.png",
      frames: 8,
    },
    run: {
      imageSrc: "./img/Evil_Wizard/Sprites/Run.png",
      frames: 8,
    },
    jump: {
      imageSrc: "img/Evil_Wizard/Sprites/Jump.png",
      frames: 2,
    },
    fall: {
      imageSrc: "./img/Evil_Wizard/Sprites/Fall.png",
      frames: 2,
    },
    attack1: {
      imageSrc: "./img/Evil_Wizard/Sprites/Attack2.png",
      frames: 8,
    },
    take_hit: {
      imageSrc: "./img/Evil_Wizard/Sprites/Take hit.png",
      frames: 3,
    },
    death: {
      imageSrc: "./img/Evil_Wizard/Sprites/Death.png",
      frames: 7,
    },
  },
  attackBox: {
    offSet: {
      x: 100,
      y: 15,
    },
    width: 205,
    height: 60,
  },
});

const enemy = new Fighter({
  position: { x: 400, y: 100 },
  velocity: { x: 0, y: 0 },
  color: "white",
  offSet: { x: -50, y: 0 },
  imageSrc: "./img/Kenji/kenji/Idle.png", // Assuming you want the same sprite
  scale: 2.3,
  frames: 10,
  offSet: {
    x: 215,
    y: 142,
  },
  sprites: {
    idle: {
      imageSrc: "./img/Kenji/kenji/Idle.png",
      frames: 4,
    },
    run: {
      imageSrc: "./img/Kenji/kenji/Run.png",
      frames: 8,
    },
    jump: {
      imageSrc: "./img/Kenji/kenji/Jump.png",
      frames: 2,
    },
    fall: {
      imageSrc: "./img/Kenji/kenji/Fall.png",
      frames: 2,
    },
    attack1: {
      imageSrc: "./img/Kenji/kenji/Attack1.png",
      frames: 4,
    },
    take_hit: {
      imageSrc: "./img/Kenji/kenji/Take hit.png",
      frames: 3,
    },
    death: {
      imageSrc: "./img/Kenji/kenji/Death.png",
      frames: 7,
    },
  },
  attackBox: {
    offSet: {
      x: -170,
      y: 60,
    },
    width: 150,
    height: 50,
  },
});

// Input control keys
let lastKey;
const keys = {
  a: { pressed: false },
  d: { pressed: false },
  ArrowRight: { pressed: false },
  ArrowLeft: { pressed: false },
};

decTimer()
// Animates the elements
function animate() {
  window.requestAnimationFrame(animate);

  // Clear the canvas
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  // Background
  background.update();
  // Shop
  shop.update();
  c.fillStyle = 'rgba(255,255,255, 0.17)'
  c.fillRect(0, 0, canvas.width, canvas.width)
  // Update the player and enemy
  player.update();
  enemy.update();

  // Reset velocities
  player.velocity.x = 0;
  enemy.velocity.x = 0;

  // Player movement

  if (keys.a.pressed && lastKey === "a") {
    player.velocity.x = -5;
    player.switchSprite("run");
  } else if (keys.d.pressed && lastKey === "d") {
    player.velocity.x = 5;
    player.switchSprite("run");
  } else player.switchSprite("idle");

  // Enemy movement
  if (keys.ArrowLeft.pressed && lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchSprite("run");
  } else if (keys.ArrowRight.pressed && lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprite("run");
  } else enemy.switchSprite("idle");

  // Player collision detection
  if (
    detectCollision({ rec1: player, rec2: enemy }) &&
    player.isAttacking &&
    player.framesCurrent === 5
  ) {
    player.isAttacking = false;
    enemy.health -= 15;
    if (enemy.health <= 0) {
      enemy.switchSprite("death");
      enemy.health = 0 
    } else enemy.switchSprite("take_hit");
    
    gsap.to('#enemyHp', {
      width: enemy.health + '%'
    })
    console.log("Player Hit"); 
}
  //if PLayer misses
  if (player.isAttacking && player.framesCurrent === 5) {
    player.isAttacking = false;
  }
  //Fall Sprite: Player
  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  //Fall Sprite: Enemy
  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  // Enemy collision detection
  if (
    detectCollision({ rec1: enemy, rec2: player }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    enemy.isAttacking = false;
    player.health -= 10;
    if (player.health <= 0) {
      player.switchSprite("death");
    } else {
      player.switchSprite("take_hit");
    }
    gsap.to('#playerHp', {
      width: player.health + '%'
    })
    console.log("Enemy Hit");
  }
  //if Enemy Misses
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false;
  }
  //determine winner based on health
  if (player.health <= 0 || enemy.health <= 0) {
    deterWinner({ player, enemy, timerId });
  }
}

// Keydown and Keyup event listeners
window.addEventListener("keydown", (event) => {
  console.log(event.key);
  if(!player.dead){
  switch (event.key) {
    // Player controls
    case "d":
      keys.d.pressed = true;
      lastKey = "d";
      break;
    case "a":
      keys.a.pressed = true;
      lastKey = "a";
      break;
    case "w":
      if (!player.isJumping) {
        player.velocity.y = -20;
        player.isJumping = true;
      }
      break;
    case " ":
      player.attack();
      break;
    }
  }

    //Enemy Movement
    if(!enemy.dead){
    switch(event.key){
    // Enemy controls
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      lastKey = "ArrowRight";
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      lastKey = "ArrowLeft";
      break;
    case "ArrowUp":
      if (!enemy.isJumping) {
        enemy.velocity.y = -20;
        enemy.isJumping = true;
      }
      break;
    case "ArrowDown":
      enemy.attack();
      break;
  }
}
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    // Player controls
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;

    // Enemy controls
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});

// Start the animation
animate();
