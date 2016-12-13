import XMLHttpRequestPromise from 'xhr-promise';

function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function() {
  let xhrPromise = new XMLHttpRequestPromise();
  let offset = getRandomIntInclusive(0, 100);
  return xhrPromise.send({
    method: 'GET',
    url: 'http://api.giphy.com/v1/stickers/random?tag=vaporwave&api_key=dc6zaTOxFJmzC'
  })
  .then(function (res) {
    let result = res.responseText.data;
    // console.log(result);
    return result;
        // finalResult = results[getRandomIntInclusive(0,25)];
    // if (results.length < 1) {
    //   console.log('reloading');
    //   window.location.reload();
    // } else {
    //   return finalResult;
    // }
  });

}
