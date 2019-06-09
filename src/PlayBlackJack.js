const Player = require('./Player')

const players = []
function addNewPlayer() {
  const name = document.getElementById('nameInput')
  const chips = document.getElementById('chipsInput')
  const player = new Player(name.value, chips.value)
  name.value = ''
  chips.value = ''
  players.push(player)
  const li = document.createElement('li')
  const nameNode = document.createTextNode(`${player.getName()}`)
  const chipsNode = document.createTextNode(`${player.getChips()}`)

  li.appendChild(nameNode)
  li.appendChild(chipsNode)

  document.getElementById('playersList').appendChild(li) 
}

window.addNewPlayer = addNewPlayer
