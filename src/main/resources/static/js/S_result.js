document.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/latest.js?config=TeX-MML-AM_CHTML"></script>');
document.write('<script type="text/x-mathjax-config">MathJax.Hub.Config({tex2jax: {inlineMath: [[\'$\',\'$\'], [\'\\\\(\',\'\\\\)\']]}});</script>');

//step_div & step_span
const stepDiv_0 = document.getElementById("stepDiv_0");
const stepSpan_0 = document.getElementById("stepSpan_0");
const stepImage_0 = document.getElementById("stepImage_0");
const stepDiv_1 = document.getElementById("stepDiv_1");
const stepSpan_1 = document.getElementById("stepSpan_1");
const stepImage_1 = document.getElementById("stepImage_1");
const stepDiv_2 = document.getElementById("stepDiv_2");
const stepSpan_2 = document.getElementById("stepSpan_2");
const stepImage_2 = document.getElementById("stepImage_2");
const stepPath = document.getElementById("stepPath");
const test_level2_txt = document.getElementById("test_level2_txt");
const test_level3_txt = document.getElementById("test_level3_txt");
const test_result_div = document.getElementById("test_result");

//결과 리스트 & 결과 테이블 & title_area
const result_list_head = document.getElementById("result_list_head");
const result_list_table = document.getElementById("result_list_table");
const table_tbody = document.getElementById("table_tbody");
const title_time_span = document.getElementById("title_time_span");
const title_count_div = document.getElementById("title_count_div");
const title_btn_div = document.getElementById("title_btn_div");
const recommend_content = document.getElementById("recommend_content");

//json 결과 저장 변수
let test_result;
let path_user;
let test_user_list = [];
let final_path_yn;
let step_list;
let test_qst_list = [];

let div_index;

//그래프 DIV
let graph = document.getElementById("graph");
let graph_small = document.getElementById("graph_small");
let test_area = document.getElementById("test_area");
let graph_area = document.getElementById("graph_area");
let modal_bg = document.getElementById("modal_bg");

// getCookie 호출
var orgId = getCookie('orgId');
var orgNm = getCookie('orgNm');
var userId = getCookie('userId');
var userGrd = getCookie('userGrd');
var userTestGrd = getCookie('userTestGrd');

// 페이지 진입 data
const loadData = {
    org_id: orgId,
    user_id: userId,
    user_grd:userGrd,
    user_test_grd:userTestGrd
};

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

//페이지 진입했을 때 API 호출
function onLoadData() {
    // [ST-RE-01] 학생 테스트 결과 페이지 진입 API
    API.student.sresult({data: loadData}, function(result) {
        const loadResult = result;

        console.log("sresult API    ",loadResult);

        if(loadResult.rsp_code==200) success(loadResult.result)
        else if(loadResult.rsp_code==401) window.location.href("401");
        else if(loadResult.rsp_code==403) window.location.href("403");
        else if(loadResult.rsp_code==404) window.location.href("404");
        else if(loadResult.rsp_code==500) window.location.href("500");

        document.getElementById("modal_bg_down").style.display = "none";
    })
}

function success(result){
    console.log("--- success(result) ---");

    final_path_yn = result.final_path_yn;
    path_user = result.path_nm;
    test_user_list = result.user_test_list;

    for(let i=0; i<test_user_list.length;i++){
        let div = document.createElement('div');

        div.setAttribute("class","step");
        div.setAttribute("id","stepDiv_"+i);

        test_result_div.appendChild(div);

        console.log(test_user_list[i].user_test_level)

        if(test_user_list[i].user_test_yn=="N"){
            if(test_user_list[i].test_time==0){
                div.setAttribute("onclick","reset_cookies("+test_user_list[i].user_test_level+")");
                div.innerHTML = "<a><img src=\"/image/icon_test.svg\"><p id=\"test_level"+i+"\">"+Number(test_user_list[i].user_test_level)+"차 테스트<br>시작하기</p></a>";
            }else{
                div.setAttribute("onclick","window.location.href='S_test'");
                div.innerHTML = "<a><img src=\"/image/icon_test.svg\"><p id=\"test_level"+i+"\">"+Number(test_user_list[i].user_test_level)+"차 테스트 진행중<br>이어하기</p></a>";
            }
        }else if(test_user_list[i].user_test_yn=="Y"){
            div.setAttribute("onclick","result_list_change(this.id)");
            div.innerHTML = "<a><img src=\"/image/icon_check.svg\"><p id=\"test_level"+i+"\">"+Number(test_user_list[i].user_test_level)+"차 테스트 완료<br>결과보기</p></a>";

            let span = document.createElement('span');

            if(i==(test_user_list.length-1)) span.setAttribute("class","arrow_last");
            else span.setAttribute("class","arrow");

            test_result_div.appendChild(span);

            step_list = test_user_list[i];

        }

    }

    if(final_path_yn=="Y"){
        let div = document.createElement("div");
        //
        // div.setAttribute("class","step");
        div.setAttribute("id","stepPath");
        // div.style.display = "contents";
        div.setAttribute("onclick","user_path_view(this.id)")

        //태그 내용
        div.innerHTML = "<div class=\"step\" style=\"display: contents\"><img src=\"/image/icon_path.svg\">최종경로보기</div>";

        //태그 추가
        test_result_div.appendChild(div);

        user_path_view(path_user);
        // test_chang(step_list);
    }else test_chang(step_list);

    updateValue();
}

