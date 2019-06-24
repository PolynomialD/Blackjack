const Html = require('./Html')
const BlackJackGame = require('./BlackJackGame.js')
const game = new BlackJackGame()

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
    game.addPlayer(name.value, chips.value)

    const li = Html.li()
    Html.appendChildren(li, [
      Html.textNode(`${name.value}  `),
      Html.textNode(chips.value)
    ])
    name.value = ''
    chips.value = 10000
    Html.setFocus('nameInput')
    Html.getAndAppendChild('playersList', li)
    Html.getAndSetAttributes('createGameButton', {
      class: 'inputButton',
      onclick: 'startGame()'
    })
  }
}

function setUpTable() {
  Html.getAndSetAttributes('table-div', { class: 'displayBlock' })
  Html.getAndHideElement('createGameForm')

  const playerDivs = game.players.map((player, index) => {
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
    Html.getAndAppendChild('players-div', playerDiv)
  })
}

function splitCards() {
  game.splitHand()
  refreshChipsTotals()

  const player = game.getCurrentPlayer()
  const hand = game.players[player].showHand(0)
  document.getElementById(`player${player}-hand-value`).innerText = game.handValue(hand)

  const elements = [
    Html.div({
      id: `player${player}-split-cards`
    }),
    
    Html.div({
      id: `player${player}-split-hand-value`,
      class: 'playerHandValue'
    }, game.handValue(game.players[player].showHand(1))),
    
    Html.div({
      id: `player${player}-split-bet-div`
    }, `bet:${game.players[player].getBets()[0]}`),
    
    Html.button({
      id: `player${player}-split-drawCardButton`,
      class: 'button',
      onclick: `drawCard(${player},1)`
    }, 'Card'),

    Html.button({
      id: `player${player}-split-stickButton`,
      class: 'button',
      onclick: `stick(${player},1)`
    }, 'Stick')
  ]

  Html.getAndAppendChildren(`player${player}-chips`, elements)

  Html.getAndHideElement(`player${player}-doubleButton`)
  Html.getAndHideElement(`player${player}-splitButton`)
  displayPlayerCards()
}

function makeBet(index) {
  const betInput = document.getElementById(`player${index}-bet-input`)
  const betDiv = document.getElementById(`player${index}-bet-div`)

  if(betInput.value !== '' && betInput.value > 0) {
    game.players[index].placeBet(Number(betInput.value))

    Html.clearHtml('hint-text')

    Html.getAndSetAttributes(`player${index}-img`, {
      onclick: '',
      class: 'playerImage'
    })

    Html.hideElement(betInput)
    betDiv.innerHTML = `Bet:${game.players[index].getBets()[0]}`
    game.addBetToCount()
  }
  if(game.getBetCount() === game.getNumberOfPlayers()) {
    Html.getAndSetAttributes(`deck-button`, {
      onclick: 'dealCards()',
      class: 'buttonImage cursor'
    })
    if(game.deck.dealtCardsSize() === 0) {
      Html.showHintButton()
    } else {
      Html.getAndHideElement('hint-button')
      Html.clearHtml('hint-text')
    }
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
      onclick: `drawCard(${index}, 0)`
    })
    drawCardButton.innerHTML = 'Card'
    if(index !== 0) Html.hideElement(drawCardButton)

    const stickButton = Html.button({
      id: `player${index}-stickButton`,
      class: 'button',
      onclick: `stick(${index}, 0)`
    })
    stickButton.innerHTML = 'Stick'
    if(index !== 0) Html.hideElement(stickButton)

    const splitButton = Html.button({
      id: `player${index}-splitButton`,
      class: 'button',
      onclick: `splitCards()`
    })
    splitButton.innerHTML = 'Split'
    if(index !== 0) Html.hideElement(splitButton)

    const doubleButton = Html.button({
      id: `player${index}-doubleButton`,
      class: 'button',
      onclick: `doubleDown(${index})`
    })
    doubleButton.innerHTML = 'Double'
    if(index !== 0) Html.hideElement(doubleButton)

    const playerDiv = document.getElementById(`player${index}-div`)
    playerDiv.appendChild(drawCardButton)
    playerDiv.appendChild(stickButton) 

    if(player.getBets()[0] <= player.getChips()) {
      playerDiv.appendChild(doubleButton)
    }
    if(player.hands[0].isSplittable() && player.getChips() >= player.getBets()[0]) {
      playerDiv.appendChild(splitButton)
    }
    document.getElementById(`player${index}-hand-value`).innerHTML = game.handValue(game.players[index].showHand(0))
  })
  Html.getAndHideElement('deck-button','hint-button')
  Html.clearHtml('hint-text')
}

