//Using Google Closure compiler

// ==UserScript==
// @name         Padherder
// @namespace    http://tampermonkey.net/
// @version      0.79
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
  function n(f, a) {
    var d = f;
    d > a.length && (d = a.length - 1);
    try {
      for (; a[d].id != f;) {
        if (d--, 0 > d) {
          return console.log("Monster ID: " + f + " not found in padherder database"), 2897;
        }
      }
    } catch (g) {
      return console.log("Monster ID: " + f + " not found in padherder database"), 2898;
    }
    return d;
  }
  function z(f) {
    return document.evaluate(f, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  }
  function y(f, a, d, g, e) {
    for (var k = 0, h = 0, l = ""; k < f.length;) {
      a[k] == g && (h += parseInt(f[k]), l += f[k] + " for " + d[k] + "<br>"), k++;
    }
    return '<tr class="tooltip2"> <td class="tg-031e">' + e + '</td> <td class="tg-0ord">' + h + '<span class="tooltip2text">' + l + "</span></td> </tr>";
  }
  function G(f) {
    return f.sort().filter(function(a, d, g) {
      return !d || a != g[d - 1];
    });
  }
  var A = (new Date((new Date).getTime() + -72E5)).getDay(), H = [147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 227, 234, 246, 247, 248, 249, 250, 251, 321, 797, 915, 916, 1002, 1085, 1086, 1087, 1176, 1294, 1295], I = [2006, 1839, 1712, 1536, 599, 3015, 2805, 2739, 2637, 2184, 2092, 1252, 2926, 2722, 2398, 2008, 1750, 1590, 1272, 1225, 1210, 1090, 984, 228, 839, 763, 273, 2391, 1461, 1841, 1737, 597, 
  1473, 3221, 2277, 2182, 1602, 1532, 1458, 1307, 1208, 2383, 2263, 2104, 1713, 1273, 1227, 1091, 835, 765, 434, 275, 3074, 2808, 1945, 2807, 1189, 2738, 1223, 1843, 2987, 2838, 2754, 2741, 2639, 2129, 1837, 1711, 1629, 1209, 1206, 1098, 651, 3329, 3327, 2320, 1754, 1472, 1425, 1274, 1092, 1190, 612, 767, 432, 436, 277, 2946, 1250, 2892, 1119, 2664, 2528, 1923, 1845, 1727, 1422, 1342, 917, 3155, 3013, 2742, 2234, 1525, 1463, 1459, 1322, 1246, 3087, 2551, 2400, 2127, 1631, 1093, 810, 1220, 666, 282, 
  837, 2947, 2737, 2526, 2180, 1847, 1646, 1371, 645, 1215, 985, 918, 3245, 3153, 2809, 2069, 2130, 1465, 1248, 1207, 814, 2402, 2128, 1601, 771, 279], J = ["565:::566", 1838, "682:::683", "598:::599", 598, 3014, 2804, "822:::229:::99:::98", 2636, 2183, 2091, 1251, 2978, 2721, 2397, 2007, 1749, 1589, "316:::79:::78", 1224, "399:::398", "211:::23:::22:::21", "512:::107:::106", 182, 838, 762, 272, "1461:::1460", 1460, 1840, "597:::596", 596, "683:::682", 3220, 2276, 2181, 1167, 1531, 783, 1306, "513:::222:::221", 
  2382, 2262, 2103, 738, "317:::81:::80", 1226, "212:::26:::25:::24", "834:::833:::832", 764, 433, 274, 3073, "1945:::1944", 1944, "1189:::1188", 1188, "1223:::1222", 1222, 1842, 2986, 2837, 2753, "824:::231:::103:::102", 2638, "778:::777", 1836, 1710, 1628, "514:::224:::223", 285, 1097, 650, 3328, 3326, 2319, 1753, 1471, 1424, "318:::83:::82", "213:::29:::28:::27", "744:::743::::742", 611, 766, 431, 435, 276, "1250:::1249", 1249, "1119:::1118", 1118, "812:::811", 2527, 1922, 1844, "694:::515:::226:::225", 
  "649:::648", "781:::780", "188:::187", 3154, 3012, "825:::232:::105:::104", 2233, 1524, 1462, 785, "769:::768", 1245, 3086, 2550, 2399, "319:::85:::84", 1630, "214:::32:::31:::30", 809, 1219, "349:::348", 281, 836, "1062:::1061", 2736, 2525, "814:::813", 1846, "647:::646", "645:::644", 644, "683:::682", "190:::189", "188:::187", 3244, 3152, "2069:::2068", 2068, 544, 1464, 1247, 287, 813, 2401, "320:::87:::86", 1595, 770, 278], q = [], B = GM_getValue("date_sync", -1), F, v, C, m = [], r, l, w = 
  [], D = [], E = [], f = [], x;
  q.push($.get("https://gist.githubusercontent.com/padxExtender/e11935cf82505acbdd2b6e03a8cfe440/raw/file1.txt", function(f) {
    v = f.split("\n");
    B = v[0];
  }));
  q.push($.get("https://gist.githubusercontent.com/padxExtender/e11935cf82505acbdd2b6e03a8cfe440/raw/", function(f) {
    C = f.split("\n");
    F = C[0];
  }));
  $.when(q[0], q[1]).done(function() {
    if (B != A && F != A) {
      alert("Padx database not updated for today, please visit puzzledragonx.com/ and let the script update the database");
    } else {
      B == A && (v = C);
      var q = document.evaluate('//*[@id="username-dropdown"]/span', document, null, XPathResult.ANY_TYPE, null).iterateNext();
      m.push($.get("https://www.padherder.com/user-api/user/" + q.textContent + "/", function(a) {
        r = a;
      }));
      m.push($.get("https://raw.githubusercontent.com/mdnpascual/Padherder_Extender/master/json_template/evolutions.json", function(a) {
        JSON.parse(a);
        l = a;
      }));
      m.push($.get("https://raw.githubusercontent.com/mdnpascual/Padherder_Extender/master/json_template/monsters.json", function(a) {
        f = JSON.parse(a);
      }));
      m.push($.get("https://raw.githubusercontent.com/mdnpascual/Padherder_Extender/master/json_template/active_skills.json", function(a) {
        JSON.parse(a);
        x = a;
      }));
      $.when(m[0], m[1], m[2], m[3]).done(function() {
        for (var a, d, g, e, k, h, p, b, c = 0, t, u; c < parseInt(r.monsters.length);) {
          null !== r.monsters[c].target_evolution && 1 < parseInt(r.monsters[c].priority) && w.push([r.monsters[c], r.monsters[c].priority]);
          a = '"name":"';
          g = null == r.monsters[c].target_evolution ? parseInt(r.monsters[c].monster) - 1 : parseInt(r.monsters[c].target_evolution) - 1;
          k = n(g + 1, f);
          d = a;
          a = f[k].active_skill;
          a = null === a ? null : a.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
          a = d + a + '"';
          b = x.search(a);
          if (-1 == b) {
            console.log("Skill: " + a + f[k].active_skill + " not in padherder database");
          } else {
            h = b - 2;
            for (a = x.substring(b, b + 15); '"max_cooldown":' !== a;) {
              b--, a = x.substring(b, b + 15);
            }
            for (t = x.substring(b + 15, h + 1); ',"effect":"' !== a;) {
              b--, a = x.substring(b, b + 11);
            }
            for (h = b; '"min_cooldown":' !== a;) {
              b--, a = x.substring(b, b + 15);
            }
            u = x.substring(b + 15, h);
            if (1 < parseInt(r.monsters[c].priority) && parseInt(r.monsters[c].current_skill) < t - u + 1) {
              var m = !1, q = "";
              for (b = 1; b < v.length;) {
                a = v[b].split("::: ");
                e = a[1].split(",");
                for (p = 0; p < e.length - 1;) {
                  d = n(e[p], f);
                  if (f[d].active_skill == f[k].active_skill) {
                    q = m ? q + a[0] + "::: " + f[d].id + "::: " + f[d].name + "|||" : q + (g + 1) + "(" + (t - u + 1 - r.monsters[c].current_skill) + ")|||" + a[0] + "::: " + f[d].id + "::: " + f[d].name + "|||";
                    m = !0;
                    break;
                  }
                  p++;
                }
                b++;
              }
              "" !== q && D.push(q);
            }
          }
          c++;
        }
        for (c = 0; c < parseInt(w.length);) {
          e = w[c][0].target_evolution;
          do {
            b = l.search('evolves_to":' + e + "}");
            if (-1 == b) {
              console.log("Monster: " + w[c][0].target_evolution + " not in padherder database");
              break;
            }
            for (a = l.substring(b, b + 5); '":[{"' !== a;) {
              b--, a = l.substring(b, b + 5);
            }
            d = b - 1;
            for (a = l.substring(d, d + 4); '}],"' !== a;) {
              d--, a = l.substring(d, d + 4);
            }
            d = l.substring(d + 4, b);
            b = l.search('evolves_to":' + e);
            for (a = l.substring(b, b + 5); ":[[" !== a;) {
              if ("[" == a.charAt(0)) {
                a = parseInt(l.substring(b + 1, h).substring(0, l.substring(b + 1, h).search(",")));
                if (!H.includes(a)) {
                  g = 1;
                  for (k = ""; g < v.length;) {
                    a = v[g].split("::: ");
                    e = a[1].split(",");
                    for (t = 0; t < e.length - 1;) {
                      p = e[t];
                      u = I.indexOf(parseInt(l.substring(b + 1, h).split(",")[0]));
                      m = [];
                      -1 != u && (m = String(J[u]).split(":::"));
                      if (p == l.substring(b + 1, h).split(",")[0] || m.includes(p)) {
                        k += a[0] + "|||";
                        break;
                      }
                      t++;
                    }
                    g++;
                  }
                  "" !== k && E.push(w[c][0].target_evolution + "(" + l.substring(b + 1, h).split(",")[1] + ")::: " + l.substring(b + 1, h).split(",")[0] + "::: " + k + "::: " + f[n(w[c][0].monster, f)].name + "::: " + w[c][1]);
                }
                b--;
              } else {
                "]" == a.charAt(0) && (h = b);
              }
              b--;
              a = l.substring(b, b + 3);
            }
            e = d;
          } while (w[c][0].monster != e);
          c++;
        }
        c = 0;
        for (e = [[]]; c < E.length;) {
          h = [];
          g = E[c].split("::: ");
          a = 1;
          for (d = !0; a < e.length;) {
            if ("undefined" !== typeof e[a] && e[a][0] == g[1]) {
              d = !1;
              break;
            }
            a++;
          }
          d ? (h.push(g[1]), h.push(g[0].split("(")[1].split(")")[0]), h.push(g[2] + ":::"), d = n(h[0], f), h.push(f[d].image60_href), d = n(g[0].split("(")[0], f), h.push(g[3] + " -> " + f[d].name), d = n(h[0], f), h.push(f[d].name), h.push(g[0].split("(")[1].split(")")[0]), h.push(g[4]), e.push(h)) : (e[a][2] += g[2] + ":::", d = n(g[0].split("(")[0], f), e[a][4] += ":::" + g[3] + " -> " + f[d].name, n(e[a][0], f), e[a][6] = e[a][6] + ":::" + g[0].split("(")[1].split(")")[0], e[a][1] = parseInt(e[a][1]) + 
          parseInt(g[0].split("(")[1].split(")")[0]), e[a][7] = e[a][7] + ":::" + g[4]);
          c++;
        }
        h = '<style type="text/css">.tg {border-collapse:collapse;border-spacing:0;}.tg td{font-family:Arial, sans-serif;font-size:14px;padding:2px 2px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;}.tg th{font-family:Arial, sans-serif;font-size:14px;font-weight:normal;padding:2px 2px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;}.tg .tg-0ord{text-align:right}.tooltip2 { position: relative;}.tooltip2 .tooltip2text { visibility: hidden; width: auto; background-color: black; border-style: solid; border-color: #ffffff; color: #fff; text-align: center; padding: 5px 20px; border-radius: 6px; position: absolute; z-index: 1;}.tooltip2:hover .tooltip2text { visibility: visible;}</style>';
        for (c = 1; c < e.length;) {
          a = '<table class="tg" style="display:inline"> <tr class="tooltip2"> <th class="tg-031e" colspan="2"><a href="http://www.puzzledragonx.com/en/monster.asp?n=', d = '<tr> <td class="tg-031e">H</td> <td class="tg-0ord">0</td> </tr>', b = '<tr> <td class="tg-031e">M</td> <td class="tg-0ord">0</td> </tr>', g = '<tr> <td class="tg-031e">L</td> <td class="tg-0ord">0</td> </tr>', k = '<tr> <td class="tg-031e">F</td> <td class="tg-0ord">0</td> </tr>', t = e[c][6].split(":::"), p = e[c][7].split(":::"), 
          u = e[c][4].split(":::"), a += e[c][0] + '" target="_blank" tabindex="-1"><span class="tooltip2text">Found in today\'s Dungeons:', a += G(e[c][2].split(":::")).join("<br>").split("|||").join("<br>") + '</span><img src="https://www.padherder.com/', a += e[c][3] + '" alt="Mountain View" style="width:45px;height:45px;"></a></th> </tr> <tr> <td class="tg-0ord" colspan="2">', a += e[c][1] + "</td> </tr> ", e[c][7].includes("3") && (d = y(t, p, u, 3, "H")), e[c][7].includes("2") && (b = y(t, 
          p, u, 2, "M")), e[c][7].includes("1") && (g = y(t, p, u, 1, "L")), e[c][7].includes("0") && (k = y(t, p, u, 0, "F")), h += a + (d + b + g + k) + "</table>", c++;
        }
        h += "<br><br>";
        c = 0;
        b = 1;
        for (a = e = ""; c < D.length;) {
          g = D[c].split("|||");
          k = g[1].split("::: ");
          1 == b ? (0 < c && (a += "</table>"), e = k[1], a += '<table class="tg" style="display:inline"> <tr class="tooltip2"> <th class="tg-031e" colspan="2"><a href="http://www.puzzledragonx.com/en/monster.asp?n=', d = n(g[0].split("(")[0], f), a += g[0].split("(")[0] + '" target="_blank" tabindex="-1"><img src="https://www.padherder.com/', a += f[d].image60_href + '" alt="Mountain View" style="width:45px;height:45px;"></a></th> </tr> <tr> <td class="tg-0ord" colspan="2">', a += g[0].split("(")[1].split(")")[0] + 
          "</td> </tr>") : (k = g[b].split("::: "), n(k[1], f));
          a += '<tr class="tooltip2"> <th class="tg-031e" colspan="2"><a href="http://www.puzzledragonx.com/en/monster.asp?n=';
          a += k[1] + '" target="_blank" tabindex="-1"><span class="tooltip2text">';
          for (d = f[n(k[1], f)].image60_href; b < g.length - 1;) {
            k = g[b].split("::: ");
            n(k[1], f);
            if (k[1] == e) {
              a += k[0] + "<br>";
            } else {
              c--;
              e = k[1];
              break;
            }
            b++;
          }
          b > g.length - 2 && (b = 1);
          a += '</span><img src="https://www.padherder.com';
          a += d + '" alt="Mountain View" style="width:45px;height:45px;"></a></th> </tr>';
          c++;
        }
        h += a;
        c = document.createElement("div");
        c.id = "UC5HPmOW8yDEzfI";
        h += "</table><br><select>";
        for (g = 1; g < v.length;) {
          a = v[g].split("::: "), h += '<option value="' + a[0] + '">' + a[0] + "</option>", g++;
        }
        c.innerHTML = h + "</select>";
        h = z('//*[@class="col-xs-12"]/p');
        try {
          h.insertBefore(c, h.childNodes[0]);
        } catch (K) {
          h = z('//*[@id="edit-form"]'), h.insertBefore(c, h.childNodes[0]);
        }
      });
      z('//*[@id="UC5HPmOW8yDEzfI"]');
    }
  });
})();
