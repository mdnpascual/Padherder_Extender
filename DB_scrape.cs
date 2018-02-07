using System;
using System.Globalization;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using System.Net;


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
            List<List<String>> MonsID = CSV_Parser(path + "\\TBL_MONSTER.csv");
            List<List<String>> SkillID = CSV_Parser(path + "\\TBL_SKILL.csv");
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
            String test = "[";
            //Sort by MONSTER_NO_US
            while (i < MonsID.Count)
            {
                if (RotMat.Contains(MonsID[i][31]))
                {
                    List<List<String>> RotListFind = RotList.Where(o => o[1] == RotMatID[RotMat.IndexOf(MonsID[i][31])]).OrderByDescending(o => o[5]).ToList();
                    MonsID[i][10] = RotListFind[0][4];
                }
                test += "{\"element2\":null,\"awoken_skills\":[],\"rcv_scale\":" +
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
                MonsID[i][23] + "},";
                i++;
            }
            test = test.Remove(test.Length - 1);
            test += "]";
            File.WriteAllText(path + "\\monsters.json", test);

            //Remove SEARCH_DATA
            i = 0;
            test = "[";
            
            while (i < SkillID.Count)
            {
                try
                {
                    test += "{\"min_cooldown\":" +
                    SkillID[i][9] + ",\"effect\":\"nan\",\"max_cooldown\":" +
                    SkillID[i][10] + ",\"name\":\"" +
                    SkillID[i][0] + "\"},";
                }
                catch (Exception e)
                {
                    i++;
                    continue;
                }
                i++;
            }
            test = test.Remove(test.Length - 1);
            test += "]";
            File.WriteAllText(path + "\\active_skills.json", test);
            
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
            test = "{";
            while (i < SortedList.Count)
            {
                test += "\"" + SortedList[i][0] + "\":[";
                int j = 0;
                while (j < SortedList[i].Count - 1)
                {
                    string[] splitmat = SortedList[i][j + 1].Split(stringSeparators, StringSplitOptions.None);
                    
                    test += "{\"is_ultimate\":true,\"materials\":" + splitmat[0] + "]]," +
                    "\"evolves_to\":" + splitmat[1] + "},";
                    j++;
                }
                test = test.Remove(test.Length - 1);
                test += "],";
                i++;
            }
            test = test.Remove(test.Length - 1);
            test += "}";
            File.WriteAllText(path + "\\evolutions.json", test);
            
            //Get schedule
            i = 0;
            DateTime thisDay = DateTime.Today;
            test = ((int)thisDay.DayOfWeek).ToString() + "\r\n";
            test += "February Quest - Hero Descended!::: 191,193,195,197,199,171,172,173,174,175,69,71,73,75,77,110,221,223,\r\nFebruary Quest - The Goddess Descended!::: 191,193,195,197,199,171,172,173,174,175,234,86,475,476,477,225,\r\nFebruary Quest - Dark Knight!::: 792,906,101,109,1647,\r\nFebruary Quest - Great Tengu Descended!::: 550,689,311,717,718,681,545,547,549,551,553,580,777,\r\nFebruary Quest - Guan Yinping!::: 545,547,549,551,553,1527,1530,717,718,681,1526,1528,1876,1589,\r\nFebruary Quest - Draggie!::: 36,38,40,42,44,687,688,37,39,41,43,45,684,685,686,742,\r\nFebruary Quest - Dragon Zombie::: 578,603,1063,1061,\r\nFebruary Quest - Zeus Vulcan Descended!::: 788,790,794,23,399,222,224,598,1251,\r\nFebruary Quest - Heracles Descended!::: 406,107,94,1097,\r\nFebruary Quest - Izanami Descended!::: 2216,827,829,811,813,\r\nFebruary Quest - Athena Descended!::: 107,224,222,648,\r\nFebruary Quest - Takeminakata Descended!::: 545,547,549,551,553,827,829,809,\r\nFebruary Quest - Hera-Is Descended!::: 476,479,217,220,412,284,33,661,596,\r\nFebruary Quest - Kanetsugu!::: 717,718,779,545,547,549,551,553,550,552,554,1528,1530,689,681,541,542,1524,\r\nFebruary Quest - Azazel Descended!::: 2313,2583,3209,1749,300,3456,\r\nFebruary Quest - Serket Descended!::: 2007,2823,1917,1961,3258,3456,\r\nFebruary Quest - Khepri Descended!::: 788,1171,1172,1173,1174,1175,1542,1466,2723,2724,2725,2726,2727,1169,1186,586,1836,2007,3158,\r\nFebruary Quest - Liberty Geist Descended!::: 80,2195,2197,2581,2647,2649,320,3014,2886,3016,\r\nFebruary Quest - Hanuman Descended!::: 2837,\r\nFebruary Quest - Seraphis Descended!::: 2652,2654,2656,2585,2643,2650,783,2890,\r\nFebruary Quest - Shuten-doji Descended!::: 161,166,170,234,2305,1529,1468,1467,1765,2804,\r\nFebruary Quest - Jormungandr Descended!::: 1171,1172,1173,1174,1175,2313,475,476,477,478,479,1170,1064,790,88,2638,\r\nFebruary Quest - Gran Reverse Descended!::: 32,35,971,1132,1133,1134,1135,2736,\r\nFebruary Quest - Yamatsumi Descended!::: 545,547,549,551,553,2307,2309,1527,1528,774,541,2548,\r\nFebruary Quest - Journey to the West::: 545,547,549,551,553,2183,2181,1247,1245,\r\nFebruary Quest - Sphinx Descended!::: 788,794,403,1462,1464,2007,\r\nFebruary Quest - Sonia Gran Descended!::: 23,26,29,772,773,774,775,776,1759,\r\nFebruary Quest - Zeus Mercury Descended!::: 317,907,1545,788,401,263,265,267,269,271,596,1531,\r\n";
            Console.WriteLine(thisDay.ToString("yyyy-MM-dd"));
            List<List<String>> Dungeon = CSV_Parser(path + "\\TBL_DUNGEON.csv");
            List<List<String>> DungeonMonster = CSV_Parser(path + "\\TBL_DUNGEON_MONSTER.csv");
            List<List<String>> Schedule = CSV_Parser(path + "\\TBL_SCHEDULE.csv");
            List<List<String>> SubDungeon = CSV_Parser(path + "\\TBL_SUB_DUNGEON.csv");
            //Filtering stuff
            List<List<String>> USonly = Schedule.Where(o => (o[3] == "US") && (o[2] == "0")).ToList();
            List<List<String>> ValidCloseTime = USonly.Where(o => DateTime.Parse(o[14], CultureInfo.CreateSpecificCulture("en-US")) > thisDay.AddDays(1)).ToList();
            List<List<String>> ValidOpenTime = ValidCloseTime.Where(o => DateTime.Parse(o[9], CultureInfo.CreateSpecificCulture("en-US")) < thisDay.AddDays(1)).ToList();

            while (i < ValidOpenTime.Count)
            {
                String DungeonID = ValidOpenTime[i][1];
                String DungeonName = Dungeon.Where(o => o[0] == DungeonID).ToList()[0][3];
                List<List<String>> Difficulty = SubDungeon.Where(o => o[1] == DungeonID).ToList();
                Difficulty = Difficulty.OrderByDescending(o => o[3]).ToList();
                int j = 0;
                while (j < Difficulty.Count)
                {
                    test += DungeonName + " Lvl." + Difficulty[j][3] + "::: ";
                    List<List<String>> Drop = DungeonMonster.Where(o => (o[3] == Difficulty[j][0]) && (o[2] == DungeonID)).ToList();
                    int k = 0;
                    List<String> DropMons = new List<String>();
                    while (k < Drop.Count)
                    {
                        DropMons.Add(Drop[k][11]);
                        k++;
                    }
                    k = 0;
                    DropMons = DropMons.Distinct().ToList();
                    DropMons.Remove("0");
                    while (k < DropMons.Count)
                    {
                        test += DropMons[k] + ",";
                        k++;
                    }
                    test = test.Remove(test.Length - 1);
                    test += "\r\n";
                    j++;
                }
                i++;
            }
            File.WriteAllText(path + "\\Schedule.json", test);

            //Upload schedule to database
            //Source: https://stackoverflow.com/questions/18960868/how-to-create-a-gist-on-github-with-basic-authentication-in-c-sharp

            String jsonMessage = "{ \"description\": \"PadxExtender daily database\",  \"public\": true,"
                   + "\"files\": {   \"file1.txt\": {"
                   + "\"content\":\"" + test.Replace("\r\n", "\\n") + "\"  } }}";

            String _url = "https://api.github.com/gists/e11935cf82505acbdd2b6e03a8cfe440";

            HttpWebRequest req = WebRequest.Create(new Uri(_url)) as HttpWebRequest;

            //String userName = "username";
            //String userPassword = "pass";
            //string authInfo = userName + ":" + userPassword;
            //authInfo = Convert.ToBase64String(Encoding.Default.GetBytes(authInfo));

            req.Method = "PATCH";
            req.ContentType = "application/x-www-form-urlencoded; charset=UTF-8";
            // req.Headers.Add(string.Format("Authorization: token {0}", oauthToken));
            //req.Headers.Add("Authorization", "Basic " + Convert.ToBase64String(new ASCIIEncoding().GetBytes(username + ":" + password)));
            req.Headers.Add("Authorization: token <40 STRING LENGTH TOKEN>"); //Padherder_extender token
            req.UserAgent = "Anything";
            StreamWriter writer = new StreamWriter(req.GetRequestStream());

            System.Diagnostics.Debug.WriteLine(jsonMessage);
            writer.Write(jsonMessage);
            writer.Close();

            string result = null;
            using (HttpWebResponse resp = req.GetResponse() as HttpWebResponse)//Exception here
            {
                StreamReader reader =
                    new StreamReader(resp.GetResponseStream());
                result = reader.ReadToEnd();
                System.Diagnostics.Debug.WriteLine(result);
            }

            i++;
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
    }
}
