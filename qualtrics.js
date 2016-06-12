Qualtrics.SurveyEngine.addOnload(function()
{
    debugger;
    this.disableNextButton();
    this.hideNextButton();
    /*Place Your Javascript Below This Line*/
//document.body.innerHTML = "";
    var src1 = "https://code.jquery.com/jquery-1.10.2.js", src2 = "https://code.jquery.com/ui/1.11.4/jquery-ui.js";
    window.mainDataObj = this;
    var inittrials = function(){
        document.createElement("div");
        dvAttempts.style.position = 'absolute';
        dvAttempts.style.right = '70px';
        dvAttempts.style.top = '100px';
        dvAttempts.style.backgroundColor = 'black';
        dvAttempts.style.color = 'white';
        dvAttempts.setAttribute('id', 'Attempts_numberinthegame');
        document.body.appendChild(dvAttempts);
        dvAttempts.className= 'attempts';
        $('.attempts').show();
    }
    var dvAttempts = inittrials();
    appendScript(src1, function(){
        appendScript(src2, function(){
            main();
        });
    });

});

function appendScript(src, callback){
    var sc = document.createElement("script");
    sc.src = src;
    document.body.appendChild(sc);
    sc.onload = callback;
}
function main(){
    var COUNT = 11; //(window.prompt("enter number of attempts", "10")*1 || 10)  + 1;
    var TOTALCOUNT = COUNT - 1 ;
    var wrongAttempts = 0;
    var correctAttempts = 0;
    var correctAttemptMouse = 0;
    var correctAttemptKeyboard = 0;
    var wrongAttemptMouse = 0;
    var wrongAttemptKeyboard = 0;
    var startTime = 0;
    var map = {};
    var keyData = [];
    var WIDTH = window.innerWidth;
    var HEIGHT = window.innerHeight;
    function placeSingleNum(x1,x2,y1,y2){
        var dv = document.createElement("dv");
        dv.style.position = 'absolute';
        dv.style.width = dv.style.height = '30px';
        var left =  (x1 + Math.floor((Math.random()*(x2-x1))) ) + 'px';
        var top =   (y1 + Math.floor((Math.random()*(y2-y1))) ) + 'px';
        dv.style.left = left;
        dv.style.top =  top;
        dv.innerText = Math.floor(Math.random() * 9);
        dv.style.backgroundColor = 'DarkCyan';
        dv.style.color = 'white';
        dv.style.cursor = 'pointer';
        dv.style.align = 'center';
        dv.style['line-height'] = '30px'
        document.body.appendChild(dv);
        dv.className = 'draggable';
        $(dv).data("left", left).data("top", top);
        return dv;
    }
    function createNum(){
        map[COUNT].style.display = 'block';
    }
    function init(){
        for(var i=0;i<=COUNT;i++){
            var dv = placeSingleNum(120, WIDTH-70, 120, 400);
            map[i] = dv;
            dv.style.display = 'none';
        }
        var dvTimer = document.createElement("div");
        dvTimer.style.position = 'absolute';
        dvTimer.style.right = '70px';
        dvTimer.style.top = '70px';
        dvTimer.style.backgroundColor = 'black';
        dvTimer.style.color = 'white';
        dvTimer.setAttribute('id', 'timer_numberinthegame');
        document.body.appendChild(dvTimer);
        var ct = 0;
        setInterval(function(){
            ct++;
            dvTimer.innerText = "Time Elapsed: " +secondstotime(180-ct);
            //end survey if 3 mins have passed
            if(ct > 3*60){
               window.mainDataObj.clickNextButton(); 
            }
        }, 1000);

    }
	function cleartrials()
	{
	    $('.attempts').hide();
	}
    function secondstotime(secs) {
        var t = new Date(1970,0,1);
        t.setSeconds(secs);
        var s = t.toTimeString().substr(0,8);
        if(secs > 86399)
            s = Math.floor((t - Date.parse("1/1/70")) / 3600000) + s.substr(2);
        return s;
    }
    function intersects(a,b){
        var rect1= a.getBoundingClientRect();
        var rect2 = b.getBoundingClientRect();
        return !(rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom)
    }
    function correct(dv){
        var index = dv.innerText;
        //alert(index + " put into correct basket");
        dv.style.display = 'none';
        correctAttempts ++;
        var trials = TOTALCOUNT - correctAttempts;
        dvAttempts.innerText = "Trials left: " + trials.toString();


    }
    function wrong(dv){
        var index = dv.innerText;
        alert(index + " put into wrong basket");
        dv.style.left = $(dv).data("left");
        dv.style.top = $(dv).data("top");
        wrongAttempts ++;
    }
    function checkIntersections(){
        $(".draggable:visible").each(function(){
            var dv = this;
            var index = dv.innerText * 1;
            var basket = $("#"+"i"+index)[0];
            if(intersects(dv, basket)){
                correct(dv);
                dvAttempts.innerText = "Its done";
                keyData.push('correct attempt ' + dv.innerText + ": by mouse" );
                correctAttemptMouse ++;
            }
            for(var i=0;i<=9 ; i++){

                if(i === index){
                    continue;
                }
                var otherBasket = $("#i"+i)[0];
                if(intersects(dv, otherBasket)){
                    wrong(dv);
                    keyData.push('wrong attempt '+dv.innerText + ": by mouse" );
                    wrongAttemptMouse ++;
                    break;
                }
            }
        });
//correctOutOfBounds($(".draggable:visible")[0]);
        if(isEmpty()){
            COUNT --;
            if(COUNT <= 0 ){
                clearInterval(interval);
   			cleartrials();
                printStats();
            } else {
                createNum();
            }
        }

    }
    function correctOutOfBounds(dv){
        if(!dv) return;
        if(dv.style.top > window.innerHeight){
            dv.style.top = (window.innerHeight - 10)+'px';
        }
        if(dv.style.left > window.innerWidth){
            dv.style.left = (window.innerWidth -10)+'px';
        }
    }
    function isEmpty(){
        return $(".draggable:visible").length === 0;
    }
    function printStats(){
        var res = "GAME OVER. stats\nTotal balls : "+TOTALCOUNT+"\nTotal attempts : "+(correctAttempts + wrongAttempts)+"\nCorrect Attempts : "+correctAttempts+"\nWrong Attempts : "+wrongAttempts;
        res += "\nTime Taken : "+(Date.now() - startTime)/1000+" seconds";
        res += "\ndata about method\n";
        var res2 = "";
        keyData.forEach(function(s){
            res2 += s + "    ";
        });
        var data = JSON.stringify(res);
        var timeTaken = (Date.now() - startTime)/1000;
        setData('keydata', res2);
        setData('total_balls',TOTALCOUNT);
        setData('total_attempts',correctAttempts + wrongAttempts);
        setData('correct_attempts', correctAttempts);
        setData('wrong_attempts', wrongAttempts);
        setData('time_taken', timeTaken);

        setData('mouse_attempt_total', wrongAttemptMouse + correctAttemptMouse);
        setData('mouse_attempt_correct', correctAttemptMouse);
        setData('mouse_attempt_wrong', wrongAttemptMouse);

        setData('keyboard_attempt_total', wrongAttemptKeyboard + correctAttemptKeyboard);
        setData('keyboard_attempt_correct', correctAttemptKeyboard);
        setData('keyboard_attempt_wrong', wrongAttemptKeyboard);
        $('#timer_numberinthegame').css('display', 'none');
        //Qualtrics.SurveyEngine.clickNextButton();
        //$('#NextButton').click();
        window.mainDataObj.clickNextButton();
    }
    function setData(name, value){
        Qualtrics.SurveyEngine.addEmbeddedData(name, value);
        Qualtrics.SurveyEngine.setEmbeddedData(name, value);
        Qualtrics.SurveyEngine.getEmbeddedData('numberGenRes');
    }
    init();
   $( ".draggable" ).draggable();
    $("td").css('width', WIDTH/11).css('height', HEIGHT/10);
    $("#baskets").css("position","absolute").css("top","450px").css("left", '-2px');
    var interval = setInterval(checkIntersections, 5);
    startTime = Date.now();
//keyboard detection
    $( "body" ).keydown(function(e) {
		var modifier = e.ctrlKey || e.metaKey;
        if( modifier && e.shiftKey && e.altKey){
			 
            var key = e.keyCode;
            if(key >= 47 && key <= 57){
                key -= 48;
                var dv = $('.draggable:visible')[0];
                if(dv.innerText*1 === key){
                    dv.style.left = $('#i'+key).offset().left;
                    dv.style.top = $('#i'+key).offset().top;
                    correct(dv);
                    correctAttemptKeyboard ++;
                    keyData.push('correct attempt '+dv.innerText + ": by keyboard" );
                } else {
                    wrong(dv);
                    wrongAttemptKeyboard ++;
                    keyData.push('wrong attempt '+dv.innerText + ": by keyboard" );
                }
                e.preventDefault();
            }
        }

    });
}