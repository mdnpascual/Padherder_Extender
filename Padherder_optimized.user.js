//Using Google Closure compiler

// ==UserScript==
// @name         Padherder
// @namespace    http://tampermonkey.net/
// @version      0.75
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
  function p(f, c) {
    var e = f;
    try {
      for (; c[e].id != f;) {
        if (e--, 0 > e) {
          return console.log("Monster ID: " + f + " not found in padherder database"), 2897;
        }
      }
    } catch (b) {
      return console.log("Monster ID: " + f + " not found in padherder database"), 2898;
    }
    return e;
  }
  function y(f, c, e, b, g) {
    for (var l = 0, a = 0, d = ""; l < f.length;) {
      c[l] == b && (a += parseInt(f[l]), d += f[l] + " for " + e[l] + "<br>"), l++;
    }
    return '<tr class="tooltip2"> <td class="tg-031e">' + g + '</td> <td class="tg-0ord">' + a + '<span class="tooltip2text">' + d + "</span></td> </tr>";
  }
  var z = (new Date((new Date).getTime() + -72E5)).getDay(), F = [147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 227, 234, 246, 247, 248, 249, 250, 251, 321, 797, 915, 916, 1002, 1085, 1086, 1087, 1176, 1294, 1295], t = [], A = GM_getValue("date_sync", -1), E, w, B, k = [], q, m, u = [], C = [], D = [], f = [], v;
  t.push($.get("https://gist.githubusercontent.com/padxExtender/e11935cf82505acbdd2b6e03a8cfe440/raw/file1.txt", function(f) {
    w = f.split("\n");
    A = w[0];
  }));
  t.push($.get("https://gist.githubusercontent.com/padxExtender/e11935cf82505acbdd2b6e03a8cfe440/raw/", function(f) {
    B = f.split("\n");
    E = B[0];
  }));
  $.when(t[0], t[1]).done(function() {
    if (A != z && E != z) {
      alert("Padx database not updated for today, please visit puzzledragonx.com/ and let the script update the database");
    } else {
      A == z && (w = B);
      var t = document.evaluate('//*[@id="username-dropdown"]/span', document, null, XPathResult.ANY_TYPE, null).iterateNext();
      k.push($.get("https://www.padherder.com/user-api/user/" + t.textContent + "/", function(c) {
        q = c;
      }));
      k.push($.get("https://raw.githubusercontent.com/mdnpascual/Padherder_Extender/master/json_template/evolutions.json", function(c) {
        JSON.parse(c);
        m = c;
      }));
      k.push($.get("https://raw.githubusercontent.com/mdnpascual/Padherder_Extender/master/json_template/monsters.json", function(c) {
        f = JSON.parse(c);
      }));
      k.push($.get("https://raw.githubusercontent.com/mdnpascual/Padherder_Extender/master/json_template/active_skills.json", function(c) {
        JSON.parse(c);
        v = c;
      }));
      $.when(k[0], k[1], k[2], k[3]).done(function() {
        for (var c, e, b, g, l, a, d = 0, r, k; d < parseInt(q.monsters.length);) {
          null !== q.monsters[d].target_evolution && 1 < parseInt(q.monsters[d].priority) && u.push([q.monsters[d], q.monsters[d].priority]);
          b = '"name":"';
          var n = null == q.monsters[d].target_evolution ? parseInt(q.monsters[d].monster) - 1 : parseInt(q.monsters[d].target_evolution) - 1;
          var h = p(n + 1, f);
          c = b;
          a = f[h].active_skill;
          a = null === a ? null : a.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
          b = c + a + '"';
          a = v.search(b);
          if (-1 == a) {
            console.log("Skill: " + b + f[h].active_skill + " not in padherder database");
          } else {
            g = a - 2;
            for (b = v.substring(a, a + 15); '"max_cooldown":' !== b;) {
              a--, b = v.substring(a, a + 15);
            }
            for (r = v.substring(a + 15, g + 1); ',"effect":"' !== b;) {
              a--, b = v.substring(a, a + 11);
            }
            for (g = a; '"min_cooldown":' !== b;) {
              a--, b = v.substring(a, a + 15);
            }
            k = v.substring(a + 15, g);
            if (1 < parseInt(q.monsters[d].priority) && parseInt(q.monsters[d].current_skill) < r - k + 1) {
              var t = !1, x = "";
              for (a = 1; a < w.length;) {
                e = w[a].split("::: ");
                b = e[1].split(",");
                for (l = 0; l < b.length - 1;) {
                  c = p(b[l], f);
                  if (f[c].active_skill == f[h].active_skill) {
                    x = t ? x + e[0] + "::: " + f[c].id + "::: " + f[c].name + "|||" : x + (n + 1) + "(" + (r - k + 1 - q.monsters[d].current_skill) + ")|||" + e[0] + "::: " + f[c].id + "::: " + f[c].name + "|||";
                    t = !0;
                    break;
                  }
                  l++;
                }
                a++;
              }
              "" !== x && C.push(x);
            }
          }
          d++;
        }
        for (d = 0; d < parseInt(u.length);) {
          e = u[d][0].target_evolution;
          do {
            a = m.search('evolves_to":' + e + "}");
            if (-1 == a) {
              console.log("Monster: " + u[d][0].target_evolution + " not in padherder database");
              break;
            }
            for (b = m.substring(a, a + 5); '":[{"' !== b;) {
              a--, b = m.substring(a, a + 5);
            }
            c = a - 1;
            for (b = m.substring(c, c + 4); '}],"' !== b;) {
              c--, b = m.substring(c, c + 4);
            }
            c = m.substring(c + 4, a);
            a = m.search('evolves_to":' + e);
            for (b = m.substring(a, a + 5); ":[[" !== b;) {
              if ("[" == b.charAt(0)) {
                b = parseInt(m.substring(a + 1, g).substring(0, m.substring(a + 1, g).search(",")));
                if (!F.includes(b)) {
                  n = 1;
                  for (h = ""; n < w.length;) {
                    e = w[n].split("::: ");
                    b = e[1].split(",");
                    for (r = 0; r < b.length - 1;) {
                      if (b[r] == m.substring(a + 1, g).split(",")[0]) {
                        h += e[0] + "|||";
                        break;
                      }
                      r++;
                    }
                    n++;
                  }
                  "" !== h && D.push(u[d][0].target_evolution + "(" + m.substring(a + 1, g).split(",")[1] + ")::: " + m.substring(a + 1, g).split(",")[0] + "::: " + h + "::: " + f[p(u[d][0].monster, f)].name + "::: " + u[d][1]);
                }
                a--;
              } else {
                "]" == b.charAt(0) && (g = a);
              }
              a--;
              b = m.substring(a, a + 3);
            }
            e = c;
          } while (u[d][0].monster != e);
          d++;
        }
        d = 0;
        for (a = [[]]; d < D.length;) {
          g = [];
          e = D[d].split("::: ");
          b = 1;
          for (c = !0; b < a.length;) {
            if ("undefined" !== typeof a[b] && a[b][0] == e[1]) {
              c = !1;
              break;
            }
            b++;
          }
          c ? (g.push(e[1]), g.push(e[0].split("(")[1].split(")")[0]), g.push(e[2] + ":::"), c = p(g[0], f), g.push(f[c].image60_href), c = p(e[0].split("(")[0], f), g.push(e[3] + " -> " + f[c].name), c = p(g[0], f), g.push(f[c].name), g.push(e[0].split("(")[1].split(")")[0]), g.push(e[4]), a.push(g)) : (a[b][2] += e[2] + ":::", c = p(e[0].split("(")[0], f), a[b][4] += ":::" + e[3] + " -> " + f[c].name, p(a[b][0], f), a[b][6] = a[b][6] + ":::" + e[0].split("(")[1].split(")")[0], a[b][1] = parseInt(a[b][1]) + 
          parseInt(e[0].split("(")[1].split(")")[0]), a[b][7] = a[b][7] + ":::" + e[4]);
          d++;
        }
        g = '<style type="text/css">.tg {border-collapse:collapse;border-spacing:0;}.tg td{font-family:Arial, sans-serif;font-size:14px;padding:2px 2px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;}.tg th{font-family:Arial, sans-serif;font-size:14px;font-weight:normal;padding:2px 2px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;}.tg .tg-0ord{text-align:right}.tooltip2 { position: relative;}.tooltip2 .tooltip2text { visibility: hidden; width: auto; background-color: black; border-style: solid; border-color: #ffffff; color: #fff; text-align: center; padding: 5px 20px; border-radius: 6px; position: absolute; z-index: 1;}.tooltip2:hover .tooltip2text { visibility: visible;}</style>';
        for (d = 1; d < a.length;) {
          b = '<table class="tg" style="display:inline"> <tr class="tooltip2"> <th class="tg-031e" colspan="2"><a href="http://www.puzzledragonx.com/en/monster.asp?n=', c = '<tr> <td class="tg-031e">H</td> <td class="tg-0ord">0</td> </tr>', e = '<tr> <td class="tg-031e">M</td> <td class="tg-0ord">0</td> </tr>', n = '<tr> <td class="tg-031e">L</td> <td class="tg-0ord">0</td> </tr>', h = '<tr> <td class="tg-031e">F</td> <td class="tg-0ord">0</td> </tr>', r = a[d][6].split(":::"), l = a[d][7].split(":::"), 
          k = a[d][4].split(":::"), b += a[d][0] + '" target="_blank" tabindex="-1"><span class="tooltip2text">Found in today\'s Dungeons:<br/>', b += a[d][2].replace(/:::/g, "<br>").replace(/\|\|\|/g, "<br>").replace(/<br><br>/g, "<br>") + '</span><img src="https://www.padherder.com/', b += a[d][3] + '"alt="Mountain View" style="width:45px;height:45px;"></th></a> </tr> <tr> <td class="tg-0ord" colspan="2">', b += a[d][1] + "</td> </tr> ", a[d][7].includes("3") && (c = y(r, l, k, 3, "H")), a[d][7].includes("2") && 
          (e = y(r, l, k, 2, "M")), a[d][7].includes("1") ? n = y(r, l, k, 1, "L") : h = y(r, l, k, 0, "F"), g += b + (c + e + n + h), d++;
        }
        d = 0;
        a = 1;
        for (b = n = ""; d < C.length;) {
          e = C[d].split("|||");
          h = e[1].split("::: ");
          1 == a ? (n = h[1], b += '<table class="tg" style="display:inline"> <tr class="tooltip2"> <th class="tg-031e" colspan="2"><a href="http://www.puzzledragonx.com/en/monster.asp?n=', c = p(e[0].split("(")[0], f), b += e[0].split("(")[0] + '" target="_blank" tabindex="-1"><img src="https://www.padherder.com/', b += f[c].image60_href + '" alt="Mountain View" style="width:45px;height:45px;"></th> </tr> <tr> <td class="tg-0ord" colspan="2">', b += e[0].split("(")[1].split(")")[0] + "</td> </tr> <tr> ") : 
          (h = e[a].split("::: "), p(h[1], f));
          b += '<tr class="tooltip2"> <th class="tg-031e" colspan="2"><a href="http://www.puzzledragonx.com/en/monster.asp?n=';
          b += h[1] + '" target="_blank" tabindex="-1"><span class="tooltip2text">';
          for (c = f[p(h[1], f)].image60_href; a < e.length - 1;) {
            h = e[a].split("::: ");
            p(h[1], f);
            if (h[1] == n) {
              b += h[0] + "<br>";
            } else {
              d--;
              n = h[1];
              break;
            }
            a++;
          }
          a > e.length - 2 && (a = 1);
          b += '</span><img src="https://www.padherder.com/';
          b += c + '" alt="Mountain View" style="width:45px;height:45px;"></th> </tr> <tr>';
          d++;
        }
        g += b;
        d = document.createElement("div");
        d.innerHTML = g;
        c = document.evaluate('//*[@class="col-xs-12"]/p', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        try {
          c.insertBefore(d, c.childNodes[0]);
        } catch (G) {
          c = document.evaluate('//*[@id="edit-form"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue, c.insertBefore(d, c.childNodes[0]);
        }
      });
    }
  });
})();
