import Analyser from 'web-audio-analyser';
export default function(path) {
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  let audioCtx = new AudioContext();
  let source = audioCtx.createBufferSource();
  return new Promise((resolve, reject) => {
    var request = new XMLHttpRequest();

    request.open('GET', path);
    request.responseType = 'arraybuffer'
    request.onload = function() {
      audioCtx.decodeAudioData(request.response, (buffer) => {
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.start(0);
        let analyser = Analyser(source, audioCtx);
        resolve( { source, analyser });
      });
    };
    request.send()
  })
}
