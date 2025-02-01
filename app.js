const startTheGameButton = document.querySelector(".startTheGameButton");
const gridContainer = document.querySelector(".gridContainer");
const tableContainer = document.querySelector(".tableContainer");
const deck = document.querySelector(".deck");

const gridItems = document.querySelectorAll(".gridItem");
const cardHolders = document.querySelectorAll(".cardHolder");


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
        if (!cardsOnHand[i].classList.contains("onGrid")) {
            cardsOnHand[i].addEventListener('click', function() {
                selectCard(cardsOnHand[i]);
            });
        }
    }

    // Add event listener to grid items for placing the selected card
    gridItems.forEach(gridItem => {
        gridItem.addEventListener('click', function() {
            if (document.querySelector('.clickedCard')) { // Ensure there's a selected card
                let selectedCard = document.querySelector('.clickedCard');
                placeCardOnGrid(selectedCard, gridItem); 
                
                selectedCard.classList.remove('clickedCard');
                selectedCard.classList.add('onGrid');
                
                selectedCard.style.pointerEvents = 'none'; 
            }
        });
    });
}

function selectCard(card){ // TODO: diselect when the click is on random part of the screen

    document.querySelectorAll(".onHand").forEach(c => {
        if (c !== card) {
            c.classList.remove("clickedCard");
        }
    });

    card.classList.toggle("clickedCard");
}

function placeCardOnGrid(card, target) { //TODO: THERE IS A BUG WHERE YOU CAN PLACE A CARD ON GRIDS THAT WENT FULL AFTER GAME START
    if (target.classList.contains("notEmptyGrid")) return; // Prevent placing on full slots
    
    const cardRect = card.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    
    const deltaX = targetRect.left + targetRect.width / 2 - (cardRect.left + cardRect.width / 2);
    const deltaY = targetRect.top + targetRect.height / 2 - (cardRect.top + cardRect.height / 2);

    // Clone the card to reset event listeners(cloning will remove event listeners so you can't click on them when they are on the grid)
    const newCard = card.cloneNode(true);
    newCard.classList.remove("onHand");
    newCard.classList.add("onGrid");
    
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
    }, 10);

    // After animation, append to the grid container
    setTimeout(() => {
        card.classList.remove("clickedCard");
        newCard.style.position = "static"; // Reset for normal layout
        newCard.style.transition = "";
        target.appendChild(newCard);
        newCard.classList.remove("clickedCard");
        target.classList.add("notEmptyGrid"); // Mark grid as full
        
    }, 450);
}


startTheGameButton.addEventListener('click',function(){
    startTheGameButton.style.animation = 'none';
    void startTheGameButton.offsetWidth; // Reflow trigger
    
    startTheGameButton.style.animation = 'fadeOut 0.5s forwards';
    startTheGameButton.addEventListener('animationend', (event) => {
        startTheGameButton.classList.toggle('hidden');
        gridContainer.classList.toggle('hidden');
        tableContainer.classList.toggle('hidden');

        let cards = []; // Store created cards

        for(let i=0;i<16;i++){
            const createdCard = document.createElement('div');
            createdCard.classList.add("card");

            createdCard.style.top = `${i * 5}px`;

            createdCard.style.animationDelay = `${i * 0.1}s`;

            deck.appendChild(createdCard);
            cards.push(createdCard);
        }
        
        
        setTimeout(() => {
            let delay = 0;

            // Move 3 cards to gridItems (TODO: MAKE IT RANDOM AMOUNT OF CARDS AND POSITIONS)
            for (let z = 15; z > 12; z--) {
                setTimeout(() => {
                    animateCardMovement(cards[z], gridItems[z]);
                    setTimeout(() => {
                        cards[z].classList.add("onGrid");
                        gridItems[z].classList.add("notEmptyGrid");
                    }, 500);
                }, delay);
                delay += 250; 
            }
        
            // Move 4 cards to cardHolders 
            let cardHolderCounter = 0;
            for (let i = 12; i > 8; i--) {
                setTimeout(() => {
                    animateCardMovement(cards[i], cardHolders[cardHolderCounter]);
                    cardHolderCounter++;
                    setTimeout(() => {
                        cards[i].classList.add("onHand");
                    }, 500);
                    
                    
                }, delay);
                
                delay += 300;
            }
            setTimeout(makeCardsPlayable, delay+500)
            
    }   , 16*160);
   
    
})

})



