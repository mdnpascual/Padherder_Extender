// ==UserScript==
// @name         Padherder_test
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       MDuh
// @match        https://www.padherder.com/*
// @require      http://userscripts-mirror.org/scripts/source/107941.user.js
// @require      http://code.jquery.com/jquery-3.2.1.js
// @downloadURL  https://github.com/mdnpascual/padherderExtender/raw/master/Padherder_test.user.js
// @updateURL    https://github.com/mdnpascual/padherderExtender/raw/master/Padherder_test.user.js
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    var today = new Date( new Date().getTime() + -2 * 3600 * 1000).getDay();
    var ignoreList = [147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 227, 234, 246, 247, 248, 249, 250, 251, 321, 797, 915, 916, 1002, 1085, 1086, 1087, 1176, 1294, 1295];
    var allParse = [];
    var storedday = GM_getValue("date_sync", -1);
    var storedday2;
    var lines, lines2;
    var functionales = [];
    var data_user;
    var data_evo;
    var data_evo_string;
    var filter_mons = [];
    var filter_mons_need_skillup = [];
    var filteredw_evo_mons = [];
    var filteredw_skillup_mons = [];
    var mons_toskillup = [];
    var mons_data = [];
    var active_skill = [];
    var active_skill_string;
    allParse.push($.get("https://gist.githubusercontent.com/padxExtender/e11935cf82505acbdd2b6e03a8cfe440/raw/file1.txt", function( database_scraped ) {
        lines = database_scraped.split("\n");
        storedday = lines[0];
    }));
    allParse.push($.get("https://gist.githubusercontent.com/padxExtender/e11935cf82505acbdd2b6e03a8cfe440/raw/", function( database_scraped ) {
        lines2 = database_scraped.split("\n");
        storedday2 = lines2[0];
    }));
    $.when(allParse[0], allParse[1]).done(function() {
        if ((storedday != today) && (storedday2 != today)){
            alert("Padx database not updated for today, please visit puzzledragonx.com/ and let the script update the database");
        }
        else{
            if (storedday == today)
                lines = lines2;
            var username_eval = document.evaluate('//*[@id="username-dropdown"]/span', document, null, XPathResult.ANY_TYPE, null);
            var username = username_eval.iterateNext();

            functionales.push($.get("https://www.padherder.com/user-api/user/" + username.textContent + "/", function( padx_scraped ) {
                data_user = padx_scraped;
            }));
            functionales.push($.get("https://www.padherder.com/api/evolutions/", function( padx_scraped ) {
                data_evo = padx_scraped;
                data_evo_string = JSON.stringify(padx_scraped);
            }));
            functionales.push($.get("https://www.padherder.com/api/monsters/", function( padx_scraped ) {
                mons_data = padx_scraped;
            }));
            functionales.push($.get("https://www.padherder.com/api/active_skills/", function( padx_scraped ) {
                active_skill = padx_scraped;
                active_skill_string = JSON.stringify(padx_scraped);
            }));
            $.when(functionales[0], functionales[1], functionales[2], functionales[3]).done(function() {
                console.log("data_user");
                console.log(data_user);
                console.log("data_evo");
                console.log(data_evo);
                console.log("mons_data");
                console.log(mons_data);
                console.log("active_skill");
                console.log(active_skill);
                var i = 0;
                var o;
                var max_c, min_c;
                //Filter monster that has planned evolutions only
                while (i < parseInt(data_user.monsters.length)){
                    if (data_user.monsters[i].target_evolution !== null){
                        filter_mons.push(data_user.monsters[i]);
                    }
                    var findstring = '"name":"';
                    var monsss_id = (data_user.monsters[i].target_evolution == null) ? parseInt(data_user.monsters[i].monster) - 1 : parseInt(data_user.monsters[i].target_evolution) - 1;
                    var l = monsss_id;
                    l = offsetseeker(monsss_id + 1, mons_data);
                    findstring = findstring + escapeRegExp(mons_data[l].active_skill) + '"';
                    var n = active_skill_string.search(findstring);
                    if (n == -1){
                        console.log("Skill: " + findstring + mons_data[l].active_skill + " not in padherder database");
                        i++;
                        continue;
                    }
                    o = n - 2;
                    findstring = active_skill_string.substring(n,n+15);
                    while (findstring !== '"max_cooldown":'){//find max_cooldown
                        n--;
                        findstring = active_skill_string.substring(n,n+15);
                    }
                    max_c = active_skill_string.substring(n+15,o+1);
                    while (findstring !== ',"effect":"'){//find min_cooldown
                        n--;
                        findstring = active_skill_string.substring(n,n+11);
                    }
                    o = n;
                    while (findstring !== '"min_cooldown":'){//find min_cooldown
                        n--;
                        findstring = active_skill_string.substring(n,n+15);
                    }
                    min_c = active_skill_string.substring(n+15,o);
                    if (parseInt(data_user.monsters[i].priority) > 1 && parseInt(data_user.monsters[i].current_skill) < (max_c - min_c)){
                        var enteredonce = false;
                        var skillupevo = "";
                        var j = 1;
                        while (j < lines.length){
                            var splitmore = lines[j].split("::: ");
                            var splitmoremore = splitmore[1].split(",");
                            var k = 0;
                            while (k < splitmoremore.length -1){
                                m = offsetseeker(splitmoremore[k], mons_data);
                                if (mons_data[m].active_skill == mons_data[l].active_skill){
                                    if (!enteredonce)
                                        skillupevo = skillupevo + (monsss_id + 1) + "(" + (max_c - min_c) + ")" + "|||" + splitmore[0] + "::: " + mons_data[m].id + "::: " + mons_data[m].name + "|||";
                                    else
                                        skillupevo = skillupevo + splitmore[0] + "::: " + mons_data[m].id + "::: " + mons_data[m].name + "|||";
                                    enteredonce = true;
                                    break;
                                }
                                //filter_mons_need_skillup.push(data_user.monsters[i].monster + "::: " + mons_data[l].active_skill + "(" + (max_c - min_c) + ")");
                                k++;
                            }
                            //last entry always empty
                            j++;
                        }
                        //filter_mons_need_skillup.push(data_user.monsters[i].monster + "::: " + mons_data[l].active_skill + "::: " + (max_c - min_c)); //CHANGE THIS!!
                        if (skillupevo !== ""){
                            filter_mons_need_skillup.push(skillupevo);
                        }
                    }
                    i++;
                }
                console.log("filter_mons");
                console.log(filter_mons);
                console.log("filter_mons_need_skillup");
                console.log(filter_mons_need_skillup);
                i = 0;
                while (i < parseInt(filter_mons.length)){
                    var j = 0;
                    //var monsevostring = filter_mons[i].target_evolution + ":::";
                    var next_evo = filter_mons[i].target_evolution;
                    do{
                        //Finding target_evo in string. (Searching backwards)
                        var n = data_evo_string.search('evolves_to":' + next_evo + '}');
                        if (n == -1){
                            console.log("Monster: " + filter_mons[i].target_evolution + " not in padherder database");
                            break;
                        }
                        var findstring = data_evo_string.substring(n,n+5);
                        while (findstring !== '":[{"'){//find end string index
                            n--;
                            findstring = data_evo_string.substring(n,n+5);
                        }
                        var m = n-1;
                        findstring = data_evo_string.substring(m,m+4);
                        while (findstring !== '}],"'){
                            m--;
                            findstring = data_evo_string.substring(m,m+4);
                        }
                        //End search
                        var next_evoooo = data_evo_string.substring(m+4,n);
                        var k = 0;
                        var o;

                        n = data_evo_string.search('evolves_to":' + next_evo);
                        findstring = data_evo_string.substring(n,n+5);
                        while (findstring !== ':[['){
                            if (findstring.charAt(0) == '['){
                                var monsssssss_id = parseInt(data_evo_string.substring(n+1,o).substring(0,data_evo_string.substring(n+1,o).search(",")));
                                if(!ignoreList.includes(monsssssss_id)){
                                    var p = 1;
                                    while (p < lines.length){
                                        var splitmore = lines[p].split("::: ");
                                        var splitmoremore = splitmore[1].split(",");
                                        var q = 0;
                                        while (q < splitmoremore.length -1){
                                            var r = splitmoremore[q];
                                            if (r == data_evo_string.substring(n+1,o).split(",")[0]){
                                                filteredw_evo_mons.push(filter_mons[i].target_evolution + "(" + data_evo_string.substring(n+1,o).split(",")[1] + ")" + "::: " + data_evo_string.substring(n+1,o).split(",")[0] + "::: " + splitmore[0]);
                                                break;
                                            }
                                            q++;
                                        }
                                        p++;
                                    }
                                    //monsevostring = monsevostring + data_evo_string.substring(n+1,o).replace(",","(") + "),";
                                }
                                n--;
                            }
                            else if (findstring.charAt(0) == ']'){
                                o = n;
                            }
                            n--;
                            findstring = data_evo_string.substring(n,n+3);
                        }
                        next_evo = next_evoooo;
                    }while(filter_mons[i].monster != next_evo);
                    //filteredw_evo_mons.push(monsevostring);
                    i++;
                }
                console.log("filteredw_evo_mons");
                console.log(filteredw_evo_mons);

                i = 0;
                var mats_format = [[]];
                while (i < filteredw_evo_mons.length){
                    var temparray = [];
                    var splitting = filteredw_evo_mons[i].split("::: ");
                    var t = 1;
                    var status = true;
                    while (t < splitting.length){
                        if (mats_format.length != 1 && mats_format[t][0] == splitting[1]){
                            status = false;
                            break;
                        }
                        t++;
                    }
                    if (status){
                        temparray.push(splitting[1]);
                        temparray.push(1);
                        var j = 2;
                        var tempstring = '';
                        while (j < splitting.length){
                            tempstring = tempstring + splitting[j] + "&#13;";
                            j++;
                        }
                        temparray.push(tempstring);
                        m = offsetseeker(splitting[0].split("(")[0], mons_data);
                        temparray.push(mons_data[m].name);

                        m = offsetseeker(temparray[0], mons_data);
                        temparray.push(mons_data[m].name);
                        temparray.push(splitting[0].split("(")[1].split(")")[0]);
                        mats_format.push(temparray);
                    }
                    else{
                        //var r = mats_format.indexOf(splitting[1]);
                        var j = 2;
                        var tempstring = '';
                        while (j < splitting.length){
                            tempstring = tempstring + splitting[j] + "&#13;";
                            j++;
                        }
                        mats_format[t][2] += tempstring;

                        m = offsetseeker(splitting[0].split("(")[0], mons_data);
                        mats_format[t][3] += ":::" + mons_data[m].name;

                        m = offsetseeker(mats_format[t][0], mons_data);
                        mats_format[t][4] += ":::" + (mons_data[m].name);
                        mats_format[t][5] = mats_format[t][5] + "," + splitting[0].split("(")[1].split(")")[0];
                        //find index and modify values
                    }
                    i++;
                }
                console.log("mats_format");
                console.log(mats_format);

                var HTMLstring = '<div id="dungeon-reminder-box2" class="row" style="display: block;"><div class="col-xs-13"><div id="dungeon-reminder" class="alert alert-info"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button><p><strong>Padherder Extender </strong> Materials that you need that can be farmed today </p><form method="POST" action=".."><input type="hidden" name="csrfmiddlewaretoken" value=".."><input type="hidden" name="next" value="..">';
            });
        }
    });
    //Parse Data
    function escapeRegExp(str) {
        if (str === null)
            return null;
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }
    function offsetseeker(start, array){
        var n = start;
        var m = n;
        while(array[m].id != n){
            m--;
            if (m < 0){
                console.log("wtf?");
                return -1;
            }
        }
        return m;
    }
})();
