// ==UserScript==
// @name         Padx_test
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       MDuh
// @match        http://puzzledragonx.com/
// @require      http://userscripts-mirror.org/scripts/source/107941.user.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    //alert("I am an alert box!"); //DEBUGGER
    //console.log(storedday); //DEBUGGER
    var today = new Date( new Date().getTime() + -2 * 3600 * 1000).getDay();
    var storedday = GM_getValue("date_sync", -1);
    var storedday2 = GM_getValue("date_sync", -1);
    var blah = GM_getValue("padx_scraped", -1);
    var padxscraped = GM_getValue("padx_scraped", -1);

    var timeParse = [];
    timeParse.push($.get("https://gist.githubusercontent.com/padxExtender/e11935cf82505acbdd2b6e03a8cfe440/raw/file1.txt", function( database_scraped ) {
        var lines = database_scraped.split("\n");
        storedday = lines[0];
    }));
    timeParse.push($.get("https://gist.githubusercontent.com/padxExtender/e11935cf82505acbdd2b6e03a8cfe440/raw/", function( database_scraped ) {
        var lines = database_scraped.split("\n");
        storedday2 = lines[0];
    }));

    $.when(timeParse[0], timeParse[1]).done(function() {
        if ((storedday == today) || (storedday2 == today)){
            //No need to Fetch dungeon and monsters
            /*$.ajax({
                url: 'https://api.github.com/authorizations',
                type: 'POST',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", "Basic " + btoa("USERNAME:PASSWORD"));
                },
                data: '{"scopes":["gist"],"note":"PadxExtender daily database"}'
            }).done(function(response) {
                console.log(response);
                console.log("Nothing to scrape");
            });*/
            /*$.ajax({
                url: 'https://api.github.com/gists',
                type: 'POST',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", "token put_token_here");
                },
                data: '{"description": "a gist for a user with token api call via ajax","public": true,"files": {"file1.txt": {"content": "String file contents via ajax"}}}'
            }).done(function(response) {
                console.log(response);
            });*/

            console.log("Nothing to scrape");
        }
        else{
            GM_setValue("date_sync", today);
            console.log("Scraping...");
            //Step 1: Get today's dungeon name and URL
            var condition = document.evaluate('//*[@id="event"]/tbody/tr/td[4]/span[3]/div/span', document, null, XPathResult.ANY_TYPE, null);
            var finder = document.evaluate('//*[@class="eventname"]/a', document, null, XPathResult.ANY_TYPE, null);
            var cond = condition.iterateNext();
            var find = finder.iterateNext();

            var outputStringarr = [];
            var dungeonNames = [];
            var dungeonURL = [];
            var ignoreList = [147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 227, 234, 246, 247, 248, 249, 250, 251, 321, 797, 915, 916, 1002, 1085, 1086, 1087, 1176, 1294, 1295];

            //Step 2: Loop through XPath and stop when dungeon has not started string is found (signifies a dungeon for tomorrow
            while (cond){
                if (cond.textContent == "The dungeon has not started"){
                    break;
                }
                //alert(find.textContent);
                dungeonNames.push(find.textContent);
                dungeonURL.push(find.href);
                //console.log("href: " + find.href);
                //console.log("Text: " + find.textContent);
                cond = condition.iterateNext();
                find = finder.iterateNext();
            }

            //Step 3: Open Dungeon URL and parses the possible monster drops and sort them unto outputStringarr
            var i = 0;
            var j = 0;
            var functionales = [];
            var functionales2 = [];
            while (i < dungeonURL.length){
                functionales.push($.get(dungeonURL[i], function( padx_scraped ) {
                    var outputString2 = "";
                    var doc = document.implementation.createHTMLDocument("");
                    doc.documentElement.innerHTML = padx_scraped;
                    var dunName = doc.evaluate('//*[@id="tablestat"]/tbody/tr[2]/td[2]', doc, null, XPathResult.ANY_TYPE, null);
                    var dunNameout = dunName.iterateNext();

                    //Step 3.5: Parses additional Dungeon URL for multi-level dungeons
                    var extraDungeon = doc.evaluate('//*[@class="title nowrap"]/a', doc, null, XPathResult.ANY_TYPE, null);
                    if (extraDungeon !== null){
                        var extraLevels = doc.evaluate('//*[@class="section"]/table/tbody/tr/*[@class="title nowrap"]/a/@href', doc, null, XPathResult.ANY_TYPE, null);
                        var extraLevelsout = extraLevels.iterateNext();
                        while (extraLevelsout){
                            functionales2.push(extraLevelsout.textContent);
                            //console.log(extraLevelsout.textContent);
                            extraLevelsout = extraLevels.iterateNext();
                        }
                        //TODO: Parse multilevel dungeons
                    }

                    outputString2 = outputString2 + dunNameout.textContent + "::: ";

                    var monsterLinks = doc.evaluate('//*[@id="tabledrop"]/tbody/tr/td[8]/div/a/@href', doc, null, XPathResult.ANY_TYPE, null);
                    var mLinks = monsterLinks.iterateNext();
                    while (mLinks){
                        var mID = mLinks.textContent.split("=")[1];
                        if (!ignoreList.includes(parseInt(mID))){
                            outputString2 = outputString2 + mID + ",";
                        }
                        mLinks = monsterLinks.iterateNext();
                    }
                    outputStringarr.push(outputString2);
                    j++;
                }));
                i = i + 1;
            }

            //Step 4: Deal with multi-level dungeons
            i = 0; j = 0;
            var functionales3 = [];
            $.when(functionales[functionales.length-1]).done(function() {
                //console.log(functionales2);
                //http://puzzledragonx.com/en/
                while (i < functionales2.length){
                    functionales3.push($.get("http://puzzledragonx.com/en/" + functionales2[i], function( padx_scraped ) {
                        var outputString2 = "";
                        var doc = document.implementation.createHTMLDocument("");
                        doc.documentElement.innerHTML = padx_scraped;
                        var dunName = doc.evaluate('//*[@id="tablestat"]/tbody/tr[2]/td[2]', doc, null, XPathResult.ANY_TYPE, null);
                        var dunNameout = dunName.iterateNext();

                        outputString2 = outputString2 + dunNameout.textContent + "::: ";

                        var monsterLinks = doc.evaluate('//*[@id="tabledrop"]/tbody/tr/td[8]/div/a/@href', doc, null, XPathResult.ANY_TYPE, null);
                        var mLinks = monsterLinks.iterateNext();
                        while (mLinks){
                            var mID = mLinks.textContent.split("=")[1];
                            if (!ignoreList.includes(mID)){
                                outputString2 = outputString2 + mID + ",";
                            }
                            mLinks = monsterLinks.iterateNext();
                        }
                        outputStringarr.push(outputString2);
                        j++;
                    }));
                    i = i + 1;
                }
            });

            $.when(functionales[functionales.length-1]).done(function() {
                $.when(functionales3[functionales3.length-1]).done(function() {
                    GM_setValue("padx_scraped", outputStringarr);
                    console.log("Padx done scraping for today!");
                    var combined = today + "\n";

                    $.ajax({
                        url: 'https://api.github.com/gists/e11935cf82505acbdd2b6e03a8cfe440',
                        type: 'PATCH',
                        beforeSend: function(xhr) {
                            xhr.setRequestHeader("Authorization", "token " + atob("fuckoff")); //See private repo for updated access token
                        },
                        data: JSON.stringify({"description": "PadxExtender daily database","public": true,"files": {"file1.txt": {"content": combined + outputStringarr.join("\n") }}})
                    }).done(function(response) {
                        //console.log(response);
                    });
                });
            });
        }
    });
})();
