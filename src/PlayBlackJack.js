const Player = require('./Player')
const BlackJackGame = require('./BlackJackGame.js')
const players = []
let game

function addNewPlayer() {
  const name = document.getElementById('nameInput')
  const chips = document.getElementById('chipsInput')
  if(chips.value !== '') {
    const player = new Player(name.value, chips.value)
    name.value = ''
    chips.value = ''
    players.push(player)
    const li = document.createElement('li')
    li.setAttribute('style', 'list-style-type:none')
    const nameNode = document.createTextNode(`${player.getName()}:  `)
    const chipsNode = document.createTextNode(`chips:  ${player.getChips()}`)
    
    li.appendChild(nameNode)
    li.appendChild(chipsNode)
    
    document.getElementById('playersList').appendChild(li)
    document.getElementById('createGameButton').setAttribute('style', 'display:inline-block')
  } 
}

function setUpTable() {
  document.getElementById('table-div').setAttribute('style', 'display:block')
  document.getElementById('createGameForm').setAttribute('style', 'display:none')
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

    // todo betdiv
    
    const playerName = document.createElement('div')
    playerName.setAttribute('id', `player${index}-name`)
    playerName.innerHTML = player.name 
    
    const playerChips = document.createElement('div')
    playerChips.setAttribute('id', `player${index}-chips`)
    playerChips.innerHTML = `chips: ${player.getChips()}`
    
    const playerCards = document.createElement('div')
    playerCards.setAttribute('id', `player${index}-cards`)

    const playerHandValue = document.createElement('div')
    playerHandValue.setAttribute('id', `player${index}-hand-value`)
    playerHandValue.setAttribute('style', 'color:red')
    
    const betInput = document.createElement('input')
    betInput.setAttribute('id', `player${index}-bet-input`)
    betInput.setAttribute('size', '10')  
    const betButtonDiv = document.createElement('div')
    betButtonDiv.setAttribute('id', `player${index}-bet-button-div`)
    const betButton = document.createElement('button')
    betButton.setAttribute('id', `player${index}-bet-button`)
    betButton.setAttribute('onclick', `makeBet(${index})`)
    betButton.innerHTML = 'Place Bet'
    betButtonDiv.appendChild(betButton)
    
    playerDiv.appendChild(playerImage)
    playerDiv.appendChild(playerName)
    playerDiv.appendChild(playerChips)
    playerDiv.appendChild(playerCards)
    playerDiv.appendChild(playerHandValue)
    playerDiv.appendChild(betInput)
    playerDiv.appendChild(betButtonDiv)
    
    playerDivs.push(playerDiv)
  })
  playerDivs.reverse().forEach((playerDiv) => {
    playerRow.appendChild(playerDiv)
  })
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
    document.getElementById('dealCards-button').setAttribute('style', 'display:inline-block')
    betCount = 0
  }
}

function dealCards() {
  game.dealCards()
  displayDealerCard()
  displayPlayerCards()

  game.players.forEach((player, index) => {
    const drawCardButton = document.createElement('button')
    drawCardButton.setAttribute('id', `player${index}-drawCardButton`)
    drawCardButton.setAttribute('onclick', `drawCard(${index})`)
    drawCardButton.innerHTML = 'Card'
    if(index !== 0) drawCardButton.setAttribute('style', 'display:none')

    const stickButton = document.createElement('button')
    stickButton.setAttribute('id', `player${index}-stickButton`)
    stickButton.setAttribute('onclick', `stick(${index})`)
    stickButton.innerHTML = 'Stick'
    if(index !== 0) stickButton.setAttribute('style', 'display:none')

    const splitButton = document.createElement('button')
    splitButton.setAttribute('id', `player${index}-splitButton`)
    splitButton.setAttribute('onclick', `splitCards(${index})`)
    splitButton.innerHTML = 'Split'
    if(index !== 0) splitButton.setAttribute('style', 'display:none')

    const playerDiv = document.getElementById(`player${index}-div`)
    playerDiv.appendChild(drawCardButton)
    playerDiv.appendChild(stickButton)

    if(player.hands[0].isSplittable()) {
      playerDiv.appendChild(splitButton)
    }
  })
  document.getElementById('dealCards-button').setAttribute('style', 'display:none')
}

function displayPlayerCards() {
  game.players.forEach((player, index) => {
    const playerCardsDiv = document.getElementById(`player${index}-cards`)
    playerCardsDiv.innerHTML = ''
    player.hands[0].cards.forEach((card, i ) => {
      const cardToAppend = document.createTextNode(player.showHand()[i].face)
      playerCardsDiv.appendChild(cardToAppend)
    })
  })
}

function displayDealerCard() {
  const dealerCardsDiv = document.getElementById('dealer-cards-div')
  const cardBack = document.createElement('img')
  cardBack.setAttribute('src', '../assets/cards/card_back.png')
  cardBack.setAttribute('style', 'height:20px')
  cardBack.setAttribute('style', 'width:20px')
  dealerCardsDiv.innerHTML = ''
  dealerCardsDiv.appendChild(cardBack)
  dealerCardsDiv.appendChild(document.createTextNode(game.dealer.showHand()[1].face))
}

