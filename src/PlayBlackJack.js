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
  const dealer = document.getElementById('dealer')
  
  const dealerImage = document.createElement('img')
  dealerImage.setAttribute('src', '../assets/avatars/dealer_avatar.png')
  dealerImage.setAttribute('height', '50')
  dealerImage.setAttribute('width', '50')
  dealer.appendChild(dealerImage)

  const dealerCardsTile = document.createElement('div')
  dealerCardsTile.setAttribute('id', 'dealer-cards')
  dealerCardsTile.setAttribute('style', 'text-align:center')
  dealer.appendChild(dealerCardsTile)
  
  const playerRow = document.getElementById('players')
  players.forEach((player, index) => {
    const playerTile = document.createElement('div')
    playerTile.setAttribute('id', `player-${index}`)
    playerTile.setAttribute('style', 'display: inline-block')
    
    const playerImage = document.createElement('img')
    playerImage.setAttribute('src', '../assets/avatars/player_avatar.png')
    playerImage.setAttribute('height', '50')
    playerImage.setAttribute('width', '50')

    const playerName = document.createElement('div')
    playerName.setAttribute('id', `player${index}-name`)
    playerName.innerHTML = player.name
    
    const playerChips = document.createElement('div')
    playerChips.setAttribute('id', `player${index}-chips`)
    playerChips.innerHTML = player.chips
    
    const cardsTile = document.createElement('div')
    cardsTile.setAttribute('id', `player-${index}-cards`)

    const betInput = document.createElement('input')
    betInput.setAttribute('id', `player${index}-bet-input`)

    const betButton = document.createElement('div')
    betButton.setAttribute('id', `player${index}-bet-button-div`)
    const button = document.createElement('button')
    button.setAttribute('id', `player${index}-bet-button`)
    betButton.appendChild(button)

    playerTile.appendChild(playerImage)
    playerTile.appendChild(playerName)
    playerTile.appendChild(cardsTile)
    playerTile.appendChild(playerChips)
    playerTile.appendChild(betInput)
    playerTile.appendChild(betButton)

    playerRow.appendChild(playerTile)
  })
  document.getElementById('createGameForm').innerHTML = ''
}

function createBlackJackGame() {
  setUpTable()
  const game = new BlackJackGame(null, players)
}

window.createBlackJackGame = createBlackJackGame
