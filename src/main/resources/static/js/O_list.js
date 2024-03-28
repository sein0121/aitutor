// 페이지 로딩 시 API 호출
function windowOnLoad() {
    if(pageType === "class") {
        if(searchType !== "") {
            searchCookies();
        } else {
            // [AD-CL-01] 관리자 클래스 목록 페이지 진입 API
            API.admin.classList({data: loadData}, function(result) {
                console.log('AD-CL-01 CALLED   ', result);

                // API 결과
                const rList = result.result;
                const cList = rList.class_list;

                classList(cList);
            });
        }
    } else {
        // 탭 색상 변경
        nowClassId.classList.remove("current");
        nowStudentId.classList.add("current");
        // 컨텐츠 렌더링 변경
        classContent.style.display = "none";
        studentContent.style.display = "block";

        if(searchType !== "") {
            searchCookies();
        } else {
            // [AD-ST-01] 관리자 학생 목록 페이지 진입 API
            API.admin.studentList({data: loadData}, function(result) {
                console.log('AD-ST-01 CALLED   ', result);
                // API 결과
                const rsList = result.result;
                const sList = rsList.student_list;

                studentRender(sList);
            });
        }
    }
}

window.onload = windowOnLoad;

let deleteList = [];
let deleteValue = [];
let classId = '';
let init = 0;

// 클래스 목록 렌더링
function classList(cList) {
    const type = "class";
    const classList = cList;
    let sortList = [];
    deleteList = [];
    deleteValue = [];

    // 테이블 + 페이지네이션 렌더링
    render(classList, type);

    // 검색 셀렉트박스 선택
    document.querySelector('#class-sort').addEventListener('change', (e) => {
        // 정렬 기준
        let sortValue = classSort.options[classSort.selectedIndex].value;
        // 정렬 함수 실행
        sortList = objSort(classList, sortValue);
        // 정렬된 데이터로 테이블 + 페이지네이션 렌더링
        render(sortList, type);
    });

    // 학생 클릭
    nowStudentId.onclick = function() {
        // 쿠키 변경
        document.cookie = "pageType=student;path=/;";
        // 탭 색상 변경
        nowClassId.classList.remove("current");
        nowStudentId.classList.add("current");
        // 컨텐츠 렌더링 변경
        classContent.style.display = "none";
        studentContent.style.display = "block";
        // 검색값 초기화
        document.getElementById("class-searching").value = "";
        document.getElementById("class-search").options[0].selected = true;
        document.cookie = "searchType=;path=/;";

        // [AD-ST-01] 관리자 학생 목록 페이지 진입 API
        API.admin.studentList({data: loadData}, function(result) {
            console.log('AD-ST-01 CALLED   ', result);
            // API 결과
            const rsList = result.result;
            const sList = rsList.student_list;

            studentRender(sList);
        });
    }
}

// 학생 목록 렌더링
function studentRender(sList) {
    const type = "student";
    const studentList = sList;
    let sortLists = [];
    deleteList = [];
    deleteValue = [];

    // 테이블 + 페이지네이션 렌더링
    render(studentList, type);

    // 엑셀 다운로드
    document.getElementById("btn_excel").onclick = function() {
        btnClick(studentList, userNm);
    }

    // 검색 셀렉트박스 선택
    document.querySelector('#student-sort').addEventListener('change', (e) => {
        // 정렬 기준
        let sortValues = studentSort.options[studentSort.selectedIndex].value;
        // 정렬 함수 실행
        sortLists = objSort(studentList, sortValues);
        // 정렬된 데이터로 테이블 + 페이지네이션 렌더링
        render(sortLists, type);
    });

    // 클래스 클릭
    nowClassId.onclick = function() {
        // 쿠키 변경
        document.cookie = "pageType=class;path=/;";
        // 탭 색상 변경
        nowStudentId.classList.remove("current");
        nowClassId.classList.add("current");
        // 컨텐츠 렌더링 변경
        studentContent.style.display = "none";
        classContent.style.display = "block";
        // 검색값 초기화
        document.getElementById("student-searching").value = "";
        document.getElementById("student-search").options[0].selected = true;
        document.cookie = "searchType=;path=/;";

        // [AD-CL-01] 관리자 클래스 목록 페이지 진입 API
        API.admin.classList({data: loadData}, function(result) {
            console.log('AD-CL-01 CALLED   ', result);

            // API 결과
            const rcList = result.result;
            const ccList = rcList.class_list;

            classList(ccList);
        });
    }
}

