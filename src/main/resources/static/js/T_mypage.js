// getCookie 호출
var orgId = getCookie('orgId');
var orgNm = getCookie('orgNm');
var userId = getCookie('userId');
var userNm = getCookie('userNm');
var userType = getCookie('userType');

//태그 값 가져오기
const userNm_input = document.getElementById("userNm_input");
const userNm_ck = document.getElementById("userNm_ck");

//팝업
const modal = document.getElementById("modal");
const modal_bg = document.getElementById("modal_bg");
const modal_ok_btn = document.getElementById("modal_ok_btn");
const icon_id = document.getElementById("icon_id");
const modal_close_btn = document.getElementById("modal_close_btn");
const btn_save = document.getElementById("btn_save");
const modal_title = document.getElementById("modal_title");
const modal_cotent = document.getElementById("modal_cotent");

//input
const password = document.getElementById("pre_password");

// 페이지 진입 data
const loadData = {
    org_id: orgId,
    user_id: userId,
    user_type:userType
};

let ckNm = "";
let ck = false;
let flag = false;
let changePassData = {};

//cookie 가져오기기
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    //return matches ? decodeURIComponent(matches[1]) : undefined;
    return matches ? unescape(matches[1]) : undefined;
}

function onLoadData() {
        if(userNm != "" && userNm!=undefined) pushName(userNm);
        else{
            API.tutor.tmypage({data: loadData}, function (result) {
                const loadResult = result.result;
                console.log("tmypage API    ",loadResult);

                if(loadResult.rsp_code==200) {
                    //let userNm = tmypageData.user_nm;

                    if(userNm != "" && userNm!=undefined) pushName(loadResult.user_nm);
                    else btn_save.disabled=true;
                }
                else if(loadResult.rsp_code==401) window.location.href("401");
                else if(loadResult.rsp_code==403) window.location.href("403");
                else if(loadResult.rsp_code==404) window.location.href("404");
                else if(loadResult.rsp_code==500) window.location.href("500");
            })
        }
    //
    // API.teacher.tmypage({data: loadData}, function (result) {
    //     const tmypageData = result.result;
    //     let user_Nm = tmypageData.user_nm
    //
    //     console.log("tmypage API    ",tmypageData);
    //
    //     if(user_Nm != ""){
    //         document.getElementById("user_nm").innerText = user_Nm+" 선생님, 안녕하세요.";
    //         userNm_input.setAttribute('value',user_Nm);
    //         userNm_input.disabled = true;
    //         userNm_ck.disabled = true;
    //         btn_save.setAttribute("class","btn_purple");
    //     }else{
    //         btn_save.disabled=true;
    //     }
    // })
}

window.onload = onLoadData;

function pushName(nm){
    document.getElementById("user_nm").innerText = nm+" 선생님, 안녕하세요.";
    userNm_input.setAttribute('value',nm);
    userNm_input.disabled = true;
    userNm_ck.disabled = true;
    btn_save.setAttribute("class","btn");
    document.getElementById("btn_save").setAttribute("onclick","savePass()");
    document.getElementById("logo").setAttribute("href","T_list");
}

document.getElementById("org_info").innerText = orgNm;

userNm_ck.onclick = function(){
   if(userNm_input.value.length==0){
       modal.style.display = "block";
       modal_bg.style.display = "block";
       modal_title.innerText = "사용자 이름 미입력";
       modal_cotent.innerText = "사용자 이름을 입력해주세요."
       icon_id.setAttribute("src","/image/icon_error.svg");
   }else{
       const ckeckNmData = {
           org_id: orgId,
           user_nm:userNm_input.value
       };

       API.student.tckName({data: ckeckNmData}, function (result) {
           const codeData = result.rsp_code;

           console.log("tckName API     ",codeData);

           if(codeData==220){
               modal.style.display = "block";
               modal_bg.style.display = "block";
               modal_title.innerText = "사용자 이름 가능";
               modal_cotent.innerText = "사용자 이름이 사용 가능합니다."
               icon_id.setAttribute("src","/image/icon_info.svg");

               //중복확인 버튼 및 사용자 이름 input 비활성화
               userNm_input.setAttribute("disabled",false);
               userNm_ck.setAttribute("disabled",false);

               //저장버튼 활성화
               ck = true;
               document.getElementById("btn_save").setAttribute("onclick","savePass()");
               btn_save.setAttribute("class","btn");
               btn_save.disabled=false;
           }else if(codeData==221){
               modal.style.display = "block";
               modal_bg.style.display = "block";
               modal_title.innerText = "사용자 이름 중복";
               modal_cotent.innerHTML = "사용자 이름이 중복입니다. 다시 입력해주세요.<br>ex)사용자 이름+숫자";
               icon_id.setAttribute("src","/image/icon_error.svg");
               ck = false;
           }else{
               if(codeData==401) window.location.href("401");
               else if(codeData==403) window.location.href("403");
               else if(codeData==404) window.location.href("404");
               else if(codeData==500) window.location.href("500");
           }
       })
   }
}

modal_ok_btn.onclick = function(){
    if(flag){
        //API 호출
        API.student.sSave({data: changePassData}, function (result) {
            const code = result;

            if(code.rsp_code==210){
                console.log("rsp_code  ",code.rsp_code);
                // document.cookie = "userNm="+userNm_input.value+";path=/;";
                document.cookie = "userNm="+escape(userNm_input.value)+";path=/;";
                window.location.reload();

            }else if(code.rsp_code==211){
                console.log("rsp_code  ",code.rsp_code);
                // document.getElementById("pre_password").style.borderColor="red";

                //error style
                password.style.backgroundColor ="#fff0f0";
                password.style.borderColor ="#ffbdbd";
                password.value = "";
                password.setAttribute("placeholder","현재 비밀번호가 틀립니다.");

                flag = false;

            }else{
                if(code.rsp_code==401) window.location.href("401");
                else if(code.rsp_code==403) window.location.href("403");
                else if(code.rsp_code==404) window.location.href("404");
                else if(code.rsp_code==500) window.location.href("500");
            }
        })
    }

    document.getElementById("modal").style.display="none";
    document.getElementById("modal_bg").style.display="none";
}

modal_close_btn.onclick = function(){
    modal.style.display = "none";
    modal_bg.style.display = "none";
    // if(flag==1) location.reload();
}

function savePass() {
    var reg = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/;

    //비밀번호
    const pre_password = document.getElementById("pre_password").value;
    const new_password = document.getElementById("new_password").value;
    const new_password_ck = document.getElementById("new_password_ck").value;

    //팝업
    const icon_id = document.getElementById("icon_id");
    const modal_title = document.getElementById("modal_title");
    const modal_cotent = document.getElementById("modal_cotent");

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
                    user_nm : userNm_input.value,
                    user_pw_now:pre_password,
                    user_pw_new:new_password
                };

                icon_id.setAttribute("src","/image/icon_info.svg");
                modal_title.innerText = "비밀번호 변경";
                modal_cotent.innerText = "비밀번호를 변경 하시겠습니까?";

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

//현재 비밀번호 Event
password.onclick=function(){
    password.style.backgroundColor ="#ffffff";
    password.style.borderColor ="#cccccc";
    password.setAttribute("placeholder","");
}