//cookies
var orgId = getCookie('orgId');
var orgNm = getCookie('orgNm');
var userId = getCookie('userId');
var userType = getCookie('userType');

const logo = document.getElementById("logo");
const list = document.getElementById("list");
const classmain = document.getElementById("classmain");
const user = document.getElementById("user");

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? unescape(matches[1]) : undefined;
}

list.onclick = function(){
     if(userType=="10") location.href = "/aitutor/admin/O_list";
     else if(userType=="20") location.href = "/aitutor/teacher/T_list";
}

classmain.onclick = function(){location.reload();}