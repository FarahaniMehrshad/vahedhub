let g_selected_course = JSON.parse(localStorage.getItem("course-selected"));
let g_data = localStorage.getItem("vahedhub-data");

if (g_data == undefined || g_data == ""){
    window.location.replace("index.html");
}
else{
    g_data = JSON.parse(g_data);
}

const createTable = () => {

    let days = [];

    g_data["courses"].forEach(
        (course) => {
        if (course["exam"]["day"] != ""){
            days.push(course["exam"]["day"]);
        }
    }
    );

    days.sort();
    days = new Set(days);
    days = Array.from(days);

    for(let i = 0; i < days.length; i++){
        const tbody = document.querySelector("table tbody");
        const tr = document.createElement("tr");
        for (let j = 0; j < 16; j++){
            tr.innerHTML += `<td><div class="wrap" id="${days[i]}-${j+7}"></div></td>`;
        }
        tr.firstChild.innerText = days[i];
        tbody.appendChild(tr);
    }
};

const addExamToTable = (course) => {
    const name = course["name"];
    const day = course["exam"]["day"];
    const startTime = parseInt(course["exam"]["start-time"]);
    const endTime = parseInt(course["exam"]["end-time"]);

    if (endTime - startTime == 1){
        document.getElementById(day + '-' + startTime.toString()).innerHTML += `<div class="fake"><div class="exam">${name}</div></div>`;
    }
    else if (endTime - startTime == 2){
        document.getElementById(day + '-' + startTime.toString()).innerHTML += `<div class="fake"><div class="exam doubleWidth">${name}</div></div>`;
        document.getElementById(day + '-' + (startTime+1).toString()).innerHTML += '<div class="fake"></div>';
    }
    else if (endTime - startTime == 3){
        document.getElementById(day + '-' + startTime.toString()).innerHTML += `<div class="fake"><div class="exam tripleWidth">${name}</div></div>`;
        document.getElementById(day + '-' + (startTime+1).toString()).innerHTML += '<div class="fake"></div>';
        document.getElementById(day + '-' + (startTime+2).toString()).innerHTML += '<div class="fake"></div>';
    }
};

createTable();


g_selected_course.forEach(
    (course) => {
        addExamToTable(course);
    }
);

