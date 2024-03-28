var special_text = ["@","$","!","%","*","#","?","&"];
let reset_pass = "";

function resetPassword(){
    let str = '';
    let str2 = '';

    console.log("--- resetPassword() ---");

    for (let i = 0; i < 4; i++) str += Math.floor(Math.random() * 10)

    str2 = special_text[Math.floor(Math.random()*special_text.length)]

    reset_pass = 'math' + str + str2;
    console.log(reset_pass);

    document.getElementById("reset_pass").value  = reset_pass;
}

function resetPassword(id){
    console.log("--- resetPassword("+id+") ---");
    let str = '';
    let str2 = '';

    for (let i = 0; i < 4; i++) str += Math.floor(Math.random() * 10)

    str2 = special_text[Math.floor(Math.random()*special_text.length)]

    reset_pass = 'math' + str + str2;
    console.log(reset_pass);

    if(document.getElementById("input"+id)) document.getElementById("input"+id).value  = reset_pass;
    else document.getElementById("reset_pass").value  = reset_pass;
}