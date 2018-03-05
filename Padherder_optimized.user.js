//Using Google Closure compiler

// ==UserScript==
// @name         Padherder_test
// @namespace    PadherderExtender
// @version      0.84.1
// @description  Shows possible Skillup/Material monsters from descended dungeons in PadHerder site
// @author       MDuh
// @match        https://www.padherder.com/*
// @require      http://code.jquery.com/jquery-3.2.1.js
// @downloadURL  https://github.com/mdnpascual/Padherder_Extender/raw/master/Padherder.user.js
// @updateURL    https://github.com/mdnpascual/Padherder_Extender/raw/master/Padherder.user.js
// @grant        GM.getValue
// @grant        GM.setValue
// @run-at       document-end
// ==/UserScript==

(function() {
  function n(a, e) {
    if (!(a in z)) {
      var h = z;
      a: {
        var l = a;
        l > e.length && (l = e.length - 1);
        try {
          for (; e[l].id != a;) {
            if (e[l].id < l ? l++ : l--, 0 > l || l > e.length) {
              console.log("Monster ID: " + a + " not found in padherder database");
              var f = 2897;
              break a;
            }
          }
        } catch (b) {
          console.log("Monster ID: " + a + " not found in padherder database");
          f = 2898;
          break a;
        }
        f = l;
      }
      h[a] = f;
    }
    return z[a];
  }
  function t(a, e, h, l, f) {
    for (var b = 0, d = 0, m = ""; b < a.length;) {
      e[b] == l && (d += parseInt(a[b]), m += a[b] + " for " + h[b] + "<br>"), b++;
    }
    return '<tr class="tooltip2"> <td class="tg-031e">' + f + '</td> <td class="tg-0ord">' + d + '<span class="tooltip2text">' + m + "</span></td> </tr>";
  }
  function q(a) {
    return a.sort().filter(function(a, h, l) {
      return !h || a != l[h - 1];
    });
  }
  var H = (new Date((new Date).getTime() + -36E5)).getDay(), I = [147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 227, 234, 246, 247, 248, 249, 250, 251, 321, 797, 915, 916, 1002, 1085, 1086, 1087, 1176, 1294, 1295], J = [2006, 1839, 1712, 1536, 599, 3015, 2805, 2739, 2637, 2184, 2092, 1252, 2926, 2722, 2398, 2008, 1750, 1590, 1272, 1225, 1210, 1090, 984, 228, 839, 763, 273, 2391, 1461, 1841, 1737, 597, 
  1473, 3221, 2277, 2182, 1602, 1532, 1458, 1307, 1208, 2383, 2263, 2104, 1713, 1273, 1227, 1091, 835, 765, 434, 275, 3074, 2808, 1945, 2807, 1189, 2738, 1223, 1843, 2987, 2838, 2754, 2741, 2639, 2129, 1837, 1711, 1629, 1209, 1206, 1098, 651, 3329, 3327, 2320, 1754, 1472, 1425, 1274, 1092, 1190, 612, 767, 432, 436, 277, 2946, 1250, 2892, 1119, 2664, 2528, 1923, 1845, 1727, 1422, 1342, 917, 3155, 3013, 2742, 2234, 1525, 1463, 1459, 1322, 1246, 3087, 2551, 2400, 2127, 1631, 1093, 810, 1220, 666, 282, 
  837, 2947, 2737, 2526, 2180, 1847, 1646, 1371, 645, 1215, 985, 918, 3245, 3153, 2809, 2069, 2130, 1465, 1248, 1207, 814, 2402, 2128, 1601, 771, 279], K = ["565:::566", 1838, "682:::683", "598:::599", 598, 3014, 2804, "822:::229:::99:::98", 2636, 2183, 2091, 1251, 2978, 2721, 2397, 2007, 1749, 1589, "316:::79:::78", 1224, "399:::398", "211:::23:::22:::21", "512:::107:::106", 182, 838, 762, 272, "1461:::1460", 1460, 1840, "597:::596", 596, "683:::682", 3220, 2276, 2181, 1167, 1531, 783, 1306, "513:::222:::221", 
  2382, 2262, 2103, 738, "317:::81:::80", 1226, "212:::26:::25:::24", "834:::833:::832", 764, 433, 274, 3073, "1945:::1944", 1944, "1189:::1188", 1188, "1223:::1222", 1222, 1842, 2986, 2837, 2753, "824:::231:::103:::102", 2638, "778:::777", 1836, 1710, 1628, "514:::224:::223", 285, 1097, 650, 3328, 3326, 2319, 1753, 1471, 1424, "318:::83:::82", "213:::29:::28:::27", "744:::743::::742", 611, 766, 431, 435, 276, "1250:::1249", 1249, "1119:::1118", 1118, "812:::811", 2527, 1922, 1844, "694:::515:::226:::225", 
  "649:::648", "781:::780", "188:::187", 3154, 3012, "825:::232:::105:::104", 2233, 1524, 1462, 785, "769:::768", 1245, 3086, 2550, 2399, "319:::85:::84", 1630, "214:::32:::31:::30", 809, 1219, "349:::348", 281, 836, "1062:::1061", 2736, 2525, "814:::813", 1846, "647:::646", "645:::644", 644, "683:::682", "190:::189", "188:::187", 3244, 3152, "2069:::2068", 2068, 544, 1464, 1247, 287, 813, 2401, "320:::87:::86", 1595, 770, 278], E, v, F, k = [], r, p, A = [], w = [], B = [], C = [], h = [], x, L = 
  GM.getValue("commitVer", -1), z = GM.getValue("OffsetSeekerCacheStore", {}), M = document.evaluate('//*[@id="username-dropdown"]/span', document, null, XPathResult.ANY_TYPE, null).iterateNext();
  k.push($.get("https://gist.githubusercontent.com/padxExtender/e11935cf82505acbdd2b6e03a8cfe440/raw/file1.txt", function(a) {
    v = a.split("\n");
    E = v[0];
  }));
  k.push($.get("https://gist.githubusercontent.com/padxExtender/e11935cf82505acbdd2b6e03a8cfe440/raw/", function(a) {
    F = a.split("\n");
  }));
  k.push($.get("https://www.padherder.com/user-api/user/" + M.textContent + "/", function(a) {
    r = a;
  }));
  k.push($.get("https://raw.githubusercontent.com/mdnpascual/Padherder_Extender/master/json_template/evolutions.json", function(a) {
    JSON.parse(a);
    p = a;
  }));
  k.push($.get("https://raw.githubusercontent.com/mdnpascual/Padherder_Extender/master/json_template/monsters.json", function(a) {
    h = JSON.parse(a);
  }));
  k.push($.get("https://raw.githubusercontent.com/mdnpascual/Padherder_Extender/master/json_template/active_skills.json", function(a) {
    JSON.parse(a);
    x = a;
  }));
  k.push($.get("https://api.github.com/repos/mdnpascual/Padherder_Extender/commits", function(a) {
    L.then(function(e) {
      e != a[0].sha ? (z = {}, GM.setValue("commitVer", a[0].sha)) : z.then(function(a) {
        z = a;
      });
    });
  }));
  $.when(k[0], k[1], k[2], k[3], k[4], k[5], k[6]).done(function() {
    E != H && (v = F);
    for (var a = 0, e, k, l, f = 1; f < v.length;) {
      A.push(v[f].split("::: ")[0]), f++;
    }
    for (; a < parseInt(r.monsters.length);) {
      null !== r.monsters[a].target_evolution && 1 < parseInt(r.monsters[a].priority) && w.push([r.monsters[a], r.monsters[a].priority]);
      var b = '"name":"', d = null == r.monsters[a].target_evolution ? parseInt(r.monsters[a].monster) - 1 : parseInt(r.monsters[a].target_evolution) - 1;
      var m = n(d + 1, h);
      f = b;
      b = h[m].active_skill;
      b = null === b ? null : b.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
      b = f + b + '"';
      var c = x.search(b);
      if (-1 == c) {
        console.log("Skill: " + b + h[m].active_skill + " not in padherder database");
      } else {
        e = c - 2;
        for (b = x.substring(c, c + 15); '"max_cooldown":' !== b;) {
          c--, b = x.substring(c, c + 15);
        }
        for (k = x.substring(c + 15, e + 1); ',"effect":"' !== b;) {
          c--, b = x.substring(c, c + 11);
        }
        for (e = c; '"min_cooldown":' !== b;) {
          c--, b = x.substring(c, c + 15);
        }
        l = x.substring(c + 15, e);
        if (1 < parseInt(r.monsters[a].priority) && parseInt(r.monsters[a].current_skill) < k - l + 1) {
          var u = !1, y = "";
          for (c = 1; c < v.length;) {
            b = v[c].split("::: ");
            try {
              var g = b[1].split(",");
            } catch (G) {
              c++;
              continue;
            }
            for (var D = 0; D < g.length - 1;) {
              f = n(g[D], h);
              if (h[f].active_skill == h[m].active_skill) {
                y = u ? y + b[0] + "::: " + h[f].id + "::: " + h[f].name + "|||" : y + (d + 1) + "(" + (k - l + 1 - r.monsters[a].current_skill) + ")|||" + b[0] + "::: " + h[f].id + "::: " + h[f].name + "|||";
                u = !0;
                break;
              }
              D++;
            }
            c++;
          }
          "" !== y && B.push(y);
        }
      }
      a++;
    }
    for (a = 0; a < parseInt(w.length);) {
      d = w[a][0].target_evolution;
      do {
        c = p.search('evolves_to":' + d + "}");
        if (-1 == c) {
          console.log("Monster: " + w[a][0].target_evolution + " not in padherder database");
          break;
        }
        for (b = p.substring(c, c + 5); '":[{"' !== b;) {
          c--, b = p.substring(c, c + 5);
        }
        f = c - 1;
        for (b = p.substring(f, f + 4); '}],"' !== b;) {
          f--, b = p.substring(f, f + 4);
        }
        f = p.substring(f + 4, c);
        c = p.search('evolves_to":' + d);
        for (b = p.substring(c, c + 5); ":[[" !== b;) {
          if ("[" == b.charAt(0)) {
            b = parseInt(p.substring(c + 1, e).substring(0, p.substring(c + 1, e).search(",")));
            if (!I.includes(b)) {
              d = 1;
              for (m = ""; d < v.length;) {
                b = v[d].split("::: ");
                try {
                  g = b[1].split(",");
                } catch (G) {
                  d++;
                  continue;
                }
                for (k = 0; k < g.length - 1;) {
                  l = g[k];
                  u = J.indexOf(parseInt(p.substring(c + 1, e).split(",")[0]));
                  y = [];
                  -1 != u && (y = String(K[u]).split(":::"));
                  if (l == p.substring(c + 1, e).split(",")[0] || y.includes(l)) {
                    m += b[0] + "|||";
                    break;
                  }
                  k++;
                }
                d++;
              }
              "" !== m && C.push(w[a][0].target_evolution + "(" + p.substring(c + 1, e).split(",")[1] + ")::: " + p.substring(c + 1, e).split(",")[0] + "::: " + m + "::: " + h[n(w[a][0].monster, h)].name + "::: " + w[a][1]);
            }
            c--;
          } else {
            "]" == b.charAt(0) && (e = c);
          }
          c--;
          b = p.substring(c, c + 3);
        }
        d = f;
      } while (w[a][0].monster != d);
      a++;
    }
    a = 0;
    for (b = [[]]; a < C.length;) {
      e = [];
      d = C[a].split("::: ");
      g = 1;
      for (f = !0; g < b.length;) {
        if ("undefined" !== typeof b[g] && b[g][0] == d[1]) {
          f = !1;
          break;
        }
        g++;
      }
      f ? (e.push(d[1]), e.push(d[0].split("(")[1].split(")")[0]), e.push(d[2] + ":::"), f = n(e[0], h), e.push(h[f].image60_href), f = n(d[0].split("(")[0], h), e.push(d[3] + " -> " + h[f].name), f = n(e[0], h), e.push(h[f].name), e.push(d[0].split("(")[1].split(")")[0]), e.push(d[4]), b.push(e)) : (b[g][2] += d[2] + ":::", f = n(d[0].split("(")[0], h), b[g][4] += ":::" + d[3] + " -> " + h[f].name, n(b[g][0], h), b[g][6] = b[g][6] + ":::" + d[0].split("(")[1].split(")")[0], b[g][1] = parseInt(b[g][1]) + 
      parseInt(d[0].split("(")[1].split(")")[0]), b[g][7] = b[g][7] + ":::" + d[4]);
      a++;
    }
    e = '<style type="text/css"> .tg { border-collapse: collapse; border-spacing: 0; } .tg td { font-family: Arial, sans-serif; font-size: 14px; padding: 2px 2px; border-style: solid; border-width: 1px; overflow: hidden; word-break: normal; } .tg th { font-family: Arial, sans-serif; font-size: 14px; font-weight: normal; padding: 2px 2px; border-style: solid; border-width: 1px; overflow: hidden; word-break: normal; } .tg .tg-0ord { text-align: right }.tf { border-collapse: collapse; border-spacing: 0; } .tf td { font-family: Arial, sans-serif; font-size: 14px; padding: 2px 2px; border-style: solid; border-width: 8px; border-color:red; overflow: hidden; word-break: normal; } .tf th { font-family: Arial, sans-serif; font-size: 14px; font-weight: normal; padding: 2px 2px; border-style: solid; border-width: 8px; border-color:red; overflow: hidden; word-break: normal; } .tf .tg-0ord { text-align: right } .tooltip2 { position: relative; } .tooltip2 .tooltip2text { visibility: hidden; width: auto; background-color: black; border-style: solid; border-color: #ffffff; color: #fff; text-align: center; padding: 5px 20px; border-radius: 6px; position: absolute; z-index: 1; } .tooltip2:hover .tooltip2text { visibility: visible; }</style>';
    for (a = 1; a < b.length;) {
      g = '<table class="tg" style="display:inline"> <tr class="tooltip2"> <th class="tg-031e" colspan="2"><a href="http://www.puzzledragonx.com/en/monster.asp?n=', f = '<tr> <td class="tg-031e">H</td> <td class="tg-0ord">0</td> </tr>', c = '<tr> <td class="tg-031e">M</td> <td class="tg-0ord">0</td> </tr>', d = '<tr> <td class="tg-031e">L</td> <td class="tg-0ord">0</td> </tr>', m = '<tr> <td class="tg-031e">F</td> <td class="tg-0ord">0</td> </tr>', k = b[a][6].split(":::"), l = b[a][7].split(":::"), 
      u = b[a][4].split(":::"), g += b[a][0] + '" target="_blank" tabindex="-1"><span class="tooltip2text">Found in today\'s Dungeons:', g += q(b[a][2].split(":::")).join("<br>").split("|||").join("<br>") + '</span><img src="http://pad.dnt7.com/', g += b[a][3] + '" alt="Mountain View" style="width:45px;height:45px;"></a></th> </tr> <tr> <td class="tg-0ord" colspan="2">', g += b[a][1] + "</td> </tr> ", b[a][7].includes("3") && (f = t(k, l, u, 3, "H")), b[a][7].includes("2") && (c = t(k, l, u, 2, "M")), 
      b[a][7].includes("1") && (d = t(k, l, u, 1, "L")), b[a][7].includes("0") && (m = t(k, l, u, 0, "F")), e += g + (f + c + d + m) + "</table>", a++;
    }
    e += "<br><br>";
    a = 0;
    c = 1;
    for (g = b = ""; a < B.length;) {
      d = B[a].split("|||");
      m = d[1].split("::: ");
      1 == c ? (0 < a && (g += "</table>"), b = m[1], g += '<table class="tg" style="display:inline"> <tr class="tooltip2"> <th class="tg-031e" colspan="2"><a href="http://www.puzzledragonx.com/en/monster.asp?n=', f = n(d[0].split("(")[0], h), g += d[0].split("(")[0] + '" target="_blank" tabindex="-1"><img src="http://pad.dnt7.com/', g += h[f].image60_href + '" alt="Mountain View" style="width:45px;height:45px;"></a></th> </tr> <tr> <td class="tg-0ord" colspan="2">', g += d[0].split("(")[1].split(")")[0] + 
      "</td> </tr>") : (m = d[c].split("::: "), n(m[1], h));
      g += '<tr class="tooltip2"> <th class="tg-031e" colspan="2"><a href="http://www.puzzledragonx.com/en/monster.asp?n=';
      g += m[1] + '" target="_blank" tabindex="-1"><span class="tooltip2text">';
      for (f = h[n(m[1], h)].image60_href; c < d.length - 1;) {
        m = d[c].split("::: ");
        n(m[1], h);
        if (m[1] == b) {
          g += m[0] + "<br>";
        } else {
          a--;
          b = m[1];
          break;
        }
        c++;
      }
      c > d.length - 2 && (c = 1);
      g += '</span><img src="http://pad.dnt7.com/';
      g += f + '" alt="Mountain View" style="width:45px;height:45px;"></a></th> </tr>';
      a++;
    }
    e += g;
    a = document.createElement("div");
    a.id = "UC5HPmOW8yDEzfI";
    e += '</table><br><select id="selectorrr"><option value="Dungeon Select">Dungeon Select</option>';
    d = 0;
    for (A = q(A); d < A.length;) {
      e += '<option value="' + A[d] + '">' + A[d] + "</option>", d++;
    }
    a.innerHTML = e + "</select>";
    e = getElementByXpath('//*[@class="col-xs-12"]/p');
    try {
      e.insertBefore(a, e.childNodes[0]);
    } catch (G) {
      e = getElementByXpath('//*[@id="edit-form"]'), e.insertBefore(a, e.childNodes[0]);
    }
    GM.setValue("OffsetSeekerCacheStore", z);
  });
  getElementByXpath('//*[@id="UC5HPmOW8yDEzfI"]');
})();
$(document).on("change", "#selectorrr", function(n) {
  n = this.options[this.selectedIndex].text;
  for (var t = document.body.getElementsByClassName("tg"), q = 0; q < t.length;) {
    1 < t[q].classList.length && t[q].classList.remove("tf"), q++;
  }
  for (q = 0; q < t.length;) {
    -1 != t[q].textContent.indexOf(n) && t[q].classList.add("tf"), q++;
  }
});
function getElementByXpath(n) {
  return document.evaluate(n, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}
;