// 페이지네이션
function render(list, type) {
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

    if(type === "class"){
        pagination = document.getElementById('class-pagination');
        table = document.getElementById('class-table').querySelector('tbody');
    } else {
        pagination = document.getElementById('student-pagination');
        table = document.getElementById('student-table').querySelector('tbody');
    }

    let renderTableAndPagination = function(page = 1) {
        renderTable(page);
        renderPagination(page);
    }

    // 테이블 렌더링
    let renderTable = function(page) {
        let startNum = (pageCount * (page - 1));
        let endNum = ((pageCount * page) >= list.length ? list.length : (pageCount * page));
        let html = '';
        if(list.length === 0) {
            html = '<tr><td colspan="8">데이터가 존재하지 않습니다</td> </tr>';
        } else {
            for(let index = startNum; index < endNum; index++) {
                if (type === "class") {
                    let name = list[index].user_nm;
                    if (list[index] === null) {
                        console.log("break");
                        break;
                    }
                    if(name === null) {
                        name = "(미등록)";
                    }
                    // 클래스 테이블 렌더링
                    html += '<tr id="ctr" tr_value="' + list[index].class_id + '"><td><input type="checkbox" id="' + list[index].class_id + '" name="' + list[index].class_id + '"></td>' +
                        '<td>' + list[index].class_gbn + '</td>' +
                        '<td><a href="/aitutor/admin/class/O_detail?class_id=' + list[index].class_nm + '&teacher_nm=' + name + '">' + list[index].class_id + '</a></td>' +
                        '<td>' + name + '</td>' +
                        '<td>' + list[index].class_count + '</td>' +
                        '<td>' + list[index].class_type + '</td>' +
                        '<td>' + list[index].test_rate + '%</td>' +
                        '<td class="btn" id="btn_del" del_value="' + list[index].class_id + '" onclick="del(\'' + list[index].class_id + '\')"><img src="/image/btn_delete.svg"></td>' +
                        '<td style="display:none">' + list[index].created_date + '</td></tr>';
                } else {
                    if (list[index] === null) {
                        break;
                    }
                    // 테스트 단계
                    let qstLevel = list[index].user_qst_level;
                    let userQstLevel = qstLevel.charAt(qstLevel.length - 1);
                    // 상태
                    let state = list[index].user_state;
                    let userState = '';
                    if (state === "1") {
                        // 기관 = 학원
                        if(orgId.charAt(0) === 'A') {
                            userState = '<span class="textcolor01">재원</span>';
                        // 기관 = 학교
                        } else {
                            userState = '<span class="textcolor01">재학</span>';
                        }
                    } else {
                        // 기관 = 학원
                        if(orgId.charAt(0) === 'A') {
                            userState = '<span class="textcolor02">휴원</span>';
                        // 기관 = 학교
                        } else {
                            userState = '<span class="textcolor02">휴학</span>';
                        }
                    }
                    // 학생 테이블 렌더링
                    html += '<tr id="str" tr_value="' + list[index].student_id + '"><td><input type="checkbox" id="' + list[index].student_id + '" name="' + list[index].student_id + '"></td>' +
                        '<td>' + list[index].user_grd + '</td>' +
                        '<td><a href="/aitutor/admin/student/O_sdetail?user_id=' + list[index].student_id + '&user_grd=' + list[index].user_grd + '">' + list[index].student_id + '</a></td>' +
                        '<td>' + list[index].class_nm + '</td>' +
                        '<td>' + userQstLevel + '단계</td>' +
                        '<td>' + list[index].test_rate + '%</td>' +
                        '<td>' + userState + '</td>' +
                        '<td class="btn" id="btn_del_stud" del_value="' + list[index].student_id + '" onclick="delStudent(\'' + list[index].student_id + '\')"><img src="/image/btn_delete.svg"></td>' +
                        '<td style="display:none">' + list[index].created_date + '</td></tr>';
                }
            }
        }
        table.innerHTML = html;
    }

    // 페이지네이션 렌더링
    let renderPagination = function(page) {
        let block = Math.floor((page-1) / blockCount) + 1;
        let startPage = ((block-1) * blockCount) + 1;
        let endPage = ((startPage + blockCount - 1) > totalPage) ? totalPage : (startPage + blockCount -1);
        let paginationHTML = '';

        // 이전 페이지 출력
        if (block !== 1){
            paginationHTML += "<li id='back_page' style='margin-right:20px; cursor:pointer;'><span class='prev'></span></li>";
        }
        // 페이지 목록 출력
        for(let index = startPage; index <= endPage; index++) {
            paginationHTML += (parseInt(page) === index) ?
                "<li class='current' style='cursor:pointer'>" + index + "</li>" :
                "<li id='go_page' style='cursor:pointer' data-value='" + index + "'>" + index + "</li>";
        }
        // 다음 페이지 출력
        if(block < totalBlock) {
            paginationHTML += "<li id='next_page' style='margin-left:20px; cursor:pointer;'><span class='next'></span></li>";
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
                document.getElementById("checkAll").checked = false;
                document.getElementById("checksAll").checked = false;
            });
        }
        // 페이지 클릭
        document.querySelectorAll('#go_page').forEach(goPage => {
            goPage.addEventListener('click', e => {
                renderTableAndPagination(e.target.getAttribute('data-value'));
                document.getElementById("checkAll").checked = false;
                document.getElementById("checksAll").checked = false;
            });
            // goPage.addEventListener("click", updateValue);
        });
        // 다음 페이지 버튼 클릭
        if(!!document.querySelector('#next_page')) {
            document.querySelector('#next_page').addEventListener('click', () => {
                renderTableAndPagination(endPage + 1);
                document.getElementById("checkAll").checked = false;
                document.getElementById("checksAll").checked = false;
            });
        }
    }

    renderTableAndPagination();
}

