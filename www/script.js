var debug = 1;
var smileyCount, score, smileyAlive, smileyDimension = 30, time = 45, scoreUpdateInterval, createSmileyInterval, 
gameOver, screenHeight, screenWidth, smileySpawnTime, fileSystem; // seconds

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
	time = 1;
	gameOver = 0;
	smileySpawnTime = 0.3;
	gameTime();
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, function() { console.log(error.code); });
}

function onFileSystemSuccess(FS) {
	fileSystem = FS;
	console.log("File system name:"+fileSystem.name+". Root entry name is:"+fileSystem.root.name+".");
	fileSystem.root.getFile("test.txt", {create:true}, appendFile, function() { console.log(error.code); });
	fileSystem.root.createreader().readEntries(gotFiles, function() {console.log(error.code); });
	fileSystem.root.getFile("test.txt", {create:true}, readFile, function() { console.log(error.code); });
}

function readFile(f) {
	reader = new FileReader();
	reader.onLoadend = function(e) {
		console.log('e.target.resault: '+e.target.resault+" \n ");
	}
	reader.readAsText(f);
}

function appendFile(f) {
	f.createWriter(function(writerOb) {
		writerOb.onWrite=function() {
			console.log('wrote');
		}
		writerOb.seek(writerOb.length);
		writerOb.write("Working m8\n");
	});
}

function gotFiles(entries) {
	var s = "";
	for(var i=0, len=entries.length; i<len; i++) {
		s+=entries[i].fullPath;
		if(entries[i].isFile) {
			s+=" [F]";
		} else {
			s+=" [D]";
		}
		s+="\n";
	}
	console.log(s);
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
			setScoreBoardIconSize();
			$('#your-score').text(score);
			gameOver = 1;
			$('#score').toggle();
			$('.scoreReport').fadeIn('slow');
			$('#restart').click(function() {
				location.reload();
			});
		}
	}
}
function updateScoreBoard() {
	if(gameOver == 0) {
		$('#score').text(score);
	}
}

function gameTime() {
	var color = Math.ceil(Math.random()*5)
	if(color == 1) {
		$('body').css({backgroundColor: '#820101'});
	} else if(color == 2) {
		$('body').css({backgroundColor: '#826401'});
	} else if(color == 3) {
		$('body').css({backgroundColor: '#016A82'});
	} else if(color == 4) {
		$('body').css({backgroundColor: '#01826A'});
	} else {
		$('body').css({backgroundColor: '#018206'});
	}
}
function updateScore(amount) {
	score += amount;
	updateScoreBoard();
}
function createSmiley() {
	smileyCount++;
	smileyAlive++;
	var smiley = $("<img id='smiley"+smileyCount+"' class='smiley' src='smiley.png' style='width:"+smileyDimension+"px; position:absolute; top: "+smileyRandomHeight()+"px; left: "+smileyRandomWidth()+"px;' />");
	$("body").append(smiley);
	var missedTimeout = setTimeout(missed,(5000), smileyCount);
	smiley.click(function() {
		updateScore(1);
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
	createSmileyInterval = setTimeout(createSmiley,smileySpawnTime*1000);
}
function missed(id) {
	if(gameOver == 0) {
		time=0;
		updateTime();
	}
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

function setScoreBoardIconSize() {
	$('.scoreReport img').height(smileyDimension);
	$('#restart').height(smileyDimension*2);
}