﻿using System;
using System.Globalization;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using System.Net;
using System.Security.Cryptography;


using File = System.IO.File;


namespace Padguide_Scrape
{
    class DB_scrape
    {
        static int index = 0;
        [STAThread]
        static void Main(string[] args)
        {
            String path = Environment.CurrentDirectory;
            List<List<String>> MonsID = CSV_Parser(path + "\\TBL_MONSTER.csv"); //Remove commas and quotes, sort by MONSTER_NO_US (Control Panel >> Region >> Additional Settings >> Change List Separator to "|"
            List<List<String>> SkillID = CSV_Parser(path + "\\TBL_SKILL.csv"); //Remove SEARCH_DATA (No need if delimiter = "|")
            List<List<String>> Rotation = CSV_Parser(path + "\\TBL_SKILL_ROTATION.csv");
            List<List<String>> RotList = CSV_Parser(path + "\\TBL_SKILL_ROTATION_LIST.csv");
            List<String> RotMat = new List<String>();
            List<String> RotMatID = new List<String>();
            foreach (List<String> obj in Rotation.Where(o => (o[4] == "US") && (o[2] == "0")))
            {
                RotMat.Add(obj[1]);
                RotMatID.Add(obj[0]);
            }
            
            int i = 0;
            StringBuilder test = new StringBuilder("[");
            //String test = "[";
            while (i < MonsID.Count)
            {
                if (RotMat.Contains(MonsID[i][31]))
                {
                    List<List<String>> RotListFind = RotList.Where(o => o[1] == RotMatID[RotMat.IndexOf(MonsID[i][31])]).OrderByDescending(o => o[5]).ToList();
                    MonsID[i][10] = RotListFind[0][4];
                }
                test.Append("{\"element2\":null,\"awoken_skills\":[],\"rcv_scale\":" +
                MonsID[i][24] + ",\"id\":" +
                MonsID[i][31] + ",\"type3\":null,\"type2\":null,\"image40_href\":\"images/icons/icon_" +
                imgID(MonsID[i][0]) + ".png\",\"xp_curve\":0,\"leader_skill\":\"nan\",\"image40_size\":0,\"version\":0,\"atk_min\":" +
                MonsID[i][18] + ",\"atk_max\":" +
                MonsID[i][19] + ",\"jp_only\":false,\"image60_size\":0,\"max_level\":" +
                MonsID[i][14] + ",\"image60_href\":\"images/icons/icon_" +
                imgID(MonsID[i][0]) + ".png\",\"monster_points\":1,\"rcv_min\":" +
                MonsID[i][20] + ",\"rcv_max\":" +
                MonsID[i][21] + ",\"hp_max\":" +
                MonsID[i][17] + ",\"hp_scale\":" +
                MonsID[i][22] + ",\"name\":\"" +
                MonsID[i][6] + "\",\"team_cost\":" +
                MonsID[i][13] + ",\"type\":1,\"hp_min\":" +
                MonsID[i][16] + ",\"name_jp\":\"nan\",\"rarity\":" +
                MonsID[i][12] + ",\"active_skill\":\"" +
                MonsID[i][10] + "\",\"feed_xp\":0,\"element\":0,\"atk_scale\":" +
                MonsID[i][23] + "},");
                i++;
            }
            //test = test.Remove(test.Length - 1);
            //test += "]";
            test.Remove(test.Length - 1, 1);
            test.Append("]");
            File.WriteAllText(path + "\\monsters.json", test.ToString());

            i = 0;
            test.Clear();
            test.Append("[");
            
            while (i < SkillID.Count)
            {
                try
                {
                    test.Append("{\"min_cooldown\":" +
                    SkillID[i][9] + ",\"effect\":\"nan\",\"max_cooldown\":" +
                    SkillID[i][10] + ",\"name\":\"" +
                    SkillID[i][0] + "\"},");
                }
                catch (Exception e)
                {
                    i++;
                    continue;
                }
                i++;
            }
            //test = test.Remove(test.Length - 1);
            test.Remove(test.Length - 1, 1);
            test.Append("]");
            File.WriteAllText(path + "\\active_skills.json", test.ToString());
            
            i = 0;
            List<List<String>> Evo = CSV_Parser(path + "\\TBL_EVOLUTION.csv");
            List<List<String>> EvoMat = CSV_Parser(path + "\\TBL_EVO_MATERIAL.csv");
            List<List<String>> parser = new List<List<String>>();
            while (i < Evo.Count)
            {
                if (!existAlready(parser, Evo[i][1]))
                {
                    parser.Add(new List<String>());
                    parser[parser.Count-1].Add(Evo[i][1]);
                    parser[parser.Count - 1].Add(getMats(EvoMat, Evo[i][0]) + "," + Evo[i][2]);
                }
                else
                {
                    parser[index].Add(getMats(EvoMat, Evo[i][0]) + "," + Evo[i][2]);
                }
                i++;
            }

			//Sort by MonsID
            List<List<String>> SortedList = parser.OrderBy(o => Int32.Parse(o[0])).ToList();
            string[] stringSeparators = new string[] { "]]," };
            i = 0;
            test.Clear();
            test.Append("{");
            while (i < SortedList.Count)
            {
                test.Append("\"" + SortedList[i][0] + "\":[");
                int j = 0;
                while (j < SortedList[i].Count - 1)
                {
                    string[] splitmat = SortedList[i][j + 1].Split(stringSeparators, StringSplitOptions.None);
                    
                    test.Append("{\"is_ultimate\":true,\"materials\":" + splitmat[0] + "]]," +
                    "\"evolves_to\":" + splitmat[1] + "},");
                    j++;
                }
                test.Remove(test.Length - 1, 1);
                test.Append("],");
                i++;
            }
            test.Remove(test.Length - 1, 1);
            test.Append("}");
            File.WriteAllText(path + "\\evolutions.json", test.ToString());
            
            //Get schedule
            i = 0;
            DateTime thisDay = DateTime.Today.AddHours(1);
            test.Clear();
            test.Append(((int)thisDay.DayOfWeek).ToString() + "\r\n");
            //test.Append("February Quest - Hero Descended!::: 191,193,195,197,199,171,172,173,174,175,69,71,73,75,77,110,221,223,\r\nFebruary Quest - The Goddess Descended!::: 191,193,195,197,199,171,172,173,174,175,234,86,475,476,477,225,\r\nFebruary Quest - Dark Knight!::: 792,906,101,109,1647,\r\nFebruary Quest - Great Tengu Descended!::: 550,689,311,717,718,681,545,547,549,551,553,580,777,\r\nFebruary Quest - Guan Yinping!::: 545,547,549,551,553,1527,1530,717,718,681,1526,1528,1876,1589,\r\nFebruary Quest - Draggie!::: 36,38,40,42,44,687,688,37,39,41,43,45,684,685,686,742,\r\nFebruary Quest - Dragon Zombie::: 578,603,1063,1061,\r\nFebruary Quest - Zeus Vulcan Descended!::: 788,790,794,23,399,222,224,598,1251,\r\nFebruary Quest - Heracles Descended!::: 406,107,94,1097,\r\nFebruary Quest - Izanami Descended!::: 2216,827,829,811,813,\r\nFebruary Quest - Athena Descended!::: 107,224,222,648,\r\nFebruary Quest - Takeminakata Descended!::: 545,547,549,551,553,827,829,809,\r\nFebruary Quest - Hera-Is Descended!::: 476,479,217,220,412,284,33,661,596,\r\nFebruary Quest - Kanetsugu!::: 717,718,779,545,547,549,551,553,550,552,554,1528,1530,689,681,541,542,1524,\r\nFebruary Quest - Azazel Descended!::: 2313,2583,3209,1749,300,3456,\r\nFebruary Quest - Serket Descended!::: 2007,2823,1917,1961,3258,3456,\r\nFebruary Quest - Khepri Descended!::: 788,1171,1172,1173,1174,1175,1542,1466,2723,2724,2725,2726,2727,1169,1186,586,1836,2007,3158,\r\nFebruary Quest - Liberty Geist Descended!::: 80,2195,2197,2581,2647,2649,320,3014,2886,3016,\r\nFebruary Quest - Hanuman Descended!::: 2837,\r\nFebruary Quest - Seraphis Descended!::: 2652,2654,2656,2585,2643,2650,783,2890,\r\nFebruary Quest - Shuten-doji Descended!::: 161,166,170,234,2305,1529,1468,1467,1765,2804,\r\nFebruary Quest - Jormungandr Descended!::: 1171,1172,1173,1174,1175,2313,475,476,477,478,479,1170,1064,790,88,2638,\r\nFebruary Quest - Gran Reverse Descended!::: 32,35,971,1132,1133,1134,1135,2736,\r\nFebruary Quest - Yamatsumi Descended!::: 545,547,549,551,553,2307,2309,1527,1528,774,541,2548,\r\nFebruary Quest - Journey to the West::: 545,547,549,551,553,2183,2181,1247,1245,\r\nFebruary Quest - Sphinx Descended!::: 788,794,403,1462,1464,2007,\r\nFebruary Quest - Sonia Gran Descended!::: 23,26,29,772,773,774,775,776,1759,\r\nFebruary Quest - Zeus Mercury Descended!::: 317,907,1545,788,401,263,265,267,269,271,596,1531,\r\n");
            //test.Append("March Quest - Rushana Descended!-No Dupes::: 3212,3213,3214,3215,3216,2181,2430,2431,3835,3836,3837,3207,3208,3209,3210,3211,3966,\r\nMarch Quest - Kuramitsuha Descended!-No Skyfall combos::: 2309,1530,2545,2546,544,3152,3250,\r\nMarch Quest - Gran Reverse Descended!-Dragon Enhanced::: 32,35,971,1132,1133,1134,1135,2736,\r\nMarch Quest - Surtr Descended!-All Att. Req::: 2311,2313,1224,2397,\r\nMarch Quest - Zeus & Hera Descended!::: 684,685,686,1922,\r\nMarch Quest - Medjedra Descended!::: 161,172,173,794,788,234,1466,1836,\r\nMarch Quest - Wadatsumi Descended!-Awoken Skills Invalid::: 548,690,310,717,790,90,1306,\r\nMarch Quest - Hera-Beorc Descended!::: 792,92,1188,\r\nMarch Quest - Sandalphon Descended!-No Dupes::: 404,94,1118,\r\nMarch Quest - Hera Descended!::: 191,192,193,194,195,196,197,198,199,200,189,\r\n");
            //test.Append("April Quest - Ras Descended!::: 521,579,1964,250,98,102,2881,318,782,3328,\r\nApril Quest - Mion Descended!::: 2196,2197,3063,294,974,1118,3220,\r\nApril Quest - Cosmo Crusader Descended! - No RCV::: 2195,2197,2653,86,2336,105,319,3154,2889,3156,\r\nApril Quest - Hanuman Descended! - No Dupes::: 2837,\r\nApril Quest - Hephaestus Descended!::: 794,906,907,908,909,910,99,1541,1542,2721,\r\nApril Quest - Hel Descended!::: 796,2305,2311,32,1061,2401,\r\nApril Quest - Deus ex Machina Descended!!::: 2198,2195,283,284,285,286,287,782,783,784,785,786,285,287,316,317,318,319,2233,2888,\r\nApril Quest - Jord Descended!::: 153,227,690,691,788,101,792,2319,\r\nApril Quest - Aamir Descended!::: 191,193,195,197,199,1527,1528,475,476,477,478,479,1771,1773,1775,1777,1779,206,207,208,209,210,1749,2068,\r\nApril Quest - Zhou Yu!! - All Att Needed::: 1370,681,1527,1529,399,2103,\r\nApril Quest - Sonia Gran Descended!::: 23,26,29,772,773,774,775,776,1759,\r\nApril Quest - Thoth & Sopdet Descended!::: 147,148,149,150,151,321,403,896,898,900,902,904,1462,1464,\r\nApril Quest - Noah Descended! - All Att Needed::: 304,306,308,601,603,1178,1180,1182,1184,1186,263,265,267,269,271,398,400,402,404,406,26,1460,\r\nApril Quest - Hera-Sowilo Descended!::: 191,193,195,197,199,793,98,100,102,104,108,794,910,199,793,98,100,102,104,108,200,32,200,110,478,479,648,1249,\r\nApril Quest - Heracles Descended!::: 406,107,94,1097,\r\nApril Quest - Beelzebub Descended!::: 406,644,\r\nApril Quest - Zeus-Dios Descended!::: 221,223,402,94,189,650,\r\nApril Quest - The Thief Descended!::: 545,547,549,545,547,549,546,548,550,546,548,550,565,\r\nApril Quest - General Yan - Physical & Attacker Enhanced::: 689,690,691,546,548,550,540,542,1716,1424,\r\nApril Quest - Dragon Zombie - Dragon Enhanced::: 578,603,1063,1061,\r\n");
            //test.Append("May Quest - Demonius Descended! - All Att Needed::: 2580,2646,2589,86,2338,2727,320,3597,\r\nMay Quest - Liberty Geist Descended!::: 80,2195,2197,2581,2647,2649,320,3014,2886,3016,\r\nMay Quest - Serket Descended!::: 2007,2823,1917,1961,3258,\r\nMay Quest - Seraphis Descended!::: 2652,2654,2656,2585,2643,2650,783,2890,\r\nMay Quest - Gran Reverse Descended!::: 32,35,971,1132,1133,1134,1135,2736,\r\nMay Quest - Indigo Descended!::: 2196,2199,407,1751,2262,\r\nMay Quest - Journey to the West::: 545,547,549,551,553,2183,2181,1247,1245,\r\nMay Quest - Sphinx Descended!::: 788,794,403,1462,1464,2007,\r\nMay Quest - Kaguya-Hime::: 545,547,549,551,553,774,689,1468,1944,\r\nMay Quest - Diagoldos Descended!::: 160,155,156,157,158,1539,1540,29,4,8,12,288,1878,\r\nMay Quest - Grimoires Descended!::: 191,193,195,197,199,788,790,794,1178,1180,1182,475,476,477,1749,1751,1753,\r\nMay Quest - Zhao Yun Descended!::: 827,1527,829,1529,1714,1710,\r\nMay Quest - Zeus Mercury Descended!::: 317,907,1545,788,401,263,265,267,269,271,596,1531,\r\nMay Quest - Kanetsugu!::: 717,718,779,545,547,549,551,553,550,552,554,1528,1530,689,681,541,542,1524,\r\nMay Quest - Cauchemar Descended!::: 1543,475,96,1628,\r\nMay Quest - Takeminakata Descended! - No Wd / Dk::: 545,547,549,551,553,827,829,809,\r\nMay Quest - Hera-Ur Descended!::: 2212,312,314,350,598,\r\nMay Quest - Satan Descended! - No RCV::: 400,406,96,110,646,\r\nMay Quest - Gaia Descended! - God Enhanced::: 779,154,583,584,789,792,1222,\r\nMay Quest - Hero Descended!::: 191,193,195,197,199,171,172,173,174,175,69,71,73,75,77,110,221,223,");
            test.Append("June Quest - Azazel Descended!::: 2313,2583,3209,1749,300,3456,\r\nJune Quest - Mion Descended!::: 2196,2197,3063,294,974,1118,3220,\r\nJune Quest - Star Justice Descended! All Att Needed::: 99,101,103,105,109,2986,2887,2988,\r\nJune Quest - Shuten-doji Descended!::: 161,166,170,234,2305,1529,1468,1467,1765,2804,\r\nJune Quest - Jormungandr Descended!::: 1171,1172,1173,1174,1175,2313,475,476,477,478,479,1170,1064,790,88,2638,\r\nJune Quest - Takemikazuchi Descended! - Balanced Enhanced::: 2435,2436,2437,2438,2439,2307,2429,155,156,157,159,1467,2550,\r\nJune Quest - Yamatsumi Descended! - Wood Enhanced::: 545,547,549,551,553,2307,2309,1527,1528,774,541,2548,\r\nJune Quest - Surtr Descended! - All Att Needed::: 2311,2313,1224,2397,\r\nJune Quest - Zeus & Hera Descended!::: 684,685,686,1922,\r\nJune Quest - Indigo Descended!::: 2196,2199,407,1751,2262,\r\nJune Quest - Jord Descended!::: 153,227,690,691,788,101,792,2319,\r\nJune Quest - Sonia Gran Descended!::: 23,26,29,772,773,774,775,776,1759,\r\nJune Quest - Medjedra Descended!::: 161,172,173,794,788,234,1466,1836,\r\nJune Quest - Mephisto Descended! - No RCV::: 478,479,407,1064,412,35,1509,\r\nJune Quest - Thoth & Sopdet Descended!::: 147,148,149,150,151,321,403,896,898,900,902,904,1462,1464,\r\nJune Quest - Heracles Descended!::: 406,107,94,1097,\r\nJune Quest - Athena Descended!::: 107,224,222,648,\r\nJune Quest - Zeus-Dios Descended!::: 221,223,402,94,189,650,\r\nJune Quest - Tengu!!! - Balanced Enhanced::: 550,689,311,717,718,681,545,547,549,551,553,580,777,\r\nJune Quest - Hera Descended!::: 191,192,193,194,195,196,197,198,199,200,189,\r\nJune Quest - Challenge Lv10::: 814,2402,3743,1836,812,2719,\r\nJune Quest - Challenge Lv9 - No Skyfall Combos::: 1462,1223,\r\nJune Quest - Challenge Lv8::: 783,1228,1466,1229,1206,3456,\r\nJune Quest - Challenge Lv7 - All Att Needed::: 1526,1528,3722,1245,2877,785,2736,\r\nJune Quest - Challenge Lv6::: \r\nJune Quest - Challenge Lv5::: 794,410,2405,4068,1961,\r\nJune Quest - Challenge Lv4::: 288,294,300,542,2545,2546,782,1592,\r\nJune Quest - Challenge Lv3 - Tricolor::: 247,248,249,151,1362,\r\nJune Quest - Challenge Lv2 - Tricolor::: 30,33,171,174,62,64,66,3961,3962,3963,\r\nJune Quest - Challenge Lv1 - Tricolor::: 2,262,264,264,209,210,577,578,");
            List<String> ignoreEvents = new List<string>(){ "1", "25", "65" };
            Console.WriteLine(thisDay.ToString("yyyy-MM-dd"));
            List<List<String>> Dungeon = CSV_Parser(path + "\\TBL_DUNGEON.csv");
            List<List<String>> DungeonMonster = CSV_Parser(path + "\\TBL_DUNGEON_MONSTER.csv");
            List<List<String>> Schedule = CSV_Parser(path + "\\TBL_SCHEDULE.csv");
            List<List<String>> SubDungeon = CSV_Parser(path + "\\TBL_SUB_DUNGEON.csv");
            List<List<String>> ExtraDrop = CSV_Parser(path + "\\TBL_DUNGEON_MONSTER_DROP.csv");
            //Filtering stuff
            List<List<String>> USonly = Schedule.Where(o => (o[3] == "US") && !(ignoreEvents.Contains(o[2]))).ToList();
            List<List<String>> ValidCloseTime = USonly.Where(o => DateTime.Parse(o[14], CultureInfo.CreateSpecificCulture("en-US")).AddHours(-7) >= thisDay.AddHours(3)).ToList();
            List<List<String>> ValidOpenTime = ValidCloseTime.Where(o => DateTime.Parse(o[9], CultureInfo.CreateSpecificCulture("en-US")).AddHours(-7) < thisDay.AddDays(1)).ToList();

            while (i < ValidOpenTime.Count)
            {
                String DungeonID = ValidOpenTime[i][1];
                String DungeonName = Dungeon.Where(o => o[0] == DungeonID).ToList()[0][3];
                List<List<String>> Difficulty = SubDungeon.Where(o => o[1] == DungeonID).ToList();
                Difficulty = Difficulty.OrderByDescending(o => o[3]).ToList();
                int j = 0;
                while (j < Difficulty.Count)
                {
                    //test += DungeonName + " Lvl." + Difficulty[j][3] + "::: ";
                    if (test.ToString().Contains(Decrypt(Difficulty[j][5], "<16LENGTHAESKEY>") + "::: "))
                    {
                        j++;
                        continue;
                    }
                    test.Append(Decrypt(Difficulty[j][5], "<16LENGTHAESKEY>") + "::: ");
                    List<List<String>> Drop = DungeonMonster.Where(o => (o[3] == Difficulty[j][0]) && (o[2] == DungeonID)).ToList();
                    int k = 0;
                    List<String> DropMons = new List<String>();
                    while (k < Drop.Count)
                    {
                        List<List<String>> Drop2 = ExtraDrop.Where(o => o[5] == Drop[k][0]).ToList();
                        int l = 0;
                        while (l < Drop2.Count)
                        {
                            DropMons.Add(Drop2[l][3]);
                            l++;
                        }
                        DropMons.Add(Drop[k][11]);
                        k++;
                    }
                    k = 0;
                    DropMons = DropMons.Distinct().ToList();
                    DropMons.Remove("0");
                    while (k < DropMons.Count)
                    {
                        test.Append(DropMons[k] + ",");
                        k++;
                    }
                    //test = test.Remove(test.Length - 1);
                    test.Append("\r\n");
                    j++;
                }
                i++;
            }
            test.Remove(test.Length - 2, 2);
            File.WriteAllText(path + "\\Schedule.json", test.ToString());

            //Upload schedule to database
            //Source: https://stackoverflow.com/questions/18960868/how-to-create-a-gist-on-github-with-basic-authentication-in-c-sharp
            
            StringBuilder jsonMessage = new StringBuilder("{ \"description\": \"PadxExtender daily database\",  \"public\": true,"
                   + "\"files\": {   \"file1.txt\": {"
                   + "\"content\":\"" + test.Replace("\r\n", "\\n").ToString() + "\"  } }}");

            String _url = "https://api.github.com/gists/e11935cf82505acbdd2b6e03a8cfe440";

            HttpWebRequest req = WebRequest.Create(new Uri(_url)) as HttpWebRequest;

            String userName = "padxExtender";
            String userPassword = "<PADXEXTENDERPASSWORD>";
            string authInfo = userName + ":" + userPassword;
            authInfo = Convert.ToBase64String(Encoding.Default.GetBytes(authInfo));

            ////req.Method = "PATCH";
            req.Method = "POST";
            req.ContentType = "application/x-www-form-urlencoded; charset=UTF-8";
            // req.Headers.Add(string.Format("Authorization: token {0}", oauthToken));
            req.Headers.Add("Authorization", "Basic " + Convert.ToBase64String(new ASCIIEncoding().GetBytes(userName + ":" + userPassword)));
            ////req.Headers.Add("Authorization: token <40LENGTHTOKENKEY>");
            req.UserAgent = "Anything";
            StreamWriter writer = new StreamWriter(req.GetRequestStream());

            System.Diagnostics.Debug.WriteLine(jsonMessage.ToString());
            writer.Write(jsonMessage.ToString());
            writer.Close();

            ServicePointManager.SecurityProtocol = SecurityProtocolType.Ssl3 | SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;
            string result = null;

            using (HttpWebResponse resp = req.GetResponse() as HttpWebResponse)//Exception here
            {
                StreamReader reader =
                    new StreamReader(resp.GetResponseStream());
                result = reader.ReadToEnd();
                System.Diagnostics.Debug.WriteLine(result);
            }
            
        }