// 클래스 삭제 처리
function del(classId) {
    const password = document.getElementById("pass");
    const delButton = document.getElementById("submit_delete");
    // 삭제 모달 띄우기
    document.getElementById("modal_delete").style.display="block";
    document.getElementById("modal_bg").style.display="block";
    delButton.style.pointerEvents = "none";
    delButton.classList.add("btn_cancel");
    password.value = "";
    password.style.backgroundColor ="#ffffff";
    password.style.borderColor ="#cccccc";

    // 비밀번호 확인
    document.getElementById("pass_submit").onclick = function() {

        let pass = password.value;
        // 입력값이 없을 경우
        if(pass === "") {
            password.style.color = "#d90000";
            password.style.fontWeight = "lighter";
            password.style.fontSize = "13px";
            password.style.backgroundColor ="#ffffff";
            password.style.borderColor ="#cccccc";
            password.type = "text";
            password.value = '비밀번호를 입력해주세요';

            document.getElementById("pass").addEventListener("click", function () {
                password.type = "password";
                password.value = "";
                password.style.color = "black";
                password.style.fontWeight = "500";
                password.style.fontSize = "16px";
            });
        } else {
            // [AD-CL-05] 관리자 클래스 삭제 - 비밀번호 확인 data
            let passData = {
                org_id: orgId,
                user_id: userId,
                user_pw: pass
            };
            // [AD-CL-05] 관리자 클래스 삭제 - 비밀번호 확인 API
            API.admin.password({data: passData}, function(result) {
                console.log('AD-CL-05 CALLED   ', result);
                // API 결과
                if(result.rsp_code === 210) {
                    console.log("일치");
                    password.style.backgroundColor = "#72ffa340";
                    password.style.borderColor ="#5aba7b85";
                    delButton.style.pointerEvents = "all";
                    delButton.classList.remove("btn_cancel");

                    document.getElementById("pass").addEventListener("click", function () {
                        // password.value = "";
                        password.style.backgroundColor ="#ffffff";
                        password.style.borderColor ="#cccccc";
                        delButton.style.pointerEvents = "none";
                        delButton.classList.add("btn_cancel");
                    });

                    delButton.onclick = function() {
                        // 전달 형식 통일
                        if(typeof classId === "string") {
                            classId = [classId];
                        }
                        // [AD-CL-06] 관리자 클래스 삭제 data
                        const submitClass = {
                            org_id: orgId,
                            user_id: userId,
                            class_id: classId
                        };
                        // [AD-CL-06] 관리자 클래스 삭제 API
                        API.admin.classDelete({data: submitClass}, function(result) {
                            console.log('AD-CL-06 CALLED   ', result);

                            // [AD-CL-06] 관리자 클래스 삭제 성공 시 [AD-CL-01] 관리자 클래스 목록 페이지 진입 호출
                            if(result.rsp_code === 200) {
                                // [AD-CL-01] 관리자 클래스 목록 페이지 진입 API
                                API.admin.classList({data: loadData}, function(result) {
                                    console.log('AD-CL-01 CALLED   ', result);
                                    const delList = result.result;
                                    const dcList = delList.class_list;
                                    classList(dcList);
                                    document.getElementById("modal_delete").style.display="none";
                                    document.getElementById("modal_bg").style.display="none";
                                    delButton.style.pointerEvents = "none";
                                    delButton.classList.add("btn_cancel");
                                });
                            } else if(result.rsp_code === 231) {
                                document.getElementById("modal").style.display = "block";
                                document.getElementById('error_title').innerText = '클래스 삭제 불가';
                                document.getElementById('error_content').innerText = '선택한 클래스에 학생이 존재합니다.';
                            }
                        });
                    }
                } else {
                    console.log("일치 X");
                    password.style.backgroundColor ="#fff0f0";
                    password.style.borderColor ="#ffbdbd";
                    delButton.style.pointerEvents = "none";
                    delButton.classList.add("btn_cancel");

                    document.getElementById("pass").addEventListener("click", function () {
                        // password.value = "";
                        password.style.backgroundColor ="#ffffff";
                        password.style.borderColor ="#cccccc";
                        delButton.style.pointerEvents = "none";
                        delButton.classList.add("btn_cancel");
                    });
                }
            });
        }
    }
    document.getElementById("checkAll").checked = false;
    document.getElementById("checksAll").checked = false;
    deleteValue = [];
}

