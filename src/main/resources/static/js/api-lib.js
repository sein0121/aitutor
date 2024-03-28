/**
 * API 및 AJAX 함수 정의
 */

/*-----------------------------------------*
 * REAL API
 *-----------------------------------------*/
// ajax post
var apiAjaxPost = function (options, data, callback) {
    var url = options.url;
    var headers = options.headers || [];
    var request = new XMLHttpRequest();

    request.open('POST', url, true);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.onreadystatechange = function () {
        if (request.readyState !== 4) return;
        if (request.status == '200') {
            if (typeof callback === 'function') {
                callback(parseJson(request.responseText), {
                    request: data,
                    response: request.responseText,
                }, request.status);
            }
        }
        else if(request.status == '401') window.location.href = "401";
        else if(request.status == '403') window.location.href = "403";
        else if(request.status == '404') window.location.href = "404";
        else {
            callback(null, {
                request: data,
                response: request.responseText,
            }, request.status);
        }
    }
    if (Array.isArray(headers) && headers.length > 0) {
        for(const header of headers) {
            request.setRequestHeader(header.key, header.value);
        }
    }
    request.send(JSON.stringify(data));
}

// ajax get
var apiAjaxGet = function (options, callback) {
    var url = options.url;
    var headers = options.headers || [];
    var request = new XMLHttpRequest();

    request.open('GET', url, true);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.onreadystatechange = function () {
        if (request.readyState !== 4) return;
        if (request.status == '200') {
            if (typeof callback === 'function') {
                callback(parseJson(request.responseText), {
                    request: null,
                    response: request.responseText,
                }, request.status);
            }
        }
        else if(request.status == '401') window.location.href = "401";
        else if(request.status == '403') window.location.href = "403";
        else if(request.status == '404') window.location.href = "404";
        else {
            callback(null, {
                request: null,
                response: request.responseText,
            }, request.status);
        }
    }
    if (Array.isArray(headers) && headers.length > 0) {
        for(const header of headers) {
            request.setRequestHeader(header.key, header.value);
        }
    }
    request.send();
}

var apiAjaxGetLogin = function (options, callback) {
    var url = options.url;
    var headers = options.headers || [];
    var request = new XMLHttpRequest();

    request.open('GET', url, true);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.onreadystatechange = function () {
        if (request.readyState !== 4) return;
        if (request.status == '200') {
            if (typeof callback === 'function') {
                callback({
                    request: null,
                    response: request.responseURL,
                }, request.status);
            }
        }
        else if(request.status == '401') window.location.href = "401";
        else if(request.status == '403') window.location.href = "403";
        else if(request.status == '404') window.location.href = "404";
        else {
            callback(null, {
                request: null,
                response: request.responseText,
            }, request.status);
        }
    }
    if (Array.isArray(headers) && headers.length > 0) {
        for(const header of headers) {
            request.setRequestHeader(header.key, header.value);
        }
    }
    request.send();
}

// JSON 변환
function parseJson(text) {
    var res;
    try {
        res = JSON.parse(text);
    } catch(e) {
        console.log(e);
        // console.log('text', text);
    }
    return res;
}
