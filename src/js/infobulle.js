var infobulle = (function(){
  /*
  */
  "use strict";

  var infobulle = {};
  var bulle;
  var transform = {};

  infobulle.constructeur = function () {
    /**/
    var a = document.createElement("section");
    a.setAttribute('id', 'infobulle');
    a.style.display = 'block';
    a.style.position = 'fixed';
    bulle = document.body.appendChild(a);
  };

  infobulle.afficher = function () {
    /**/
    bulle.style.position = 'absolute';
  };

  infobulle.positionner = function (x, y) {
    /**/
    x = (x * carte.transformations.scale) + carte.transformations.translate.x;
    y = (y * carte.transformations.scale) + carte.transformations.translate.y;
    bulle.style.left = x + 'px';
    bulle.style.top = y + 'px';
  };

  infobulle.taille = function () {
    /**/
    return [0,0];
  };

  infobulle.modifier_contenu = function (contenu) {
    /**/
    var a;
  };

  infobulle.constructeur();

  return infobulle;
})();

/*

infobulle.creer = function (x, y) {
  var transformations = {};
  transformations.translate = 0;
  transformations.scale = 0;
  var scale = 1;
  var translate = [0,0];
  var t = document.getElementById('carte').firstChild.firstChild;
  if(t.getAttribute("transform")){
    var valeurs = t.getAttribute("transform").replace(/\(/gi,'').replace(/\)/gi,'').replace('translate','').replace('scale','|').split('|');
    scale = parseFloat(valeurs[1]);
    translate = valeurs[0].split(',');
    translate[0] = parseFloat(translate[0]);
    translate[1] = parseFloat(translate[1]);
    console.log('scale', scale);
    console.log('translate', translate)
  }

  var bulle;
  if ( document.getElementById('infobulle') ) {
    bulle = document.getElementById('infobulle');
    bulle.remove();
  }
  bulle = document.createElement("section");
  bulle.setAttribute('id', 'infobulle');
  bulle.innerHTML = "<h1>infobulle</h1>";
  //var x = translate[0] + x / scale;
  //var y = translate[1] + y / scale;

  x = (x * scale) + translate[0];
  y = (y * scale) + translate[1];

  bulle.style.left = x + 'px';
  bulle.style.top = y + 'px';
  document.body.appendChild(bulle);
}

*/
