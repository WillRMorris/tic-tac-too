const newGameButtons = document.getElementsByClassName("new-game-button");

const gameRequest = async (e) => {
    e.preventDefault();

    let response = await fetch('/api/tictactoe/newPrivateId', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    const gameId = await response.json();
    
    console.log(e.target.getAttribute("data-friend-id"));

    await fetch(`/api/friends/update/${e.target.getAttribute("data-friend-id")}`, {
        method: 'PUT',
        body: JSON.stringify({
            active_game_id: gameId
        }),
        headers: { 'Content-Type': 'application/json' }
    })

    response = await fetch(`/tictactoe/${gameId.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    debugger
    document.location.replace(response.url);
}


for(let i = 0; i < newGameButtons.length; i++){
    newGameButtons[i].addEventListener("click", gameRequest);
}