        private static string getMats(List<List<String>> EvoMat, string tv_seq)
        {
            string output = "[";
            int i = 0;

            while (i < EvoMat.Count)
            {
                if (EvoMat[i][2] == tv_seq)
                {
                    output += "[" + EvoMat[i][1] + ",1],";
                }
                i++;
            }
            output = output.Remove(output.Length - 1);
            output += "]";
            return output;
        }

        private static bool existAlready(List<List<String>> parser, string target)
        {
            int i = 0;
            while (i < parser.Count)
            {
                try
                {
                    if (parser[i][0] == target)
                    {
                        index = i;
                        return true;
                    }
                }
                catch (Exception e)
                {
                    return false;
                }  
                i++;
            }
            return false;
        }

        private static string imgID(string orig)
        {
            if (orig.Length == 4)
                return orig;
            else if (orig.Length == 3)
                return "0" + orig;
            else if (orig.Length == 2)
                return "00" + orig;
            else if (orig.Length == 1)
                return "000" + orig;
            else
                return "ERROR";
        }

        private static List<List<String>> CSV_Parser(String filename)
        {
            StreamReader reader = new StreamReader(File.OpenRead(filename), System.Text.Encoding.Default, true);
            String line = reader.ReadLine();   //Waste reading 1 line
            int i = 0;

            List<List<String>> csv = new List<List<String>>();
            while (!reader.EndOfStream)
            {
                line = reader.ReadLine();
                String[] values = line.Split('|');  //Delimiter
                csv.Add(new List<String>());

                int j = 0;
                while (j < values.Length)
                {
                    csv[i].Add(values[j]);
                    j++;
                }
                i++;
            }
            return csv;
        }

