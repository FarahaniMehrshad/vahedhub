let g_data = localStorage.getItem("vahedhub-data");

let g_selected_course = JSON.parse(localStorage.getItem("course-selected"));

if (g_data == undefined || g_data == ""){
    window.location.replace("index.html");
}

g_selected_course.forEach((course) => {
    document.querySelector("table tbody").innerHTML += `
        <tr>
            <td>${course["code"]}</td>
            <td>${course["name"]}-${course["code"].split("-")[1]}</td>
        </tr>
    `;
})