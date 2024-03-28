//json 결과 저장 변수
let resultList = [];
let userList = [];
let s_score = [];

let proList = [];
let comList = [];

//태그
let test_progress = document.getElementById("test_progress");
let test_complete = document.getElementById("test_complete");

//seleter
let pro = [];
let com = [];

let ck = 0;

// getCookie 호출
var orgId = getCookie('orgId');
var orgNm = getCookie('orgNm');
var userId = getCookie('userId');
var userNm = getCookie('userNm');

// getParameter 호출
var classId = getParameter("class_id");

// 페이지 진입 data
const loadData = {
    org_id: orgId,
    user_id: userId,
    class_id:classId
};

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

//페이지 진입했을 때 API 호출
function onLoadData() {
    API.tutor.tdetail({data: loadData}, function(result) {
        resultList = result.result;

        console.log("tdetail API 호출     ",resultList)

        userList = resultList.user_list;
        userList.sort(function(a, b) {return a.user_id.localeCompare(b.user_id, undefined, {numeric: true,sensitivity: 'base'});});

        classification();

        let class_test_level
        if(resultList.class_test_level!=undefined &&resultList.class_test_level.match(testLevelPattern)){
            console.log(resultList.class_test_level)
            resultList.class_test_level = resultList.class_test_level.replace("E","초").replace("M","중").replace("H","고");

            class_test_level = resultList.class_test_level.split('');
            class_test_level = class_test_level[0]+class_test_level[1]+"-"+class_test_level[2];
        }

        //classID
        document.getElementById("class_nm").innerText = resultList.class_id;

        //클래스 구분
        document.getElementById("class_gbn").innerText = resultList.class_gbn;

        //클래스 인원수
        document.getElementById("class_count").innerText = resultList.class_count;

        //테스트 학년
        if(class_test_level!=undefined) document.getElementById("class_test_level").innerText = class_test_level;
        else document.getElementById("class-test-level").innerText = resultList.class_gbn;

        //테스트 완료율
        document.getElementById("com_rate").innerText = resultList.test_rate+"%";

        //테스트 미완료 학생 엑셀 다운로드
        let pro_excel = document.getElementById("pro_excel");
        pro_excel.setAttribute("id",userNm+"_"+resultList.class_nm);
        pro_excel.setAttribute("onclick","proClick(this.id)");

        //테스트 완료 학생 엑셀 다운로드
        let com_excel = document.getElementById("com_excel");
        com_excel.setAttribute("id",userNm+"_"+resultList.class_nm);
        com_excel.setAttribute("onclick","comClick(this.id)");
    })
}


window.onload = onLoadData;


//테스트 완료별 학생 분류
function classification(){
    console.log("--- classification ---")

    ck = 0;

    for(let i=0; i<userList.length; i++){
        if(userList[i].final_path_yn=="Y"){
            drowComTabel(userList[i]); //테스트 완료 학생 function 호출
            ck++;
        }else drowProTabel(userList[i]);
    }
}

