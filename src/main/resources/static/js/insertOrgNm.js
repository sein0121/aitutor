// getCookie 호출
var orgNm = getCookie('orgNm');
var userNm = getCookie('userNm');
var userType = getCookie('userType');

//cookie 가져오기기
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));

    // return matches ? decodeURIComponent(matches[1]) : undefined;
    return matches ? unescape(matches[1]) : undefined;
}

if(userType==10) document.getElementById("org-name").innerText = orgNm+"_관리자";
else if(userType==20) document.getElementById("org-name").innerText = orgNm+"_"+userNm;
else if(userType==30) document.getElementById("org-name").innerText = orgNm;
