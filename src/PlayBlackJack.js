const Player = require('./Player')
const Html = require('./Html')
const BlackJackGame = require('./BlackJackGame.js')
const players = []
let stickCounter = 0
let betCount = 0
let game
let roundNumber

function addPlayerByClick(event) {
  if (event.keyCode === 13) {
    event.preventDefault()
    addNewPlayer()
  }
}

function addNewPlayer() {
  const name = document.getElementById('nameInput')
  const chips = document.getElementById('chipsInput')
  if(chips.value !== '') {
    const player = new Player(name.value, chips.value)
    name.value = ''
    chips.value = 10000
    players.push(player)

    const li = Html.li()
    Html.appendChildren(li, [
      Html.textNode(`${player.getName()}  `),
      Html.textNode(`chips: ${player.getChips()}`)
    ])

    Html.setFocus('nameInput')
    Html.getAndAppendChild('playersList', li)
    Html.getAndSetAttributes('createGameButton', {
      class: 'inputButton',
      onclick: 'createBlackJackGame()'
    })
  } 
}

function setUpTable() {
  Html.getAndSetAttributes('table-div', { class: 'displayBlock' })
  Html.getAndSetAttributes('createGameForm', { class: 'hidden' })

  const playerRow = document.getElementById('players-div')

  const playerDivs = players.map((player, index) => {
    const playerChips = Html.div({
      id: `player${index}-chips`
    })
    playerChips.appendChild(Html.div({
      id: `player${index}-chips-text`,
      class: 'chipsText'
    }, `${player.getChips()}`))

    const elements = [
      Html.img({
        id: `player${index}-img`,
        type: 'button',
        onClick: `makeBet(${index})`,
        src: '../assets/avatars/player_avatar.png',
        class: 'playerImage cursor'
      }),

      Html.div({
        id: `player${index}-name`
      }, player.getName()),

      playerChips,

      Html.div({
        id: `player${index}-cards`
      }),
      Html.div({
        id: `player${index}-hand-value`,
        class: 'playerHandValue'
      }),

      Html.input({
        id: `player${index}-bet-input`,
        class: 'betInput',
        type: 'number',
        step: 500,
        value: 1000
      }),

      Html.div({
        id: `player${index}-bet-div`,
        class: 'bet-div'
      })
    ]
    
    const playerDiv = Html.div({
      id: `player${index}-div`,
      class: 'playerDiv displayInline'
    })
    Html.appendChildren(playerDiv, elements)
    return playerDiv
  })
  playerDivs.reverse().forEach((playerDiv) => {
    playerRow.appendChild(playerDiv)
  })
}

function splitCards() {
  game.splitHand()
  refreshChipsTotals()

  const player = game.getCurrentPlayer()
  const hand = game.players[player].showHand(1)
  document.getElementById(`player${player}-hand-value`).innerText = game.handValue(hand)

  const elements = [
    Html.div({
      id: `player${player}-split-cards`
    }),

    Html.div({
      id: `player${player}-split-hand-value`,
      class: 'playerHandValue'
    }, game.handValue(game.players[player].showHand(2))),

    Html.div({
      id: `player${player}-split-bet-div`
    }, `bet:${game.players[player].getBets()[0]}`),

    Html.button({
      id: `player${player}-split-drawCardButton`,
      class: 'button',
      onclick: `drawCard(${player},2)`
    }, 'Card'),

    Html.button({
      id: `player${player}-split-stickButton`,
      class: 'button',
      onclick: `stick(${player},2)`
    }, 'Stick')
  ]

  const chipsDiv = document.getElementById(`player${player}-chips`)
  Html.appendChildren(chipsDiv, elements)

  document.getElementById(`player${player}-doubleButton`).setAttribute('class', 'hidden')
  document.getElementById(`player${player}-splitButton`).setAttribute('class', 'hidden')
  displayPlayerCards()  
}

