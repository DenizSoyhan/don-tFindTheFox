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
    
    startTheGameButton.style.animation = 'fadeOut 0.5s forwards';
    startTheGameButton.addEventListener('animationend', (event) => {
        startTheGameButton.classList.toggle('hidden');
        gridContainer.classList.toggle('hidden');
        tableContainer.classList.toggle('hidden');

        var cards = []; // Store created cards

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
        
            // TODO: Assign random letters to the back (F, O, X)
            const letters = ["F", "O", "X"];
            back.textContent = letters[i % 3]; 
        
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
            let putTillThisManyCards = 12 // (TODO: MAKE IT RANDOM AMOUNT OF CARDS AND POSITIONS)
            // Move 3 cards to gridItems
            for (let z = 15; z > putTillThisManyCards; z--) {
                setTimeout(() => {
                    animateCardMovement(cards[z], gridItems[z]);
                    setTimeout(() => {
                        
                        setTimeout(() => {
                            cards[z].classList.add("onGrid"); // Flip the card after placing
                        }, 400);
                        
                        cardsInDeck.pop();
                        gridItems[z].classList.add("notEmptyGrid");
                    }, 500);
                }, delay);
                delay += 250; 
            }
            deckCounter = deckCounter - (deckCounter - putTillThisManyCards - 1);
            // Move 4 cards to cardHolders 
            let cardHolderCounter = 0;
            for (let i = putTillThisManyCards; i > 8; i--) {
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



