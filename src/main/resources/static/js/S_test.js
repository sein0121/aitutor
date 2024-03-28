document.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/latest.js?config=TeX-MML-AM_CHTML"></script>');
document.write('<script type="text/x-mathjax-config">MathJax.Hub.Config({tex2jax: {inlineMath: [[\'$\',\'$\'], [\'\\\\(\',\'\\\\)\']]}});</script>');

var orgId = getCookie('orgId');
var orgNm = getCookie('orgNm');
var userId = getCookie('userId');
var userTestLevel = getCookie('userTestLevel');
var userGrd = getCookie('userGrd');
var userTestGrd = getCookie('userTestGrd');

const testTitle = document.getElementById("test-title");
const btn = document.getElementById("btn");
const logout = document.getElementById("logout");
let timerId;

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? unescape(matches[1]) : undefined;
}

// 로딩 활성화
document.getElementById("loading").style.display="block";
document.getElementById("main").style.display="none";
document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('main').className += 'loaded';
});

if(document.referrer.includes("result")) {
    //뒤로 가기 버튼 막기
    window.history.forward(0);
} else if(document.referrer.includes("main")) {
    //뒤로 가기 버튼 막기
    window.history.forward(0);
} else if(document.referrer.includes("intro")) {
    //뒤로 가기 버튼 막기
    window.history.forward(0);
} else if(document.referrer.includes("test")) {
    //뒤로 가기 버튼 막기
    window.history.forward(0);
}

// 페이지 로딩 시 API 호출
function windowOnLoad() {
    document.cookie = "userPauseYn=y;path=/;";

    // [TEST-01] 테스트 문항 리스트 조회 data
    const loadData = {
        org_id: orgId,
        user_id: userId,
        user_grd: userGrd,
        user_test_grd: userTestGrd,
        user_test_level: userTestLevel
    }
    // [TEST-01] 테스트 문항 리스트 조회 API
    API.student.list({data: loadData}, function(result) {
        // API 결과
        const testResult = result.result;
        console.log('ST-TEST-01 CALLED   ', result);
        // DB 경과 시간
        const totalTime = testResult.total_time;
        // 문제 정보
        const qstList = testResult.qst_list;
        const startQst = testResult.start_qst;

        // 경과 시간 구하기
        startTimer(totalTime);
        // 문제 정보 출력
        renderTest(qstList, startQst);
    });
}

// window.onload = windowOnLoad;
window.onload = setTimeout(function() {
    windowOnLoad();
}, 1000);

// window 창 닫기 이벤투
window.addEventListener('beforeunload', (event) => {
    // [ST-TEST-02] 테스트 중지 data
    const stopData = {
        org_id: orgId,
        user_id: userId,
        user_grd: userGrd,
        user_test_grd: userTestGrd,
        user_test_level: userTestLevel,
        total_time: spendTime()
    };
    // [ST-TEST-02] 테스트 중지 API
    API.student.pause({data: stopData}, function(result) {
        console.log('ST-TEST-02 CALLED   ', result);
    });
});

// 경과 시간 구하기
function startTimer(totalTime) {
    let time = totalTime;
    const spendTime = document.getElementById("spend-time");
    let hour, min, sec;

    startClock();

    // 경과 시간 출력
    function printTime() {
        time++;
        spendTime.innerText = getTimeFormatString();
    }
    // 경과 시간 시작
    function startClock() {
        printTime();
        stopClock();
        timerId = setTimeout(startClock, 1000);
    }
    // 경과 시간 중지
    function stopClock() {
        if(timerId != null) {
            clearTimeout(timerId);
        }
    }
    // 경과 시간을 시,분,초 문자열로 변환
    function getTimeFormatString() {
        hour = parseInt(String(time / (60 * 60)));
        min = parseInt(String((time - (hour * 60 * 60)) / 60));
        sec = time % 60;

        return String(hour).padStart(2, '0') + ":" + String(min).padStart(2, '0') + ":" + String(sec).padStart(2, '0');
    }
}

