function detectCollision({ rec1, rec2 }) {
    return (
      rec1.attackBox.position.x + rec1.attackBox.width >= rec2.position.x &&
      rec1.attackBox.position.x <= rec2.position.x + rec2.width &&
      rec1.attackBox.position.y + rec1.attackBox.height >= rec2.position.y &&
      rec1.attackBox.position.y <= rec2.position.y + rec2.height
    );
  }
  
  //Determine Winner
  function deterWinner({player, enemy, timerId}){
    clearTimeout(timerId)
    document.querySelector("#Winner").style.display = "flex";
    if (enemy.health === player.health) {
      document.querySelector("#Winner").innerHTML = "Tie";
    }
    else if (enemy.health < player.health || enemy.health === 0 ) {
      document.querySelector("#Winner").innerHTML = "Player 1 Wins";
    }
    else if (enemy.health > player.health || player.health === 0 ) {
      document.querySelector("#Winner").innerHTML = "Player 2 Wins";
    }
  }
  
  //Timer Function
  let timer = 60;
  let timerId
  
  function decTimer() {
    if (timer > 0) {
     timerId = setTimeout(decTimer, 1000);
      timer--;
      document.querySelector("#timer").innerHTML = timer;
    }
  
    if (timer === 0) {
      deterWinner({player,enemy, timerId})
    }
  }