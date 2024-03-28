// getCookie 호출
var orgId = getCookie('orgId');
var orgNm = getCookie('orgNm');
var userId = getCookie('userId');

//팝업
const icon_id = document.getElementById("icon_id");
const modal_title = document.getElementById("modal_title");
const modal_cotent = document.getElementById("modal_cotent");

//input
const password = document.getElementById("pre_password");

// 페이지 진입 data
const loadData = {
    org_id: orgId,
    user_id: userId
};
let saveData={};

let teacher_list;

let savePass = [];
let changePassData = {};

//버튼 클릭 체크
let ck = 0;
let flag = false;
let tSaveCk = false;

//cookie 가져오기기
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? unescape(matches[1]) : undefined;
}

function onLoadData() {
    API.admin.amypage({data: loadData}, function (result) {
        console.log("amypage API    ",result);
        const testResult = result.result;
        teacher_list = testResult.teacher_list;

        // 테이블 + 페이지네이션 렌더링
        render(teacher_list);

    })
}

window.onload = onLoadData;

document.getElementById("open_password").onclick = function() {
    if(ck==0 || ck%2==0){
        document.getElementById("password").style.display="block";
        document.getElementById("btn_save").setAttribute("onclick","adminSavePass()");
        document.getElementById("btn_save").setAttribute("class","btn");
        //btn_save.style.background = "";
    }else{
        document.getElementById("password").style.display="none";
        document.getElementById("btn_save").removeAttribute("onclick");
        document.getElementById("btn_save").setAttribute("class","btn-gray");
        //btn_save.style.background = "--bg_gray";
    }

    ck++;
}

function adminSavePass(){
    console.log("--- adminSavePass() ---");
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

document.getElementById("modal_close_btn").onclick = function() {
    document.getElementById("modal").style.display="none";
    document.getElementById("modal_bg").style.display="none";
}

document.getElementById("modal_ok_btn").onclick = function() {
    document.getElementById("modal").style.display="none";
    document.getElementById("modal_bg").style.display="none";

    if(flag){
        //API 호출
        API.student.aSave({data: changePassData}, function (result) {
            const code = result;
            console.log("aSave API  ",result);

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

            }else{
                flag = false;
                if(code.rsp_code==401) window.location.href("401");
                else if(code.rsp_code==403) window.location.href("403");
                else if(code.rsp_code==404) window.location.href("404");
                else if(code.rsp_code==500) window.location.href("500");
            }
        })
    } else if(tSaveCk){
        // [API-03] 비밀번호 초기화
        API.admin.atSave({data: saveData}, function(result) {
            const code = result;

            if(code.rsp_code==200){
                console.log("atSave API rsp_code  ",code.rsp_code);
                window.location.reload();
            }else{
                if(code.rsp_code==401) window.location.href("401");
                else if(code.rsp_code==403) window.location.href("403");
                else if(code.rsp_code==404) window.location.href("404");
                else if(code.rsp_code==500) window.location.href("500");
                tSaveCk = false;
            }
        });
    }
}

