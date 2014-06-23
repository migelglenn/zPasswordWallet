//https://api.twitter.com/1.1/search/tweets.json?q=%40azkals
var data = null;
var counter = null;
$(function(){
    init();
    showNavs(false);
    $('input[type="text"],input[type="password"],button').button();
    $('div#controls,div#navs').buttonset();
    $('button#search').click(function(e){
        e.preventDefault();
        init();
        showNavs(true);
        doSearch();
    });
    $('button#next').click(function(e){
        e.preventDefault();
        doNext();
    });
    $('button#prev').click(function(e){
        e.preventDefault();
        doPrev();
    });
    $('button#edit').click(function(e){
        e.preventDefault();
        init();        
        populate();
        showNavs(true);
        doEdit();
    });
    $('button#add').click(function(e){
        e.preventDefault();
        showNavs(false);
        doAdd();
    });
    $('button#cancel').click(function(e){
        e.preventDefault();
        init();
        populate();
        showNavs(true);
    });
    $('button#submit').click(function(e){
        e.preventDefault();
        doSubmit();
        showNavs(true);
    });
    $('input#check').click(function(e){
        //e.preventDefault();
        doTogglePass();
    });
    $('button#send').click(function(e){
        e.preventDefault();
        alert('Send');
        var txt = $('#text').val(); 
        var $token = 'OAuth oauth_consumer_key="BFEh0pYj8USvTZdOOYNHV6MC8"';
        alert(txt);
    });
});
function init(){
    $('input','#connect').prop("readonly",true);
    $('input','#connect').css("color","");
    $('tr#trId,tr#trSeq,tr#trHint').toggle(false);
    
}
function doSearch(index){
    $.ajax({
        url: "https://api.appery.io/rest/1/db/collections/site",
        type: "GET",
        dataType: "json",
        beforeSend: function(xhr){
            xhr.setRequestHeader("X-Appery-Database-Id", "53236b30e4b04c7170e360e1")
        },
        success: function(json){
            //alert("Request Success!");
            console.log(json);
            doSuccess(json, index);
        },
        error: function(xhr, status, error){
            alert("Request error!");
            console.log("Error:" + error);
            console.log("Status:" + status);
            console.dir(xhr);
        },
        complete: function(xhr, status){
            //alert("Request complete.");
            console.log(xhr);                
        }
    });
}
function doSuccess(json, index){
    data = json;
    if(index){
        counter = index;
    }else{
        counter = 0;
    }    
    populate();
}
function populate(){
    $('#_id').val(data[counter]._id);
    $('#site').val(data[counter].site);
    $('#username').val(data[counter].user_id);
    $('#password').val(data[counter].password);
    $('#hint').val(data[counter].hint);
    $('#seq').val(data[counter].sequence);
}
function showNavs(toggle){
    $('tr#navs').toggle(toggle);
}
function doTogglePass(){
    var $pwd = $('#password');
    var type = $pwd.attr("type");
    if(type == "password"){
        $pwd.attr("type","text");
    }else{
        $pwd.attr("type","password");
    }
}
function doNext(){
    if(data){
        var len = data.length;
        if(++counter >= len) {
            counter = 0;
        }
        populate();
    }
}
function doPrev(){
    if(data){
        var len = data.length;
        if(--counter < 0){
            counter = len - 1;
        }
        populate();
    }
}
function doEdit(){
    $('input[type="text"],input[type="password"]','#connect').css("color","green");
    $('input','#connect').prop("readonly",false);
}
function doAdd(){
    doEdit();
    $('input[type="text"],input[type="password"]','#connect').val("");
    $('input#seq').prop("readonly",true);
    $('input#seq').css("color","");
    $('tr#trSeq,tr#trHint').toggle(true);
    if(data){
        $('#_id').val("");
        $('#seq').val(data.length + 1);
    }
}
function doSubmit(){
    var objId = $('#_id').val();
    var site = $('#site').val();
    var user = $('#username').val();
    var pass = $('#password').val();
    var hint = $('#hint').val();
    var seq = $('#seq').val();
    var str = {"site": site, "user_id": user, "password": pass, "hint": hint, "sequence": seq};
    var payload = JSON.stringify(str);
    var type = (objId != "") ? "PUT" : "POST";
    $.ajax({
        url: "https://api.appery.io/rest/1/db/collections/site/" + objId,
        type: type,
        dataType: "json",
        data: payload,
        beforeSend: function(xhr){
            xhr.setRequestHeader("X-Appery-Database-Id", "53236b30e4b04c7170e360e1");
            xhr.setRequestHeader("Content-Type","application/json");
        },
        success: function(json){
            console.log(json);
            init();
            doSearch(counter);
        },
        error: function(xhr, status, error){
            alert("Request error!");
            console.log("Error:" + error);
            console.log("Status:" + status);
            console.dir(xhr);
        },
        complete: function(xhr, status){
            console.log(xhr);            
        }
    });
}