// 학생 삭제 처리
function delStudent(studentId) {
    const passwords = document.getElementById("stud_pass");
    const delButtons = document.getElementById("stud_submit_delete");
    // 삭제 모달 띄우기
    document.getElementById("modal_delete_stud").style.display="block";
    document.getElementById("modal_bg").style.display="block";
    delButtons.style.pointerEvents = "none";
    delButtons.classList.add("btn_cancel");
    passwords.value = "";
    passwords.style.backgroundColor ="#ffffff";
    passwords.style.borderColor ="#cccccc";

    // 비밀번호 확인
    document.getElementById("stud_pass_submit").onclick = function() {

        let sPass = passwords.value;
        // 입력값이 없을 경우
        if(sPass === "") {
            passwords.style.color = "#d90000";
            passwords.style.fontWeight = "lighter";
            passwords.style.fontSize = "13px";
            passwords.style.backgroundColor ="#ffffff";
            passwords.style.borderColor ="#cccccc";
            passwords.type = "text";
            passwords.value = '비밀번호를 입력해주세요';

            document.getElementById("stud_pass").addEventListener("click", function () {
                passwords.type = "password";
                passwords.value = "";
                passwords.style.color = "black";
                passwords.style.fontWeight = "500";
                passwords.style.fontSize = "16px";
            });
        } else {
            // [AD-CL-05] 관리자 클래스 삭제 - 비밀번호 확인 data
            let passDatas = {
                org_id: orgId,
                user_id: userId,
                user_pw: sPass
            };
            // [AD-CL-05] 관리자 클래스 삭제 - 비밀번호 확인 API
            API.admin.password({data: passDatas}, function(result) {
                // API 결과
                if(result.rsp_code === 210) {
                    console.log("일치");
                    passwords.style.backgroundColor = "#72ffa340";
                    passwords.style.borderColor ="#5aba7b85";
                    delButtons.style.pointerEvents = "all";
                    delButtons.classList.remove("btn_cancel");

                    document.getElementById("stud_pass").addEventListener("click", function () {
                        // passwords.value = "";
                        passwords.style.backgroundColor ="#ffffff";
                        passwords.style.borderColor ="#cccccc";
                        delButtons.style.pointerEvents = "none";
                        delButtons.classList.add("btn_cancel");
                    });

                    delButtons.onclick = function() {
                        // 전달 형식 통일
                        if(typeof studentId === "string") {
                            studentId = [studentId];
                        }
                        // [AD-ST-05] 관리자 학생 목록 학생 삭제 data
                        const submitStudent = {
                            org_id: orgId,
                            user_id: userId,
                            student_id: studentId
                        };
                        loadingStart();
                        document.getElementById("error_title").innerText = "학생 삭제 진행 중";
                        document.getElementById("error_content").innerText = "삭제가 완료되면 학생 목록 화면으로 이동합니다. ";
                        // [AD-ST-05] 관리자 학생 목록 학생 삭제 API
                        API.admin.studentDelete({data: submitStudent}, function(result) {
                            console.log('AD-ST-05 CALLED   ', result);
                            if(result.rsp_code === 200) {
                                // [AD-ST-01] 관리자 학생 목록 페이지 진입 API
                                API.admin.studentList({data: loadData}, function (result) {
                                    console.log('AD-ST-01 CALLED   ', result);
                                    const delLists = result.result;
                                    const dsList = delLists.student_list;
                                    studentRender(dsList);
                                    document.getElementById("modal_delete_stud").style.display = "none";
                                    document.getElementById("modal_bg").style.display = "none";
                                    delButtons.style.pointerEvents = "none";
                                    delButtons.classList.add("btn_cancel");
                                    loadingEnd();
                                });
                            }
                        });
                    }
                } else {
                    console.log("일치 X");
                    passwords.style.backgroundColor ="#fff0f0";
                    passwords.style.borderColor ="#ffbdbd";
                    delButtons.style.pointerEvents = "none";
                    delButtons.classList.add("btn_cancel");

                    document.getElementById("stud_pass").onclick = function () {
                        passwords.value = "";
                        passwords.style.backgroundColor ="#ffffff";
                        passwords.style.borderColor ="#cccccc";
                        delButtons.style.pointerEvents = "none";
                        delButtons.classList.add("btn_cancel");
                    }
                }
            });
        }
    }
    document.getElementById("checkAll").checked = false;
    document.getElementById("checksAll").checked = false;
    deleteValue = [];
}

