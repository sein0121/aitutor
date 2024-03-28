var orgId = getCookie('orgId');
var orgNm = getCookie('orgNm');
var userId = getCookie('userId');
var userNm = getCookie('userNm');
var userType = getCookie('userType');
var pageType = getCookie('pageType');
var searchType = getCookie('searchType');

function getCookie(name) {
    var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value ? unescape(value[2]) : null;
}

//[CL-01] 클래스 목록 페이지 진입 data
const loadData = {
    org_id: orgId,
    user_id: userId
};

// 클래스 선언
const nowClassId = document.getElementById("now-class");
const classContent = document.getElementById("class-content");
const classSort = document.getElementById("class-sort");
const classSearch = document.getElementById("class-search");
const selectGrade = document.getElementById("class-grade");
// 학생 선언
const nowStudentId = document.getElementById("now-student");
const studentContent = document.getElementById("student-content");
const studentSort = document.getElementById("student-sort");
const studentSearch = document.getElementById("student-search");
const studentGrade = document.getElementById("stud-grade");
const studentClass = document.getElementById("stud-class");
const target = document.getElementById("file");
document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('main').className += 'loaded';
});

// 엑셀 다운로드 (계정 정보)
document.getElementById("download_excel").onclick = function() {
    let id = idList();
    let pass = passList();
    accClick(id, pass, userNm, studentGrade.options[studentGrade.selectedIndex].value, studentClass.options[studentClass.selectedIndex].value);
}

// 엑셀 양식 다운로드
document.getElementById("form-download").onclick = function() {
    document.location.href = '/excel/학생_목록_업로드_양식.xlsx';
}

// 클래스 전체 선택 클릭
document.getElementById("checkAll").onclick = function () {
    deleteList = [];
    let row = document.getElementById("class-body").getElementsByTagName("tr");
    // 전체 선택
    if(document.getElementById("checkAll").checked === true) {
        // rows 만큼 loop 돌면서 컬럼값 접근
        for(let r=0; r<row.length; r++) {
            let classId = row[r].getAttribute('tr_value');
            document.getElementById(classId).checked = true;
            deleteList.push(classId);
        }
        // 전체 선택 중 일부 선택
        for(let r=0; r<row.length; r++) {
            let classId = row[r].getAttribute('tr_value');
            document.getElementById(classId).onclick = function () {
                document.getElementById("checkAll").checked = false;
                document.getElementById("checksAll").checked = false;
            }
        }
    }
    // 전체 선택 해제
    if(document.getElementById("checkAll").checked === false) {
        for(let r=0; r<row.length; r++) {
            let noneId = row[r].getAttribute('tr_value');
            document.getElementById(noneId).checked = false;
        }
        deleteList = [];
    }
}

// 학생 전체 선택 클릭
document.getElementById("checksAll").onclick = function () {
    deleteList = [];
    let rows = document.getElementById("student-body").getElementsByTagName("tr");
    // 전체 선택
    if(document.getElementById("checksAll").checked === true) {
        // rows 만큼 loop 돌면서 컬럼값 접근
        for(let rs=0; rs<rows.length; rs++) {
            let studentId = rows[rs].getAttribute('tr_value');
            document.getElementById(studentId).checked = true;
            deleteList.push(studentId);
        }
        // 전체 선택 중 일부 선택
        for(let rs=0; rs<rows.length; rs++) {
            let studentId = rows[rs].getAttribute('tr_value');
            document.getElementById(studentId).onclick = function () {
                document.getElementById("checksAll").checked = false;
                document.getElementById("checksAll").checked = false;
            }
        }
    }
    // 전체 선택 해제
    if(document.getElementById("checksAll").checked === false) {
        for(let rs=0; rs<rows.length; rs++) {
            let noneIds = rows[rs].getAttribute('tr_value');
            document.getElementById(noneIds).checked = false;
        }
        deleteList = [];
    }
}

// 유저 모달 활성화/비활성화
document.getElementById("user_open_btn").onclick = function() {
    const user = document.getElementById("user_modal");
    if(user.style.display === "none" || user.style.display === "") {
        user.style.display = "block";
    } else {
        user.style.display = "none";
    }
}