//누른 div에 따라 li 변경
function test_chang(e){

    console.log("--- test_chang("+e+") ---");

    //style 변경
    result_list_head.style.display="block";
    title_time_span.style.display="block";
    title_count_div.style.display="block";

    title_btn_div.style.display="none";
    result_list_table.style.display= "none";

    let count = 0;
    let change_data = e;
    let level = change_data.user_test_level;
    let data_list = change_data.qst_list;
    let test_time;

    //받아오기
    let test_total_span = document.getElementById("test_total_span");
    let test_correct_span = document.getElementById("test_correct_span");
    let test_wrong_span = document.getElementById("test_wrong_span");

    for(let i=0;i<data_list.length;i++){
        let result_list_li = document.createElement('li');

        result_list_li.setAttribute("id",level+"_"+i);
        result_list_li.setAttribute("onclick","view_test(this.id)");
        result_list_li.style.cursor = "pointer";
        result_list_li.style.dec = "pointer";

        let unitNm = data_list[i].unit_nm.replace("\\y", "\y");

        if(data_list[i].qst_answer==data_list[i].submit_answer){
            count++;
            result_list_li.innerHTML = "<span>"+(i+1)+"</span><span id=\"test_title"+i+"\">"+unitNm+"</span><span>"+data_list[i].submit_answer+"</span><span>"+data_list[i].qst_answer+"</span><span><img src=\"/image/img_o.svg\"></span>";
        }else{
            result_list_li.innerHTML = "<span>"+(i+1)+"</span><span id=\"test_title"+i+"\">"+unitNm+"</span><span>"+data_list[i].submit_answer+"</span><span>"+data_list[i].qst_answer+"</span><span><img src=\"/image/img_x.svg\"></span>";
        }

        //updateValue();
        result_list_head.appendChild(result_list_li);
    }

    //소요시간 체크 함수 호출
    if(change_data.test_time!="") test_time = getTimeFormatString(change_data.test_time);

    title_time_span.innerText = " 소요시간 "+test_time;
    // title_time_span.innerText = " 소요시간 "+change_data.test_time;
    test_total_span.innerText = "문항 " + change_data.qst_list.length;
    test_correct_span.innerText = "정답 " + count;
    test_wrong_span.innerText = "오답 " + (change_data.qst_list.length-count);

    updateValue();

}

//페이지 진입시
window.onload = function(){
    onLoadData();
};

//테스트 결과
function result_list_change(e){

    console.log("--- result_list_change("+e+") ---");

    let divIndex = e.split("_");
    div_index = divIndex[1];

    //style 변경
    result_list_head.style.display="block";
    title_time_span.style.display="block";
    title_count_div.style.display="block";

    title_btn_div.style.display="none";

    result_list_head.style.display = "block";
    result_list_table.style.display= "none";

    removeAllchild(result_list_head); //표기된 결과 삭제
    test_chang(test_user_list[div_index]); //바뀐 결과 추가

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
    result_list_head.style.display="none";
    title_time_span.style.display="none";
    title_count_div.style.display="none";

    title_btn_div.style.display="block";
    result_list_table.style.display= "";

    removeTable();

    //table 생성
    for(let j=0;j<pathUser.length;j++){
        let fail = pathUser[j][1].fail;
        let pass = pathUser[j][1].pass;
        let path_length = 0;

        // if(Object.keys(pass).length==0) path_length = Object.keys(fail).length;
        // else path_length = Object.keys(pass).length;
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


            // if(i==2){
            //     console.log(Object.keys(pass))
            //     if(Object.keys(pass)[i]==undefined) path_tr.innerHTML += "<td rowspan="+path_length+"></td>";
            //     else path_tr.innerHTML += "<td rowspan="+path_length+">"+Object.keys(pass)[i]+"</td>";
            // }

            //path_tr.innerHTML += "<td>"+Object.keys(pass)[i]+"</td>";
            //"<td rowspan="+path_length+"></td>";


        }
    }

    updateValue();
}

