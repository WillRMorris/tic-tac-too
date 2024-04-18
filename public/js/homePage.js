//grabs all game previews
const games = document.getElementsByClassName('game-preview');

//intializes
const init = () =>{
    setGameListeners();   
}
//sets eventlisteners to all game preview
const setGameListeners = () =>{
    for (let i = 0; i< games.length; i++){
        games[i].addEventListener('click', handleGetGame);
    }
    
}
//handles redirecting to the page for the corrisponding game
const handleGetGame = (event) =>{
    const game = getGame(event.currentTarget);
    window.location.replace(`/games/${game}`);
}

//element ids must be formated gameName-preview to work
const getGame = (elem) =>{
    let id = elem.getAttribute('id');
    id = id.split('-');
    const game = id[0];
    return game;
}

init();