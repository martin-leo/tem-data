/*  Tem - exploration des possibilités de D3.js
    avec un modèle de données généré aléatoirement
    mais similaire à ce qu'attendu

    A. Paramétrage
    B. Import des données
      - import_data() : import des données depuis fichier JSON
    C. Setup
      - init() : fonction d'initialisation
      - setup_graph() : préparation des données
      - setup_visualisation() : setup de l'élément SVG et du layout D3.js
    D. Fonctions utiles
      - link_classes() : retourne un string contenant des classes pour un lien
      - link_distance() : retourne un number pour linkDistance
      - node_classes() : retourne un string contenant des classes pour un node
    E. Dessin du graph
      - graph_init() : fin de la config du layout D3.js + sélections et config
      - update() : MAJ des données et affichage
        - parcours() : listage des nodes actifs (via fonction récursive de parcours DFS de l'arbre)
        - function new_relation() : ajout d'une relation active à la liste des liens
        - set_relations() : listage des relations actives
          - parcours() : fonction récursive de parcours DFS de l'arbre

*/

/* ----------
A. Paramétrage
---------- */

// variables globales
var svg = {}; // svg object
var graph = {}; // graph

svg.TARGET = '#graph'; // élément où placer le svg
svg.WIDTH = window.innerWidth; // largeur de l'élément svg
svg.HEIGHT = window.innerHeight; // hauteur de l'élément svg
svg.NODE_RADIUS = 10;
svg.force; // D3's force layout
svg.nodes; // sélection des éléments nodes
svg.links; // sélection des éléments links

graph.SRC = 'data.json'; // fichier JSON à exploiter
graph.data = {}; // graph
graph.index = {}; // index id->objet des objets visibles
graph.nodes = []; // nodes
graph.themes = []; // themes
graph.links = {}; // liens
graph.links.liste = []; // liste des liens
graph.links.taille = {};
graph.links.taille.racine_theme = 150;
graph.links.taille.theme_objet = 80;
graph.links.taille.association = 50;

/* ----------
B. Import des données
---------- */

function execute(fn) { fn(); } // permet d'exécuter une suite de callbacks, voir import_data

function import_data(callbacks) {
  /* Procède à l'import du JSON vers un objet JavaScript
     Function -> Void */
  d3.json(graph.SRC, function (error, json) {
    if (error) { // si erreur lors de l'import
      console.error('Erreur lors du chargement des données depuis ' + graph.SRC + '.');
      console.log('erreur renvoyée :', error);
    } else { // sinon import
      graph.data = json;
      callbacks.forEach(execute); // on exécute tous les callbacks
    }
  });
}

/* ----------
C. Setup
---------- */

function init() {
  /* Procède à l'initialisation des données
     Les données sont importées via import_data
     auquel on précise les callbacks
     setup_graph : préparation des données
     setup_vis. : préparation de la visualisation
     update : lancement
  */
  import_data([setup_graph, setup_visualisation, update]);
}

function setup_graph() {
  /* On parcours (DFS) le graph importé en modifiant
  ou ajoutant des propriétés aux nodes */
  var level = -1;
  function recurse(node) {
    /* Parcours DFS du graph visant à le préparer
       Object -> Void */
    level++; // à chaque appel de setup on ajoute un niveau de profondeur
    if (level < 2) // tous les noeud de niveau < n visibles par défaut
    node.collapsed = false; // grâce à ceci
    if (level === 1) // tous les noeud thèmes
    graph.themes.push(node); // dans le tableau themes
    node.level = level; // on ajoute un propriété correspondant au niveau de profondeur
    if (node.children) node.children.forEach(recurse);
    level--; // à chaque sortie on enlève un niveau de profondeur
  }

  recurse(graph.data);
}

function setup_visualisation() {
  /* création de l'élément svg et dimensionnement
  Void -> Void */
  svg.graph = d3.select(svg.TARGET).append('svg')

  // configuration du layout
  svg.force = cola.d3adaptor()
    .linkDistance(link_distance)
    .size([svg.WIDTH, svg.HEIGHT]);

  // on créé une sélection de tous les éléments de classes .link et .node
  // ces sélections ne correspondent à rien pour le moment
  svg.graph.nodes = svg.graph.selectAll('.node');
  svg.graph.links = svg.graph.selectAll('.link');
}

function link_classes(d) {
  /* Retourne un string regroupant les classes
  à appliquer aux éléments line
  Object -> String */
  var classes = '';

  if (d.nature === 'parenté') {
    classes += 'link parente n' + d.source.level + ' ';
    classes += d.theme_principal ? 'theme_' + d.theme_principal + ' ': '';
  } else {
    classes += 'link association n' + d.source.level;
  }
  return classes;
}

