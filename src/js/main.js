/* Configuration et lancement de la cartographie dès téléchargement des données */
tem_data.import('data.json',[go]);
interactions.configure(tem_data,network);

function go () {
  tem_data.process();
  console.log(tem_data);
  carte.setup(tem_data);
  console.log(tem_data);
  carte.selections();
  carte.evenements();
}
