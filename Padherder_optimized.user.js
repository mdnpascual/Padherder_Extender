//Using Google Closure compiler

// ==UserScript==
// @name         Padherder
// @namespace    PadherderExtender
// @version      0.81
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
  function l(e, b) {
    var d = e;
    d > b.length && (d = b.length - 1);
    for (var m = 0; m < b.length - 1;) {
      if (b[m].pdx_id == e) {
        return m;
      }
      m++;
    }
    try {
      for (; b[d].id != e;) {
        if (d--, 0 > d) {
          return console.log("Monster ID: " + e + " not found in padherder database"), 2897;
        }
      }
    } catch (q) {
      return console.log("Monster ID: " + e + " not found in padherder database"), 2898;
    }
    return d;
  }
  function u(e, b, d, m, l) {
    for (var f = 0, a = 0, h = ""; f < e.length;) {
      b[f] == m && (a += parseInt(e[f]), h += e[f] + " for " + d[f] + "<br>"), f++;
    }
    return '<tr class="tooltip2"> <td class="tg-031e">' + l + '</td> <td class="tg-0ord">' + a + '<span class="tooltip2text">' + h + "</span></td> </tr>";
  }
  function r(e) {
    return e.sort().filter(function(b, d, e) {
      return !d || b != e[d - 1];
    });
  }
  var B = (new Date((new Date).getTime() + -72E5)).getDay(), H = [147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 227, 234, 246, 247, 248, 249, 250, 251, 321, 797, 915, 916, 1002, 1085, 1086, 1087, 1176, 1294, 1295], I = [2006, 1839, 1712, 1536, 599, 3015, 2805, 2739, 2637, 2184, 2092, 1252, 2926, 2722, 2398, 2008, 1750, 1590, 1272, 1225, 1210, 1090, 984, 228, 839, 763, 273, 2391, 1461, 1841, 1737, 597,
  1473, 3221, 2277, 2182, 1602, 1532, 1458, 1307, 1208, 2383, 2263, 2104, 1713, 1273, 1227, 1091, 835, 765, 434, 275, 3074, 2808, 1945, 2807, 1189, 2738, 1223, 1843, 2987, 2838, 2754, 2741, 2639, 2129, 1837, 1711, 1629, 1209, 1206, 1098, 651, 3329, 3327, 2320, 1754, 1472, 1425, 1274, 1092, 1190, 612, 767, 432, 436, 277, 2946, 1250, 2892, 1119, 2664, 2528, 1923, 1845, 1727, 1422, 1342, 917, 3155, 3013, 2742, 2234, 1525, 1463, 1459, 1322, 1246, 3087, 2551, 2400, 2127, 1631, 1093, 810, 1220, 666, 282,
  837, 2947, 2737, 2526, 2180, 1847, 1646, 1371, 645, 1215, 985, 918, 3245, 3153, 2809, 2069, 2130, 1465, 1248, 1207, 814, 2402, 2128, 1601, 771, 279], J = ["565:::566", 1838, "682:::683", "598:::599", 598, 3014, 2804, "822:::229:::99:::98", 2636, 2183, 2091, 1251, 2978, 2721, 2397, 2007, 1749, 1589, "316:::79:::78", 1224, "399:::398", "211:::23:::22:::21", "512:::107:::106", 182, 838, 762, 272, "1461:::1460", 1460, 1840, "597:::596", 596, "683:::682", 3220, 2276, 2181, 1167, 1531, 783, 1306, "513:::222:::221",
  2382, 2262, 2103, 738, "317:::81:::80", 1226, "212:::26:::25:::24", "834:::833:::832", 764, 433, 274, 3073, "1945:::1944", 1944, "1189:::1188", 1188, "1223:::1222", 1222, 1842, 2986, 2837, 2753, "824:::231:::103:::102", 2638, "778:::777", 1836, 1710, 1628, "514:::224:::223", 285, 1097, 650, 3328, 3326, 2319, 1753, 1471, 1424, "318:::83:::82", "213:::29:::28:::27", "744:::743::::742", 611, 766, 431, 435, 276, "1250:::1249", 1249, "1119:::1118", 1118, "812:::811", 2527, 1922, 1844, "694:::515:::226:::225",
  "649:::648", "781:::780", "188:::187", 3154, 3012, "825:::232:::105:::104", 2233, 1524, 1462, 785, "769:::768", 1245, 3086, 2550, 2399, "319:::85:::84", 1630, "214:::32:::31:::30", 809, 1219, "349:::348", 281, 836, "1062:::1061", 2736, 2525, "814:::813", 1846, "647:::646", "645:::644", 644, "683:::682", "190:::189", "188:::187", 3244, 3152, "2069:::2068", 2068, 544, 1464, 1247, 287, 813, 2401, "320:::87:::86", 1595, 770, 278], v = [], C = GM_getValue("date_sync", -1), G, x, D, n = [], t, p, A =
  [], y = [], E = [], F = [], e = [], z;
  v.push($.get("https://gist.githubusercontent.com/padxExtender/e11935cf82505acbdd2b6e03a8cfe440/raw/file1.txt", function(e) {
    x = e.split("\n");
    C = x[0];
  }));
  v.push($.get("https://gist.githubusercontent.com/padxExtender/e11935cf82505acbdd2b6e03a8cfe440/raw/", function(e) {
    D = e.split("\n");
    G = D[0];
  }));
  $.when(v[0], v[1]).done(function() {
    if (C != B && G != B) {
      alert("Padx database not updated for today, please visit puzzledragonx.com/ and let the script update the database");
    } else {
      C == B && (x = D);
      var v = document.evaluate('//*[@id="username-dropdown"]/span', document, null, XPathResult.ANY_TYPE, null).iterateNext();
      n.push($.get("https://www.padherder.com/user-api/user/" + v.textContent + "/", function(b) {
        t = b;
      }));
      n.push($.get("https://raw.githubusercontent.com/mdnpascual/Padherder_Extender/master/json_template/evolutions.json", function(b) {
        JSON.parse(b);
        p = b;
      }));
      n.push($.get("https://raw.githubusercontent.com/mdnpascual/Padherder_Extender/master/json_template/monsters.json", function(b) {
        e = JSON.parse(b);
      }));
      n.push($.get("https://raw.githubusercontent.com/mdnpascual/Padherder_Extender/master/json_template/active_skills.json", function(b) {
        JSON.parse(b);
        z = b;
      }));
      $.when(n[0], n[1], n[2], n[3]).done(function() {
        for (var b = 0, d, m, q, f = 1; f < x.length;) {
          A.push(x[f].split("::: ")[0]), f++;
        }
        for (; b < parseInt(t.monsters.length);) {
          null !== t.monsters[b].target_evolution && 1 < parseInt(t.monsters[b].priority) && y.push([t.monsters[b], t.monsters[b].priority]);
          var a = '"name":"', h = null == t.monsters[b].target_evolution ? parseInt(t.monsters[b].monster) - 1 : parseInt(t.monsters[b].target_evolution) - 1;
          var k = l(h + 1, e);
          f = a;
          a = e[k].active_skill;
          a = null === a ? null : a.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
          a = f + a + '"';
          var c = z.search(a);
          if (-1 == c) {
            console.log("Skill: " + a + e[k].active_skill + " not in padherder database");
          } else {
            d = c - 2;
            for (a = z.substring(c, c + 15); '"max_cooldown":' !== a;) {
              c--, a = z.substring(c, c + 15);
            }
            for (m = z.substring(c + 15, d + 1); ',"effect":"' !== a;) {
              c--, a = z.substring(c, c + 11);
            }
            for (d = c; '"min_cooldown":' !== a;) {
              c--, a = z.substring(c, c + 15);
            }
            q = z.substring(c + 15, d);
            if (1 < parseInt(t.monsters[b].priority) && parseInt(t.monsters[b].current_skill) < m - q + 1) {
              var w = !1, n = "";
              for (c = 1; c < x.length;) {
                a = x[c].split("::: ");
                for (var g = a[1].split(","), v = 0; v < g.length - 1;) {
                  f = l(g[v], e);
                  if (e[f].active_skill == e[k].active_skill) {
                    n = w ? n + a[0] + "::: " + e[f].id + "::: " + e[f].name + "|||" : n + (h + 1) + "(" + (m - q + 1 - t.monsters[b].current_skill) + ")|||" + a[0] + "::: " + e[f].id + "::: " + e[f].name + "|||";
                    w = !0;
                    break;
                  }
                  v++;
                }
                c++;
              }
              "" !== n && E.push(n);
            }
          }
          b++;
        }
        for (b = 0; b < parseInt(y.length);) {
          g = y[b][0].target_evolution;
          do {
            c = p.search('evolves_to":' + g + "}");
            if (-1 == c) {
              console.log("Monster: " + y[b][0].target_evolution + " not in padherder database");
              break;
            }
            for (a = p.substring(c, c + 5); '":[{"' !== a;) {
              c--, a = p.substring(c, c + 5);
            }
            f = c - 1;
            for (a = p.substring(f, f + 4); '}],"' !== a;) {
              f--, a = p.substring(f, f + 4);
            }
            f = p.substring(f + 4, c);
            c = p.search('evolves_to":' + g);
            for (a = p.substring(c, c + 5); ":[[" !== a;) {
              if ("[" == a.charAt(0)) {
                a = parseInt(p.substring(c + 1, d).substring(0, p.substring(c + 1, d).search(",")));
                if (!H.includes(a)) {
                  h = 1;
                  for (k = ""; h < x.length;) {
                    a = x[h].split("::: ");
                    g = a[1].split(",");
                    for (m = 0; m < g.length - 1;) {
                      q = g[m];
                      w = I.indexOf(parseInt(p.substring(c + 1, d).split(",")[0]));
                      n = [];
                      -1 != w && (n = String(J[w]).split(":::"));
                      if (q == p.substring(c + 1, d).split(",")[0] || n.includes(q)) {
                        k += a[0] + "|||";
                        break;
                      }
                      m++;
                    }
                    h++;
                  }
                  "" !== k && F.push(y[b][0].target_evolution + "(" + p.substring(c + 1, d).split(",")[1] + ")::: " + p.substring(c + 1, d).split(",")[0] + "::: " + k + "::: " + e[l(y[b][0].monster, e)].name + "::: " + y[b][1]);
                }
                c--;
              } else {
                "]" == a.charAt(0) && (d = c);
              }
              c--;
              a = p.substring(c, c + 3);
            }
            g = f;
          } while (y[b][0].monster != g);
          b++;
        }
        b = 0;
        for (g = [[]]; b < F.length;) {
          d = [];
          h = F[b].split("::: ");
          a = 1;
          for (f = !0; a < g.length;) {
            if ("undefined" !== typeof g[a] && g[a][0] == h[1]) {
              f = !1;
              break;
            }
            a++;
          }
          f ? (d.push(h[1]), d.push(h[0].split("(")[1].split(")")[0]), d.push(h[2] + ":::"), f = l(d[0], e), d.push(e[f].image60_href), f = l(h[0].split("(")[0], e), d.push(h[3] + " -> " + e[f].name), f = l(d[0], e), d.push(e[f].name), d.push(h[0].split("(")[1].split(")")[0]), d.push(h[4]), g.push(d)) : (g[a][2] += h[2] + ":::", f = l(h[0].split("(")[0], e), g[a][4] += ":::" + h[3] + " -> " + e[f].name, l(g[a][0], e), g[a][6] = g[a][6] + ":::" + h[0].split("(")[1].split(")")[0], g[a][1] = parseInt(g[a][1]) +
          parseInt(h[0].split("(")[1].split(")")[0]), g[a][7] = g[a][7] + ":::" + h[4]);
          b++;
        }
        d = '<style type="text/css"> .tg { border-collapse: collapse; border-spacing: 0; } .tg td { font-family: Arial, sans-serif; font-size: 14px; padding: 2px 2px; border-style: solid; border-width: 1px; overflow: hidden; word-break: normal; } .tg th { font-family: Arial, sans-serif; font-size: 14px; font-weight: normal; padding: 2px 2px; border-style: solid; border-width: 1px; overflow: hidden; word-break: normal; } .tg .tg-0ord { text-align: right }.tf { border-collapse: collapse; border-spacing: 0; } .tf td { font-family: Arial, sans-serif; font-size: 14px; padding: 2px 2px; border-style: solid; border-width: 8px; border-color:red; overflow: hidden; word-break: normal; } .tf th { font-family: Arial, sans-serif; font-size: 14px; font-weight: normal; padding: 2px 2px; border-style: solid; border-width: 8px; border-color:red; overflow: hidden; word-break: normal; } .tf .tg-0ord { text-align: right } .tooltip2 { position: relative; } .tooltip2 .tooltip2text { visibility: hidden; width: auto; background-color: black; border-style: solid; border-color: #ffffff; color: #fff; text-align: center; padding: 5px 20px; border-radius: 6px; position: absolute; z-index: 1; } .tooltip2:hover .tooltip2text { visibility: visible; }</style>';
        for (b = 1; b < g.length;) {
          a = '<table class="tg" style="display:inline"> <tr class="tooltip2"> <th class="tg-031e" colspan="2"><a href="http://www.puzzledragonx.com/en/monster.asp?n=', f = '<tr> <td class="tg-031e">H</td> <td class="tg-0ord">0</td> </tr>', c = '<tr> <td class="tg-031e">M</td> <td class="tg-0ord">0</td> </tr>', h = '<tr> <td class="tg-031e">L</td> <td class="tg-0ord">0</td> </tr>', k = '<tr> <td class="tg-031e">F</td> <td class="tg-0ord">0</td> </tr>', m = g[b][6].split(":::"), q = g[b][7].split(":::"),
          w = g[b][4].split(":::"), a += g[b][0] + '" target="_blank" tabindex="-1"><span class="tooltip2text">Found in today\'s Dungeons:', a += r(g[b][2].split(":::")).join("<br>").split("|||").join("<br>") + '</span><img src="https://www.padherder.com/', a += g[b][3] + '" alt="Mountain View" style="width:45px;height:45px;"></a></th> </tr> <tr> <td class="tg-0ord" colspan="2">', a += g[b][1] + "</td> </tr> ", g[b][7].includes("3") && (f = u(m, q, w, 3, "H")), g[b][7].includes("2") && (c = u(m,
          q, w, 2, "M")), g[b][7].includes("1") && (h = u(m, q, w, 1, "L")), g[b][7].includes("0") && (k = u(m, q, w, 0, "F")), d += a + (f + c + h + k) + "</table>", b++;
        }
        d += "<br><br>";
        b = 0;
        c = 1;
        for (a = g = ""; b < E.length;) {
          h = E[b].split("|||");
          k = h[1].split("::: ");
          1 == c ? (0 < b && (a += "</table>"), g = k[1], a += '<table class="tg" style="display:inline"> <tr class="tooltip2"> <th class="tg-031e" colspan="2"><a href="http://www.puzzledragonx.com/en/monster.asp?n=', f = l(h[0].split("(")[0], e), a += h[0].split("(")[0] + '" target="_blank" tabindex="-1"><img src="https://www.padherder.com/', a += e[f].image60_href + '" alt="Mountain View" style="width:45px;height:45px;"></a></th> </tr> <tr> <td class="tg-0ord" colspan="2">', a += h[0].split("(")[1].split(")")[0] +
          "</td> </tr>") : (k = h[c].split("::: "), l(k[1], e));
          a += '<tr class="tooltip2"> <th class="tg-031e" colspan="2"><a href="http://www.puzzledragonx.com/en/monster.asp?n=';
          a += k[1] + '" target="_blank" tabindex="-1"><span class="tooltip2text">';
          for (f = e[l(k[1], e)].image60_href; c < h.length - 1;) {
            k = h[c].split("::: ");
            l(k[1], e);
            if (k[1] == g) {
              a += k[0] + "<br>";
            } else {
              b--;
              g = k[1];
              break;
            }
            c++;
          }
          c > h.length - 2 && (c = 1);
          a += '</span><img src="https://www.padherder.com';
          a += f + '" alt="Mountain View" style="width:45px;height:45px;"></a></th> </tr>';
          b++;
        }
        d += a;
        b = document.createElement("div");
        b.id = "UC5HPmOW8yDEzfI";
        d += '</table><br><select id="selectorrr"><option value="Dungeon Select">Dungeon Select</option>';
        h = 0;
        for (A = r(A); h < A.length;) {
          d += '<option value="' + A[h] + '">' + A[h] + "</option>", h++;
        }
        b.innerHTML = d + "</select>";
        d = getElementByXpath('//*[@class="col-xs-12"]/p');
        try {
          d.insertBefore(b, d.childNodes[0]);
        } catch (K) {
          d = getElementByXpath('//*[@id="edit-form"]'), d.insertBefore(b, d.childNodes[0]);
        }
      });
      getElementByXpath('//*[@id="UC5HPmOW8yDEzfI"]');
    }
  });
})();
$(document).on("change", "#selectorrr", function(l) {
  l = this.options[this.selectedIndex].text;
  for (var u = document.body.getElementsByClassName("tg"), r = 0; r < u.length;) {
    1 < u[r].classList.length && u[r].classList.remove("tf"), r++;
  }
  for (r = 0; r < u.length;) {
    -1 != u[r].textContent.search(l) && u[r].classList.add("tf"), r++;
  }
});
function getElementByXpath(l) {
  return document.evaluate(l, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
};