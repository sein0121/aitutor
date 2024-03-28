// getCookie 호출
var userType = getCookie('userType');

//cookie 가져오기기
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    // return matches ? decodeURIComponent(matches[1]) : undefined;
    return matches ? unescape(matches[1]) : undefined;
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


function moveMypage() {
    console.log("--- moveMypage ---")
    if(userType=="00") location.href='admin';
    else if(userType=="10") location.href='S_admin';
    else if(userType=="20") location.href='T_mypage';
    else if(userType=="30") location.href='S_mypage';
}