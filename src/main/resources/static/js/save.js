document.getElementById("help").onclick = function() {
    console.log("help");
    document.getElementById("modal_save").style.display = "block";
    document.getElementById("modal_bg").style.display = "block";
}

document.getElementById("save_close_btn").onclick = function() {
    document.getElementById("modal_save").style.display = "none";
    document.getElementById("modal_bg").style.display = "none";
}

document.getElementById("save_cancel_btn").onclick = function() {
    document.getElementById("modal_save").style.display = "none";
    document.getElementById("modal_bg").style.display = "none";
}

document.getElementById("save").onclick = function() {
    document.location.href = '/excel/EduSoDA_사용 가이드.xlsx';

    document.getElementById("modal_save").style.display = "none";
    document.getElementById("modal_bg").style.display = "none";
}