// 클래스 (+)등록 버튼
document.getElementById("btn_new").onclick = function() {
    const className = document.getElementById("class-name");
    const newButton = document.getElementById("submit_new");

    document.getElementById("modal_new").style.display="block";
    document.getElementById("modal_bg").style.display="block";

    if(selectGrade.options.length === 0) {
        // org_id 따라 학년 렌더링
        const orgFirst = orgId.charAt(0);
        let gList = [];
        // 초등학교
        if(orgFirst === 'E') {
            gList.push('초5', '초5-1', '초5-2', '초6', '초6-1', '초6-2');
            // 중학교
        // } else if(orgFirst === 'M') {
        //     gList.push('중1', '중1-1', '중1-2', '중2', '중2-1', '중2-2', '중3', '중3-1', '중3-2');
            // 중학교, 학원
        } else {
            gList.push('초5', '초5-1', '초5-2', '초6', '초6-1', '초6-2',
                '중1', '중1-1', '중1-2', '중2', '중2-1', '중2-2', '중3', '중3-1', '중3-2');
        }

        for(let gl=0; gl<gList.length; gl++) {
            // option 값 정의
            let gName = gList[gl];
            // option 정의
            let op = document.createElement('option');
            op.value = gName;
            op.text = gName;
            // select 태그에 option 넣기
            document.getElementById('class-grade').add(op);
        }
    }

    // 학년 셀렉트박스 초기값
    let grade = selectGrade.options[0].value;
    selectGrade.options[0].selected = true;
    // 학년 셀렉트박스 선택
    document.querySelector('#class-grade').addEventListener('change', () => {
        // 선택값
        grade = selectGrade.options[selectGrade.selectedIndex].value;
    });

    // 클래스 이름 중복 확인
    newButton.style.pointerEvents = "none";
    newButton.classList.add("btn_cancel");
    className.value = "";
    className.style.backgroundColor ="#ffffff";
    className.style.borderColor ="#cccccc";

    // 클래스 이름 중복 확인
    document.getElementById("duplicate").onclick = function() {

        let cName = className.value;
        // 입력값이 없을 경우
        if(cName === "") {
            className.style.color = "#d90000";
            className.style.fontWeight = "lighter";
            className.style.fontSize = "13px";
            className.style.backgroundColor ="#ffffff";
            className.style.borderColor ="#cccccc";
            className.type = "text";
            className.value = '클래스 이름을 입력해주세요';
            // 클래스 이름 클릭
            className.addEventListener("click", function () {
                className.value = "";
                className.style.color = "black";
                className.style.fontWeight = "500";
                className.style.fontSize = "16px";
            });
        } else {
            // [AD-CL-03] 관리자 클래스 등록 - 이름 중복 확인 data
            let nameData = {
                org_id: orgId,
                class_nm: cName
            };
            // [AD-CL-03] 관리자 클래스 등록 - 이름 중복 확인 API
            API.admin.className({data: nameData}, function(result) {
                console.log('AD-CL-03 CALLED   ', result);
                // API 결과
                if(result.rsp_code === 220) {
                    console.log("사용 가능");
                    className.style.backgroundColor = "#72ffa340";
                    className.style.borderColor ="#5aba7b85";
                    newButton.style.pointerEvents = "all";
                    newButton.classList.remove("btn_cancel");
                    // 클래스 이름 클릭
                    className.addEventListener("click", function() {
                        className.value = cName;
                        className.style.backgroundColor ="#ffffff";
                        className.style.borderColor ="#cccccc";
                        newButton.style.pointerEvents = "none";
                        newButton.classList.add("btn_cancel");
                    });

                    newButton.onclick = function() {
                        // [AD-CL-04] 관리자 클래스 등록 data
                        const submitClass = {
                            org_id: orgId,
                            class_gbn: grade,
                            class_id: cName,
                            mgr_id: userId,
                            class_state: "1"
                        };
                        // [AD-CL-04] 관리자 클래스 등록 API
                        API.admin.classInsert({data: submitClass}, function(result) {
                            console.log('AD-CL-04 CALLED   ', result);

                            // [AD-CL-04] 관리자 클래스 등록 API 성공 시 [AD-CL-01] 관리자 클래스 목록 페이지 진입 API 호출
                            if(result.rsp_code === 200) {
                                cName = "";
                                // [AD-CL-01] 관리자 클래스 목록 페이지 진입 API
                                API.admin.classList({data: loadData}, function(result) {
                                    console.log('AD-CL-01 CALLED   ', result);

                                    // API 결과
                                    const insList = result.result;
                                    const iList = insList.class_list;

                                    classList(iList);

                                    document.getElementById("modal_new").style.display="none";
                                    document.getElementById("modal_bg").style.display="none";
                                    newButton.style.pointerEvents = "none";
                                    newButton.classList.add("btn_cancel");
                                    grade = '11';
                                });
                            }
                        });
                    }
                } else {
                    console.log("중복");
                    className.style.backgroundColor ="#fff0f0";
                    className.style.borderColor ="#ffbdbd";
                    newButton.style.pointerEvents = "none";
                    newButton.classList.add("btn_cancel");

                    className.addEventListener("click", function() {
                        // className.value = "";
                        className.style.backgroundColor ="#ffffff";
                        className.style.borderColor ="#cccccc";
                        newButton.style.pointerEvents = "none";
                        newButton.classList.add("btn_cancel");
                    });
                }
            });
        }
    }
}

