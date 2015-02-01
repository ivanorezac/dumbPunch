var debug = 0;
var smileyCount = 0;
var score = 0;
var smileyAlive = 0;
var smileyDimension = 30;
var time = 45;
var scoreUpdateInterval, createSmileyInterval;
var gameOver = 0;
var screenHeight, screenWidth;
var smileySpawnTime = 0.5; // seconds

function onLoad() {
	var attachFastClick = Origami.fastclick;
	attachFastClick(document.body);
    document.addEventListener("deviceready", onDeviceReady, false);
    if(debug) {
    	onDeviceReady();
    	$('.score').text('debugging');
    }
    countFps();
}
function onDeviceReady() {
    document.addEventListener("menubutton", doNothing, false);
	document.addEventListener("backbutton", doNothing, false);
	setSmileySize();
	createSmileyInterval = setTimeout(createSmiley,smileySpawnTime*1000);
	scoreUpdateInterval = setTimeout(updateTime,1000);
	console.log(navigator.vibrate);
}
function updateTime() {
	if(gameOver == 0) {
		updateScoreBoard();
		scoreUpdateInterval = setTimeout(updateTime,1000);
		if(time < 1) {
			clearTimeout(scoreUpdateInterval);
			clearTimeout(createSmileyInterval);
			$('.smiley').remove();
			$('.missedSmiley').remove();
			$('.scoreChange').toggle();
			$('#score').text('Game over! You ran out of time!');
			gameOver = 1;
		}
	}
}
function updateScoreBoard() {
	if(gameOver == 0) {
		$('#score').text(score);
		gameTime();
	}
}

function gameTime() {
	if(time < 20) {
		$('body').css({backgroundColor: '#b50000'})
	} else if(time < 40) {
		$('body').css({backgroundColor: '#af9e03'})
	} else if(time < 60) {
		$('body').css({backgroundColor: '#2d4558'})
	} else if(time < 80) {
		$('body').css({backgroundColor: '#0a7548'})
	} else {
		$('body').css({backgroundColor: '#027f00'})
	}
}
function updateScore(amount) {
	score += amount;
	updateScoreBoard();
		plusSign = '';
	if(amount > 0) {
		plusSign = '+';
	}
	var changeElement = $("<div class='changeElement'>"+plusSign+amount+"</div><br />");
	$(".scoreChange").append(changeElement);
	setTimeout(function() {
		changeElement.slideUp( "slow", function() {
		    changeElement.remove();
		  });
	},1500);
}
function createSmiley() {
	smileyCount++;
	smileyAlive++;
	var smiley = $("<img id='smiley"+smileyCount+"' class='smiley' src='smiley.png' style='width:"+smileyDimension+"px; position:absolute; top: "+smileyRandomHeight()+"px; left: "+smileyRandomWidth()+"px;' />");
	$("body").append(smiley);
	var missedTimeout = setTimeout(missed,(5000), smileyCount);
	smiley.click(function() {
		updateScore(1);
		time+=1;
		smileyAlive--;
		clearTimeout(missedTimeout);
		$(this).animate({
		    opacity: 0.25,
		    left: "+=50",
		    height: "toggle"
		  }, 400, function() {
		    $(this).remove();
		  });
	});
	createSmileyInterval = setTimeout(createSmiley,Math.abs(smileySpawnTime*1000-time*5)+100);
}
function missed(id) {
	if(gameOver == 0) {
		time-=5;
		var y = $("#smiley"+id).offset().top;
		var x = $("#smiley"+id).offset().left;
		$("#smiley"+id).remove();
		var smileyMiss = $("<img id='missed"+id+"' class='missedSmiley' src='smileyMiss.png' style='width:"+smileyDimension+"px; position:absolute; top: "+y+"px; left: "+x+"px;' />");
		$("body").append(smileyMiss);
		$('#missed'+id).addClass('rotate');
		$('#missed'+id).click(function() {
			time-=5;
			console.log('error?');
			navigator.notification.vibrate(1000);
			console.log('no');
			smileyMiss.attr('src','blood.png');
			smileyMiss.removeClass('missedSmiley');
		});
		setTimeout(function() {
			smileyMiss.remove();
		},3000);
	}
}
function removeMissed(id) {
	$('#smiley'+id).remove();
}
function smileyRandomHeight() {
	return Math.round(Math.abs(Math.random()*(screenHeight)-smileyDimension));
}
function smileyRandomWidth() {
	return Math.round(Math.abs(Math.random()*(screenWidth)-smileyDimension));
}
function getScreenSize() {
	screenHeight = $(window).height();
	screenWidth = $(window).width();
}
function setSmileySize() {
	getScreenSize();
	smileyDimension = screenHeight/8;
	if(smileyDimension > screenWidth/8) {
		smileyDimension = screenWidth/8;
	}
}
$( window ).resize(function() {getScreenSize(); setSmileySize();});
function doNothing() {}


//fps:

function countFps() {
	getScreenSize();
	$('.fps').css({top: screenHeight-40, left: screenWidth-80});
	gameLoop();
}

var fps = {
	startTime : 0,
	frameNumber : 0,
	getFPS : function(){
		this.frameNumber++;
		var d = new Date().getTime(),
			currentTime = ( d - this.startTime ) / 1000,
			result = Math.floor( ( this.frameNumber / currentTime ) );

		if( currentTime > 1 ){
			this.startTime = new Date().getTime();
			this.frameNumber = 0;
		}
		return result;

	}	
};

function gameLoop(){
	setTimeout( gameLoop,1000 / 60 );
	document.querySelector("#fps").innerHTML = fps.getFPS();
}