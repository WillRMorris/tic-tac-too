const readyButton = document.getElementById("ready-button");

const friendshipData = {
    userId: null,
    friendId: null,
    friendshipId: null,
    wins: null,
    losses: null,
    draws: null
}

const setupFriendshipData = async () => {
    const loggedIn = readyButton.getAttribute("data-logged-in");
    if(loggedIn == "" || loggedIn == false){
        return;
    }
    
    let response = await fetch(`/api/friends/fromGameId/${gameData.gameId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    friendship = await response.json();
    if(friendship == null){
        return;
    }

    friendshipData.userId = readyButton.getAttribute("data-user-id");
    if(friendship.user_id == friendshipData.userId){
        friendshipData.friendId = friendship.friend_id;
    }
    else if(friendship.friend_id == friendshipData.userId){
        friendshipData.friendId = friendship.user_id;

        response = await fetch(`/api/friends/single/${friendshipData.userId}/${friendshipData.friendId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })

        friendship = await response.json();
        friendship = friendship.friendship; 
    }
    else{
        console.error("Wrong friendship found")
    }

    friendshipData.wins = friendship.ttt_wins;
    friendshipData.losses = friendship.ttt_losses;
    friendshipData.draws = friendship.ttt_draw;
    friendshipData.friendshipId = friendship.id;
}

const updateFriendshipDB = () => {
    
}