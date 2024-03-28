// getCookie 호출
// var orgId = getCookie('orgId');
var userId = getCookie('userId');
var userType = getCookie('userType');
var userGrd = getCookie('userGrd');
var userTestGrd = getCookie('userTestGrd');
var userTestYn = getCookie('userTestYn');
var userPauseYn = getCookie('userPauseYn');

const btn_start = document.getElementById("btn-start");

//cookie 가져오기기
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));

    // return matches ? decodeURIComponent(matches[1]) : undefined;
    return matches ? unescape(matches[1]) : undefined;
}


if(userPauseYn=="n") btn_start.innerText += " 시작하기";

else if(userPauseYn=="y") btn_start.innerText += " 이어하기";

btn_start.onclick=function () { window.location.href = 'S_test'; }