        public static string Decrypt(String data, String key)
        {
            byte[] Databytes = ConvertHexStringToByteArray(data);
            byte[] AesKeyBytes = Encoding.UTF8.GetBytes(key);
            byte[] IVbytes = new byte[16] { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 };
            return DecryptAES(Databytes, AesKeyBytes, IVbytes);
        }

        public static byte[] ConvertHexStringToByteArray(string hexString)
        {
            if (hexString.Length % 2 != 0)
            {
                throw new ArgumentException(String.Format(CultureInfo.InvariantCulture, "The binary key cannot have an odd number of digits: {0}", hexString));
            }

            byte[] HexAsBytes = new byte[hexString.Length / 2];
            for (int index = 0; index < HexAsBytes.Length; index++)
            {
                string byteValue = hexString.Substring(index * 2, 2);
                HexAsBytes[index] = byte.Parse(byteValue, NumberStyles.HexNumber, CultureInfo.InvariantCulture);
            }

            return HexAsBytes;
        }

        public static String DecryptAES(byte[] buff, byte[] key, byte[] iv)
        {
            using (System.Security.Cryptography.RijndaelManaged rijndael = new System.Security.Cryptography.RijndaelManaged())
            {
                rijndael.Padding = PaddingMode.PKCS7;
                rijndael.Mode = CipherMode.CBC;
                rijndael.KeySize = 128;
                rijndael.BlockSize = 128;
                ICryptoTransform decryptor = rijndael.CreateDecryptor(key, iv);
                System.IO.MemoryStream memoryStream = new System.IO.MemoryStream(buff);
                CryptoStream cryptoStream = new CryptoStream(memoryStream, decryptor, CryptoStreamMode.Read);
                byte[] output = new byte[buff.Length];
                int readBytes = cryptoStream.Read(output, 0, output.Length);
                return System.Text.Encoding.UTF8.GetString(output, 0, readBytes);
            }
        }
    }
}