// 아이디 중복 확인 클릭
document.getElementById("id-duplicate").onclick = function() {
    let iList = [];
    iList = new Array();
    iList = idList();

    let firstId = document.getElementById("regId1");
    let firstPass = document.getElementById("input1");
    
    // 아이디가 하나도 없는 경우
    if(iList === 0) {
        firstId.style.backgroundColor ="#fff0f0";
        firstId.style.borderColor ="#ffbdbd";
        firstId.style.color = "#d90000";
        firstId.style.fontWeight = "lighter";
        firstId.value = '아이디를 입력해주세요';

        firstId.onclick = function() {
            firstId.style.backgroundColor ="#ffffff";
            firstId.style.borderColor ="#cccccc";
            firstId.style.color = "#000000";
            firstId.style.fontWeight = "300";
            firstId.value = "";
        }
    } else {
        // ID 중복 검사
        let dup = duplicate(iList);
        console.log("중복 갯수 : ", dup);
        if(iList[0].id === '아이디가 존재하지 않습니다.') {
            firstId.style.backgroundColor = "#fff0f0";
            firstId.style.borderColor = "#ffbdbd";
            firstId.style.color = "#d90000";
            firstPass.style.backgroundColor = "#fff0f0";
            firstPass.style.borderColor = "#ffbdbd";
            firstPass.style.color = "#d90000";

            firstId.addEventListener('click', function() {
                firstId.style.backgroundColor ="#ffffff";
                firstId.style.borderColor ="#cccccc";
                firstId.style.color = "#000000";
                firstId.style.fontWeight = "300";
                firstId.value = "";
                firstPass.style.backgroundColor ="#ffffff";
                firstPass.style.borderColor ="#cccccc";
                firstPass.style.color = "#000000";
                firstPass.style.fontWeight = "300";
                firstPass.value = "";
            });
        } else {
            console.log("중복 갯수 : ", dup);
            if (dup === 0) {
                let students = [];
                // students = new Array();
                for(let s=0; s<iList.length; s++) {
                    students.push(iList[s].id);
                }

                // [AD-ST-04] 관리자(기관) 학생 이름 중복 확인 data
                const overlapData = {
                    org_id: orgId,
                    student_list: students
                };

                let overData = [];
                // [AD-ST-04] 관리자(기관) 학생 이름 중복 확인 API
                API.admin.overlap({data: overlapData}, function(result) {
                    console.log('AD-ST-04 CALLED   ', result);
                    // API 결과
                    const overList = result.result;

                    for(let o=0; o<overList.length; o++) {
                        if(overList[o].used_yn === "y") {
                            overData.push(overList[o].student_id);
                        }
                    }
                    // 유효성 통과
                    if(overData.length === 0) {
                        console.log('중복 없음');
                        document.getElementById('register_submit').style = "";

                        // [확인] 이벤트 제어
                        document.querySelectorAll(".regId").forEach(click => {
                            click.addEventListener('click', e => {
                                let passId = e.target.id.replace('regId', 'input');
                                // e.target.value = "";
                                // document.getElementById(passId).value = "";
                                document.getElementById("register_submit").style.pointerEvents = "none";
                                document.getElementById("register_submit").style.backgroundColor = "#9EA4B2";
                            });
                        });

                    // 유효성 에러
                    } else {
                        console.log('중복 있음', overData);
                        overlap(overData);
                    }
                });
            }
        }
    }
}

