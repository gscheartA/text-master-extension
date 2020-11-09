//1.textmanager   2.calculator

let state = 1;

document.getElementById('textmanagerbar').onclick = () => {
  if (state !== 1) {
    document.getElementById('textmanager').style.display = "block";
    document.getElementById('calculatemanager').style.display = "none";
    document.getElementById('textmanagerbar').classList.add("selected");
    document.getElementById('calculatemanagerbar').classList.remove("selected");
    //document.getElementById('slide').classList.remove("right");
    //document.getElementById('slide').classList.add("left");
    document.getElementById('slide').className = "first";
    state = 1;
  }
}

document.getElementById('calculatemanagerbar').onclick = () => {
  if (state !== 2) {
    document.getElementById('textmanager').style.display = "none";
    document.getElementById('calculatemanager').style.display = "block";
    document.getElementById('textmanagerbar').classList.remove("selected");
    document.getElementById('calculatemanagerbar').classList.add("selected");
    //document.getElementById('slide').classList.remove("left");
    //document.getElementById('slide').classList.add("right");
    document.getElementById('slide').className = "second";
    state = 2;
  }
}
