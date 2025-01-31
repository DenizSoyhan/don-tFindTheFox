const startTheGameButton = document.querySelector(".startTheGameButton");
const gridContainer = document.querySelector(".gridContainer");
const tableContainer = document.querySelector(".tableContainer");
const deck = document.querySelector(".deck");

const gridItems = document.querySelectorAll(".gridItem");
const cardHolders = document.querySelectorAll(".cardHolder");

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
                }, delay);
                delay += 250; 
            }
        
            // Move 4 cards to cardHolders 
            let cardHolderCounter = 0;
        for (let i = 12; i > 8; i--) {
            setTimeout(() => {
                animateCardMovement(cards[i], cardHolders[cardHolderCounter]);
                cardHolderCounter++;
            }, delay);
            delay += 300;
        }


            function animateCardMovement(card, target) {
                const cardRect = card.getBoundingClientRect();
                const targetRect = target.getBoundingClientRect();
            
                const deltaX = targetRect.left + targetRect.width / 2 - (cardRect.left + cardRect.width / 2);
                const deltaY = targetRect.top + targetRect.height / 2 - (cardRect.top + cardRect.height / 2);
            
            
                // Set transition for smooth movement
                card.style.transition = "transform 0.5s ease-out";
            
                // Move the card using transform
                card.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            
                // Wait for animation to finish, then append to new parent
                setTimeout(() => {
                    card.style.transition = ""; // Remove transition
                    card.style.transform = ""; // Reset transform
                    card.style.position = "static"; // Override absolute positioning
                    target.appendChild(card); 




                }, 700); // Match transition duration otherwise it looks weird
        }
    }   , 16*160);
        console.log(deck);
        
})
})

