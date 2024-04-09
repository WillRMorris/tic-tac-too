const submit = document.getElementById('new-friend');
console.log(submit);
 const handleAddFriend = async (event) => {
    console.log('whohooooooo');
    const friendName = document.getElementById('friend-name').value.trim();
    console.log(friendName)
    const unpasredResponse = await fetch(`/api/user/byname/${friendName}`,{
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },

    })
    if(unpasredResponse.ok){
        const response = await unpasredResponse.json();
        if(response != null && response != undefined){
            const correctName = response.user_name;
            let answer = confirm(`do you want to friend ${correctName}?`)
            let obj = {friend_id: response.id}
            let sendable = JSON.stringify(obj);
            if(answer){
                const newFriend = await fetch('/api/friends', {
                    method: 'POST',
                    body: sendable,
                    headers: { 'Content-Type': 'application/json' },

                })
            }
        }else{
            alert('username incorrect');
        }
    }else {
        alert('failed to reach server');
    }
}

submit.addEventListener('submit', handleAddFriend);