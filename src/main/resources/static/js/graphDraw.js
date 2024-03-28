// document.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/latest.js?config=TeX-MML-AM_CHTML"></script>');
// document.write('<script type="text/x-mathjax-config">MathJax.Hub.Config({tex2jax: {inlineMath: [[\'$\',\'$\'], [\'\\\\(\',\'\\\\)\']]}});</script>');

let tests_list = [];
let graphChecked = false;

//cookie 가져오기기
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? unescape(matches[1]) : undefined;
}

//파라미터 받기
function getParameter(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

document.getElementById("view_graph").onclick = function() {
    // getCookie 호출
    var orgId = getCookie('orgId');

//학생 접근 || 선생님 접근
    if(location.href.includes("T_sdetail") || location.href.includes("O_sdetail")){
        // getParameter 호출
        var userId = getParameter("user_id");
        var userGrd = getParameter("user_grd");
        var userTestGrd = document.getElementById("userTestGrd").innerText;

        if(userTestGrd.includes("-")) {
            let split = userTestGrd.split("");
            userTestGrd = split[0].replace("초","E").replace("중","M").replace("고","H")+split[1]+split[3];
            console.log(userTestGrd)
        }else userTestGrd = userTestGrd.replace("초","E").replace("중","M").replace("고","H");
    }else{
        //getCookie
        var userId = getCookie('userId');
        var userGrd = getCookie('userGrd');
        var userTestGrd = getCookie('userTestGrd');
    }

// 그래프 호출 data
    const graphData = {
        org_id: orgId,
        user_id: userId,
        user_grd:userGrd,
        user_test_grd:userTestGrd
    };

    let edges_list = [];
    let nodes_list = [];
    let option;

    console.log("graphDraw.js")

    if(!graphChecked){
        //graphDraw API 호출
        API.student.graph({data: graphData}, function(result) {
            console.log("graph API  ",result)
            if(result.rsp_code==200){
                const resultData = result.result;

                nodes_list = resultData.final_path.nodes;
                //tests_list = testResult.final_path.nodes;
                edges_list = resultData.final_path.edges;
                option = JSON.parse(resultData.final_path.options);

                // create an array with nodes
                var nodes = new vis.DataSet(nodes_list);

                // create an array with edges
                var edges = new vis.DataSet(edges_list);


                // create a network
                var container = document.getElementById("graph_area");
                var data = {
                    nodes: nodes,
                    edges: edges,
                };
                var options = option;

                var network = new vis.Network(container, data, options);

                network.once("stabilizationIterationsDone", function () {
                    document.getElementById("loadingBar").style.display = "none";
                    // really clean the dom element
                    // setTimeout(function () {
                    //     document.getElementById("loadingBar").style.display = "none";
                    // }, 500);
                });

                console.log("nodes  ", nodes);
                console.log("edges  ", edges);
                console.log("options  ", options);
                graphChecked = true;
            }
            else if(loadResult.rsp_code==401) window.location.href("401");
            else if(loadResult.rsp_code==403) window.location.href("403");
            else if(loadResult.rsp_code==404) window.location.href("404");
            else if(loadResult.rsp_code==500) window.location.href("500");

        })
    }



    document.getElementById('graph').style.right="0";
    document.getElementById('test_area').style.display = "none";
    document.getElementById('graph_area').style.display = "block";
    document.getElementById('modal_bg').style.display="block";

    if(document.getElementById('answer') && document.getElementById('T_graph')){
        document.getElementById('answer').style.right = "-260px";
        document.getElementById('T_graph').style.right="-60vw";
    }
}
