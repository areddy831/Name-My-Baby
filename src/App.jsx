import { useState, useEffect, useCallback, useRef } from "react";
import { fbGet, fbSet, fbRemove, fbListen } from "./firebase.js";

// ============================================================
// NAME DATABASE - 2000+ names
// Format: [name, origin] where origin: i=Indian, a=Arabic/Persian, f=African, k=Korean, g=Global/Other
// ============================================================
const RAW_NAMES = {
  i0: `Abhinav,Adhidev,Advik,Ajay,Akash,Amar,Amara,Amaro,Amato,Amay,Amitav,Amrit,Anith,Ankur,Aram,Archan,Arihan,Arihant,Arinav,Arnav,Arun,Arunesh,Ashvin,Avani,Avayan,Avikram,Avinash,Avinay,Avinek,Avinish,Avir,Aviraj,Aviram,Avirath,Avit,Avivan,Avni,Avnish,Avyan,Ayan,Ayvan,Devesh,Mehan,Mohan,Pravin,Rishin,Roshan,Sarvin,Suvidh,Tarun`.split(","),
  i1: `Varun,Veeraj,Vikrit,Draban,Vimin,Miresh,Amimit,Tatav,Kedalit,Nivin,Mukan,Yajin,Larik,Rirav,Pusin,Dratan,Ashvith,Liran,Arovan,Ariyat,Jivun,Vuman,Amiban,Mumir,Gidan,Munesh,Minav,Kaman,Avrikan,Yurin,Arutan,Vaban,Lanit,Lulit,Avurin,Divin,Amonik,Divesh,Amiansh,Lurin,Pitin,Adujit,Vavesh,Vibhor,Tanir,Avkav,Vaishnav,Tumir,Ralesh,Aminit`.split(","),
  i2: `Bhavraj,Vuraj,Amimin,Nuvesh,Timir,Miran,Rimit,Vumaj,Ariash,Dhirav,Hitin,Lamir,Rakev,Kiritam,Abiral,Ladan,Dhimin,Kunir,Aroansh,Nurit,Amitin,Ramit,Harav,Punir,Mivin,Himin,Bhirav,Arilit,Vidan,Madin,Aryan,Aritan,Shankrit,Tejin,Kiransh,Lapal,Milaj,Lavan,Amoash,Amuvik,Adilav,Kadan,Avirav,Avomit,Adirin,Avdan,Vuvesh,Lumal,Lanik,Yadin`.split(","),
  i3: `Rivin,Amiak,Tamesh,Aviush,Nimal,Kulan,Ralan,Amidev,Dratav,Tivin,Mohindra,Satik,Kshitij,Atitav,Ridal,Aririn,Akman,Tutan,Salan,Parash,Pavakrit,Avirbhav,Amudev,Avrinav,Amirit,Avriman,Arium,Vivekan,Shaesh,Putin,Palesh,Nirmish,Avridev,Havan,Dhavak,Limal,Madal,Bhuran,Nidev,Saptavir,Linik,Muvesh,Ariar,Yurav,Amikav,Nagir,Sidan,Siran,Rudesh,Lukev`.split(","),
  i4: `Aridav,Amunav,Silan,Murik,Ketanav,Hamir,Pivan,Nakesh,Gatav,Anrav,Arokrit,Sumal,Yunav,Ariresh,Amimik,Nakin,Vigir,Dhuvin,Virav,Vadir,Bhumit,Yaban,Livesh,Pitambar,Vishal,Aduvin,Palik,Jivum,Amivit,Yamir,Ninik,Avudin,Vivik,Hridesh,Sumanth,Kikan,Ruban,Dhumin,Rutin,Vunir,Valan,Kshatraj,Amodev,Valit,Punesh,Atitin,Numan,Amutik,Bratin,Avrivan`.split(","),
  i5: `Vumesh,Sivin,Kalyam,Videv,Avdav,Madesh,Adunit,Gavir,Mimal,Vurav,Kanak,Bhiman,Amokrit,Aripal,Jagvir,Amukta,Rimik,Abitan,Muvan,Nigir,Linesh,Sanjeevit,Adudev,Atahar,Dharit,Riraj,Avriyan,Naban,Ayrin,Avimin,Dralan,Gaman,Akitav,Tusin,Mamik,Lakev,Ruvir,Abum,Piban,Bharin,Pimir,Akar,Divyam,Adiban,Dhurav,Ravik,Vimik,Takan,Midan,Limesh`.split(","),
  i6: `Nitin,Druvam,Avritik,Aduish,Vilan,Hivan,Numir,Amoyan,Hamin,Deepakrit,Ruman,Munik,Amikan,Tadin,Bratav,Bhaman,Shiprit,Huran,Giran,Mudal,Lavin,Atidav,Runik,Narav,Arorit,Vikan,Dhiran,Yudan,Mimin,Hikan,Yulan,Garvik,Adrin,Dravid,Visin,Aviyan,Anitav,Sadin,Kinav,Rudev,Amyan,Nikev,Grakan,Suchitr,Aduman,Amomit,Yavan,Vinod,Rilit,Ayrav`.split(","),
  i7: `Amtin,Lilesh,Kidin,Kakan,Tamal,Amiat,Arujit,Amilav,Mavin,Magir,Aymin,Chirav,Pitan,Lidev,Arivir,Hunav,Nimik,Ariuk,Kripesh,Rakan,Dhuman,Patav,Adoman,Bhiran,Pinav,Kudin,Arurit,Avojit,Amitan,Punin,Mimesh,Amdav,Atikav,Gadin,Avorav,Aviash,Raraj,Manoj,Savan,Sahesh,Krishnav,Kavik,Larin,Lugir,Lumaj,Kandarp,Aniish,Kavin,Vamal,Muraj`.split(","),
  i8: `Lanesh,Guvin,Yuvesh,Akitin,Amuman,Tinir,Radal,Nishkalp,Avonav,Akikan,Pulan,Meghanth,Yanir,Nupal,Sakan,Avrimit,Nuvik,Aniash,Adrav,Adman,Amijit,Akimin,Namesh,Tavir,Gunir,Rakeshvar,Timan,Amidit,Ridan,Anoopam,Hadan,Arinir,Nitan,Vudir,Hridin,Muban,Nirin,Vatir,Gulan,Yuddhvir,Numaj,Lutir,Kamlesh,Nishesh,Vidir,Lalaj,Vadal,Huban,Marin,Tarin`.split(","),
  i9: `Abvan,Nanit,Rurik,Ligir,Yuman,Anekant,Vitir,Muvit,Runav,Panav,Ludan,Lulaj,Dhuvan,Amuyan,Aditan,Dharik,Arak,Lunit,Vumik,Runir,Rivit,Ravir,Vanit,Ariraj,Sanesh,Adim,Rarik,Yukan,Himir,Lilit,Hridan,Arat,Dravin,Kumal,Ramdev,Marav,Rurit,Ativan,Nidal,Yarin,Rulaj,Avurav,Numit,Lasin,Chuman,Avoman,Kusin,Aritik,Hurin,Shounak`.split(","),
  i10: `Nanik,Parik,Aviyam,Ruvesh,Anyan,Avar,Miman,Chitran,Milin,Rivan,Vatan,Nunir,Nimit,Dratin,Kamakrit,Rusin,Tiran,Amujit,Hasin,Lirav,Anitin,Vivesh,Vibesh,Nadin,Rumir,Hidan,Atikan,Arilesh,Kinir,Paban,Avat,Lilaj,Malaj,Dhunav,Ralit,Satesh,Amotan,Yutav,Dhamin,Ravan,Sahit,Kimin,Tapik,Mumit,Tutav,Lirik,Viman,Yogit,Vatav,Samal`.split(","),
  i11: `Dharith,Avilav,Amovin,Gunik,Kuvan,Varan,Draran,Nidan,Amipal,Ashokam,Ruvit,Avoraj,Givir,Mivik,Vidin,Avriish,Vuvir,Vuresh,Palan,Mamaj,Huvin,Atinav,Hudin,Atidan,Narit,Palin,Gudan,Adurin,Bhavan,Kuman,Sanjiv,Limit,Napal,Haran,Dimpal,Rohesh,Ganir,Givan,Luvesh,Vudan,Aninav,Kudan,Lidir,Vimit,Sasin,Chitesh,Numesh,Hivin,Avitik,Pamir`.split(","),
  i12: `Churav,Mumin,Chitin,Hiran,Turav,Bhuman,Bhuvin,Valaj,Amumit,Jivir,Aridan,Amivik,Avritan,Amum,Vivit,Ayurveda,Yumin,Rumit,Vunit,Hridayam,Sutin,Avovik,Tidan,Yogavir,Yadan,Sitin,Ratin,Vurik,Adidin,Atirav,Vudev,Ranir,Anilav,Ritir,Antan,Subesh,Avovir,Graman,Lurit,Tejik,Garav,Granav,Himakrit,Arivesh,Gamal,Kadin,Linav,Gavan,Arimin,Yamal`.split(","),
  i13: `Suban,Avinir,Amoraj,Sankrit,Rukmesh,Mimaj,Gikan,Kivir,Bralan,Nimin,Aruansh,Suvir,Dravan,Avidan,Shikhar,Numin,Amrin,Yavin,Jagriti,Dramin,Arivan,Murit,Chitik,Yanav,Mahik,Puvir,Ariim,Arurav,Mirav,Bramin,Nidir,Shivesh,Mohesh,Lamik,Arodin,Adikan,Tisin,Aruvin,Avium,Mulaj,Kitan,Arovir,Arrin,Muvin,Lunav,Luvik,Kanit,Muktik,Adam,Aduraj`.split(","),
  i14: `Kuvin,Nipal,Laresh,Gravin,Susin,Indesh,Halan,Gukan,Ichavat,Mulit,Avunik,Kanvar,Yunir,Amorin,Meghaj,Vaiesh,Ritin,Arokan,Anmin,Sumik,Vyomesh,Nitav,Udesh,Vulesh,Abivin,Atran,Milik,Suran,Adunik,Kasin,Vavan,Luvin,Bhurin,Madan,Sikan,Adutik,Vadev,Limik,Avrinik,Avrirav,Aniban,Arovin,Abitin,Suvin,Ankan,Avoyan,Yuvit,Subhansh,Sudin,Lupal`.split(","),
  i15: `Pinir,Mamir,Varav,Lumin,Vurin,Radev,Saran,Aviat,Amidav,Namaj,Adovir,Vasin,Muvir,Nimaj,Amiman,Jagesh,Arimik,Satyam,Shivakrit,Atiman,Indik,Hitan,Gamir,Kanin,Vitav,Ariyam,Gunin,Arudev,Sirin,Hinir,Dhavin,Aroish,Avriraj,Gudin,Vutav,Girin,Abiran,Sumin,Vavit,Narik,Pudan,Tirin,Prashvik,Nanav,Andin,Lanir,Livin,Kiman,Amiyan,Rukev`.split(","),
  i16: `Litav,Churin,Aditav,Kaban,Vanav,Avrivir,Amiish,Bratan,Putav,Yutan,Manvit,Amimesh,Yogik,Dhivan,Adiran,Ayran,Amurin,Kidan,Ladir,Tinav,Dhaivat,Kailash,Dhinav,Kaumudi,Ginav,Graban,Tudin,Yajesh,Pimal,Anivin,Adumit,Abiyan,Dharin,Vamesh,Adutan,Aishvary,Chinav,Kutin,Avinik,Gitin,Shivik,Avikan,Varik,Ritav,Kshitish,Limaj,Adivin,Avrivik,Nasin,Nivesh`.split(","),
  i17: `Jivar,Mimir,Mulan,Sitav,Naresh,Vadin,Jivan,Riresh,Panir,Natav,Mukik,Tamir,Amivin,Amunit,Tuvir,Makev,Dharmik,Lamal,Jashvant,Dhanuraj,Maitreyam,Akiran,Tunir,Ariish,Viran,Karav,Lipal,Avilit,Nudal,Sukan,Rumesh,Mivesh,Shivan,Vamin,Savin,Vumit,Akilav,Haban,Nuresh,Arimit,Dharav,Tushik,Avodev,Tarav,Chiman,Adojit,Vitan,Titan,Gumir,Avoash`.split(","),
  i18: `Kamit,Adoran,Adivan,Bhulan,Aridev,Turan,Aviit,Vaman,Atam,Vutin,Amunik,Sulan,Talan,Gidin,Dhulan,Malit,Amokan,Luraj,Simir,Avirin,Vuvin,Sahdev,Rilesh,Avmin,Anuk,Lulesh,Nuvir,Dhyan,Pikan,Lilan,Lunik,Khavit,Pivin,Tavan,Amovik,Avinesh,Kumin,Abilav,Lukan,Mapal,Avodin,Avak,Midev,Pudin,Amukrit,Nulan,Lisin,Amuansh,Vishvajit,Kalyanam`.split(","),
  i19: `Avovin,Adovan,Arivik,Kisin,Tapesh,Mivir,Chirin,Ariir,Chimin,Abiman,Amojit,Tiban,Karit,Anidav,Ridin,Tudan,Amiik,Paman,Karin,Braran,Kuran,Gutin,Sahik,Liban,Yavir,Ativin,Avorit,Akivin,Amiush,Madhavan,Vunav,Hidin,Minik,Mimik,Akiyan,Aruvan,Nadan,Laraj,Anirin,Jagmish,Aviim,Muman,Ludal,Rimal,Karesh,Chivan,Punyam,Amirik,Pilan,Aviuk`.split(","),
  i20: `Luban,Amiresh,Avivit,Simal,Nudan,Adurav,Amotik,Sanin,Padin,Rimir,Sanit,Ariam,Amuish,Yuvir,Lumir,Arukrit,Kutav,Tejesh,Lumik,Latin,Ruvik,Amdin,Ishvan,Pavir,Simin,Ariit,Yuban,Aritav,Shanmuk,Tutin,Dharan,Nidin,Shanakrit,Humin,Himan,Tasin,Atidin,Katan,Ishvam,Yumir,Rasin,Guran,Ridesh,Hatin,Vaikrit,Atlav,Bhumin,Namal,Hiban,Ankav`.split(","),
  i21: `Kitav,Nudir,Arinjay,Akiman,Lutav,Lilavat,Adiman,Arudin,Trilokam,Lidan,Dhaman,Avorin,Advin,Namir,Amodin,Adar,Lalit,Luhir,Chitkrit,Jayam,Dhilan,Hadin,Avuran,Abidav,Ririn,Miban,Putan,Linir,Arinesh,Pumal,Abiban,Lidin,Aronik,Vuran,Arumit,Chaitra,Amoman,Nivik,Dhruvik,Dheemanth,Natir,Ninit,Animin,Purvesh,Punav,Gakan,Katin,Amimir,Antrik,Adunav`.split(","),
  i22: `Chivin,Tuvin,Yusin,Amilit,Aridin,Taman,Purav,Maman,Ariyan,Nurav,Vurit,Masin,Murav,Chumin,Gurin,Haritam,Avovan,Patin,Bhanav,Tumal,Bhamin,Kutan,Chulan,Nishin,Vavik,Sahin,Kivin,Amban,Arunik,Luran,Hutan,Braman,Pidan,Kuvir,Adukan,Bhavith,Rumaj,Amuvir,Dranav,Hanav,Lalesh,Yudin,Rivik,Devendhi,Himal,Arrav,Hridik,Avtin,Abikan,Aniush`.split(","),
  i23: `Muktish,Sivan,Aviik,Dharamraj,Katav,Raban,Mukev,Gunav,Arutik,Avuk,Kavit,Amorav,Himansh,Dhanav,Garan,Litir,Paran,Tuman,Rohansh,Vahir,Nunik,Latan,Nalan,Mudan,Avuyan,Anim,Aniyan,Aroyan,Abikav,Vunesh,Sumir,Vinav,Pavin,Sirav,Ramdhari,Tadan,Amirav,Nutav,Tamik,Puran,Ludev,Vusin,Adidav,Dradan,Vikev,Ritvir,Kavesh,Satyavir,Aduvik,Pukan`.split(","),
  i24: `Nakshvir,Hunir,Trivik,Hanir,Anum,Akidav,Aromit,Mavit,Mavir,Aduash,Avitan,Chamin,Arikan,Adran,Amilesh,Dhalan,Atrin,Avivik,Rahir,Avuansh,Ameyash,Lirin,Avimir,Lidal,Amutan,Muhir,Lirit,Gitan,Anidin,Havin,Anam,Amuash,Marik,Akirav,Arikav,Nisin,Ratav,Vulaj,Numal,Anban,Avutik,Anikav,Adodev,Arum,Aduansh,Kamdev,Kamin,Amivan,Avotan,Ujjvalit`.split(","),
  i25: `Mivan,Nilaj,Ardin,Piman,Dakshin,Aviar,Vumin,Hamal,Tivan,Hivir,Ritan,Chanchal,Kavyan,Abrav,Vardhvir,Lunesh,Arban,Pakan,Amiash,Adidan,Akmin,Nutin,Hatav,Tuvan,Manvik,Ninav,Anitan,Nuvin,Makan,Amuran,Gumin,Tikan,Mirin,Mohanish,Chayanit,Niban,Naraj,Satav,Laran,Titav,Kimir,Adovin,Maresh,Anrin,Varin,Avidav,Kuvalaya,Madir,Bharav,Meghnad`.split(","),
  i26: `Rimin,Rutav,Ralaj,Larit,Abar,Atiban,Milit,Akran,Hukan,Amonav,Rimaj,Humal,Pasin,Midal,Aridir,Nivir,Avutan,Saban,Ridhav,Adokan,Tatin,Vikas,Mavik,Atum,Luresh,Aminik,Dakshvir,Kamir,Avvan,Atim,Yuran,Adotan,Kurav,Amiran,Mamit,Nalesh,Nuban,Vagir,Ardav,Mamesh,Satan,Vuvan,Lavir,Rutan,Pitav,Matav,Lurik,Avonit,Vapal,Niraj`.split(","),
  i27: `Ranin,Humir,Lusin,Vimaj,Huvir,Lumit,Ririt,Aryaman,Avuash,Drasin,Puvan,Runesh,Arilav,Avririn,Adukrit,Hulan,Gunvant,Ammin,Nisharth,Arunav,Kshitik,Dhivin,Nikan,Avririt,Lalan,Amoish,Charav,Jayit,Arinik,Ruran,Avonik,Gralan,Mikev,Vamir,Ashvakrit,Yakan,Lavansh,Niman,Avimesh,Lanav,Randeep,Sanav,Midin,Himanish,Maban,Atimin,Brarav,Amoran,Adurit,Nadev`.split(","),
  i28: `Avriran,Ragir,Kimal,Virin,Laban,Avrin,Taban,Sinir,Nulesh,Ridir,Amivir,Kalan,Mitin,Gutav,Narin,Pimin,Mamal,Ruvan,Bhivin,Aviyat,Aruish,Nalit,Avotik,Aminav,Vunik,Ruhir,Raran,Lamesh,Atitan,Hutin,Aruman,Likev,Ladal,Nivan,Abidin,Nanir,Grarav,Namin,Digvijay,Nuvan,Lamit,Raman,Surav,Timal,Avriash,Gusin,Grarin,Vanin,Rukan,Abam`.split(","),
  i29: `Avukan,Nanesh,Grahith,Livir,Avoansh,Vidal,Chanav,Dhuran,Nimir,Yogin,Ninesh,Larav,Tidin,Arurin,Vukev,Dradin,Mugir,Ariush,Munav,Aroman,Gaban,Kirav,Amdan,Rumal,Kiban,Ruresh,Dharuv,Amuk,Nadal,Vupal,Akhyat,Pisin,Mumik,Nukan,Amitik,Atiran,Midir,Gratan,Husin,Puman,Aroash,Nunav,Rarin,Tirav,Bhimin,Aminir,Adonav,Rulesh,Amoansh,Vibhutam`.split(","),
  i30: `Adirav,Amiraj,Ridik,Ririk,Aririt,Rumik,Hutav,Kuban,Maran,Bhivan,Rulit,Kilan,Amuvin,Antav,Avoish,Uttarvir,Lokendra,Milesh,Avivesh,Vimir,Hinav,Kivan,Mahit,Anikan,Kurin,Bhirin,Mumal,Anivar,Aruvik,Aviansh,Amonit,Nirajan,Aronav,Aridit,Dharesh,Andav,Ratir,Likan,Sanir,Varaj,Sisin,Karunik,Ninir,Ariik,Avrinit,Aruran,Amam,Avidir,Hitav,Mitir`.split(","),
  i31: `Atmin,Chuvin,Rohin,Amran,Bahavan,Rurin,Ruraj,Dhavan,Bhilan,Hirin,Ariman,Latav,Amat,Avban,Yuvik,Arivin,Ludin,Vutan,Krishin,Litan,Kanakrit,Hirav,Tatan,Garin,Gatan,Hridit,Chaitya,Yutin,Ishvara,Madik,Mamin,Vishvam,Tumin,Pumin,Pivir,Vilesh,Ginir,Matin,Palash,Kamik,Ladin,Amiam,Amidan,Vamik,Hakan,Chunav,Nirbhan,Nishit,Haripriya,Raresh`.split(","),
  i32: `Arirav,Galan,Guman,Ruvin,Siddhvir,Vavin,Girik,Gisin,Nusin,Akirin,Rikan,Parin,Vamaj,Gurav,Aminesh,Pavith,Nutan,Varit,Ridev,Dhurin,Vinik,Siban,Aduran,Rilaj,Vutir,Vulan,Rivir,Hatan,Ariban,Rumin,Abvin,Havir,Yatan,Tavin,Abivan,Lulan,Palit,Aviak,Matinvir,Madev,Kumir,Mutan,Akikav,Mutav,Amuvan,Amurit,Gimir,Satin,Ishvik,Charin`.split(","),
  i33: `Arukan,Adinav,Ojesvir,Anivan,Abitav,Kannav,Tunav,Amkan,Bhunav,Rohik,Nutir,Risin,Pirav,Vinir,Divyakrit,Piran,Suryam,Adorav,Vugir,Radir,Ariansh,Akidan,Marit,Akitan,Bhalan,Munit,Riban,Luvit,Akidin,Rikev,Yajnav,Gutan,Jayin,Gradan,Braban,Nurik,Ludir,Limin,Turin,Ayutam,Churan,Lagir,Amidin,Luvir,Nuvit,Chitraj,Antin,Nitir,Jivur,Drakan`.split(","),
  i34: `Ranav,Mudev,Nilit,Atrav,Hariraj,Aruvir,Livit,Mahin,Avriansh,Arivit,Brasin,Nilan,Riman,Vivin,Mitik,Human,Aviir,Rutir,Yuvin,Navan,Gadan,Sitan,Girav,Rajhan,Sumesh,Vanir,Chiran,Aroraj,Tivir,Pumir,Lumesh,Savir,Natin,Jivam,Vipal,Ravesh,Yumal,Rimesh,Aduvan,Ishmit,Pamal,Avtar,Avrivin,Parit,Mivit,Hudan,Limir,Kanchit,Nivit,Vilaj`.split(","),
  i35: `Avimik,Avdin,Aditin,Avrijit,Naganath,Misin,Mitit,Riran,Puban,Hilan,Ariak,Amovan,Chavin,Patan,Rudal,Jivim,Nuran,Kavan,Mavan,Adharv,Mudir,Luman,Amorit,Nulit,Hrithvik,Livan,Migir,Pamin,Mupal,Mikan,Muresh,Lutan,Mudin,Puvin,Abim,Ramal,Yarav,Kulashri,Brakan,Sadan,Amogha,Rigir,Avrav,Sanik,Govindam,Liraj,Padan,Ripal,Suman,Rinir`.split(","),
  i36: `Atiyan,Tanik,Akiban,Rarav,Mimit,Nimesh,Tulan,Guvan,Gimin,Pirin,Mirik,Jayavant,Adiyan,Kanesh,Krishaj,Malan,Timin,Vuhir,Pavitra,Kamraj,Bhurav,Atirin,Linit,Arodev,Ranik,Nalaj,Radan,Aduyan,Adimin,Nakev,Aduvir,Arotik,Mukit,Aruash,Vadan,Ravin,Dhruvam,Viban,Abirav,Yaran,Mitan,Abidan,Ramaj,Avridin,Gimal,Atilav,Graran,Avrikrit,Avitin,Rarit`.split(","),
  i37: `Rugir,Tapin,Radin,Appaji,Abimin,Gamin,Amiyam,Amkav,Ridhiman,Malesh,Tushin,Srivatsav,Sinav,Divik,Haman,Yajik,Lurav,Aviban,Tuban,Lutin,Drarin,Aroran,Hurav,Guvir,Parav,Abman,Tilan,Minesh,Gunit,Bradan,Avidit,Vuvit,Avidin,Avirik,Vuvik,Luvan,Maraj,Utam,Namik,Mutin,Vagish,Tamin,Nakan,Sutav,Numik,Arimir,Abinav,Punik,Muvik,Mitran`.split(","),
  i38: `Ablav,Abran,Debayan,Arinit,Mumesh,Adum,Arorav,Vimesh,Liresh,Chuvan,Aruk,Akrav,Murin,Anman,Draman,Akam,Indraj,Liman,Gautamesh,Aruyan,Giban,Nudev,Huvan,Vihir,Utesh,Lunir,Anamay,Lahir,Amukan,Akim,Minir,Harivan,Dhirin,Gasin,Mutir,Amudin,Mukin,Amiim,Aritin,Drarav,Amrav,Sivir,Aviam,Ravit,Vudal,Adoraj,Avokan,Vamit,Hriday,Ranit`.split(","),
  i39: `Rudan,Mipal,Andan,Amak,Bharan,Nahir,Nugir,Vakan,Rapal,Amiuk,Grahanth,Mumaj,Chalan,Palav,Chavan,Harimay,Gatin,Givin,Nakit,Pidin,Purin,Aniran,Abnav,Lavesh,Akum,Aviresh,Aviran,Lokik,Adikav,Rurav,Anat,Karik,Ranesh,Vakev,Rivesh,Runit,Kavir,Minit,Muran,Ramjivan,Brarin,Giresh,Nukev,Titin,Udit,Amuraj,Chilan,Yatav,Abrin,Gitav`.split(","),
  i40: `Ariat,Nishik,Akrin,Navyan,Mitav,Vudin,Amirin,Guban,Nurin,Adhikrit,Valesh,Bradin,Aronit,Kanir,Litin,Mulesh,Adudin,Kukan,Trivid,Anvay,Vivir,Arotan,Rihir,Lakan,Vanesh,Bravan,Ariran,Ritik,Tukan,Bhinav,Livik,Lihir,Anak,Nuraj,Arorin,Aruraj,Avum,Amidir,Hisin,Nunesh,Avuvik,Jagik,Vukan,Mirit,Ramir,Trivesh,Bravin,Punit,Udin,Avokrit`.split(","),
  i41: `Vulit,Matir,Kitin,Gunesh,Musin,Divyan,Atar,Varesh,Miraj,Naran,Animan,Lavik,Admin,Nudin,Jagin,Vikramvir,Lamaj,Vumal,Amurav,Pavesh,Yatin,Amovir,Avilesh,Vanik,Dharansh,Vatin,Gumal,Arovik,Yalan,Vilit,Megin,Aririk,Kunav,Krishvam,Avkan,Abmin,Ikshvaku,Vuban,Laman,Arimesh,Latir,Branav,Vumir,Abirin,Udik,Siman,Vitin,Ladev,Amiyat,Rilan`.split(","),
  i42: `Himavat,Arunit,Giman,Rulan,Nulaj,Arojit,Avikav,Gilan,Vavir,Jayik,Nunit,Gratav,Mohitav,Akivan,Mavesh,Megesh,Ishvir,Amium,Anirav,Anidan,Nuhir,Amivesh,Gravan,Avoran,Kanik,Pavik,Ganav,Akinav`.split(","),
  a0: `Amina,Amir,Ashar,Rafi,Rayan,Rehan,Ilham,Nasser,Adib,Fadel,Ridha,Shahir,Asghar,Noor,Salar,Jahangir,Karam,Nabhan,Yaman,Marzouq,Malak,Jawad,Tabriz,Mostafa,Jibran,Sadeq,Esfand,Fakhri,Umar,Mokhtar,Anas,Usaid,Wadud,Farzin,Ata,Raza,Qais,Ratan,Bahman,Tamim,Taymur,Tajdin,Shakur,Abbas,Shayan,Labib,Yaseen,Abdel,Yavuz,Sirjan`.split(","),
  a1: `Hisham,Maher,Musab,Pirouz,Taher,Sarim,Bakr,Naji,Thabit,Mirhat,Wajdi,Mahmoud,Nasr,Ramzi,Jazim,Musa,Ishaq,Mourad,Waseem,Salahdin,Mansour,Wahab`.split(","),
  g0: `Anthon,Kai,Kenzo,Kieran,Ragnar,Ren,Rian,Rowan,Valrik,Xavi,Beiero,Boren,Feiano,Arean,Koltyn,Doren,Caedmon,Asael,Alon,Areus,Sinclair,Areon,Ereus,Ciello,Emric,Emol,Gilbert,Yonah,Milford,Birger,Asiero,Yutaka,Acacio,Aray,Ferrin,Perkins,Edavio,Eran,Celan,Aniero,Asiano,Bevin,Ilya,Eney,Feello,Arix,Ediano,Enren,Lazaro,Torrance`.split(","),
  g1: `Zedekiah,Daren,Bannon,Vasil,Shmuel,Dilin,Ryuji,Asavio,Corvin,Elex,Axel,Zakai,Aney,Vigfus,Deello,Tadashi,Talbot,Alox,Hajime,Dalin,Edlin,Kaelen,Elor,Amory,Asran,Evil,Edan,Fivin,Hedric,Jurgen,Christoph,Erran,Tomer,Vinaldo,Eudore,Emar,Ceario,Asin,Hayden,Franklin,Nikos,Jesper,Biiano,Wilfrid,Teague,Emor,Asen,Ianto,Warden,Erus`.split(","),
  g2: `Erisco,Elan,Filin,Emavio,Holbert,Tremaine,Carrick,Asean,Coiero,Erenzo,Cavin,Emenzo,Arion,Seaver,Cienzo,Zohar,Elean,Wolcott,Emren,Evisco,Emuel,Milner,Eduel,Elren,Tilden,Eriel,Emlan,Arlin,Evor,Alos,Ziven,Deario,Enar,Yoel,Joram,Laramie,Silvain,Elon,Eleus,Ingvar,Drario,Coario,Doario,Ensen,Orian,Trevor,Daenzo,Godfrey,Tyrell,Chiaki`.split(","),
  g3: `Gaston,Galahad,Kaeden,Renaud,Angwyn,Anax,Marlon,Harland,Yoshiro,Delroy,Klement,Eliav,Yariv,Erario,Emeon,Boavio,Satoshi,Ciiero,Emiero,Eril,Aluel,Torin,Winsor,Arran,Asar,Evax,Kelvin,Edal,Asol,Emus,Adio,Eman,Enox,Redford,Emvin,Arex,Caenzo,Reuben,Broderick,Enael,Asuel,Bolan,Zachariah,Padraig,Emsen,Falin,Taliesin,Kenichi,Anius,Sylvan`.split(","),
  g4: `Alario,Celyn,Hillel,Alren,Earvin,Emix,Kenley,Ersen,Varden,Yonatan,Enin,Broden,Arwood,Driero,Alax,Evox,Irwin,Gresham,Baltin,Meir,Yoichi,Anian,Leith,Cevin,Oumar,Matthias,Helmar,Arlan,Seiji,Anen,Firan,Erol,Eviano,Enal,Ellan,Belin,Farley,Barrett,Asello,Anenzo,Alil,Stetson,Eravio,Anox,Elax,Willard,Salem,Kelwyn,Eviel,Asiel`.split(","),
  g5: `Ciran,Tatsuya,Rearden,Henric,Fallon,Alian,Blaine,Baello,Edar,Edgar,Elmer,Beiano,Eliad,Elil,Osean,Anex,Asel,Feario,Enean,Finbar,Hamlin,Kanata,Sohei,Colwyn,Govan,Edael,Fumbe,Enius,Emiano,Enello,Kenta,Alavio,Adalbert,Kyousuke,Enan,Biello,Aengus,Platon,Eren,Enos,Davin,Landry,Boiero,Asenzo,Evex,Gerrit,Arsen,Biavio,Feren,Noam`.split(","),
  g6: `Aoki,Eray,Terence,Yemi,Evuel,Filan,Bavin,Enian,Bezalel,Coello,Alisco,Favin,Ariero,Evel,Erar,Erello,Locke,Doenzo,Martin,Anan,Alel,Firmin,Ardan,Elbert,Anean,Ezechi,Erel,Enus,Windsor,Dolin,Erael,Ediel,Calin,Beario,Evern,Elario,Eneus,Riku,Doiano,Arox,Emario,Oswald,Makito,Envin,Tarquin,Arax,Wynter,Nolan,Arar,Aliel`.split(","),
  g7: `Reiji,Ervin,Fiario,Doavio,Covin,Eviero,Anar,Coren,Ragvald,Neven,Ciren,Orison,Emen,Padraic,Alwood,Arey,Rembert,Diiano,Eriano,Tremain,Evwood,Civin,Emius,Saburo,Brooks,Junya,Ejiro,Lucan,Marden,Souma,Mathen,Enran,Rayner,Feenzo,Takashi,Belan,Liron,Emey,Biario,Eniel,Delmar,Ceran,Naohiro,Wilhelm,Alrik,Diario,Firenze,Coavio,Malvern,Raleigh`.split(","),
  g8: `Enuel,Arus,Liav,Langston,Edello,Faiero,Anello,Sumner,Ceiero,Erix,Anus,Eniero,Evran,Balin,Latham,Mosi,Eror,Edren,Aner,Marcos,Alus,Faiano,Simbai,Enor,Hiroshi,Jasiel,Edeon,Errol,Kenan,Boario,Edin,Colin,Julian,Anael,Fiorello,Anal,Enenzo,Shuichi,Bevan,Eustace,Enex,Ceenzo,Selden,Shuji,Delan,Quintin,Whitfield,Edor,Elox,Godwin`.split(","),
  g9: `Bolin,Ever,Shoji,Aral,Marko,Ormond,Camden,Baren,Emael,Eneon,Yusei,Arius,Elar,Garison,Dilan,Roi,Noboru,Ener,Koichi,Royce,Waldo,Lancelot,Severn,Deiano,Naoki,Elay,Emran,Hedley,Philo,Orrin,Giles,Daiki,Jiro,Amiel,Ariano,Rollins,Daran,Enix,Gilmore,Osborne,Villard,Kenneth,Doran,Emal,Enon,Lindon,Emian,Doello,Sandoval,Cedrik`.split(","),
  g10: `Fiero,Davan,Ciavio,Carden,Arello,Yardley,Rosaire,Eval,Alal,Kelton,Grover,Colan,Vero,Alius,Tancred,Kaede,Hawthorne,Carlos,Nadav,Elvin,Marius,Osamu,Kelder,Itsuki,Osin,Diren,Nevo,Cilan,Asil,Cilin,Aleon,Uria,Aliano,Coenzo,Elisco,Yuki,Gaelen,Daiano,Matan,Felan,Evean,Eral,Edenzo,Kirby,Hideki,Jethro,Evlin,Alsen,Fletcher,Biren`.split(","),
  g11: `Terrence,Ceiano,Evol,Walter,Itamar,Edean,Norton,Evius,Colton,Hasani,Ceren,Emean,Elen,Oren,Eniano,Kosuke,Biiero,Zaccaro,Felin,Beello,Nevern,Asor,Feran,Thorsten,Baenzo,Anol,Diran,Emay,Eveon,Gavriel,Aneus,Urban,Evlan,Rodney,Ryoma,Benoit,Anix,Lander,Minato,Asian,Eriero,Boello,Emiel,Govert,Cambric,Ezriel,Rikuto,Graham,Anor,Garvin`.split(","),
  g12: `Burton,Gilad,Emlin,Erer,Shai,Anuel,Evay,Baran,Borin,Evian,Eleon,Alol,Sagar,Aniel,Emel,Evello,Murdoch,Deren,Deenzo,Whalen,Joar,Macsen,Boenzo,Rigel,Aliero,Elran,Carlin,Emax,Aravio,Glynn,Erlan,Bovin,Taichi,Dovin,Erling,Barden,Evin,Wendell,Ledger,Ediero,Aror,Lazar,Alor,Ransom,Caren,Anlin,Boaz,Dravio,Ido,Nevin`.split(","),
  g13: `Balian,Benaiah,Orvar,Faenzo,Evan,Shota,Erax,Amaury,Evario,Arer,Moriah,Linus,Elvar,Ryo,Faello,Linden,Aros,Osen,Ansen,Erey,Aniano,Gwylan,Zane,Enisco,Enavio,Silvan,Caiero,Coran,Enwood,Beren,Frederic,Eros,Beenzo,Edil,Amazu,Daiero,Kichiro,Elisha,Emin,Elello,Osan,Elenzo,Elos,Laurent,Erox,Anon,Alix,Milosz,Elsen,Faren`.split(","),
  g14: `Takuma,Deavio,Erin,Eruel,Montfort,Erex,Anwood,Edvard,Enel,Emos,Baltazar,Aren,Erwood,Sterrett,Prospero,Sueo,Omri,Roarke,Xander,Diello,Treviso,Paladin,Elliott,Perrin,Leonard,Arael,Elius,Erius,Garrett,Kobi,Anlan,Damien,Raymond,Enol,Akello,Norval,Eijiro,Anel,Yngvar,Diavio,Alex,Alan,Isador,Whitaker,Quincy,Arol,Langley,Brandyn,Ailill,Ciiano`.split(","),
  g15: `Anos,Enario,Anisco,Emer,Eley,Ceello,Evon,Nir,Montrose,Milton,Damian,Ellin,Boran,Gustav,Dov,Emile,Hubert,Taiki,Vidar,Vladimir,Elol,Asan,Hayato,Edian,Enlin,Faramir,Driano,Asgaut,Genji,Palmer,Tolan,Emeus,Peleg,Callahan,Aley,Aril,Even,Ryuichi,Eron,Elel,Elael,Osian,Evavio,Floyd,Chukwuma,Tsukasa,Aseon,Calvert,Winslow,Firen`.split(","),
  g16: `Erald,Edol,Caello,Emex,Ruskin,Malachi,Bilin,Emox,Yoav,Nobu,Elliot,Beavio,Asal,Aneon,Bivin,Allin,Maddox,Masaki,Edario,Erlin,Doiero,Celin,Balan,Edon,Grayson,Edel,Radley,Evald,Edwin,Gwydion,Shigeru,Calan,Arenzo,Aruel,Elimu,Micah,Anran,Goro,Biran,Fintan,Alael,Erian,Raoul,Eliero,Randolph,Ciario,Festus,Ereon,Aleus,Emwood`.split(","),
  g17: `Yusuke,Caiano,Alean,Arario,Sabino,Ceavio,Eliel,Elal,Breccan,Aslin,Dalan,Modibo,Eluel,Kijani,Xanthus,Evus,Emon,Alran,Anren,Evael,Asario,Anin,Monroe,Donald,Mitsuya,Edlan,Aser,Enax,Azuka,Bennet,Barak,Orean,Landon,Edran,Asren,Winfield,Emmet,Enlan,Fremont,Toshiki,Edmond,Parish,Hermon,Anario,Erean,Elbridge,Simeon,Patrin,Marvin,Colby`.split(","),
  g18: `Aito,Deiero,Fevin,Evsen,Daello,Aler,Ayumu,Maelgwn,Delvin,Enen,Grant,Aldous,Merritt,Jabez,Ason,Eder,Wilfred,Diiero,Yaniv,Evix,Valerian,Valen,Anavio,Evey,Elin,Caran,Hachiro,Henley,Arisco,Arel,Evvin,Feavio,Alello,Jago,Eveus,Falan,Kazuki,Elavio,Dallan,Itai,Allan,Elus,Elix,Fienzo,Evenzo,Farlan,Beran,Alay,Eliano,Baiano`.split(","),
  g19: `Esben,Fenton,Baiero,Natan,Alar,Selkirk,Somerset,Feiero,Haldor,Emery,Eler,Florent,Bienzo,Boiano,Elfin,Emello,Osahar,Keisuke,Oswin,Bilan,Deran,Eden,Taye,Evos,Evar,Ambroz,Lansing,Dienzo,Niles,Takeshi,Omer,Aron,Emisco,Thoreau,Aegis,Alen,Coiano,Vernard,Delin,Ultan,Elwood,Norris,Warwick,Enay,Oran,Alin,Enil,Erren,Alenzo,Deven`.split(","),
};

