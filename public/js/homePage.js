// gets a new gameId from the server and goes to that page
const host = async () => {
    let response = await fetch('/api/tictactoe/newId', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    const uuid = await response.json();
    
    response = await fetch(`/tictactoe/${uuid.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    document.location.replace(response.url);
}

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

    response = await fetch(`/tictactoe/${uuid.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    document.location.replace(response.url);
}

document.getElementById("host-button").addEventListener("click", host);
document.getElementById("join-button").addEventListener("click", join);