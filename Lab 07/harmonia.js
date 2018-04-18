document.onreadystatechange = function () {
    if (document.readyState === "interactive") {
      allbd = document.querySelectorAll(".bd");
      allbd.forEach(function(element) {
        element.hidden = true;
    });
    showClick = function(element){
      element.onclick = function(){
        var bd = element.nextElementSibling;
          if(bd.hidden === true){
            bd.hidden = false;
          }
          else{
            bd.hidden = true;
          }
      };
    };
    showMouseOver = function(element){
      element.onmouseover = function(){
        var bd = element.nextElementSibling;
        bd.hidden = false;
      };
    };
    showMouseOut = function(element){
      element.onmouseout = function(){
        var bd = element.nextElementSibling;
        bd.hidden = true;
      };
    };
    allhd = document.querySelectorAll(".hd");
    allhd.forEach(function(element) {
      showClick(element);
      showMouseOver(element);
      showMouseOut(element);
    });
  }
};