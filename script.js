

var days_array = [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' , 'Sun'];
const container = document.querySelector(".container");
const week = document.querySelector(".week");
const ym = document.querySelector(".ym");
const eventer = document.querySelector(".event");
const events = document.querySelector(".events");
const selected = document.querySelector(".selected");
const today = document.querySelector(".today");
const hms = document.querySelector(".hms");
const control = document.querySelector(".control");
const input = document.getElementById("inp");
const add = document.querySelector(".add");
const submission = document.querySelector(".submission");
const grid = document.querySelector(".grid");

//42

let date = new Date(Date.now());

const option_ym = {  year: 'numeric', month: 'long'};

let thisday = date.toDateString(date.getDate());
selected.innerText = thisday;

today.innerText = date.toISOString().substring(0, 10);

today.addEventListener("click" , function(){
    let current = new Date(Date.now());
    date = current;
    ym_content.textContent = current.toLocaleDateString('en-GB' , option_ym);
    grid.innerHTML="";
    draw_grid();
});

if(localStorage.getItem(thisday)){
    check_event(thisday);
}


setInterval(() => {
    const d = new Date();
    hms.innerText = d.toISOString().substring(11, 19);
}, 1000);



let left_arrow = document.createElement("div");
left_arrow.classList.add("arrow");
left_arrow.innerHTML = "<i class='fa fa-angle-left'></i>";


let ym_content = document.createElement("div");
ym_content.classList.add("ym_content");
ym_content.textContent = date.toLocaleDateString('en-GB' , option_ym);


let right_arrow = document.createElement("div");
right_arrow.classList.add("arrow");
right_arrow.innerHTML = "<i class='fa fa-angle-right'></i>";


left_arrow.addEventListener("click" , function(){
    date.setMonth(date.getMonth()-2);
    ym_content.textContent = date.toLocaleDateString('en-GB' , option_ym);
    grid.innerHTML="";
    draw_grid();
});

right_arrow.addEventListener("click" , function(){
    date.setMonth(date.getMonth());
    ym_content.textContent = date.toLocaleDateString('en-GB' , option_ym);
    grid.innerHTML="";
    draw_grid();
});



ym.appendChild(left_arrow);
ym.appendChild(ym_content);
ym.appendChild(right_arrow);

for (let i in days_array) {
    let day = document.createElement("div");
    day.classList.add("dayname");
    day.textContent = days_array[i];
    week.appendChild(day);
}
function get_gap(){
    date.setDate(1);
    let gap = date.getDay();
    return -gap+1;
}

function draw_grid(){
    let startFrom = get_gap();
    var lastDayOfMonth = new Date(date.getFullYear(), date.getMonth()+1, 0);
    date.setDate(startFrom);
    for (let i = 0; i < 42; i++) {
        let current = new Date(Date.now());
        startFrom++;
        date.setDate(date.getDate() + 1);
        let this_day = date.toDateString(date.getDate());
        console.log(lastDayOfMonth.getDate());
        console.log(date.getDate());
        let day = document.createElement("div");
        day.classList.add("days");
        if(localStorage.getItem(date.toDateString(date.getDate()))){
            day.classList.add("checkmark");
        }
        day.addEventListener("click" , function(){
            selected.innerText = this_day ;
            submission.innerHTML = "";
            unclick();
            day.classList.add("clicked");
            if(localStorage.getItem(this_day)){
                check_event(this_day);
            }
        } , false);
        if(startFrom>=1 && startFrom<=lastDayOfMonth.getDate() ){
            day.classList.add("this-month");
            if(date.getDate() == current.getDate() && date.getMonth() == current.getMonth()){
                day.classList.add("current");
            }
        }
        day.textContent = date.getDate();
        grid.appendChild(day);
    }
}

draw_grid();

//event part

function arrayRemove(arr, value) {

    console.log(value);
    return arr.filter(function(geeks){
        return geeks != value;
    });
  
}


function print_event(event , curr){
    let div = document.createElement("div");
    div.classList.add("even");
    let p = document.createElement("p");
    let btn = document.createElement("button");
    p.innerText = event;
    btn.innerHTML = '<i class="fa fa-trash-o"></i>';
    div.appendChild(p);
    div.appendChild(btn);
    btn.addEventListener("click" , function(){
        let vals = localStorage.getItem(curr).split(';');
        console.log(vals);
        localStorage.removeItem(curr);
        arrayRemove(vals , event);
        if(vals.length != 1){
            localStorage.setItem(curr, arrayRemove(vals , event).join(';'));
        }
        div.innerHTML="";
        div.remove();
    })
    submission.appendChild(div);
}

function unclick(){
    let dayss = document.getElementsByClassName("days");
    for (let i = 0; i < dayss.length; i++) {
        if(dayss[i].classList.contains("clicked")){
            dayss[i].classList.remove("clicked");
        }
    }
}

function add_event(day , event){
    submission.innerHTML = "";
    if(localStorage.getItem(day)){
    let vals = localStorage.getItem(day).split(';');
        if(!vals.includes(event)){
            vals.push(event);
          localStorage.setItem(day, vals.join(';'));
          for (let i in vals) {
            print_event(vals[i] , day);
          }
        }
    }else{
        localStorage.setItem(day , event);
    }
}

function check_event(day){
    let vals = localStorage.getItem(day).split(';');
    for (let i in vals) {
        print_event(vals[i] , day);
    }
}



add.addEventListener("click" , () =>{
    let current_day = selected.innerText;
    let thisevent = input.value;
    input.value = "";
    add_event(current_day , thisevent);
    location.reload();
})