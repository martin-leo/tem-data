var shapes = (function(){
  /* */
  var SVG_namespace = 'http://www.w3.org/2000/svg';
  var shapes = {};
  shapes.width = 50;
  shapes.height = 50;

  //
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

  shapes.get_shapes_dict = function() {
    return shapes_dict;
  }

  //
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

  shapes.return_type = function (d) {
    return document.createElementNS(SVG_namespace, shapes_index[d.theme_principal].type);
  };

  shapes.return_d = function (d) {
  if (shapes_index[d.theme_principal].attributes.d) {
    if (d.theme_principal > 9) { test = true }
    var values = shapes_index[d.theme_principal].attributes.d;
    var scale = d.level == 1 ? 2 : 1;
    //console.log("scale", scale);
    var output = output_svg(values, scale);

    return output;
  } else { return undefined; }
  };

  shapes.return_r = function (d) {
    if (shapes_index[d.theme_principal].attributes.r) {
      var scale = d.level == 1 ? 2 : 1;
      return scale_value(scale,shapes_index[d.theme_principal].attributes.r);
    } else { return undefined; }
  };

  shapes.return_width = function (d) {
    if (shapes_index[d.theme_principal].attributes.width) {
      var scale = d.level == 1 ? 3 : 1;
      return scale_value(scale,shapes_index[d.theme_principal].attributes.width);
    } else { return undefined; }
  };

  shapes.return_height = function (d) {
    if (shapes_index[d.theme_principal].attributes.height) {
      var scale = d.level == 1 ? 2 : 1;
      return scale_value(scale,shapes_index[d.theme_principal].attributes.height);
    } else { return undefined; }
  };

  function output_svg (input, scale) {
    /**/
    var values;
    var output;
    // scaling the values
    if (scale !== 1) {
      values = scale_d(input, scale);
    } else {
      values = input;
    }
    output = serialize_d (values);
    return output;
  }

  function serialize_d (d) {
    /*  */
    var output = "";
    for (var i = 0; i < d.length; i++) {
      for (var j = 0; j < d[i].length; j++) {
        output = output + d[i][j];
        if (j > 0 && j + 1 < d[i].length) {
          output = output + ",";
        }
      }
    }
    return output;
  }

  function scale_d (values, scale) {
    /**/
    console.log(" ----- scale_d", values, scale);
    var output = [];
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
    return output;
  }

  function scale_value (coeff, value) {
    /**/
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


document.getElementById('data_display').addEventListener('click', function() {
  console.log(shapes.get_shapes_dict());
},false);
