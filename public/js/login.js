const usernameElm = document.getElementById("username");
const passwordElm = document.getElementById("password");

const login = async (event) => {
    event.preventDefault();

    const username = usernameElm.value;
    const password = passwordElm.value;

    if(username && password){
        const response = await fetch('/api/user/login', {
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


document.getElementById("login-form").addEventListener("submit", login);