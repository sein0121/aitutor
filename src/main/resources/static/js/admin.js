var orgId = getCookie('orgId');
var orgNm = getCookie('orgNm');
var userId = getCookie('userId');
var userType = getCookie('userType');

function getCookie(name) {
    var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value ? unescape(value[2]) : null;
}

// 페이지 진입 data
const loadData = {
    user_id: userId
};

// TAB 선언
const elementary = document.getElementById('now-elementary');
const middle = document.getElementById('now-middle');
const academy = document.getElementById('now-academy');

// 변수 선언
let organization = '';
let saveGroup = [];
let savePass = [];

// 페이지 로딩 시 API 호출
function windowOnLoad() {
    // [API-01] 관리자(애자일소다) 계정관리 페이지 데이터 조회 API
    API.agilesoda.list({data: loadData}, function(result) {
        console.log('AD-02 CALLED   ', result);

        // API 결과
        const result1 = result.result;
        const oList = result1.org_list;

        // 화면 렌더링
        branch(oList);
    });
}

window.onload = windowOnLoad;

function branch(list) {
    const elementaryList = [];
    const middleList = [];
    const academyList = [];

    // org_id에 따라 분류
    for(let l=0; l<list.length; l++) {
        // 초등학교
        if(list[l].org_id.charAt(0) === 'E') {
            elementaryList.push(list[l]);
        // 중학교    
        } else if(list[l].org_id.charAt(0) === 'M') {
            middleList.push(list[l]);
        // 학원
        } else {
            academyList.push(list[l]);
        }
    }

    render(elementaryList);

    // 초등학교 탭 클릭
    elementary.onclick = function () {
        clickStudent();
        render(elementaryList);
    }

    // 중학교 탭 클릭
    middle.onclick = function () {
        clickMiddle();
        render(middleList);
    }

    // 학원 탭 클릭
    academy.onclick = function () {
        clickAcademy();
        render(academyList);
    }
}

function render(list) {
    const groupList = [];

    for(let g=0; g<list.length; g++) {
        let group = {groupID: list[g].org_id, groupName: list[g].org_nm};
        groupList.push(group);
    }

    renderGroup(groupList);

    renderUser(list[0]);

    document.querySelectorAll('#group').forEach(group => {
        group.addEventListener('click', e => {
            const index = e.target.getAttribute('index');
            renderUser(list[index]);
        })
    });
}



function renderGroup(list) {
    saveGroup = new Array();

    // 테이블 column 수
    const pageCount = 15;
    // 페이지네이션 block 안에 담겨질 양
    const blockCount = 10;
    // 총 페이지 수
    let totalPage = Math.ceil(list.length / pageCount);
    // 총 페이지네이션 block 수
    let totalBlock = Math.ceil(totalPage / blockCount);

    let pagination = '';
    let table = '';

    pagination = document.getElementById('group-pagination');
    table = document.getElementById('org-table').querySelector('tbody');

    let renderTableAndPagination = function(page = 1) {
        groupTable(page);
        groupPagination(page);
    }

    // 클래스 테이블 렌더링
    let groupTable = function(page) {
        let startNum = (pageCount * (page - 1));
        let endNum = ((pageCount * page) >= list.length ? list.length : (pageCount * page));
        let html = '';
        if(list.length === 0) {
            html = '<tr><td colspan="2">데이터가 존재하지 않습니다</td> </tr>';
        } else {
            for(let index = startNum; index < endNum; index++) {
                let name = '';
                if(list[index].groupName !== null) {
                    name = list[index].groupName;
                }
                html += '<tr><td id="group" index="' + index  +'">' + list[index].groupID + '</td>' +
                    '<td><input id="' + list[index].groupID + '" type="text" style="width:100%;" value="' + name + '" onchange="changed(this)"</td></tr>';
            }
        }
        table.innerHTML = html;
    }

    // 페이지네이션 렌더링
    let groupPagination = function(page) {
        let block = Math.floor((page-1) / blockCount) + 1;
        let startPage = ((block-1) * blockCount) + 1;
        let endPage = ((startPage + blockCount - 1) > totalPage) ? totalPage : (startPage + blockCount -1);
        let paginationHTML = '';

        // 이전 페이지 출력
        if (block !== 1){
            // 라엘 css 수정 문의 필요 -----------------------------
            paginationHTML += "<li id='back_page' style='margin-right:20px'><span class='prev'></span></li>";
            // --------------------------------------------------
        }
        // 페이지 목록 출력
        for(let index = startPage; index <= endPage; index++) {
            paginationHTML += (parseInt(page) === index) ?
                "<li class='current'>" + index + "</li>" :
                "<li id='go_page' data-value='" + index + "'>" + index + "</li>";
        }
        // 다음 페이지 출력
        if(block < totalBlock) {
            // 라엘 css 수정 문의 필요 -----------------------------
            paginationHTML += "<li id='next_page' style='margin-left:20px'><span class='next'></span></li>";
            // --------------------------------------------------
        }
        // 페이지네이션 선언
        pagination.innerHTML = paginationHTML;
        addEventPagination(startPage, endPage);
    }

    let addEventPagination = function(startPage, endPage) {
        // 이전 페이지 버튼 클릭
        if(!!document.querySelector('#back_page')) {
            document.querySelector('#back_page').addEventListener('click', () => {
                renderTableAndPagination(startPage - 1);
            });
        }
        // 페이지 클릭
        document.querySelectorAll('#go_page').forEach(goPage => {
            goPage.addEventListener('click', e => {
                renderTableAndPagination(e.target.getAttribute('data-value'));
            });
            // goPage.addEventListener("click", updateValue);
        });
        // 다음 페이지 버튼 클릭
        if(!!document.querySelector('#next_page')) {
            document.querySelector('#next_page').addEventListener('click', () => {
                renderTableAndPagination(endPage + 1);
            });
        }
    }

    renderTableAndPagination();
}

