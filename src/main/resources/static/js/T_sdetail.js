document.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/latest.js?config=TeX-MML-AM_CHTML"></script>');
document.write('<script type="text/x-mathjax-config">MathJax.Hub.Config({tex2jax: {inlineMath: [[\'$\',\'$\'], [\'\\\\(\',\'\\\\)\']]}});</script>');


// getCookie 호출
var orgId = getCookie('orgId');
var userId = getCookie('userId');

// getParameter 호출
var s_userId = getParameter("user_id");
var s_userGrd = getParameter("user_grd");

//json 결과 저장 변수
let test_result;
let path_user;
let test_user_list = [];
let final_path_yn;

//select 변수
let select_value = "";

//remove 체크
let removeck = false;

//save 체크
let saveCk = false;

//답안지 보기 버튼 체크
let btnId = "";

// 페이지 진입 data
const loadData = {
    org_id: orgId,
    user_id: s_userId,
    user_grd:s_userGrd
};

let saveData = {};

document.getElementById("modal_bg_down").style.display = "block";
document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('main').className += 'loaded';
});

//cookie 가져오기기
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? unescape(matches[1]) : undefined;
}

//T_list 파라미터 받기
function getParameter(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// 페이지 로딩 시 API 호출
function onLoadData() {
    API.tutor.tsdetail ({data: loadData}, function (result) {
        // API 호풀 결과
        const loadResult = result;
        console.log("tsdetail API      ",loadResult);

        if(loadResult.rsp_code==200){

            test_result =  loadResult.result;
            final_path_yn = test_result.final_path_yn;
            test_user_list = test_result.user_test_list;

            //기본정보 테이블에 정보 넣기
            document.getElementById("user_nm").innerText = s_userId;
            document.getElementById("user_state").style.display = "";
            document.getElementById("user_gbn").innerText = s_userGrd;
            document.getElementById("userTestGrd").innerText = test_result.class_gbn;
            document.getElementById("user_Test_Grd").innerText = test_result.class_gbn;

            //학생 상태에 따른 select 값 지정
            // if(test_result.user_state=="1") document.getElementById("user_state").value = document.getElementById("user_state")[0].value;
            // else document.getElementById("user_state").value = document.getElementById("user_state")[1].value;
            viewState(test_result.user_state);


            //최종경로보기 버튼 활성화
            if(final_path_yn=="Y"){
                document.getElementById("view_graph").disabled = false;
                document.getElementById("view_table").disabled = false;
                document.getElementById("view_graph").setAttribute("class","btn_purple");
                document.getElementById("view_table").setAttribute("class","btn_blue");
                path_user = test_result.path_nm;
            }

            //createDiv(test_list) 호출
            for(let i=0; i<test_user_list.length; i++){
                createDiv(test_user_list[i]);
            }
        }
        else if(loadResult.rsp_code==401) window.location.href("401");
        else if(loadResult.rsp_code==403) window.location.href("403");
        else if(loadResult.rsp_code==404) window.location.href("404");
        else if(loadResult.rsp_code==500) window.location.href("500");

        document.getElementById("modal_bg_down").style.display = "none";
    })
}

// 페이지 로딩 시 API 호출
window.onload = onLoadData;

//단계 DIV
function createDiv(test_list){
    console.log("--- createDiv ---");
    let score;
    let level = Number(test_list.user_test_level);
    let test_time;

    if(test_list.test_time!="") test_time = getTimeFormatString(test_list.test_time);

    document.getElementById("table_div"+level).style.display="block";
    document.getElementById("last_time"+level).innerText = test_time;

    if(test_list.user_test_yn=="Y"){
        //setScore(qst_list) return 값 받아오기
        // score = Math.floor((setScore(test_list.qst_list)/qst_list.length)*100);
        score = setScore(test_list.qst_list);
        document.getElementById("last_score"+level).innerText = score+"점";
        document.getElementById("result_btn"+level).style.display="";
    }
    else{
        if(test_time=="00:00:00") document.getElementById("last_score"+level).innerHTML = "테스트 미진행";
        else document.getElementById("last_score"+level).innerHTML = "테스트 진행중";
    }
}

//점수 계산
function setScore(qst_list){
    console.log("--- setScore ---");

    let count = 0;
    let score = 0;

    // qst_answer과 submit_answer가 같으면 count
    for(let i=0;i<qst_list.length;i++){
        if(qst_list[i].qst_answer == qst_list[i].submit_answer) count++;
    }

    score = Math.floor((count/qst_list.length)*100);
    return score

}

document.getElementById("result_btn1").onclick = function() {
    checkedButton(this.id)
    viewAnswer(this.id);
    btnId = this.id;
}
document.getElementById("result_btn2").onclick = function() {
    checkedButton(this.id)
    viewAnswer(this.id);
    btnId = this.id;
}
document.getElementById("result_btn3").onclick = function() {
    checkedButton(this.id)
    viewAnswer(this.id);
    btnId = this.id;
}

function checkedButton(id){
    console.log("--- checkedButton(id) ---");
    console.log(btnId, id)
    if(btnId=="" || btnId != id){
        //답안지 style
        // if(answer.style.right === "" || answer.style.right === "-260px") answer.style.right = "0px";
        // else answer.style.right = "-260px";

        answer.style.right = "0px";
    }else if(btnId == id){
        if(answer.style.right === "" || answer.style.right === "-260px") answer.style.right = "0px";
        else answer.style.right = "-260px";
    }
}

//답안지 보기 버튼을 누르면
function viewAnswer(id){
    console.log("--- viewAnswer(id) ---");

    let btn_id = Number(id.replace("result_btn",""));
    let qst_list = test_user_list[btn_id-1].qst_list;
    let ck=0;

    //답안지 remove
    if(removeck) removeAllchild(document.getElementById("ans-list"));
    else removeck = true;

    if(Number(test_user_list[btn_id-1].user_test_level)== btn_id){
        document.getElementById("ans-total").innerText = "문항" + qst_list.length;

        for(let i=0;i<qst_list.length;i++){
            //li 태그 만들기
            let li = document.createElement('li');

            //태그 속성 추가
            li.setAttribute("id",(btn_id-1)+"_"+i);
            li.setAttribute("onclick","viewTest(this.id)");
            li.style.cursor = "pointer";

            //결과
            if(qst_list[i].qst_answer == qst_list[i].submit_answer){
                li.innerHTML = "<span>"+(i+1)+"</span><span>"+qst_list[i].submit_answer+"</span><span><img src=\"/image/img_o.svg\"></span>";
                ck++;
            }else li.innerHTML = "<span>"+(i+1)+"</span><span>"+qst_list[i].submit_answer+"</span><span><img src=\"/image/img_x.svg\"></span>";

            //부모 태그에 태그 추가
            document.getElementById("ans-list").appendChild(li);
        }

        document.getElementById("ans-cnt").innerText = "정답 : " + ck;
        document.getElementById("null-cnt").innerText = "오답 : " + (qst_list.length - ck);
    }

}

//문제 팝업
function viewTest(id){
    console.log("--- viewTest(id) ---");

    let li_id = id.split('_');
    let select_test = test_user_list[li_id[0]].qst_list[li_id[1]];
    let selectNm = select_test.unit_nm.replace("\\y", "\y");
    //let unitNm = data_list[i].unit_nm.replace("\\y", "\y");

    //div style
    document.getElementById('modal_bg').style.display="block";
    document.getElementById('T_graph').style.right="260px";
    document.getElementById('test_area').style.display="block";

    //교육과정 split
    let edu_level_nm = select_test.edu_level_nm.split("");

    //교육과정 style 및 값 변경
    if(edu_level_nm[0].includes("E")) document.getElementById('test-level').setAttribute("class","testlevel-es")
    else if(edu_level_nm[0].includes("M")) document.getElementById('test-level').setAttribute("class","testlevel-ms")
    else if(edu_level_nm[0].includes("H")) document.getElementById('test-level').setAttribute("class","testlevel-hs")

    edu_level_nm = edu_level_nm[0]+edu_level_nm[1]+"-"+edu_level_nm[2];

    //test_div에 출력
    document.getElementById('test-num').innerText = "문제" + (Number(li_id[1])+1);
    document.getElementById('test-level').innerText = edu_level_nm.replace("E","초등").replace("M","중등").replace("H","고등");
    document.getElementById('test-title').innerText = selectNm;
    // document.getElementById('test-img').setAttribute("src","/image/qst"+select_test.qst_img_file_nm);
    document.getElementById('test-img').setAttribute("src",API.image.viewer(select_test.qst_img_file_nm));


    updateValue();
}

//문제 팝업시, 뒷배경을 누르면 팝업 없애기
document.getElementById('modal_bg').onclick = function (){
    document.getElementById('T_graph').style.right="-60vw";
    document.getElementById('graph').style.right="";
    document.getElementById('graph_table').style.right="";
    document.getElementById('modal_bg').style.display="none";
    // if(document.getElementById("ans-list").childNodes) removeAllchild(document.getElementById("ans-list"));
    document.getElementById('answer').style.right = "-260px";
    document.getElementById('modal').style.display = "none";

}

//모달 삭제
document.getElementById('modal_ok_btn').onclick = function(){
    document.getElementById('modal').style.display = "none";
    document.getElementById('modal_bg').style.display = "none";

    if(saveCk){
        API.tutor.tsSave({data: saveData}, function (saveResult) {
            console.log(saveResult)
            if(saveResult.rsp_code==200){
                //user_state.innerHTML = "";
                //viewState(select_value);
                select_value = "";
                document.getElementById("reset_pass").value = "";
            }
            else if(saveResult.rsp_code==401) window.location.href("401");
            else if(saveResult.rsp_code==403) window.location.href("403");
            else if(saveResult.rsp_code==404) window.location.href("404");
            else if(saveResult.rsp_code==500) window.location.href("500");
        });
    }
}

document.getElementById('modal_close_btn').onclick = function(){
    document.getElementById('modal').style.display = "none";
    document.getElementById('modal_bg').style.display = "none";
}


//학생 정보 변경
function infoSave(){
    console.log("--- infoSave() ---");
    let suserTestGrd="";
    let state;
    let reset_pass = document.getElementById("reset_pass").value;

    document.getElementById('modal').style.display = "block";
    document.getElementById('modal_title').innerText = "변경 정보 확인";
    document.getElementById('modal_bg').style.display = "block";

    if(select_value=="" && reset_pass.length==0){
        document.getElementById("icon_id").setAttribute('src',"/image/icon_error.svg");
        document.getElementById('modal_cotent').innerText = "변경할 정보가 없습니다.";
    }else{
        if(orgId.includes("A")) state = select_value.replace("0","휴원").replace("1","재원");
        else state = select_value.replace("0","휴학").replace("1","재학");

        document.getElementById("icon_id").setAttribute('src',"/image/icon_info.svg");

        if(select_value!="" && reset_pass.length==0) document.getElementById('modal_cotent').innerText = "'"+s_userId+"'"+"의 상태를 '"+state+"' 로 바꾸시겠습니까?";
        else if(select_value=="" && reset_pass.length!=0) document.getElementById('modal_cotent').innerText = "'"+s_userId+"'"+"의 비밀번호를 '"+reset_pass+"' 로 바꾸시겠습니까?";
        else document.getElementById('modal_cotent').innerHTML = "'"+s_userId+"'"+"의 상태를 '"+state+"' 로,<br>'"+s_userId+"'"+"의 비밀번호를 '"+reset_pass+"' 로 바꾸시겠습니까?";

        // if(select_value!="") select_value = select_value.replace("휴원",0).replace("재원",1);

        if(test_result.class_gbn.includes("-")) {
            let split = test_result.class_gbn.split("");
            suserTestGrd = split[0].replace("초","E").replace("중","M").replace("고","H")+split[1]+split[3];
        }else suserTestGrd = test_result.class_gbn.replace("초","E").replace("중","M").replace("고","H");

        saveData = {
            org_id: orgId,
            user_id: s_userId,
            user_state:select_value,
            new_pw : reset_pass,
            user_grd:s_userGrd,
            user_test_grd:suserTestGrd
        };
        saveCk = true;
    }
}


//상태 value 받아오기
const userState = (target) => {
    // 선택한 option의 value 값
    select_value = target.value;
}

//li 값 삭제
function removeAllchild(e){
    console.log("--- removeAllchild(e) ---")
    while (e.childElementCount) {
        e.removeChild(e.lastChild);
    }
}
// 경과 시간을 시,분,초 문자열로 변환
function getTimeFormatString(time) {
    console.log("--- getTimeFormatString(time) ---")
    let hour = parseInt(String(time / (60 * 60)));
    let min = parseInt(String((time - (hour * 60 * 60)) / 60));
    let sec = time % 60;

    return String(hour).padStart(2, '0') + ":" + String(min).padStart(2, '0') + ":" + String(sec).padStart(2, '0');
}

//X 버튼으로 답안지 닫기
document.getElementById("answer_wrap_close").onclick=function(){
    document.getElementById("answer").style.right = "-260px";
    document.getElementById("T_graph").style.right="-60vw";
    document.getElementById("modal_bg").style.display = "none";
}

document.getElementById("view_table").onclick = function(){
    document.getElementById('graph_table').style.right="0";
    document.getElementById('table_area').style.right="block";
    document.getElementById("modal_bg").style.display = "block";
    document.getElementById("graph_area").style.display = "none";

    const result_list_head = document.getElementById("result_list_head");
    const result_list_table = document.getElementById("result_list_table");
    const table_tbody = document.getElementById("table_tbody");

    user_path_view(path_user);

    if(document.getElementById('answer') && document.getElementById('T_graph')){
        document.getElementById('answer').style.right = "-260px";
        document.getElementById('T_graph').style.right="-60vw";
    }

}

//경로 table
function user_path_view(path_list){
    console.log("--- user_path_view(path_list) ---");

    let pathUser;
    let pathUser_unit;

    //user_path 로드
    if(path_list == "stepPath") pathUser = Object.entries(path_user);
    else pathUser = Object.entries(path_list);

    //pathUser = Object.entries(test)

    //style 변경
    table_tbody.innerHTML = "";

    //table 생성
    for(let j=0;j<pathUser.length;j++){
        let fail = pathUser[j][1].fail;
        let pass = pathUser[j][1].pass;
        let path_length = 0;

        path_length = Object.keys(fail).length;

        if(path_length==0){
            let path_tr = document.createElement('tr');

            path_tr.innerHTML = "<td>"+pathUser[j][0]+"</td>";
            path_tr.innerHTML += "<td></td>";
            path_tr.innerHTML += "<td></td>";


            if(Object.keys(pass).length!=0){
                let pass_nm = linkPass(Object.keys(pass));
                path_tr.innerHTML += "<td>"+pass_nm+"</td>";
            }
            else path_tr.innerHTML += "<td>"+Object.keys(pass)+"</td>";

            table_tbody.appendChild(path_tr);

        }
        else{
            for(let i=0;i<path_length;i++){
                let path_tr = document.createElement('tr');
                let testlevel;

                //초,중,고 학년에 맞는 클래스
                if(Object.keys(fail)[i]!=undefined){
                    if(Object.keys(fail)[i].includes("초등")) testlevel = "testlevel-es";
                    else if(Object.keys(fail)[i].includes("중등")) testlevel = "testlevel-ms";
                    else if(Object.keys(fail)[i].includes("고등")) testlevel = "testlevel-hs";
                }

                if(i==0) path_tr.innerHTML = "<td rowspan="+path_length+">"+pathUser[j][0]+"</td>";

                if(Object.keys(fail)[i]==undefined) path_tr.innerHTML += "<td><span class="+testlevel+"></span></td>";
                else path_tr.innerHTML += "<td><span class="+testlevel+">"+Object.keys(fail)[i]+"</span></td>";

                if(Object.values(fail)[i]==undefined) path_tr.innerHTML += "<td class=\"left\"><span></span></td>";
                else{
                    if(Object.values(fail)[i].length!=0){
                        let fail_nm = linkFail(Object.values(fail)[i]);
                        path_tr.innerHTML += "<td class=\"left\"><span>"+fail_nm+"</span></td>";
                    }
                    else path_tr.innerHTML += "<td class=\"left\"><span>"+Object.values(fail)[i]+"</span></td>";
                }

                if(i==0){
                    if(Object.keys(pass).length!=0){
                        let pass_nm = linkPass(Object.keys(pass));
                        path_tr.innerHTML += "<td rowspan="+path_length+">"+pass_nm+"</td>";
                    }
                    else path_tr.innerHTML += "<td rowspan="+path_length+">"+Object.keys(pass)+"</td>";
                }

                table_tbody.appendChild(path_tr);
            }
        }
    }

    updateValue();

    //학습경로
    function linkFail(fail){
        console.log("--- linkFail(fail) ---");
        let link_fail="";

        for(let i=0; i<fail.length;i++) {
            if(i==(fail.length)-1) link_fail += fail[i];
            else link_fail += fail[i]+"<i class=\"path_arrow\"></i>";
        }
        return link_fail;
    }

    //잘해요
    function linkPass(pass){
        console.log("--- linkFail(pass) ---");
        let link_pass="";

        for(let i=0; i<pass.length;i++) {
            if(i==(pass.length)-1) link_pass += pass[i];
            else link_pass += pass[i]+"<br>";
        }
        return link_pass;
    }
}

//latex
function updateValue() { MathJax.Hub.Queue(["Typeset", MathJax.Hub, "test-title"]); }
function updateValue(id) { MathJax.Hub.Queue(["Typeset", MathJax.Hub, id]); }

//상태
function viewState(state){
    let option0 = document.createElement("option");
    let option1 = document.createElement("option");

    if(state==0){
        option0.setAttribute("value",0);
        option0.innerText = "휴학";
        option1.setAttribute("value",1);
        option1.innerText = "재학";
    }else{
        option0.setAttribute("value",1);
        option0.innerText = "재학";
        option1.setAttribute("value",0);
        option1.innerText = "휴학";
    }

    if(orgId.includes("A")){
        option0.innerText = option0.innerText.replace("학","원");
        option1.innerText = option1.innerText.replace("학","원");
    }

    document.getElementById("user_state").appendChild(option0);
    document.getElementById("user_state").appendChild(option1);
}




