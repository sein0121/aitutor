function btnPrior(){
    history.back();
}

// 유저 모달 활성화/비활성화
document.getElementById("user_open_btn").onclick = function() {
    const user = document.getElementById("user_modal");
    if(user.style.display === "none" || user.style.display === "") {
        user.style.display = "block";
    } else {
        user.style.display = "none";
    }
}