function link_distance(d){
  /* Différenciation des tailles de liens
  -> liens racine -> thème
  -> liens thème -> objet
  -> liens d'association
  Object -> Number */
  if (d.nature === "parenté") {
    // liens de parenté
    if (d.source.level === 0) {
      // liens racine -> thème
      return graph.links.taille.racine_theme;
    } else {
      // liens thème -> objet
      return graph.links.taille.theme_objet;
    }
  } else {
    // liens d'association
    return graph.links.taille.association;
  }
}

function node_classes(d) {
  /* Retourne un string regroupant les classes
  à appliquer aux éléments g (nodes)
  Object -> String */
  var classes = '';
  classes +='node n' + d.level + ' ';
  classes += d.theme_principal ? 'theme_' + d.theme_principal + ' ': '';
  return classes;
}

function resize() {
  /* Permet le recentrage du graph
  lors d'un redimensionnement de la page */
  var width = window.innerWidth;
  var height = window.innerHeight;
  svg.force.size([width, height]).start();
}

function graph_init() {
  /* Démarrage du graph, écouteurs
  Void -> Void */
  svg.force // on finit la config du layout graph
    .nodes(graph.nodes) // on lui donne les nodes à manger
    .links(graph.links.liste) // et les liens
    .start(); // on le démarre

  // gestion des éléments
  // liens
  // sélection des éléments .link
  svg.links = svg.graph.selectAll('.link')
      .data(graph.links.liste) // association des données
    .enter().append('line') // pour les donnée entrantes (toutes), on ajoute une line au graph
      .attr('class', link_classes) // on leur met la classe link

  // nodes
  // sélection des éléments .node
  svg.nodes = svg.graph.selectAll('.node')
     .data(graph.nodes)
  .enter().append('g') // pour les donnée entrantes (toutes), on ajoute un cercle au graph
    .attr('class', node_classes).append('circle') // on leur met la classe node
    .attr('r', svg.NODE_RADIUS) // on règle leur taille
    .call(svg.force.drag); // on les rend draggables

  // pour la sélection node (maintenant peuplée)
  svg.nodes.append('text')
      .attr('dy', '.35em') // dont on config la position
      .text(function(d) { return d.name; }); // dans lequel on ajoute un élément texte contenant le texte du titre

  // écouteur sur le resize
  window.addEventListener('resize', resize);

  // écouteur sur le temps pour l'anim
  svg.force.on('tick', function() { // qui appelera le code qui suit
    // on met à jour les liens
    svg.links.attr('x1', function(d) { return d.source.x; })
        .attr('y1', function(d) { return d.source.y; })
        .attr('x2', function(d) { return d.target.x; })
        .attr('y2', function(d) { return d.target.y; });

    // et les nodes
    svg.nodes.attr('cx', function(d) { return d.x; })
        .attr('cy', function(d) { return d.y; });
  });
}

function update() {
  /* Procède à la mise à jour des données
     Parcours de l'arbre (nœud non-collapsés) + index
     Collecte des liens associatifs
     Affichage
  */
  graph.nodes = []; // on reset les nodes
  graph.links.liste = []; // on reset les liens
  graph.index = {}; // on reset l'index

  function parcours(node) {
    /* Parcours DFS de l'arbre visant à lister les noeud actifs
       Object -> Void
    */
    graph.nodes.push(node); // on ajoute le node à la liste nodes
    graph.index[node.id] = node; // on établit la correspondance id->objet

    // parcours des enfants (si applicable)
    if (node.children && node.collapsed == false) node.children.forEach(parcours);
  }

  function new_relation (source, target, nature) {
    /* ajout d'une relation à links
       Object, Object, String -> Void */
    var relation = {};
    relation.source = source;
    relation.target = target;
    relation.nature = nature;
    relation.theme_principal = target.theme_principal;
    relation.themes_secondaires = target.themes_secondaires;
    graph.links.liste.push(relation);
  }

  function set_relations() {
    /* Liste et crée les différents liens (parenté, associatifs)
    Void -> Void*/
    function parcours(node) {
      /* Parcours DFS de l'arbre visant à établir les différents liens
         qu'ils soient parent->enfant ou associatifs
         Object -> Void
      */

      // si liens associatifs
      if (node.related) {
        for (var i = 0; i < node.related.length; i++) {
          new_relation(node, graph.index[node.related[i]],'association');
        }
      }

      // si liens parent->child
      if (node.children && node.collapsed == false) {
        for (var i = 0; i < node.children.length; i++) {
          new_relation(node, node.children[i],'parenté');
        }
      }

      // parcours des enfants (si applicable)
      if (node.children && node.collapsed == false) node.children.forEach(parcours);
    }

    parcours(graph.data);
  }

  parcours(graph.data);
  set_relations();
  graph_init();
}

init();