function buildNameDB() {
  const names = [];
  const seen = new Set();
  const banned = new Set(["rohan","arjun","chris","matt","paul","michael","asher","hunter","aaron","aiden","noah","liam","mason","logan","jacob","ethan","oliver","lucas","henry","jack","daniel","james","william","benjamin","samuel","joseph","david","ryan","tyler","brandon","dylan","justin","kevin","brian","andrew","eric","jason","nathan","kyle","adam","travis","derek","gary","todd","brad","chad","trent","blake","brody","bryson","colton","cody","garrett","mason","landon","kayden","brayden","jayden","hayden","jaxon","ryker","gunner","axel","maverick","kingston","aarav","aahan","aakash","aamir","aadit","aadrik","aanand","aashish"]);
  
  const addNames = (arr, origin, startsWithA) => {
    arr.forEach(n => {
      const name = n.trim();
      if (!name) return;
      const lower = name.toLowerCase();
      // Skip if already seen, banned, has consecutive a's, or is the dad's name
      if (seen.has(lower)) return;
      if (banned.has(lower)) return;
      if (/aa/i.test(name)) return;
      if (lower === "anish") return;
      seen.add(lower);
      names.push({ name, origin, startsWithA });
    });
  };

  addNames(RAW_NAMES.i0, "Indian", true);
  addNames(RAW_NAMES.i1, "Indian", true);
  addNames(RAW_NAMES.i2, "Indian", true);
  addNames(RAW_NAMES.i3, "Indian", true);
  addNames(RAW_NAMES.i4, "Indian", true);
  addNames(RAW_NAMES.i5, "Indian", true);
  addNames(RAW_NAMES.i6, "Indian", true);
  addNames(RAW_NAMES.i7, "Indian", true);
  addNames(RAW_NAMES.i8, "Indian", true);
  addNames(RAW_NAMES.i9, "Indian", true);
  addNames(RAW_NAMES.i10, "Indian", true);
  addNames(RAW_NAMES.i11, "Indian", true);
  addNames(RAW_NAMES.i12, "Indian", true);
  addNames(RAW_NAMES.i13, "Indian", true);
  addNames(RAW_NAMES.i14, "Indian", true);
  addNames(RAW_NAMES.i15, "Indian", true);
  addNames(RAW_NAMES.i16, "Indian", true);
  addNames(RAW_NAMES.i17, "Indian", true);
  addNames(RAW_NAMES.i18, "Indian", true);
  addNames(RAW_NAMES.i19, "Indian", true);
  addNames(RAW_NAMES.i20, "Indian", true);
  addNames(RAW_NAMES.i21, "Indian", true);
  addNames(RAW_NAMES.i22, "Indian", true);
  addNames(RAW_NAMES.i23, "Indian", true);
  addNames(RAW_NAMES.i24, "Indian", true);
  addNames(RAW_NAMES.i25, "Indian", true);
  addNames(RAW_NAMES.i26, "Indian", true);
  addNames(RAW_NAMES.i27, "Indian", true);
  addNames(RAW_NAMES.i28, "Indian", true);
  addNames(RAW_NAMES.i29, "Indian", true);
  addNames(RAW_NAMES.i30, "Indian", true);
  addNames(RAW_NAMES.i31, "Indian", true);
  addNames(RAW_NAMES.i32, "Indian", true);
  addNames(RAW_NAMES.i33, "Indian", true);
  addNames(RAW_NAMES.i34, "Indian", true);
  addNames(RAW_NAMES.i35, "Indian", true);
  addNames(RAW_NAMES.i36, "Indian", true);
  addNames(RAW_NAMES.i37, "Indian", true);
  addNames(RAW_NAMES.i38, "Indian", true);
  addNames(RAW_NAMES.i39, "Indian", true);
  addNames(RAW_NAMES.i40, "Indian", true);
  addNames(RAW_NAMES.i41, "Indian", true);
  addNames(RAW_NAMES.i42, "Indian", true);
  addNames(RAW_NAMES.a0, "Arabic/Persian", true);
  addNames(RAW_NAMES.a1, "Arabic/Persian", false);
  addNames(RAW_NAMES.g0, "Global", true);
  addNames(RAW_NAMES.g1, "Global", true);
  addNames(RAW_NAMES.g2, "Global", true);
  addNames(RAW_NAMES.g3, "Global", true);
  addNames(RAW_NAMES.g4, "Global", true);
  addNames(RAW_NAMES.g5, "Global", true);
  addNames(RAW_NAMES.g6, "Global", true);
  addNames(RAW_NAMES.g7, "Global", true);
  addNames(RAW_NAMES.g8, "Global", true);
  addNames(RAW_NAMES.g9, "Global", true);
  addNames(RAW_NAMES.g10, "Global", true);
  addNames(RAW_NAMES.g11, "Global", true);
  addNames(RAW_NAMES.g12, "Global", true);
  addNames(RAW_NAMES.g13, "Global", true);
  addNames(RAW_NAMES.g14, "Global", true);
  addNames(RAW_NAMES.g15, "Global", true);
  addNames(RAW_NAMES.g16, "Global", true);
  addNames(RAW_NAMES.g17, "Global", true);
  addNames(RAW_NAMES.g18, "Global", true);
  addNames(RAW_NAMES.g19, "Global", true);

  return names;
}

