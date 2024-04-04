const testButton = document.getElementById("test-button");

const echoSocketUrl = 'ws://' + window.location.hostname + ':3001/api/tictactoe/echo/'
const socket = new WebSocket(echoSocketUrl);

socket.onopen = () => {
  socket.send('Here\'s some text that the server is urgently awaiting!'); 
}

socket.onmessage = e => {
  console.log('Message from server:', e.data)
}

const sendMessage = () => {
    socket.send("Test message");
}

testButton.addEventListener("click", sendMessage);