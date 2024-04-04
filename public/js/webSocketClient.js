const testButtons = document.getElementsByClassName("test-button");

const tictactoeSocketUrl = 'ws://' + window.location.hostname + ':3001/api/tictactoe/'
const socket = new WebSocket(tictactoeSocketUrl);

let boardArray = [0,0,0,0,0,0,0,0,0];

// socket.onopen = () => {
//   socket.send('Here\'s some text that the server is urgently awaiting!'); 
// }

socket.onmessage = e => {
    boardArray = e.data.split(',');
    console.log('Message from server:', e.data)
}

const makeMove = (event) => {
    const xCoord = event.currentTarget.getAttribute("data-x");
    const yCoord = event.currentTarget.getAttribute("data-y");

    boardArray[Number(xCoord) + 3 * Number(yCoord)] = playerId;
    
    socket.send(boardArray);
}

for(let i = 0; i < testButtons.length; i++){
    testButtons[i].addEventListener("click", makeMove);
}