function renderUser(list) {
    organization = list.org_id;
    // 기관 이름 렌더링
    document.getElementById("org-title").innerText = list.org_nm;
    // user List
    const userList = objSort(list.user_list);

    // 테이블 column 수
    const pageCount = 15;
    // 페이지네이션 block 안에 담겨질 양
    const blockCount = 10;
    // 총 페이지 수
    let totalPage = Math.ceil(userList.length / pageCount);
    // 총 페이지네이션 block 수
    let totalBlock = Math.ceil(totalPage / blockCount);

    let pagination = '';
    let table = '';

    pagination = document.getElementById('pagination');
    table = document.getElementById('user-table').querySelector('tbody');

    let renderTableAndPagination = function(page = 1) {
        userTable(page);
        userPagination(page);
    }

    // 유저 테이블 렌더링
    let userTable = function(page) {
        let startNum = (pageCount * (page - 1));
        let endNum = ((pageCount * page) >= userList.length ? userList.length : (pageCount * page));
        let html = '';
        if(userList.length === 0) {
            html = '<tr><td colspan="4">데이터가 존재하지 않습니다</td> </tr>';
        } else {
            for(let index = startNum; index < endNum; index++) {
                let type = '';
                let name = userList[index].user_nm;
                if(userList[index].user_type === '00') {
                    type = '애자일소다';
                } else if(userList[index].user_type === '10') {
                    type = '관리자';
                } else {
                    type = '선생님';
                }
                if(name === null) {
                    name = "(미등록)";
                }

                html += '<tr><td id="id' + index + '">' + userList[index].user_id + '</td>' +
                    '<td><input type="text" id="input' + index + '" value="" style="width: 150px; pointer-events: none;">' +
                    '<button type="button" class="btn_gray" onclick="resetPassword(\'' + index + '\'), changedPass(\'' + index + '\')">리셋</button></td>' +
                    '<td>' + type + '</td>' +
                    '<td>' + name + '</td></tr>';
            }
        }
        table.innerHTML = html;
    }

    // 페이지네이션 렌더링
    let userPagination = function(page) {
        let block = Math.floor((page-1) / blockCount) + 1;
        let startPage = ((block-1) * blockCount) + 1;
        let endPage = ((startPage + blockCount - 1) > totalPage) ? totalPage : (startPage + blockCount -1);
        let paginationHTML = '';

        // 이전 페이지 출력
        if (block !== 1){
            // 라엘 css 수정 문의 필요 -----------------------------
            paginationHTML += "<li id='backPage' style='margin-right:20px'><span class='prev'></span></li>";
            // --------------------------------------------------
        }
        // 페이지 목록 출력
        for(let index = startPage; index <= endPage; index++) {
            paginationHTML += (parseInt(page) === index) ?
                "<li class='current'>" + index + "</li>" :
                "<li id='goPage' dataValue='" + index + "'>" + index + "</li>";
        }
        // 다음 페이지 출력
        if(block < totalBlock) {
            // 라엘 css 수정 문의 필요 -----------------------------
            paginationHTML += "<li id='nextPage' style='margin-left:20px'><span class='next'></span></li>";
            // --------------------------------------------------
        }
        // 페이지네이션 선언
        pagination.innerHTML = paginationHTML;
        addEventPagination(startPage, endPage);
    }

    let addEventPagination = function(startPage, endPage) {
        // 이전 페이지 버튼 클릭
        if(!!document.querySelector('#backPage')) {
            document.querySelector('#backPage').addEventListener('click', () => {
                renderTableAndPagination(startPage - 1);
            });
        }
        // 페이지 클릭
        document.querySelectorAll('#goPage').forEach(goPage => {
            goPage.addEventListener('click', e => {
                renderTableAndPagination(e.target.getAttribute('dataValue'));
            });
            // goPage.addEventListener("click", updateValue);
        });
        // 다음 페이지 버튼 클릭
        if(!!document.querySelector('#nextPage')) {
            document.querySelector('#nextPage').addEventListener('click', () => {
                renderTableAndPagination(endPage + 1);
            });
        }
    }

    renderTableAndPagination();
}


