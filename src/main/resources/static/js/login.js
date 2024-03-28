//json 결과 저장 변수
let test_result;
let org_id = "";

let params_error;
let params_exception;

let rememberId = getCookie('rememberId');
let rememberOrg = getCookie('rememberOrg');

//cookie 초기값 셋팅
document.cookie = "pageType=class;path=/;";
document.cookie = "searchType=;path=/;";

//cookie 가져오기기
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? unescape(matches[1]) : undefined;
}

// 받아온 데이터 쿠키에 넣기
function setCookie(name, value, days) {
    var exdate = new Date();
    // date.setTime(date.getTime() + exp * 24 * 60 * 60 * 1000);
    exdate.setDate(exdate.getDate() + days);
    document.cookie = name + '=' + escape(value) + ';expires=' + exdate.toUTCString() + ';path=/';
}


if(rememberId){
    document.getElementById('input_id').value = rememberId;
    document.getElementById('remember').checked = true;
}


//페이지 진입했을 때 API 호출
function onLoadData() {
    if(window.location.search!=""){
        //window.location.search 받아오기
        let params = new URLSearchParams(window.location.search);

        //window.location.search 안 error 값 가져오기
        params_error = params.get("error");

        //window.location.search 안 error 값 가져오기
        params_exception = params.get("exception");

        //url 정리
        let url = window.location.href.split('?');
        history.pushState(null, null, url[0]);

        console.log(window.location.search)
        console.log(params_error,params_exception)

        if(params_error=="true"){
            let text_error = document.getElementById('text_error');
            text_error.style.display="block";
            text_error.innerText = params_exception;
        }

    }

    API.login.login({data: ''}, function (result) {
        const testResult = result;

        if(result.rsp_code==200){
            test_result = testResult.result;

            console.log("API    ",test_result);

            test_result.org_list.sort(function(a, b) {return a.org_nm.localeCompare(b.org_nm, undefined, {numeric: true,sensitivity: 'base'});});

            for(let i=0; i<test_result.org_list.length; i++){
                if(rememberOrg === test_result.org_list[i].org_id){
                    org_id = test_result.org_list[i].org_id;
                    document.querySelector(".selected-value").innerText = test_result.org_list[i].org_nm;
                }

                    //document.querySelector(".select").innerText = test_result.org_list[i].org_nm;

                let org_li = document.createElement('li');
                org_li.setAttribute('id',test_result.org_list[i].org_id);
                org_li.setAttribute('class',"option");
                org_li.setAttribute('onclick',"getOrgId(this.id)")
                org_li.innerText = test_result.org_list[i].org_nm;
                document.getElementById("org-list").appendChild(org_li);

            }

        }else if(result.rsp_code==401) window.location.href("401");
        else if(result.rsp_code==403) window.location.href("403");
        else if(result.rsp_code==404) window.location.href("404");
        else if(result.rsp_code==500) window.location.href("500");


    })

}

// if (window.event.keyCode == 13) {
//     console.log("enter");
// }

//페이지 진입시
window.onload = onLoadData;

//쿠키 삭제하는 함수
// function delete_cookie(name) {
//     document.cookie = encodeURIComponent(name) + '=; expires=Thu, 01 JAN 1999 00:00:10 GMT';
// }

function login_aitutor(){
    // var loginForm = document.login-form;
    let input_id = document.getElementById("input_id").value;
    let input_pass = document.getElementById("input_pass").value;

    if(org_id ==="" || input_id==="" || input_pass===""){
        document.getElementById('modal_bg').style.display="block";
        document.getElementById('modal').style.display="block";
        if(org_id === "") document.getElementById('model_cotent').innerText = "교육 기관을 선택해주세요.";
        else if(input_id==="") document.getElementById('model_cotent').innerText = "아이디를 입력해주세요.";
        else if(input_pass==="") document.getElementById('model_cotent').innerText = "비밀번호를 입력해주세요.";

    }else {
        //form 생성
        let form = document.createElement('form');

        //form 내용 지정
        form.action = "/login";
        form.method = 'POST';

        form.innerHTML = '<input name="username" value="' + org_id + "/" +input_id+ '">';
        // form.innerHTML = '<input name="username" value="'+input_id+ '">';
        form.innerHTML += '<input name="password" value="' + input_pass + '">';

        //form 생성
        document.body.append(form);

        if(document.getElementById("remember").checked){
            // if(rememberId && rememberId!=input_id) setCookie("rememberId",input_id,3);
            setCookie("rememberId",input_id,3);
            setCookie("rememberOrg",org_id,3);
        }else{
            deleteCookie("rememberId");
            deleteCookie("rememberOrg");
        }

        //form 동작
        form.submit();
    }
}


function getOrgId(orgId){
    org_id = orgId;
}

document.getElementById('modal_ok_btn').onclick=function(){
    document.getElementById('modal_bg').style.display="none";
    document.getElementById('modal').style.display="none";
}

document.getElementById('btn_modal_close').onclick = function(){
    document.getElementById('modal_bg').style.display="none";
    document.getElementById('modal').style.display="none";
}

// document.getElementById("remember").onclick = function(){
//     let input_id = document.getElementById("input_id").value;
//
//     if(input_id!=""){
//         // if (document.getElementById("remember").checked) document.cookie = "rememberId="+input_id+";";
//         if (document.getElementById("remember").checked) setCookie("rememberId",input_id,3);
//         else document.cookie = deleteCookie("rememberId");
//     }
//
//     // if(org_id!=""){
//     //     if (document.getElementById("remember").checked) setCookie("rememberId",input_id,3);
//     //     else document.cookie = setCookie("rememberId","",3);
//     // }
//
//     console.log(document.cookie);
// }
//

function deleteCookie(name) {
    document.cookie = name + '=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function nextInput(){
    document.getElementById("input_pass").focus();
}