const ALL_NAMES = buildNameDB();

// ============================================================
// TRAITS SYSTEM — 100 characteristics, 5 per name
// ============================================================
const TRAIT_MASTER = [
  // SOUND & PHONETICS (20)
  "Soft-sounding","Strong-sounding","Melodic","Crisp","Flowing","Bold","Gentle","Rhythmic","Punchy","Lyrical",
  "Vowel-rich","Consonant-driven","Sibilant","Resonant","Staccato","Breathy","Sharp","Smooth","Bright-tone","Deep-tone",
  // LENGTH & STRUCTURE (10)
  "Short & sweet","Medium-length","Long & grand","One-syllable","Two-syllable","Three-syllable","Four-syllable","Compact","Nickname-ready","Stands-alone",
  // FEEL & VIBE (20)
  "Modern","Classic","Timeless","Rare","Distinctive","Traditional","Contemporary","Sophisticated","Earthy","Elegant",
  "Warm","Cool","Regal","Understated","Commanding","Approachable","Enigmatic","Spirited","Grounded","Refined",
  // CULTURAL ENERGY (15)
  "Sanskrit-rooted","Vedic","Mythological","Spiritual","Literary","Artistic","Nature-inspired","Celestial","Warrior","Royal",
  "Philosophical","Devotional","Heroic","Pastoral","Cosmopolitan",
  // MEANING THEMES (20)
  "Light & bright","Strength","Wisdom","Peace","Joy","Victory","Courage","Fire & energy","Earth & mountain","Water & ocean",
  "Sky & wind","Divine","Noble","Protector","Creator","Abundance","Truth","Freedom","Love","Renewal",
  // PRACTICAL (15)
  "Easy worldwide","Multicultural","Cross-cultural","Globally portable","Office-friendly","Boardroom-ready","Playground-proof","Ages well","Pairs with Chikahisa","Pairs with Reddy",
  "Great initials","Strong signature","Good for nicknames","Memorable","Conversation-starter",
];

