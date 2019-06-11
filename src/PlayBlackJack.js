const Player = require('./Player')
const BlackJackGame = require('./BlackJackGame.js')
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

function setUpTable() { 
  const table = document.getElementById('players')
  players.forEach((player, index) => {
    const playerTile = document.createElement('div')
    playerTile.setAttribute('id', `player-${index}`)
    playerTile.setAttribute('style', 'display: inline-block')

    const cardsTile = document.createElement('div')
    cardsTile.setAttribute('id', `player-${index}-cards`)

    const cardsImg = document.createElement('img')
    cardsImg.setAttribute('href', '#')

    const playerName = document.createTextNode(`  ${player.name}  `)
    const playerChips = document.createTextNode(`  ${player.chips}  `)

    cardsTile.appendChild(cardsImg)
    cardsTile.appendChild(cardsImg)
    
    playerTile.appendChild(playerName)
    playerTile.appendChild(playerChips)
    playerTile.appendChild(cardsTile)

    table.appendChild(playerTile)
  })
  document.getElementById('createGameForm').innerHTML = ''
}

function createBlackJackGame() {
  setUpTable()
  const game = new BlackJackGame(null, players)
}

window.createBlackJackGame = createBlackJackGame