function displayAllCards() {
  const dealerCardsDiv = document.getElementById('dealer-cards-div')
  dealerCardsDiv.innerHTML = ''
  for(let i=0; i<game.dealer.handSize(); i++) {
    dealerCardsDiv.appendChild(document.createTextNode(game.dealer.showHand()[i].face))
  }
  displayPlayerCards()
}

function drawCard(index, hand) {
  game.players[index].receiveCard(game.deck.dealCard(), hand)
  if(game.handValue(game.players[index].showHand(hand)) > 21) {
    stick(index)
  }
  displayPlayerCards()
}

function stick(index) {
  document.getElementById(`player${index}-hand-value`).innerHTML = game.handValue(game.players[index].showHand())
  document.getElementById(`player${index}-drawCardButton`).setAttribute('style', 'display:none')
  document.getElementById(`player${index}-stickButton`).setAttribute('style', 'display:none')

  if(index+1 === players.length) {
    playDealersHand()
    document.getElementById('next-button').setAttribute('style', 'display:inline-block')
  } else {
    document.getElementById(`player${index+1}-drawCardButton`).setAttribute('style', 'display:inline-block')
    document.getElementById(`player${index+1}-stickButton`).setAttribute('style', 'display:inline-block')
    if(document.getElementById(`player${index+1}-splitButton`)) {
      document.getElementById(`player${index+1}-splitButton`).setAttribute('style', 'display:block')
    }
  }
}

function splitCards(index) {
  game.players[index].splitHand()
  game.players[index].receiveCard(game.deck.dealCard())
  game.players[index].receiveCard(game.deck.dealCard(), 2)

  const playerCards = document.createElement('div')
  playerCards.setAttribute('id', `player${index}-split-cards`)

  const playerHandValue = document.createElement('div')
  playerHandValue.setAttribute('id', `player${index}-split-hand-value`)
  playerHandValue.setAttribute('style', 'color:red')
  
  const drawCardButton = document.createElement('button')
  drawCardButton.setAttribute('id', `player${index}-split-drawCardButton`)
  drawCardButton.setAttribute('onclick', `drawCard(${index})`)
  drawCardButton.innerHTML = 'Card'

  const stickButton = document.createElement('button')
  stickButton.setAttribute('id', `player${index}-split-stickButton`)
  stickButton.setAttribute('onclick', `stick(${index})`)
  stickButton.innerHTML = 'Stick'

  const chipsDiv = document.getElementById(`player${index}-chips`)
  chipsDiv.appendChild(playerCards)
  chipsDiv.appendChild(playerHandValue)
  chipsDiv.appendChild(drawCardButton)
  chipsDiv.appendChild(stickButton)

  displayPlayerCards()
}

function displayChips() {
  game.players.forEach((player, index) => {
    document.getElementById(`player${index}-chips`).innerHTML = `chips: ${player.getChips()}`
  })
}

function getPlayersChips() {
  const playersChips = []
    game.players.forEach((player) => {
      const chips = player.getChips() + player.getBets()[0]
      playersChips.push(chips)
    })
    return playersChips
}

function showChipsDifference(playersChips) {
  game.players.forEach((player, index) => {
    const difference = player.getChips() - playersChips[index]
    const betDiv =  document.getElementById(`player${index}-bet-button-div`)   
    difference > 0 ? betDiv.innerHTML = `Won: ${difference}` : betDiv.innerHTML = `Lost: ${difference}`
  })
}

function playDealersHand() {
  game.playDealersHand()
  document.getElementById('dealer-hand-value').innerHTML = game.handValue(game.dealer.showHand())
  displayAllCards()
  const playersCurrentChips = getPlayersChips()
  game.payWinners()
  displayChips()
  showChipsDifference(playersCurrentChips)
}

function createBlackJackGame() {
  setUpTable()
  game = new BlackJackGame(null, players)
  game.deck.shuffle()
  console.log(game.deck)
}

function nextRound() {
  game.dealer.discardHand()
  game.players.forEach((player) => {
    player.discardHands()
  })
  game.players.forEach((player, index) => {
    if(player.getChips() === 0) {
      game.removePlayer(index)
    }
  })
  document.getElementById('dealer-cards-div').innerHTML = ''
  document.getElementById('players-div').innerHTML = ''
  document.getElementById('dealer-hand-value').innerHTML = ''
  document.getElementById('next-button').setAttribute('style', 'display:none')
  setUpTable()
}

window.splitCards = splitCards
window.makeBet = makeBet
window.dealCards = dealCards
window.drawCard = drawCard
window.stick = stick
window.createBlackJackGame = createBlackJackGame
window.addNewPlayer = addNewPlayer
window.nextRound = nextRound