// 클래스 검색 선택
document.getElementById("class-refresh").onclick = function() {
    // 검색 기준
    let searchTypes = classSearch.options[classSearch.selectedIndex].value;
    // 검색어
    let searchValues = document.getElementById("class-searching").value;
    // 쿠키 셋팅
    // document.cookie = 'searchType=' + searchTypes + '_' + searchValues + ';path=/';
    document.cookie = 'searchType=' + escape(searchTypes) + '_' + escape(searchValues) + ';path=/';
    searchClass(searchTypes, searchValues);
}

// 클래스 검색 엔터
function enterClass() {
    if(window.event.keyCode === 13) {
        // 검색 기준
        let searchTypes = classSearch.options[classSearch.selectedIndex].value;
        // 검색어
        let searchValues = document.getElementById("class-searching").value;
        // 쿠키 셋팅
        // document.cookie = 'searchType=' + searchTypes + '_' + searchValues + ';path=/';
        document.cookie = 'searchType=' + escape(searchTypes) + '_' + escape(searchValues) + ';path=/';
        searchClass(searchTypes, searchValues);
    }
}

// 학생 검색 선택
document.getElementById("student-refresh").onclick = function() {
    // 검색 기준
    let searchTypes = studentSearch.options[studentSearch.selectedIndex].value;
    // 검색어
    let searchValues = document.getElementById("student-searching").value;
    // 쿠키 셋팅
    // document.cookie = 'searchType=' + searchTypes + '_' + searchValues + ';path=/';
    document.cookie = 'searchType=' + escape(searchTypes) + '_' + escape(searchValues) + ';path=/';
    searchStudent(searchTypes, searchValues);
}

// 학생 검색 엔터
function enterStudent() {
    if(window.event.keyCode === 13) {
        // 검색 기준
        let searchTypes = studentSearch.options[studentSearch.selectedIndex].value;
        // 검색어
        let searchValues = document.getElementById("student-searching").value;
        // 쿠키 셋팅
        // document.cookie = 'searchType=' + searchTypes + '_' + searchValues + ';path=/';
        document.cookie = 'searchType=' + escape(searchTypes) + '_' + escape(searchValues) + ';path=/';
        searchStudent(searchTypes, searchValues);
    }
}

// 클래스 등록 X 버튼
document.getElementById("modal_close_btn").onclick = function() {
    document.getElementById("modal_new").style.display="none";
    document.getElementById("modal_bg").style.display="none";
}

// 클래스 등록 취소 버튼
document.getElementById("modal_cancel_btn").onclick = function() {
    document.getElementById("modal_new").style.display="none";
    document.getElementById("modal_bg").style.display="none";
}

// 클래스 (X)삭제 버튼
document.getElementById("btn_delete").onclick = function() {
    if(document.getElementById("checkAll").checked === true) {
        deleteValue = deleteList;
    } else {
        let row = document.getElementById("class-body").getElementsByTagName("tr");

        // rows 만큼 loop 돌면서 컬럼값 접근
        for(let r=0; r<row.length; r++) {
            let classId = row[r].getAttribute('tr_value');

            if(document.getElementById(classId).checked === true) {
                deleteValue.push(classId);
            }
        }
    }

    if(deleteValue.length !== 0){
        del(deleteValue);
    }
}

// 학생 (X)삭제 버튼
document.getElementById("btn_selstud").onclick = function() {
    if(document.getElementById("checksAll").checked === true) {
        deleteValue = deleteList;
    } else {
        let rows = document.getElementById("student-body").getElementsByTagName("tr");

        // rows 만큼 loop 돌면서 컬럼값 접근
        for(let rs=0; rs<rows.length; rs++) {
            let studentId = rows[rs].getAttribute('tr_value');

            if(document.getElementById(studentId).checked === true) {
                deleteValue.push(studentId);
            }
        }
    }

    if(deleteValue.length !== 0){
        delStudent(deleteValue);
    }
}