//test 확인
function view_test(id){
    console.log("--- view_test("+id+") ----");

    id = id.split("_");
    let level = Number(id[0])-1;
    let index = Number(id[1]);

    let qst_value_list = test_user_list[level].qst_list;

    let test_num = document.getElementById("test-num");
    let test_level = document.getElementById("test-level");
    let test_title = document.getElementById("test-title");
    let test_img = document.getElementById("test-img");

    let edu_level_nm = change_eduLevelNM(qst_value_list[index].edu_level_nm);

    let qstNm = qst_value_list[index].unit_nm.replace("\\y", "\y");

    if(edu_level_nm.includes("초등")) test_level.setAttribute("class","testlevel-es")
    else if(edu_level_nm.includes("중등")) test_level.setAttribute("class","testlevel-ms")
    else if(edu_level_nm.includes("고등")) test_level.setAttribute("class","testlevel-hs")

    test_num.innerText = "문제"+(index+1);
    test_level.innerText = edu_level_nm;
    test_title.innerText = qstNm;
    test_img.setAttribute("src",API.image.viewer(qst_value_list[index].qst_img_file_nm));

    graph_small.style.right="0";
    test_area.style.display="block";
    graph_area.style.display = "none";
    modal_bg.style.display="block";

    updateValue();
}

//li 값 삭제
function removeAllchild(e){
    while (e.childElementCount-1) {
        e.removeChild(e.lastChild);
    }
}

//table 값 삭제
function removeTable(){
    table_tbody.innerHTML = "";
}

function change_eduLevelNM(edu_level_nm){
    console.log("change_eduLevelNM")
    let split = edu_level_nm.split('');

    split[0] = split[0].replace("E","초등").replace("M","중등").replace("H","고등");
    edu_level_nm = split[0]+split[1]+"-"+split[2];



    return edu_level_nm;

}

//"테스트 시작하기" 시 테스트 단계 쿠키 변경
function reset_cookies(testGrd) {
    console.log("--- reset_cookies("+testGrd+") ---")

    //var userTestLevel = getCookie('userTestLevel');

    document.cookie = "userTestLevel=0"+Number(testGrd)+";path=/;";

    // if(Number(testGrd)==2) document.cookie = "userTestLevel=0"+Number(testGrd)+";path=/;";
    // else if(Number(testGrd)==3)document.cookie = "userTestLevel=03;path=/;";

    window.location.href='S_test';
}

function updateValue() {
    // console.log(e.target.value)
    // log.textContent = e.target.value;
    //adding in queue

    //MathJax.Hub.Queue(["Typeset", MathJax.Hub, "test_title"]);
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, "test-title"]);
}

function updateValue(id) {
    // console.log(e.target.value)
    // log.textContent = e.target.value;
    //adding in queue

    MathJax.Hub.Queue(["Typeset", MathJax.Hub, id]);
}

// 경과 시간을 시,분,초 문자열로 변환
function getTimeFormatString(time) {
    console.log("--- getTimeFormatString(time) ---")
    let hour = parseInt(String(time / (60 * 60)));
    let min = parseInt(String((time - (hour * 60 * 60)) / 60));
    let sec = time % 60;

    return String(hour).padStart(2, '0') + ":" + String(min).padStart(2, '0') + ":" + String(sec).padStart(2, '0');
}

function linkFail(fail){
    console.log("--- linkFail(fail) ---");
    let link_fail="";

    for(let i=0; i<fail.length;i++) {
        if(i==(fail.length)-1) link_fail += fail[i];
        else link_fail += fail[i]+"<i class=\"path_arrow\"></i>";
    }

    return link_fail;

}

function linkPass(pass){
    console.log("--- linkFail(pass) ---");
    let link_pass="";

    for(let i=0; i<pass.length;i++) {
        if(i==(pass.length)-1) link_pass += pass[i];
        else link_pass += pass[i]+"<br>";
    }

    return link_pass;

}

//추천콘텐츠
document.getElementById("recommend_content").onclick = function() {
    // document.getElementById("recommend_content").style.display = "block";
    document.getElementById("modal").style.display = "block";
    document.getElementById("modal_bg").style.display = "block";
}

//팝업창 닫기
document.getElementById("modal_bg").onclick = function() {
    modal_bg.style.display = "none";
    document.getElementById("modal").style.display="none";
    if(graph.style.right="0") graph.style.right="-100%";
    if(graph_small.style.right="0") graph_small.style.right="-70%";
}

//추천 콘텐츠 팝업창 닫기
document.getElementById("img_best").onclick = function() {
    document.getElementById("modal").style.display="none";
    modal_bg.style.display = "none";
}