localStorage.setItem("vahedhub-data", "");

const onLoadData = (response) => {
    document.querySelector('button').innerText = "ورود";
    document.querySelector('button').disabled = false;
    let data = "";

    data = response.target.responseText;

    if (data == undefined || data == ""){
        document.querySelector(".login .container").innerHTML += '<p class="fail">نام کاربری یا رمز عبور اشتباه است</p>';
        return;
    }

    localStorage.setItem("vahedhub-data", data);
    window.location.replace("schedule.html");
};

const server = "https://vahedhub.ir/data.json";

const login = () => {
    const username = document.querySelector('.username input').value;
    const password = document.querySelector('.password input').value;
    const xhttp = new XMLHttpRequest();

    document.querySelector('button').innerText = "صبر کنید";
    document.querySelector('button').disabled = true;
    const fail = document.querySelector('.login .container .fail');
    if ( fail != undefined){
        document.adoptNode(fail);
    }

    xhttp.onload = onLoadData;
    //xhttp.open("post", server, true);
    //xhttp.send(`{"user": "${username}", "pass": "${password}"}`);
    xhttp.open("GET", server);
    xhttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xhttp.send();
};
