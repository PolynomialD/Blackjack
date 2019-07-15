const Html = require('./Html')
const BlackJackGame = require('./BlackJackGame')
const game = new BlackJackGame()
const Strategy = require('./Strategy')

const MAX_HAND_VALUE = 21

function addNewPlayer() {
  const name = document.getElementById('nameInput')
  const chips = document.getElementById('chipsInput')

  if(chips.value !== '') {
    game.addPlayer(name.value, chips.value)
    playSound('click2')

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

function placeBet(index) {
  const betInput = document.getElementById(`player${index}-bet-input`)
  const betDiv = document.getElementById(`player${index}-bet-div`)

  if(betInput.value !== '' && betInput.value > 0) {
    game.players[index].placeBet(Number(betInput.value))

    Html.getAndSetAttributes(`player${index}-img`, {
      onclick: '',
      class: 'playerImage'
    })

    betDiv.innerHTML = `Bet:${game.players[index].getBets()[0]}`
    Html.getAndHideElement(`player${index}-increase-bet-button`, `player${index}-decrease-bet-button`)
    Html.hideElement(betInput)
    game.addBetToCount()
    playSound('chips_stack1')
  }
  refreshChipsTotals()
}

function makeBets() {
  game.players.forEach((player, index) => {
    if(player.getBets().length === 0) {
      placeBet(index)
    }
  })
  if(game.getBetCount() === game.getNumberOfPlayers()) {
    dealCards()
  }
}

function createPlayerElements() {
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
        onClick: `placeBet(${index})`,
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

      Html.button({
        id: `player${index}-increase-bet-button`,
        class: 'displayBlock bet-button',
        onclick: `increaseBet(${index})`
      }, '+'),

      Html.input({
        id: `player${index}-bet-input`,
        class: 'betInput',
        value: 1000
      }),

      Html.button({
        id: `player${index}-decrease-bet-button`,
        class: 'displayBlock bet-button',
        onclick: `decreaseBet(${index})`
      }, '-'),

      Html.div({
        id: `player${index}-bet-div`,
        class: 'bet-div'
      }),

      Html.div({
        id: `player${index}-insurance-div`,
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

function createPlayerButtons() {
  game.players.forEach((player, index) => {
    const drawCardButton = Html.button({
      id: `player${index}-drawCardButton`,
      class: 'button',
      onclick: `drawCard(0)`
    })
    drawCardButton.innerHTML = 'Card'
    if(index !== 0) Html.hideElement(drawCardButton)

    const stickButton = Html.button({
      id: `player${index}-stickButton`,
      class: 'button',
      onclick: `stick(0)`
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
      onclick: `doubleDown()`
    })
    doubleButton.innerHTML = 'Double'
    if(index !== 0) Html.hideElement(doubleButton)

    const insuranceButton = Html.button({
      id: `player${index}-insuranceButton`,
      class: 'button',
      onclick: `insuranceBet()`
    })
    insuranceButton.innerHTML = 'Insurance'
    if(index !== 0) Html.hideElement(insuranceButton)

    const playerDiv = document.getElementById(`player${index}-div`)
    playerDiv.appendChild(drawCardButton)
    playerDiv.appendChild(stickButton) 

    if(player.canBetAgain()) {
      playerDiv.appendChild(doubleButton)
    }
    if(player.hands[0].isSplittable() && player.canBetAgain()) {
      playerDiv.appendChild(splitButton)
    }
    if(game.dealer.showsAnAce() && player.canHalfBetAgain()) {
      playerDiv.appendChild(insuranceButton)
    }
  })
}

function createSplitElements() {
  const index = game.getCurrentPlayerIndex()
  const elements = [
    Html.div({
      id: `player${index}-split-cards`
    }),
    
    Html.div({
      id: `player${index}-split-hand-value`,
      class: 'playerHandValue'
    }),
    
    Html.div({
      id: `player${index}-split-bet-div`,
      class: 'bet-div'
    }, `Bet:${game.players[index].getBets()[0]}`),
    
    Html.button({
      id: `player${index}-split-drawCardButton`,
      class: 'button',
      onclick: `drawCard(1)`
    }, 'Card'),

    Html.button({
      id: `player${index}-split-stickButton`,
      class: 'button',
      onclick: `stick(1)`
    }, 'Stick')
  ]

  Html.getAndAppendChildren(`player${index}-chips`, elements)
}

function drawCard(hand) {
  const player = game.getCurrentPlayer()
  if(checkOptimalMove(hand, 'card')) {
    playSound('ding', 0.5)
  }

  game.drawCard(hand)
  setHandValue(hand)
  hideAltButtons(hand)
  displayPlayerCards()

  if(player.hands[hand].isComplete()) {
    hideMainButtons(hand)
  }
  if(player.getStatus() === 'done') {
    nextPlayer()
  } else {
    playSound('card_place1')
  }
}

function stick(hand) {
  const player = game.getCurrentPlayer()
  const value = setHandValue(hand)
  if(value <= MAX_HAND_VALUE) playSound('click1')
  if(checkOptimalMove(hand, 'stick')) {
    playSound('ding', 0.5)
  }
  player.stick(hand)
  hideMainButtons(hand)
  hideAltButtons(hand)

  if(player.getStatus() === 'done') {
    nextPlayer()
  }
}

function doubleDown() {
  const index = game.getCurrentPlayerIndex()
  if(checkOptimalMove(0, 'double down')) {
    playSound('ding', 0.5)
  }

  game.doubleDown()

  document.getElementById(`player${index}-bet-div`).innerHTML = `Bet:${game.players[index].getBets()[0]}`
  hideMainButtons(0)
  hideAltButtons(0)

  const value = setHandValue(0)
  if(value <= MAX_HAND_VALUE) playSound('click1')

  displayPlayerCards()
  refreshChipsTotals()
  nextPlayer()
}

function nextPlayer() {
  const index = game.getCurrentPlayerIndex()
  if(index+1 === game.getNumberOfPlayers()) {
    playDealersHand()
  } else {
    game.nextPlayer()

    Html.checkForAndShowButton(`player${index+1}-drawCardButton`)
    Html.checkForAndShowButton(`player${index+1}-stickButton`)
    Html.checkForAndShowButton(`player${index+1}-doubleButton`)
    Html.checkForAndShowButton(`player${index+1}-splitButton`)
    Html.checkForAndShowButton(`player${index+1}-insuranceButton`)
  }
}

function insuranceBet() {
  const index = game.getCurrentPlayerIndex()
  const player = game.getCurrentPlayer()
  player.placeInsuranceBet()

  Html.getAndHideElement(`player${index}-insuranceButton`)
  document.getElementById(`player${index}-insurance-div`).innerHTML = `Insurance: ${player.getInsuranceBet()}`
  refreshChipsTotals()
}

function startGame() {
  playSound('card_fan1')
  Html.getAndSetAttributes('table-div', {
    class: 'displayBlock'
  })
  Html.getAndHideElement('createGameForm')
  createPlayerElements()
  game.deck.shuffle()
  if(game.getRound() !== 1) Html.showHintButton()
}

function dealCards() {
  playSound('fast_deal1')
  Html.getAndHideElement('deck-button','hint-button')
  Html.clearHtml('hint-text')
  game.dealCards()

  displayDealerCard()
  displayPlayerCards()
  createPlayerButtons()
  setHandValues()
}

function splitCards() {
  playSound('card_split1')
  if(checkOptimalMove(0, 'split')) {
    playSound('ding', 0.5)
  }
  game.splitHand()

  hideAltButtons(0)

  createSplitElements()
  refreshChipsTotals()
  displayPlayerCards()

  setHandValue(0)
  setHandValue(1)

  const player = game.getCurrentPlayer()
  if(player.getStatus() === 'done') {
    hideMainButtons(0)
    hideMainButtons(1)
    nextPlayer()
  }
}

function playDealersHand() {
  playSound('chips1')
  game.playDealersHand()
  Html.getAndSetAttributes('dealer-img', {
    onclick: 'nextRound()',
    class: 'buttonImage cursor'
  })

  game.payWinners()
  game.logWinnings()
  displayAllCards()
  setHandValueColours()
  refreshChipsTotals()
  showChipsDifference()
}

function nextRound() {
  playSound('card_fan1')
  game.nextRound()

  Html.getAndSetAttributes('table-div', {
    class: 'displayBlock'
  })
  Html.clearHtml('dealer-cards-div', 'players-div', 'dealer-hand-value')
  Html.getAndSetAttributes('deck-button', {
    class: 'buttonImage cursor',
    onclick: 'makeBets()'
  })
  Html.getAndSetAttributes('dealer-img', {
    class: 'buttonImage',
    onclick: ''
  })
  Html.showHintButton()
  createPlayerElements()
}

function hideMainButtons(hand) {
  const index = game.getCurrentPlayerIndex()
  const cards = (hand === 0) ? '' : '-split'
  Html.getAndHideElement(`player${index}${cards}-drawCardButton`, `player${index}${cards}-stickButton`)
}

function hideAltButtons(hand) {
  const index = game.getCurrentPlayerIndex()
  const cards = (hand === 0) ? '' : '-split'
  Html.checkForAndHideElement(`player${index}${cards}-doubleButton`)
  Html.checkForAndHideElement(`player${index}${cards}-splitButton`)
  Html.checkForAndHideElement(`player${index}${cards}-insuranceButton`)
}

function displayPlayerCards() {
  game.players.forEach((player, index) => {
    player.hands.forEach((hand, i) => {
      const cards = (i === 0) ? '' : '-split'
      Html.clearHtml(`player${index}${cards}-cards`)
      hand.cards.forEach((_, j ) => {
        const cardToAppend = Html.img({
          class: 'card',
          src: `${player.showHand(i)[j].image}`
        })
        Html.getAndAppendChild(`player${index}${cards}-cards`, cardToAppend)
      })
    })
  })
}

function displayDealerCard() {
  const cards = [
    Html.img({
      id: 'dealer-card-back',
      class: 'card',
      src: game.deck.getCardBackPath(),
      onclick: 'changeCardColour(); displayDealerCard()'
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

function showChipsDifference() {
  game.players.forEach((player, index) => {
    const difference = player.winnings
    const valueDiv = Html.div({
      class: 'bet-div'
    }, (difference < 0) ? `Lost: ${difference}` : (difference > 0) ? `Won: ${difference}` : 'Break Even')
    Html.getAndAppendChild(`player${index}-insurance-div`, valueDiv)
  })
}

function setHandValues() {
  game.players.forEach((player, position) => {
    player.hands.forEach((_, index) => {
      setHandValue(index, position)
    })
  })
}

function setHandValue(hand, index = game.getCurrentPlayerIndex()) {
  const cards = (hand === 0) ? '' : '-split'
  const handValue = game.players[index].handValue(hand)
  const handDiv = document.getElementById(`player${index}${cards}-hand-value`)
  handDiv.innerHTML = handValue

  if(handValue > MAX_HAND_VALUE) {
    handDiv.setAttribute('class', 'loseColour')
    playSound('groan1')
  }
  return handValue
}

function setHandValueColours() {
  const dealerHandValue = document.getElementById('dealer-hand-value')
  dealerHandValue.innerHTML = game.dealer.handValue()
  dealerHandValue.setAttribute('class', '')
  if(game.dealer.handValue() > MAX_HAND_VALUE) {
    dealerHandValue.setAttribute('class', 'loseColour')
  }
  game.players.forEach((player, index) => {
    Html.getAndSetAttributes(`player${index}-hand-value`, {
      class: `playerHandValue ${player.getHandResult(0)}Colour`
    })
    if(player.hands.length === 2) {
      Html.getAndSetAttributes(`player${index}-split-hand-value`, {
        class: `playerHandValue ${player.getHandResult(1)}Colour`
      })
    }
  })
}

function displayTheCount() {
  const cardsInDeck = game.deck.size()
  const dealtCards = game.deck.dealtCardsSize()
  const cardsTotal = dealtCards + cardsInDeck

  document.getElementById('hint-text').innerHTML =
  `The Count Is ${game.getCardCount()} with ${cardsInDeck}/${cardsTotal} cards remaining`
}

function addNewPlayerButton(click) {
  if (click.keyCode === 13) {
    click.preventDefault()
    addNewPlayer()
  }
}

function changeCardColour() {
  game.changeCardColour()
}

function increaseBet(index) {
  const input = document.getElementById(`player${index}-bet-input`)
  const currentBet = Number(input.value)
  input.value = currentBet + 500
}

function decreaseBet(index) {
  const input = document.getElementById(`player${index}-bet-input`)
  const currentBet = Number(input.value)
  input.value = currentBet - 500
}

function playSound(sound, option) {
  const path = `../assets/audio/${sound}.mp3`
  const audio = new Audio(path)
  if(option === 'loop') {
    audio.loop = true
  } else if(option) {
    audio.volume = option
  }
  audio.play()
}

function checkOptimalMove(hand, move) {
  const player = game.getCurrentPlayer()
  const dealerCardValue = game.dealer.hands[0].cards[1].value
  const playerValue = player.hands[hand].trueValue()
  const optimalMove = new Strategy().correctMove(dealerCardValue, playerValue)
  if(player.hands[hand].size() !== 2 && move === 'double down') {
    move = 'card'
  }
  return move === optimalMove
}

window.insuranceBet = insuranceBet
window.increaseBet = increaseBet
window.decreaseBet = decreaseBet
window.playSound = playSound
window.displayDealerCard = displayDealerCard
window.changeCardColour = changeCardColour
window.makeBets = makeBets
window.addNewPlayerButton = addNewPlayerButton
window.doubleDown = doubleDown
window.displayTheCount = displayTheCount
window.splitCards = splitCards
window.placeBet = placeBet
window.dealCards = dealCards
window.drawCard = drawCard
window.stick = stick
window.startGame = startGame
window.addNewPlayer = addNewPlayer
window.nextRound = nextRound
