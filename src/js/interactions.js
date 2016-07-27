interactions = (function() {
  /* Interactions avec la carte
  Void -> Object
  Méthode :
  * echo() : écrit les informations du node dans la display_zone
  * highlight_network() : applique une classe css de higlight à un réseau de nodes
  * remove_nodes_hightlights() : supprime les classes css de highlight présentes
  */
  "use strict";
  var interactions = {};
  var network;
  var tem_data;

  interactions.configure = function (_tem_data, _network) {
    /* Référencement de l'objet network pour usage par l'objet interactions
    Object -> Void */
    network = _network;
    tem_data = _tem_data;
  }

  interactions.creer_infobulle = function (node) {
    // console.log('go', node);
    infobulle.afficher();
    infobulle.positionner(node.x, node.y);
  }

  interactions.echo = function (node) {
    var texte = '<ul>';
    texte += '<li>id : ' + node.id + '</li>'
    texte += '<li>name : ' + node.name + '</li>'
    texte += '<li>thème : ' + node.theme_principal + '</li>'
    texte += '</ul>'
    document.getElementById('display_zone').innerHTML = texte;
  }

  interactions.highlight_network = function (d) {
    /* applique une classe css de higlight à un réseau de nodes
    Object -> Void */
    // Si l'on est sur un objet
    if (d.level !== 1) {
      highlight(true, 'réseau');
      network.get_elements(tem_data.associations_liste, tem_data.associations_index, d, 1)
             .forEach(function (id) {
               try { document.getElementById(id).classList.add('highlighted'); }
               catch (e) {
                 //console.log('0',id);
                 id = id.split('-');
                 id = id[1] + '-' + id[0];
                 try { document.getElementById(id).classList.add('highlighted'); }
                 catch (e) { console.error('lien non trouvé :', id); }
               }
      });
    }
    // Si l'on est sur un thème
    if (d.level !== 2) {
      highlight(true, 'theme-' + d.theme_principal);
    }
  }

  interactions.remove_nodes_hightlights =  function () {
    /* Permet de disabler le highlight
    Void -> Void */
    var highlighted = document.getElementsByClassName('highlighted');
    while (highlighted.length > 0) {
     highlighted.item(0).classList.remove('highlighted');
    }
    highlight(false);
  }

  function highlight(i, mode) {
    /* Prépare la carte pour la mise en avant de certains éléments
    Boolean -> Void */
    if (i) {
      //document.getElementById('carte').classList.add('highlighted');
      document.getElementById('carte').setAttribute('data-highlighted', mode);
    } else {
      //document.getElementById('carte').classList.remove('highlighted');
      document.getElementById('carte').removeAttribute('data-highlighted');
    }
  }

  return interactions;
})();
