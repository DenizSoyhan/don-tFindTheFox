const startTheGameButton = document.querySelector(".startTheGameButton");
const gridContainer = document.querySelector(".gridContainer");
const tableContainer = document.querySelector(".tableContainer");
const deck = document.querySelector(".deck");

startTheGameButton.addEventListener('click',function(){
    startTheGameButton.style.animation = 'none';
    void startTheGameButton.offsetWidth; // Reflow trigger
    
    startTheGameButton.style.animation = 'fadeOut 0.5s forwards';
    startTheGameButton.addEventListener('animationend', (event) => {
        startTheGameButton.classList.toggle('hidden');
        gridContainer.classList.toggle('hidden');
        tableContainer.classList.toggle('hidden');

        for(let i=0;i<16;i++){
            const createdCard = document.createElement('div');
            createdCard.classList.add("card");

            createdCard.style.top = `${i * 5}px`;

            createdCard.style.animationDelay = `${i * 0.1}s`;

            deck.appendChild(createdCard);
        }
        console.log(deck);
        
})
})

