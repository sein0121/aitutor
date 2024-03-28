var userTestLevel = getCookie('userTestLevel');

//cookie 가져오기기
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));

    // return matches ? decodeURIComponent(matches[1]) : undefined;
    return matches ? unescape(matches[1]) : undefined;
}

document.getElementById("step01").onclick = function() {
    document.getElementById("slide_box").style.translate="-500px";
    document.getElementById("step02_btn").setAttribute("class","active");
}
document.getElementById("step02").onclick = function() {
    document.getElementById("slide_box").style.translate="-1000px";
    document.getElementById("step03_btn").setAttribute("class","active");
}

document.getElementById("step03").onclick = function() {
    if(userTestLevel=="01") window.location.href = 'main';
    else window.location.href  = 'S_result';
}

document.getElementById("step01_btn").onclick = function() {
    document.getElementById("slide_box").style.translate="0px";
    document.getElementById("step02_btn").setAttribute("class","");
    document.getElementById("step03_btn").setAttribute("class","");
}
document.getElementById("step02_btn").onclick = function() {
    document.getElementById("slide_box").style.translate="-500px";
    document.getElementById("step02_btn").setAttribute("class","active");
}
document.getElementById("step03_btn").onclick = function() {
    document.getElementById("slide_box").style.translate="-1000px";
    document.getElementById("step02_btn").setAttribute("class","active");
    document.getElementById("step03_btn").setAttribute("class","active");
}

$('.btn button').click(function(){
    $(this).addClass('active')
    $(this).siblings().removeClass('active')
})

