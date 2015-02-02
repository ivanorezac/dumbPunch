var debug = 0;
var smileyCount, score, smileyAlive, smileyDimension = 30, time = 45, scoreUpdateInterval, createSmileyInterval, 
gameOver, screenHeight, screenWidth, smileySpawnTime; // seconds

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
	smileyCount = 0;
	score = 0;
	smileyAlive = 0;
	time = 45;
	gameOver = 0;
	smileySpawnTime = 0.5;
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
			$('#score').html('Too many smileys escaped!<br>Your score:'+score);
			gameOver = 1;
			$('.restart').fadeIn('slow');
			$('.restart').click(function() {
				location.reload();
			});
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
		$('#missed'+id).click(function() {
			time-=5;
			var y = $('#missed'+id).offset().top;
			var x = $('#missed'+id).offset().left;
			$('#missed'+id).remove();
			var smileyMiss = $("<img id='missed"+id+"' src='blood.png' style='width:"+smileyDimension+"px; position:absolute; top: "+y+"px; left: "+x+"px;' />");
			$("body").append(smileyMiss);
			navigator.notification.vibrate(150);
		});
		setTimeout(function() {
			$('#missed'+id).remove();
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
	$('.fps').css({bottom: 40, right: 80});
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