function makeBet(index) {
  const betInput = document.getElementById(`player${index}-bet-input`)
  const betDiv = document.getElementById(`player${index}-bet-div`)

  if(betInput.value !== '' && betInput.value > 0) {
    game.players[index].placeBet(Number(betInput.value))
    
    document.getElementById('hint-text').innerHTML = ''

    Html.getAndSetAttributes(`player${index}-img`, {
      onclick: '',
      class: 'playerImage'
    })

    betInput.setAttribute('class', 'hidden')
    betDiv.innerHTML = `Bet:${game.players[index].getBets()[0]}`
    betCount++
  }
  if(betCount === game.getNumberOfPlayers()) {
    if(game.deck.dealtCards.length === 0) {
      Html.getAndSetAttributes('hint-button', { class: 'displayInline'})
    } else {
      Html.getAndSetAttributes('hint-button', { class: 'hidden'})
      document.getElementById('hint-text').innerHTML = ''
    }
    Html.getAndSetAttributes(`deck-button`, {
      onclick: 'dealCards()',
      class: 'buttonImage cursor'
    })

    betCount = 0
  }
  refreshChipsTotals()
}

function makeBets(event) {
  if(event.button === 2) {
    game.players.forEach((player, index) => {
      if(player.getBets().length === 0) {
        makeBet(index)
      }
    })
    dealCards()
  }
}

function dealCards() {
  game.dealCards()
  displayDealerCard()
  displayPlayerCards()

  game.players.forEach((player, index) => {
    const drawCardButton = Html.button({
      id: `player${index}-drawCardButton`,
      class: 'button',
      onclick: `drawCard(${index}, 1)`
    })
    drawCardButton.innerHTML = 'Card'
    if(index !== 0) drawCardButton.setAttribute('class', 'hidden')

    const stickButton = Html.button({
      id: `player${index}-stickButton`,
      class: 'button',
      onclick: `stick(${index})`
    })
    stickButton.innerHTML = 'Stick'
    if(index !== 0) stickButton.setAttribute('class', 'hidden')

    const splitButton = Html.button({
      id: `player${index}-splitButton`,
      class: 'button',
      onclick: `splitCards()`
    })
    splitButton.innerHTML = 'Split'
    if(index !== 0) splitButton.setAttribute('class', 'hidden')

    const doubleButton = Html.button({
      id: `player${index}-doubleButton`,
      class: 'button',
      onclick: `doubleDown(${index})`
    })
    doubleButton.innerHTML = 'Double'
    if(index !== 0) doubleButton.setAttribute('class', 'hidden')

    const playerDiv = document.getElementById(`player${index}-div`)
    playerDiv.appendChild(drawCardButton)
    playerDiv.appendChild(stickButton) 

    if(player.getBets()[0] <= player.getChips()) {
      playerDiv.appendChild(doubleButton)
    }
    if(player.hands[0].isSplittable() && player.getChips() >= player.getBets()[0]) {
      playerDiv.appendChild(splitButton)
    }
    document.getElementById(`player${index}-hand-value`).innerHTML = game.handValue(game.players[index].showHand(1))
  })
  document.getElementById('deck-button').setAttribute('class', 'hidden')
  document.getElementById('hint-button').setAttribute('class', 'hidden')
  document.getElementById('hint-text').innerHTML = ''
}

function drawCard(index, hand = 1) {
  if(document.getElementById(`player${index}-doubleButton`)) {
    document.getElementById(`player${index}-doubleButton`).setAttribute('class', 'hidden')
  }
  if(document.getElementById(`player${index}-splitButton`)) {
    document.getElementById(`player${index}-splitButton`).setAttribute('class', 'hidden')
  }
  game.players[index].receiveCard(game.deck.dealCard(), hand)
  if(game.handValue(game.players[index].showHand(hand)) > 21) {
    stick(index, hand)
  }
  if(hand === 1) {
    const handOne = document.getElementById(`player${index}-hand-value`)
    handOne.innerHTML = game.handValue(game.players[index].showHand(1))
  }
  if(hand === 2) {
    const handTwo = document.getElementById(`player${index}-split-hand-value`)
    handTwo.innerHTML = game.handValue(game.players[index].showHand(2))
  }
  displayPlayerCards()
}

