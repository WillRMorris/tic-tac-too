const usernameElm = document.getElementById("username");
const passwordElm = document.getElementById("password");

const signUp = async (event) => {
    event.preventDefault();

    const username = usernameElm.value;
    const password = passwordElm.value;

    if(password.length < 8){
        alert("Password must contain at least 8 characters");
        return;
    }

    if(username && password){
        const response = await fetch('/api/user/signUp', {
            method: 'POST',
            body: JSON.stringify({
                user_name: username,
                password: password
            }),
            headers: { 'Content-Type': 'application/json' }
        });

        if(response.ok){
            document.location.replace('/');
        }
        else{
            alert(response.statusText);
        }
    }
}


document.getElementById("login-form").addEventListener("submit", signUp);