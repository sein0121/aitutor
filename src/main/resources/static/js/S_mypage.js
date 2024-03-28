//팝업
const icon_id = document.getElementById("icon_id");
const modal_title = document.getElementById("modal_title");
const modal_cotent = document.getElementById("modal_cotent");
var userTestLevel = getCookie('userTestLevel');

//input
const password = document.getElementById("pre_password");

// getCookie 호출
var orgId = getCookie('orgId');
var userId = getCookie('userId');
var userGrd = getCookie('userGrd');
var userTestGrd = getCookie('userTestGrd');
var userTestLevel = getCookie('userTestLevel');
var userTestYn = getCookie('userTestYn');
var userPauseYn = getCookie('userPauseYn');

var flag=false;

// 페이지 진입 data
const loadData = {
    org_id: orgId,
    user_id: userId,
    user_grd:userGrd,
    user_test_grd:userTestGrd
};

let changePassData = {};

//cookie 가져오기기
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? unescape(matches[1]) : undefined;
}

// if(userTestLevel=="01" && userTestYn=="n") document.getElementById("logo").setAttribute("href","main");
// else document.getElementById("logo").setAttribute("href","S_result");
// else document.getElementById("logo").setAttribute("href","main");

function onLoadData() {
    API.student.smypage({data: loadData}, function(result) {
        const testResult = result.result;

        console.log("API 호출     ", testResult)

        let s_name = document.getElementById("s_name");
        let s_grd = document.getElementById("s_grd");
        let s_classnm = document.getElementById("s_classnm");
        let teacher_nm = document.getElementById("teacher_nm");

        // s_name.innerText = s_name.innerText.replace("학생 이름",testResult.user_nm);
        s_name.innerText = userId;

        //학년별 다른 클래스 지정
        if(testResult.class_gbn.includes("초")) s_grd.setAttribute("class","bg_es");
        else if(testResult.class_gbn.includes("중")) s_grd.setAttribute("class","bg_ms");
        else if(testResult.class_gbn.includes("고")) s_grd.setAttribute("class","bg_hs");

        s_grd.innerText = testResult.class_gbn;
        s_classnm.innerText = testResult.class_nm;
        teacher_nm.innerText = testResult.teacher_nm;
    })
}

window.onload = onLoadData;

document.getElementById("btn_save").onclick = function() {

    var reg = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/;

    //비밀번호
    const pre_password = document.getElementById("pre_password").value;
    const new_password = document.getElementById("new_password").value;
    const new_password_ck = document.getElementById("new_password_ck").value;

    modal.style.display = "block";
    modal_bg.style.display = "block";

    if(pre_password.length==0 || new_password.length==0 || new_password_ck.length==0){
        icon_id.setAttribute("src","/image/icon_error.svg");
        modal_title.innerText = "비밀번호 확인";
        if(pre_password.length==0) modal_cotent.innerText = "현재 비밀번호를 입력해주세요.";
        else if(new_password.length==0) modal_cotent.innerText = "신규 비밀번호를 입력해주세요.";
        else if(new_password_ck.length==0) modal_cotent.innerText = "신규 비밀번호 확인을 입력해주세요.";
    }else{
        if(reg.test(new_password)){
            console.log("new_password   ",new_password);
            console.log("new_password_ck   ",new_password_ck);
            if(new_password == new_password_ck){
                changePassData = {
                    org_id: orgId,
                    user_id: userId,
                    user_grd:userGrd,
                    user_test_grd:userTestGrd,
                    user_pw_now:pre_password,
                    user_pw_new:new_password
                };

                icon_id.setAttribute("src","/image/icon_info.svg");
                modal_title.innerText = "비밀번호 변경";
                modal_cotent.innerText = "비밀번호를 변경 하시겠습니까?";

                //변경 가능 여부
                flag = true;

            }else {
                icon_id.setAttribute("src","/image/icon_error.svg");
                modal_title.innerText = "비밀번호 확인";
                modal_cotent.innerText = "신규 비밀번호와 신규 비밀번호 확인이 다릅니다.";
            }
        }else{
            icon_id.setAttribute("src","/image/icon_error.svg");
            modal_title.innerText = "비밀번호 확인";
            modal_cotent.innerText = "영문대소문자 + 숫자 + 특수문자를 포함하여 8~16글자 입니다.";
        }
    }


    document.getElementById("modal").style.display="block";
    document.getElementById("modal_bg").style.display="block";
}

document.getElementById("modal_close_btn").onclick = function() {
    document.getElementById("modal").style.display="none";
    document.getElementById("modal_bg").style.display="none";

}

document.getElementById("modal_ok_btn").onclick = function() {

    if(flag){
        //API 호출
        API.student.sSave({data: changePassData}, function (result) {
            const code = result;

            if(code.rsp_code==210){
                console.log("rsp_code  ",code.rsp_code);
                window.location.reload();

            }else if(code.rsp_code==211){
                console.log("rsp_code  ",code.rsp_code);

                //error style
                password.style.backgroundColor ="#fff0f0";
                password.style.borderColor ="#ffbdbd";
                password.value = "";
                password.setAttribute("placeholder","현재 비밀번호가 틀립니다.");

                flag = false;

            }
        })
    }

    document.getElementById("modal").style.display="none";
    document.getElementById("modal_bg").style.display="none";

}

//현재 비밀번호 Event
password.onclick=function(){
    password.style.backgroundColor ="#ffffff";
    password.style.borderColor ="#cccccc";
    password.setAttribute("placeholder","");
}

function moveMain(){
    if(userTestLevel=="01") window.location.href = "/aitutor/student/main";
    else window.location.href = "/aitutor/student/S_result";
    // if(document.referrer.includes("result")) {
    //     window.location.href = "/aitutor/student/S_result";
    // }else{
    //     if(document.referrer.includes("test")){
    //         if(userTestLevel=="01") window.location.href = "/aitutor/student/main";
    //         else window.location.href = "/aitutor/student/S_result";
    //     }
    //     else window.location.href = "/aitutor/student/main";
    // }
}