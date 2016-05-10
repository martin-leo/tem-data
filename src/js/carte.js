var carte = (function () {
  /*
    Cartographie
    Void -> Object

    * Méthodes :
      * resize() : gestion du resize, à appeler dès que #carte est redimensionné (un écouteur est présent sur window)
      * setup() : mise en place de la structure
      * selections() : génère les sélections
      * evenements() : déclaration des événements
    * Propriétés :
      * selections.nodes : sélection d3 des nœeuds

  * 1. Déclaration des variables
  * 2. Fonctions utiles
  * 3. Setup
  * 4. Sélections
  * 5. Événements
  */
  "use strict";

  /* ----------
    1. Déclaration des variables
  ---------- */

  // objet retourné par la fonction anonyme
  var objet_carte = {};

  objet_carte.selections = {};
  var graph; // référence à l'objet tem_data

  // layout & behaviour d3js
  var force;

  // sélection d'éléments d3js
  var carte;
  var svg;
  var zoom;
  var conteneur;

  // graph
  var graph = {};

  // variables
  var width;
  var height;

  // paramètres
  var zoom_min = 0.1;
  var zoom_max = 7;
  var charge = -50;

  carte = document.getElementById('carte');

  /* ----------
    2. Fonctions utiles
  ---------- */

  function link_distance(d){
    /* Différenciation des tailles de liens
    -> liens racine -> thème
    -> liens thème -> objet
    -> liens d'association
    Object -> Number */
    return 10; // TODO
  }

  function maj_dimensions(){
    /* Met à jour les variables width et height
    Void -> Void */
    width = carte.clientWidth;
    height = carte.clientHeight;
  }

  objet_carte.resize = function () {
    /* Procède au resize et adapte le zoom selon */
    var W = carte.clientWidth;
    var H = carte.clientHeight;

    // édition des attributs de svg
    svg.attr("width", W).attr("height", H);

    // recalcule de la taille
    force.size([force.size()[0] + (W - width) / zoom.scale(), force.size()[1] + (H - height) / zoom.scale()]).resume();

    // on enregistre les nouvelles dimensions
    maj_dimensions();
  }

  /* ----------
  3. Setup
  ---------- */

  objet_carte.setup = function (data) {
    /* Référencement des données et mise en place du layout */
    graph = data;
    maj_dimensions();

    force = d3.layout.force()
      .linkDistance(link_distance)
      .charge(charge)
      .size([width, height])
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

    // sélection côté svg : objet svg appendé à body
    svg = d3.select("#carte").append("svg").attr("width", width).attr("height", height);
    // création du zoom
    zoom = d3.behavior.zoom().scaleExtent([zoom_min, zoom_max])
    // création d'un conteneur dans svg et stockage dans var conteneur
    conteneur = svg.append("g");
  }

  /* ----------
  4. Sélections
  ---------- */

  objet_carte.selections = function () {
    /* On génère les différentes sélections */
    objet_carte.selections.nodes = conteneur.selectAll(".node")
      .data(graph.nodes) // bind des datas
      .enter().append("g") // dans des g
      .attr("class", "node") // classe .node
      .append('circle').attr('r', 10)
      .call(force.drag) // force drag (redondant avec le zoom ?)
  }

  /* ----------
  5. Événements
  ---------- */

  objet_carte.evenements = function () {
    /*  */
    force.on("tick", function() {
      /* Fonction d'animation */

      // nodes
      objet_carte.selections.nodes.attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      });

    });

    objet_carte.selections.nodes.on("mousedown", function(d) {
      d3.event.stopPropagation();
    });

    zoom.on("zoom", function() {
      /* Application du zoom du zoom */
      conteneur.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    });

    svg.call(zoom); // on applique le zoom à l'objet svg

    // au resize de la fenêtre on appelle la fonction dédiée
    d3.select(window).on("resize", objet_carte.resize);
  }

  return objet_carte;
})();

tem_data.import('data.json',[go]);

function go () {
  tem_data.process();
  carte.setup(tem_data);
  carte.selections();
  carte.evenements();

}
