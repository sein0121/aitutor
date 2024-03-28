//쿠키 항목 입력
let delet = ["orgId","orgNm","userId","userNm","userType", "pageType", "searchType", "userGrd","userTestGrd","userTestLevel","userTestYn","userPauseYn"];

//쿠기 가져오기
var orgId = getCookie('orgId');
var orgNm = getCookie('orgNm');
var userId = getCookie('userId');
var userNm = getCookie('userNm');
var userType = getCookie('userType');
var pageType = getCookie('pageType');
var searchType = getCookie('searchType');
var userGrd = getCookie('userGrd');
var userTestGrd = getCookie('userTestGrd');
var userTestLevel = getCookie('userTestLevel');
var userTestYn = getCookie('userTuserTestYnype');
var userPauseYn = getCookie('userPauseYn');

function getCookie(name) {
    var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value ? unescape(value[2]) : null;
}

function deleteCookie(name) {
    document.cookie = name + '=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

document.getElementById("logout").onclick =  function(){
    console.log("click");
    API.login.logout({data: ''}, function(result) {
        console.log(result);
        //쿠키삭제
        for(let i=0; i<delet.length;i++) deleteCookie(delet[i]);

        window.location.replace(result.response);
    })
}