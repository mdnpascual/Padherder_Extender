//Using Google Closure compiler

// ==UserScript==
// @name         Padherder
// @namespace    http://tampermonkey.net/
// @version      0.77
// @description  Shows possible Skillup/Material monsters from descended dungeons in PadHerder site
// @author       MDuh
// @match        https://www.padherder.com/*
// @require      http://userscripts-mirror.org/scripts/source/107941.user.js
// @require      http://code.jquery.com/jquery-3.2.1.js
// @downloadURL  https://github.com/mdnpascual/Padherder_Extender/raw/master/Padherder_optimized.user.js
// @updateURL    https://github.com/mdnpascual/Padherder_Extender/raw/master/Padherder_optimized.user.js
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// ==/UserScript==

(function() {
  function n(g, c) {
    var e = g;
    e > c.length && (e = c.length - 1);
    try {
      for (; c[e].id != g;) {
        if (e--, 0 > e) {
          return console.log("Monster ID: " + g + " not found in padherder database"), 2897;
        }
      }
    } catch (a) {
      return console.log("Monster ID: " + g + " not found in padherder database"), 2898;
    }
    return e;
  }
  function y(g, c, e, a, f) {
    for (var h = 0, l = 0, b = ""; h < g.length;) {
      c[h] == a && (l += parseInt(g[h]), b += g[h] + " for " + e[h] + "<br>"), h++;
    }
    return '<tr class="tooltip2"> <td class="tg-031e">' + f + '</td> <td class="tg-0ord">' + l + '<span class="tooltip2text">' + b + "</span></td> </tr>";
  }
  function F(g) {
    return g.sort().filter(function(c, e, a) {
      return !e || c != a[e - 1];
    });
  }
  var z = (new Date((new Date).getTime() + -72E5)).getDay(), G = [147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 227, 234, 246, 247, 248, 249, 250, 251, 321, 797, 915, 916, 1002, 1085, 1086, 1087, 1176, 1294, 1295], H = [2006, 1839, 1712, 1536, 599, 3015, 2805, 2739, 2637, 2184, 2092, 1252, 2926, 2722, 2398, 2008, 1750, 1590, 1272, 1225, 1210, 1090, 984, 228, 839, 763, 273, 2391, 1461, 1841, 1737, 597, 
  1473, 3221, 2277, 2182, 1602, 1532, 1458, 1307, 1208, 2383, 2263, 2104, 1713, 1273, 1227, 1091, 835, 765, 434, 275, 3074, 2808, 1945, 2807, 1189, 2738, 1223, 1843, 2987, 2838, 2754], I = ["565:::566", 1838, "682:::683", "598:::599", 598, 3014, 2804, "822:::229:::99:::98", 2636, 2183, 2091, 1251, 2978, 2721, 2397, 2007, 1749, 1589, "316:::79:::78", 1224, "399:::398", "211:::23:::22:::21", "512:::107:::106", 182, 838, 762, 272, "1461:::1460", 1460, 1840, "597:::596", 596, "683:::682", 3220, 2276, 
  2181, 1167, 1531, 783, 1306, "513:::222:::221", 2382, 2262, 2103, 738, "317:::81:::80", 1226, "212:::26:::25:::24", "834:::833:::832", 764, 433, 274, 3073, "1945:::1944", 1944, "1189:::1188", 1188, "1223:::1222", 1222, 1842, 2986, 2837, 2753], q = [], A = GM_getValue("date_sync", -1), E, x, B, m = [], r, l, v = [], C = [], D = [], g = [], w;
  q.push($.get("https://gist.githubusercontent.com/padxExtender/e11935cf82505acbdd2b6e03a8cfe440/raw/file1.txt", function(g) {
    x = g.split("\n");
    A = x[0];
  }));
  q.push($.get("https://gist.githubusercontent.com/padxExtender/e11935cf82505acbdd2b6e03a8cfe440/raw/", function(g) {
    B = g.split("\n");
    E = B[0];
  }));
  $.when(q[0], q[1]).done(function() {
    if (A != z && E != z) {
      alert("Padx database not updated for today, please visit puzzledragonx.com/ and let the script update the database");
    } else {
      A == z && (x = B);
      var q = document.evaluate('//*[@id="username-dropdown"]/span', document, null, XPathResult.ANY_TYPE, null).iterateNext();
      m.push($.get("https://www.padherder.com/user-api/user/" + q.textContent + "/", function(c) {
        r = c;
      }));
      m.push($.get("https://raw.githubusercontent.com/mdnpascual/Padherder_Extender/master/json_template/evolutions.json", function(c) {
        JSON.parse(c);
        l = c;
      }));
      m.push($.get("https://raw.githubusercontent.com/mdnpascual/Padherder_Extender/master/json_template/monsters.json", function(c) {
        g = JSON.parse(c);
      }));
      m.push($.get("https://raw.githubusercontent.com/mdnpascual/Padherder_Extender/master/json_template/active_skills.json", function(c) {
        JSON.parse(c);
        w = c;
      }));
      $.when(m[0], m[1], m[2], m[3]).done(function() {
        for (var c, e, a, f, h, p, b, d = 0, t, u; d < parseInt(r.monsters.length);) {
          null !== r.monsters[d].target_evolution && 1 < parseInt(r.monsters[d].priority) && v.push([r.monsters[d], r.monsters[d].priority]);
          a = '"name":"';
          e = null == r.monsters[d].target_evolution ? parseInt(r.monsters[d].monster) - 1 : parseInt(r.monsters[d].target_evolution) - 1;
          var k = n(e + 1, g);
          c = a;
          a = g[k].active_skill;
          a = null === a ? null : a.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
          a = c + a + '"';
          b = w.search(a);
          if (-1 == b) {
            console.log("Skill: " + a + g[k].active_skill + " not in padherder database");
          } else {
            h = b - 2;
            for (a = w.substring(b, b + 15); '"max_cooldown":' !== a;) {
              b--, a = w.substring(b, b + 15);
            }
            for (t = w.substring(b + 15, h + 1); ',"effect":"' !== a;) {
              b--, a = w.substring(b, b + 11);
            }
            for (h = b; '"min_cooldown":' !== a;) {
              b--, a = w.substring(b, b + 15);
            }
            u = w.substring(b + 15, h);
            if (1 < parseInt(r.monsters[d].priority) && parseInt(r.monsters[d].current_skill) < t - u + 1) {
              var m = !1, q = "";
              for (b = 1; b < x.length;) {
                f = x[b].split("::: ");
                a = f[1].split(",");
                for (p = 0; p < a.length - 1;) {
                  c = n(a[p], g);
                  if (g[c].active_skill == g[k].active_skill) {
                    q = m ? q + f[0] + "::: " + g[c].id + "::: " + g[c].name + "|||" : q + (e + 1) + "(" + (t - u + 1 - r.monsters[d].current_skill) + ")|||" + f[0] + "::: " + g[c].id + "::: " + g[c].name + "|||";
                    m = !0;
                    break;
                  }
                  p++;
                }
                b++;
              }
              "" !== q && C.push(q);
            }
          }
          d++;
        }
        for (d = 0; d < parseInt(v.length);) {
          f = v[d][0].target_evolution;
          do {
            b = l.search('evolves_to":' + f + "}");
            if (-1 == b) {
              console.log("Monster: " + v[d][0].target_evolution + " not in padherder database");
              break;
            }
            for (a = l.substring(b, b + 5); '":[{"' !== a;) {
              b--, a = l.substring(b, b + 5);
            }
            c = b - 1;
            for (a = l.substring(c, c + 4); '}],"' !== a;) {
              c--, a = l.substring(c, c + 4);
            }
            c = l.substring(c + 4, b);
            b = l.search('evolves_to":' + f);
            for (a = l.substring(b, b + 5); ":[[" !== a;) {
              if ("[" == a.charAt(0)) {
                a = parseInt(l.substring(b + 1, h).substring(0, l.substring(b + 1, h).search(",")));
                if (!G.includes(a)) {
                  e = 1;
                  for (k = ""; e < x.length;) {
                    f = x[e].split("::: ");
                    a = f[1].split(",");
                    for (t = 0; t < a.length - 1;) {
                      p = a[t];
                      u = H.indexOf(parseInt(l.substring(b + 1, h).split(",")[0]));
                      m = [];
                      -1 != u && (m = String(I[u]).split(":::"));
                      if (p == l.substring(b + 1, h).split(",")[0] || m.includes(p)) {
                        k += f[0] + "|||";
                        break;
                      }
                      t++;
                    }
                    e++;
                  }
                  "" !== k && D.push(v[d][0].target_evolution + "(" + l.substring(b + 1, h).split(",")[1] + ")::: " + l.substring(b + 1, h).split(",")[0] + "::: " + k + "::: " + g[n(v[d][0].monster, g)].name + "::: " + v[d][1]);
                }
                b--;
              } else {
                "]" == a.charAt(0) && (h = b);
              }
              b--;
              a = l.substring(b, b + 3);
            }
            f = c;
          } while (v[d][0].monster != f);
          d++;
        }
        d = 0;
        for (f = [[]]; d < D.length;) {
          h = [];
          e = D[d].split("::: ");
          a = 1;
          for (c = !0; a < f.length;) {
            if ("undefined" !== typeof f[a] && f[a][0] == e[1]) {
              c = !1;
              break;
            }
            a++;
          }
          c ? (h.push(e[1]), h.push(e[0].split("(")[1].split(")")[0]), h.push(e[2] + ":::"), c = n(h[0], g), h.push(g[c].image60_href), c = n(e[0].split("(")[0], g), h.push(e[3] + " -> " + g[c].name), c = n(h[0], g), h.push(g[c].name), h.push(e[0].split("(")[1].split(")")[0]), h.push(e[4]), f.push(h)) : (f[a][2] += e[2] + ":::", c = n(e[0].split("(")[0], g), f[a][4] += ":::" + e[3] + " -> " + g[c].name, n(f[a][0], g), f[a][6] = f[a][6] + ":::" + e[0].split("(")[1].split(")")[0], f[a][1] = parseInt(f[a][1]) + 
          parseInt(e[0].split("(")[1].split(")")[0]), f[a][7] = f[a][7] + ":::" + e[4]);
          d++;
        }
        h = '<style type="text/css">.tg {border-collapse:collapse;border-spacing:0;}.tg td{font-family:Arial, sans-serif;font-size:14px;padding:2px 2px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;}.tg th{font-family:Arial, sans-serif;font-size:14px;font-weight:normal;padding:2px 2px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;}.tg .tg-0ord{text-align:right}.tooltip2 { position: relative;}.tooltip2 .tooltip2text { visibility: hidden; width: auto; background-color: black; border-style: solid; border-color: #ffffff; color: #fff; text-align: center; padding: 5px 20px; border-radius: 6px; position: absolute; z-index: 1;}.tooltip2:hover .tooltip2text { visibility: visible;}</style>';
        for (d = 1; d < f.length;) {
          a = '<table class="tg" style="display:inline"> <tr class="tooltip2"> <th class="tg-031e" colspan="2"><a href="http://www.puzzledragonx.com/en/monster.asp?n=', c = '<tr> <td class="tg-031e">H</td> <td class="tg-0ord">0</td> </tr>', b = '<tr> <td class="tg-031e">M</td> <td class="tg-0ord">0</td> </tr>', e = '<tr> <td class="tg-031e">L</td> <td class="tg-0ord">0</td> </tr>', k = '<tr> <td class="tg-031e">F</td> <td class="tg-0ord">0</td> </tr>', t = f[d][6].split(":::"), p = f[d][7].split(":::"), 
          u = f[d][4].split(":::"), a += f[d][0] + '" target="_blank" tabindex="-1"><span class="tooltip2text">Found in today\'s Dungeons:', a += F(f[d][2].split(":::")).join("<br>").split("|||").join("<br>") + '</span><img src="https://www.padherder.com/', a += f[d][3] + '"alt="Mountain View" style="width:45px;height:45px;"></th></a> </tr> <tr> <td class="tg-0ord" colspan="2">', a += f[d][1] + "</td> </tr> ", f[d][7].includes("3") && (c = y(t, p, u, 3, "H")), f[d][7].includes("2") && (b = y(t, p, 
          u, 2, "M")), f[d][7].includes("1") && (e = y(t, p, u, 1, "L")), f[d][7].includes("0") && (k = y(t, p, u, 0, "F")), h += a + (c + b + e + k), d++;
        }
        d = 0;
        b = 1;
        for (a = f = ""; d < C.length;) {
          e = C[d].split("|||");
          k = e[1].split("::: ");
          1 == b ? (f = k[1], a += '<table class="tg" style="display:inline"> <tr class="tooltip2"> <th class="tg-031e" colspan="2"><a href="http://www.puzzledragonx.com/en/monster.asp?n=', c = n(e[0].split("(")[0], g), a += e[0].split("(")[0] + '" target="_blank" tabindex="-1"><img src="https://www.padherder.com/', a += g[c].image60_href + '" alt="Mountain View" style="width:45px;height:45px;"></th> </tr> <tr> <td class="tg-0ord" colspan="2">', a += e[0].split("(")[1].split(")")[0] + "</td> </tr> <tr> ") : 
          (k = e[b].split("::: "), n(k[1], g));
          a += '<tr class="tooltip2"> <th class="tg-031e" colspan="2"><a href="http://www.puzzledragonx.com/en/monster.asp?n=';
          a += k[1] + '" target="_blank" tabindex="-1"><span class="tooltip2text">';
          for (c = g[n(k[1], g)].image60_href; b < e.length - 1;) {
            k = e[b].split("::: ");
            n(k[1], g);
            if (k[1] == f) {
              a += k[0] + "<br>";
            } else {
              d--;
              f = k[1];
              break;
            }
            b++;
          }
          b > e.length - 2 && (b = 1);
          a += '</span><img src="https://www.padherder.com/';
          a += c + '" alt="Mountain View" style="width:45px;height:45px;"></th> </tr> <tr>';
          d++;
        }
        h += a;
        d = document.createElement("div");
        d.innerHTML = h;
        h = document.evaluate('//*[@class="col-xs-12"]/p', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        try {
          h.insertBefore(d, h.childNodes[0]);
        } catch (J) {
          h = document.evaluate('//*[@id="edit-form"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue, h.insertBefore(d, h.childNodes[0]);
        }
      });
    }
  });
})();