// 아이디 자동 생성 클릭
document.getElementById("id-auto").onclick = function () {
    console.log("아이디 자동 생성");
    const num = document.getElementById("id-count").value;
    const className = studentClass.options[studentClass.selectedIndex].value;
    // 확인 비활성화
    document.getElementById("register_submit").style.pointerEvents = "none";
    document.getElementById("register_submit").style.backgroundColor = "#9EA4B2";

    // [AD-ST-03] 관리자 학생 목록 아이디 자동 생성 data
    const autoData = {
        org_id: orgId,
        user_id: userId,
        class_id: className
    };
    // [AD-ST-03] 관리자 학생 목록 아이디 자동 생성 API
    API.admin.auto({data: autoData}, function(result) {
        console.log('AD-ST-03 CALLED   ', result);

        // 중복 없음
        if(result.rsp_code === 220) {
            if(num === '1') {
                document.getElementById("regId1").value = className + "_" + num;
                document.getElementById("regId1").style.backgroundColor = "#ffffff";
                document.getElementById("regId1").style.borderColor ="#cccccc";
                document.getElementById("regId1").style.color ="#000000";
                document.getElementById("regId1").addEventListener('click', function () {
                    document.getElementById("regId1").value = className + "_" + num;
                });
            } else {
                if(init !== 0 && init > parseInt(num)) {
                    for(let i=1; i<init; i++) {
                        let initId = "regId" + i;
                        document.getElementById(initId).value = "";
                    }
                }
                for(let n=1; n<parseInt(num)+1; n++) {
                    let regId = "regId" + n;
                    document.getElementById(regId).value = className + "_" + n;
                    init = parseInt(num)+1;
                }
            }
        // 중복 존재
        } else {
            const preList = objSort(result.result.id_list,"");
            const preLast = preList[preList.length-1];
            let preData = Object.values(preLast).join();
            preData = preData.replace(className + "_", '');
            let preNum = parseInt(preData);

            if(num === '1') {
                document.getElementById("regId1").value = className + "_" + (preNum+1);
                document.getElementById("regId1").style.backgroundColor = "#ffffff";
                document.getElementById("regId1").style.borderColor ="#cccccc";
                document.getElementById("regId1").style.color ="#000000";
                document.getElementById("regId1").addEventListener('click', function () {
                    document.getElementById("regId1").value = className + "_" + num;
                });
            } else {
                if(init !== 0 && init > parseInt(num)) {
                    for(let i=1; i<init; i++) {
                        let initId = "regId" + i;
                        document.getElementById(initId).value = "";
                    }
                }
                for(let n=1; n<parseInt(num)+1; n++) {
                    let regId = "regId" + n;
                    document.getElementById(regId).value = className + "_" + (preNum+n);
                    document.getElementById(regId).style.backgroundColor = "#ffffff";
                    document.getElementById(regId).style.borderColor ="#cccccc";
                    document.getElementById(regId).style.color ="#000000";

                    init = parseInt(num)+1;
                }
            }
        }
    });
}

// 계정 정보 확인 클릭
document.getElementById("register_submit").onclick = function () {
    let ready = [];
    let error = [];
    let studentList = [];
    ready = new Array();
    error = new Array();
    studentList = new Array();

    for(let s=1; s<51; s++) {
        let regId = "regId" + s;
        let regPass = "input" + s;

        let idValue = document.getElementById(regId).value;
        let passValue = document.getElementById(regPass).value;
        if(idValue !== "" || passValue !== "") {
            let push = {index:s, id:idValue, pass:passValue};
            ready.push(push);
        }
    }
    console.log(ready);

    if(ready.length === 0) {
        document.getElementById("modal").style.display = "block";
        document.getElementById('error_title').innerText = '학생 등록 오류';
        document.getElementById('error_content').innerText = '계정 정보를 입력해주세요.';
    } else {
        for(let r=0; r<ready.length; r++) {
            if(ready[r].id === "") {
                error.push("regId" + ready[r].index);
            }
            if(ready[r].pass === "") {
                error.push("input" + ready[r].index);
            }
        }
    }

    if(error.length !== 0) {
        document.getElementById("modal").style.display = "block";
        document.getElementById('error_title').innerText = '학생 등록 오류';
        document.getElementById('error_content').innerText = '아이디 및 비밀번호를 확인해주세요.';

        for(let e=0; e<error.length; e++) {
            document.getElementById(error[e]).style.backgroundColor = "#fff0f0";
            document.getElementById(error[e]).style.borderColor = "#ffbdbd";

            document.getElementById(error[e]).onclick = function () {
                document.getElementById(error[e]).style.backgroundColor = "#ffffff";
                document.getElementById(error[e]).style.borderColor = "#cccccc";
            }
        }
    } else if(ready.length !== 0) {
        console.log("정상");
        for(let d=0; d<ready.length; d++) {
            let response = {student_id: ready[d].id, student_pw: ready[d].pass, user_type: '30'};
            studentList.push(response);
        }
        // [ST-USER-03] 사용자 회원가입 API data
        const regData = {
            org_id: orgId,
            user_id: userId,
            class_id: studentClass.options[studentClass.selectedIndex].value,
            student_list: studentList
        };
        loadingStart();
        document.getElementById("error_title").innerText = "학생 등록 진행 중";
        document.getElementById("error_content").innerText = "등록이 완료되면 학생 목록 화면으로 이동합니다. ";
        // [ST-USER-03] 사용자 회원가입 API
        API.student.signUp({data: regData}, function(result) {
            console.log('ST-USER-03 CALLED   ', result);

            if(result.rsp_code === 200) {
                // 모달 제거
                document.getElementById("modal_new_stud").style.display = "none";
                document.getElementById("modal_bg").style.display = "none";
                loadingEnd();

                // [AD-ST-01] 관리자 학생 목록 페이지 진입 API
                API.admin.studentList({data: loadData}, function (result) {
                    console.log('AD-ST-01 CALLED   ', result);
                    // API 결과
                    const rsList = result.result;
                    const sList = rsList.student_list;

                    studentRender(sList);
                });

                for (let i = studentGrade.options.length; i >= 0; i--) {
                    studentGrade.options[i] = null;
                }
                for (let i = studentClass.options.length; i >= 0; i--) {
                    studentClass.options[i] = null;
                }
                target.value = "";
                document.getElementById('originName').innerText = "파일을 선택해주세요";
            } else if(result.rsp_code === 241) {
                loadingEnd();
                let errorCount = result.result.error_list.length;

                document.getElementById("modal").style.display = "block";
                document.getElementById('error_title').innerText = '학생 등록 오류';
                document.getElementById('error_content').innerHTML = '오류 &nbsp;' + errorCount + ' 건 <br>' +
                    '오류 ID : &nbsp;' + result.result.error_list + '<br><br>' +
                    '해당 오류가 반복적으로 나타날 경우 관리자에게 문의해주세요.';
            }
        });
    }
}

