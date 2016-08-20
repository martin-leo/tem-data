var shapes = (function(){
  /* */
  var shapes = {};
  shapes.width = 50;
  shapes.height = 50;

  shapes.dispatcher = function(d) {
    /* */
    switch(d.theme_principal) {
      case '1':
        return shapes.diamond(d);
      default:
        return shapes.diamond(d);
    }
  };

  shapes.diamond = function(d) {
    /*  */
    /*
    d.x
    d.y
    d.children
    d.collapsed
    d.id
    d.index
    d.level
    d.name
    d.theme_principal
    d.themes_secondaires
    */
    var points = [
                    [0, 10],
                    [10, 0],
                    [0, -10],
                    [-10, 0],
                    [0, 10],
                 ];
    return d3.svg.line()(points);
  };

  return shapes;
})();