function drawCard(index, hand) {
  Html.checkForAndHideElement(`player${index}-doubleButton`)
  Html.checkForAndHideElement(`player${index}-splitButton`)

  game.players[index].receiveCard(game.deck.dealCard(), hand)
  if(game.handValue(game.players[index].showHand(hand)) > 21) {
    stick(index, hand)
  }
  if(hand === 0) {
    const handOne = document.getElementById(`player${index}-hand-value`)
    handOne.innerHTML = game.handValue(game.players[index].showHand(0))
  }
  if(hand === 1) {
    const handTwo = document.getElementById(`player${index}-split-hand-value`)
    handTwo.innerHTML = game.handValue(game.players[index].showHand(1))
  }
  displayPlayerCards()
}
let stickCount = 0   // todo
function stick(index, hand) {
  Html.checkForAndHideElement(`player${index}-doubleButton`)
  Html.checkForAndHideElement(`player${index}-splitButton`)

  const handAmount = game.players[index].hands.length
  if(hand === 0) {
    const handValue = game.handValue(game.players[index].showHand(0))
    document.getElementById(`player${index}-hand-value`).innerHTML = handValue
    if(handValue > 21) {
      Html.getAndSetAttributes(`player${index}-hand-value`, { class: 'loseColour' })
    }
    Html.getAndHideElement(`player${index}-drawCardButton`)
    Html.getAndHideElement(`player${index}-stickButton`)
    stickCount++
  }
  if(hand === 1) {
     const splitHandValue = game.handValue(game.players[index].showHand(1))
     document.getElementById(`player${index}-split-hand-value`).innerHTML = splitHandValue
     if(splitHandValue > 21) {
      Html.getAndSetAttributes(`player${index}-split-hand-value`, { class: 'loseColour' })
     }
     Html.getAndHideElement(`player${index}-split-drawCardButton`)
     Html.getAndHideElement(`player${index}-split-stickButton`)
    stickCount++
  }
  if(index+1 === game.getNumberOfPlayers() && stickCount === handAmount) {
    playDealersHand()
    stickCount = 0
    Html.getAndSetAttributes('dealer-img', {
      onclick: 'nextRound()',
      class: 'buttonImage cursor'
    })
  } else if(stickCount === handAmount) {
    game.nextPlayer()
    stickCount = 0
    
    Html.getAndShowButton(`player${index+1}-drawCardButton`)
    Html.getAndShowButton(`player${index+1}-stickButton`)

    Html.checkForAndShowButton(`player${index+1}-doubleButton`)
    Html.checkForAndShowButton(`player${index+1}-splitButton`)
  }
}

function doubleDown(index) {
  const player = game.players[index]  //todo
  const bet = player.removeBet()
  player.receiveChips(bet)
  player.placeBet(Number(bet * 2))
  player.receiveCard(game.deck.dealCard())
  document.getElementById(`player${index}-bet-div`).innerHTML = `Bet:${player.getBets()[0]}`
  Html.getAndHideElement(`player${index}-doubleButton`)
  stick(index,0)
  displayPlayerCards()
  refreshChipsTotals()
}

function playDealersHand() {
  game.playDealersHand()
  const dealerHandValue = document.getElementById('dealer-hand-value')
  dealerHandValue.innerHTML = game.handValue(game.dealer.showHand())
  dealerHandValue.setAttribute('class', '')
  displayAllCards()
  const playersChips = game.getPlayersChipsAndBets()
  if(game.getRound() === 1) Html.showHintButton()

  game.payWinners()
  setHandValueColours()
  refreshChipsTotals()
  showChipsDifference(playersChips)
}