// 페이지네이션
function render(list) {
    // 테이블 column 수
    const pageCount = 10;
    // 페이지네이션 block 안에 담겨질 양
    const blockCount = 10;
    // 총 페이지 수
    let totalPage = Math.ceil(list.length / pageCount);
    // 총 페이지네이션 block 수
    let totalBlock = Math.ceil(totalPage / blockCount);

    let pagination = '';
    let table = '';

    pagination = document.getElementById("pagination");

    let renderTableAndPagination = function(page = 1) {
        renderTable(page);
        renderPagination(page);
    }

    //테이블 렌더링
    let renderTable = function(page) {
        console.log("--- renderTable ----")
        let startNum = (pageCount * (page - 1));
        let endNum = ((pageCount * page) >= list.length ? list.length : (pageCount * page));
        let html = '';
        for(let index = startNum; index < endNum; index++) {
            let tr = document.createElement('tr');

            if(list[index].teacher_id==undefined) tr.innerHTML = "<td></td>";
            else tr.innerHTML = "<td id=\"id"+index+"\">"+list[index].teacher_id+"</td>";

            tr.innerHTML += "<td><input type=\"text\" id=\"input"+index+"\" value=\"\" style=\"width: 150px;\"><button type=\"button\" class=\"btn_gray\" onclick=\"resetPassword("+index+"),changedPass("+index+")\">리셋</button></td>";

            if(teacher_list[index].teacher_nm==null) tr.innerHTML += "<td></td>";
            else tr.innerHTML += "<td>"+list[index].teacher_nm+"</td>";
            table_tbody.appendChild(tr);
        }
        // table.innerHTML = html;
    }

    // 페이지네이션 렌더링
    let renderPagination = function(page) {
        console.log("--- renderPagination ----");
        let block = Math.floor((page-1) / blockCount) + 1;
        let startPage = ((block-1) * blockCount) + 1;
        let endPage = ((startPage + blockCount - 1) > totalPage) ? totalPage : (startPage + blockCount -1);
        let paginationHTML = '';

        // 이전 페이지 출력
        if (block !== 1) paginationHTML += "<li id='back_page' style='margin-right:20px'><span class='prev'></span></li>";

        // 페이지 목록 출력
        for(let index = startPage; index <= endPage; index++) {
            paginationHTML += (parseInt(page) === index) ?
                "<li class='current'>" + index + "</li>" :
                "<li id='go_page' data-value='" + index + "'>" + index + "</li>";
        }

        // 다음 페이지 출력
        if(block < totalBlock) paginationHTML += "<li id='next_page' style='margin-left:20px'><span class='next'></span></li>";

        // 페이지네이션 선언
        pagination.innerHTML = paginationHTML;
        addEventPagination(startPage, endPage);
    }

    let addEventPagination = function(startPage, endPage) {
        console.log("--- addEventPagination ----");
        // 이전 페이지 버튼 클릭
        if(!!document.querySelector('#back_page')) {
            document.querySelector('#back_page').addEventListener('click', () => {
                table_tbody.innerHTML = "";
                renderTableAndPagination(startPage - 1);
            });
        }
        // 페이지 클릭
        document.querySelectorAll('#go_page').forEach(goPage => {
            goPage.addEventListener('click', e => {
                table_tbody.innerHTML = "";
                renderTableAndPagination(e.target.getAttribute('data-value'));
            });
            // goPage.addEventListener("click", updateValue);
        });
        // 다음 페이지 버튼 클릭
        if(!!document.querySelector('#next_page')) {
            document.querySelector('#next_page').addEventListener('click', () => {
                table_tbody.innerHTML = "";
                renderTableAndPagination(endPage + 1);
            });
        }
    }

    renderTableAndPagination();
}

function changedPass(index) {
    // obj.style.backgroundColor = '#e4e4fe';
    let id = "id" + index;
    let pass = "input" + index;

    let teacherId = document.getElementById(id).innerText;
    let teacherNewPw = document.getElementById(pass).value;

    savePass.push({teacher_id: teacherId, teacher_new_pw: teacherNewPw});
}

// 사용자 계정 저장 클릭
document.getElementById("pass-save").onclick = function() {
    let saveList = [];

    document.getElementById("modal").style.display="block";
    document.getElementById("modal_bg").style.display="block";

    if(savePass!=""){
        console.log(savePass);
        icon_id.setAttribute("src","/image/icon_info.svg");
        modal_title.innerText = "비밀번호 변경";
        // modal_cotent.innerText = (savePass.length)+"명의 비밀번호를 변경하시겠습니까?";
        modal_cotent.innerText = "선생님의 비밀번호를 변경하시겠습니까?";

        tSaveCk = true;

        for(let s=0; s<savePass.length; s++) {
            saveList.push({teacher_id: savePass[s].teacher_id, teacher_new_pw: savePass[s].teacher_new_pw});
        }

        saveData = {
            org_id: orgId,
            user_id : userId,
            teacher_list: saveList
        }

        savePass = new Array();
    }else{
        icon_id.setAttribute("src","/image/icon_error.svg");
        modal_title.innerText = "비밀번호 변경 확인";
        modal_cotent.innerText = "비밀번호 변경을 위해 '리셋 버튼' 을 눌러주세요.";
    }
}

//현재 비밀번호 Event
password.onclick=function(){
    password.style.backgroundColor ="#ffffff";
    password.style.borderColor ="#cccccc";
    password.setAttribute("placeholder","");
}