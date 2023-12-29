let g_data = localStorage.getItem("vahedhub-data");

if (g_data == undefined || g_data == ""){
    window.location.replace("index.html");
}

g_data = JSON.parse(g_data)["courses"].reverse();

const toFarsi = (day) => {
    if (day == "saturday") return "شنبه";
    if (day == "sunday") return "یکشنبه";
    if (day == "monday") return "دوشنبه";
    if (day == "tuesday") return "سه شنبه";
    if (day == "wednesday") return "چهارشنبه";
    if (day == "thursday") return "پنجشنبه";
    if (day == "friday") return "جمعه";
};

for (let i = 0; i < g_data.length; i++){

    let tr = document.createElement("tr");
    tr.innerHTML = ` 
        <td>${g_data[i]["code"]}</td>
        <td>${g_data[i]["name"]}</td>
        <td>${g_data[i]["unit"]}</td>
        <td>${g_data[i]["instructor"]}</td>
    `;
    
    const times = g_data[i]["times"];
    let timeTd = document.createElement("td");
    
    for (let j = 0; j < times.length; j++){
        timeTd.innerHTML += `<p>${toFarsi(times[j]["day"])} ${times[j]["start-time"]}-${times[j]["end-time"]}</p>`;
    }

    const examTimes = g_data[i]["exam"];
    let examTd = document.createElement("td");

    examTd.innerHTML += `<p>${examTimes["day"]}</p> <p>${examTimes["start-time"]}-${examTimes["end-time"]}</p>`;

    tr.appendChild(timeTd);
    tr.appendChild(examTd);

    document.querySelector("table tbody").appendChild(tr);
}