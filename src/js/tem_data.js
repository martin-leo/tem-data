var tem_data = (function () {
  /* Chargement et traitement des données.
  Void -> Object
  Les données sont traitées de manière à obtenir deux listes : nodes et liens.
  * méthodes fournies par l'objet
    * import(chemin) : importe le fichier correspondant à $chemin
    * process() : traite les données de manière à obtenir deux listes : nodes et liens.
    * are_related(node a, node b)
  * propriétés
    * data : données importées depuis json et traitées
    * index : correspondance id->objets
    * nodes : liste des nodes actifs
    * links : listes des liens actifs
    * themes : listes des themes
   */
  "use strict";
  var tem_data = {}; // objet retourné par la fonction anonyme
  var JSON_importe; // JSON importé

  // index id->objet des objets visibles
  tem_data.index = {};
  // index source,target:true des liens d'association
  tem_data.associations_index = {};

  tem_data.nodes = []; // liste des nodes
  tem_data.links = []; // liste des liens
  tem_data.themes = []; // liste des thèmes

  tem_data.import = function (chemin, callbacks) {
    /* Charge le JSON contenu à $chemin dans tem_data.data (qui est une référence à un objet, avant d'exécuter les callbacks fournis).
    String, Object, Function List -> Void */

    function execute(fn) { fn(); } // permet d'exécuter une suite de callbacks

    // on reset cette liste car en cas de réimport,
    // elle sert de test pour un nouveau parcours initialisation
    // du json importé
    tem_data.themes = [];

    d3.json(chemin, function(erreur, json) {
      /* Chargement du JSON */
      if (erreur) {
        console.error('Erreur lors du chargement des données depuis ' + chemin + '.');
        console.log('erreur renvoyée :', error);
      } else {
        //stockage_json = json;
        tem_data.data = json;
        //parcours_dfs_initial_nodes();
        callbacks.forEach(execute);
      }
    });
  };

  function parcours_dfs_initial_nodes() {
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
      tem_data.themes.push(node); // dans le tableau themes
      node.level = level; // on ajoute une propriété correspondant au niveau de profondeur
      if (node.children) node.children.forEach(recurse);
      level--; // à chaque sortie on enlève un niveau de profondeur
    }

    recurse(tem_data.data);
  }

  function new_relation (source, target, nature) {
    /* ajout d'une relation à la liste des liens
       Object, Object, String -> Void */
    if (nature === 'association') { tem_data.associations_index[source.id + "," + target.id] = true; }
    var relation = {};
    relation.source = source;
    relation.target = target;
    relation.nature = nature;
    relation.theme_principal = target.theme_principal;
    relation.themes_secondaires = target.themes_secondaires;
    tem_data.links.push(relation);
  }

  tem_data.are_related = function (a, b) {
    return tem_data.associations_index[a.id + "," + b.id] || tem_data.associations_index[b.id + "," + a.id] || a.id == b.id;
  }

  function mise_en_place_relations() {
    /* Liste et crée les différents liens (parenté, associatifs),
    trouvés dans tem_data.data.
    Void -> Void*/
    function parcours(node) {
      /* Parcours DFS de l'arbre visant à établir les différents liens
         qu'ils soient parent->enfant ou associatifs
         Object -> Void
      */

      // si liens associatifs
      if (node.related) {
        for (var i = 0; i < node.related.length; i++) {
          new_relation(node, tem_data.index[node.related[i]],'association');
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

    tem_data.links = []; // on reset les liens

    tem_data.data.children.forEach(parcours); // on rebuild en omettant le nœud racine
  }

  function listage_des_nodes() {
    /* Parcours tem_data.data de manière à alimenter les liste des nodes */
    function parcours(node) {
      /* Parcours DFS de l'arbre visant à lister les noeud actifs
         Object -> Void
      */
      // if (node.id !== 0) // omission du noeud parent -> TODO mais penser à virer les liens correspondants !
      tem_data.nodes.push(node); // on ajoute le node à la liste nodes
      tem_data.index[node.id] = node; // on établit la correspondance id->objet

      // parcours des enfants (si applicable)
      if (node.children && node.collapsed == false) node.children.forEach(parcours);
    }

    tem_data.nodes = []; // on reset les nodes
    tem_data.index = {}; // on reset l'index

    tem_data.data.children.forEach(parcours); // on rebuild en omettant le nœud racine
  }

  tem_data.process = function() {
    /* Traite les données importées et les stocke dans tem_data.nodes et tem_data.links */

    // si l'on n'a pas encore fait le parcours initial
    // (ici on utilise la liste de thème pour vérifier)
    if (!tem_data.themes.length) { parcours_dfs_initial_nodes() }

    listage_des_nodes();
    mise_en_place_relations();
  }

  return tem_data;
})();
