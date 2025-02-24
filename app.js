const startTheGameButton = document.querySelector(".startTheGameButton");
const gridContainer = document.querySelector(".gridContainer");
const tableContainer = document.querySelector(".tableContainer");
const deck = document.querySelector(".deck");

const gridItems = document.querySelectorAll(".gridItem");
const cardHolders = document.querySelectorAll(".cardHolder");

let cardCounter = 4; //start the game with 4 cards
let deckCounter = 16;

let firstHandOfGame = 1;

let cardsInDeck = [];



function animateCardMovement(card, target) {
    const cardRect = card.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    const deltaX = targetRect.left + targetRect.width / 2 - (cardRect.left + cardRect.width / 2);
    const deltaY = targetRect.top + targetRect.height / 2 - (cardRect.top + cardRect.height / 2);


    // Set transition for smooth movement
    card.style.transition = "transform 0.5s ease-out";

    card.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

    // Wait for animation to finish, then append to new parent
    setTimeout(() => {
        card.style.transition = ""; 
        card.style.transform = ""; 
        card.style.position = "static"; // Override absolute positioning
        target.appendChild(card); 
    }, 700); // Match transition duration otherwise it looks weird
}

function makeCardsPlayable(){
    let cardsOnHand = document.querySelectorAll(".onHand");

    // Add event listener to each card that is in hand
    for (let i = 0; i < cardsOnHand.length; i++) {
        cardsOnHand[i].style.animationDelay = "0s";
        
        // Only allow selecting cards that are still on hand
        if (cardsOnHand[i].classList.contains("onHand")) {
            cardsOnHand[i].addEventListener('click', function() {
                selectCard(cardsOnHand[i]);
            });
        }
    }


    // Add event listener to grid items for placing the selected card if only first hand
    if (firstHandOfGame){
        gridItems.forEach(gridItem => {
            gridItem.addEventListener('click', function() {
                if (document.querySelector('.clickedCard')) { // Ensure there's a selected card
                    let selectedCard = document.querySelector('.clickedCard');
                    placeCardOnGrid(selectedCard, gridItem); 
                    selectedCard.classList.remove('clickedCard');
                }
            });
        });
        firstHandOfGame = 0;
    }
    
}

function selectCard(card){ // TODO: diselect when the click is on random part of the screen

    document.querySelectorAll(".onHand").forEach(c => {
        if (c !== card) {
            c.classList.remove("clickedCard");
        }
    });

    card.classList.toggle("clickedCard");
}

function placeCardOnGrid(card, target) {


    if (!target.classList.contains("notEmptyGrid") && !target.classList.contains("onGrid")) // Prevent placing on full slots
    {
    const cardRect = card.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    
    const deltaX = targetRect.left + targetRect.width / 2 - (cardRect.left + cardRect.width / 2);
    const deltaY = targetRect.top + targetRect.height / 2 - (cardRect.top + cardRect.height / 2);

    // Clone the card to reset event listeners(cloning will remove event listeners so you can't click on them when they are on the grid)
    const newCard = card.cloneNode(true);
    newCard.classList.remove("onHand");

    
    card.parentNode.removeChild(card);

    // Place the card at its starting position in the body
    const parentRect = document.body.getBoundingClientRect();
    const startX = cardRect.left - parentRect.left;
    const startY = cardRect.top - parentRect.top;

    newCard.style.position = "absolute";
    newCard.style.left = `${startX}px`;
    newCard.style.top = `${startY}px`;
    newCard.style.transition = "left 0.45s ease-in, top 0.45s ease-in";
    document.body.appendChild(newCard);

    // Move the card to the grid slot
    setTimeout(() => {
        newCard.style.left = `${startX + deltaX}px`;
        newCard.style.top = `${startY + deltaY}px`;
    }, 10);// After animation, append to the grid container

    
    setTimeout(() => {
        card.classList.remove("clickedCard");
        newCard.style.position = "static"; // Reset for normal layout
        newCard.style.transition = "";
        target.appendChild(newCard);
        newCard.classList.remove("clickedCard");
        target.classList.add("notEmptyGrid"); // Mark grid as full

        setTimeout(() => {
            newCard.classList.add("onGrid"); // Flip the card after placing
        }, 100); // delay is there so the flip animation doesn't start mid flight to the grid

        cardCounter--;

        if ((cardCounter == 0) && !(deckCounter==0)){
            let cardHolderCounterTwo = 0;
            if (deckCounter >= 4){
                
                let delay = 0;

                for(let i = deckCounter-1; i >= deckCounter-4 ; --i){

                    setTimeout(() => {
                        animateCardMovement(cardsInDeck[i], cardHolders[cardHolderCounterTwo]);
                        cardHolderCounterTwo++;
                        setTimeout(() => {
                            
                            cardsInDeck[i].classList.add("onHand");
                            cardsInDeck.pop();
                            
                        }, 500);
                        
                        
                    }, delay);
                    
                    delay += 300;
                }
                cardCounter=4;
                setTimeout(() => {
                    makeCardsPlayable();
                }, delay+500);
                deckCounter = deckCounter - 4;
            }else{
                let delay = 0;
                
                for(let i = deckCounter-1; i >= 0 ; --i){
                    
                    setTimeout(() => {
                        animateCardMovement(cardsInDeck[i], cardHolders[cardHolderCounterTwo]);
                        cardHolderCounterTwo++;
                        setTimeout(() => {
                            
                            cardsInDeck[i].classList.add("onHand");
                            cardsInDeck.pop();
                        }, 500);
                        
                        
                    }, delay);
                    
                    delay += 300;
                }
                cardCounter=0;
                setTimeout(() => {
                    makeCardsPlayable();
                }, delay+500);
                deckCounter =0;
            }  

        }else if(deckCounter==0){
            console.log("finito")
        }
    }, 500);

   

}
}


