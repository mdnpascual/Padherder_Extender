// ==UserScript==
// @name         Padherder_test
// @namespace    http://tampermonkey.net/
// @version      0.75
// @description  Shows possible Skillup/Material monsters from descended dungeons in PadHerder site
// @author       MDuh
// @match        https://www.padherder.com/*
// @require      http://userscripts-mirror.org/scripts/source/107941.user.js
// @require      http://code.jquery.com/jquery-3.2.1.js
// @downloadURL  https://github.com/mdnpascual/Padherder_Extender/raw/master/Padherder.user.js
// @updateURL    https://github.com/mdnpascual/Padherder_Extender/raw/master/Padherder.user.js
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
    //Get current database
    allParse.push($.get("https://gist.githubusercontent.com/padxExtender/e11935cf82505acbdd2b6e03a8cfe440/raw/file1.txt", function( database_scraped ) {
        lines = database_scraped.split("\n");
        storedday = lines[0];
    }));//2 links because gist is funky with updating hard links
    allParse.push($.get("https://gist.githubusercontent.com/padxExtender/e11935cf82505acbdd2b6e03a8cfe440/raw/", function( database_scraped ) {
        lines2 = database_scraped.split("\n");
        storedday2 = lines2[0];
    }));
    $.when(allParse[0], allParse[1]).done(function() {
        if ((storedday != today) && (storedday2 != today)){//If both links don't match the current day
            alert("Padx database not updated for today, please visit puzzledragonx.com/ and let the script update the database");
        }
        else{
            if (storedday == today)//replace lines with lines2 if most recent database is the 2nd one
                lines = lines2;
            //Get username (Gets the name in the upper right of parderher so user must be logged in)
            var username_eval = document.evaluate('//*[@id="username-dropdown"]/span', document, null, XPathResult.ANY_TYPE, null);
            var username = username_eval.iterateNext();

            //Get api data
            functionales.push($.get("https://www.padherder.com/user-api/user/" + username.textContent + "/", function( padx_scraped ) {
                data_user = padx_scraped;
            }));
            functionales.push($.get("https://raw.githubusercontent.com/mdnpascual/Padherder_Extender/master/json_template/evolutions.json", function( padx_scraped ) {
                data_evo = JSON.parse(padx_scraped);
                data_evo_string = padx_scraped;
            }));
            functionales.push($.get("https://raw.githubusercontent.com/mdnpascual/Padherder_Extender/master/json_template/monsters.json", function( padx_scraped ) {
                mons_data = JSON.parse(padx_scraped);
            }));
            functionales.push($.get("https://raw.githubusercontent.com/mdnpascual/Padherder_Extender/master/json_template/active_skills.json", function( padx_scraped ) {
                active_skill = JSON.parse(padx_scraped);
                active_skill_string = padx_scraped;
            }));
            $.when(functionales[0], functionales[1], functionales[2], functionales[3]).done(function() {
                //TODO: Use Data_user to deduct amount of mats to farm depending on how many is in the padherder count
                console.log("data_user");
                console.log(data_user);
                ////console.log("data_evo");
                ////console.log(data_evo);
                ////console.log("mons_data");
                ////console.log(mons_data);
                ////console.log("active_skill");
                ////console.log(active_skill);
                var i = 0;
                var o;
                var max_c, min_c;
                //Parse all user data monsters
                while (i < parseInt(data_user.monsters.length)){
                    if ((data_user.monsters[i].target_evolution !== null) && parseInt(data_user.monsters[i].priority) > 1){//Ignore monsters that has no planned evolutions in evo search
                        filter_mons.push([data_user.monsters[i], data_user.monsters[i].priority]);
                    }
                    //Finding monster's skill parameters and compute how many skillup monsters are needed
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
                    while (findstring !== ',"effect":"'){//find index separator for min_cooldown
                        n--;
                        findstring = active_skill_string.substring(n,n+11);
                    }
                    o = n;
                    while (findstring !== '"min_cooldown":'){//find min_cooldown
                        n--;
                        findstring = active_skill_string.substring(n,n+15);
                    }
                    min_c = active_skill_string.substring(n+15,o);
                    //only considering monsters that have priority of medium or higher (change: 1 -> 2(high only), 1 -> 0 (Zero excluded). 1 -> -1 (Everything)
                    if (parseInt(data_user.monsters[i].priority) > 1 && parseInt(data_user.monsters[i].current_skill) < (max_c - min_c + 1)){
                        var enteredonce = false;
                        var skillupevo = "";
                        var j = 1;
                        while (j < lines.length){//Loop in today's database
                            var splitmore = lines[j].split("::: ");
                            var splitmoremore = splitmore[1].split(",");
                            var k = 0;
                            while (k < splitmoremore.length -1){//Loop on all monster in each line's dungeon
                                m = offsetseeker(splitmoremore[k], mons_data);
                                if (mons_data[m].active_skill == mons_data[l].active_skill){
                                    if (!enteredonce)
                                        skillupevo = skillupevo + (monsss_id + 1) + "(" + ((max_c - min_c + 1) - data_user.monsters[i].current_skill) + ")" + "|||" + splitmore[0] + "::: " + mons_data[m].id + "::: " + mons_data[m].name + "|||";
                                    else
                                        skillupevo = skillupevo + splitmore[0] + "::: " + mons_data[m].id + "::: " + mons_data[m].name + "|||";
                                    enteredonce = true;
                                    break;//Break if confirmed dungeon has skillup for monster
                                }
                                k++;
                            }
                            //last entry always empty
                            j++;
                        }
                        if (skillupevo !== ""){
                            filter_mons_need_skillup.push(skillupevo);
                        }
                    }
                    i++;
                }
                //console.log("filter_mons");
                //console.log(filter_mons);
                ////console.log("filter_mons_need_skillup");
                //console.log("--------------Needs skillup--------------");
                //console.log("Format: Your_Monster_ID(amount_needed)|||Dungeon ::: Monster_ID_to_farm ::: Monster_name_to_farm");
                //console.log(filter_mons_need_skillup);
                i = 0;
                while (i < parseInt(filter_mons.length)){
                    var j = 0;
                    var next_evo = filter_mons[i][0].target_evolution;
                    do{
                        //Finding target_evo in string. (Searching backwards)
                        var n = data_evo_string.search('evolves_to":' + next_evo + '}');
                        if (n == -1){
                            console.log("Monster: " + filter_mons[i][0].target_evolution + " not in padherder database");
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
                                    var dungeon2push = '';
                                    while (p < lines.length){
                                        var splitmore = lines[p].split("::: ");
                                        var splitmoremore = splitmore[1].split(",");
                                        var q = 0;
                                        while (q < splitmoremore.length -1){
                                            var r = splitmoremore[q];
                                            if (r == data_evo_string.substring(n+1,o).split(",")[0]){
                                                dungeon2push += splitmore[0] + "|||";
                                                break;
                                            }
                                            q++;
                                        }
                                        p++;
                                    }
                                    if (dungeon2push !== '')
                                        filteredw_evo_mons.push(filter_mons[i][0].target_evolution + "(" + data_evo_string.substring(n+1,o).split(",")[1] + ")" + "::: " + data_evo_string.substring(n+1,o).split(",")[0] + "::: " + dungeon2push + "::: " + mons_data[offsetseeker(filter_mons[i][0].monster, mons_data)].name + "::: " + filter_mons[i][1]);
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
                    }while(filter_mons[i][0].monster != next_evo);
                    i++;
                }
                //console.log("filteredw_evo_mons");
                //console.log(filteredw_evo_mons);

                //Generating mats needed to be farmed
                i = 0;
                var mats_format = [[]];
                while (i < filteredw_evo_mons.length){
                    var temparray = [];
                    var splitting = filteredw_evo_mons[i].split("::: ");
                    var t = 1;
                    var status = true;
                    while (t < mats_format.length){ //Checks if material already on array
                        if ("undefined" !== typeof mats_format[t]){
                            if (mats_format[t][0] == splitting[1]){ //Find index of material if it's on array
                                status = false;
                                break;
                            }
                        }
                        t++;
                    }
                    if (status){ //If material is not found, create new entry
                        temparray.push(splitting[1]);
                        temparray.push(splitting[0].split("(")[1].split(")")[0]);
                        temparray.push(splitting[2] + ":::");
                        m = offsetseeker(temparray[0], mons_data);
                        temparray.push(mons_data[m].image60_href);
                        m = offsetseeker(splitting[0].split("(")[0], mons_data);
                        temparray.push(splitting[3] + " -> " + mons_data[m].name);
                        m = offsetseeker(temparray[0], mons_data);
                        temparray.push(mons_data[m].name);
                        temparray.push(splitting[0].split("(")[1].split(")")[0]);
                        temparray.push(splitting[4]);
                        mats_format.push(temparray);
                    }
                    else{ //Else, use index to update material entry
                        mats_format[t][2] += splitting[2] + ":::";
                        m = offsetseeker(splitting[0].split("(")[0], mons_data);
                        mats_format[t][4] += ":::" + splitting[3] + " -> " + mons_data[m].name;
                        m = offsetseeker(mats_format[t][0], mons_data);
                        mats_format[t][6] = mats_format[t][6] + ":::" + splitting[0].split("(")[1].split(")")[0];
                        mats_format[t][1] = parseInt(mats_format[t][1]) + parseInt(splitting[0].split("(")[1].split(")")[0]);
                        mats_format[t][7] = mats_format[t][7] + ":::" + splitting[4];
                    }
                    i++;
                }
                /*console.log("mats_format");
                console.log("--------------Materials needed to be farmed--------------");
                console.log("Array Format: ");
                console.log("[0]: Monster_ID_to_farm");
                console.log("[1]: Total Amount");
                console.log("[2]: Dungeon_available_to_farm(Delimiter: \":::\")");
                console.log("[3]: Image_link_of_monster_to_farm");
                console.log("[4]: Monster_Evo_transition(Delimiter: \":::\")");
                console.log("[5]: Monster_name_to_farm");
                console.log("[6]: Amount(Delimiter: \":::\")");
                console.log("[7]: Priority");
                console.log(mats_format);*/

                //Create html for mats
                var html_string = '<style type="text/css">.tg {border-collapse:collapse;border-spacing:0;}.tg td{font-family:Arial, sans-serif;font-size:14px;padding:2px 2px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;}.tg th{font-family:Arial, sans-serif;font-size:14px;font-weight:normal;padding:2px 2px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;}.tg .tg-0ord{text-align:right}.tooltip2 { position: relative;}.tooltip2 .tooltip2text { visibility: hidden; width: auto; background-color: black; border-style: solid; border-color: #ffffff; color: #fff; text-align: center; padding: 5px 20px; border-radius: 6px; position: absolute; z-index: 1;}.tooltip2:hover .tooltip2text { visibility: visible;}</style>';
                i = 1;
                while (i < mats_format.length){
                    var stringappend = '<table class="tg" style="display:inline"> <tr class="tooltip2"> <th class="tg-031e" colspan="2"><a href="http://www.puzzledragonx.com/en/monster.asp?n=';
                    var Hi = '<tr> <td class="tg-031e">H</td> <td class="tg-0ord">0</td> </tr>';
                    var Med = '<tr> <td class="tg-031e">M</td> <td class="tg-0ord">0</td> </tr>';
                    var Low = '<tr> <td class="tg-031e">L</td> <td class="tg-0ord">0</td> </tr>';
                    var Zero = '<tr> <td class="tg-031e">F</td> <td class="tg-0ord">0</td> </tr>';
                    var arrange = '', tooltip = '';
                    var split_count = mats_format[i][6].split(":::");
                    var split_prio = mats_format[i][7].split(":::");
                    var split_transition = mats_format[i][4].split(":::");
                    //PadX link
                    stringappend += mats_format[i][0] + '" target="_blank" tabindex="-1"><span class="tooltip2text">Found in today\'s Dungeons:<br/>';
                    //Dungeons
                    stringappend += mats_format[i][2].replace(/:::/g, "<br>").replace(/\|\|\|/g, "<br>").replace(/<br><br>/g, "<br>") + '</span><img src="https://www.padherder.com/';
                    //img_url
                    stringappend += mats_format[i][3] + '"alt="Mountain View" style="width:45px;height:45px;"></th></a> </tr> <tr> <td class="tg-0ord" colspan="2">';
                    //count
                    stringappend += mats_format[i][1] + '</td> </tr> ';
                    //Arranging
                    if (mats_format[i][7].includes("3"))
                        Hi = tooltipgen(split_count, split_prio, split_transition, 3, 'H');
                    else if (mats_format[i][7].includes("2"))
                        Med = tooltipgen(split_count, split_prio, split_transition, 2, 'M');
                    else if (mats_format[i][7].includes("1"))
                        Low = tooltipgen(split_count, split_prio, split_transition, 1, 'L');
                    else
                        Zero = tooltipgen(split_count, split_prio, split_transition, 0, 'F');
                    arrange = Hi + Med + Low + Zero;
                    html_string += stringappend + arrange;
                    i++;
                }
                //html_string += '<br><br>';
                //Generate Skillup monsters to be farmed
                i = 0;
                var j = 1;
                var prev = '';
                var stringappend = '';
                var img2use = '';
                while (i < filter_mons_need_skillup.length){
                    var splitting = filter_mons_need_skillup[i].split("|||");
                    var splitting2 = splitting[1].split("::: ");
                    if (j == 1){
                        prev = splitting2[1];
                        stringappend += '<table class="tg" style="display:inline"> <tr class="tooltip2"> <th class="tg-031e" colspan="2"><a href="http://www.puzzledragonx.com/en/monster.asp?n=';
                        var m = offsetseeker(splitting[0].split("(")[0], mons_data);
                        //PadX link
                        stringappend += splitting[0].split("(")[0] + '" target="_blank" tabindex="-1"><img src="https://www.padherder.com/';
                        //img_url
                        stringappend += mons_data[m].image60_href + '" alt="Mountain View" style="width:45px;height:45px;"></th> </tr> <tr> <td class="tg-0ord" colspan="2">';
                        //count
                        stringappend += splitting[0].split("(")[1].split(")")[0] + '</td> </tr> <tr> ';
                    }
                    else{
                        splitting2 = splitting[j].split("::: ");
                        m = offsetseeker(splitting2[1], mons_data);
                    }
                    //PadX link
                    stringappend += '<tr class="tooltip2"> <th class="tg-031e" colspan="2"><a href="http://www.puzzledragonx.com/en/monster.asp?n=';
                    //Tooltip (dungeons)
                    stringappend += splitting2[1] + '" target="_blank" tabindex="-1"><span class="tooltip2text">';
                    img2use = mons_data[offsetseeker(splitting2[1], mons_data)].image60_href;
                    while (j < splitting.length - 1){
                        splitting2 = splitting[j].split("::: ");
                        m = offsetseeker(splitting2[1], mons_data);
                        if (splitting2[1] == prev)
                            stringappend += splitting2[0] + '<br>';
                        else{
                            i--;
                            prev = splitting2[1];
                            break;
                        }
                        j++;
                    }
                    if (j > splitting.length - 2) //reset
                        j = 1;
                    stringappend += '</span><img src="https://www.padherder.com/';
                    //img_url
                    stringappend += img2use + '" alt="Mountain View" style="width:45px;height:45px;"></th> </tr> <tr>';
                    i++;
                }
                html_string += stringappend;
                //Inject html here
                var inject_this = document.createElement("div");
                //inject_this.innerHTML = '<style type="text/css">.tg {border-collapse:collapse;border-spacing:0;}.tg td{font-family:Arial, sans-serif;font-size:14px;padding:2px 2px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;}.tg th{font-family:Arial, sans-serif;font-size:14px;font-weight:normal;padding:2px 2px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;}.tg .tg-0ord{text-align:right}</style><table class="tg" style="display:inline"> <tr> <th class="tg-031e" colspan="2"><img src="https://www.padherder.com/static/img/monsters/60x60/162.35dc01efa82a.png" alt="Mountain View" style="width:45px;height:45px;"></th> </tr> <tr> <td class="tg-0ord" colspan="2">0</td> </tr> <tr> <td class="tg-031e">H</td> <td class="tg-0ord">0</td> </tr> <tr> <td class="tg-031e">M</td> <td class="tg-0ord">0</td> </tr> <tr> <td class="tg-031e">L</td> <td class="tg-0ord">0</td> </tr> <tr> <td class="tg-031e">F</td> <td class="tg-0ord">0</td> </tr></table><table class="tg" style="display:inline"> <tr> <th class="tg-031e" colspan="2"><img src="https://www.padherder.com/static/img/monsters/60x60/165.a23a17a7222a.png" alt="Mountain View" style="width:45px;height:45px;"></th> </tr> <tr> <td class="tg-0ord" colspan="2">0</td> </tr> <tr> <td class="tg-031e">H</td> <td class="tg-0ord">0</td> </tr> <tr> <td class="tg-031e">M</td> <td class="tg-0ord">0</td> </tr> <tr> <td class="tg-031e">L</td> <td class="tg-0ord">0</td> </tr> <tr> <td class="tg-031e">F</td> <td class="tg-0ord">0</td> </tr></table>';
                inject_this.innerHTML = html_string;
                var list = getElementByXpath("//*[@class=\"col-xs-12\"]/p");
                try{ //My Materials page
                    list.insertBefore(inject_this, list.childNodes[0]);
                }
                catch(err){ //My Monster page
                    list = getElementByXpath("//*[@id=\"edit-form\"]");
                    list.insertBefore(inject_this, list.childNodes[0]);
                }
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
        try{
        while(array[m].id != n){
            m--;
            if (m < 0){
                console.log("Monster ID: " + start + " not found in padherder database");
                return 2897;
            }
        }}
        catch(err){
            console.log("Monster ID: " + start + " not found in padherder database");
            return 2898;
        }
        return m;
    }
    function getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    function tooltipgen(split_count, split_prio, split_transition, prio, letter){
        var z = 0, count = 0;
        var tooltip = '';
        while (z < split_count.length){
            if (split_prio[z] == prio){
                count += parseInt(split_count[z]);
                tooltip += split_count[z] + " for " + split_transition[z] + "<br>";
            }
            z++;
        }
        return '<tr class="tooltip2"> <td class="tg-031e">' + letter + '</td> <td class="tg-0ord">' + count + '<span class="tooltip2text">' + tooltip + '</span></td> </tr>';
    }
})();