function stick(index, hand = 1) {
  if( document.getElementById(`player${index}-doubleButton`)) {
    document.getElementById(`player${index}-doubleButton`).setAttribute('class', 'hidden')
  }
  if(document.getElementById(`player${index}-splitButton`)) {
  document.getElementById(`player${index}-splitButton`).setAttribute('class', 'hidden')
  }
  const handAmount = game.players[index].hands.length
  if(hand === 1) {
    const handValue = document.getElementById(`player${index}-hand-value`)
    handValue.innerHTML = game.handValue(game.players[index].showHand(1))
    document.getElementById(`player${index}-drawCardButton`).setAttribute('class', 'hidden')
    document.getElementById(`player${index}-stickButton`).setAttribute('class', 'hidden')
    stickCounter++
  }
  if(hand === 2) {
     const splitHandValue = document.getElementById(`player${index}-split-hand-value`)
     splitHandValue.innerHTML = game.handValue(game.players[index].showHand(2)) 
    document.getElementById(`player${index}-split-drawCardButton`).setAttribute('class', 'hidden')
    document.getElementById(`player${index}-split-stickButton`).setAttribute('class', 'hidden')
    stickCounter++
  }
  if(index+1 === players.length && stickCounter === handAmount) {
    playDealersHand()
    document.getElementById('dealer-img').setAttribute('onclick', 'nextRound()')
    document.getElementById('dealer-img').setAttribute('class', 'buttonImage cursor')
    stickCounter = 0
  } else if(stickCounter === handAmount) {
    game.nextPlayer()
    document.getElementById(`player${index+1}-drawCardButton`).setAttribute('class', 'button displayInline')
    document.getElementById(`player${index+1}-stickButton`).setAttribute('class', 'button displayInline')
    if(document.getElementById(`player${index+1}-doubleButton`)) {
      document.getElementById(`player${index+1}-doubleButton`).setAttribute('class', 'button displayInline')
    }
      stickCounter = 0
    if(document.getElementById(`player${index+1}-splitButton`)) {
      document.getElementById(`player${index+1}-splitButton`).setAttribute('class', 'button displayBlock')
    }
  }
}

function doubleDown(index) {
  const player = game.players[index]
  const bet = player.removeBet()
  player.receiveChips(bet)
  player.placeBet(Number(bet * 2))
  player.receiveCard(game.deck.dealCard())
  document.getElementById(`player${index}-bet-div`).innerHTML = `Bet:${player.getBets()[0]}`
  document.getElementById(`player${index}-doubleButton`).setAttribute('class', 'hidden')
  stick(index)
  displayPlayerCards()
  refreshChipsTotals()
}

function playDealersHand() {
  game.playDealersHand()
  if(roundNumber === 1) {
    document.getElementById('hint-button').setAttribute('class', 'displayBlock')
  }
  document.getElementById('dealer-hand-value').innerHTML = game.handValue(game.dealer.showHand())
  document.getElementById('dealer-hand-value').setAttribute('class', '')
  displayAllCards()
  const playersChips = game.getPlayersChipsAndBets()

  game.payWinners()
  setHandValueColours()
  refreshChipsTotals()
  showChipsDifference(playersChips)
}

function showChipsDifference(playersChips) {
  game.players.forEach((player, index) => {
    const difference = player.getChips() - playersChips[index]
    const betDiv =  document.getElementById(`player${index}-bet-div`)
    const playerDiffDiv = document.createElement('div')
    if(difference < 0) {
      playerDiffDiv.innerHTML = `Lost:${difference}`
    } else if(difference > 0) {
      playerDiffDiv.innerHTML = `Won:${difference}`
    } else {
      playerDiffDiv.innerHTML = 'Break Even'
    }
    betDiv.appendChild(playerDiffDiv)
  })
}

function createBlackJackGame() {
  roundNumber = 1
  setUpTable()
  game = new BlackJackGame(null, players)
  game.deck.shuffle()
  document.getElementById('hint-button').setAttribute('class', 'displayBlock')
  console.log(game.deck)
}

function nextRound() {
  if(game.deck.size() < (game.getNumberOfPlayers()+1) * 8) {
    game.deck = game.createBlackJackDeck()
    window.alert('new cards!')
  }
  roundNumber++
  game.dealer.discardHand()
  game.players.forEach((player) => {
    player.discardHands()
  })
  game.players.forEach((player, index) => {
    if(player.getChips() === 0) {
      game.removePlayer(index)
    }
  })
  Html.clearHtml('dealer-cards-div', 'players-div', 'dealer-hand-value', 'hint-text')

  document.getElementById('deck-button').setAttribute('class', 'buttonImage displayInline')
  document.getElementById('deck-button').setAttribute('onclick', '')
  document.getElementById('hint-button').setAttribute('class', 'displayBlock')
  document.getElementById('dealer-img').setAttribute('onclick', '')
  document.getElementById('dealer-img').setAttribute('class', 'buttonImage')
  setUpTable()
}