//테스트 미완료 학생 테이블 그리기
function drowProTabel(pro_userList){
    console.log("--- drowProTabel("+pro_userList.user_id+") ---");

    let submit_answer;
    let qst_answer;
    let user_test_yn;
    let rate = 0;
    let not_rate = false;
    let pro_rate;
    let test_level = Number(pro_userList.user_test_level);

    submit_answer = Object.values(pro_userList.submit_answer);
    qst_answer = Object.values(pro_userList.qst_answer);
    user_test_yn = Object.values(pro_userList.user_test_yn);

    if(submit_answer[test_level-1]==null) not_rate = true;
    else {
        for(let i=0; i<qst_answer[test_level-1].length;i++){
            if(submit_answer[test_level-1][i]==null) not_rate++;
            else if(submit_answer[test_level-1][i]!="") rate++
        }

        pro_rate = Math.floor((rate/submit_answer[test_level-1].length)*100);
    }

    //proList.push({user_id : pro_userList.user_id, user_test_level : pro_userList.user_test_level.replace("0",""), pro_rate : pro_rate});

    let pro_tr = document.createElement("tr");


    //사용자ID 작성
    pro_tr.innerHTML = "<td style=\'width: 30%;\' id=\'"+pro_userList.user_id+"\'><a href='/aitutor/teacher/student/T_sdetail?user_id="+pro_userList.user_id+"&user_grd="+pro_userList.user_grd+"' >"+pro_userList.user_id+"</a></td>";

    //테스트 단계 작성
    pro_tr.innerHTML += "<td style=\'width: 40%;\'>"+pro_userList.user_test_level.replace("0","")+"단계</td>";

    if(not_rate){
        pro_tr.innerHTML += "<td style=\'width: 30%;\'>미진행</td>";
        proList.push({user_id : pro_userList.user_id, user_test_level : pro_userList.user_test_level.replace("0",""), pro_rate : Number(0), not_rate:not_rate,user_grd:pro_userList.user_grd});
    }else{
        if(pro_rate==100 && user_test_yn == "N"){
            pro_tr.innerHTML += "<td style=\'width: 30%;\' id=\'"+99+"\'>"+99+"%</td>";
            proList.push({user_id : pro_userList.user_id, user_test_level : pro_userList.user_test_level.replace("0",""), pro_rate : 99, not_rate:Number(0),user_grd:pro_userList.user_grd});
        }else{
            pro_tr.innerHTML += "<td style=\'width: 30%;\' id=\'"+pro_rate+"\'>"+pro_rate+"%</td>";
            proList.push({user_id : pro_userList.user_id, user_test_level : pro_userList.user_test_level.replace("0",""), pro_rate : pro_rate, not_rate:Number(0),user_grd:pro_userList.user_grd});
        }
    }

    test_progress.appendChild(pro_tr);

}

//테스트 완료 학생
function drowComTabel(com_userList){
    console.log("--- drowComTabel("+com_userList.user_id+") ---")

    let qst_answer;
    let submit_answer;
    let count = 0;
    let test = [];
    let score = 0;

    qst_answer = Object.values(com_userList.qst_answer);
    submit_answer = Object.values(com_userList.submit_answer);


    //단계별 점수 계산
    for(let i=0; i<qst_answer.length; i++){
        for(let j=0; j<qst_answer[i].length;j++){
            if(qst_answer[i][j]==submit_answer[i][j]) count++;
        }

        score = Math.floor((count/qst_answer[i].length)*100);
        test.push(score);
        count = 0;

    }

    comList.push({user_id : com_userList.user_id, score : test, user_state : com_userList.user_state,user_grd:com_userList.user_grd});

    //tabel 그리기
    let com_tr = document.createElement("tr");

    // com_tr.innerHTML = "<td style=\"width: 20%;\">"+com_userList.user_id+"</td>";
    com_tr.innerHTML = "<td style=\'width: 20%;\' id=\'"+com_userList.user_id+"\'><a href='/aitutor/teacher/student/T_sdetail?user_id="+com_userList.user_id+"&user_grd="+com_userList.user_grd+"' >"+com_userList.user_id+"</a></td>";

    if(test.length==1) com_tr.innerHTML += "<td style=\"width: 60%;\">1단계("+test+"점)";
    else if(test.length==2) com_tr.innerHTML += "<td style=\"width: 60%;\">1단계("+test[0]+"점) / 2단계("+test[1]+"점)";
    else if(test.length==3) com_tr.innerHTML += "<td style=\"width: 60%;\">1단계("+test[0]+"점) / 2단계("+test[1]+"점) / 3단계("+test[2]+"점)";

    if(orgId.includes("A")){
        if(com_userList.user_state==0) com_tr.innerHTML += "<td style=\"width: 20%;\"><span class=\"textcolor02\">휴원</span></td>";
        else if(com_userList.user_state==1) com_tr.innerHTML += "<td style=\"width: 20%;\"><span class=\"textcolor01\">재원</span></td>";
    }else{
        if(com_userList.user_state==0) com_tr.innerHTML += "<td style=\"width: 20%;\"><span class=\"textcolor02\">휴학</span></td>";
        else if(com_userList.user_state==1) com_tr.innerHTML += "<td style=\"width: 20%;\"><span class=\"textcolor01\">재학</span></td>";
    }

    test_complete.appendChild(com_tr);

}