function showChipsDifference(playersChips) {
  game.players.forEach((player, index) => {
    const difference = player.getChips() - playersChips[index]
    const valueDiv = document.createElement('div')
    valueDiv.innerHTML = (difference < 0) ? `Lost:${difference}` : (difference > 0) ? `Won:${difference}` : 'Break Even'
    Html.getAndAppendChild(`player${index}-bet-div`, valueDiv)
  })
}

function startGame() {
  setUpTable()
  game.deck.shuffle()
  Html.showHintButton()
  console.log(game.deck)
}

function nextRound() {
  game.nextRound()
  Html.clearHtml('dealer-cards-div', 'players-div', 'dealer-hand-value', 'hint-text')
  Html.getAndSetAttributes('deck-button', {
    class: 'buttonImage displayInline',
    onclick: ''
  })
  Html.getAndSetAttributes('dealer-img', {
    class: 'buttonImage',
    onclick: ''
  })
  Html.showHintButton()
  setUpTable()
}

function displayPlayerCards() {
  game.players.forEach((player, index) => {
    Html.clearHtml(`player${index}-cards`)
    player.hands[0].cards.forEach((_, i ) => {
      const cardToAppend = Html.img({
        class: 'card',
        src: `${player.showHand(0)[i].image}`
      })
      Html.getAndAppendChild(`player${index}-cards`, cardToAppend)
    })
    if(document.getElementById(`player${index}-split-cards`)) {
      Html.clearHtml(`player${index}-split-cards`)
      player.hands[1].cards.forEach((_, i ) => {
        const cardToAppend = Html.img({
          class: 'card',
          src: `${player.showHand(1)[i].image}`
        })
        Html.getAndAppendChild(`player${index}-split-cards`, cardToAppend)
      })
    }
  })
}

function displayDealerCard() {
  const cards = [
    Html.img({
      id: 'dealer-card-back',
      class: 'card',
      src: game.deck.cardBackPath,
      onclick: 'changeCardColour()'
    }),
    
    Html.img({
      class: 'card',
      src: `${game.dealer.showHand()[1].image}`
    })
  ]

  Html.clearHtml('dealer-cards-div')
  Html.getAndAppendChildren('dealer-cards-div', cards)
}

function displayAllCards() {
  Html.clearHtml('dealer-cards-div')
  for(let i=0; i<game.dealer.handSize(); i++) {
    const cardToAppend = Html.img({
      class: 'card',
      src: `${game.dealer.showHand()[i].image}`
    })
    Html.getAndAppendChild('dealer-cards-div', cardToAppend)
  }
  displayPlayerCards()
}


function refreshChipsTotals() {
  game.players.forEach((player, index) => {
    document.getElementById(`player${index}-chips-text`).innerHTML = `${player.getChips()}`
  })
}

function changeCardColour() {
  game.changeCardColour()
}

function setHandValueColours() {
  if(game.handValue(game.dealer.showHand()) > 21) {
    document.getElementById('dealer-hand-value').setAttribute('class', 'loseColour')
  }
  game.players.forEach((player, index) => {
    document.getElementById(`player${index}-hand-value`).setAttribute('class', `playerHandValue ${player.getHandResult()}Colour`)
  })
  game.players.forEach((player, index) => {
    if(player.hands.length === 2) {
      document.getElementById(`player${index}-split-hand-value`).setAttribute('class', `playerHandValue ${player.getSecondHandResult()}Colour`)
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
  if(game.getRound() === 1 && game.deck.dealtCardsSize() === 0) {
    hintText.innerHTML = 'Click the dealer to continue'
  } else if(game.getRound() === 1 && game.players[0].getBets()[0]) {
    hintText.innerHTML = 'Click the deck to continue'
  } else if(game.getRound() === 1 && game.players[0].getBets() !== []) {
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
window.startGame = startGame
window.addNewPlayer = addNewPlayer
window.nextRound = nextRound
