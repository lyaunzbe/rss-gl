export default function(mediaURL) {
  return new Promise((resolve, reject) => {

    let url = window.URL || window.webkitURL;

    let video = document.createElement("video");
    video.src = mediaURL;
    // video.width = 512;
    // video.height = 512;
    video.setAttribute('crossorigin', 'anonymous');
    video.loop = true;
    video.muted = true;
    video.load();
    video.play();
    resolve(video);
    video.onprogress = function() {
      console.log('downloading');
    };
    video.oncanplay = function() {
      console.log('DONE');


    };
  })
}