// 클래스 삭제 X 버튼
document.getElementById("modal_close_btn2").onclick = function() {
    document.getElementById("modal_delete").style.display="none";
    document.getElementById("modal_bg").style.display="none";
}

// 클래스 삭제 취소 버튼
document.getElementById("modal_cancel_btn2").onclick = function() {
    document.getElementById("modal_delete").style.display="none";
    document.getElementById("modal_bg").style.display="none";
}

// 학생 삭제 X 버튼
document.getElementById("modal_close_btns2").onclick = function() {
    document.getElementById("modal_delete_stud").style.display="none";
    document.getElementById("modal_bg").style.display="none";
}

// 학생 삭제 취소 버튼
document.getElementById("modal_cancel_btns2").onclick = function() {
    document.getElementById("modal_delete_stud").style.display="none";
    document.getElementById("modal_bg").style.display="none";
}

// 학생 개별 등록 버튼
document.getElementById("btn_newstud").onclick = function() {
    document.getElementById("modal_new_stud").style.display = "block";
    document.getElementById("modal_bg").style.display = "block";
    document.getElementById("register_submit").style.pointerEvents = "none";
    document.getElementById("register_submit").style.backgroundColor = "#9EA4B2";

    document.getElementById('each').style.display = "";
    document.getElementById('id-auto').style.display = '';
    document.getElementById('excel-upload').style.display = 'none';
    radioSelf();

    // 클래스 정보 렌더링
    classRender();
}

// 학생 일괄 등록 버튼
document.getElementById('btn_batchstud').onclick = function() {
    document.getElementById("modal_new_stud").style.display = "block";
    document.getElementById("modal_bg").style.display = "block";
    document.getElementById("register_submit").style.pointerEvents = "none";
    document.getElementById("register_submit").style.backgroundColor = "#9EA4B2";

    document.getElementById('each').style.display = "none";
    document.getElementById('id-auto').style.display = 'none';
    document.getElementById('excel-upload').style.display = '';

    // 엑셀 파일명 렌더링
    target.addEventListener('click', function () {
        target.value = "";
        target.addEventListener('change', function () {
            if(target.value.length !== 0) {
                let value = target.value.split(".");
                if(value[1] !== "xlsx") {
                    document.getElementById("modal").style.display = "block";
                    document.getElementById('error_title').innerText = '파일 업로드 불가';
                    document.getElementById('error_content').innerText = '확장자가 ".xlsx"인 파일만 등록이 가능합니다.';
                } else {
                    document.getElementById('originName').innerText = target.files[0].name;
                    // 테이블 내용 초기화
                    registerTable();
                    // 확인 비활성화
                    document.getElementById("register_submit").style.pointerEvents = "none";
                    document.getElementById("register_submit").style.backgroundColor = "#9EA4B2";
                    // 엑셀 읽어오기
                    let excelData = readExcel();
                }
            } else {
                document.getElementById('originName').innerText = "파일을 선택해주세요";
            }
        });
    });
    // 클래스 정보 렌더링
    classRender();
}

// 학생 동륵 X 버튼
document.getElementById("modal_close_btn3").onclick = function() {
    resetStudent();
}

// 학생 등록 취소 버튼
document.getElementById("modal_close_btn4").onclick = function() {
    resetStudent();
}

// 오류 X 버튼
document.getElementById("error_close_btn").onclick = function() {
    document.getElementById("modal").style.display="none";
    document.getElementById("register_submit").style.pointerEvents = "none";
    document.getElementById("register_submit").style.backgroundColor = "#9EA4B2";
    if(document.getElementById("modal_delete").style.display === "block") {
        document.getElementById("modal_bg").style.display="none";
        document.getElementById("modal_delete").style.display="none";
    }
}

// 오류 확인 버튼
document.getElementById("error_ok_btn").onclick = function() {
    document.getElementById("modal").style.display="none";
    document.getElementById("register_submit").style.pointerEvents = "none";
    document.getElementById("register_submit").style.backgroundColor = "#9EA4B2";
    if(document.getElementById("modal_delete").style.display === "block") {
        document.getElementById("modal_bg").style.display="none";
        document.getElementById("modal_delete").style.display="none";
    }
}

