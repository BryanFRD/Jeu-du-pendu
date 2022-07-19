const gameText = document.querySelector("#game-text");
const alphabetButtonDiv = document.querySelector("#alphabet-buttons");
const messageDiv = document.querySelector("#message-won-lost");
const img = document.querySelector("#pendu-img");

let randomWord;
let counter = 1;
let foundedLetters = [];
let excludedChar = [" ", "'", "-", "_"];

function generateRandomWord(){
  let rw = words_list[Math.floor(Math.random() * words_list.length)].toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  console.log(rw);
  return rw;
}

function refresh(){
  /* TEMPLATE */
  
  let alphabetButtonTemplate = document.createElement("button");
  alphabetButtonTemplate.classList.add("btn", "btn-primary", "m-1", "w-100");
  
  let letterPlaceholderTemplate = document.createElement("div");
  letterPlaceholderTemplate.classList.add("text-placeholder", "bg-dark", "rounded-1");
  
  /* TEMPLATE */
  
  randomWord = generateRandomWord();
  counter = 1;
  foundedLetters = [];
  
  gameText.hidden = false;
  messageDiv.hidden = true;
  
  gameText.innerHTML = "";
  alphabetButtonDiv.innerHTML = "";
  
  for(let i = 0; i < randomWord.length; i++){
    let tempPH = letterPlaceholderTemplate.cloneNode(true);
    let currentLetter = randomWord[i];
    if(excludedChar.includes(currentLetter)){
      tempPH.innerText = currentLetter;
      foundedLetters[i] = currentLetter;
      let cl = tempPH.classList;
      tempPH.classList.remove("bg-dark");
      tempPH.classList.add("text-dark");
    }
    
    gameText.appendChild(tempPH);
  }
  
  for(let i = 0; i < 26; i++){
    let tempButton = alphabetButtonTemplate.cloneNode(true);
    tempButton.innerText = (i + 10).toString(36).toUpperCase();
    tempButton.addEventListener('click', (event) => {
      let tb = event.currentTarget;
      tb.classList.add("disabled");
      console.log(randomWord);
      if(randomWord.includes(tb.innerText)){
        tb.classList.replace("btn-primary", "btn-success");
        addLetters(tb.innerText);
      } else {
        tb.classList.replace("btn-primary", "btn-danger");
        counter++;
      }
      
      refreshImage();
      
      if(counter >= 14){
        stopGame(false);
      } else if(hasWon()) {
        stopGame(true);
      }
    });
    
    alphabetButtonDiv.appendChild(tempButton);
  }
  
  refreshImage();
}

function addLetters(letter){
  for(let i = 0; i < randomWord.length; i++){
    if(randomWord[i] === letter){
      foundedLetters[i] = letter;
      gameText.children[i].innerText = letter
    }
  }
}

function stopGame(won){
  gameText.hidden = true;
  messageDiv.hidden = false;
  
  let wonMessage = "gagné :]",
  lostMessage = "perdu :{";
  
  messageDiv.querySelector("h1").innerText = `Vous avez ${won ? wonMessage : lostMessage} !`
  
  for(let button of alphabetButtonDiv.children){
    if(!button.classList.contains("disabled")){
      button.classList.add("disabled");
      button.classList.replace("btn-primary", "btn-secondary");
    }
  }
  
  for(let i = 0; i < randomWord.length; i++){
    let letter = randomWord[i];
    let div = gameText.children[i];
    
    if(foundedLetters[i] == letter){
      div.classList.replace("bg-dark", "bg-success");
    } else {
      div.classList.replace("bg-dark", "bg-danger");
      div.innerText = letter;
    }
  }
}

function refreshImage(){
  img.src = getImageSrc();
}

function getImageSrc(){
  return `./img/Image ${Math.min(counter, 14).toLocaleString('fr-FR', {minimumIntegerDigits: 3, useGrouping: false})}.png`;
}

function hasWon(){
  for(let letter of randomWord){
    if(!foundedLetters.includes(letter)){
      return false;
    }
  }
   return true;
}

refresh();
document.querySelector("#refresh").addEventListener('click', refresh);