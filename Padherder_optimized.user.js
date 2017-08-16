//Using Google Closure compiler

// ==UserScript==
// @name         Padherder
// @namespace    http://tampermonkey.net/
// @version      0.73
// @description  try to take over the world!
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
  function r(d, p) {
    var c = d;
    try {
      for (; p[c].id != d;) {
        if (c--, 0 > c) {
          return console.log("Monster ID: " + d + " not found in padherder database"), 2897;
        }
      }
    } catch (q) {
      return console.log("Monster ID: " + d + " not found in padherder database"), 2898;
    }
    return c;
  }
  function y(d, p, c, k, n) {
    for (var b = 0, m = 0, h = ""; b < d.length;) {
      p[b] == k && (m += parseInt(d[b]), h += d[b] + " for " + c[b] + "<br>"), b++;
    }
    return '<tr class="tooltip2"> <td class="tg-031e">' + n + '</td> <td class="tg-0ord">' + m + '<span class="tooltip2text">' + h + "</span></td> </tr>";
  }
  var z = (new Date((new Date).getTime() + -72E5)).getDay(), F = [147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 227, 234, 246, 247, 248, 249, 250, 251, 321, 797, 915, 916, 1002, 1085, 1086, 1087, 1176, 1294, 1295], t = [], A = GM_getValue("date_sync", -1), E, w, B, l = [], n, k, u = [], C = [], D = [], d = [], v;
  t.push($.get("https://gist.githubusercontent.com/padxExtender/e11935cf82505acbdd2b6e03a8cfe440/raw/file1.txt", function(d) {
    w = d.split("\n");
    A = w[0];
  }));
  t.push($.get("https://gist.githubusercontent.com/padxExtender/e11935cf82505acbdd2b6e03a8cfe440/raw/", function(d) {
    B = d.split("\n");
    E = B[0];
  }));
  $.when(t[0], t[1]).done(function() {
    if (A != z && E != z) {
      alert("Padx database not updated for today, please visit puzzledragonx.com/ and let the script update the database");
    } else {
      A == z && (w = B);
      var t = document.evaluate('//*[@id="username-dropdown"]/span', document, null, XPathResult.ANY_TYPE, null).iterateNext();
      l.push($.get("https://www.padherder.com/user-api/user/" + t.textContent + "/", function(d) {
        n = d;
      }));
      l.push($.get("https://www.padherder.com/api/evolutions/", function(d) {
        k = JSON.stringify(d);
      }));
      l.push($.get("https://www.padherder.com/api/monsters/", function(k) {
        d = k;
      }));
      l.push($.get("https://www.padherder.com/api/active_skills/", function(d) {
        v = JSON.stringify(d);
      }));
      $.when(l[0], l[1], l[2], l[3]).done(function() {
        var p;
        console.log("data_user");
        console.log(n);
        for (var c = 0, q, l; c < parseInt(n.monsters.length);) {
          null !== n.monsters[c].target_evolution && 1 < parseInt(n.monsters[c].priority) && u.push([n.monsters[c], n.monsters[c].priority]);
          var b = '"name":"';
          var m = null == n.monsters[c].target_evolution ? parseInt(n.monsters[c].monster) - 1 : parseInt(n.monsters[c].target_evolution) - 1;
          var h = r(m + 1, d);
          var e = b;
          var a = d[h].active_skill;
          a = null === a ? null : a.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
          b = e + a + '"';
          a = v.search(b);
          if (-1 == a) {
            console.log("Skill: " + b + d[h].active_skill + " not in padherder database");
          } else {
            var g = a - 2;
            for (b = v.substring(a, a + 15); '"max_cooldown":' !== b;) {
              a--, b = v.substring(a, a + 15);
            }
            for (q = v.substring(a + 15, g + 1); ',"effect":"' !== b;) {
              a--, b = v.substring(a, a + 11);
            }
            for (g = a; '"min_cooldown":' !== b;) {
              a--, b = v.substring(a, a + 15);
            }
            l = v.substring(a + 15, g);
            if (1 < parseInt(n.monsters[c].priority) && parseInt(n.monsters[c].current_skill) < q - l + 1) {
              var t = !1, x = "";
              for (a = 1; a < w.length;) {
                var f = w[a].split("::: ");
                b = f[1].split(",");
                for (p = 0; p < b.length - 1;) {
                  e = r(b[p], d);
                  if (d[e].active_skill == d[h].active_skill) {
                    x = t ? x + f[0] + "::: " + d[e].id + "::: " + d[e].name + "|||" : x + (m + 1) + "(" + (q - l + 1 - n.monsters[c].current_skill) + ")|||" + f[0] + "::: " + d[e].id + "::: " + d[e].name + "|||";
                    t = !0;
                    break;
                  }
                  p++;
                }
                a++;
              }
              "" !== x && C.push(x);
            }
          }
          c++;
        }
        for (c = 0; c < parseInt(u.length);) {
          f = u[c][0].target_evolution;
          do {
            a = k.search('evolves_to":' + f + "}");
            if (-1 == a) {
              console.log("Monster: " + u[c][0].target_evolution + " not in padherder database");
              break;
            }
            for (b = k.substring(a, a + 5); '":[{"' !== b;) {
              a--, b = k.substring(a, a + 5);
            }
            e = a - 1;
            for (b = k.substring(e, e + 4); '}],"' !== b;) {
              e--, b = k.substring(e, e + 4);
            }
            e = k.substring(e + 4, a);
            a = k.search('evolves_to":' + f);
            for (b = k.substring(a, a + 5); ":[[" !== b;) {
              if ("[" == b.charAt(0)) {
                b = parseInt(k.substring(a + 1, g).substring(0, k.substring(a + 1, g).search(",")));
                if (!F.includes(b)) {
                  m = 1;
                  for (h = ""; m < w.length;) {
                    f = w[m].split("::: ");
                    b = f[1].split(",");
                    for (q = 0; q < b.length - 1;) {
                      if (b[q] == k.substring(a + 1, g).split(",")[0]) {
                        h += f[0] + "|||";
                        break;
                      }
                      q++;
                    }
                    m++;
                  }
                  "" !== h && D.push(u[c][0].target_evolution + "(" + k.substring(a + 1, g).split(",")[1] + ")::: " + k.substring(a + 1, g).split(",")[0] + "::: " + h + "::: " + d[r(u[c][0].monster, d)].name + "::: " + u[c][1]);
                }
                a--;
              } else {
                "]" == b.charAt(0) && (g = a);
              }
              a--;
              b = k.substring(a, a + 3);
            }
            f = e;
          } while (u[c][0].monster != f);
          c++;
        }
        c = 0;
        for (a = [[]]; c < D.length;) {
          g = [];
          f = D[c].split("::: ");
          b = 1;
          for (e = !0; b < a.length;) {
            if ("undefined" !== typeof a[b] && a[b][0] == f[1]) {
              e = !1;
              break;
            }
            b++;
          }
          e ? (g.push(f[1]), g.push(f[0].split("(")[1].split(")")[0]), g.push(f[2] + ":::"), e = r(g[0], d), g.push(d[e].image60_href), e = r(f[0].split("(")[0], d), g.push(f[3] + " -> " + d[e].name), e = r(g[0], d), g.push(d[e].name), g.push(f[0].split("(")[1].split(")")[0]), g.push(f[4]), a.push(g)) : (a[b][2] += f[2] + ":::", e = r(f[0].split("(")[0], d), a[b][4] += ":::" + f[3] + " -> " + d[e].name, r(a[b][0], d), a[b][6] = a[b][6] + ":::" + f[0].split("(")[1].split(")")[0], a[b][1] = parseInt(a[b][1]) + 
          parseInt(f[0].split("(")[1].split(")")[0]), a[b][7] = a[b][7] + ":::" + f[4]);
          c++;
        }
        g = '<style type="text/css">.tg {border-collapse:collapse;border-spacing:0;}.tg td{font-family:Arial, sans-serif;font-size:14px;padding:2px 2px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;}.tg th{font-family:Arial, sans-serif;font-size:14px;font-weight:normal;padding:2px 2px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;}.tg .tg-0ord{text-align:right}.tooltip2 { position: relative;}.tooltip2 .tooltip2text { visibility: hidden; width: auto; background-color: black; border-style: solid; border-color: #ffffff; color: #fff; text-align: center; padding: 5px 20px; border-radius: 6px; position: absolute; z-index: 1;}.tooltip2:hover .tooltip2text { visibility: visible;}</style>';
        for (c = 1; c < a.length;) {
          b = '<table class="tg" style="display:inline"> <tr class="tooltip2"> <th class="tg-031e" colspan="2"><a href="http://www.puzzledragonx.com/en/monster.asp?n=', e = '<tr> <td class="tg-031e">H</td> <td class="tg-0ord">0</td> </tr>', f = '<tr> <td class="tg-031e">M</td> <td class="tg-0ord">0</td> </tr>', m = '<tr> <td class="tg-031e">L</td> <td class="tg-0ord">0</td> </tr>', h = '<tr> <td class="tg-031e">F</td> <td class="tg-0ord">0</td> </tr>', q = a[c][6].split(":::"), p = a[c][7].split(":::"), 
          l = a[c][4].split(":::"), b += a[c][0] + '" target="_blank" tabindex="-1"><span class="tooltip2text">Found in today\'s Dungeons:<br/>', b += a[c][2].replace(/:::/g, "<br>").replace(/\|\|\|/g, "<br>").replace(/<br><br>/g, "<br>") + '</span><img src="https://www.padherder.com/', b += a[c][3] + '"alt="Mountain View" style="width:45px;height:45px;"></th></a> </tr> <tr> <td class="tg-0ord" colspan="2">', b += a[c][1] + "</td> </tr> ", a[c][7].includes("3") ? e = y(q, p, l, 3, "H") : a[c][7].includes("2") ? 
          f = y(q, p, l, 2, "M") : a[c][7].includes("1") ? m = y(q, p, l, 1, "L") : h = y(q, p, l, 0, "F"), g += b + (e + f + m + h), c++;
        }
        c = 0;
        a = 1;
        for (b = m = ""; c < C.length;) {
          f = C[c].split("|||");
          h = f[1].split("::: ");
          1 == a ? (m = h[1], b += '<table class="tg" style="display:inline"> <tr class="tooltip2"> <th class="tg-031e" colspan="2"><a href="http://www.puzzledragonx.com/en/monster.asp?n=', e = r(f[0].split("(")[0], d), b += f[0].split("(")[0] + '" target="_blank" tabindex="-1"><img src="https://www.padherder.com/', b += d[e].image60_href + '" alt="Mountain View" style="width:45px;height:45px;"></th> </tr> <tr> <td class="tg-0ord" colspan="2">', b += f[0].split("(")[1].split(")")[0] + "</td> </tr> <tr> ") : 
          (h = f[a].split("::: "), r(h[1], d));
          b += '<tr class="tooltip2"> <th class="tg-031e" colspan="2"><a href="http://www.puzzledragonx.com/en/monster.asp?n=';
          b += h[1] + '" target="_blank" tabindex="-1"><span class="tooltip2text">';
          for (e = d[r(h[1], d)].image60_href; a < f.length - 1;) {
            h = f[a].split("::: ");
            r(h[1], d);
            if (h[1] == m) {
              b += h[0] + "<br>";
            } else {
              c--;
              m = h[1];
              break;
            }
            a++;
          }
          a > f.length - 2 && (a = 1);
          b += '</span><img src="https://www.padherder.com/';
          b += e + '" alt="Mountain View" style="width:45px;height:45px;"></th> </tr> <tr>';
          c++;
        }
        g += b;
        c = document.createElement("div");
        c.innerHTML = g;
        e = document.evaluate('//*[@id="container"]/div[3]/div/p', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        try {
          e.insertBefore(c, e.childNodes[0]);
        } catch (G) {
          e = document.evaluate('//*[@id="container"]/div[4]/div', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue, e.insertBefore(c, e.childNodes[0]);
        }
      });
    }
  });
})();