// 학생 등록 - radio(직접 입력)
document.getElementById("self").onclick = function() {
    radioSelf();
    registerTable();
}

// 학생 등록 - radio(자동)
document.getElementById("auto").onclick = function() {
    document.getElementById("auto").checked = true;
    document.getElementById("self").checked = false;
    document.getElementById("spin").style.pointerEvents = "all";
    document.getElementById("id-count").style.backgroundColor = "#ffffff";
    document.getElementById("id-count").style.color = "#000000";
    document.getElementById("id-count").value = "1";
    document.getElementById("id-count").style.pointerEvents = "all";
    document.getElementById("id-auto").className = "btn_purple";
    document.getElementById("id-auto").style.pointerEvents = "all";
    document.getElementById("register_submit").style.pointerEvents = "none";
    document.getElementById("register_submit").style.backgroundColor = "#9EA4B2";

    init = 0;

    registerTable("none");
}

// 클래스 정보(학년) 선택 시 클래스 정보(클래스) 렌더링
document.querySelector('#stud-class').addEventListener('change', () => {
    // 계정 정보 테이블 렌더링
    registerTable();
    // 엑셀 파일명 초기화
    document.getElementById('originName').innerText = "파일을 선택해주세요";
});

// 비밀번호 자동 생성 클릭
document.getElementById("pass-auto").onclick = function () {
    console.log("비밀번호 자동 생성");
    let iLists = [];
    iLists = new Array();
    iLists = idList();

    let firstId = document.getElementById("regId1");

    // 아이디가 하나도 없는 경우
    if(iLists === 0) {
        // document.getElementById("modal_id").style.display="block";
        firstId.style.backgroundColor ="#fff0f0";
        firstId.style.borderColor ="#ffbdbd";
        firstId.style.color = "#d90000";
        firstId.style.fontWeight = "lighter";
        firstId.value = '아이디를 입력해주세요';

        firstId.addEventListener("click", function() {
            firstId.style.backgroundColor ="#ffffff";
            firstId.style.borderColor ="#cccccc";
            firstId.style.color = "#000000";
            firstId.style.fontWeight = "300";
            firstId.value = "";
        });
    } else {
        for(let p=0; p<iLists.length; p++) {
            let id = p + 1;
            let index = iLists[p].index;
            let pass = resetPassword(id);

            if(document.getElementById("regId1").value === '아이디를 입력해주세요') {
                pass = '';
            }
            let reg = "input" + index;
            document.getElementById(reg).style.backgroundColor = "#ffffff";
            document.getElementById(reg).style.borderColor ="#cccccc";
        }
        document.getElementById("input1").style.backgroundColor = "#ffffff";
        document.getElementById("input1").style.borderColor ="#cccccc";
    }
}

// 클래스 정보(클래스) 렌더링
function gradeInfo(list, selected) {
    let gradeList = [];
    // 클래스 정보(학년)과 일치하는 데이터 추출
    for(let g=0; g<list.length; g++) {
        if(list[g].class_gbn === selected) {
            gradeList.push(list[g].class_id);
        }
    }
    // 클래스 정보(클래스) 셀렉트박스 렌더링
    for(let sc=0; sc<gradeList.length; sc++) {
        // option 값 정의
        let scValue = gradeList[sc];
        // option 정의
        let scOption = document.createElement('option');
        scOption.value = scValue;
        scOption.text = scValue;
        // select 태그에 scValue 넣기
        document.getElementById('stud-class').add(scOption);
    }
    // 계정 정보 테이블 렌더링
    registerTable();
}

