var network = (function(){
  /*  */
  var network = {};

  var a_traiter = {};

  var data = {};

  var elements_connectes = {};
  elements_connectes.liste = [];
  var elements_ajoutes = {};
  var nodes_traitees = {};

  network.get_elements = function(liste, index, node, profondeur){
    /* Retourne une liste d'id correspondant
    aux éléments connectés au node donné sur une profondeur donnée
    Array, Object, Number -> Array (String) */

    // réinitialisation des variables
    elements_connectes.liste = [];
    elements_ajoutes = {};
    nodes_traitees = {};

    a_traiter.nodes = [node.id];
    data.liste = liste;
    data.index = index;
    var profondeur = profondeur;

    while (a_traiter.nodes.length && profondeur) {
      //console.info('profondeur',profondeur);
      //console.log('a_traiter.nodes',a_traiter.nodes);
      nodes = a_traiter.nodes;
      a_traiter.nodes = [];
      nodes.forEach(process);
      profondeur--;
    }
    //console.log('elements_connectes.liste',elements_connectes.liste);
    return elements_connectes.liste;
  }

  function process(node) {
    /*  */
    //console.info('processing : ', node)
    nodes_traitees[node] = true;
    ajouter_node(node);
    var related = data.liste[data.index[node]];
    if (related) {
      related.forEach(function(id){
        ajouter_node(id);
        ajouter_lien(node,id);
      });
    }
  }

  function ajouter_node(id){
    /* Ajoute le nœud à la liste des éléments s'il ne l'est pas déjà
    et l'ajoute à la liste des éléments à traiter s'il ne l'a pas été */
    //console.info('ajouter_node',id);
    if (!elements_ajoutes[id]) {
      elements_connectes.liste.push('node_' + id);
      elements_ajoutes[id] = true;
    }
    if (!nodes_traitees[id]){
      a_traiter.nodes.push(id);
    }
  }

  function ajouter_lien(id_source, id_cible){
    /* Ajoute le lien à la liste des éléments s'il ne l'est pas déjà */
    //console.info('ajouter_lien', id_source, id_cible);
    if (!elements_ajoutes[id_source + '->' + id_cible] && !elements_ajoutes[id_cible + '->' + id_source]) {
      elements_ajoutes[id_source + '->' + id_cible] = true;
      elements_connectes.liste.push(id_source + '-' + id_cible);
    }
  }
  return network;
})();
