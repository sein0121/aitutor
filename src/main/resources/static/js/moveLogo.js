// getCookie 호출
var userType = getCookie('userType');
var userNm = getCookie('userNm');

//cookie 가져오기기
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    // return matches ? decodeURIComponent(matches[1]) : undefined;
    return matches ? unescape(matches[1]) : undefined;
}

function moveLogo(){
    console.log(location.href)

    let userNm_input;
    let flag = true;


    if(location.href.includes("T_mypage")){
        userNm_input = document.getElementById("userNm_input").value;
        console.log(userNm_input)
        if(userNm_input.length==0){
            document.getElementById("modal").style.display = "block";
            document.getElementById("icon_id").setAttribute("src","/image/icon_error.svg");
            document.getElementById("ms_title").innerText = "이동 불가";
            document.getElementById("ms_info").innerText = "사용자 이름을 입력해야 넘어갈 수 있습니다.";
            flag = false;
        }
    }

    if(userType=="00") location.href='admin';
    else if(userType=="10") location.href='O_list';
    else if(userType=="20"){
        if(flag) location.href = "T_list";
    }
    else if(userType=="30") location.href='S_result';
}