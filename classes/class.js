// Class Sprite
class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    frames = 1,
    offSet = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.height = 150;
    this.width = 50;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.frames = frames;
    this.framesCurrent = 0;
    this.framesElapased = 0;
    this.framesHold = 5;
    this.offSet = offSet;
    
  }

  draw() {
    c.drawImage(
      this.image,
      this.framesCurrent * (this.image.width / this.frames),
      0,
      this.image.width / this.frames,
      this.image.height,
      this.position.x - this.offSet.x,
      this.position.y - this.offSet.y,
      (this.image.width / this.frames) * this.scale,
      this.image.height * this.scale
    );
  }

  animateFrames() {
    this.framesElapased++;

    if (this.framesElapased % this.framesHold === 0) {
      if (this.framesCurrent < this.frames - 1) {
        this.framesCurrent++;
      } else {
        this.framesCurrent = 0;
      }
    }
  }

  update() {
    this.draw();

    this.animateFrames();
  }
}

class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    color = "red",
    offSet = { x: 0, y: 0 },
    imageSrc,
    scale = 1,
    frames = 1,
    sprites,
    attackBox = {offSet: {}, width: undefined, height: undefined}
  }) {
    super({
      position,
      imageSrc,
      scale,
      frames,
      offSet,
    });
    this.velocity = velocity;
    this.isJumping = false;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offSet : attackBox.offSet,
      width: attackBox.width,
      height: attackBox.height,
    };
    this.color = color;
    this.isAttacking;
    this.health = 100;
    this.framesCurrent = 0;
    this.framesElapased = 0;
    this.framesHold = 5;
    this.sprites = sprites;
    this.dead = false

    for (const sprite in this.sprites) {
      const img = new Image(); // Create a new image
      img.src = this.sprites[sprite].imageSrc; // Set the image source

      // Set image load and error callbacks
      img.onload = () => console.log(`Image loaded: ${sprite}`);
      img.onerror = () =>
        console.error(`Error loading image: ${this.sprites[sprite].imageSrc}`);

      this.sprites[sprite].image = img; // Assign the image to the sprite
    }
  }
  draw() {
    super.draw();

    //  {
    //   c.fillStyle = "red";
    //   c.fillRect(
    //     this.attackBox.position.x,
    //     this.attackBox.position.y,
    //     this.attackBox.width,
    //     this.attackBox.height   
    //   )
    // }
  }

  update() {
    this.draw();
    if(!this.dead)
    this.animateFrames();
    this.attackBox.position.x = this.position.x + this.attackBox.offSet.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offSet.y;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // Prevent going beyond canvas height, considering 96px offset
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      this.velocity.y = 0;
      this.position.y = 330;
      this.isJumping = false;
      // Set the character position to the correct height minus 96px
      this.position.y = canvas.height - this.height - 96;
    } else {
      this.velocity.y += gravity; // Apply gravity when not grounded
    }
  }

  jump() {
    if (!this.isJumping) {
      // Only jump if not currently jumping
      this.velocity.y = -15; // Adjust the jump height as needed
      this.isJumping = true; // Set jumping state
    }
  }

  attack() {
   this.switchSprite("attack1");
    this.isAttacking = true;
  }
  switchSprite(sprite) {
    console.log(sprite);
    //Overrriding all other animations with the attack animations
    if (
      this.image === this.sprites.attack1.image &&
      this.framesCurrent < this.sprites.attack1.frames - 1
    )
      return;
    //Overriding with Take hit animations
    if (
      this.image === this.sprites.take_hit.image &&
      this.framesCurrent < this.sprites.take_hit.frames - 1
    )
    return
    //Overriding wth death
    if (this.image === this.sprites.death.image){
      if (this.framesCurrent === this.sprites.death.frames - 1)
        this.dead = true  
      return }

    switch (sprite) {
      case "idle":
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.frames = this.sprites.idle.frames;
          this.framesCurrent = 0;
        }
        break;
      case "run":
        if (this.image !== this.sprites.run.image){      
          this.image = this.sprites.run.image;
          this.frames = this.sprites.run.frames;
          this.framesCurrent = 0;
        }
        break;
      case "jump":
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.frames = this.sprites.jump.frames;
          this.framesCurrent = 0;
        }
        break;
      case "fall":
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.frames = this.sprites.fall.frames;
          this.framesCurrent = 0;
        }
        break;
      case "attack1":
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image;
          this.frames = this.sprites.attack1.frames;
          this.framesCurrent = 0;
        }
        break;
        case "take_hit":
        if (this.image !== this.sprites.take_hit.image) {
          this.image = this.sprites.take_hit.image;
          this.frames = this.sprites.take_hit.frames;
          this.framesCurrent = 0;
        }
        break;
        case "death":
          if (this.image !== this.sprites.death.image) {
            this.image = this.sprites.death.image;
            this.frames = this.sprites.death.frames;
            this.framesCurrent = 0;
          }
          break;
    }
  }
}
