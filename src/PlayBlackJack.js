const Player = require('./Player')

const players = []
function addNewPlayer() {
  const name = document.getElementById('nameInput').value
  const chips = document.getElementById('chipsInput').value
  const player = new Player(name, chips)

  players.push(player)
  const li = document.createElement('li')
  const nameNode = document.createTextNode(`${player.getName()}`)
  const chipsNode = document.createTextNode(`${player.getChips()}`)

  li.appendChild(nameNode)
  li.appendChild(chipsNode)

  document.getElementById('playersList').appendChild(li) 
}

window.addNewPlayer = addNewPlayer
