// gets gameId of available game from the server and goes to that page
const join = async () => {
    let response = await fetch('/api/tictactoe/getRandomId', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    const uuid = await response.json();
    
    if(uuid == "No games available"){
        console.log(uuid);
        return;
    }

    response = await fetch(`ttt/tictactoe/${uuid.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    document.location.replace(response.url);
}

document.getElementById("join-button").addEventListener("click", join);