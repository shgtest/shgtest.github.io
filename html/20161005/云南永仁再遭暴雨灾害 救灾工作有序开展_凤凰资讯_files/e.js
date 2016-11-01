ac_iteraction = window.ac_iteraction||0;
_ac_ejs_url = window._ac_ejs_url||"../JS/original_e.js";
if(++ac_iteraction<5){
    document.write('<script type="text/javascript" src="'+_ac_ejs_url+'"><\/script>');
}else{
    document.write("<\/div>");
    ac_iteraction = 0;
    ac_e_callback();
}
