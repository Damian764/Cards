const cardsContainer = document.querySelector('.cards__container');
const values = [
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    'J',
    'Q',
    'K',
    'A'
];
const suits = [
    'heart',
    'diamond',
    'club',
    'spade'
]
const deckSize = values.length * suits.length;
let isDrawn = [];
function generateCards() {
    if (isDrawn.length >= deckSize) {
        alertUser('All cards have been drawn. Clear the board to generate them again', 'Error');
        return;
    }
    const generateAmount = document.getElementById('cardsToGenerate').value;
    for (let i = 0; i < generateAmount; i++) {
        let cardValue = getRandomEntryFromArray(values);
        let cardSuit = getRandomEntryFromArray(suits);
        while (isDrawn.indexOf(cardSuit + cardValue) !== -1) {
            cardValue = getRandomEntryFromArray(values);
            cardSuit = getRandomEntryFromArray(suits);
        }
        cardsContainer.appendChild(generateSingleCard(i, cardValue, cardSuit));
        isDrawn.push(cardSuit + cardValue);
    }
}

function getRandomEntryFromArray(array) {
    if (!Array.isArray(array)) throw new Error('getRandomEntryFromArray argument must be an array');
    return array[Math.floor(Math.random() * array.length)];
}

function generatePip(index) {
    const pip = document.createElement('div');
    pip.classList.add('pip');
    return pip;
}

function shuffleCards() {
    const cards = [...cardsContainer.querySelectorAll('.card-block')];
    if (cards.length < 1) {
        alertUser('There is no cards to shuffle', 'warning');
    }
    for (let i = 0; i < cards.length; i++) {
        const index = Math.floor(Math.random() * cards.length);
        const card = cards[index];
        cardsContainer.appendChild(card);
        cards.splice(index, 1);
    }
}
function showAllValuesAndSuits() {
    let index = 0;
    for (let j = 0; j < suits.length; j++) {
        for (let i = 0; i < values.length; i++) {
            cardsContainer.appendChild(generateSingleCard(index, values[i], suits[j]));
            index++;
        }
    }
}

function clearBoard() {
    const cards = [...cardsContainer.querySelectorAll('.card-block')];
    for (let i = cards.length - 1; i >= 0; i--) {
        cards[i].style.transitionDelay = ((cards.length - i) * 0.1) + 's';
        setTimeout(() => {
            cards[i].addEventListener('transitionend', () => {
                document.querySelector('#card-count').textContent = i;
                cards[i].remove()
            });
            cards[i].style.opacity = '0';
        }, 100);
    }
    isDrawn = [];
}
function alertUser(message, type) {
    const popup = document.createElement('div');
    popup.style.fontSize = '16px';
    popup.style.borderRadius = '1em';
    popup.style.boxShadow = '0 0 50px rgb(0 0 0 / 30%)';
    popup.style.padding = '1em';
    popup.style.width = 'min(100%,500px)';
    popup.style.height = 'min(50%,250px)';
    popup.style.position = 'fixed';
    popup.style.top = '-100%';
    popup.style.left = '50%';
    popup.style.transform = 'translateX(-50%)';
    popup.style.backgroundColor = '#fff';
    popup.style.transition = '0.3s';
    const heading = document.createElement('h2');
    heading.textContent = type;
    heading.style.textAlign = 'center';
    heading.style.textTransform = 'uppercase';
    heading.style.borderBottom = '1px solid lightgray';
    popup.appendChild(heading);
    const messageContainer = document.createElement('div');
    messageContainer.style.border = '1px solid lightgray';
    messageContainer.style.borderRadius = '1em';
    messageContainer.style.textAlign = 'center';
    messageContainer.style.padding = '0.5em';
    messageContainer.textContent = message;
    popup.appendChild(messageContainer);
    document.body.appendChild(popup);
    setTimeout(() => {
        popup.style.top = '0.75em';
    }, 100)
    setTimeout(() => {
        popup.addEventListener('transitionend', () => popup.remove());
        popup.style.opacity = 0;
        popup.style.top = '-50%';
    }, 3000)

}
function generateSingleCard(index, value, suit) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.setAttribute('data-value', value);
    card.setAttribute('data-suit', suit);
    const pips = document.createElement('div');
    pips.classList.add('pips');
    card.appendChild(pips);
    if (typeof value === 'number') {
        for (let i = 0; i < value; i++) {
            pips.appendChild(generatePip(i));
        }
    } else {
        pips.appendChild(generatePip());
    }
    const cardInfo = document.createElement('div');
    cardInfo.classList.add('card-infos');
    card.appendChild(cardInfo);
    const cardInfoValue = document.createElement('div');
    cardInfoValue.classList.add('card-value');
    cardInfoValue.textContent = value;
    cardInfo.appendChild(cardInfoValue);
    const cardInfoReversed = cardInfoValue.cloneNode(true);
    cardInfoReversed.classList.add('reversed');
    cardInfo.appendChild(cardInfoReversed);
    const cardContainer = document.createElement('div');
    cardContainer.classList.add('card-container');
    cardContainer.addEventListener('click', () => {
        if (cardContainer.classList.contains('turning')) return
        cardContainer.classList.add('turning');
    });
    cardContainer.addEventListener('dblclick', () => {
        if (cardContainer.classList.contains('flipping')) return
        cardContainer.classList.add('flipping');
    });
    cardContainer.addEventListener('animationend', () => {
        if (cardContainer.classList.contains('turning')) {
            setTimeout(() => {
                cardContainer.classList.remove('turning');
            }, 300)
        }
        if (cardContainer.classList.contains('flipping')) {
            setTimeout(() => {
                cardContainer.classList.remove('flipping');
            }, 300)
        }
    })
    const backface = document.createElement('div');
    backface.classList.add('card-backface');
    cardContainer.appendChild(card);
    cardContainer.appendChild(backface);
    const cardBlock = document.createElement('div');
    cardBlock.classList.add('card-block');
    cardBlock.appendChild(cardContainer);
    cardBlock.style.transitionDelay = (index * 0.1) + 's';
    cardBlock.addEventListener('transitionend', () => {
        document.querySelector('#card-count').textContent = [...cardsContainer.querySelectorAll('.card-block')].length;
    })
    setTimeout(() => {
        cardBlock.classList.add('visible');
    }, 100);
    return cardBlock;
}

function limitInput(input) {
    const max = parseInt(input.max);
    const min = parseInt(input.min);
    const value = parseInt(input.value);
    console.log(max, min, value)
    if (value >= max) {
        input.value = max;
    }
    if (value <= min) {
        input.value = min;
    }
}
function updateGenerateButton(input) {
    document.getElementById('generate-amount').innerText = input.value;
}