// 계정 정보 테이블 렌더링
function registerTable() {
    let table = document.getElementById('register-table').querySelector('tbody');
    let html = '';
    for(let index = 1; index < 51; index++) {
        html += '<tr><td style="width: 100px;">' + index + '</td>' +
            // '<td><input type="text" style="width: 100%; pointer-events: ' + type + '" name="regId" id="regId' + index + '"></td>' +
            '<td id="regId"><input type="text" style="width: 100%;" name="regId' + index + '" class="regId" id="regId' + index + '" onkeyup="check(this)" onkeydown="check(this)"></td>' +
            '<td><input type="text" style="width: 100%;" name="regPass" class="regPass" id="input' + index + '"></td>';
    }
    table.innerHTML = html;
}

// 학생 등록 정보 리셋
function resetStudent() {
    document.getElementById('register-body').scrollTo(0,0);
    document.getElementById("modal_new_stud").style.display="none";
    document.getElementById("modal_bg").style.display="none";

    for(let i=studentGrade.options.length; i>=0; i--) {
        studentGrade.options[i] = null;
    }
    for(let i=studentClass.options.length; i>=0; i--) {
        studentClass.options[i] = null;
    }
    target.value = "";
    document.getElementById('originName').innerText = "파일을 선택해주세요";
}

function radioSelf() {
    document.getElementById("self").checked = true;
    document.getElementById("auto").checked = false;
    document.getElementById("spin").style.pointerEvents = "none";
    document.getElementById("id-count").style.backgroundColor = "#ececec";
    document.getElementById("id-count").style.color = "#ececec";
    document.getElementById("id-count").value = "";
    document.getElementById("id-count").style.pointerEvents = "none";
    document.getElementById("id-auto").className = "btn_gray";
    document.getElementById("id-auto").style.pointerEvents = "none";
    document.getElementById("register_submit").style.pointerEvents = "none";
    document.getElementById("register_submit").style.backgroundColor = "#9EA4B2";
}

// 계정 정보 ID 목록
function idList() {
    let list = [];
    for(let id=1; id<51; id++) {
        let idValue = {};
        let regId = "regId" + id;
        let inputId = document.getElementById(regId);
        let value = inputId ? inputId.value : '';
        if(value !== '') {
            idValue.index = id;
            idValue.id = value;
            list.push(idValue);
        }
    }
    if(list.length === 0) {
        return 0;
    } else {
        return list;
    }
}

// 계정 정보 비밀번호 목록
function passList() {
    let list = [];
    for(let index=1; index<51; index++) {
        let passValue = {};
        let pass = "input" + index;
        let inputPass = document.getElementById(pass);
        let value = inputPass ? inputPass.value : '';
        if(value !== '') {
            passValue.index = index;
            passValue.pass = value;
            list.push(passValue);
        }
    }
    if(list.length === 0) {
        return 0;
    } else {
        return list;
    }
}

// 아이디 중복 검사
function duplicate(list) {
    let ids = new Array();
    let now = 0;

    for(let d=0; d<list.length; d++) {
        ids.push(list[d].id);
    }

    const findDuplicates = ids => ids.filter((item, index) => ids.indexOf(item) !== index)
    const duplicates = findDuplicates(ids);

    const result = {};
    duplicates.forEach((x) => {
        result[x] = (result[x] || 0)+1;
    });

    const count = Object.keys(result).length;
    const keys = Object.keys(result);
    const values = Object.values(result);

    for(let r=0; r<count; r++) {
        for(let l=list.length-1; l>=0; l--) {
            if(keys[r] === list[l].id) {
                if(now === values[r]) {
                    break;
                }
                let reg = "regId" + list[l].index;
                let regPass = "input" + list[l].index;

                document.getElementById(reg).style.backgroundColor = "#fff0f0";
                document.getElementById(reg).style.borderColor = "#ffbdbd";

                document.getElementById(reg).addEventListener("click", function () {
                    document.getElementById(reg).style.backgroundColor = "#ffffff";
                    document.getElementById(reg).style.borderColor = "#cccccc";
                    // document.getElementById(reg).value = "";
                    // document.getElementById(regPass).value = "";
                    now--;
                });
                now++
            }
        }
    }
    return now;
}

