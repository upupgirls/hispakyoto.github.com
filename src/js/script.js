//スマホの占い
function $(e){ return document.getElementById(e);}

$("startBtn").onclick = random;


function random(){
  ransu = Math.floor(Math.random()*10);
  var uranai = $('uranai');

  if(ransu<=6){
    uranai.innerHTML = "<p class=\"ichiban\">一番<br />ついてるかも！</p> <img src=\"images/image_20151002145726.jpg\">";
  }else {
    uranai.innerHTML = "<p class=\"busu\">ブス</p><img src=\"images/image_20151002145259.jpg\">";
  }
  return false;
}