// 문제 정보 출력
function renderTest(qstList, startQst) {
    document.getElementById("loading").style.display="none";
    document.getElementById("main").style.display="block";
    // 문제 정보
    const testNum = document.getElementById("test-num");
    const testLevel = document.getElementById("test-level");
    // const testTitle = document.getElementById("test-title");
    const testImg = document.getElementById("test-img");
    // 답안지 보기
    const ansTotal = document.getElementById("ans-total");
    const ansCnt = document.getElementById("ans-cnt");
    const nullCnt = document.getElementById("null-cnt");
    const ansList = document.getElementById("ans-list");
    // 현재 입력한 답
    const inputAns = document.getElementById("input-ans");

    renderQuest(startQst);
    paging(qstList.length, startQst);

    // 답안지 보기
    const totalAns = qstList.length;
    let countAns = 0;
    let countNull = 0;

    // 전체 문제 수 loop
    for(let c=0; c<totalAns; c++) {
        // 답변이 없는 경우
        if(qstList[c].submit_answer === "" || qstList[c].submit_answer === null) {
            let nullElement = document.createElement("li");
            let nullSpan1 = document.createElement("span");
            let nullSpan2 = document.createElement("span");

            ansList.appendChild(nullElement);
            nullElement.setAttribute("class","null");
            nullElement.setAttribute("style","cursor: pointer;");
            nullElement.appendChild(nullSpan1);
            nullSpan1.innerText = qstList[c].qst_seq;
            nullSpan1.setAttribute("id", "go-qst1");
            nullSpan1.setAttribute("qst-value1", qstList[c].qst_seq);
            nullElement.appendChild(nullSpan2);
            nullSpan2.innerText = "미입력";
            nullSpan2.setAttribute("id", "go-qst2");
            nullSpan2.setAttribute("qst-value2", qstList[c].qst_seq);

            countNull++;
            // 답변이 있는 경우
        } else {
            let ansElement = document.createElement("li");
            let ansSpan1 = document.createElement("span");
            let ansSpan2 = document.createElement("span");

            ansList.appendChild(ansElement);
            ansElement.setAttribute("style","cursor: pointer;");
            ansElement.appendChild(ansSpan1);
            ansSpan1.innerText = qstList[c].qst_seq;
            ansSpan1.setAttribute("id", "go-qst1");
            ansSpan1.setAttribute("qst-value1", qstList[c].qst_seq);
            ansElement.appendChild(ansSpan2);
            ansSpan2.innerText = qstList[c].submit_answer;
            ansSpan2.setAttribute("id", "go-qst2");
            ansSpan2.setAttribute("qst-value2", qstList[c].qst_seq);

            countAns++;
        }
    }
    // 전체 문항 수, 입력 문항 수, 미입력 문항 수 출력
    // console.log("countAns   ", countAns, "   countNull   ", countNull);
    ansTotal.innerText = totalAns + "문항";
    ansCnt.innerText = "입력 : " + countAns;
    nullCnt.innerText = "미입력 : " + countNull;

    // 번호 선택
    document.querySelectorAll('#go-qst1').forEach(goQst => {
        goQst.addEventListener('click', e => {
            paging(totalAns, parseInt(e.target.getAttribute('qst-value1')));
            renderQuest(parseInt(e.target.getAttribute('qst-value1')));
        });
    });
    // 답변 선택
    document.querySelectorAll('#go-qst2').forEach(goQst => {
        goQst.addEventListener('click', e => {
            paging(totalAns, parseInt(e.target.getAttribute('qst-value2')));
            renderQuest(parseInt(e.target.getAttribute('qst-value2')));
        });
    });

    // 문제 출력
    function renderQuest(startQst){
        // MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
        for(let i=0; i<qstList.length; i++) {
            if(qstList[i].qst_seq === startQst) {
                let eduLevel = change_eduLevelNM(qstList[i].edu_level_nm);
                let qstId = qstList[i].qst_id + "_" + qstList[i].qst_seq;
                let unitName = qstList[i].unit_nm;
                unitName = unitName.replace("\\y", "\y");
                unitName = unitName.replace("/[방정식]+[ $]+\\/g", "방정식 $");
                testNum.setAttribute("qst-id", qstId);
                testNum.innerText = "문제" + qstList[i].qst_seq;
                testLevel.innerText = eduLevel;
                testTitle.innerText = unitName;
                testImg.src = API.image.viewer(qstList[i].qst_img_file_nm);
                if(qstList[i].submit_answer !== "") {
                    inputAns.value = qstList[i].submit_answer;
                    inputAns.style.backgroundColor = '#e4e4fe';
                    inputAns.style.borderColor = '#5654d1';
                }

                // [HIST-01] 테스트 문항 진입 로그 생성 data
                const enterData = {
                    org_id: orgId,
                    user_id: userId,
                    user_grd: userGrd,
                    user_test_grd: userTestGrd,
                    user_test_level: userTestLevel,
                    qst_id: qstList[i].qst_id
                };
                // [HIST-01] 테스트 문항 진입 로그 생성 API
                API.hist.in({data: enterData}, function(result) {
                    console.log('HIST-01 CALLED   ', result);
                });

                // 현재 입력한 답 출력
                document.querySelectorAll('#go-qst2').forEach(ansQst => {
                    let ansQstValue = ansQst.getAttribute('qst-value2');
                    if(parseInt(ansQstValue) === startQst) {
                        if(ansQst.innerText === '미입력') {
                            console.log("000");
                            inputAns.value = "";
                            inputAns.style.backgroundColor = '#ffffff';
                            inputAns.style.borderColor = '#cccccc';
                        } else {
                            console.log("111");
                            inputAns.value = ansQst.innerText;
                            inputAns.style.backgroundColor = '#e4e4fe';
                            inputAns.style.borderColor = '#5654d1';
                        }
                    }
                });
            }
        }
        updateValue();
    }

    // 답변 저장
    document.querySelector('#ans-button').addEventListener('click', () => {
        let quest = document.getElementById('test-num').getAttribute('qst-id');
        const qstValue = quest.split('_');
        const qstSaveId = qstValue[0];
        const qstNum = qstValue[1];
        document.querySelectorAll('#go-qst2').forEach(goQst => {
            let goQstValue = goQst.getAttribute('qst-value2');
            if(goQstValue === qstNum) {
                // 기존 답변 = 현재 입력 답변
                if(goQst.innerText === '미입력' && inputAns.value === "" || goQst.innerText === inputAns.value) {
                    console.log('답변 동일');
                    // 기존 답변 != 현재 입력 답변
                } else {
                    // [ST-TEST-03] 테스트 답변 저장
                    if(goQst.innerText !== inputAns.value) {
                        if (goQst.innerText === '미입력') {
                            countAns++;
                            countNull--;
                            slider(totalAns, countAns);
                            goQst.parentElement.classList.remove("null");
                        }
                        let qstAns = "";
                        let chgYn = "";
                        let iColor = "";
                        let bColor = "";
                        if (inputAns.value === "" || inputAns.value === null) {
                            goQst.innerText = '미입력';
                            countAns--;
                            countNull++;
                            slider(totalAns, countAns);
                            goQst.parentElement.classList.add("null");
                            qstAns = '';
                            iColor = '#ffffff';
                            bColor = '#cccccc';
                        } else {
                            goQst.innerText = inputAns.value;
                            qstAns = inputAns.value;
                            iColor = '#e4e4fe';
                            bColor = '#5654d1';
                        }
                        // [ST-TEST-03] 테스트 답변 저장 data
                        const saveData = {
                            org_id: orgId,
                            user_id: userId,
                            user_grd: userGrd,
                            user_test_grd: userTestGrd,
                            user_test_level: userTestLevel,
                            qst_id: qstSaveId,
                            qst_answer: qstAns,
                            total_time: spendTime()
                            // chg_yn: 'y'
                        }
                        // [ST-TEST-03] 테스트 답변 저장 API
                        API.student.save({data: saveData}, function(result) {
                            console.log('ST-TEST-03 CALLED   ', result);
                            inputAns.style.backgroundColor = iColor;
                            inputAns.style.borderColor = bColor;
                        });
                    }
                }
            }
            ansTotal.innerText = totalAns + "문항";
            ansCnt.innerText = "입력 : " + countAns;
            nullCnt.innerText = "미입력 : " + countNull;
        });
    });

    // 페이지네이션
    function paging(totalPage, currentPage) {
        const blockCount = 10;
        let totalBlock = Math.ceil(totalPage / blockCount);
        const pagination = document.getElementById('pagination');
        // 페이지네이션 화면 출력
        renderPagination(currentPage);

        // 페이지네이션 화면 출력
        function renderPagination(page) {
            let block = Math.floor((page-1) / blockCount) + 1;
            let startPage = ((block - 1) * blockCount) + 1;
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
                    "<li class='current' style='cursor: pointer;'>" + index + "</li>" :
                    "<li id='go_page' style='cursor: pointer;' data-value='" + index + "'>" + index + "</li>";
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

        // 페이지네이션 이벤트
        function addEventPagination(startPage, endPage) {
            // 이전 페이지 버튼 클릭
            if(!!document.querySelector('#back_page')) {
                document.querySelector('#back_page').addEventListener('click', () => {
                    // [HIST-02] 테스트 문항 진입 로그 업데이트 API (out_date update)
                    outHist();
                    renderPagination(startPage - 1);
                    renderQuest(startPage - 1);
                });
            }
            // 페이지 클릭
            document.querySelectorAll('#go_page').forEach(goPage => {
                goPage.addEventListener('click', e => {
                    // [HIST-02] 테스트 문항 진입 로그 업데이트 API (out_date update)
                    outHist();
                    renderPagination(parseInt(e.target.getAttribute('data-value')));
                    renderQuest(parseInt(e.target.getAttribute('data-value')));
                });
                // goPage.addEventListener("click", updateValue);
            });
            // 다음 페이지 버튼 클릭
            if(!!document.querySelector('#next_page')) {
                document.querySelector('#next_page').addEventListener('click', () => {
                    // [HIST-02] 테스트 문항 진입 로그 업데이트 API (out_date update)
                    outHist();
                    renderPagination(endPage + 1);
                    renderQuest(endPage + 1);
                });
            }
        }
    }

    // [현재 입력한 답] 이전 버튼 클릭
    document.querySelector('#prev-button').addEventListener('click', () => {
        // [HIST-02] 테스트 문항 진입 로그 업데이트 data (out_date update)
        let prevId = document.getElementById('test-num').getAttribute('qst-id');
        const prevValue = prevId.split('_');
        const prevQst = prevValue[0];
        const prev = prevValue[1];
        let prevExitData = {
            org_id: orgId,
            user_id: userId,
            user_test_level: userTestLevel,
            qst_id: prevQst,
            user_grd: userGrd,
            user_test_grd: userTestGrd
        }
        if(prev !== "1"){
            // [HIST-02] 테스트 문항 진입 로그 업데이트 API (out_date update)
            outHist();
            paging(totalAns, parseInt(prev)-1);
            renderQuest(parseInt(prev)-1);
        }
    });

    // [현재 입력한 답] 다음 버튼 클릭
    document.querySelector('#next-button').addEventListener('click', () => {
        // [HIST-02] 테스트 문항 진입 로그 업데이트 data (out_date update)
        let nextId = document.getElementById('test-num').getAttribute('qst-id');
        const nextValue = nextId.split('_');
        const nextQst = nextValue[0];
        const next = nextValue[1];
        let nextExitData = {
            org_id: orgId,
            user_id: userId,
            user_test_level: userTestLevel,
            qst_id: nextQst,
            user_grd: userGrd,
            user_test_grd: userTestGrd
        }
        if(next !== totalAns.toString()){
            // [HIST-02] 테스트 문항 진입 로그 업데이트 API (out_date update)
            outHist();
            paging(totalAns, parseInt(next)+1);
            renderQuest(parseInt(next)+1);
        }
    });

    // 퍼센트바 출력
    slider(totalAns, countAns);
}

// 진행 상황 퍼센트바
function slider(totalAns, countAns){
    // 진행 상황 퍼센트바 value
    const mySlider = document.getElementById("my-slider");
    const sliderValue = document.getElementById("slider-value");
    const valPercent = Math.floor((countAns / totalAns)*100);
    mySlider.value = valPercent;
    // 라엘 css 수정 문의 필요 -----------------------------
    mySlider.style.pointerEvents = 'none';
    // --------------------------------------------------
    mySlider.style.background = `linear-gradient(to right, #b6b4f9 ${valPercent}%, #8b8ea0 ${valPercent}%)`;
    sliderValue.textContent = valPercent.toString();
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

//문제풀이 유의사항 활성화
document.getElementById("modal_open_btn").onclick = function() {
    document.getElementById("info_modal").style.display="block";
    document.getElementById("modal_bg_info").style.display="block";
}

//문제풀이 유의사항 비활성화
document.getElementById("modal_close_btn").onclick = function() {
    document.getElementById("info_modal").style.display="none";
    document.getElementById("modal_bg_info").style.display="none";
}

// 문제풀이 유의사항 외부 클릭 시 비활성화
document.getElementById("main").onclick = function (e){
    let info_modal =document.getElementById("info_modal");

    if(e.target.className=="infobtn"){
        document.getElementById("info_modal").style.display = "block";
    }else if(e.target.className!="" && e.target.className!="info_modal"){
        document.getElementById("info_modal").style.display = "none";
    }
}

// 답안지 보기 활성화&비활성화
document.getElementById("view_answer").onclick = function() {
    const answer = document.getElementById("answer");
    const view = document.getElementById("view_answer");

    if(answer.style.right === "" || answer.style.right === "-260px") {
        answer.style.right = "0px";
        view.innerText = "답안지 닫기";
    } else {
        answer.style.right = "-260px";
        view.innerText = "답안지 보기";
    }
}

// 답변 입력칸 클릭
document.getElementById("input-ans").onclick = function() {
    document.getElementById("input-ans").style.backgroundColor="#ffffff";
    document.getElementById("input-ans").style.borderColor="#cccccc";
    // document.getElementById("input-ans").value = "";
}

// 모달 X 버튼
document.getElementById("popup_close_btn").onclick = function() {
    document.getElementById("modal").style.display="none";
    document.getElementById("modal_bg").style.display="none";
}

// 모달 확인 버튼
document.getElementById("popup_ok_btn").onclick = function() {
    document.getElementById("modal").style.display="none";
    document.getElementById("modal_bg").style.display="none";
}

// 테스트 중지하기
document.getElementById("test-stop").onclick = function() {
    // 시간 멈추기
    clearTimeout(timerId);

    // [ST-TEST-02] 테스트 중지 data
    const stopData = {
        org_id: orgId,
        user_id: userId,
        user_test_level: userTestLevel,
        total_time: spendTime(),
        user_grd: userGrd,
        user_test_grd: userTestGrd
    };
    // [ST-TEST-02] 테스트 중지 API
    API.student.pause({data: stopData}, function(result) {
        console.log('ST-TEST-02 CALLED   ', result);
    });
    // alert('중지 완료 (메인 페이지 호출 예정)');
    // API 안으로 옮기기
    document.getElementById("modal").style.display = "block";
    document.getElementById("modal_bg").style.display = "block";
    document.getElementById("img_icon").src = "/image/icon_info.svg"
    document.getElementById('reject_ok_btn').style.display = "none";
    document.getElementById('popup_ok_btn').style.display = "none";
    document.getElementById('stop_ok_btn').style.display = "unset";
    document.getElementById('modal_title').innerText = '중지 완료';
    document.getElementById('modal_content').innerText = '이전 페이지로 이동합니다.';
}

// 답안지 제출하기
document.getElementById("test-submit").onclick = function() {
    console.log('제출하기');
    let noneAns = document.getElementById("null-cnt").innerText;
    console.log(noneAns);
    let splitAns = noneAns.split(' : ');
    let noneCnt = splitAns[1];
    if(noneCnt !== '0') {
        // console.log('미입력 갯수   ', noneCnt);
        // alert('모든 답변을 입력한 후 답안지를 제출해주세요');
        document.getElementById("modal").style.display = "block";
        document.getElementById("modal_bg").style.display = "block";
        document.getElementById("img_icon").src = "/image/icon_error.svg"
        document.getElementById('reject_ok_btn').style.display = "unset";
        document.getElementById('popup_ok_btn').style.display = "none";
        document.getElementById('stop_ok_btn').style.display = "none";
        document.getElementById('modal_title').innerText = '제출 불가';
        document.getElementById('modal_content').innerText = '모든 답변을 입력한 후 답안지를 제출해주세요.';
    } else {
        // 시간 정지
        clearTimeout(timerId);

        document.getElementById("modal").style.display = "block";
        document.getElementById("modal_bg").style.display = "block";
        document.getElementById("img_icon").src = "/image/icon_confirm.png"
        document.getElementById('modal_title').innerText = '제출 확인';
        document.getElementById('modal_content').innerText = '답안지 제출 시 더 이상 수정할 수 없습니다.';
        document.getElementById('reject_ok_btn').style.display = "none";
        document.getElementById('popup_ok_btn').style.display = "none";
        document.getElementById('stop_ok_btn').style.display = "none";
        document.getElementById('modal_cancel_btn').style.display = "unset";
        document.getElementById('submit').style.display = "unset";

        document.getElementById('modal_cancel_btn').onclick = function() {
            startTimer(spendTime3);
            document.getElementById("modal").style.display = "none";
            document.getElementById("modal_bg").style.display = "none";
            document.getElementById('reject_ok_btn').style.display = "none";
            document.getElementById('popup_ok_btn').style.display = "unset";
            document.getElementById('stop_ok_btn').style.display = "none";
            document.getElementById('modal_cancel_btn').style.display = "none";
            document.getElementById('submit').style.display = "none";
        }

        document.getElementById('submit').onclick = function() {
            // [ST-TEST-04] 테스트 완료 후 답안지 제출 data
            const submitData = {
                org_id: orgId,
                user_id: userId,
                user_grd: userGrd,
                user_test_grd: userTestGrd,
                user_test_level: userTestLevel,
                total_time: spendTime()
            };
            // [ST-TEST-04] 테스트 완료 후 답안지 제출 API
            API.student.submission({data: submitData}, function(result) {
                console.log('ST-TEST-04 CALLED   ', result);
                // 정상 호출
                if(result.rsp_code === 200) {
                    // alert('제출 완료 (결과 페이지 호출 예정)');
                    document.getElementById("modal").style.display = "block";
                    document.getElementById("modal_bg").style.display = "block";
                    document.getElementById("img_icon").src = "/image/icon_info.svg"
                    document.getElementById('modal_title').innerText = '제출 완료';
                    document.getElementById('modal_content').innerText = '결과 페이지로 이동합니다.';
                    document.getElementById('reject_ok_btn').style.display = "none";
                    document.getElementById('popup_ok_btn').style.display = "unset";
                    document.getElementById('stop_ok_btn').style.display = "none";
                    document.getElementById('modal_cancel_btn').style.display = "none";
                    document.getElementById('submit').style.display = "none";
                }
            });
        }
    }
}

document.getElementById('popup_ok_btn').onclick = function() {
    if(userTestLevel=="01") document.cookie = "userTestLevel=02;path=/;";
    window.location.href = '/aitutor/student/S_result';
}

document.getElementById('reject_ok_btn').onclick = function() {
    document.getElementById('modal').style.display = "none";
    document.getElementById('modal_bg').style.display = "none";
}

document.getElementById('stop_ok_btn').onclick = function() {
    if(userTestLevel === "01") {
        window.location.href = '/aitutor/student/main';
    } else {
        window.location.href = '/aitutor/student/S_result';
    }
}

document.getElementById('logo').onclick = function() {
    if(userTestLevel === "01") {
        document.getElementById('logoURL').href = '/aitutor/student/main';
    } else {
        document.getElementById('logoURL').href = '/aitutor/student/S_result';
    }
}

document.getElementById('name').onclick = function() {
    if(userTestLevel === "01") {
        document.getElementById('nameURL').href = '/aitutor/student/main';
    } else {
        document.getElementById('nameURL').href = '/aitutor/student/S_result';
    }
}

document.getElementById('loging').onclick = function() {
    if(userTestLevel === "01") {
        document.getElementById('loadingLogo').href = '/aitutor/student/main';
    } else {
        document.getElementById('loadingLogo').href = '/aitutor/student/S_result';
    }
}

document.getElementById('naming').onclick = function() {
    if(userTestLevel === "01") {
        document.getElementById('loadingName').href = '/aitutor/student/main';
    } else {
        document.getElementById('loadingName').href = '/aitutor/student/S_result';
    }
}

// 로그아웃 시 [ST-TEST-02] 호출
logout.addEventListener("click", function() {
    // [ST-TEST-02] 테스트 중지 data
    const stopData = {
        org_id: orgId,
        user_id: userId,
        user_grd: userGrd,
        user_test_grd: userTestGrd,
        user_test_level: userTestLevel,
        total_time: spendTime()
    };
    // [ST-TEST-02] 테스트 중지 API
    API.student.pause({data: stopData}, function(result) {
        console.log('ST-TEST-02 CALLED   ', result);
    });
})

// [HIST-02] DATA
function exitAPIData() {
    let recent = document.getElementById('test-num').getAttribute('qst-id');
    let recentValue = recent.split('_');
    let recentId = recentValue[0];
    // [HIST-02] 테스트 문항 진입 로그 업데이트 data (out_date update)
    let exitData = {
        org_id: orgId,
        user_id: userId,
        user_test_level: userTestLevel,
        qst_id: recentId,
        user_grd: userGrd,
        user_test_grd: userTestGrd
    }
    return exitData;
}

// 진행 시간 구하기
function spendTime() {
    let spendSubmit = document.getElementById("spend-time").innerText;
    let totalTime = spendSubmit.split(':');
    let tHour = totalTime[0];
    let tMin = totalTime[1];
    let tSec = totalTime[2];

    let ttHour = parseInt(tHour)*60*60;
    let ttMin = parseInt(tMin)*60;
    let ttSec = parseInt(tSec);
    let submitTime = ttHour + ttMin + ttSec;

    return submitTime;
}

// 교육 과정 단계명 변경
function change_eduLevelNM(edu_level_nm){
    let split = edu_level_nm.split('');

    split[0] = split[0].replace("E","초등").replace("M","중등").replace("H","고등");
    edu_level_nm = split[0]+split[1]+"-"+split[2];

    return edu_level_nm;
}

function updateValue() {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, "test-title"]);
}

function outHist() {
    // [HIST-02] 테스트 문항 진입 로그 업데이트 API (out_date update)
    API.hist.out({data: exitAPIData()}, function(result) {
        console.log('HIST-02 CALLED   ', result);

        if(result === undefined) {
            location.href = "/login";
        }
    });
}

//새로고침 방지
// Ctrl+R, Ctrl+N, F5 키 막음
function doNotReload(){
    if( (event.ctrlKey == true && (event.keyCode == 78 || event.keyCode == 82)) //ctrl+N , ctrl+R
        || (event.keyCode == 116) ) // function F5
    {
        event.keyCode = 0;
        event.cancelBubble = true;
        event.returnValue = false;
    }
}
document.onkeydown = doNotReload;


