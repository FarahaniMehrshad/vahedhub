// YOU CAN EITHER LIVE YOUR PROBLEM
// OR LIVE THE SOLUTION TO YOUR PROBLEM.
// IT'S YOUR CHOICE WHAT YOU FOCUS ON.
let g_nUnit = 0;
let g_data = localStorage.getItem("vahedhub-data");
let g_course_selected = [];


if (g_data == undefined || g_data == ""){
    window.location.replace("index.html");
}
else{
    g_data = JSON.parse(g_data);
    g_data["courses"] = g_data["courses"].reverse();
    document.querySelector(".username p:nth-child(2)").innerText += (g_data["name"].replace(',', ' '));
}

const logout = () =>{
    localStorage.setItem("vahedhub-data", "");
    window.location.replace("index.html");
};

const createCourseTable = (filter) => {
    const addCourseToList = (section, instructor) => {
        const courses = document.querySelector(".courses tbody");
        const coursetr = document.createElement("tr");
        courses.appendChild(coursetr);
        const sec = document.createElement("td");
        const instr = document.createElement("td");
        coursetr.appendChild(sec);
        coursetr.appendChild(instr);
        sec.appendChild(document.createTextNode(section));
        instr.appendChild(document.createTextNode(instructor));
        return coursetr;
    }

    document.querySelector(".left table tbody").innerHTML = "";

    for (let i = 0; i < g_data["courses"].length; i++) {

        let course = g_data["courses"][i];

        if (filter != "") {
            if (!course["name"].includes(filter)) {
                continue;
            }
        }

        const coursetr = addCourseToList(`${course["name"]}-${course["code"].split("-")[1]}`, course["instructor"]);
        coursetr.childNodes[0].setAttribute("id", `${i}`);
        coursetr.childNodes[1].setAttribute("id", `${i}`);
        //coursetr.onmouseenter = onCourseMouseEnter;
        //coursetr.onmouseleave = onCourseMouseLeave;
        coursetr.onclick = onCourseMouseClick;
            
    }
}

const setDayId = (i, j) => {
    let day = "";
    let time = "";
    switch (i) {
        case 0: day = "saturday"; break;
        case 1: day = "sunday"; break;
        case 2: day = "monday"; break;
        case 3: day = "tuesday"; break;
        case 4: day = "wednesday"; break;
        default: break;
    }
    switch (j) {
        case 0: time = "08:00"; break;
        case 1: time = "10:00"; break;
        case 2: time = "12:00"; break;
        case 3: time = "14:00"; break;
        case 4: time = "16:00"; break;
        default: break;
    }

    return day + "-" + time;
};

const createWeeklyTable = () => {

    // Create rows td
    const tableRows = document.querySelectorAll(".right table tbody tr");

    for (let i = 0; i < tableRows.length; i++){
        for (let j = 0; j < 5; j++){
            const td = document.createElement("td");
            const list = document.createElement("div");
            td.setAttribute("colspan", "3");
            td.appendChild(list);
            list.setAttribute("id", setDayId(i, j));
            list.setAttribute("class", "list");
            tableRows[i].appendChild(td);
        }
    }
};

const updateUnit = () => {
    const unitDiv = document.querySelector(".units");
    unitDiv.children[1].innerText = g_nUnit;
};

const onCourseMouseEnter = (event) => {
    document.querySelector(".courseHover").style.display = "block";
    document.querySelector(".courseHover").style.top = (event.y).toString() + "px";
};

const onCourseMouseLeave = (event) => {
    document.querySelector(".courseHover").style.display = "none";
};

const findSectionInTable = (code, unit) => {
    const section = document.getElementById(`${code}-${unit}`);
    return section;
};

const onSectionMouseClick = (event) => {
    const id = event.target.id;
    let section = document.getElementById(id);
    if (section){
        const unit = id.split('-')[2];
        g_nUnit -= unit;
        updateUnit();

        for (let i = 0; i < g_course_selected.length; i++){
            const code = id.split("-")[0] + '-' + id.split("-")[1];
            if (g_course_selected[i]["code"] == code){
                g_course_selected.splice(i, 1);
                localStorage.setItem("course-selected", JSON.stringify(g_course_selected));
                break;
            }
        }
    }

    for (let i=0; i < g_data["courses"].length; i++){
        if (g_data["courses"][i]["name"] + '-' + g_data["courses"][i]["code"].split("-")[1]  == section.innerText){
            const tr = document.getElementById(i).parentElement;
            tr.setAttribute("class", "");
            break;
        }
    }

    while(section){
        document.adoptNode(section);
        section = document.getElementById(id);
    }
};

const addSectionToTable = (name, code, unit, time) => {

    const startTime = time["start-time"].replace("09", "08").replace("11", "10").replace("13", "12").replace("15", "14").replace("17", "16");
    const list = document.getElementById(`${time["day"]}-${startTime}`);
    const section = document.createElement("div");
    section.setAttribute("class", "section");
    section.setAttribute("id", `${code}-${unit}`);
    
    if ((parseInt(time["end-time"])) - (parseInt(time["start-time"])) == 1){
        if (time["start-time"] == startTime){
            section.setAttribute("class", "section half-right");
        }
        else{
            section.setAttribute("class", "section half-left");
        }
    }

    section.innerText = name + `-${code.split("-")[1]}`;
    section.onclick = onSectionMouseClick;
    list.appendChild(section);
};

const onCourseMouseClick = (event) => {

    const courseIndex = parseInt(event.target.id);
    const name = g_data["courses"][courseIndex]["name"];
    const code = g_data["courses"][courseIndex]["code"];
    const unit = g_data["courses"][courseIndex]["unit"];
    const times = g_data["courses"][courseIndex]["times"];
    const exam = g_data["courses"][courseIndex]["exam"];

    if (findSectionInTable(code, unit))
        return;

    g_nUnit += unit;
    updateUnit();

    const tr = document.getElementById(event.target.id).parentElement;
    tr.setAttribute("class", "selected");

    if (g_course_selected == undefined){
        g_course_selected = [];
    }

    g_course_selected.push({"name": name, "code": code, "unit": unit, "times": times, "exam": exam});
    localStorage.setItem("course-selected", JSON.stringify(g_course_selected));

    times.forEach(
        (time) => {
            addSectionToTable(name, code, unit, time);
        }
    );
};


const onSearchInput = (event) => {
    createCourseTable(event.target.value);
};

document.querySelector(".search input").oninput = onSearchInput;

createWeeklyTable();
createCourseTable("");

g_course_selected = JSON.parse(localStorage.getItem("course-selected"));

if (g_course_selected != undefined && g_course_selected != []){
    for (let i = 0; i < g_course_selected.length; i++){
        const name = g_course_selected[i]["name"];
        const code = g_course_selected[i]["code"];
        const unit = g_course_selected[i]["unit"];
        const times = g_course_selected[i]["times"];
        
        g_nUnit += unit;
        updateUnit();
        
        let tableCourses = document.querySelectorAll(".left table tbody tr");

        tableCourses.forEach(
            (tr) => {
                if (tr.firstChild.innerText == name + '-' + code.split("-")[1]){
                    tr.setAttribute("class", "selected");
                }
            }
        );
        
        times.forEach(
            (time) => {
                addSectionToTable(name, code, unit, time);
            }
        );
    }
}


