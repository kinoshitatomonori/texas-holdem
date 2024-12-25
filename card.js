const suits = ['♥', '♦', '♣', '♠'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
let deck = [];
let playerHands = [];
let communityCards = [];
let phase = 0; // 0: Pre-flop, 1: Flop, 2: Turn, 3: River
let inputPlayers = 0;

const playerHandsDiv = document.getElementById('playerHands');
const communityCardsDiv = document.getElementById('communityCards');
const nextPhaseButton = document.getElementById('nextPhaseButton');

function advancedShuffle(deck) {
  // Fisher-Yates Shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  // Additional random block swaps
  for (let k = 0; k < 3; k++) { // Repeat block swaps multiple times
    const blockSize = Math.floor(deck.length / 4); // Divide deck into 4 parts
    const start1 = Math.floor(Math.random() * (deck.length - blockSize));
    const start2 = Math.floor(Math.random() * (deck.length - blockSize));

    for (let i = 0; i < blockSize; i++) {
      const idx1 = (start1 + i) % deck.length;
      const idx2 = (start2 + i) % deck.length;
      [deck[idx1], deck[idx2]] = [deck[idx2], deck[idx1]];
    }
  }

  return deck;
}

function initializeDeck() {
  deck = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ rank, suit });
    }
  }

  // Use the advanced shuffle method
  deck = advancedShuffle(deck);
}


//function initializeDeck() {
//  deck = [];
//  for (const suit of suits) {
//    for (const rank of ranks) {
//      deck.push({ rank, suit });
//    }
//  }
//
//  // First shuffle
//  deck = deck.sort(() => Math.random() - 0.5);
//
//  // Fisher-Yates Shuffle for additional randomness
//  for (let i = deck.length - 1; i > 0; i--) {
//    const j = Math.floor(Math.random() * (i + 1));
//    [deck[i], deck[j]] = [deck[j], deck[i]];
//  }
//}

function dealCards(inputPlayers) {
  initializeDeck();
  playerHands = [];
  communityCards = [];
  phase = 0;
  for (let i = 0; i < inputPlayers; i++) {
    playerHands.push([deck.pop(), deck.pop()]);
  }
}

function renderPlayerHands() {
  playerHandsDiv.innerHTML = '';
  playerHands.forEach((hand, index) => {
    const playerDiv = document.createElement('div');
    playerDiv.classList.add('player');

    const playerLabel = document.createElement('div');
    playerLabel.textContent = `Player ${index + 1}`;
    playerLabel.style.fontWeight = 'bold';
    playerDiv.appendChild(playerLabel);

    hand.forEach(card => {
      const cardDiv = document.createElement('div');
      cardDiv.classList.add('card', 'hidden');

      const cardText = document.createElement('span');
      cardText.textContent = `${card.rank}${card.suit}`;
      cardDiv.appendChild(cardText);

      cardDiv.addEventListener('click', () => cardDiv.classList.toggle('hidden'));

      // Add suit-specific color
      if (card.suit === '♥') cardDiv.classList.add('heart');
      else if (card.suit === '♦') cardDiv.classList.add('diamond');
      else if (card.suit === '♣') cardDiv.classList.add('club');
      else if (card.suit === '♠') cardDiv.classList.add('spade');

      playerDiv.appendChild(cardDiv);
    });
    playerHandsDiv.appendChild(playerDiv);
  });
}

function renderCommunityCards() {
  communityCardsDiv.innerHTML = '';
  communityCards.forEach(card => {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');

    const cardText = document.createElement('span');
    cardText.textContent = `${card.rank}${card.suit}`;
    cardDiv.appendChild(cardText);

    // Add suit-specific color
    if (card.suit === '♥') cardDiv.classList.add('heart');
    else if (card.suit === '♦') cardDiv.classList.add('diamond');
    else if (card.suit === '♣') cardDiv.classList.add('club');
    else if (card.suit === '♠') cardDiv.classList.add('spade');

    communityCardsDiv.appendChild(cardDiv);
  });
}

function InitializePlayers() {
  const numPlayers = parseInt(prompt('Enter number of players (2-10):'));
  if (numPlayers >= 2 && numPlayers <= 10) {
    inputPlayers = numPlayers
    dealCards(numPlayers);
    renderPlayerHands();
    renderCommunityCards();
    nextPhaseButton.disabled = false;
  } else {
    alert('Please enter a valid number of players (2-10).');
  }
}

function revealNextPhase() {
  if (phase === 0) {
    // Flop
    communityCards.push(deck.pop(), deck.pop(), deck.pop());
  } else if (phase === 1) {
    // Turn
    communityCards.push(deck.pop());
  } else if (phase === 2) {
    // River
    communityCards.push(deck.pop());
  }
  phase++;
  renderCommunityCards();
  if (phase > 3) {
    nextPhaseButton.disabled = true;
  }
}

document.getElementById('dealButton').addEventListener('click', () => {
  //const numPlayers = parseInt(prompt('Enter number of players (2-10):', '2'));
  if (inputPlayers >= 2 && inputPlayers <= 10) {
    dealCards(inputPlayers);
    renderPlayerHands();
    renderCommunityCards();
    nextPhaseButton.disabled = false;
  } else {
    alert('Please enter a valid number of players (2-10).');
  }
});

document.getElementById('nextPhaseButton').addEventListener('click', revealNextPhase);

document.getElementById('resetButton').addEventListener('click', () => {
  playerHands = [];
  communityCards = [];
  phase = 0;
  playerHandsDiv.innerHTML = '';
  communityCardsDiv.innerHTML = '';
  nextPhaseButton.disabled = true;
});

InitializePlayers();