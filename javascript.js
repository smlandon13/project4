var closeCourses;
var numplayers = 4;
var numholes = 18;


var testCourse ={};
var golfxhttp = new XMLHttpRequest();
var local_obj = {latitude: 40.4426135,longitude: -111.8631116,radius: 100};

function loadMe() {
    $.post("https://golf-courses-api.herokuapp.com/courses",local_obj,function(data,status) {
        closeCourses = JSON.parse(data);
        for (var p in closeCourses.courses){
            var selectdisplay = "<option value='"+ closeCourses.courses[p].id +"'>" + closeCourses.courses[p].name +"</option>";
            $("#selectCourse").append(selectdisplay);
        }

    });

function getCourseInfo(id) {
    golfxhttp = new XMLHttpRequest;
    golfxhttp.onreadystatechange = function() {
        if (golfxhttp.readyState == 4 && golfxhttp.status == 200) {
            testCourse = JSON.parse(golfxhttp.responseText);
            $("#golfcourselabel").html(testCourse.course.name);
            gettheWeather(testCourse.course.city);
            for(var t = 0; t < (testCourse.course.holes[0].tee_boxes.length - 1); t++){
                var teeboxdisplay = "<option value='" + t + "'>"+ testCourse.course.holes[0].tee_boxes[t].tee_type +"</option>";
                $("#selectTeebox").append(teeboxdisplay);
            }

        }
    };
    golfxhttp.open("GET","http://golf-courses-api.herokuapp.com/" + id,true);
    golfxhttp.send();

}

function setCourseInfo(teeboxid){
    buildcard(teeboxid);
}


function fullconverter(k){
    var toc = +k - 273.15;
    var tof = toc * 9/5 + 32;
    return Math.round(tof);
}

function buildcard(theteeboxid){
    var holecollection = "";
    var playercollection = "";
    var grandtotalcollection = "";

    for(var pl = 1; pl <= numplayers; pl++ ){
        playercollection += "<div id='player" + pl +"' class='holebox playerbox'> Player " + pl + " <span onclick='deleteplayer("+ pl +")' class='deletebtn glyphicon glyphicon-minus-sign'></span></div>";
        grandtotalcollection += "<div id='grand" + pl +"' class='holebox'>0</div>";
    }

    for(var c = numholes; c >= 1; c-- ){
        var adjusthole = c - 1;
        holecollection += "<div id='column" + c  +"' class='holecol'><div class='holenumbertitle'>" +  c  + "<div>par " + testCourse.course.holes[adjusthole].tee_boxes[theteeboxid].par + "</div></div></div>";
    }

    $("#leftcard").html(playercollection);
    $("#rightcard").html( ("<div class='holecol totalcol'><div class='totalheader'>total</div>" + grandtotalcollection + "</div>")  + holecollection );

    buildholes();

}

function buildholes() {
    for(var p = 1; p <= numplayers; p++ ){
        for(var h = 1; h <= numholes; h++){
            $("#column" + h).append("<input onkeyup='calculatescore(" + p +")' id='player" + p +"hole" + h +"' class='holebox'/>");
        }
    }
}

function calculatescore(theplayer){
    var thetotal = 0;
    for(var t = 1; t <= numholes; t++){
        thetotal += Number($("#player" + theplayer + "hole" + t).val());
    }
    $("#grand" + theplayer).html(thetotal);
}

function deleteplayer(playerid){
    $("#player" + playerid).remove();
    $("#grand" + playerid).remove();
    for(var p = 1; p <= numholes; p++){
        $("#player" + playerid + "hole" + p).remove();
    }
}

function addplayer(){
    var parentlength = $('#leftcard').children().size();

    var bignum;

    for(var l = 1; l <= parentlength; l++){
        var grabid = $("#leftcard :nth-child(" + l + ")").attr("id");
        var idsplit = grabid.split("player");
        console.log(idsplit);
        bignum = Number(idsplit[1]);
    }
    var adjnum = bignum + 1;
    $("#leftcard").append("<div id='player" + adjnum +"' class='holebox playerbox'> Player "+ adjnum +" <span onclick='deleteplayer("+ adjnum+")' class='deletebtn glyphicon glyphicon-minus-sign'></span></div>");
    for(var h = 1; h <= numholes; h++){
        $("#column" + h).append("<input onkeyup='calculatescore(" + adjnum +")' id='player" + adjnum +"hole" + h +"' class='holebox'/>");
    }
    $(".totalcol").append("<div id='grand" + adjnum +"' class='holebox'>0</div>");

}
