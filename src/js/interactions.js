interactions = (function() {
  /* Interactions avec la carte
  Void -> Object */
  var interactions = {};

  interactions.echo = function (node) {
    var texte = '<ul>';
    texte += '<li>id : ' + node.id + '</li>'
    texte += '<li>name : ' + node.name + '</li>'
    texte += '<li>thème : ' + node.theme_principal + '</li>'
    texte += '</ul>'
    document.getElementById('display_zone').innerHTML = texte;
  }

  return interactions;
})();
