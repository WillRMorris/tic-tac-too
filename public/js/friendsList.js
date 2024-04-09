const newGameButtons = document.getElementsByClassName("new-game-button");

const gameRequest = async (e) => {
    e.preventDefault();

    let response = await fetch('/api/tictactoe/newPrivateId', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    const gameId = await response.json();
    
    const user_id = e.target.getAttribute("data-user-id");
    const friend_id = e.target.getAttribute("data-friend-id");

    response = await fetch(`/api/friends/single/${friend_id}/${user_id}`,{
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })

    const friendship = await response.json();

    await fetch(`/api/friends/update/${friendship.friendship.id}`, {
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

    document.location.replace(response.url);
}

const joinGame = async (e) =>{
    let gameId = e.target.gameId;
    response = await fetch(`/tictactoe/${gameId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    document.location.replace(response.url);
}

for(let i = 0; i < newGameButtons.length; i++){
    let gameId = newGameButtons[i].getAttribute("data-game-id");

    if(gameId != ""){
        newGameButtons[i].innerHTML = "Join Game";
        newGameButtons[i].gameId = gameId;
        newGameButtons[i].addEventListener("click", joinGame);
    }
    else{
        newGameButtons[i].addEventListener("click", gameRequest);
    }
}