function clickStudent() {
    middle.classList.remove("current");
    academy.classList.remove("current");
    elementary.classList.add("current");
}

function clickMiddle() {
    elementary.classList.remove("current");
    academy.classList.remove("current");
    middle.classList.add("current");
}

function clickAcademy() {
    elementary.classList.remove("current");
    middle.classList.remove("current");
    academy.classList.add("current");
}

function changed(obj) {
    obj.style.backgroundColor = '#e4e4fe';

    saveGroup.push({orgId: obj.id, orgName: obj.value});
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

// [그룹] 저장 클릭
document.getElementById("group-save").onclick = function() {
    let modifyList = [];
    for(let s=0; s<saveGroup.length; s++) {
        modifyList.push({org_id: saveGroup[s].orgId, org_nm: saveGroup[s].orgName});
    }

    const nameData = {
        user_id: userId,
        modify_list: modifyList
    }

    if(modifyList.length !== 0) {
        // [AD-03] 관리자(애자일소다) 기관 명 업데이트 API
        API.agilesoda.update({data: nameData}, function(result) {
            console.log('AD-03 CALLED   ', result);

            if(result.rsp_code === 200) {
                for(let s=0; s<saveGroup.length; s++) {
                    let orgId = saveGroup[s].orgId
                    document.getElementById(orgId).style.backgroundColor = '#ffffff';
                }

                saveGroup = new Array();
            }
        });
    }
}

function changedPass(index) {
    let id = "id" + index;
    let pass = "input" + index;

    let userId = document.getElementById(id).innerText;
    let userPass = document.getElementById(pass).value;

    savePass.push({user_id: userId, user_pw: userPass});
}

// [기관] 저장 클릭
document.getElementById("pass-save").onclick = function() {
    let saveList = [];
    for(let s=0; s<savePass.length; s++) {
        saveList.push({teacher_id: savePass[s].user_id, teacher_new_pw: savePass[s].user_pw});
    }

    const saveData = {
        org_id: organization,
        user_id: userId,
        teacher_list: saveList
    }

    if(saveList.length !== 0) {
        // [AD-04] 관리자(애자일소다) 비밀번호 저장 API
        API.admin.changePass({data: saveData}, function(result) {
            console.log('AD-04 CALLED   ', result);

            if(result.rsp_code === 200) {
                savePass = new Array();
            }
        });
    }
}

// 배열 구하기
function objSort(obj) {
    // 오름차순 정렬
    obj.sort(function(a, b){
        let s1 = a.user_id.toUpperCase();
        let s2 = b.user_id.toUpperCase();
        return s1.localeCompare(s2, undefined, {
            numeric: true,
            sensitivity: 'base',
        });
    });

    return obj;
}



