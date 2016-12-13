const soundcloud = require('soundcloud-badge')
const events = require('./events')

let Music = function() {
	let waveData = []; //waveform - from 0 - 1 . no sound is 0.5. Array [binCount]
	let levelsData = []; //levels of each frequecy - from 0 - 1 . no sound is 0. Array [levelsCount]
	let level = 0; // averaged normalized level from 0 - 1
	let bpmTime = 0; // bpmTime ranges from 0 to 1. 0 = on beat. Based on tap bpm
	let ratedBPMTime = 550;//time between beats (msec) multiplied by BPMRate
	let levelHistory = []; //last 256 ave norm levels
	let bpmStart = Date.now();
	let beatCount = 0;
	let actualBPM = null;

	let BEAT_HOLD_TIME = 35; //num of frames to hold a beat
	let BEAT_DECAY_RATE = 0.98;
	let BEAT_MIN = 0.05; //a volume less than this is no beat

	//BPM STUFF
	let count = 0;
	let msecsFirst = 0;
	let msecsPrevious = 0;
	let msecsAvg = 633; //time between beats (msec)

	let timer;
	let gotBeat = false;
	let beatCutOff = 0;
	let beatTime = 0;

	let debugCtx;
	let debugW = 330;
	let debugH = 250;
	let chartW = 300;
	let chartH = 250;
	let aveBarWidth = 30;
	let debugSpacing = 2;
	let gradient;

	let freqByteData; //bars - bar data is from 0 - 256 in 512 bins. no sound is 0;
	let timeByteData; //waveform - waveform data is from 0-256 for 512 bins. no sound is 128.
	let levelsCount = 16; //should be factor of 512

	let binCount; //512
	let levelBins;

	let isPlayingAudio = false;

	let source;
	let buffer;
	let audioBuffer;
	let dropArea;
	let audioContext;
	let analyser;

	function init() {

    const AudioContext = window.AudioContext || window.webkitAudioContext
    audioContext = AudioContext ? new AudioContext() : null
		// audioContext = new window.webkitAudioContext();
		analyser = audioContext.createAnalyser();
		analyser.smoothingTimeConstant = 0.8; //0<->1. 0 is no time smoothing
		analyser.fftSize = 1024;
		analyser.connect(audioContext.destination);
		binCount = analyser.frequencyBinCount; // = 512

		levelBins = Math.floor(binCount / levelsCount); //number of bins in each level

		freqByteData = new Uint8Array(binCount);
		timeByteData = new Uint8Array(binCount);

		let length = 256;
		for(let i = 0; i < length; i++) {
		  levelHistory.push(0);
		}

		//INIT DEBUG DRAW
		let canvas = document.getElementById("audioDebug");
		debugCtx = canvas.getContext('2d');
		debugCtx.width = debugW;
		debugCtx.height = debugH;
		debugCtx.fillStyle = "rgb(40, 40, 40)";
		debugCtx.lineWidth=2;
		debugCtx.strokeStyle = "rgb(255, 255, 255)";

		// $('#audioDebugCtx').hide();

		gradient = debugCtx.createLinearGradient(0,0,0,256);
		gradient.addColorStop(1,'#330000');
		gradient.addColorStop(0.75,'#aa0000');
		gradient.addColorStop(0.5,'#aaaa00');
		gradient.addColorStop(0,'#aaaaaa');
    load();
	}

	function initSound(){
		// source = audioContext.createBufferSource();
		// source.connect(analyser);
	}

	//load
	function load() {

		stopSound();

		initSound();
		let songs = [
			{ url: 'https://soundcloud.com/bondax/bondax-gold-moonboots-remix',
				bpm: 118.0},
			{ url:'https://soundcloud.com/nachoemoji/fleek',
				bpm: 150.0}
		];
		let chosenSong = songs[getRandomInt(0, songs.length-1)];
		actualBPM = chosenSong;
    soundcloud({
      client_id: 'b95f61a90da961736c03f659c03cb0cc',
      song: chosenSong.url,
      dark: true,
      getFonts: true
    }, (err, src, json, div) => {
			console.log(json);
      audioBuffer = src;
      startSound(src);
    })


	}

	function startSound(src) {
    const audio = new Audio()
    audio.crossOrigin = 'Anonymous'
    audio.addEventListener('canplay', () => {
      audio.play()
    })
    audio.src = src

    source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);

		source.loop = true;
		isPlayingAudio = true;

	}

	function stopSound(){
		isPlayingAudio = false;
		if (source) {
			source.stop(0);
			source.disconnect();
		}
		debugCtx.clearRect(0, 0, debugW, debugH);
	}


	function onBeat(){
		gotBeat = true;
		beatCount++;
		events.emitEvent("onBeat");
	}

	function getActualBPM() {
		return actualBPM;
	}
	//called every frame
	//update published viz data
	function update(){



		if (!isPlayingAudio) return;

		//GET DATA
		analyser.getByteFrequencyData(freqByteData); //<-- bar chart
		analyser.getByteTimeDomainData(timeByteData); // <-- waveform

		//console.log(freqByteData);

		//normalize waveform data
		for(let i = 0; i < binCount; i++) {
			waveData[i] = ((timeByteData[i] - 128) /128 )* 1;
		}
		//TODO - cap levels at 1 and -1 ?

		//normalize levelsData from freqByteData
		for(let i = 0; i < levelsCount; i++) {
			let sum = 0;
			for(let j = 0; j < levelBins; j++) {
				sum += freqByteData[(i * levelBins) + j];
			}
			levelsData[i] = sum / levelBins/256 * 1; //freqData maxs at 256

			//adjust for the fact that lower levels are percieved more quietly
			//make lower levels smaller
			//levelsData[i] *=  1 + (i/levelsCount)/2;
		}
		//TODO - cap levels at 1?

		//GET AVG LEVEL
		let sum = 0;
		for(let j = 0; j < levelsCount; j++) {
			sum += levelsData[j];
		}
		level = sum / levelsCount;

		levelHistory.push(level);
		levelHistory.shift(1);

		//BEAT DETECTION
		if (level  > beatCutOff && level > BEAT_MIN){
			onBeat();
			beatCutOff = level *1.1;
			beatTime = 0;
		}else{
			if (beatTime <= 35){
				beatTime ++;
			}else{
				beatCutOff *= 0.97;
				beatCutOff = Math.max(beatCutOff,BEAT_MIN);
			}
		}


		bpmTime = (Date.now() - bpmStart)/1000;
		//trace(bpmStart);
		// console.log(bpmTime);
		debugDraw();
	}

	function getBPM() {
		// console.log(beatCount, bpmTime);
		return (beatCount / (bpmTime/60.0));
	}

	function debugDraw(){

		debugCtx.clearRect(0, 0, debugW, debugH);
		//draw chart bkgnd
		debugCtx.fillStyle = "#000";
		debugCtx.fillRect(0,0,debugW,debugH);

		//DRAW BAR CHART
		// Break the samples up into bars
		let barWidth = chartW / levelsCount;
		debugCtx.fillStyle = gradient;
		for(let i = 0; i < levelsCount; i++) {
			debugCtx.fillRect(i * barWidth, chartH, barWidth - debugSpacing, -levelsData[i]*chartH);
		}

		//DRAW AVE LEVEL + BEAT COLOR
    // console.log(level);
		if (beatTime < 6){
			debugCtx.fillStyle="#FFF";
		}
		debugCtx.fillRect(chartW, chartH, aveBarWidth, -level*chartH);

		//DRAW CUT OFF
		debugCtx.beginPath();
		debugCtx.moveTo(chartW , chartH - beatCutOff*chartH);
		debugCtx.lineTo(chartW + aveBarWidth, chartH - beatCutOff*chartH);
		debugCtx.stroke();

		//DRAW WAVEFORM
		debugCtx.beginPath();
		for(let i = 0; i < binCount; i++) {
			debugCtx.lineTo(i/binCount*chartW, waveData[i]*chartH/2 + chartH/2);
		}
		debugCtx.stroke();


	}

  function getLevel(){
    return level;
  }

	function getLevelsData(){
    return levelsData;
  }

	return {
		update:update,
		init:init,
		level:getLevel,
		levelsData:getLevelsData,
		getBPM: getBPM,
		getActualBPM: getActualBPM
	};

}();
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
module.exports = Music;
