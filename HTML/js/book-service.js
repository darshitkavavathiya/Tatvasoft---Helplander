
function set_service(evt, level) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
     for (i = 0; i < tablinks.length; i++) {
         tablinks[i].className = tablinks[i].className.replace(" active", "");
     }
    document.getElementById(level).style.display = "block";
    evt.currentTarget.className += " active";
}
document.getElementById("defaultOpen").click();





function extrabtnclick(id,i){

    
    if(document.getElementById(id).checked){
        document.getElementById(id+"Img").src=("assets/"+i+"-green.png");
        document.getElementById("extra" + i).style.display = "block";

        var total_time = parseFloat(document.getElementById("total_hours").innerHTML);
        document.getElementById("total_hours").innerHTML= total_time+0.5;
        
       
    
      

      
    }else{
        document.getElementById(id+"Img").src=("assets/"+i+".png");
        document.getElementById("extra" + i).style.display = "none";
        var total_time = parseFloat(document.getElementById("total_hours").innerHTML);
        document.getElementById("total_hours").innerHTML= total_time-0.5;
    }
}
