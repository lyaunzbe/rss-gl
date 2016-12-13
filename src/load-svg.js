import XMLHttpRequestPromise from 'xhr-promise';



export default function(path) {
  let xhrPromise = new XMLHttpRequestPromise();

  return xhrPromise.send({
    method: 'GET',
    url: path
  })
  .then(function (res) {
    console.log(res);
    var svgContainer = document.createElement('div');
    console.log(svgContainer);
    svgContainer.setAttribute('id', 'svg-container');
    svgContainer.innerHTML = res.responseText;
    document.body.appendChild(svgContainer);
    flatten(document.getElementsByTagName('svg')[0]);
    return svgContainer;
  });

}
