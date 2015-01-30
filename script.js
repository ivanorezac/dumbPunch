var debug = 1;
var smileyCount = 0;
var score = 0;
var smileyAlive = 0;
var smileyDimension = 30;
var time = 20;
var scoreUpdateInterval, createSmileyInterval;
var gameOver = 0;
var screenHeight, screenWidth;
var smileySpawnTime = 2.3; // seconds

function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
    if(debug) onDeviceReady();
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
		time--;
		updateScoreBoard();
		scoreUpdateInterval = setTimeout(updateTime,1000);
		if(time < 1) {
			clearTimeout(scoreUpdateInterval);
			clearTimeout(createSmileyInterval);
			$('.smiley').remove();
			$('.scoreChange').toggle();
			$('#score').text('Game over! You ran out of time!');
			gameOver = 1;
		}
	}
}
function updateScoreBoard() {
	if(gameOver == 0) {
		$('#score').text(time+'s ('+score+')');
	}
}
function updateScore(amount) {
	score += amount;
	updateScoreBoard();
	if(amount > 0) {
		plusSign = '+';
	} else {
		plusSign = '';
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
	var smiley = $("<img id='smiley"+smileyCount+"' class='smiley smiley-rotate' src='smiley.png' style='width:"+smileyDimension+"px; position:absolute; top: "+smileyRandomHeight()+"px; left: "+smileyRandomWidth()+"px;' />");
	$("body").append(smiley);
	var missedTimeout = setTimeout(missed,(5000), smileyCount);
	smiley.click(function() {
		$(this).toggle( "explode" );
		updateScore(15);
		time+=2;
		smileyAlive--;
		clearTimeout(missedTimeout);
		$(this).remove();
	});
	createSmileyInterval = setTimeout(createSmiley,smileySpawnTime*1000);
}
function missed(id) {
	if(gameOver == 0) {
		updateScore(-10);
		var y = $("#smiley"+id).offset().top;
		var x = $("#smiley"+id).offset().left;
		$("#smiley"+id).remove();
		var smileyMiss = $("<img id='missed"+id+"' class='smiley missed-rotate' src='smileyMiss.png' style='width:"+smileyDimension+"px; position:absolute; top: "+y+"px; left: "+x+"px;' />");
		$("body").append(smileyMiss);
		$('#missed'+id).addClass('rotate');
		smileyMiss.click(function() {
			updateScore(-30);
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
	smileyDimension = screenHeight/20;
	if(smileyDimension > screenWidth/20) {
		smileyDimension = screenWidth/20;
	}
}
$( window ).resize(function() {getScreenSize(); setSmileySize();});
function doNothing() {}