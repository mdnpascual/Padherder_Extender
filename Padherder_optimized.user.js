//Using Google Closure compiler

// ==UserScript==
// @name         Padherder
// @namespace    PadherderExtender
// @version      0.80.1
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
    function m(e, b) {
        var l = e;
        l > b.length && (l = b.length - 1);
        try {
            for (; b[l].id != e;) {
                if (l--, 0 > l) {
                    return console.log("Monster ID: " + e + " not found in padherder database"), 2897;
                }
            }
        } catch (c) {
            return console.log("Monster ID: " + e + " not found in padherder database"), 2898;
        }
        return l;
    }
    function v(e, b, l, c, m) {
        for (var a = 0, g = 0, k = ""; a < e.length;) {
            b[a] == c && (g += parseInt(e[a]), k += e[a] + " for " + l[a] + "<br>"), a++;
        }
        return '<tr class="tooltip2"> <td class="tg-031e">' + m + '</td> <td class="tg-0ord">' + g + '<span class="tooltip2text">' + k + "</span></td> </tr>";
    }
    function r(e) {
        return e.sort().filter(function(b, e, c) {
            return !e || b != c[e - 1];
        });
    }
    var B = (new Date((new Date).getTime() + -72E5)).getDay(), H = [147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 227, 234, 246, 247, 248, 249, 250, 251, 321, 797, 915, 916, 1002, 1085, 1086, 1087, 1176, 1294, 1295], I = [2006, 1839, 1712, 1536, 599, 3015, 2805, 2739, 2637, 2184, 2092, 1252, 2926, 2722, 2398, 2008, 1750, 1590, 1272, 1225, 1210, 1090, 984, 228, 839, 763, 273, 2391, 1461, 1841, 1737, 597, 
  1473, 3221, 2277, 2182, 1602, 1532, 1458, 1307, 1208, 2383, 2263, 2104, 1713, 1273, 1227, 1091, 835, 765, 434, 275, 3074, 2808, 1945, 2807, 1189, 2738, 1223, 1843, 2987, 2838, 2754, 2741, 2639, 2129, 1837, 1711, 1629, 1209, 1206, 1098, 651, 3329, 3327, 2320, 1754, 1472, 1425, 1274, 1092, 1190, 612, 767, 432, 436, 277, 2946, 1250, 2892, 1119, 2664, 2528, 1923, 1845, 1727, 1422, 1342, 917, 3155, 3013, 2742, 2234, 1525, 1463, 1459, 1322, 1246, 3087, 2551, 2400, 2127, 1631, 1093, 810, 1220, 666, 282, 
  837, 2947, 2737, 2526, 2180, 1847, 1646, 1371, 645, 1215, 985, 918, 3245, 3153, 2809, 2069, 2130, 1465, 1248, 1207, 814, 2402, 2128, 1601, 771, 279], J = ["565:::566", 1838, "682:::683", "598:::599", 598, 3014, 2804, "822:::229:::99:::98", 2636, 2183, 2091, 1251, 2978, 2721, 2397, 2007, 1749, 1589, "316:::79:::78", 1224, "399:::398", "211:::23:::22:::21", "512:::107:::106", 182, 838, 762, 272, "1461:::1460", 1460, 1840, "597:::596", 596, "683:::682", 3220, 2276, 2181, 1167, 1531, 783, 1306, "513:::222:::221", 
  2382, 2262, 2103, 738, "317:::81:::80", 1226, "212:::26:::25:::24", "834:::833:::832", 764, 433, 274, 3073, "1945:::1944", 1944, "1189:::1188", 1188, "1223:::1222", 1222, 1842, 2986, 2837, 2753, "824:::231:::103:::102", 2638, "778:::777", 1836, 1710, 1628, "514:::224:::223", 285, 1097, 650, 3328, 3326, 2319, 1753, 1471, 1424, "318:::83:::82", "213:::29:::28:::27", "744:::743::::742", 611, 766, 431, 435, 276, "1250:::1249", 1249, "1119:::1118", 1118, "812:::811", 2527, 1922, 1844, "694:::515:::226:::225", 
  "649:::648", "781:::780", "188:::187", 3154, 3012, "825:::232:::105:::104", 2233, 1524, 1462, 785, "769:::768", 1245, 3086, 2550, 2399, "319:::85:::84", 1630, "214:::32:::31:::30", 809, 1219, "349:::348", 281, 836, "1062:::1061", 2736, 2525, "814:::813", 1846, "647:::646", "645:::644", 644, "683:::682", "190:::189", "188:::187", 3244, 3152, "2069:::2068", 2068, 544, 1464, 1247, 287, 813, 2401, "320:::87:::86", 1595, 770, 278], t = [], C = GM_getValue("date_sync", -1), G, x, D, p = [], u, n, A = 
        [], y = [], E = [], F = [], e = [], z;
    t.push($.get("https://gist.githubusercontent.com/padxExtender/e11935cf82505acbdd2b6e03a8cfe440/raw/file1.txt", function(e) {
        x = e.split("\n");
        C = x[0];
    }));
    t.push($.get("https://gist.githubusercontent.com/padxExtender/e11935cf82505acbdd2b6e03a8cfe440/raw/", function(e) {
        D = e.split("\n");
        G = D[0];
    }));
    $.when(t[0], t[1]).done(function() {
        if (C != B && G != B) {
            alert("Padx database not updated for today, please visit puzzledragonx.com/ and let the script update the database");
        } else {
            C == B && (x = D);
            var t = document.evaluate('//*[@id="username-dropdown"]/span', document, null, XPathResult.ANY_TYPE, null).iterateNext();
            p.push($.get("https://www.padherder.com/user-api/user/" + t.textContent + "/", function(b) {
                u = b;
            }));
            p.push($.get("https://raw.githubusercontent.com/mdnpascual/Padherder_Extender/master/json_template/evolutions.json", function(b) {
                JSON.parse(b);
                n = b;
            }));
            p.push($.get("https://raw.githubusercontent.com/mdnpascual/Padherder_Extender/master/json_template/monsters.json", function(b) {
                e = JSON.parse(b);
            }));
            p.push($.get("https://raw.githubusercontent.com/mdnpascual/Padherder_Extender/master/json_template/active_skills.json", function(b) {
                JSON.parse(b);
                z = b;
            }));
            $.when(p[0], p[1], p[2], p[3]).done(function() {
                var b, l, c = 0, q;
                for (b = 1; b < x.length;) {
                    A.push(x[b].split("::: ")[0]), b++;
                }
                for (; c < parseInt(u.monsters.length);) {
                    null !== u.monsters[c].target_evolution && 1 < parseInt(u.monsters[c].priority) && y.push([u.monsters[c], u.monsters[c].priority]);
                    var a = '"name":"';
                    var g = null == u.monsters[c].target_evolution ? parseInt(u.monsters[c].monster) - 1 : parseInt(u.monsters[c].target_evolution) - 1;
                    var k = m(g + 1, e);
                    b = a;
                    a = e[k].active_skill;
                    a = null === a ? null : a.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
                    a = b + a + '"';
                    var d = z.search(a);
                    if (-1 == d) {
                        console.log("Skill: " + a + e[k].active_skill + " not in padherder database");
                    } else {
                        var h = d - 2;
                        for (a = z.substring(d, d + 15); '"max_cooldown":' !== a;) {
                            d--, a = z.substring(d, d + 15);
                        }
                        for (q = z.substring(d + 15, h + 1); ',"effect":"' !== a;) {
                            d--, a = z.substring(d, d + 11);
                        }
                        for (h = d; '"min_cooldown":' !== a;) {
                            d--, a = z.substring(d, d + 15);
                        }
                        var w = z.substring(d + 15, h);
                        if (1 < parseInt(u.monsters[c].priority) && parseInt(u.monsters[c].current_skill) < q - w + 1) {
                            var p = !1, t = "";
                            for (d = 1; d < x.length;) {
                                var f = x[d].split("::: ");
                                a = f[1].split(",");
                                for (l = 0; l < a.length - 1;) {
                                    b = m(a[l], e);
                                    if (e[b].active_skill == e[k].active_skill) {
                                        t = p ? t + f[0] + "::: " + e[b].id + "::: " + e[b].name + "|||" : t + (g + 1) + "(" + (q - w + 1 - u.monsters[c].current_skill) + ")|||" + f[0] + "::: " + e[b].id + "::: " + e[b].name + "|||";
                                        p = !0;
                                        break;
                                    }
                                    l++;
                                }
                                d++;
                            }
                            "" !== t && E.push(t);
                        }
                    }
                    c++;
                }
                for (c = 0; c < parseInt(y.length);) {
                    f = y[c][0].target_evolution;
                    do {
                        d = n.search('evolves_to":' + f + "}");
                        if (-1 == d) {
                            console.log("Monster: " + y[c][0].target_evolution + " not in padherder database");
                            break;
                        }
                        for (a = n.substring(d, d + 5); '":[{"' !== a;) {
                            d--, a = n.substring(d, d + 5);
                        }
                        b = d - 1;
                        for (a = n.substring(b, b + 4); '}],"' !== a;) {
                            b--, a = n.substring(b, b + 4);
                        }
                        b = n.substring(b + 4, d);
                        d = n.search('evolves_to":' + f);
                        for (a = n.substring(d, d + 5); ":[[" !== a;) {
                            if ("[" == a.charAt(0)) {
                                a = parseInt(n.substring(d + 1, h).substring(0, n.substring(d + 1, h).search(",")));
                                if (!H.includes(a)) {
                                    g = 1;
                                    for (k = ""; g < x.length;) {
                                        f = x[g].split("::: ");
                                        a = f[1].split(",");
                                        for (q = 0; q < a.length - 1;) {
                                            l = a[q];
                                            w = I.indexOf(parseInt(n.substring(d + 1, h).split(",")[0]));
                                            p = [];
                                            -1 != w && (p = String(J[w]).split(":::"));
                                            if (l == n.substring(d + 1, h).split(",")[0] || p.includes(l)) {
                                                k += f[0] + "|||";
                                                break;
                                            }
                                            q++;
                                        }
                                        g++;
                                    }
                                    "" !== k && F.push(y[c][0].target_evolution + "(" + n.substring(d + 1, h).split(",")[1] + ")::: " + n.substring(d + 1, h).split(",")[0] + "::: " + k + "::: " + e[m(y[c][0].monster, e)].name + "::: " + y[c][1]);
                                }
                                d--;
                            } else {
                                "]" == a.charAt(0) && (h = d);
                            }
                            d--;
                            a = n.substring(d, d + 3);
                        }
                        f = b;
                    } while (y[c][0].monster != f);
                    c++;
                }
                c = 0;
                for (f = [[]]; c < F.length;) {
                    h = [];
                    g = F[c].split("::: ");
                    a = 1;
                    for (b = !0; a < f.length;) {
                        if ("undefined" !== typeof f[a] && f[a][0] == g[1]) {
                            b = !1;
                            break;
                        }
                        a++;
                    }
                    b ? (h.push(g[1]), h.push(g[0].split("(")[1].split(")")[0]), h.push(g[2] + ":::"), b = m(h[0], e), h.push(e[b].image60_href), b = m(g[0].split("(")[0], e), h.push(g[3] + " -> " + e[b].name), b = m(h[0], e), h.push(e[b].name), h.push(g[0].split("(")[1].split(")")[0]), h.push(g[4]), f.push(h)) : (f[a][2] += g[2] + ":::", b = m(g[0].split("(")[0], e), f[a][4] += ":::" + g[3] + " -> " + e[b].name, m(f[a][0], e), f[a][6] = f[a][6] + ":::" + g[0].split("(")[1].split(")")[0], f[a][1] = parseInt(f[a][1]) + 
          parseInt(g[0].split("(")[1].split(")")[0]), f[a][7] = f[a][7] + ":::" + g[4]);
                    c++;
                }
                h = '<style type="text/css"> .tg { border-collapse: collapse; border-spacing: 0; } .tg td { font-family: Arial, sans-serif; font-size: 14px; padding: 2px 2px; border-style: solid; border-width: 1px; overflow: hidden; word-break: normal; } .tg th { font-family: Arial, sans-serif; font-size: 14px; font-weight: normal; padding: 2px 2px; border-style: solid; border-width: 1px; overflow: hidden; word-break: normal; } .tg .tg-0ord { text-align: right }.tf { border-collapse: collapse; border-spacing: 0; } .tf td { font-family: Arial, sans-serif; font-size: 14px; padding: 2px 2px; border-style: solid; border-width: 8px; border-color:red; overflow: hidden; word-break: normal; } .tf th { font-family: Arial, sans-serif; font-size: 14px; font-weight: normal; padding: 2px 2px; border-style: solid; border-width: 8px; border-color:red; overflow: hidden; word-break: normal; } .tf .tg-0ord { text-align: right } .tooltip2 { position: relative; } .tooltip2 .tooltip2text { visibility: hidden; width: auto; background-color: black; border-style: solid; border-color: #ffffff; color: #fff; text-align: center; padding: 5px 20px; border-radius: 6px; position: absolute; z-index: 1; } .tooltip2:hover .tooltip2text { visibility: visible; }</style>';
                for (c = 1; c < f.length;) {
                    a = '<table class="tg" style="display:inline"> <tr class="tooltip2"> <th class="tg-031e" colspan="2"><a href="http://www.puzzledragonx.com/en/monster.asp?n=', b = '<tr> <td class="tg-031e">H</td> <td class="tg-0ord">0</td> </tr>', d = '<tr> <td class="tg-031e">M</td> <td class="tg-0ord">0</td> </tr>', g = '<tr> <td class="tg-031e">L</td> <td class="tg-0ord">0</td> </tr>', k = '<tr> <td class="tg-031e">F</td> <td class="tg-0ord">0</td> </tr>', q = f[c][6].split(":::"), l = f[c][7].split(":::"), 
                        w = f[c][4].split(":::"), a += f[c][0] + '" target="_blank" tabindex="-1"><span class="tooltip2text">Found in today\'s Dungeons:', a += r(f[c][2].split(":::")).join("<br>").split("|||").join("<br>") + '</span><img src="https://www.padherder.com/', a += f[c][3] + '" alt="Mountain View" style="width:45px;height:45px;"></a></th> </tr> <tr> <td class="tg-0ord" colspan="2">', a += f[c][1] + "</td> </tr> ", f[c][7].includes("3") && (b = v(q, l, w, 3, "H")), f[c][7].includes("2") && (d = v(q, 
          l, w, 2, "M")), f[c][7].includes("1") && (g = v(q, l, w, 1, "L")), f[c][7].includes("0") && (k = v(q, l, w, 0, "F")), h += a + (b + d + g + k) + "</table>", c++;
                }
                h += "<br><br>";
                c = 0;
                d = 1;
                for (a = f = ""; c < E.length;) {
                    g = E[c].split("|||");
                    k = g[1].split("::: ");
                    1 == d ? (0 < c && (a += "</table>"), f = k[1], a += '<table class="tg" style="display:inline"> <tr class="tooltip2"> <th class="tg-031e" colspan="2"><a href="http://www.puzzledragonx.com/en/monster.asp?n=', b = m(g[0].split("(")[0], e), a += g[0].split("(")[0] + '" target="_blank" tabindex="-1"><img src="https://www.padherder.com/', a += e[b].image60_href + '" alt="Mountain View" style="width:45px;height:45px;"></a></th> </tr> <tr> <td class="tg-0ord" colspan="2">', a += g[0].split("(")[1].split(")")[0] + 
                              "</td> </tr>") : (k = g[d].split("::: "), m(k[1], e));
                    a += '<tr class="tooltip2"> <th class="tg-031e" colspan="2"><a href="http://www.puzzledragonx.com/en/monster.asp?n=';
                    a += k[1] + '" target="_blank" tabindex="-1"><span class="tooltip2text">';
                    for (b = e[m(k[1], e)].image60_href; d < g.length - 1;) {
                        k = g[d].split("::: ");
                        m(k[1], e);
                        if (k[1] == f) {
                            a += k[0] + "<br>";
                        } else {
                            c--;
                            f = k[1];
                            break;
                        }
                        d++;
                    }
                    d > g.length - 2 && (d = 1);
                    a += '</span><img src="https://www.padherder.com';
                    a += b + '" alt="Mountain View" style="width:45px;height:45px;"></a></th> </tr>';
                    c++;
                }
                h += a;
                c = document.createElement("div");
                c.id = "UC5HPmOW8yDEzfI";
                h += '</table><br><select id="selectorrr"><option value="Dungeon Select">Dungeon Select</option>';
                g = 0;
                for (A = r(A); g < A.length;) {
                    h += '<option value="' + A[g] + '">' + A[g] + "</option>", g++;
                }
                c.innerHTML = h + "</select>";
                h = getElementByXpath('//*[@class="col-xs-12"]/p');
                try {
                    h.insertBefore(c, h.childNodes[0]);
                } catch (K) {
                    h = getElementByXpath('//*[@id="edit-form"]'), h.insertBefore(c, h.childNodes[0]);
                }
            });
            getElementByXpath('//*[@id="UC5HPmOW8yDEzfI"]');
        }
    });
})();
$(document).on("change", "#selectorrr", function(m) {
    m = this.options[this.selectedIndex].text;
    for (var v = document.body.getElementsByClassName("tg"), r = 0; r < v.length;) {
        1 < v[r].classList.length && v[r].classList.remove("tf"), r++;
    }
    for (r = 0; r < v.length;) {
        -1 != v[r].textContent.search(m) && v[r].classList.add("tf"), r++;
    }
});
function getElementByXpath(m) {
    return document.evaluate(m, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
};