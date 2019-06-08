const Game = require('./BlackJackGame')
const game = new BlackJackGame()

const playerArray = []
function addNewPlayer() {
  const nameInput = document.getElementById('nameInput')
  const chipsInput = document.getElementById('chipsInput')
  
  const player = {
    name: nameInput.value,
    chips: chipsInput.value
  }
  
  playerArray.push(player)
  game.addPlayer(`${player.name}`, player.chips)
  const li = document.createElement('li')
  const name = document.createTextNode(`${player.name}`)
  const chips = document.createTextNode(`${player.chips}`)
  
  li.appendChild(name)
  li.appendChild(chips)

  document.getElementById('playersList').appendChild(li) 
}
