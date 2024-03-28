const pro_excel = document.querySelector('#pro_excel');
const com_excel = document.querySelector('#com_excel');
const btn_excel = document.querySelector('#btn_excel');

// document.addEventListener('DOMContentLoaded', ()=>{
//     pro_excel.addEventListener('click', exportExcel);
//     com_excel.addEventListener('click', exportExcel);
// });

var excelHandler = {}

function proClick(id){
    let fileNm = id;
    excelHandler = {
        getExcelFileName : function(){
            return "테스트미완료학생목록_"+fileNm+'.xlsx';	//파일명
        },
        getSheetName : function(){
            return '테스트 미완료 학생목록';	//시트명
        },
        getExcelData : function(){
            return document.getElementById("table_progress"); 	//TABLE id
        },
        getWorksheet : function(){
            return XLSX.utils.table_to_sheet(this.getExcelData());
        }
    }
    exportExcel();
}

function comClick(id){
    let fileNm = id;
    excelHandler = {
        getExcelFileName : function(){
            return "테스트완료학생목록_"+fileNm+'.xlsx';	//파일명
        },
        getSheetName : function(){
            return '테스트완료학생목록';	//시트명
        },
        getExcelData : function(){
            return document.getElementById("table_complete"); 	//TABLE id
        },
        getWorksheet : function(){
            return XLSX.utils.table_to_sheet(this.getExcelData());
        }
    }
    exportExcel();
}

function btnClick(list, userId){
    // ArrayBuffer 만들어주는 함수
    function s2ab(s) {
        var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
        var view = new Uint8Array(buf);  //create uint8array as viewer
        for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
        return buf;
    }

    let data = [];
    data.push(['학년', '학생아이디', '클래스', '테스트단계', '진행율', '상태']);

    for(let i=0; i<list.length; i++) {
        let grade = list[i].user_grd;
        let id = list[i].student_id;
        let name = list[i].class_nm;
        let test = list[i].user_qst_level;
        test = test.charAt(test.length-1);
        test = test + "단계";
        let rate = list[i].test_rate.toString();
        rate = rate + "%";
        let state = list[i].user_state;
        if(state === "1") {
            state = "재원";
        } else {
            state = "휴원";
        }

        data.push([grade, id, name, test, rate, state]);
    }

    var title = '학생목록_' + userId + '.xlsx';

    // workbook 생성
    var wb = XLSX.utils.book_new();
    // sheet명 생성
    wb.SheetNames.push("학생 목록");
    // 이중 배열 형태로 데이터가 들어간다.
    var wsData = data;
    // 배열 데이터로 시트 데이터 생성
    var ws = XLSX.utils.aoa_to_sheet(wsData);
    // 시트 데이터를 시트에 넣기 ( 시트 명이 없는 시트인경우 첫번째 시트에 데이터가 들어감 )
    wb.Sheets["학생 목록"] = ws;

    // 엑셀 파일 쓰기
    var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
    // 파일 다운로드
    saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), title);
}

function accClick(idList, passList, userId, grade, name){
    // ArrayBuffer 만들어주는 함수
    function s2ab(s) {
        var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
        var view = new Uint8Array(buf);  //create uint8array as viewer
        for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
        return buf;
    }

    let count = 0;
    let idCount = 0;
    let passCount = 0;
    let teacher = userId;
    let data = [];
    data.push(['No.', '아이디', '비밀번호']);

    if(idList.length === undefined) {
        idCount = 0;
    } else {
        idCount = idList.length;
    }
    if(passList.length === undefined) {
        passCount = 0;
    } else {
        passCount = passList.length;
    }

    if(idCount < passCount) {
        count = passCount;
    } else {
        count = idCount;
    }

    for(let i=0; i<count; i++) {
        let no = i+1;
        let id = "";
        let pass = "";
        // id값 대입
        if(idCount !== 0) {
            if(no>idCount) {
                id = "";
            } else {
                id = idList[i].id;
            }
        }
        // pass값 대입
        if(passCount !== 0) {
            if(no>passCount) {
                pass = "";
            } else {
                pass = passList[i].pass;
            }
        }
        // 데이터 column 생성
        data.push([no, id, pass]);
    }
    if(userId === undefined) {
        teacher = "관리자";
    }
    // excel 파일명
    var title = '계정등록정보_' + teacher + '_' + grade + '_' + name + '.xlsx';
    // workbook 생성
    var wb = XLSX.utils.book_new();
    // sheet명 생성
    wb.SheetNames.push("계정등록");
    // 이중 배열 형태로 데이터가 들어간다.
    var wsData = data;
    // 배열 데이터로 시트 데이터 생성
    var ws = XLSX.utils.aoa_to_sheet(wsData);
    // 시트 데이터를 시트에 넣기 ( 시트 명이 없는 시트인경우 첫번째 시트에 데이터가 들어감 )
    wb.Sheets["계정등록"] = ws;

    // 엑셀 파일 쓰기
    var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
    // 파일 다운로드
    saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), title);
}

function exportExcel(){
    // step 1. workbook 생성
    var wb = XLSX.utils.book_new();

    // step 2. 시트 만들기
    var newWorksheet = excelHandler.getWorksheet();

    // step 3. workbook에 새로만든 워크시트에 이름을 주고 붙인다.
    XLSX.utils.book_append_sheet(wb, newWorksheet, excelHandler.getSheetName());

    // step 4. 엑셀 파일 만들기
    var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});

    // step 5. 엑셀 파일 내보내기
    saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), excelHandler.getExcelFileName());
}

function readExcel() {
    let input = event.target;
    let reader = new FileReader();

    reader.onload = function () {
        let data = reader.result;
        let workBook = XLSX.read(data, { type: 'binary' });
        workBook.SheetNames.forEach(function (sheetName) {
            console.log('SheetName: ' + sheetName);
            let rows = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName]);

            console.log(rows);

            if(rows[0].ID === undefined) {
                let firstId = document.getElementById("regId1");
                let firstPass = document.getElementById("input1");

                firstId.value = '아이디가 존재하지 않습니다.';
                firstId.style.fontWeight = "lighter";
                firstPass.value = '비밀번호가 존재하지 않습니다.'
                firstPass.style.fontWeight = "lighter";

                firstId.addEventListener("click", function() {
                    firstId.value = "";
                    firstId.style.fontWeight = "300";
                    firstPass.value = "";
                    firstPass.style.fontWeight = "300";
                });

                firstPass.addEventListener("click", function() {
                    firstId.value = "";
                    firstId.style.fontWeight = "300";
                    firstPass.value = "";
                    firstPass.style.fontWeight = "300";
                });

            } else {
                for(let r=0; r<rows.length; r++){
                    let id = 'regId' + (r+1);
                    let pass = 'input' + (r+1);
                    // 특수문자 '&' 제거
                    document.getElementById(id).value = rows[r].ID.replace('&','');
                    document.getElementById(pass).value = rows[r].비밀번호;
                }
            }
        })
    };
    reader.readAsBinaryString(input.files[0]);

    return reader;
}

function s2ab(s) {
    var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    var view = new Uint8Array(buf);  //create uint8array as viewer
    for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
    return buf;
}