const proValue = (target) => {
    // 선택한 option의 value 값
    console.log("--- proValue = (target) ---");

    if(target.value == "ASC_proId") proList.sort(function(a, b) {return a.user_id.localeCompare(b.user_id, undefined, {numeric: true,sensitivity: 'base'});});
    else if(target.value == "DESC_proId") proList.sort(function(a, b) {return b.user_id.localeCompare(a.user_id, undefined, {numeric: true,sensitivity: 'base'});});
    else if(target.value == "ASC_proLevel"){
        proList.sort(function(a, b) {return a.user_test_level < b.user_test_level ? -1 : a.user_test_level > b.user_test_level ? 1 : 0;});
        // proList.sort(function(a, b) {return a.user_id.localeCompare(b.user_id, undefined, {numeric: true,sensitivity: 'base'});});
    }
    else if(target.value == "DESC_proLevel"){
        proList.sort(function(a, b) {return a.user_test_level > b.user_test_level ? -1 : a.user_test_level > b.user_test_level ? 1 : 0;});
        // proList.sort(function(a, b) {return a.user_id.localeCompare(b.user_id, undefined, {numeric: true,sensitivity: 'base'});});
    }

    test_progress.innerHTML = "";
    for(let i=0; i<proList.length;i++){
        let pro_tr = document.createElement("tr");

        // pro_tr.innerHTML = "<td style=\'width: 30%;\'>"+proList[i].user_id+"</td>";
        pro_tr.innerHTML = "<td style=\'width: 30%;\'><a href='/aitutor/teacher/student/T_sdetail?user_id="+proList[i].user_id+"&user_grd="+proList[i].user_grd+"' >"+proList[i].user_id+"</a></td>";
        pro_tr.innerHTML += "<td style=\'width: 40%;\'>"+proList[i].user_test_level+"단계</td>";
        //pro_tr.innerHTML += "<td style=\'width: 30%;\'>"+proList[i].pro_rate+"%</td>";

        if(proList[i].pro_rate==0 && proList[i].not_rate==true) pro_tr.innerHTML += "<td style=\'width: 30%;\'>미진행</td>";
        else pro_tr.innerHTML += "<td style=\'width: 30%;\'>"+proList[i].pro_rate+"%</td>";

        test_progress.appendChild(pro_tr);
    }
}

const comValue = (target) => {
    // 선택한 option의 value 값
    console.log("--- comValue = (target) ---");

    console.log(comList)

    if(target.value == "ASC_comId") comList.sort(function(a, b) {return a.user_id.localeCompare(b.user_id, undefined, {numeric: true,sensitivity: 'base'});});
    else if(target.value == "DESC_comId") comList.sort(function(a, b) {return b.user_id.localeCompare(a.user_id, undefined, {numeric: true,sensitivity: 'base'});});

    test_complete.innerHTML = "";
    for(let i=0; i<comList.length;i++){
        let com_tr = document.createElement("tr");

        // com_tr.innerHTML = "<td style=\'width: 20%;\'>"+comList[i].user_id+"</td>";
        com_tr.innerHTML = "<td style=\'width: 20%;\'><a href='/aitutor/teacher/student/T_sdetail?user_id="+comList[i].user_id+"&user_grd="+comList[i].user_grd+"' >"+comList[i].user_id+"</a></td>";

        if(comList[i].score.length==1) com_tr.innerHTML += "<td style=\'width: 60%;\'>1단계("+comList[i].score[0]+"점)</td>";
        else if(comList[i].score.length==2)  com_tr.innerHTML += "<td style=\'width: 60%;\'>1단계("+comList[i].score[0]+"점) / 2단계("+comList[i].score[1]+"점)</td>";
        else if(comList[i].score.length==3) com_tr.innerHTML += "<td style=\'width: 60%;\'>1단계("+comList[i].score[0]+"점) / 2단계("+comList[i].score[1]+"점) / 3단계("+comList[i].score[2]+"점)</td>";

        if(comList[i].user_state==0) com_tr.innerHTML += "<td style=\"width: 20%;\"><span class=\"textcolor02\">휴원</span></td>";
        else if(comList[i].user_state==1) com_tr.innerHTML += "<td style=\"width: 20%;\"><span class=\"textcolor01\">재원</span></td>";

        test_complete.appendChild(com_tr);
    }
}

