const Player = require('./Player')
const BlackJackGame = require('./BlackJackGame.js')
const players = []
let game

function addNewPlayer() {
  const name = document.getElementById('nameInput')
  const chips = document.getElementById('chipsInput')
  const player = new Player(name.value, chips.value)
  name.value = ''
  chips.value = ''
  players.push(player)
  const li = document.createElement('li')
  const nameNode = document.createTextNode(`${player.getName()}:  `)
  const chipsNode = document.createTextNode(`chips: ${player.getChips()}`)
  
  li.appendChild(nameNode)
  li.appendChild(chipsNode)
  
  document.getElementById('playersList').appendChild(li)
  document.getElementById('createGameButton').setAttribute('style', 'display:inline-block') 
}
window.addNewPlayer = addNewPlayer

function setUpTable() {
  document.getElementById('table-div').setAttribute('style', 'display:block')

  const playerRow = document.getElementById('players-div')
  const playerDivs = []

  players.forEach((player, index) => {
    const playerDiv = document.createElement('div')
    playerDiv.setAttribute('id', `player${index}-div`)
    playerDiv.setAttribute('style', 'display: inline-block')
    
    const playerImage = document.createElement('img')
    playerImage.setAttribute('src', '../assets/avatars/player_avatar.png')
    playerImage.setAttribute('height', '50')
    playerImage.setAttribute('width', '50')
    
    const playerName = document.createElement('div')
    playerName.setAttribute('id', `player${index}-name`)
    playerName.innerHTML = player.name
    
    const playerChips = document.createElement('div')
    playerChips.setAttribute('id', `player${index}-chips`)
    playerChips.innerHTML = `chips: ${player.chips}`
    
    const playerCards = document.createElement('div')
    playerCards.setAttribute('id', `player${index}-cards`)
    
    const betInput = document.createElement('input')
    betInput.setAttribute('id', `player${index}-bet-input`)
    
    const betButtonDiv = document.createElement('div')
    betButtonDiv.setAttribute('id', `player${index}-bet-button-div`)
    const betButton = document.createElement('button')
    betButton.setAttribute('id', `player${index}-bet-button`)
    betButton.setAttribute('onclick', `makeBet(${index})`)
    betButton.innerHTML = 'Place Bet'
    betButtonDiv.appendChild(betButton)
    
    playerDiv.appendChild(playerImage)
    playerDiv.appendChild(playerName)
    playerDiv.appendChild(playerCards)
    playerDiv.appendChild(playerChips)
    playerDiv.appendChild(betInput)
    playerDiv.appendChild(betButtonDiv)
    
    playerDivs.push(playerDiv)
  })
  playerDivs.reverse().forEach((playerDiv) => {
    playerRow.appendChild(playerDiv)
  })
  document.getElementById('createGameForm').innerHTML = ''
}

let betCount = 0
function makeBet(index) {
  const betInput = document.getElementById(`player${index}-bet-input`)
  const betButton = document.getElementById(`player${index}-bet-button-div`)
  const chips = document.getElementById(`player${index}-chips`)

  if(betInput.value !== '') {
    game.players[index].placeBet(Number(betInput.value))
    betInput.setAttribute('style', 'display:none')
    betButton.innerHTML = `bet: ${game.players[index].getBets()[0]}`
    chips.innerHTML = `chips: ${game.players[index].getChips()}`
    betCount++
  }
  if(betCount === game.getNumberOfPlayers()) {
    const dealCardsButton = document.createElement('button')
    dealCardsButton.setAttribute('id', 'dealCardsButton')
    dealCardsButton.setAttribute('onclick', 'dealCards()')
    dealCardsButton.innerHTML = 'Deal Cards'
    dealer.appendChild(dealCardsButton)
    betCount = 0
  }
}
window.makeBet = makeBet

function dealCards() {
  game.dealCards()
  appendCards()

  game.players.forEach((player, index) => {
    const drawCardButton = document.createElement('button')
    drawCardButton.setAttribute('id', `player${index}-drawCardButton`)
    drawCardButton.setAttribute('onclick', `drawCard(${index})`)
    drawCardButton.innerHTML = 'Draw Card'
    if(index !== 0) drawCardButton.setAttribute('style', 'display:none')

    const stickButton = document.createElement('button')
    stickButton.setAttribute('id', `player${index}-stickButton`)
    stickButton.setAttribute('onclick', `stick(${index})`)
    stickButton.innerHTML = 'Stick'
    if(index !== 0) stickButton.setAttribute('style', 'display:none')


    const playerDiv = document.getElementById(`player${index}-div`)
    playerDiv.appendChild(drawCardButton)
    playerDiv.appendChild(stickButton)
  })
  document.getElementById('dealCardsButton').setAttribute('style', 'display:none')
}
window.dealCards = dealCards

function appendCards() {
  const dealerCardsDiv = document.getElementById('dealer-cards-div')
  dealerCardsDiv.innerHTML = ''
  for(let i=0; i<game.dealer.handSize(); i++) {
    const cardToAppend = document.createTextNode(game.dealer.showHand()[i].face)
    dealerCardsDiv.appendChild(cardToAppend)
  }
  game.players.forEach((player, index) => {
    const playerCardsDiv = document.getElementById(`player${index}-cards`)
    playerCardsDiv.innerHTML = ''
    player.hands[0].cards.forEach((card, i ) => {
      const cardToAppend = document.createTextNode(player.showHand()[i].face)
    playerCardsDiv.appendChild(cardToAppend)
    })
  })
}

function drawCard(index) {
  game.players[index].receiveCard(game.deck.dealCard())
  appendCards()
}
window.drawCard = drawCard

function stick(index) {
  document.getElementById(`player${index}-drawCardButton`).setAttribute('style', 'display:none')
  document.getElementById(`player${index}-stickButton`).setAttribute('style', 'display:none')

  if(index+1 === players.length) {
    playDealersHand()
  } else {
    document.getElementById(`player${index+1}-drawCardButton`).setAttribute('style', 'display:inline-block')
    document.getElementById(`player${index+1}-stickButton`).setAttribute('style', 'display:inline-block')
  }
}
window.stick = stick

function createBlackJackGame() {
  setUpTable()
  game = new BlackJackGame(null, players)
}
window.createBlackJackGame = createBlackJackGame
