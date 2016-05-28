/* Construction de la structure HTML (afin de laisser index.html vierge) */
var main;
var carte;
var contenu;
var article;

main = d3.select('body').append('main').attr('id', 'main');

carte = main.append('section').attr('id', 'carte');

contenu = main.append('section').attr('id', 'contenu');

data_display = contenu.append('article');
data_display.attr('id', 'data_display');
data_display.append('h1').text('Data');
data_display.append('p').text('void').attr('id','display_zone');

article = contenu.append('article');
article.append('h1').text('Titre de l\'article');
article.append('p').text('Paragraphe de texte.');
