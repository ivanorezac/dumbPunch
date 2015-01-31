var debug = 1;
var smileyCount = 0;
var score = 0;
var smileyAlive = 0;
var smileyDimension = 30;
var time = 45;
var scoreUpdateInterval, createSmileyInterval;
var gameOver = 0;
var screenHeight, screenWidth;
var smileySpawnTime = 0.85; // seconds

function onLoad() {
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
		$(this).fadeOut(200, function() { $(this).remove(); }); //toggle('explode'); $(this).remove();
		updateScore(1);
		time+=2;
		smileyAlive--;
		clearTimeout(missedTimeout);
	});
	createSmileyInterval = setTimeout(createSmiley,smileySpawnTime*1000);
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
		smileyMiss.click(function() {
			time-=3;
			//vibrate here;
			smileyMiss.attr('src','blood.png');
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
	var height = Math.round(Math.abs(Math.random()*(screenHeight)-smileyDimension));
	console.log(height);
	return height;
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