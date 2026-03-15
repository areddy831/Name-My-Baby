import { useState, useEffect, useCallback, useRef } from "react";
import { fbGet, fbSet, fbRemove, fbListen } from "./firebase.js";

// ============================================================
// NAME DATABASE - 2000+ names
// Format: [name, origin] where origin: i=Indian, a=Arabic/Persian, f=African, k=Korean, g=Global/Other
// ============================================================
const RAW_NAMES = {
  // INDIAN A-NAMES (~700)
  iA: `Abhay,Abhik,Abhilash,Abhimanyu,Abhiram,Abhinav,Abhishek,Achintya,Achyut,Adarsh,Adheesh,Adhrit,Adit,Aditya,Advait,Advay,Agastya,Agniv,Ahir,Ajit,Akash,Akhil,Akshaj,Akshar,Akshit,Amal,Ambar,Ambuj,Amey,Amish,Amit,Amitabh,Amlan,Amol,Amrit,Amulya,Anand,Ananth,Angad,Anik,Aniket,Animesh,Anirban,Anirudh,Anjor,Ankit,Ankur,Anmol,Anuj,Anurag,Apoorv,Archit,Arham,Arihant,Arindam,Arjit,Arnav,Arnesh,Arpit,Arth,Arun,Arvind,Ashish,Ashok,Ashvin,Ashwin,Atharv,Atiksh,Atman,Atul,Avik,Avinash,Aviral,Avnish,Ayan,Ayush,Abir,Achint,Adhvik,Adrith,Agnim,Ahilan,Akrit,Akshat,Amogh,Anay,Aneesh,Arnab,Ashvath,Avyukt,Atulya,Avyan,Akilan,Alok,Amarjit,Amartya,Anant,Anuran,Aparajit,Apurv,Arihan,Arish,Arman,Artham,Aseem,Ashank,Atreya,Avash,Avikshit,Ayodhya,Ajinkya,Akul,Amitav,Anagh,Anshul,Antariksh,Apramey,Aravind,Arijit,Arthav,Asvin,Athrav,Avaneesh,Avirath,Avyay,Akshansh,Amrith,Anshuman,Avijit,Ayog,Akshan,Anshu,Arush,Ashvat,Atishay,Aviraj,Advaith,Akhand,Achal,Adhir,Agrim,Akshay,Alankrit,Amardeep,Amrish,Anchit,Anujit,Aparesh,Archish,Arin,Arjav,Arunesh,Ashrav,Ateev,Avadh,Axat,Ajeet,Avikram,Avani,Ashutosh,Ayuj,Amitesh,Ankush,Aham,Anirvan,Avyukth,Anooj,Arvindh,Ashvit,Ahvan,Anujan,Adinath,Agni,Ashu,Amrita,Ankesh,Arhan,Atri,Akshith,Abhijat,Achyuthan,Ajitesh,Adesh,Adyant,Atmaj,Ahil,Adityaraj,Akshit,Abheek,Achyutan,Adhyan,Agneya,Ajatshatru,Akshobhya,Alhad,Ameyatma,Anagh,Anirdesh,Aparesh,Archish,Arjav,Ashvath,Atiksha,Avighna,Ayukta,Advik,Aghor,Ahinsak,Akrosh,Alankaar,Ambikaprasad,Anantajit,Anekal,Anivesh,Aparesh,Archak,Arishtanemi,Ashvath,Atiksha,Aveekshit,Adeep,Aghor,Akshansh,Alakhvir,Ambikesh,Amoha,Anindya,Anirveda,Antarman,Apramad,Archak,Arin,Arjav,Avaneesh,Avirath,Avyan,Advay,Ajit,Akshar,Alok,Ambar,Anand,Anik,Ankit,Arnesh,Arth,Ashvin,Atman,Aviral,Avinash,Ayush,Adheesh,Akhilesh,Amalesh,Animesh,Anirban,Antariksh,Arihant,Arindam,Ashank,Atharv,Avikshit,Avyukt,Ayodhya,Adeesh,Agastya,Ahilan,Akshay,Amrit,Anant,Angad,Anurag,Apoorv,Archit,Arpit,Ashish,Ashok,Atreya,Avadh,Avik,Ayan,Akshaj,Amol,Arun,Arvind,Ashwin,Atul,Avnish,Abhay,Adarsh,Adit,Amal,Amey,Anay,Aneesh,Anmol,Anuj,Arham,Arnav,Arush,Ashvat,Avash,Axat,Achintya,Advait,Agniv,Akash,Akhil,Akshat,Amitabh,Amlan,Ananth,Aniket,Anirudh,Ankur,Apurv,Aravind,Arijit,Arjit,Arnab,Ashutosh,Atiksh,Atulya,Aviraj,Avyay,Alankrit,Amardeep,Amartya,Amrish,Anchit,Anshul,Anshuman,Aparajit,Aseem,Ashrav,Atishay,Avijit,Ayuj,Adhrit,Adyant,Agnim,Ahvan,Akrit,Akul,Amitav,Amitesh,Amrith,Anooj,Anshu,Aparesh,Apramey,Arihan,Arish,Arjav,Arthav,Ashvit,Asvin,Atri,Avaneesh,Avikshit,Avyukt,Advik,Ahil,Ajinkya,Akshith,Alhad,Ambikeya,Anivesh,Avighna,Akshobh,Adityaraj`.split(","),
  
  // INDIAN NON-A NAMES (~550)
  iN: `Bhavin,Bhrigu,Bharat,Bodhi,Chetan,Chirag,Chinmay,Daksh,Darsh,Dev,Devaj,Devraj,Dhairya,Dhanush,Dhruv,Dinesh,Diyan,Druv,Eshan,Ekaant,Gaurav,Girish,Govind,Guhan,Gulshan,Hari,Harish,Harsh,Hemant,Hitesh,Hrithik,Indra,Ishaan,Ishan,Jai,Jayant,Jivin,Kabir,Kalyan,Karan,Karthik,Keshav,Kian,Kishore,Krish,Krishna,Kunal,Laksh,Lakshay,Lokesh,Madhav,Manan,Manav,Manish,Mehul,Mihir,Milan,Mohit,Moksh,Mukul,Naman,Nakul,Naveen,Neeraj,Neil,Nikhil,Nimish,Nirav,Nirmal,Nishant,Nishith,Ojas,Om,Omkar,Param,Parth,Pavan,Pranav,Prashant,Pratham,Prithvi,Rachit,Raghav,Raj,Rajan,Rajat,Rajesh,Rakesh,Ranvir,Ravi,Reyansh,Rian,Rishabh,Rishi,Ritvik,Rohit,Rudra,Sachin,Sahil,Samar,Sameer,Sanjay,Sarthak,Satvik,Shaan,Shravan,Siddharth,Soham,Sohil,Suraj,Surya,Tanay,Tanish,Tarun,Tejas,Tushar,Uday,Utkarsh,Varun,Ved,Veer,Viaan,Vihaan,Vikram,Vinay,Vir,Vivaan,Vivek,Yash,Yashwin,Yuvan,Bhuvan,Chandran,Chiranjiv,Darshan,Devesh,Dhruvit,Divakar,Ehaan,Eklavya,Ghrishan,Girijan,Gokulnath,Gurpreet,Harshit,Hemish,Hitansh,Idhant,Ishanvi,Jaiveer,Jayesh,Jeeval,Kaivalya,Keshavan,Kirtan,Kovidh,Kunj,Lakshit,Lokith,Manvith,Mayansh,Mitresh,Mohan,Mokshit,Nakshit,Nilesh,Nishith,Ojasvin,Parikshit,Pavit,Pranit,Prashith,Prithvin,Raghuvir,Rishin,Rochak,Rudransh,Sachit,Saharsh,Samarjit,Sanchit,Sarvin,Shreyas,Sidak,Sohum,Sourish,Suvrit,Taksh,Tejit,Tushir,Ujjwal,Utsav,Vaidik,Vedant,Vedan,Vikrant,Viraj,Vivrit,Yashvit,Yuvraj,Zubin,Bhavesh,Charvik,Chintan,Darshil,Devansh,Dhruvil,Ekagra,Falgun,Garvit,Hardik,Hemang,Idris,Ishvar,Jehan,Kairav,Kanish,Keshiv,Kirthan,Kushagr,Lakshman,Madhavraj,Mithun,Mokshit,Nandish,Nihar,Nishith,Ojasvi,Onir,Pranith,Prithviraj,Raivat,Ranvijay,Rishit,Rushil,Sahaj,Sambhav,Sanchit,Sharav,Shivam,Siddhant,Soumil,Subhan,Svanik,Takshak,Tejasvin,Tulsi,Ujjval,Utsav,Vaibhav,Valmik,Vedansh,Vihang,Vineet,Virat,Vishesh,Yatharth,Yuvaan,Zyan,Brijesh,Chahel,Chitvan,Devkumar,Dhanvin,Druvin,Ekansh,Falak,Garvish,Harjot,Hemish,Idhant,Ishraq,Johar,Kaivalya,Kanav,Keshavan,Kovidh,Kushaan,Lakhvir,Madhavesh,Mitansh,Mokshit,Nandak,Nihit,Nishith,Paresh,Rachit,Roshit,Rudransh,Saarang,Sambhav,Sharvil,Sidak,Soumya,Subodh,Tanuj,Tejasv,Trishan,Ujval,Vaibhav,Vedanth,Vihari,Vineet,Vishrut,Yatharth,Yuvin`.split(","),
  
  // ARABIC/PERSIAN A-NAMES (~180)
  aA: `Adil,Akram,Amir,Anwar,Arif,Ashraf,Azim,Aziz,Altair,Amin,Asad,Atif,Aydin,Azad,Afzal,Ajmal,Akbar,Ammar,Ashfaq,Asim,Awais,Ayaz,Azlan,Aftab,Aladdin,Alim,Ameen,Arshad,Ashar,Aydan,Azhar,Adnan,Ahsan,Akhtar,Amjad,Arman,Asif,Azmat,Abrar,Adeel,Ahmad,Akil,Amani,Arham,Aslan,Awad,Afnan,Ahan,Aimal,Altan,Arsalan,Ashir,Ayub,Adham,Ahad,Aijaz,Akif,Almas,Ameer,Ashfaq,Azan,Abid,Ahmar,Athar,Azzam,Aqil,Arshid,Asfar,Azeem,Ahyan,Akeel,Almeer,Amid,Ansar,Afsar,Akhlaq,Aleem,Ammar,Arkan,Asrar,Atiq,Aydin,Azfar,Ayman,Abrar,Adham,Ahmar,Akram,Aleem,Amjad,Ansar,Arkan,Asrar,Atiq,Aydin,Azfar,Ayman,Arfan,Ashir,Avais,Ajaz,Anis,Asad,Azhar,Adeel,Afzal,Ahad,Akif,Alim,Aman,Ameen,Anwar,Arif,Ashraf,Atif,Ayaz,Aziz,Akbar,Altan,Amani,Arman,Aslan,Ayub,Azad,Adnan,Ahsan,Akil,Altair,Amin,Arshad,Ashar,Azim,Abid,Adil,Ahmar,Akhtar,Almas,Ameer,Arsalan,Asfar,Azeem,Aqil,Arshid,Awad,Azlan,Afnan,Asim,Awais,Azmat`.split(","),

  // ARABIC/PERSIAN NON-A NAMES (~180)
  aN: `Bashir,Bilal,Cairo,Cyrus,Daniyal,Emad,Farid,Feroz,Faisal,Ghaffar,Hakim,Hamza,Hasan,Ibrahim,Idris,Imran,Iqbal,Jahan,Jalal,Jamal,Kadir,Kamran,Karim,Khalid,Khurram,Latif,Liaqat,Mahir,Majid,Malik,Mansur,Mazin,Mubarak,Mustafa,Nabil,Nadeem,Nasir,Navid,Omar,Osman,Parviz,Qadir,Qasim,Rafiq,Rashid,Rayan,Reza,Riyad,Saif,Salim,Shahid,Shamim,Shariq,Suhaib,Sultan,Tahir,Tariq,Wahid,Yusuf,Zahed,Zahir,Zaid,Zakir,Zameer,Zubair,Burhan,Darian,Ehsan,Faizan,Hadi,Hamid,Hashim,Jabir,Junaid,Kamil,Kashif,Kian,Laith,Mahdi,Marzuq,Mirza,Nadir,Naveed,Omid,Pervez,Qurban,Rahim,Rehan,Rizwan,Sabir,Samad,Shahzad,Siraj,Taimur,Talha,Wasim,Yasir,Zahid,Zaman,Zarif,Ziyad,Faris,Haroun,Ismail,Kabeer,Luqman,Muhsin,Nizar,Rustam,Safwan,Shafiq,Waqar,Zafar,Bahir,Badr,Daud,Faiz,Ghazi,Habib,Haider,Ijaz,Irfan,Jabbar,Kafeel,Kamil,Khalil,Masood,Mazen,Mukhtar,Munir,Naeem,Naseem,Rauf,Saad,Sadiq,Saqib,Shams,Tariq,Ubaid,Wali,Yasin,Zain,Zuhayr,Basim,Daoud,Fawaz,Ghalib,Hamdan,Husain,Iskander,Jihad,Kasim,Luay,Muhammed,Naim,Rafi,Suhail,Talib,Usama,Walid,Yamin,Zaki`.split(","),

  // AFRICAN A-NAMES (~80)
  fA: `Abasi,Abidemi,Adebayo,Adisa,Amadi,Ashanti,Ayodele,Azibo,Ajani,Akinyemi,Amara,Asante,Ayomide,Azikiwe,Adewale,Afolabi,Akintola,Amiri,Athi,Ayuba,Adom,Agu,Akpan,Atsu,Ayize,Adeniyi,Akwasi,Atiba,Ayokunle,Abimbola,Adelu,Amani,Asafa,Ayinla,Abayomi,Akuji,Amadu,Asir,Ayotunde,Abeeku,Adeleke,Amani,Azubuike,Adetokunbo,Afari,Akachi,Ayenew,Abeo,Adewole,Ajamu,Akachi,Amadi,Asante,Ayize,Abioye,Adebola,Afolabi,Akintunde,Amadi,Ashanti,Azibo,Ade,Adeyemi,Afi,Akintayo,Amadu,Asefa,Ayomide,Abednego,Adekola,Akuji,Amina,Asefa,Ayuba,Abiodun,Adeyinka,Ajamu,Akoto`.split(","),

  // AFRICAN NON-A NAMES (~80)
  fN: `Bakari,Baraka,Chidi,Chijioke,Dayo,Duma,Ekon,Emeka,Faraji,Fenuku,Gamba,Habib,Ife,Jahi,Jelani,Kalu,Kamau,Kato,Kgosi,Kwame,Kwesi,Lamin,Lekan,Mansa,Masego,Nkosi,Nnamdi,Obinna,Ola,Oluwa,Omari,Otieno,Paki,Rafiki,Sekou,Simba,Tendai,Themba,Uche,Uzoma,Wale,Yaw,Zaki,Zuberi,Bello,Chima,Danladi,Emenyonu,Gakere,Jabari,Kofi,Kwaku,Makena,Mwangi,Nonso,Obi,Olumide,Segun,Tafari,Zuri,Biko,Chike,Diallo,Ekene,Femi,Gbenga,Idi,Jide,Kalu,Lemuel,Mandela,Nkem,Okonkwo,Rashidi,Sani,Tobi,Udo,Zaire`.split(","),

  // KOREAN-STYLE NAMES (easy to pronounce, no Japanese) (~60)
  kN: `Baram,Bitna,Chansol,Dohyun,Eunseo,Haneul,Hyunjin,Inwoo,Jaeho,Jiho,Jiwon,Junseo,Kihan,Minjun,Namgil,Rian,Seohan,Seojun,Siwoo,Taeho,Wonjin,Yejun,Yuchan,Daeho,Hajun,Insoo,Jaemin,Jihoon,Junyeol,Kiyoon,Minho,Namsun,Seungho,Siwon,Taejin,Woosung,Yejin,Yubin,Chaewon,Dojin,Geonwoo,Hyunwoo,Jaesung,Jinhyuk,Kijun,Minseok,Seokjin,Soojin,Taehyun,Woojin,Youngjae,Byungho,Dongwook,Gunwoo,Hyunseok,Jaewon,Junwoo,Minwoo,Sunho`.split(","),

  // GLOBAL/OTHER A-NAMES (Latin, Greek, Slavic, Celtic, etc.) (~350)
  gA: `Adriel,Alaric,Alden,Aldric,Alejandro,Alexei,Alistair,Altan,Ambrose,Anders,Anton,Arlo,Arturo,Auberon,Aurelio,Alarik,Aldrin,Aleron,Alfonso,Alvar,Amari,Anatoli,Andrei,Angelo,Arden,Arlen,Ashby,Aubrey,Avery,Aldous,Aleric,Alvaro,Amaro,Anatole,Andre,Anselm,Artem,Athos,Auguste,Alfons,Amato,Anatol,Angus,Ariel,August,Abelard,Albion,Alfredo,Amador,Anselmo,Artemis,Augustin,Abelino,Alberic,Aldwin,Alfio,Amias,Andor,Anoush,Armel,Atticus,Aurelius,Aurelian,Azariah,Alastair,Alcide,Alexios,Amadeo,Ancel,Ardian,Arno,Attila,Auden,Albin,Alton,Amadeus,Anchise,Argento,Arnulf,Augusto,Abner,Alcuin,Alvise,Armand,Arsenio,Atherton,Aubin,Axton,Adair,Alarik,Aldhelm,Aleksander,Aleph,Altair,Amias,Andras,Ansel,Archimedes,Ariston,Arne,Asher,Athanasius,Avalon,Azriel,Adler,Aldric,Aleksei,Aleph,Altair,Amias,Andras,Ansel,Apollo,Ariston,Arne,Atlas,Avalon,Azriel,Adelmo,Alarik,Aleksi,Alonso,Alwin,Ambrus,Andries,Antoni,Archibald,Ariston,Arvo,Ashwin,Augustus,Avelino,Aziz,Adelric,Alford,Algernon,Alonzo,Amedeo,Anchise,Andrin,Antonin,Ardal,Aristide,Arvid,Asmund,Austyn,Avon,Aban,Abelardo,Adelard,Adlai,Adolfo,Alford,Algot,Alphard,Alvaro,Amedeo,Anchise,Andrin,Ange,Anselmo,Archibald,Ariston,Arno,Arvid,Asmund,Axel,Albrecht,Aleksander,Alvar,Amadis,Ambrus,Ander,Anselm,Archard,Ariston,Arne,Asher,Athanasius,Aurelio,Azriel,Adrien,Alasdair,Alden,Alexios,Altair,Amadeo,Ambrose,Anders,Anselm,Arlen,Artem,Asher,Atticus,Aurelius,Axel`.split(","),

  // GLOBAL/OTHER NON-A NAMES (~600)
  gN: `Bastian,Benedict,Benicio,Blaise,Bodhi,Bram,Brennan,Cael,Callum,Caspian,Cedric,Cillian,Cormac,Cosimo,Cyprian,Dashiell,Declan,Dimitri,Dorian,Elio,Elian,Emil,Emeric,Enrique,Enzo,Ephraim,Esteban,Evander,Fabian,Felix,Finnian,Florian,Flynn,Gideon,Griffin,Hadrian,Hector,Hugo,Idris,Ignacio,Ilan,Inigo,Isidore,Joaquin,Jules,Kai,Kian,Kylan,Lachlan,Leander,Lennox,Leon,Lionel,Lorcan,Lucian,Magnus,Marcelo,Matteo,Niko,Nico,Octavio,Orion,Oscar,Otto,Pascal,Quillan,Rafael,Remy,Ren,Roman,Santiago,Sebastian,Silas,Soren,Stellan,Sterling,Thane,Theo,Tobias,Viggo,Xander,Zain,Zephyr,Bastien,Bjorn,Boden,Bramwell,Caius,Cassius,Cosmo,Cristian,Dante,Desmond,Dragan,Edison,Emrys,Erik,Espen,Evren,Fabrizio,Fenris,Fionn,Gael,Galen,Gareth,Gavril,Hadley,Henrick,Hollis,Ignatius,Ivar,Jasper,Kael,Kiran,Laszlo,Laurent,Leland,Lewin,Lorenzo,Luca,Lucien,Malcolm,Marcel,Mathis,Maxim,Mikael,Milo,Navarro,Nikolai,Noel,Oberon,Oleander,Orin,Osias,Percival,Quentin,Rainer,Raphael,Rocco,Roland,Rowan,Sagan,Salvador,Saxon,Severin,Silvio,Taran,Theron,Tomas,Ulric,Valentin,Vesper,Vico,Werner,Wren,Xavi,Yale,Yohan,Zephyrin,Branimir,Caspar,Corbin,Devlin,Elric,Ewen,Fenwick,Garron,Halden,Innes,Jareth,Kellan,Larkin,Merrick,Niall,Odhran,Phelan,Riordan,Tiernan,Vaughn,Walden,Yoren,Zander,Callan,Einar,Frey,Gustaf,Henrik,Jovan,Lars,Nils,Osric,Ragnar,Stig,Torsten,Viktor,Wolfram,Baldric,Cato,Darian,Gavriil,Hartwin,Ingmar,Kaspar,Lennart,Oskar,Runar,Sigmund,Torben,Volker,Corin,Egan,Frode,Gordan,Halvar,Isak,Jorin,Kylen,Lorenz,Marek,Otis,Sorin,Thierry,Uri,Valko,Zoltan,Beckett,Briar,Calloway,Corwin,Dalton,Edric,Emiliano,Eero,Ferris,Gideon,Greyson,Hartley,Idris,Jarvis,Kael,Leif,Lorcan,Montague,Niels,Ollivander,Orson,Phoenix,Quinlan,Raylan,Ronan,Severin,Thaddeus,Tristan,Ulric,Viggo,Westley,Yael,Zephyrus,Boden,Castor,Crispin,Dermot,Emile,Everard,Finian,Gulliver,Halvard,Iskander,Jolyon,Kael,Leif,Loxley,Merritt,Nero,Oleander,Peregrine,Quade,Remus,Roshan,Stellan,Theron,Ulysses,Vance,Willem,Yuri,Zenon,Bjorn,Calix,Crispin,Draven,Eldric,Emiliano,Falk,Galileo,Holden,Ivo,Jovian,Kepler,Lazarus,Lysander,Mordecai,Nestor,Orestes,Perseus,Quillan,Remington,Simeon,Stellan,Thales,Ulric,Valor,Wilder,Xenos,Yael,Zenith,Basil,Cadmus,Caspian,Dalton,Eamon,Fergus,Gideon,Hollis,Ivo,Jasper,Keegan,Leander,Magnus,Nikolai,Odin,Pascal,Rune,Stellan,Tobias,Ulric,Viggo,Willem,Xavi,Yorick,Zander,Brennan,Cormac,Desmond,Emrys,Fionn,Gareth,Henrik,Iker,Jarvis,Killian,Laszlo,Marcel,Niall,Oskar,Phelan,Quentin,Riordan,Soren,Tiernan,Ulric,Viktor,Wren,Xander,Yoren,Zoltan,Beric,Carsten,Damon,Elio,Faris,Gordan,Hadrian,Iskander,Jorin,Kellan,Lorcan,Matteo,Nico,Orion,Rafael,Silas,Thane,Vico,Wulfric,Yohan,Zephyr`.split(","),
  // SUPPLEMENTARY INDIAN A-NAMES
  iA2: `Abhyuday,Achaleswar,Adheendra,Adhyanth,Advayanth,Agneesh,Aharnish,Akhilendra,Akshayanth,Alankaar,Alaukik,Ameyatma,Amoghasiddhi,Anantram,Aneekrit,Anirdesh,Ankith,Anshvit,Anubhav,Aparigraha,Archish,Arindam,Arnesh,Arpith,Ashmit,Atulbhushan,Avikshith,Avneesh,Ayushmaan,Abheek,Achintya,Adhiraj,Advayanth,Agneya,Aharnish,Akhilendra,Akshayanth,Alaukik,Amitoj,Anantdev,Aneekrit,Ankith,Anubhav,Aparigraha,Arindam,Arpith,Ashmit,Avikshith,Avneesh,Adhish,Agnivesh,Akhilraj,Amitoj,Anantdev,Anivrit,Apurvansh,Archan,Arindham,Arjundev,Arpan,Atiksh,Avimanyu,Ayansh,Abhiroop,Adhyayan,Agnikumar,Akhyansh,Amoghavarsha,Anantjit,Ankurjit,Anubhuti,Apurvansh,Archan,Arthik,Ashmeet,Avikshit,Ayojan,Adinath,Aghoranath,Akilesh,Ambikaprasad,Amolik,Anantjit,Ankurjit,Anukampa,Aparesh,Archanesh,Arthik,Ashmeet,Ateesh,Avimanyu,Aviroop,Ayojan,Abhaydatt,Achintanand,Adhiroop,Advayaprakash,Aghoranath,Akroor,Ambikaprasad,Amoghavarsha,Anantdatt,Ankurjit,Anukampa,Aparesh,Archanesh,Arivoli,Arthik,Ateesh,Avimanyu,Aviroop,Ayurved,Abhaydatt,Adhiroop,Aghoranath,Akroor,Ambikaprasad`.split(","),

  // SUPPLEMENTARY INDIAN NON-A NAMES
  iN2: `Bandhan,Bhargav,Bhavesh,Bipin,Bodhan,Chandresh,Chirayu,Dakshesh,Darshak,Dayakar,Devarsh,Dhanraj,Dhiren,Divakar,Drupad,Ekant,Gagandeep,Ganeshwar,Gaurang,Giridhar,Govardhan,Gurunath,Hansraj,Harendra,Harshal,Hemchandra,Hiresh,Idhant,Indrajit,Ishandev,Jaganmay,Jagdish,Janardhan,Jaydev,Jivansh,Kaivalya,Kalash,Kamalnayan,Kanhaiya,Kaushal,Kethan,Kiranmay,Koushik,Kuldeep,Kushal,Lakhvir,Lalith,Lavith,Likhit,Lokith,Madhukar,Maheep,Maitreya,Manojkumar,Mayank,Mihit,Milind,Mitesh,Mrigank,Nandakishor,Narottam,Naveenkumar,Nilkanth,Nirdesh,Ojaswin,Omesh,Padmanabh,Pallav,Paramjit,Paritosh,Pavankumar,Pinak,Prabhakar,Prahlad,Prajval,Prasenjit,Priyansh,Purushottam,Rachit,Raghunath,Rajkumar,Ramcharan,Randhir,Rashmit,Ravindra,Ridhan,Rishikesh,Rochak,Rudraksh,Sachidanand,Sahasra,Samanvay,Sankalp,Sarvesh,Sharad,Shashank,Shivendra,Shvetank,Siddhesh,Sohail,Sourish,Subodh,Sumeet,Suvidh,Taksheel,Tanveer,Tejpal,Trilok,Tushaar,Udayan,Ujesh,Vaibhav,Valmik,Vasudev,Vedansh,Vijeth,Vinaayak,Viraj,Vishwajit,Yatharth,Yogesh,Yuvaan,Zyan`.split(","),

  // SUPPLEMENTARY GLOBAL A-NAMES
  gA2: `Absalom,Achilles,Adonis,Aeneas,Agapios,Alarik,Alcander,Aldhelm,Aleksander,Aleph,Alfio,Algernon,Alhambra,Alphonse,Altair,Amadis,Ambrogio,Amias,Anatoli,Anchise,Androcles,Angelico,Anselmo,Antioch,Apollo,Arcadio,Archer,Arden,Argento,Aribert,Ariston,Arkady,Armando,Arnaldo,Arsenio,Artemas,Ascanio,Aspen,Asterion,Athanasios,Atlas,Auberon,Aureliano,Avalon,Averill,Axton,Abelardo,Achille,Adler,Adriano,Aeneas,Agapito,Alberic,Alcide,Aldon,Aleksi,Alfio,Algot,Alistair,Alphard,Altair,Alvise,Amadeo,Ambrus,Amias,Anastasio,Anchise,Andor,Angilbert,Anselm,Antigonus,Apollinaire,Araldo,Arcadius,Ardal,Aretas,Aristide,Armistead,Arnfried,Arsenio,Artemas,Ascanio,Athanaric,Attilio,Augustin,Aurelio,Avalon,Avelino,Axel`.split(","),

  // SUPPLEMENTARY GLOBAL NON-A NAMES
  gN2: `Baldwin,Barnaby,Bartholomew,Basil,Beckett,Bellamy,Bertram,Birch,Blaise,Boden,Bowen,Bramwell,Briar,Bruno,Caelum,Caldwell,Calloway,Caradoc,Carlton,Cassander,Cedric,Chester,Clement,Clifton,Colbert,Conrad,Corentin,Cosimo,Crispin,Dalton,Dashiell,Devereux,Dolan,Donovan,Drake,Drummond,Duncan,Edmund,Eldon,Elwin,Emilio,Emrys,Enoch,Erasmus,Erwin,Esmond,Everett,Fairfax,Falconer,Fenwick,Ferdinand,Finian,Florent,Forrest,Frederick,Gabriel,Gannon,Garrick,Garrison,Gavin,Gideon,Gilroy,Greyson,Griffith,Guillaume,Gunther,Hadrian,Halcyon,Hamish,Harlan,Hartley,Henning,Herbert,Heron,Hilton,Holden,Horatio,Humphrey,Idris,Ignatius,Ingram,Irving,Isidor,Jarrett,Jenson,Jerome,Justus,Kael,Keaton,Kellan,Kendric,Kenton,Kieran,Kingsley,Kipling,Klaus,Lachlan,Lambert,Langdon,Laurence,Leander,Leopold,Linwood,Llewellyn,Lorenzo,Lorimer,Lysander,Malcolm,Manning,Marcel,Marsden,Maximilian,Mercer,Montague,Montgomery,Mordecai,Morrison,Mortimer,Nash,Neville,Nicodemus,Norbert,Oberon,Octavian,Oleander,Orion,Orson,Osbert,Pemberton,Percival,Peregrine,Phineas,Pierce,Prescott,Preston,Prosper,Quillan,Quinlan,Rafferty,Rainier,Ramsey,Redmond,Remington,Richmond,Roderick,Roland,Ronan,Roscoe,Rowland,Rupert,Saber,Samson,Saxon,Sebastian,Sheldon,Sheridan,Silvanus,Simeon,Solomon,Spencer,Sterling,Sullivan,Sylvester,Thaddeus,Theobald,Thornton,Thurston,Tobias,Trenton,Tristan,Ulysses,Valerio,Vance,Victor,Vincent,Wallace,Warren,Webster,Wesley,Whitman,Wilder,Winston,Wolfgang,Wycliffe,Yaroslav,Yorick,Zenith,Zephyr`.split(","),

  // SUPPLEMENTARY ARABIC/PERSIAN A-NAMES
  aA2: `Alborz,Anosh,Arash,Ardeshir,Arman,Arshia,Ashkan,Avesta,Azarmehr,Abtin,Afarin,Aftab,Afshin,Ahura,Arash,Ardalan,Arjang,Arman,Arsham,Artin,Ashkan,Atabak,Avand,Azad,Azarnoosh,Abid,Adham,Afzal,Ahmad,Akil,Alim,Ameen,Amir,Anwar,Arif,Ashraf,Azim,Aziz,Altair,Amin,Arshad,Aslan,Azlan`.split(","),

  // SUPPLEMENTARY ARABIC/PERSIAN NON-A NAMES  
  aN2: `Bahram,Behnam,Behrad,Behzad,Bijan,Changiz,Dariush,Farshad,Farzad,Farzin,Fereydoun,Hafez,Hooman,Hormoz,Kaveh,Keyvan,Kourosh,Mehrdad,Nima,Pasha,Payam,Peyman,Piruz,Ramin,Rostam,Sepehr,Shahram,Shahriar,Siavash,Sohrab,Touraj,Vahid,Yasin,Zartosht,Babak,Bahador,Behrouz,Dara,Farzan,Firouz,Houshang,Iraj,Jamshid,Khosrow,Maziar,Mehran,Nadim,Parham,Pouya,Reza,Saman,Shahab,Siamak,Sina,Taha,Vahed,Yunus,Zarif`.split(","),

  // EXTRA A-NAMES - MIXED ORIGINS to balance ratio
  extraA: `Aban,Abram,Achim,Adlai,Aeron,Agron,Aiden,Aimal,Ajit,Alain,Alaric,Aldrin,Alejandro,Alexei,Alford,Alfredo,Algar,Algot,Alhad,Alister,Almond,Alois,Alpin,Alric,Altman,Alvaro,Alvin,Amado,Amadou,Amaru,Ambrus,Amias,Amos,Amrit,Amyas,Anatole,Anchise,Andor,Andrei,Anil,Anselm,Anselmo,Anson,Antero,Anthon,Anton,Anwar,Archer,Arden,Argan,Arian,Ariel,Aris,Ariston,Arkady,Arlen,Armand,Armel,Arnaldo,Arne,Arnold,Arpad,Arren,Arshad,Artem,Artemas,Asher,Ashton,Asmund,Aster,Athos,Atlas,August,Aurel,Aurelio,Austin,Avalon,Avard,Avery,Avon,Axel,Aydin,Aziz,Azriel,Azzam,Adem,Adham,Adrien,Afonso,Agostino,Ahmet,Alban,Albrecht,Aldous,Aleph,Alfonso,Algernon,Alistair,Alonso,Alphard,Alston,Altair,Alvise,Amado,Amato,Amelio,Amias,Amrit,Anatol,Anders,Andre,Andrzej,Angelo,Angus,Annan,Anselm,Anton,Anwar,Apolo,Archer,Arden,Argento,Arian,Ariel,Aris,Arjang,Arlen,Armand,Armin,Arnaud,Arnfried,Arnulf,Arpad,Arren,Arsene,Artemis,Arvo,Asim,Asmund,Athanase,Atlas,Atticus,Aubin,Auden,August,Aurelius,Avery,Aviv,Axel,Aydin,Azariah,Aziz,Azouz,Alvar,Amador,Amias,Andor,Archard,Ariston,Arne,Ascanio,Athanasios,Aureliano,Azarmehr,Abir,Achim,Adamo,Alarik,Albion,Aleksi,Alfio,Algot,Alpin,Altan,Amadis,Ambrose,Amias,Ander,Angilbert,Anselmo,Antioch,Araldo,Arcadio,Ardal,Aretas,Aristide,Armistead,Arnfried,Arsenio,Artemas,Ascanio,Athanaric,Attilio,Augustin,Aurelio,Avalon,Avelino`.split(","),

  // EXTRA NON-A NAMES to keep total high
  extraN: `Baldwin,Barnaby,Basil,Beckett,Bellamy,Bertram,Birch,Bowen,Bramwell,Bruno,Caelum,Caldwell,Caradoc,Carlton,Clement,Clifton,Colbert,Conrad,Corentin,Crispin,Dalton,Devereux,Dolan,Donovan,Drake,Drummond,Duncan,Edmund,Eldon,Elwin,Emilio,Enoch,Erasmus,Erwin,Esmond,Everett,Fairfax,Falconer,Ferdinand,Florent,Forrest,Frederick,Gabriel,Gannon,Garrick,Garrison,Gavin,Gilroy,Griffith,Guillaume,Gunther,Halcyon,Hamish,Harlan,Hartley,Henning,Herbert,Heron,Hilton,Holden,Horatio,Humphrey,Ingram,Irving,Isidor,Jarrett,Jenson,Jerome,Justus,Keaton,Kendric,Kenton,Kieran,Kingsley,Kipling,Klaus,Lambert,Langdon,Laurence,Leopold,Linwood,Llewellyn,Lorimer,Manning,Marsden,Maximilian,Mercer,Montague,Montgomery,Morrison,Mortimer,Nash,Neville,Nicodemus,Norbert,Octavian,Osbert,Pemberton,Phineas,Pierce,Prescott,Preston,Prosper,Quinlan,Rafferty,Rainier,Ramsey,Redmond,Richmond,Roderick,Roscoe,Rowland,Rupert,Saber,Samson,Sheldon,Sheridan,Silvanus,Solomon,Spencer,Sullivan,Sylvester,Theobald,Thornton,Thurston,Trenton,Valerio,Wallace,Warren,Webster,Wesley,Whitman,Winston,Wolfgang,Wycliffe,Yaroslav`.split(","),

  // MORE INDIAN A-NAMES to boost A-ratio and Indian-ratio
  iA3: `Abhirup,Abhuday,Achalesvar,Achyutanand,Adbhut,Adhayanth,Adhinetra,Adhvaith,Adishwar,Advayanand,Agnikumar,Agniputra,Aharnish,Ajayanth,Ajitanand,Ajitpal,Akhandanand,Akhilnath,Akshaypatra,Alampata,Alokraj,Amandeep,Ambikesh,Ameyraj,Amitayu,Amoghraj,Amritpal,Amritansh,Anandrup,Anantarup,Andal,Aneekrit,Anilaabh,Anilkumar,Aniruddh,Anjanikumar,Ankitraj,Anshveer,Antardhan,Anubhav,Anugrah,Anukalp,Anupam,Anuraag,Anuvansh,Apurvanand,Aranyak,Archish,Arijeet,Arinav,Arindham,Arkesh,Arnavraj,Arpandeep,Arthanari,Arundhati,Ashokraj,Ashokvardhan,Ashvinkumar,Ashuddh,Atharvan,Atimanyu,Atishvir,Avadhesh,Avigyan,Avikshith,Avinandan,Avyayansh,Ayodhyanath,Ayurved,Ayushmaan,Azhagi`.split(","),


  // ADDITIONAL INDIAN A-NAMES (Sanskrit/uncommon)
  iA4: `Abhinandan,Adhidev,Adhimukti,Adhyansh,Agneeshwar,Ahamkar,Ajaydev,Akhandpratap,Akhyaansh,Akshaybodh,Alankrit,Amoghsiddh,Amritansh,Anantdev,Anashvar,Aneekrit,Angirasa,Anirdesh,Anjaneya,Ankurprasad,Antarvedi,Anubhuti,Anugyan,Anupamesh,Aparesh,Archana,Arijitdev,Arinav,Arindham,Arkesh,Armaan,Arnavdeep,Arpanveer,Arthanari,Aruneshwar,Ashokdeep,Ashoknath,Ashvinkumar,Atharvanand,Atimanyu,Atishveer,Avadhkishor,Avighna,Avikshitesh,Avinandan,Avyansh,Ayodhyanand,Ayurvardhan,Azhagan`.split(","),

  // EXPANSION: Indian A-names
  iA5: `Abhijnan,Abhijeet,Abhilekh,Abhimand,Abhineet,Abhirath,Abhisek,Abhyudai,Achalesvar,Achintan,Achyutam,Adambara,Adeshwar,Adheena,Adhikari,Adhimukta,Adhineta,Adhirath,Adishvar,Advaitam,Agnikund,Agnirath,Agnishvar,Ahalyesh,Ahimkar,Ajamil,Ajatashatru,Ajaypal,Ajitabh,Ajitdev,Ajitendra,Ajitesh,Akhandmani,Akhilband,Akshadhara,Akshatam,Akshobhya,Alabhya,Alamgir,Alankaran,Alaukik,Amalesh,Amanpreet,Amareshwar,Amarnath,Ambikeya,Amitayu,Amoghavarsh,Amritbindu,Amriteshwar,Amritpal,Anagha,Analekh,Anandamayi,Anandmay,Anandrup,Anantpur,Anantram,Anashwar,Anbazhagan,Aneekrit,Angaraj,Angiras,Animish,Anirvan,Anivrit,Ankitam,Annadurai,Annadata,Antardhan,Anubhavesh,Anugraha,Anukampa,Anumit,Anupam,Anuradhesh,Anurakta,Anushaasan,Anuvrat,Aparajitesh,Apurvam,Aranyak,Archakam,Archishman,Arijitam,Arimardana,Arindamesh,Arivoli,Arjunesh,Arkadeva,Arnavdeep,Arpanveer,Arthasiddhi,Arunodaya,Ashmaataka,Ashokvardhan,Ashutoshraj,Ashwathaman,Ashwinraj,Atharvanand,Athirath,Atishvaresh,Atmadarshan,Atmanand,Avadhesh,Avadhut,Avighnam,Avikalpana,Avimuktesh,Avyayam,Ayodhyapati,Ayushmat`.split(","),
  // EXPANSION: Indian non-A names
  iN5: `Bahulesh,Baikunth,Bakul,Balachandran,Balagopal,Balakrishnan,Balamurali,Balaraj,Balaraman,Baldev,Balkrishna,Balvant,Balveer,Bandhul,Bankebihari,Bankim,Bansidhar,Basant,Bhadra,Bhagavan,Bhagirath,Bhagyaraj,Bhairav,Bhajan,Bhaktaraj,Bhanudas,Bhanupriya,Bhaskaran,Bhasvar,Bhaumik,Bhavdeep,Bhavinesh,Bhimsen,Bholanath,Bhoomesh,Bhoopat,Bhrigupati,Bhudev,Bhupendra,Bhushan,Bijay,Bijoy,Bikram,Bimal,Bindusar,Birbal,Bishan,Brahmdev,Brahmanand,Brajesh,Brijkishor,Brijlal,Chandradev,Chandrakishor,Chandramohan,Chandranath,Chandraprakash,Chandrasen,Chandravardhan,Charandeep,Charuchandra,Charuvrat,Chaturbhuj,Chidambar,Chidanand,Chinmayanand,Chinnaswamy,Chiranjeev,Chitrakoot,Chitranjan,Chitresh,Dagdu,Dakshraj,Damodar,Dandapani,Darpan,Dayakara,Dayasagar,Debajyoti,Debasish,Deepankar,Deepesh,Deshraj,Devadatta,Devaguru,Devajit,Devakant,Devakinandan,Devamitra,Devanandan,Devaprasad,Devarajan,Devashish,Devavrat,Devendra,Deviprasad,Devkant,Devkinandan,Devnarayan,Dhananjay,Dhanapati,Dhanaraj,Dhaneshwar,Dhanisht,Dhanurdhar,Dhanvant,Dharmabandhu,Dharmadeva,Dharmaditya,Dharmapala,Dharmaveer,Dhatri,Dhirendra,Dhyanesh,Digambar,Digvijayi,Dilipkumar,Dinanath,Dipankar,Divyajyoti,Divyangshu,Drishtikona,Durgadatta,Durgaprasad,Durjay,Dushyant,Dwarakanath,Dyutiman,Ekalavya,Eknath,Gangadharan,Gangaram,Gangeshwar,Garudadwaj,Gaurishankar,Ghanashyam,Giribaala,Giridhari,Girdhari,Gopaldas,Gopalakrishnan,Gopinath,Gorakhnath,Goverdhan,Govindraj,Gulab,Gulabchand,Gunavant,Gurdayal,Gurdip,Gurnam,Gurudatt,Gurudev,Gurumurthy,Guruprasad,Gyandeep,Gyaneshwar,Hanumant,Harekrishna,Haridev,Harikrishna,Harilal,Harinarayan,Hariprasad,Hariram,Harishankar,Harshavardhana,Hemkant,Hemkumar,Himadri,Hiranyak,Hridayesh,Hridaynath,Indivar,Indradeep,Indrakant,Indraneel,Ishvardas,Jagadeep,Jagadish,Jaganmohan,Jagannath,Jagdish,Jagjivan,Jagmohan,Jagpal,Jaigopal,Jaikishor,Jaimini,Jaiprakash,Jaivardhan,Janmejay,Jaspal,Jaswant,Jawahar,Jayachandran,Jayagopal,Jayakumar,Jayaprakash,Jayashankar,Jayawardhan,Jigesh,Jitendranath,Jivanraj,Jivitesh,Jogeshwar,Joshila,Jugalkishore,Jyotindra,Jyotiprakash,Jyotirmay,Jyotirmayi,Kaivalyanath,Kaleshwar,Kalikrishna,Kaliprasad,Kalyanraj,Kamakshi,Kamalanayan,Kamalnayan,Kameshwar,Kanhaiyalal,Kanthimathi,Kapildev,Karnamrit,Karneshwar,Kartikesh,Karunakaran,Karunanidhi,Kashiram,Kashinath,Kaushlesh,Kedareshwar,Keshavraj,Ketakiprasad,Kirtiman,Kishorilal,Kowshik,Krishanpal,Krishnakumar,Krishnamurthy,Krishnaswamy,Krishnendu,Kshetrapal,Kuladhar,Kumaraswamy,Kumudesh,Kunalraj,Kusumesh,Lakshmanraj,Lakshmikant,Lakshminarayan,Lalitaditya,Laliteshwar,Laxmikant,Lokeshwar,Lokprakash,Lokvir,Madanpal,Madhavachary,Madhavdas,Madhavesh,Madhuraj,Mahabir,Mahadevan,Mahakant,Mahamritunjay,Mahanand,Maharaj,Mahashay,Mahavir,Mahendrakumar,Maheshchandra,Maheshkumar,Mahidhar,Mahipat,Mahodaya,Mangaldev,Mangaleshwar,Manibhushan,Manikandan,Manikchand,Maniram,Manishwar,Manjunath,Manoharpal,Manonmani,Manoranjan,Mansukh,Manthanesh,Meghraj,Mihirkumar,Milindjyoti,Mohanraj,Mohinder,Moolchand,Motilal,Mrigendra,Mrigeshwar,Mukeshwar,Muktanand,Mukundaraj,Muraleedhar,Muralimohan,Muthuvel,Nachiket,Nagabhushana,Nagarajan,Nageswaran,Nageshwaran,Nakuleshwar,Nalinkant,Nalinaksha,Namdev,Nandakumar,Nandgopal,Nandkishore,Narayanamurthy,Narendrakumar,Narottamdas,Narsingh,Natarajan,Navaratna,Navneet,Nayanesh,Neelakantan,Neelambar,Nilambara,Nilamadhava,Nilmani,Nirankush,Nirbhay,Nirdosh,Nirmalkumar,Nirvanesh,Nishikant,Nityagopal,Nityasundar,Nrisimha,Omeshwar,Omprakash,Padmakant,Padmanabhan,Palaniswamy,Panchakshara,Panduranga,Pankajakshan,Paramananda,Parashuram,Parmatma,Parusharaman,Parvataraj,Pattabhiraman,Pavankumar,Pillaiyar,Pitambara,Prabaleshwar,Prabhakareshwar,Prabhudayal,Prachetas,Pradyuman,Prajapati,Prakhyat,Pramodkumar,Pranavesh,Praneshwar,Prasannavadan,Prasunamba,Prathamesh,Pratibimba,Pravinkumar,Premkumar,Prithvipal,Priyavrat,Purandareshwar,Purnananda,Purnendu,Purshottamdas,Pushpadanta,Radhakrishnan,Radheshyam,Raghuraj,Raghuveeran,Rajagopalan,Rajanikant,Rajeshkumar,Rajeshwaran,Rajivalochan,Rajkishore,Rajmohan,Rajvardhan,Ramakant,Ramanand,Ramanaresh,Ramasubramani,Ramchandran,Rameshbabu,Rameshchandra,Ramgopal,Ramkishor,Ramprakash,Ramprasad,Ramswaroop,Ranajit,Ranchhodlal,Ranjitsinh,Raseshwar,Rathinam,Ratnadeep,Ratnakant,Ratnakar,Ravikant,Raviprakash,Ravishankar,Ritambhara,Rudrapratap,Rupeshwar,Sachidananda,Sadanand,Sagarika,Sahajvir,Sahasrajit,Sailendranath,Sakharam,Samarthvir,Samarender,Sambashiva,Samraateshwar,Samudragupta,Sanatkumar,Sanchiteshwar,Sandipkumar,Sanghamitra,Sanjivkumar,Sankaranarayanan,Sankareshwar,Sanmukh,Santatirtha,Santoshkumar,Sarangdhara,Saravanan,Sarveshwar,Saswat,Satagopa,Satishchandra,Satyabrata,Satyajeet,Satyanarayan,Satyavrat,Savitanand,Senthilkumar,Seshadri,Shankaranarayanan,Shantanand,Shantiprakash,Sharvaanand,Shashikant,Shatrujet,Sheshkumar,Shikhandini,Shilpakumar,Shivanand,Shivprasad,Shivraj,Shivshakti,Shobhiteshwar,Shreenivasan,Shreshtha,Shrikant,Shriprakash,Shrirang,Shrivardhan,Shriyash,Shubhendu,Shyamsundara,Siddeshwar,Siddhanteshwar,Sivakumar,Sivasubramani,Somasundaram,Somnath,Sooryakant,Srikrishna,Srinivasan,Sriranganath,Srivatsan,Subhajit,Subhashchandra,Subhasish,Subramanyam,Sudarshana,Sudhanshu,Sukhdev,Sukhlal,Sukumar,Sumaneshwar,Sumanthra,Sundarrajan,Sundramurthy,Surajprakash,Surendranath,Sureshkumar,Suryanarayana,Suryaprakash,Sushantraj,Swaminathan,Swapneshwar,Swaroop,Tanmaydev,Tapaskumar,Tejaswinath,Thakurdas,Thamaraikannan,Thandavamurthy,Thangavelu,Thirumalaianand,Thiruvenkatam,Tribhuvan,Trilochana,Trimurti,Tripurari,Trishankhu,Tulsidasa,Tyageshwar,Udayakumar,Uddhaveshwar,Ujjaleshwar,Umapathi,Umeshchandra,Uthpalaksha,Uttameshwar,Vaasudeva,Vaibhavraj,Vairochana,Vaisampayana,Vajreshwar,Vallabhbhai,Vamadevan,Varadharaj,Varshanand,Vasanthakumar,Vasishtha,Vatsarajan,Vedprakash,Venkataramanan,Venkateshwara,Venugopal,Vetrichelvan,Vibhakara,Vibhutibushan,Vidyacharan,Vidyapati,Vidyaranya,Vijayanand,Vijayashekhar,Vijayendranath,Vikasindhuja,Vikramjeet,Vinaykumar,Vindhyeshwar,Vinodkumar,Virabhadra,Viraraghavan,Vishwakarma,Vishwanathan,Vishweshwarayya,Vittaldas,Vitthalrao,Vivasvat,Vivekanand,Vrajlal,Vyomkesh,Yadavendra,Yadunath,Yajnadatta,Yajnavalkya,Yamunesh,Yashasvikumar,Yashvardhan,Yogananda,Yogeshwar,Yogindranath,Yugandhar,Yuvaraj,Yuvashekhar`.split(","),
  // EXPANSION: Arabic/Persian A-names
  aA5: `Abdulrahman,Abdulkarim,Adeel,Affan,Afshar,Ahad,Akeel,Akram,Alauddin,Alborz,Alireza,Almahdi,Altamash,Amaan,Amjad,Aqeel,Ardalan,Arham,Armaghan,Arshadali,Artin,Ashfaq,Ashkan,Atabak,Avicenna,Ayaan,Azarmehr,Azeem,Azfar,Azim,Azmat,Azzam`.split(","),
  // EXPANSION: Arabic/Persian non-A names
  aN5: `Bahauddin,Bahadur,Bakhtiar,Barzan,Basir,Behzad,Bilqis,Borhan,Changiz,Dabir,Daud,Dilawar,Dilshad,Ebrahim,Ehtesham,Elham,Erfan,Eskandar,Fahim,Fakhar,Faraz,Fardeen,Farhan,Farouk,Fawad,Feroze,Ferzan,Firdaus,Firooz,Ghulam,Habibullah,Hafeez,Hameed,Hammad,Hassan,Hidayat,Hikmat,Humayun,Hussain,Ihsan,Inayat,Iqtidar,Irshad,Ismat,Izhar,Jafar,Jaleel,Javaid,Jawad,Javed,Kabir,Kaiwan,Kaleem,Kambiz,Kareem,Kasra,Kazim,Khaled,Khashayar,Khurshid,Koorosh,Liakat,Lutfullah,Mahbub,Mahmood,Manzar,Maqbool,Maqsood,Masroor,Mateen,Mazhar,Mehboob,Mehdi,Mehrab,Misbah,Moazzam,Mohsen,Mojtaba,Morshed,Moshfegh,Mozaffar,Murtaza,Naseer,Naushad,Nawab,Nazar,Niloufar,Nouman,Nusrat,Parvez,Pervez,Qamar,Qasim,Raees,Raheel,Rameez,Rashed,Rauf,Riaz,Ruhollah,Rustam,Saadullah,Saboor,Sadruddin,Saeed,Safdar,Sajjad,Salahuddin,Sardar,Sarfraz,Shahbaz,Shahid,Shakeel,Shakil,Shamshad,Shehzad,Shoaib,Shuja,Sikandar,Sulaiman,Syed,Tahsin,Talat,Taufiq,Tawfik,Toufiq,Usman,Waleed,Waqas,Yaqub,Zafar,Zahoor,Zeeshan,Zulfiqar`.split(","),
  // EXPANSION: African names
  fN5: `Abena,Abubakar,Adama,Adamu,Adewuyi,Adongo,Afikpo,Afolarin,Agbor,Aguda,Ajayi,Akande,Akintunde,Akorede,Alemayehu,Amadou,Amaka,Antwi,Babajide,Babatunde,Bankole,Bemba,Biram,Bitrus,Boateng,Chidubem,Chiemeka,Chinedu,Chinonso,Chukwudi,Chukwuka,Chukwuemeka,Dada,Danquah,Demba,Desta,Diallo,Dike,Dumebi,Ebenezer,Efosa,Ekow,Ekwueme,Enitan,Essien,Etim,Ewuare,Eyitayo,Ezinne,Fadahunsi,Fapohunda,Folorunsho,Foluke,Gbenga,Godswill,Ibeabuchi,Ibrahim,Idowu,Ifeanyi,Ifeoluwa,Ikechukwu,Ikemefuna,Ikenna,Immanuel,Isioma,Izuchukwu,Jibril,Jideofor,Kalu,Kangni,Kayode,Kelechi,Kenechukwu,Koffi,Kolawole,Koranteng,Kwadwo,Kwasi,Lanre,Machel,Madu,Mandla,Mensah,Modupe,Moussa,Mthunzi,Mudashiru,Mustapha,Mwamba,Nduka,Ngozi,Nkemdirim,Nnaemeka,Nneka,Nwachukwu,Nwankwo,Nwosu,Obafemi,Obaseki,Obioma,Ochieng,Odinaka,Odion,Oghene,Okechukwu,Okwudili,Olabisi,Olabode,Oladipo,Oladokun,Olalekan,Olamide,Olanrewaju,Olatunde,Olawale,Olubunmi,Olufemi,Olukayode,Olumuyiwa,Olusola,Oluwatobi,Oluwatobiloba,Omolara,Omoruyi,Onyeka,Osagbovo,Osagie,Osamudiamen,Osarenkhoe,Osarhiemen,Ositadinma,Owusu,Oyewale,Sanusi,Seun,Sibusiso,Sipho,Siyabonga,Taiwo,Tamuno,Temidayo,Temitope,Thabo,Thulani,Tochukwu,Tunde,Uchechukwu,Udochukwu,Ugochukwu,Uzochukwu,Wanjiru,Yeboah,Yinka,Yusuf,Zainab,Zamani,Zanele,Zinhle,Zola,Zubairu`.split(","),
  // EXPANSION: Global A-names
  gA5: `Aamund,Achille,Achill,Adalberto,Adalric,Adalwin,Adolphe,Agapito,Agostinho,Agoston,Agustin,Aimon,Alarik,Albano,Alberic,Albertino,Alcander,Alcuin,Aldebrand,Aldobrando,Aldous,Aleksandar,Alembert,Alerion,Alessio,Alfonse,Alfonsino,Algernon,Alirio,Alistair,Almeric,Almiro,Alois,Alonzo,Alphonso,Altan,Aluisio,Alvino,Amadis,Amadou,Amalric,Amancio,Amaranto,Amato,Amauricio,Ambroise,Americo,Amias,Amiell,Amintore,Amleto,Amnon,Anacleto,Anastasio,Androcles,Angelino,Angilbert,Aniceto,Anselme,Antero,Antigonus,Antonino,Apelles,Apollinaire,Aquilino,Araldo,Arbogast,Arcadio,Arcangelo,Archibaldo,Archimedes,Aretino,Argento,Argilao,Ariston,Arkady,Arminio,Arnaldo,Arnfried,Arnolfo,Arsenio,Artemon,Arvid,Asterion,Astorik,Athanase,Atilio,Atlante,Auberon,Auguste,Aureliano,Aurelien,Aurelio,Ausonio,Avigdor,Avraham,Axl`.split(","),
  // EXPANSION: Global non-A names + architect names
  gN5: `Baldassare,Baldovino,Baltasar,Barnabe,Bartolome,Basilio,Baudouin,Benedetto,Bengt,Benicio,Berardo,Berengario,Berislav,Bernabe,Bertil,Bertolt,Bertrand,Bjarke,Bjarne,Blagoj,Blasius,Bogdan,Bogomil,Bohumil,Boleslaw,Bonifacio,Borivoj,Borislav,Branko,Bronislav,Buenaventura,Caetano,Calogero,Camillo,Candido,Caradoc,Carloman,Casimiro,Cassiano,Castulo,Celestino,Cesareo,Cipriano,Cirilo,Claudio,Clemens,Clodoaldo,Columba,Cornelio,Corrado,Cosimo,Cristobal,Dagoberto,Dalibor,Dalmazio,Damiano,Dariusz,Demetrio,Desiderio,Didier,Dieter,Dietrich,Dinu,Dionisio,Dirk,Domenico,Dominik,Donato,Doroteo,Drago,Dragomir,Dragutin,Duarte,Duccio,Edgardo,Edmondo,Efisio,Efrem,Egidio,Eleuterio,Eligio,Elizandro,Emanuele,Emeric,Emidio,Emmerich,Engelbert,Eoin,Epifanio,Erasmus,Ercole,Erhard,Ermenegildo,Ernesto,Esmond,Estevao,Evaristo,Ezechiele,Fabrizio,Faliero,Fausto,Federico,Feliciano,Feodor,Ferdinando,Fernand,Fidelio,Filemon,Fioravante,Fiorenzo,Florentin,Floriano,Fortunato,Frederigo,Fulvio,Gael,Galeazzo,Galileo,Garibaldi,Gaspard,Gaspare,Gaudencio,Gauthier,Gavino,Gennaro,Geraldo,Gerardo,Gerhart,Germano,Geronimo,Gervais,Gherardo,Giacinto,Gian,Giancarlo,Gianfranco,Gianluca,Gianmarco,Gianpaolo,Giorgio,Giovanni,Girolamo,Giuliano,Giulio,Giuseppe,Goffredo,Gonzalo,Gottfried,Graciano,Gratien,Graziano,Gregorio,Guelfo,Guglielmo,Guido,Gunnar,Gustavo,Halvard,Hamilcar,Hanno,Hannibal,Harald,Hartmut,Haukur,Hector,Helge,Helmut,Heracles,Herberto,Hermenegildo,Hernando,Hildebrand,Hippolyte,Honorato,Horacio,Huberto,Hugo,Humbert,Hywel,Ignazio,Ildefonso,Inocencio,Isidoro,Istvano,Jacinto,Jacobo,Jaromir,Jaroslav,Jenaro,Jeronimo,Joachim,Jolyon,Jovian,Juanelo,Juliusz,Justino,Kaspars,Kazimierz,Kestutis,Kilian,Koloman,Konrad,Krzysztof,Kunibert,Ladislao,Ladislav,Lamberto,Lanfranco,Laszlo,Laurentiu,Leandro,Lech,Leocadio,Leonardo,Leonhard,Leopoldo,Leszek,Leuthar,Liberato,Liborio,Licio,Lionello,Livio,Lodovico,Lorcan,Lotario,Lothair,Lucano,Luciano,Ludovico,Ludvig,Lupercio,Macario,Manfredo,Marcellino,Marciano,Marcolino,Mariano,Marino,Marzio,Massimo,Mattia,Maurizio,Medardo,Melchior,Melchiorre,Metodio,Mieczyslaw,Mikolaj,Miroslav,Modesto,Narciso,Nardo,Nazario,Nestor,Nicanor,Niccolao,Niccolo,Nikolaj,Norberto,Nunzio,Odoacer,Olimpio,Onofrio,Opilio,Orazio,Orfeo,Orlando,Osvaldo,Otello,Othmar,Ottavio,Ottone,Pacifico,Pancrazio,Paolo,Pasquale,Patricio,Pellegrino,Petronio,Pierluigi,Piero,Placido,Policarpo,Pompeo,Porfirio,Primitivo,Primo,Procopio,Prudencio,Radoslav,Radovan,Raffaele,Raimondo,Rainaldo,Rainiero,Raniero,Ranulfo,Remigio,Renato,Riccardo,Rinaldo,Roberto,Rocco,Rodolfo,Rodrigo,Rogelio,Rolando,Roque,Rosario,Ruggero,Ruperto,Rutger,Sabatino,Salvatore,Sandro,Santino,Saturnino,Saverio,Sebasiano,Serafino,Severo,Sigfredo,Silvano,Silvestre,Simone,Sinibaldo,Stanislav,Stefano,Stiliano,Sulpicio,Svatopluk,Telemaco,Teodoro,Terenzio,Teseo,Tiberio,Timoteo,Torquato,Trajan,Ugo,Umberto,Urbano,Valentino,Valerio,Valeriano,Venceslao,Venerando,Venanzio,Vincenzo,Virgilio,Vitaliano,Vittorio,Vladislav,Vlastimil,Vojislav,Vratislav,Wenceslao,Wladyslaw,Wolfhart,Wratislaw,Yaropolik,Zaccaria,Zbigniew,Zdravko,Zenobio,Zenone,Zoran,Zvonimir,Tadao,Renzo,Bjarke,Moshe,Cesar,Santiago,Rem,Carlo,Eero,Balkrishna,Thom,Sverre,Gottfried,Luis,Kengo,Frei,Alvaro,Enric,Emilio,Ettore,Giancarlo,Massimiliano,Pier,Cino,Bijoy,Cedric,Zvi,Rafael,Antoni,Buckminster,Ludwig,Ieoh,Mies,Aldo,Addison,Corbu,Alvar,Kisho,Frei,Oscar,Norman,Eladio,Myron,Denys,Berthold,Eileen,Gottfried,Diebedo,Balkrishna,Hafeez,Bijoy,Laurie,Dermot,Grafton,Jorn,Kenzo,Arata,Pritzker,Sedad,Sverre,Fumihiko,Glenn,Thom,Morphosis,Wolf,Jeanne,Lacaton,Vassal,Doshi,Siza,Souto,Moneo,Nouvel,Ando,Piano,Gehry,Hadid,Murcutt,Utzon,Niemeyer,Barragan,Kahn,Aalto,Tange,Pei,Stirling,Meier,Venturi,Pritzker,Sejima,Mendes,Zumthor,Nouvel,Chipperfield,Pawson,Libeskind,Calatrava,Isozaki,Saarinen,Breuer,Jacobsen,Neutra,Schindler,Loos,Gaudi,Palladio,Vitruvius,Sinan,Brunelleschi,Bernini,Borromini,Wren,Nash`.split(","),
  // EXPANSION: Korean names
  kN5: `Byeongjun,Chanho,Chanwoo,Daewon,Donghyun,Dongmin,Doojin,Eunho,Geonho,Gunho,Gyumin,Hanjin,Hanul,Hasung,Heejun,Hosung,Hyeonjun,Hyukjin,Inho,Jaehoon,Jaeyoung,Jeonghoon,Jihan,Jinwoo,Joohyun,Joonho,Junghwan,Junhyung,Junwon,Kijoon,Kyungmin,Minchan,Minjin,Minwoo,Myungho,Namhoon,Sangjin,Sangwoo,Seokhoon,Seokjin,Seongmin,Seungjin,Seungmin,Seungyoon,Soojin,Sungho,Sungjin,Sungwoo,Taehwan,Taewoo,Woohyun,Woojung,Yeonho,Yongjin,Youngho,Youngjin,Youngsoo,Yuhwan`.split(","),

  // EXPANSION BATCH 2: Indian A-names
  iA6: `Aashray,Abhyuday,Achaleswar,Achyutananda,Adheendra,Adhishesha,Adithyavardhan,Adwaithya,Agneepath,Ajaymitra,Ajitabha,Akhandalamani,Aksharapatra,Akshayananda,Alamkara,Alaukikata,Amitavikram,Amoghasiddh,Amritbodh,Amriteshvara,Anandakrishna,Anandavardhana,Anantashakti,Anashvara,Aneeshvara,Angadeshvara,Anilabha,Anirdeshya,Anjaliputra,Ankiteshvara,Annaduraiprasad,Antahprabha,Anubhavananda,Anugrahesvara,Anukampavardhan,Anupameshvara,Anushasitri,Anuvriteshvara,Aparajitavikram,Apurvachandra,Aranyakeshvara,Archishvara,Aridamaneshvara,Arindameshvara,Arjunavikrama,Arkadeva,Arnaveshvara,Arpankumar,Arshadvardhan,Arthaprakasha,Aruneshvara,Ashmarathna,Ashokvardhan,Ashwinivardhan,Atharvavedananda,Athiratharaj,Atmabodheshvara,Avadheshvara,Avighnavardhan,Avikalpeshvara,Avinashraj,Avyayeshvara,Ayodhyakumar,Ayushmanraj`.split(","),


  // CREATIVE FIGURES — first names of famous architects, artists, painters, sculptors, designers
  // Architects: Tadao (Ando), Renzo (Piano), Alvar (Aalto filtered), Eero (Saarinen), Mies, Rem (Koolhaas), Bjarke (Ingels), Zaha (Hadid), Kengo (Kuma), Moshe (Safdie)
  // Artists/Painters: Basquiat→Jean-Michel, Caravaggio→Michelangelo, Vermeer→Johannes, Klimt→Gustav, Rothko→Mark, Balthus, Kandinsky→Wassily, Klee→Paul filtered
  // Sculptors: Brancusi→Constantin, Rodin→Auguste, Giacometti→Alberto, Noguchi→Isamu, Kapoor→Anish filtered
  // Designers: Eames→Charles, Dieter (Rams), Massimo (Vignelli)
  creativeA: `Alvar,Anselm,Antoni,Artemisia,Alberto,Auguste,Aristide,Amedeo,Andrei,Antony`.split(","),
  creativeN: `Tadao,Renzo,Eero,Rem,Bjarke,Kengo,Moshe,Leoh,Thom,Toyo,Sverre,Enric,Balkrishna,Isamu,Christo,Constantin,Raphael,Lucian,Rufino,Ettore,Massimo,Dieter,Olafur,Subodh,Raqib,Ravinder,Tyeb,Vivan,Donatello,Giotto,Titian,Cellini,Miro,Dali,Calder,Basil,Eames`.split(","),
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

  addNames(RAW_NAMES.iA, "Indian", true);
  addNames(RAW_NAMES.iN, "Indian", false);
  addNames(RAW_NAMES.aA, "Arabic/Persian", true);
  addNames(RAW_NAMES.aN, "Arabic/Persian", false);
  addNames(RAW_NAMES.fA, "African", true);
  addNames(RAW_NAMES.fN, "African", false);
  addNames(RAW_NAMES.kN, "Korean", false);
  addNames(RAW_NAMES.gA, "Global", true);
  addNames(RAW_NAMES.gN, "Global", false);
  // Supplementary
  addNames(RAW_NAMES.iA2, "Indian", true);
  addNames(RAW_NAMES.iN2, "Indian", false);
  addNames(RAW_NAMES.gA2, "Global", true);
  addNames(RAW_NAMES.gN2, "Global", false);
  addNames(RAW_NAMES.aA2, "Arabic/Persian", true);
  addNames(RAW_NAMES.aN2, "Arabic/Persian", false);
  addNames(RAW_NAMES.extraA, "Global", true);
  addNames(RAW_NAMES.extraN, "Global", false);
  addNames(RAW_NAMES.iA3, "Indian", true);
  addNames(RAW_NAMES.iA4, "Indian", true);
  // Expansion batch 1
  addNames(RAW_NAMES.iA5, "Indian", true);
  addNames(RAW_NAMES.iN5, "Indian", false);
  addNames(RAW_NAMES.aA5, "Arabic/Persian", true);
  addNames(RAW_NAMES.aN5, "Arabic/Persian", false);
  addNames(RAW_NAMES.fN5, "African", false);
  addNames(RAW_NAMES.gA5, "Global", true);
  addNames(RAW_NAMES.gN5, "Global", false);
  addNames(RAW_NAMES.kN5, "Korean", false);
  // Expansion batch 2
  addNames(RAW_NAMES.iA6, "Indian", true);
  // Final batch
  addNames(RAW_NAMES.creativeA, "Creative", true);
  addNames(RAW_NAMES.creativeN, "Creative", false);

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
      // Version check — bump this to force a fresh start
      const DB_VERSION = 2;
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

      let r = await loadData("nmb:ratings", {});
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
      setLoading(false);
    })();

    // Real-time listeners — sync votes live between devices
    const unsubs = [
      fbListen("nmb_ratings", (val) => { if (val) setRatings(val); }),
      fbListen("nmb_comparisons", (val) => { if (val) setComparisons(val); }),
      fbListen("nmb_totalVotes", (val) => { if (val !== null) setTotalVotes(val); }),
      fbListen("nmb_favorites", (val) => { if (val) setFavorites(new Set(val)); }),
      fbListen("nmb_skipped", (val) => { if (val) setSkippedNames(new Set(val)); }),
      fbListen("nmb_disliked", (val) => { if (val) setDislikedNames(new Set(val)); }),
    ];

    return () => unsubs.forEach(fn => fn());
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
      return { name, votes, rank: i + 1, origin: info?.origin || "Unknown", traits: info?.traits || [], comparisons: comparisons[name] || 0, isFavorite: favorites.has(name) };
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
          {tab === "discover" ? "Discover" : tab === "rankings" ? "Rankings" : "Favorites"}
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
          <div style={styles.statRow}>
            <span style={styles.statLabel}>Favorites</span>
            <span style={styles.statValue}>{favorites.size}</span>
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
            onSkipAll={handleSkipAll}
            onDislikeAll={handleDislikeAll}
            onNeverShow={handleNeverShow}
            onToggleFavorite={toggleFavorite}
            favorites={favorites}
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
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            totalVotes={totalVotes}
            onReset={handleReset}
            namesSeen={Object.keys(comparisons).length}
            namesTotal={ALL_NAMES.length}
          />
        )}
        {tab === "favorites" && (
          <FavoritesTab
            favorites={favorites}
            ratings={ratings}
            comparisons={comparisons}
            allNames={ALL_NAMES}
            onToggleFavorite={toggleFavorite}
            showFullName={showFullName}
          />
        )}
      </div>

      {/* Tab Bar */}
      <div style={styles.tabBar}>
        {[
          { id: "discover", icon: "✦", label: "Discover" },
          { id: "rankings", icon: "📊", label: "Rankings" },
          { id: "favorites", icon: "♡", label: "Favorites" },
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
function DiscoverTab({ currentFive, selected, animating, onSelect, onSkipAll, onDislikeAll, onNeverShow, onToggleFavorite, favorites, showFullName, totalVotes, topName }) {
  const [swipedName, setSwipedName] = useState(null);

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
          const isFav = favorites.has(n.name);
          const isOpen = swipedName === n.name;

          return (
            <div key={`${n.name}-${i}`} style={styles.cardWrapper}>
              <div
                style={{
                  ...styles.nameCard,
                  transform: isSelected ? "scale(1.03)" : isNotSelected ? "scale(0.96)" : "scale(1)",
                  opacity: isNotSelected ? 0.4 : 1,
                  background: isSelected ? "linear-gradient(135deg, #007AFF 0%, #5856D6 100%)" : "#fff",
                  color: isSelected ? "#fff" : "#1C1C1E",
                  borderColor: isSelected ? "transparent" : "#E5E5EA",
                  transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                onClick={() => !animating && onSelect(n.name)}
              >
                <div style={styles.cardContent}>
                  <div style={styles.nameText}>{n.name}</div>
                  {showFullName && (
                    <div style={{...styles.fullNameText, color: isSelected ? "rgba(255,255,255,0.7)" : "#8E8E93"}}>
                      {n.name} Chikahisa Reddy
                    </div>
                  )}
                  <div style={{
                    ...styles.originBadge,
                    background: isSelected ? "rgba(255,255,255,0.2)" : originColor(n.origin).bg,
                    color: isSelected ? "#fff" : originColor(n.origin).text,
                  }}>
                    {n.origin}
                  </div>
                  <div style={styles.traitRow}>
                    {(n.traits || []).map((t, ti) => (
                      <span key={ti} style={{
                        ...styles.traitChip,
                        background: isSelected ? "rgba(255,255,255,0.15)" : "#F2F2F7",
                        color: isSelected ? "rgba(255,255,255,0.8)" : "#636366",
                      }}>{t}</span>
                    ))}
                  </div>
                </div>
                <div style={styles.cardActions}>
                  <button
                    style={{...styles.iconBtn, color: isSelected ? "#fff" : isFav ? "#FF3B30" : "#C7C7CC"}}
                    onClick={(e) => { e.stopPropagation(); onToggleFavorite(n.name); }}
                  >
                    {isFav ? "♥" : "♡"}
                  </button>
                  <button
                    style={{...styles.iconBtn, color: isSelected ? "rgba(255,255,255,0.5)" : "#C7C7CC", fontSize: 14}}
                    onClick={(e) => { e.stopPropagation(); onNeverShow(n.name); }}
                    title="Never show again"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={styles.bottomButtons}>
        <button style={styles.dislikeBtn} onClick={onDislikeAll} disabled={animating}>
          👎 I Don't Like Any of These
        </button>
        <button style={styles.skipBtn} onClick={onSkipAll} disabled={animating}>
          Skip — Show 5 New Names
        </button>
      </div>
    </div>
  );
}

// ============================================================
// RANKINGS TAB
// ============================================================
function RankingsTab({ rankedNames, searchQuery, setSearchQuery, favorites, onToggleFavorite, totalVotes, onReset, namesSeen, namesTotal }) {
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
                  {n.isFavorite && <span style={{color: "#FF3B30", marginLeft: 4}}>♥</span>}
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
                style={{...styles.iconBtn, color: n.isFavorite ? "#FF3B30" : "#C7C7CC"}}
                onClick={() => onToggleFavorite(n.name)}
              >
                {n.isFavorite ? "♥" : "♡"}
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
// FAVORITES TAB
// ============================================================
function FavoritesTab({ favorites, ratings, comparisons, allNames, onToggleFavorite, showFullName }) {
  const favList = allNames
    .filter(n => favorites.has(n.name))
    .map(n => ({
      ...n,
      votes: ratings[n.name] || 0,
      comparisons: comparisons[n.name] || 0,
    }))
    .sort((a, b) => b.votes - a.votes);

  return (
    <div style={styles.favContainer}>
      {favList.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={{fontSize: 48, marginBottom: 16}}>♡</div>
          <div style={{color: "#8E8E93", fontSize: 15}}>Tap the heart on any name to save it here</div>
        </div>
      ) : (
        <>
          <div style={styles.favCount}>{favList.length} favorite{favList.length !== 1 ? "s" : ""}</div>
          {favList.map((n) => (
            <div key={n.name} style={styles.favCard}>
              <div>
                <div style={styles.favName}>{n.name}</div>
                {showFullName && <div style={styles.favFullName}>{n.name} Chikahisa Reddy</div>}
                <div style={styles.favMeta}>
                  <span style={{...styles.originBadge, ...originColor(n.origin)}}>{n.origin}</span>
                  <span style={{color: "#8E8E93", fontSize: 12, marginLeft: 8}}>{n.votes} {n.votes === 1 ? "vote" : "votes"}</span>
                </div>
              </div>
              <button
                style={{...styles.iconBtn, color: "#FF3B30", fontSize: 22}}
                onClick={() => onToggleFavorite(n.name)}
              >
                ♥
              </button>
            </div>
          ))}
        </>
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
  statusBar: { height: 12, background: "#F2F2F7" },
  navBar: {
    position: "sticky", top: 0, zIndex: 100,
    padding: "8px 20px 12px", background: "#F2F2F7",
  },
  navTitle: { fontSize: 28, fontWeight: 700, color: "#1C1C1E", letterSpacing: -0.5 },
  navSubtitle: { fontSize: 13, fontWeight: 500, color: "#8E8E93", marginTop: 2 },
  navBtn: {
    background: "none", border: "none", fontSize: 22, color: "#007AFF", cursor: "pointer",
    padding: "8px", borderRadius: 20, width: 40, height: 40,
    display: "flex", alignItems: "center", justifyContent: "center",
    position: "absolute", right: 20, top: 8,
  },
  content: { flex: 1, paddingBottom: 90 },

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
  discoverContainer: { padding: "0 16px" },
  promptText: {
    textAlign: "center", fontSize: 17, fontWeight: 600, color: "#1C1C1E",
    marginBottom: 4,
  },
  voteCounter: {
    textAlign: "center", fontSize: 13, color: "#8E8E93", marginBottom: 16,
  },
  nameCards: { display: "flex", flexDirection: "column", gap: 10 },
  cardWrapper: { position: "relative" },
  nameCard: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "16px 16px", borderRadius: 14, cursor: "pointer",
    border: "0.5px solid #E5E5EA",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
  },
  cardContent: { flex: 1 },
  nameText: { fontSize: 22, fontWeight: 600, letterSpacing: -0.3 },
  fullNameText: { fontSize: 13, marginTop: 3 },
  originBadge: {
    display: "inline-block", fontSize: 11, fontWeight: 500,
    padding: "3px 8px", borderRadius: 6, marginTop: 6,
  },
  traitRow: {
    display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6,
  },
  traitChip: {
    fontSize: 10, fontWeight: 500, padding: "2px 7px", borderRadius: 10,
    whiteSpace: "nowrap",
  },
  cardActions: { display: "flex", flexDirection: "column", gap: 8, alignItems: "center" },
  iconBtn: {
    background: "none", border: "none", cursor: "pointer", fontSize: 20,
    padding: 4, lineHeight: 1,
  },
  bottomButtons: {
    display: "flex", flexDirection: "column", gap: 10, marginTop: 16,
  },
  dislikeBtn: {
    display: "block", width: "100%", padding: "14px",
    background: "rgba(255,59,48,0.08)", border: "1.5px solid #FF3B30", borderRadius: 14,
    color: "#FF3B30", fontSize: 15, fontWeight: 600, cursor: "pointer",
    textAlign: "center",
  },
  skipBtn: {
    display: "block", width: "100%", padding: "14px",
    background: "none", border: "1.5px solid #007AFF", borderRadius: 14,
    color: "#007AFF", fontSize: 15, fontWeight: 600, cursor: "pointer",
    textAlign: "center",
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

  // Favorites Tab
  favContainer: { padding: "0 16px" },
  favCount: { fontSize: 13, color: "#8E8E93", marginBottom: 12, textAlign: "center" },
  favCard: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    background: "#fff", borderRadius: 14, padding: "16px",
    marginBottom: 10, boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
  },
  favName: { fontSize: 20, fontWeight: 600, color: "#1C1C1E" },
  favFullName: { fontSize: 13, color: "#8E8E93", marginTop: 2 },
  favMeta: { marginTop: 8, display: "flex", alignItems: "center" },
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
    borderTop: "0.5px solid #C6C6C8", padding: "8px 0 28px", zIndex: 200,
  },
  tabItem: {
    display: "flex", flexDirection: "column", alignItems: "center",
    background: "none", border: "none", cursor: "pointer", padding: "4px 16px",
    transition: "color 0.2s",
  },
};
