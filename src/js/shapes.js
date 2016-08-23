var shapes = (function(){
  /* namespace relatif à tout ce qui est relatif au dessin des formes de la carte
  Void -> Object */

  // namespace pour les éléments SVG
  var SVG_namespace = 'http://www.w3.org/2000/svg';
  var shapes = {};

  /* Objet/dictionnaires des formes personnalisées */
  var shapes_dict = {
    square : {
      type : 'path',
      attributes : {
        d : [
              ["M",-5, -5],
              ["L",-5, 5],
              ["L",5, 5],
              ["L",5, -5],
              ['Z'],
            ],
      },
    },
    circle : {
      type : 'circle',
      attributes : {
        r : 5,
        cx : true,
        cy : true,
      },
    },
    diamond : {
      type : 'path',
      attributes : {
        d : [
              ["M",0, 7],
              ["L",7, 0],
              ["L",0, -7],
              ["L",-7, 0],
              ['Z'],
            ],
      },
    },
    fold : {
      type : 'path',
      attributes : {
        d : [
              ["M",-5, 5],
              ["L",5, 5],
              ["L",3, 0],
              ["L",5, -5],
              ["L",-5, -5],
              ["L",-3, 0],
              ['Z'],
            ],
      },
    },
    heart : {
      type : 'path',
      attributes : {
        d : [
              ["M",3.5, -3.5],
              ["L",0, 0],
              ["L",-3.5, -3.5],
              ["L",-7, 0],
              ["L",0, 7],
              ["L",7, 0],
              ['Z'],
            ],
      },
    },
    half_circle : {
      type : 'path',
      attributes : {
        d: [
          ['M',-10,-2],
          ['C',-10,2,-5.523,8,0,8],
          ['S',10,2,10,-2],
          ['H',-10],
          ['Z'],
        ],
      },
    },
    half_circle_variant : {
      type : 'path',
      attributes : {
        d: [
          ['M',10,2],
          ['C',10,-2,5.523,-8,-0,-8],
          ['S',-10,-2,-10,2],
          ['H',10],
          ['Z'],
        ],
      },
    },
    pentagon : {
      type : 'path',
      attributes : {
        d: [
          ['M',-4.635,7],
          ['L',-7.5,-2.029],
          ['L',0,-7.611],
          ['L',7.5,-2.033],
          ['L',4.635,7],
          ['Z'],
        ],
      },
    },
    cross : {
      type : 'path',
      attributes : {
        d: [
          ['M',5,-2],
          ['L',2,-2],
          ['L',2,-5],
          ['L',-2,-5],
          ['L',-2,-2],
          ['L',-5,-2],
          ['L',-5,2],
          ['L',-2,2],
          ['L',-2,5],
          ['L',2,5],
          ['L',2,2],
          ['L',5,2],
          ['Z'],
        ],
      },
    },
    cross_variant : {
      type : 'path',
      attributes : {
        d: [
          ['M',4.95,2.121],
          ['L',2.829,0],
          ['L',4.95,-2.121],
          ['L',2.121,-4.95],
          ['L',0,-2.829],
          ['L',-2.121,-4.95],
          ['L',-4.95,-2.121],
          ['L',-2.829,0],
          ['L',-4.95,2.121],
          ['L',-2.121,4.95],
          ['L',0,2.829],
          ['L',2.121,4.95],
          ['Z'],
        ],
      },
    },
    triangle : {
      type : 'path',
      attributes : {
        d: [
          ["M",-7, 7],
          ["L",7, 7],
          ["L",0, -7],
          ['Z'],
        ],
      },
    },
    triangle_variant : {
      type : 'path',
      attributes : {
        d: [
          ["M",0, 7],
          ["L",7, -7],
          ["L",-7, -7],
          ['Z'],
        ],
      },
    },
  };

  // association thème principal -> Forme
  var shapes_index = {
    1 : shapes_dict.circle,
    2 : shapes_dict.square,
    3 : shapes_dict.diamond,
    4 : shapes_dict.heart,
    5 : shapes_dict.fold,
    6 : shapes_dict.half_circle,
    7 : shapes_dict.cross,
    8 : shapes_dict.cross_variant,
    9 : shapes_dict.half_circle_variant,
    10 : shapes_dict.pentagon,
    11 : shapes_dict.triangle,
    12 : shapes_dict.triangle_variant,
  };

  shapes.return_svg_element = function (d) {
    /* Retourne un élément SVG créé d'après le dictionnaire des formes
    Object -> Object */
    return document.createElementNS(SVG_namespace, shapes_index[d.theme_principal].type);
  };

  shapes.return_d = function (d) {
    /* Retourne l'attribue d d'un élément si existant ou undefined
    Object -> String/undefined */

    /* si le dictionnaire précise l'existance d'un attribut d
       on renvoie une chaine de caractère représentant les commandes de tracé */
    if (shapes_index[d.theme_principal].attributes.d) {

      // on copie les valeurs
      var values = shapes_index[d.theme_principal].attributes.d;

      // on modifie l'échelle en cas d'élément thème
      var scale = d.level == 1 ? 2 : 1;

      // on retourne la chaîne de commande
      return output_path_commands(values, scale);

    /* si le dictionnaire ne précise pas d'attribut d on renvoie undefined
       (l'attribut ne sera alors pas ajouté à l'élément) */
    } else { return undefined; }
  };

  shapes.return_r = function (d) {
    /* Retourne l'attribue r d'un élément si existant ou undefined
    Object -> String/undefined */

    /* si le dictionnaire précise l'existance d'un attribut r
       on renvoie le rayon correspondant */
    if (shapes_index[d.theme_principal].attributes.r) {

      // on modifie l'échelle en cas d'élément thème
      var scale = d.level == 1 ? 2 : 1;

      // on renvoie le rayon mis à l'échelle
      return scale_value(scale,shapes_index[d.theme_principal].attributes.r);

    /* si le dictionnaire ne précise pas d'attribut r on renvoie undefined
       (l'attribut ne sera alors pas ajouté à l'élément) */
    } else { return undefined; }
  };

  shapes.return_width = function (d) {
    /* Retourne l'attribue width d'un élément si existant ou undefined
    Object -> String/undefined */

    /* si le dictionnaire précise l'existance d'un attribut width
       on renvoie le rayon correspondant */
    if (shapes_index[d.theme_principal].attributes.width) {

      // on modifie l'échelle en cas d'élément thème
      var scale = d.level == 1 ? 3 : 1;

      // on renvoie la largeur mise à l'échelle
      return scale_value(scale,shapes_index[d.theme_principal].attributes.width);

    /* si le dictionnaire ne précise pas d'attribut width on renvoie undefined
       (l'attribut ne sera alors pas ajouté à l'élément) */
    } else { return undefined; }
  };

  shapes.return_height = function (d) {
    /* Retourne l'attribue height d'un élément si existant ou undefined
    Object -> String/undefined */

    /* si le dictionnaire précise l'existance d'un attribut height
       on renvoie le rayon correspondant */
    if (shapes_index[d.theme_principal].attributes.height) {

      // on modifie l'échelle en cas d'élément thème
      var scale = d.level == 1 ? 2 : 1;

      // on renvoie la hauteur mise à l'échelle
      return scale_value(scale,shapes_index[d.theme_principal].attributes.height);

    /* si le dictionnaire ne précise pas d'attribut height on renvoie undefined
       (l'attribut ne sera alors pas ajouté à l'élément) */
    } else { return undefined; }
  };

  function output_path_commands (input, scale) {
    /*  Retourne une chaîne de commande de tracé à partir de la propriété d d'un élément du dictionnaire
    Object, Number -> String */

    // conteneur pour mise à l'échelle
    var values;

    // si l'échelle est != 1 on met à l'échelle
    if (scale !== 1) {
      values = scale_d(input, scale);
    } else {
      values = input;
    }

    // on retourne les valeurs sous forme de chaîne de caractères
    return serialize_d(values);
  }

  function serialize_d (d) {
    /* retourne la propriété d d'un élément sous forme de chaîne de caractère
    Array d'Array -> String*/

    // chaîne en sortie
    var output = "";

    // on process les données en entrée
    for (var i = 0; i < d.length; i++) {
      for (var j = 0; j < d[i].length; j++) {
        output = output + d[i][j];
        if (j > 0 && j + 1 < d[i].length) {
          output = output + ",";
        }
      }
    }

    // on retourne la chaîne
    return output;
  }

  function scale_d (values, scale) {
    /* Met à l'échelle la propriété d d'un élément du dictionnaire
    Array d'Array, Number -> Array d'Array */

    // valeurs en sortie
    var output = [];

    // on process les données en entrées
    for (var i = 0; i < values.length; i++) {
      output.push([]);
      for (var u = 0; u < values[i].length; u++) {
        output[i].push([]);
        if ("number" === typeof values[i][u]) {
          output[i][u] = values[i][u] * scale;
        } else {
          output[i][u] = values[i][u];
        }
      }
    }

    // on retourne les données mises à l'échelle
    return output;
  }

  function scale_value (coeff, value) {
    /* Met à l'échelle une valeur
    Number, Number -> Number */

    // si le coeff est un on retourne directement la valeur en entrée
    if (coeff === 1) {
      return value;
    } else {
      return value * coeff;
    }
  }

  function scale (coeff, values) {
    /* Permet d'adapter la taille d'une suite de suites de valeurs ou d'une valeur
    Number, Number/array d'Arrays de Number -> Number/array d'Arrays de Number */
    if (coeff === 1) {
      return values;
    } else {

      // si une seule valeur
      if (typeof values === "number") {
        return values * coeff;

      // si un tableau de valeurs
      } else {
        var output = [];
        for (var i = 0; i < values.length; i++) {
          output.push([]);
          for (var u = 0; u < values[i].length; u++) {
            output[i].push(values[i][u] * coeff);
          }
        }
        return output;
      }
    }
  }

  return shapes;
})();