function classRender() {
    // [AD-ST-02] 관리자 학생 목록 클래스정보 조회 data
    const classInfo = {
        org_id: orgId,
        user_id: userId
    };
    // [AD-ST-02] 관리자 학생 목록 클래스정보 조회 API
    API.admin.classInfo({data: classInfo}, function (result) {
        console.log('AD-ST-02 CALLED   ', result);
        // API 결과
        const infoList = result.result;
        const cInfoList = infoList.class_list;

        // 클래스 정보(학년)
        let studGrade = [];
        for(let n=0; n<cInfoList.length; n++) {
            studGrade.push(cInfoList[n].class_gbn);
        }
        // 클래스 정보(학년) 중복 제거 및 정렬
        studGrade = [...new Set(studGrade)].sort();

        // 클래스 정보(학년) 셀렉트박스 렌더링
        for(let sg=0; sg<studGrade.length; sg++) {
            // option 값 정의
            let sgValue = studGrade[sg];
            // option 정의
            let sgOption = document.createElement('option');
            sgOption.value = sgValue;
            sgOption.text = sgValue;
            // select 태그에 option 넣기
            document.getElementById('stud-grade').add(sgOption);
        }
        // 클래스 정보(학년) 초기값
        let selGrade = studentGrade.options[0].value;
        // 클래스 정보(클래스) 렌더링
        gradeInfo(cInfoList, selGrade);
        // 계정 정보 테이블 렌더링
        registerTable();
        // 클래스 정보(학년) 선택 시 클래스 정보(클래스) 렌더링
        document.querySelector('#stud-grade').addEventListener('change', () => {
            for(let i=studentClass.options.length; i>=0; i--) {
                studentClass.options[i] = null;
            }
            // 선택된 클래스 정보(학년)
            selGrade= studentGrade.options[studentGrade.selectedIndex].value;
            // 클래스 정보(클래스) 렌더링
            gradeInfo(cInfoList, selGrade);
            // 엑셀 파일명 초기화
            document.getElementById('originName').innerText = "파일을 선택해주세요";
        });
    });
}

function searchClass(searchTypes, searchValues) {
    // [AD-CL-02] 관리자 클래스 검색 data
    const searchData = {
        org_id: orgId,
        user_id: userId,
        search_type: searchTypes,
        search_nm: searchValues
    };

    // [AD-CL-02] 관리자 클래스 검색
    API.admin.classSearch({data: searchData}, function(result) {
        console.log('AD-CL-02 CALLED   ', result);

        // API 결과
        const searchList = result.result;
        const scList = searchList.search_list;

        document.getElementById("class-searching").value = searchValues;

        classList(scList);
    });
}

function searchStudent(searchTypes, searchValues) {
    // [AD-ST-06] 관리자 학생 목록 학생 검색 data
    const searchDatas = {
        org_id: orgId,
        user_id: userId,
        search_type: searchTypes,
        search_nm: searchValues
    };

    // [AD-ST-06] 관리자 학생 목록 학생 검색
    API.admin.studentSearch({data: searchDatas}, function(result) {
        console.log('AD-ST-06 CALLED   ', result);
        // API 결과
        const searchLists = result.result;
        const ssList = searchLists.search_list;
        document.getElementById("student-searching").value = searchValues;

        studentRender(ssList);
    });
}