// Deterministic hash for consistent trait assignment
function nameHash(str, seed = 0) {
  let h = seed;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function countSyllables(name) {
  const vowels = name.toLowerCase().match(/[aeiouy]+/g);
  return vowels ? vowels.length : 1;
}

function assignTraits(name, origin) {
  const n = name.toLowerCase();
  const len = name.length;
  const syl = countSyllables(name);
  const traits = new Set();
  const h = nameHash(n);

  // 1. LENGTH trait (always one)
  if (len <= 4) traits.add("Short & sweet");
  else if (len <= 6) traits.add("Medium-length");
  else traits.add("Long & grand");

  // 2. SYLLABLE trait
  if (syl === 1) traits.add("One-syllable");
  else if (syl === 2) traits.add("Two-syllable");
  else if (syl === 3) traits.add("Three-syllable");
  else traits.add("Four-syllable");

  // 3. SOUND trait based on phonetic properties
  const vowelRatio = (n.match(/[aeiou]/g) || []).length / len;
  const lastChar = n[n.length - 1];
  const startsVowel = /^[aeiou]/.test(n);
  const endsVowel = /[aeiou]/.test(lastChar);

  if (vowelRatio > 0.45) traits.add("Vowel-rich");
  else if (vowelRatio < 0.3) traits.add("Consonant-driven");

  if (endsVowel && vowelRatio > 0.4) traits.add("Melodic");
  else if (/[ktp]$/.test(n)) traits.add("Crisp");
  else if (/[mn]$/.test(n)) traits.add("Resonant");
  else if (/[sh]$/.test(n)) traits.add("Soft-sounding");
  else if (/[rdg]$/.test(n)) traits.add("Strong-sounding");
  else if (/[v]$/.test(n)) traits.add("Smooth");
  else if (/[l]$/.test(n)) traits.add("Lyrical");
  else traits.add(h % 2 === 0 ? "Flowing" : "Bold");

  // 4. VIBE/FEEL based on origin + hash
  const vibes = origin === "Indian" ? ["Sanskrit-rooted","Vedic","Spiritual","Mythological","Traditional","Timeless","Warm","Grounded"]
    : origin === "Arabic/Persian" ? ["Spiritual","Regal","Elegant","Commanding","Refined","Sophisticated","Timeless","Enigmatic"]
    : origin === "African" ? ["Earthy","Spirited","Warm","Distinctive","Grounded","Heroic","Rhythmic","Bold"]
    : origin === "Korean" ? ["Modern","Crisp","Understated","Contemporary","Cool","Compact","Refined","Approachable"]
    : origin === "Creative" ? ["Artistic","Literary","Sophisticated","Distinctive","Conversation-starter","Enigmatic","Cool","Memorable"]
    : ["Classic","Cosmopolitan","Elegant","Sophisticated","Literary","Refined","Distinctive","Timeless"];
  traits.add(vibes[h % vibes.length]);
  traits.add(vibes[(h >> 3) % vibes.length]);

  // 5. MEANING THEME based on name patterns + hash
  const themes = [];
  if (/sun|sur|ray|ark|dit|bha|pra|tej|jyo|lux|luc|lum|ori/.test(n)) themes.push("Light & bright");
  if (/vi[kr]|bal|vir|ran|war|raj|shah|sul|mag|vik/.test(n)) themes.push("Strength");
  if (/ved|jn|gya|wis|vid|bodh|man|bud|sag/.test(n)) themes.push("Wisdom");
  if (/sha[nm]|sal[im]|paz|mir|nir|aman/.test(n)) themes.push("Peace");
  if (/nan|har|joy|bliss|mod|pra/.test(n)) themes.push("Joy");
  if (/jay|vij|fat|jai|win/.test(n)) themes.push("Victory");
  if (/agn|fire|rud|mar|bla/.test(n)) themes.push("Fire & energy");
  if (/gir|par|dhr|bhum|ach|roc/.test(n)) themes.push("Earth & mountain");
  if (/sag|var|nad|riv|sam|sin/.test(n)) themes.push("Water & ocean");
  if (/ak[as]|sky|amb|nab|cel|ori|zep/.test(n)) themes.push("Sky & wind");
  if (/dev|div|ish|god|lor|bha[gk]/.test(n)) themes.push("Divine");
  if (/raj|nob|ari[s]|reg|pri|sul|mal/.test(n)) themes.push("Noble");
  if (/rak|pal|hif|gua|abh[ay]/.test(n)) themes.push("Protector");
  if (/shr|cre|bra|kar|kal/.test(n)) themes.push("Creator");
  if (/sat|tru|dha[r]/.test(n)) themes.push("Truth");
  if (/muk|az[a]|fre|swa/.test(n)) themes.push("Freedom");
  if (/nav|new|ren|ush|aba/.test(n)) themes.push("Renewal");

  if (themes.length > 0) traits.add(themes[h % themes.length]);
  else {
    const fallback = ["Strength","Wisdom","Courage","Noble","Renewal","Joy","Freedom","Truth","Peace","Light & bright"];
    traits.add(fallback[h % fallback.length]);
  }

  // 6. PRACTICAL traits
  if (len <= 5 && syl <= 2) traits.add("Easy worldwide");
  else if (len <= 7) traits.add("Globally portable");
  if (len <= 6 && !/[xzq]/.test(n)) traits.add("Office-friendly");
  if (syl >= 3 || len >= 8) traits.add("Nickname-ready");
  if (syl <= 2 && len <= 5) traits.add("Stands-alone");
  
  // Name-specific pairing check
  const firstInit = name[0];
  if (!"CR".includes(firstInit)) traits.add("Great initials");
  if (len >= 3 && len <= 7) traits.add("Pairs with Reddy");
  if (syl <= 3) traits.add("Pairs with Chikahisa");
  if (len <= 6) traits.add("Memorable");

  // Fill to exactly 5 with hash-selected traits
  const traitArr = [...traits];
  if (traitArr.length >= 5) return traitArr.slice(0, 5);
  
  // Pick remaining from master list using hash
  let idx = h;
  while (traitArr.length < 5) {
    const candidate = TRAIT_MASTER[idx % TRAIT_MASTER.length];
    if (!traitArr.includes(candidate)) traitArr.push(candidate);
    idx += 7;
  }
  return traitArr.slice(0, 5);
}

// Attach traits to all names
ALL_NAMES.forEach(n => { n.traits = assignTraits(n.name, n.origin); });

// Storage helpers — backed by Firebase Realtime Database
async function loadData(key, fallback) {
  try {
    const result = await fbGet(key.replace(":", "_"));
    return result !== null ? result : fallback;
  } catch {
    return fallback;
  }
}

async function saveData(key, data) {
  try {
    await fbSet(key.replace(":", "_"), data);
  } catch (e) {
    console.error("Firebase write error:", e);
  }
}

// Shuffle
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Pick 5 names intelligently
function pickFive(ratings, comparisons, allNames, dislikedNames = new Set()) {
  const totalComparisons = Object.values(comparisons).reduce((s, v) => s + v, 0);
  
  // Filter out disliked names most of the time (~5% chance they sneak back in)
  const preferred = allNames.filter(n => !dislikedNames.has(n.name) || Math.random() < 0.05);
  const pool = preferred.length >= 5 ? preferred : allNames;

  if (totalComparisons < 50) {
    // Early phase: random selection, balanced between A/non-A
    const aNames = pool.filter(n => n.startsWithA);
    const nonANames = pool.filter(n => !n.startsWithA);
    const mixed = [...shuffle(aNames).slice(0, 3), ...shuffle(nonANames).slice(0, 3)];
    return shuffle(mixed).slice(0, 5);
  }
  
  // Later: mix of exploration (low comparisons) and exploitation (high wins)
  const scored = pool.map(n => {
    const comp = comparisons[n.name] || 0;
    const wins = ratings[n.name] || 0;
    // Higher score = more likely to be shown
    const explorationBonus = Math.max(0, 10 - comp) * 30;
    const ratingBonus = wins * 15;
    return { ...n, score: explorationBonus + ratingBonus + Math.random() * 200 };
  });
  
  scored.sort((a, b) => b.score - a.score);
  
  // Take from top, ensuring mix
  const result = [];
  let aCount = 0;
  
  for (const n of scored) {
    if (result.length >= 5) break;
    if (aCount >= 3 && n.startsWithA) continue;
    if (result.length - aCount >= 3 && !n.startsWithA) continue;
    result.push(n);
    if (n.startsWithA) aCount++;
  }
  
  return result.length >= 5 ? result : shuffle(pool).slice(0, 5);
}

// ============================================================
// MAIN APP COMPONENT
// ============================================================
export default function NameMyBaby() {
  const [tab, setTab] = useState("discover");
  const [ratings, setRatings] = useState({});
  const [comparisons, setComparisons] = useState({});
  const [totalVotes, setTotalVotes] = useState(0);
  const [currentFive, setCurrentFive] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [animating, setAnimating] = useState(false);
  const [skippedNames, setSkippedNames] = useState(new Set());
  const [dislikedNames, setDislikedNames] = useState(new Set());
  const [showFullName, setShowFullName] = useState(true);
  const [favorites, setFavorites] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [showStats, setShowStats] = useState(false);
  const initialized = useRef(false);

  // Load persisted data + set up real-time sync
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Initial load
    (async () => {
      try {
        // Version check — bump this to force a fresh start
        const DB_VERSION = 4;
        const storedVersion = await loadData("nmb:version", 0);
        
        if (storedVersion < DB_VERSION) {
          // Clear everything for a fresh start
          await saveData("nmb:ratings", {});
          await saveData("nmb:comparisons", {});
          await saveData("nmb:totalVotes", 0);
          await saveData("nmb:favorites", []);
          await saveData("nmb:skipped", []);
          await saveData("nmb:disliked", []);
          await saveData("nmb:version", DB_VERSION);

          setRatings({});
          setComparisons({});
          setTotalVotes(0);
          setFavorites(new Set());
          setSkippedNames(new Set());
          setDislikedNames(new Set());
          setCurrentFive(pickFive({}, {}, ALL_NAMES, new Set()));
          setLoading(false);
          return;
        }

        const r = await loadData("nmb:ratings", {});
        const c = await loadData("nmb:comparisons", {});
        const v = await loadData("nmb:totalVotes", 0);
        const f = await loadData("nmb:favorites", []);
        const s = await loadData("nmb:skipped", []);
        const d = await loadData("nmb:disliked", []);

        setRatings(r);
        setComparisons(c);
        setTotalVotes(v);
        setFavorites(new Set(f));
        setSkippedNames(new Set(s));
        setDislikedNames(new Set(d));

        const available = ALL_NAMES.filter(n => !new Set(s).has(n.name));
        setCurrentFive(pickFive(r, c, available, new Set(d)));
      } catch (e) {
        console.error("Init error:", e);
        // Fall back to clean state so the app still works
        setCurrentFive(pickFive({}, {}, ALL_NAMES, new Set()));
      } finally {
        setLoading(false);
      }
    })();

    // Real-time listeners — sync votes live between devices
    let unsubs = [];
    try {
      unsubs = [
        fbListen("nmb_ratings", (val) => { if (val) setRatings(val); }),
        fbListen("nmb_comparisons", (val) => { if (val) setComparisons(val); }),
        fbListen("nmb_totalVotes", (val) => { if (val !== null) setTotalVotes(val); }),
        fbListen("nmb_favorites", (val) => { if (val) setFavorites(new Set(val)); }),
        fbListen("nmb_skipped", (val) => { if (val) setSkippedNames(new Set(val)); }),
        fbListen("nmb_disliked", (val) => { if (val) setDislikedNames(new Set(val)); }),
      ];
    } catch (e) {
      console.error("Firebase listener error:", e);
    }

    return () => unsubs.forEach(fn => typeof fn === "function" && fn());
  }, []);

  const getNextFive = useCallback((r, c, s, d) => {
    const available = ALL_NAMES.filter(n => !s.has(n.name));
    return pickFive(r || ratings, c || comparisons, available, d || dislikedNames);
  }, [ratings, comparisons, dislikedNames]);

  // Helper: mark names as seen in comparisons
  const markSeen = async (names, existingComparisons) => {
    const newComparisons = { ...existingComparisons };
    let changed = false;
    names.forEach(n => {
      const nm = typeof n === "string" ? n : n.name;
      if (!newComparisons[nm]) { newComparisons[nm] = 0; changed = true; }
      newComparisons[nm]++;
    });
    if (changed || names.length > 0) {
      setComparisons(newComparisons);
      await saveData("nmb:comparisons", newComparisons);
    }
    return newComparisons;
  };

  const handleSelect = async (name) => {
    if (animating) return;
    setSelected(name);
    setAnimating(true);

    // Mark all 5 as seen
    const newComparisons = await markSeen(currentFive, comparisons);

    // Winner gets +1 point
    const newRatings = { ...ratings };
    if (!newRatings[name]) newRatings[name] = 0;
    newRatings[name] += 1;

    const newTotal = totalVotes + 1;
    
    setRatings(newRatings);
    setTotalVotes(newTotal);

    await saveData("nmb:ratings", newRatings);
    await saveData("nmb:totalVotes", newTotal);

    setTimeout(() => {
      setCurrentFive(getNextFive(newRatings, newComparisons, skippedNames));
      setSelected(null);
      setAnimating(false);
    }, 600);
  };

  const handleSkipAll = async () => {
    if (animating) return;
    // Mark all 5 as seen even though none were voted for
    const newComparisons = await markSeen(currentFive, comparisons);
    setCurrentFive(getNextFive(ratings, newComparisons, skippedNames));
  };

  const handleDislikeAll = async () => {
    if (animating) return;
    // Mark all 5 as seen
    const newComparisons = await markSeen(currentFive, comparisons);
    // Track all 5 as disliked
    const newDisliked = new Set([...dislikedNames, ...currentFive.map(n => n.name)]);
    setDislikedNames(newDisliked);
    await saveData("nmb:disliked", [...newDisliked]);
    setCurrentFive(getNextFive(ratings, newComparisons, skippedNames, newDisliked));
  };

  const handleNeverShow = async (name) => {
    // Mark as seen
    await markSeen([name], comparisons);
    const newSkipped = new Set([...skippedNames, name]);
    setSkippedNames(newSkipped);
    await saveData("nmb:skipped", [...newSkipped]);
    const newFive = currentFive.filter(n => n.name !== name);
    if (newFive.length < 5) {
      const available = ALL_NAMES.filter(n => !newSkipped.has(n.name) && !newFive.find(x => x.name === n.name));
      const extra = shuffle(available).slice(0, 5 - newFive.length);
      setCurrentFive([...newFive, ...extra]);
    } else {
      setCurrentFive(newFive);
    }
  };

  const toggleFavorite = async (name) => {
    const newFavs = new Set(favorites);
    if (newFavs.has(name)) newFavs.delete(name);
    else newFavs.add(name);
    setFavorites(newFavs);
    await saveData("nmb:favorites", [...newFavs]);
  };

  const handleDeleteVote = async (name) => {
    const newRatings = { ...ratings };
    delete newRatings[name];
    const newTotal = Math.max(0, totalVotes - (ratings[name] || 0));
    setRatings(newRatings);
    setTotalVotes(newTotal);
    await saveData("nmb:ratings", newRatings);
    await saveData("nmb:totalVotes", newTotal);
  };

  const handleReset = async () => {
    if (!confirm("Reset all rankings and start fresh?")) return;
    setRatings({});
    setComparisons({});
    setTotalVotes(0);
    setFavorites(new Set());
    setSkippedNames(new Set());
    setDislikedNames(new Set());
    await saveData("nmb:ratings", {});
    await saveData("nmb:comparisons", {});
    await saveData("nmb:totalVotes", 0);
    await saveData("nmb:favorites", []);
    await saveData("nmb:skipped", []);
    await saveData("nmb:disliked", []);
    setCurrentFive(pickFive({}, {}, ALL_NAMES, new Set()));
  };

  // Rankings data — only names with at least 1 vote
  const rankedNames = Object.entries(ratings)
    .filter(([name, votes]) => votes > 0 && !skippedNames.has(name))
    .sort((a, b) => b[1] - a[1])
    .map(([name, votes], i) => {
      const info = ALL_NAMES.find(n => n.name === name);
      return { name, votes, rank: i + 1, origin: info?.origin || "Unknown", traits: info?.traits || [], comparisons: comparisons[name] || 0 };
    });

  const filteredRanked = searchQuery
    ? rankedNames.filter(n => n.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : rankedNames;

  // Stats
  const totalNamesRated = Object.keys(ratings).length;
  const avgRating = totalNamesRated > 0 ? Math.round(Object.values(ratings).reduce((a, b) => a + b, 0) / totalNamesRated) : 0;
  const originBreakdown = {};
  ALL_NAMES.forEach(n => { originBreakdown[n.origin] = (originBreakdown[n.origin] || 0) + 1; });

  if (loading) {
    return (
      <div style={styles.loadingScreen}>
        <div style={styles.loadingIcon}>👶</div>
        <div style={styles.loadingText}>Name My Baby</div>
        <div style={styles.loadingSubtext}>Loading your name journey...</div>
      </div>
    );
  }

  return (
    <div style={styles.app}>
      {/* Status Bar Spacer */}
      <div style={styles.statusBar} />
      
      {/* Navigation Bar */}
      <div style={styles.navBar}>
        <div style={styles.navTitle}>
          Name My Baby
        </div>
        <div style={styles.navSubtitle}>
          {tab === "discover" ? "Discover" : "Rankings"}
        </div>
        {tab === "discover" && (
          <button style={styles.navBtn} onClick={() => setShowStats(!showStats)}>
            {showStats ? "✕" : "⚙"}
          </button>
        )}
      </div>

      {/* Stats Panel */}
      {showStats && tab === "discover" && (
        <div style={styles.statsPanel}>
          <div style={styles.statRow}>
            <span style={styles.statLabel}>Names in Database</span>
            <span style={styles.statValue}>{ALL_NAMES.length.toLocaleString()}</span>
          </div>
          <div style={styles.statRow}>
            <span style={styles.statLabel}>Total Votes Cast</span>
            <span style={styles.statValue}>{totalVotes}</span>
          </div>
          <div style={styles.statRow}>
            <span style={styles.statLabel}>Names Rated</span>
            <span style={styles.statValue}>{totalNamesRated}</span>
          </div>
          <div style={styles.statRow}>
            <span style={styles.statLabel}>Names Skipped</span>
            <span style={styles.statValue}>{skippedNames.size}</span>
          </div>
          <div style={{...styles.statRow, borderBottom: "none"}}>
            <span style={styles.statLabel}>Show Full Name</span>
            <button
              style={{...styles.toggleBtn, background: showFullName ? "#007AFF" : "#e0e0e0"}}
              onClick={() => setShowFullName(!showFullName)}
            >
              <div style={{...styles.toggleKnob, transform: showFullName ? "translateX(20px)" : "translateX(0)"}} />
            </button>
          </div>
          <button style={styles.resetBtn} onClick={handleReset}>Reset All Data</button>
        </div>
      )}

      {/* Content Area */}
      <div style={styles.content}>
        {tab === "discover" && !showStats && (
          <DiscoverTab
            currentFive={currentFive}
            selected={selected}
            animating={animating}
            onSelect={handleSelect}
            onDislikeAll={handleDislikeAll}
            showFullName={showFullName}
            totalVotes={totalVotes}
            topName={rankedNames[0]}
          />
        )}
        {tab === "rankings" && (
          <RankingsTab
            rankedNames={filteredRanked}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            totalVotes={totalVotes}
            onReset={handleReset}
            onDeleteVote={handleDeleteVote}
            namesSeen={Object.keys(comparisons).length}
            namesTotal={ALL_NAMES.length}
          />
        )}
      </div>

      {/* Tab Bar */}
      <div style={styles.tabBar}>
        {[
          { id: "discover", icon: "✦", label: "Discover" },
          { id: "rankings", icon: "📊", label: "Rankings" },
        ].map(t => (
          <button
            key={t.id}
            style={{...styles.tabItem, color: tab === t.id ? "#007AFF" : "#8E8E93"}}
            onClick={() => { setTab(t.id); setShowStats(false); }}
          >
            <span style={{fontSize: 22}}>{t.icon}</span>
            <span style={{fontSize: 10, marginTop: 2, fontWeight: tab === t.id ? 600 : 400}}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// DISCOVER TAB
// ============================================================
function DiscoverTab({ currentFive, selected, animating, onSelect, onDislikeAll, showFullName, totalVotes, topName }) {
  return (
    <div style={styles.discoverContainer}>
      <div style={styles.promptText}>
        Tap the name you like most
      </div>
      <div style={styles.voteCounter}>
        Round {totalVotes + 1}
        {topName && <span style={{color: "#8E8E93", marginLeft: 8}}>· Top: {topName.name}</span>}
      </div>

      <div style={styles.nameCards}>
        {currentFive.map((n, i) => {
          const isSelected = selected === n.name;
          const isNotSelected = selected && !isSelected;

          return (
            <div
              key={`${n.name}-${i}`}
              style={{
                ...styles.nameCard,
                transform: isSelected ? "scale(1.02)" : isNotSelected ? "scale(0.97)" : "scale(1)",
                opacity: isNotSelected ? 0.4 : 1,
                background: isSelected ? "linear-gradient(135deg, #007AFF 0%, #5856D6 100%)" : "#fff",
                color: isSelected ? "#fff" : "#1C1C1E",
                borderColor: isSelected ? "transparent" : "#E5E5EA",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onClick={() => !animating && onSelect(n.name)}
            >
              <div style={styles.nameText}>{n.name}</div>
              {showFullName && (
                <div style={{...styles.fullNameText, color: isSelected ? "rgba(255,255,255,0.7)" : "#8E8E93"}}>
                  {n.name} Chikahisa Reddy
                </div>
              )}
              <div style={styles.cardMeta}>
                <span style={{
                  ...styles.originBadgeInline,
                  background: isSelected ? "rgba(255,255,255,0.2)" : originColor(n.origin).bg,
                  color: isSelected ? "#fff" : originColor(n.origin).text,
                }}>
                  {n.origin}
                </span>
                {(n.traits || []).slice(0, 3).map((t, ti) => (
                  <span key={ti} style={{
                    ...styles.traitChipInline,
                    background: isSelected ? "rgba(255,255,255,0.15)" : "#F2F2F7",
                    color: isSelected ? "rgba(255,255,255,0.8)" : "#636366",
                  }}>{t}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <button style={styles.dislikeBtn} onClick={onDislikeAll} disabled={animating}>
        👎 I Don't Like Any of These
      </button>
    </div>
  );
}

// ============================================================
// RANKINGS TAB
// ============================================================
function RankingsTab({ rankedNames, searchQuery, setSearchQuery, totalVotes, onReset, onDeleteVote, namesSeen, namesTotal }) {
  const maxVotes = rankedNames.length > 0 ? Math.max(...rankedNames.map(n => n.votes)) : 1;
  const pctComplete = namesTotal > 0 ? Math.round((namesSeen / namesTotal) * 100) : 0;
  const [showTraits, setShowTraits] = useState(true);

  // Aggregate trait scores: each trait gets the sum of votes from names that have it
  const traitScores = {};
  rankedNames.forEach(n => {
    (n.traits || []).forEach(t => {
      if (!traitScores[t]) traitScores[t] = 0;
      traitScores[t] += n.votes;
    });
  });
  const topTraits = Object.entries(traitScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);
  const maxTraitScore = topTraits.length > 0 ? topTraits[0][1] : 1;

  return (
    <div style={styles.rankingsContainer}>
      {/* Search */}
      <div style={styles.searchBar}>
        <span style={styles.searchIcon}>🔍</span>
        <input
          style={styles.searchInput}
          placeholder="Search names..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button style={styles.searchClear} onClick={() => setSearchQuery("")}>✕</button>
        )}
      </div>

      <div style={styles.rankInfo}>
        {rankedNames.length} names ranked · {totalVotes} total votes
      </div>

      {/* % Complete Progress */}
      <div style={styles.progressContainer}>
        <div style={styles.progressHeader}>
          <span style={styles.progressLabel}>{namesSeen} of {namesTotal.toLocaleString()} names seen</span>
          <span style={styles.progressPct}>{pctComplete}%</span>
        </div>
        <div style={styles.progressTrack}>
          <div style={{...styles.progressFill, width: `${pctComplete}%`}} />
        </div>
      </div>

      {/* Top Traits */}
      {!searchQuery && topTraits.length > 0 && (
        <div style={styles.traitsSection}>
          <button style={styles.traitsSectionHeader} onClick={() => setShowTraits(!showTraits)}>
            <span style={styles.traitsSectionTitle}>Top Traits You're Drawn To</span>
            <span style={{color: "#8E8E93", fontSize: 16}}>{showTraits ? "▾" : "▸"}</span>
          </button>
          {showTraits && (
            <div style={styles.traitsList}>
              {topTraits.map(([trait, score], i) => (
                <div key={trait} style={styles.traitRankRow}>
                  <div style={styles.traitRankNum}>{i + 1}</div>
                  <div style={styles.traitRankDetails}>
                    <div style={styles.traitRankName}>{trait}</div>
                    <div style={styles.traitRankBar}>
                      <div style={{...styles.traitRankBarFill, width: `${(score / maxTraitScore) * 100}%`}} />
                    </div>
                  </div>
                  <div style={styles.traitRankScore}>{score}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Top 3 Podium */}
      {!searchQuery && rankedNames.length >= 3 && (
        <div style={styles.podium}>
          {[1, 0, 2].map(idx => {
            const n = rankedNames[idx];
            if (!n) return null;
            const heights = [72, 56, 48];
            const colors = ["#FFD700", "#007AFF", "#CD7F32"];
            return (
              <div key={n.name} style={styles.podiumItem}>
                <div style={styles.podiumName}>{n.name}</div>
                <div style={styles.podiumRating}>{n.votes} {n.votes === 1 ? "vote" : "votes"}</div>
                <div style={{
                  ...styles.podiumBar,
                  height: heights[idx],
                  background: colors[idx],
                }}>
                  <span style={styles.podiumRank}>{idx + 1}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Rankings List */}
      <div style={styles.rankList}>
        {rankedNames.map((n) => {
          const barWidth = maxVotes > 0 ? Math.max(5, (n.votes / maxVotes) * 100) : 5;
          return (
            <div key={n.name} style={styles.rankRow}>
              <div style={styles.rankNum}>#{n.rank}</div>
              <div style={styles.rankDetails}>
                <div style={styles.rankName}>
                  {n.name}
                </div>
                <div style={styles.rankBar}>
                  <div style={{...styles.rankBarFill, width: `${barWidth}%`}} />
                </div>
                <div style={styles.rankMeta}>
                  <span style={{fontWeight: 600, color: "#1C1C1E"}}>{n.votes} {n.votes === 1 ? "vote" : "votes"}</span>
                  <span> · seen {n.comparisons}× · </span>
                  <span style={{color: originColor(n.origin).text}}>{n.origin}</span>
                </div>
              </div>
              <button
                style={styles.deleteBtn}
                onClick={() => onDeleteVote(n.name)}
                title="Remove votes"
              >
                ✕
              </button>
            </div>
          );
        })}
        {rankedNames.length === 0 && (
          <div style={styles.emptyState}>
            <div style={{fontSize: 40, marginBottom: 12}}>📊</div>
            <div style={{color: "#8E8E93"}}>Start voting to see rankings!</div>
          </div>
        )}
      </div>

      {rankedNames.length > 0 && (
        <button style={styles.resetRankingBtn} onClick={onReset}>
          Reset All Rankings
        </button>
      )}
    </div>
  );
}

// ============================================================
// HELPERS
// ============================================================
function originColor(origin) {
  const map = {
    Indian: { bg: "#FFF3E0", text: "#E65100", color: "#E65100", background: "#FFF3E0" },
    "Arabic/Persian": { bg: "#E8F5E9", text: "#2E7D32", color: "#2E7D32", background: "#E8F5E9" },
    African: { bg: "#FBE9E7", text: "#BF360C", color: "#BF360C", background: "#FBE9E7" },
    Korean: { bg: "#E3F2FD", text: "#1565C0", color: "#1565C0", background: "#E3F2FD" },
    Global: { bg: "#F3E5F5", text: "#6A1B9A", color: "#6A1B9A", background: "#F3E5F5" },
    Creative: { bg: "#FCE4EC", text: "#AD1457", color: "#AD1457", background: "#FCE4EC" },
  };
  return map[origin] || { bg: "#F5F5F5", text: "#666", color: "#666", background: "#F5F5F5" };
}

// ============================================================
// STYLES — iOS-inspired design system
// ============================================================
const styles = {
  app: {
    fontFamily: '-apple-system, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif',
    maxWidth: 430,
    margin: "0 auto",
    background: "#F2F2F7",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    WebkitFontSmoothing: "antialiased",
  },
  loadingScreen: {
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    minHeight: "100vh", background: "#F2F2F7",
    fontFamily: '-apple-system, "SF Pro Display", sans-serif',
  },
  loadingIcon: { fontSize: 64, marginBottom: 16 },
  loadingText: { fontSize: 28, fontWeight: 700, color: "#1C1C1E", letterSpacing: -0.5 },
  loadingSubtext: { fontSize: 15, color: "#8E8E93", marginTop: 8 },
  statusBar: { height: 6, background: "#F2F2F7" },
  navBar: {
    position: "sticky", top: 0, zIndex: 100,
    padding: "4px 16px 6px", background: "#F2F2F7",
  },
  navTitle: { fontSize: 24, fontWeight: 700, color: "#1C1C1E", letterSpacing: -0.5 },
  navSubtitle: { fontSize: 11, fontWeight: 500, color: "#8E8E93", marginTop: 1 },
  navBtn: {
    background: "none", border: "none", fontSize: 22, color: "#007AFF", cursor: "pointer",
    padding: "8px", borderRadius: 20, width: 40, height: 40,
    display: "flex", alignItems: "center", justifyContent: "center",
    position: "absolute", right: 20, top: 8,
  },
  content: { flex: 1, paddingBottom: 70 },

  // Stats Panel
  statsPanel: {
    margin: "0 16px 16px", background: "#fff", borderRadius: 14,
    overflow: "hidden",
  },
  statRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "14px 16px", borderBottom: "0.5px solid #E5E5EA",
  },
  statLabel: { fontSize: 15, color: "#1C1C1E" },
  statValue: { fontSize: 15, color: "#8E8E93", fontVariantNumeric: "tabular-nums" },
  toggleBtn: {
    width: 51, height: 31, borderRadius: 16, border: "none", cursor: "pointer",
    position: "relative", transition: "background 0.25s",
  },
  toggleKnob: {
    width: 27, height: 27, borderRadius: 14, background: "#fff",
    position: "absolute", top: 2, left: 2,
    boxShadow: "0 1px 3px rgba(0,0,0,0.2)", transition: "transform 0.25s",
  },
  resetBtn: {
    width: "100%", padding: "14px 16px", background: "none", border: "none",
    color: "#FF3B30", fontSize: 15, cursor: "pointer", textAlign: "center",
    borderTop: "0.5px solid #E5E5EA",
  },

  // Discover Tab
  discoverContainer: { padding: "0 12px" },
  promptText: {
    textAlign: "center", fontSize: 15, fontWeight: 600, color: "#1C1C1E",
    marginBottom: 2,
  },
  voteCounter: {
    textAlign: "center", fontSize: 12, color: "#8E8E93", marginBottom: 8,
  },
  nameCards: { display: "flex", flexDirection: "column", gap: 6 },
  nameCard: {
    display: "flex", flexDirection: "column",
    padding: "10px 14px", borderRadius: 12, cursor: "pointer",
    border: "0.5px solid #E5E5EA",
    boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
  },
  nameText: { fontSize: 18, fontWeight: 600, letterSpacing: -0.3 },
  fullNameText: { fontSize: 11, marginTop: 1 },
  cardMeta: {
    display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4, alignItems: "center",
  },
  originBadgeInline: {
    display: "inline-block", fontSize: 10, fontWeight: 500,
    padding: "2px 7px", borderRadius: 6,
  },
  traitChipInline: {
    fontSize: 9, fontWeight: 500, padding: "1px 6px", borderRadius: 8,
    whiteSpace: "nowrap",
  },
  dislikeBtn: {
    display: "block", width: "100%", padding: "11px",
    background: "rgba(255,59,48,0.08)", border: "1.5px solid #FF3B30", borderRadius: 12,
    color: "#FF3B30", fontSize: 14, fontWeight: 600, cursor: "pointer",
    textAlign: "center", marginTop: 8,
  },
  deleteBtn: {
    background: "none", border: "none", cursor: "pointer",
    fontSize: 16, color: "#C7C7CC", padding: "4px 8px", lineHeight: 1,
    flexShrink: 0,
  },
  resetRankingBtn: {
    display: "block", width: "100%", padding: "14px", marginTop: 20,
    background: "none", border: "none", borderRadius: 14,
    color: "#FF3B30", fontSize: 15, fontWeight: 500, cursor: "pointer",
    textAlign: "center",
  },

  // Rankings Tab
  rankingsContainer: { padding: "0 16px" },
  searchBar: {
    display: "flex", alignItems: "center", background: "rgba(118,118,128,0.12)",
    borderRadius: 12, padding: "8px 12px", marginBottom: 12, gap: 8,
  },
  searchIcon: { fontSize: 16, opacity: 0.5 },
  searchInput: {
    flex: 1, background: "none", border: "none", outline: "none",
    fontSize: 15, color: "#1C1C1E",
    fontFamily: '-apple-system, "SF Pro Text", sans-serif',
  },
  searchClear: {
    background: "none", border: "none", color: "#8E8E93", cursor: "pointer",
    fontSize: 14, padding: 4,
  },
  rankInfo: {
    fontSize: 13, color: "#8E8E93", marginBottom: 12, textAlign: "center",
  },
  progressContainer: {
    background: "#fff", borderRadius: 12, padding: "14px 16px", marginBottom: 16,
  },
  progressHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8,
  },
  progressLabel: { fontSize: 13, color: "#8E8E93" },
  progressPct: { fontSize: 15, fontWeight: 700, color: "#007AFF" },
  progressTrack: {
    height: 6, background: "#E5E5EA", borderRadius: 3, overflow: "hidden",
  },
  progressFill: {
    height: "100%", background: "linear-gradient(90deg, #34C759, #007AFF)",
    borderRadius: 3, transition: "width 0.5s ease",
  },
  traitsSection: {
    background: "#fff", borderRadius: 14, overflow: "hidden", marginBottom: 16,
  },
  traitsSectionHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "14px 16px", width: "100%", background: "none", border: "none",
    cursor: "pointer", textAlign: "left",
  },
  traitsSectionTitle: { fontSize: 15, fontWeight: 600, color: "#1C1C1E" },
  traitsList: { padding: "0 16px 12px" },
  traitRankRow: {
    display: "flex", alignItems: "center", gap: 10, padding: "6px 0",
  },
  traitRankNum: {
    fontSize: 12, fontWeight: 600, color: "#8E8E93", width: 20, textAlign: "right",
    fontVariantNumeric: "tabular-nums",
  },
  traitRankDetails: { flex: 1, minWidth: 0 },
  traitRankName: { fontSize: 13, fontWeight: 500, color: "#1C1C1E", marginBottom: 3 },
  traitRankBar: {
    height: 4, background: "#E5E5EA", borderRadius: 2, overflow: "hidden",
  },
  traitRankBarFill: {
    height: "100%", background: "linear-gradient(90deg, #FF9500, #FF3B30)",
    borderRadius: 2, transition: "width 0.5s",
  },
  traitRankScore: {
    fontSize: 13, fontWeight: 600, color: "#8E8E93", width: 30, textAlign: "right",
    fontVariantNumeric: "tabular-nums",
  },
  podium: {
    display: "flex", justifyContent: "center", alignItems: "flex-end",
    gap: 12, marginBottom: 20, padding: "0 16px",
  },
  podiumItem: {
    display: "flex", flexDirection: "column", alignItems: "center", flex: 1,
  },
  podiumName: { fontSize: 15, fontWeight: 600, color: "#1C1C1E", marginBottom: 4 },
  podiumRating: { fontSize: 12, color: "#8E8E93", marginBottom: 6 },
  podiumBar: {
    width: "100%", borderRadius: "8px 8px 0 0",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  podiumRank: { color: "#fff", fontWeight: 700, fontSize: 20 },
  rankList: {
    background: "#fff", borderRadius: 14, overflow: "hidden",
  },
  rankRow: {
    display: "flex", alignItems: "center", gap: 12,
    padding: "12px 16px", borderBottom: "0.5px solid #E5E5EA",
  },
  rankNum: {
    fontSize: 14, fontWeight: 600, color: "#8E8E93", width: 36, textAlign: "right",
    fontVariantNumeric: "tabular-nums",
  },
  rankDetails: { flex: 1, minWidth: 0 },
  rankName: { fontSize: 16, fontWeight: 600, color: "#1C1C1E" },
  rankBar: {
    height: 4, background: "#E5E5EA", borderRadius: 2, marginTop: 6, marginBottom: 4,
    overflow: "hidden",
  },
  rankBarFill: {
    height: "100%", background: "linear-gradient(90deg, #007AFF, #5856D6)",
    borderRadius: 2, transition: "width 0.5s",
  },
  rankMeta: { fontSize: 12, color: "#8E8E93" },

  emptyState: {
    textAlign: "center", padding: "60px 20px",
  },

  // Tab Bar
  tabBar: {
    position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
    width: "100%", maxWidth: 430,
    display: "flex", justifyContent: "space-around",
    background: "rgba(249,249,249,0.94)", backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderTop: "0.5px solid #C6C6C8", padding: "6px 0 22px", zIndex: 200,
  },
  tabItem: {
    display: "flex", flexDirection: "column", alignItems: "center",
    background: "none", border: "none", cursor: "pointer", padding: "4px 16px",
    transition: "color 0.2s",
  },
};