startTheGameButton.addEventListener('click',function(){
    startTheGameButton.style.animation = 'none';
    void startTheGameButton.offsetWidth; // Reflow trigger
    
    var unshuffledDeck = ["F","F","F","F","F","O","O","O","O","O","O","X","X","X","X","X",];
    var currentDate = getDailySeed();

    startTheGameButton.style.animation = 'fadeOut 0.5s forwards';
    startTheGameButton.addEventListener('animationend', (event) => {
        startTheGameButton.classList.toggle('hidden');
        gridContainer.classList.toggle('hidden');
        tableContainer.classList.toggle('hidden');

        var cards = []; // Store created cards
        let shuffledDeck = shuffleDeck(unshuffledDeck,currentDate);



        for(let i=0;i<16;i++){
            const createdCard = document.createElement('div');
            createdCard.classList.add("card");


            const front = document.createElement("div");
            front.innerHTML = `
            <span class="material-symbols-outlined large-icon">
                group_work
            </span>
            `;
            front.classList.add("front");
            
        
            const back = document.createElement("div");
            back.classList.add("back");

            back.textContent = shuffledDeck[i];
        
            // Append front and back to the card
            createdCard.appendChild(front);
            createdCard.appendChild(back);

            createdCard.style.top = `${i * 5}px`;

            createdCard.style.animationDelay = `${i * 0.1}s`;

            deck.appendChild(createdCard);
            cards.push(createdCard);
            cardsInDeck.push(createdCard);
        }
        
        
        setTimeout(() => {
            let delay = 0;
            
            let howManyToReveal = getCardsToReveal()
            let revealPositions = getRevealPositions(howManyToReveal);

            let putTillThisManyCards = 15-howManyToReveal; 

            
            // Move random amount of cards to gridItems
            for (let z = 15; z > putTillThisManyCards; z--) {
                setTimeout(() => {
                    animateCardMovement(cards[z], gridItems[revealPositions[Math.abs(z-15)]]);
                    setTimeout(() => {
                        
                        setTimeout(() => {
                            cards[z].classList.add("onGrid"); // Flip the card after placing
                        }, 400);
                        
                        cardsInDeck.pop();
                        gridItems[revealPositions[Math.abs(z-15)]].classList.add("notEmptyGrid");

                    }, 500);
                    
                }, delay);
                delay += 250; 
            }
            deckCounter = deckCounter - (deckCounter - putTillThisManyCards - 1);
            // Move 4 cards to cardHolders 
            let cardHolderCounter = 0;
            for (let i = putTillThisManyCards; i > putTillThisManyCards-4; i--) {
                setTimeout(() => {
                    animateCardMovement(cards[i], cardHolders[cardHolderCounter]);
                    cardHolderCounter++;
                    setTimeout(() => {
                        cardsInDeck.pop();
                        cards[i].classList.add("onHand");
                    }, 500);
                    
                    
                }, delay);
                
                delay += 300;
                deckCounter--;
            }
            setTimeout(makeCardsPlayable, delay+500)

            
            
    }   , 16*140);
   
    
})

})

/* PSEUDO RANDOMIZATION FUNCTIONS*/

function seededRandom(seed) {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

function getDailySeed() {
    let date = new Date();
    return parseInt(`${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`); //+1 month because JS months are 0 based for some reason
}

function shuffleDeck(array, seed) {
    let shuffled = array.slice(); // Copy the array so we don't modify the original
    for (let i = shuffled.length - 1; i > 0; i--) {
        // Generate a new pseudo-random seed value 16 times so it is randomized. The numbers are random prime numbers to make the results seem randomized.
        seed = (seed * 9301 + 49297) % 233280; 

        // Scale the seed value to an index between 0 and i
        let j = Math.floor((seed / 233280) * (i + 1));

        // Swap elements at index i and j
        let placeHolder = shuffled[i];
        shuffled[i] = shuffled[j];
        shuffled[j] = placeHolder;

    }
    return shuffled;
}

// Select how many cards to reveal (1 to 3) using the seed
function getCardsToReveal() {
    let seed = getDailySeed();
    return Math.floor(seededRandom(seed) * 3) + 1; // 1 to 3
}

// Select positions to reveal the cards (on the 4x4 grid)
function getRevealPositions(count) {
    let seed = getDailySeed();
    let positions = [];

    for(let i = 0;i<16;i++){
        positions.push(i);
    }

    let shuffledPositions = shuffleDeck(positions, seed);
    //first to count is the revealing positions
    return shuffledPositions.slice(0, count);
}