function displayPlayerCards() {
  game.players.forEach((player, index) => {
    const playerCardsDiv = document.getElementById(`player${index}-cards`)
    playerCardsDiv.innerHTML = ''
    player.hands[0].cards.forEach((_, i ) => {
      const cardToAppend = Html.img({
        class: 'card',
        src: `${player.showHand()[i].image}`
      })
      playerCardsDiv.appendChild(cardToAppend)
    })
    if(document.getElementById(`player${index}-split-cards`)) {
      const playerCardsSplitDiv = document.getElementById(`player${index}-split-cards`)
      playerCardsSplitDiv.innerHTML = ''
      player.hands[1].cards.forEach((_, i ) => {
        const cardToAppend = Html.img({
          class: 'card',
          src: `${player.showHand(2)[i].image}`
        })
        playerCardsSplitDiv.appendChild(cardToAppend)
      })
    }
  })
}

function displayDealerCard() {
  const dealerCardsDiv = document.getElementById('dealer-cards-div')
  const cardBack = Html.img({
    id: 'dealer-card-back',
    class: 'card',
    src: game.deck.cardBackPath,
    onclick: 'changeCardColour()'
  })
  dealerCardsDiv.innerHTML = ''
  dealerCardsDiv.appendChild(cardBack)

  const cardToAppend = Html.img({
    class: 'card',
    src: `${game.dealer.showHand()[1].image}`
  })
  dealerCardsDiv.appendChild(cardToAppend)
}

function displayAllCards() {
  const dealerCardsDiv = document.getElementById('dealer-cards-div')
  dealerCardsDiv.innerHTML = ''
  for(let i=0; i<game.dealer.handSize(); i++) {
    const cardToAppend = Html.img({
      class: 'card',
      src: `${game.dealer.showHand()[i].image}`
    })
    
    dealerCardsDiv.appendChild(cardToAppend)
  }
  displayPlayerCards()
}


function refreshChipsTotals() {
  game.players.forEach((player, index) => {
    const chipsDivText = document.getElementById(`player${index}-chips-text`)
    chipsDivText.innerHTML = `${player.getChips()}`
  })
}

function changeCardColour() {
  game.changeCardColour()
}

function setHandValueColours() {
  const dealerHandValue = game.handValue(game.dealer.showHand())
  if(dealerHandValue > 21) {
    document.getElementById('dealer-hand-value').setAttribute('class', 'loseColour')
  }
  game.players.forEach((player, index) => {
    const valueDiv = document.getElementById(`player${index}-hand-value`)
    valueDiv.setAttribute('class', `playerHandValue ${player.getHandResult()}Colour`)
  })
  game.players.forEach((player, index) => {
    if(player.hands.length === 2) {
      const valueDiv = document.getElementById(`player${index}-split-hand-value`)
      valueDiv.setAttribute('class', `playerHandValue ${player.getSecondHandResult()}Colour`)
    }
  })
}

function displayTheCount() {
  let count = 0
  game.deck.dealtCards.forEach((card) => {
    if(card.value < 7) {
      count++
    } else if(card.value > 9) {
      count--
    }
  })
  const cardsInDeck = game.deck.size()
  const cardsTotal = game.deck.dealtCardsSize() + cardsInDeck
  const hintText = document.getElementById('hint-text')
  if(roundNumber === 1 && cardsInDeck !== cardsTotal) {
    hintText.innerHTML = 'Click the dealer to continue'
  } else if(roundNumber === 1 && game.players[0].getBets()[0]) {
    hintText.innerHTML = 'Click the deck to continue'
  } else if(roundNumber === 1 && game.players[0].getBets() !== []) {
    hintText.innerHTML = 'Right click the deck to place all bets and deal cards'
  } else {
    hintText.innerHTML = `The Count Is ${count} with ${cardsInDeck}/${cardsTotal} cards remaining  `
  }
}

window.changeCardColour = changeCardColour
window.makeBets = makeBets
window.addPlayerByClick = addPlayerByClick
window.doubleDown = doubleDown
window.displayTheCount = displayTheCount
window.splitCards = splitCards
window.makeBet = makeBet
window.dealCards = dealCards
window.drawCard = drawCard
window.stick = stick
window.createBlackJackGame = createBlackJackGame
window.addNewPlayer = addNewPlayer
window.nextRound = nextRound
