async function vacancyDetail(event) {
  let x=event.target;
  const url = `http://gis.vantaa.fi/rest/tyopaikat/v1/${x.innerHTML}`;
  const fetchResult = fetch(url);
  const response = await fetchResult;
  const jsonData = await response.json();
  const jobs = `<ul>
    ${jsonData.map(
    job => `<li>${job.tyotehtava} <a href=${job.linkki} target='_blank'>Link</a></li>`
    ).join('')}
    </ul>`;
    x.innerHTML += jobs;
}

async function myMap() {
  const url = 'http://gis.vantaa.fi/rest/tyopaikat/v1/kaikki';
  const fetchCoord=fetch(url);
  const response = await fetchCoord;
  const jsonData = await response.json();
  var mapProp= {
  center:new google.maps.LatLng(jsonData[0].y,jsonData[0].x),
  zoom:10,
  };
  var map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
  var infowindow =  new google.maps.InfoWindow({});
  var marker, count;
  for (count = 0; count < jsonData.length; count++) {
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(jsonData[count].y, jsonData[count].x),
      map: map
  });
  google.maps.event.addListener(marker, 'click', (function (marker, count) {
      return function () {
        infowindow.setContent(`<a href="${jsonData[count].linkki}" target="_blank">${jsonData[count].tyotehtava}</a>`);
        infowindow.open(map, marker);
      }
    })(marker, count));
  }
}

async function vantaaVacancy(){
  const URL = 'http://gis.vantaa.fi/rest/tyopaikat/v1';
  const result = document.getElementById('result');
  try {
    const fetchResult = fetch(new Request (URL, {method: 'GET', mode: 'cors', cache: 'reload', headers: {'Accept': 'application/json'}})
  );
    const response = await fetchResult;
    if (response.ok) {
      const jsonData = await response.json();
      let output = '<h1>Vacancies</h1>';
      var width = 0;
      var height = 300;
      jsonData.forEach(j=>{
        output += `<ul onclick="vacancyDetail(event)">${j.ammattiala}</ul>`;
        var canvas = document.getElementById('canvasId');
        var ctx = canvas.getContext('2d');
        ctx.save();
        ctx.translate(width, width+405);
        ctx.rotate(-Math.PI/2);
        ctx.fillStyle = 'black';
        ctx.font = "15px Arial Sans MS";
        ctx.textAlign = "end";
        ctx.fillText(`${j.ammattiala}`,width+100,15);
        ctx.restore();
        ctx.fillStyle = '#f18d00';
        ctx.save()
        ctx.fillStyle = 'black';
        ctx.textAlign = "center";
        ctx.font = "15px Comic Sans MS";
        ctx.fillText(`${j.lukumäärä}`, width+15, ((height-15)-j.lukumäärä*3));
        ctx.restore();
        ctx.fillRect(width, height, 30, -(j.lukumäärä*3));
        width += 40;
      });
      result.innerHTML = output;
    }
    else {
      console.log(`Response.status: ${response.status}`);
    }
  } catch(e) {
    console.log(e);
  }
}

vantaaVacancy();