function overlap(data) {
    console.log(data);
    const count = data.length;
    // 아이디 중복 Modal
    document.getElementById("modal").style.display = "block";
    document.getElementById('error_title').innerText = '아이디 중복';
    document.getElementById('error_content').innerText = '사용 불가한 아이디가 ' + count + '건 있습니다.';

    // 아이디 중복 style 지정
    document.querySelectorAll(".regId").forEach(over => {
        console.log("중복", over.value);
        if(over.value !== ""){
            for(let d=0; d<data.length; d++){
                if(over.value === data[d]) {
                    over.style.backgroundColor = "#fff0f0";
                    over.style.borderColor = "#ffbdbd";
                }
            }
        }
        // 클릭 시 style reset
        over.addEventListener("click", function() {
            // let passId = over.id.replace('regId', 'input');
            over.style.backgroundColor = "#ffffff";
            over.style.borderColor = "#cccccc";
            // over.value = "";
            // document.getElementById(passId).value = "";
        });
    });
}

function searchCookies() {
    let cookies = searchType.split("_");
    let searchTypes =cookies[0];
    let searchValues = cookies[1];

    if(pageType === "class") {
        searchClass(searchTypes, searchValues);
    } else {
        searchStudent(searchTypes, searchValues);
    }
}

// 특수문자 입력 방지
function check(obj){
    // 특수문자 & 입력 제한
    var regExp = /[&]/gi;
    // 값 비교
    if( regExp.test(obj.value) ){
        // 입력 불가 모달
        document.getElementById("modal").style.display = "block";
        document.getElementById('error_title').innerText = '입력 불가';
        document.getElementById('error_content').innerText = '특수문자 \'&\'는  사용이 불가합니다. ';
        // 값이 일치하면 문자 삭제
        obj.value = obj.value.substring( 0 , obj.value.length - 1 ); // 입력한 특수문자 한자리 지움
    }
}

function loadingStart() {
    document.getElementById("modal").style.display = "block";
    document.getElementById("loader").style.display = "block";
    document.getElementById("error_close_btn").style.display = "none";
    document.getElementById("error_ok_btn").style.display = "none";
    document.getElementById("error_img").style.display = "none";
    document.getElementById("icon").style.marginTop = "150px";
}

function loadingEnd() {
    document.getElementById("modal").style.display = "none";
    document.getElementById("loader").style.display = "none";
    document.getElementById("error_close_btn").style.display = "block";
    document.getElementById("error_ok_btn").style.display = "";
    document.getElementById("error_img").style.display = "";
    document.getElementById("icon").style.marginTop = "";
}

// 배열 구하기
function objSort(obj, column) {
    // 내림차순 정렬
    if(column === 'created_date') {
        obj.sort(function(a, b){
            let cg1 = parseInt(a.created_date);
            let cg2 = parseInt(b.created_date);
            return cg2 - cg1;
        });
        // 오름차순 정렬
    } else if(column === 'class_gbn') {
        obj.sort(function(a, b){
            let cg1 = a.class_gbn.toUpperCase();
            let cg2 = b.class_gbn.toUpperCase();
            return cg1.localeCompare(cg2, undefined, {
                numeric: true,
                sensitivity: 'base',
            });
        });
    } else if(column === 'user_grd') {
        obj.sort(function(a, b){
            let cg1 = a.user_grd.toUpperCase();
            let cg2 = b.user_grd.toUpperCase();
            return cg1.localeCompare(cg2, undefined, {
                numeric: true,
                sensitivity: 'base',
            });
        });
    } else if(column === 'class_nm') {
        obj.sort(function(a, b){
            let cn1 = a.class_nm.toUpperCase();
            let cn2 = b.class_nm.toUpperCase();
            return cn1.localeCompare(cn2, undefined, {
                numeric: true,
                sensitivity: 'base',
            });
        });
    } else {
        obj.sort(function(a, b){
            let sr1 = a.student_id.toUpperCase();
            let sr2 = b.student_id.toUpperCase();
            return sr1.localeCompare(sr2, undefined, {
                numeric: true,
                sensitivity: 'base',
            });
        })
    }
    return obj;
}