import { useState, useEffect, useCallback, useRef } from "react";
import { fbGet, fbSet, fbRemove, fbListen } from "./firebase.js";

// ============================================================
// NAME DATABASE - 2000+ names
// Format: [name, origin] where origin: i=Indian, a=Arabic/Persian, f=African, k=Korean, g=Global/Other
// ============================================================
const RAW_NAMES = {
  i0: `Avinash,Arinav,Avni,Abhinav,Ayan,Arunesh,Aviraj,Avirath,Adhidev,Advik,Amara,Amaro,Amato,Amay,Amitav,Amrit,Ankur,Archan,Arihan,Arihant,Arnav,Arun,Ashvin,Avani,Avikram,Avir,Avnish,Mehan,Rayan,Rishin,Roshan,Sarvin,Suvidh,Veeraj,Vikrit,Abeer,Abhay,Abheet,Abhijit,Abhijnan`.split(","),
  i1: `Abhik,Abhilash,Abhimand,Abhineet,Abhir,Abhiram,Abhirath,Abhirup,Abhisek,Abhoy,Abhyuday,Achint,Achintya,Achir,Achyut,Adarsh,Adesh,Adhir,Adhiraj,Adhish,Adhrit,Adhvan,Adhvik,Adhyant,Adinath,Adit,Adith,Aditya,Adrit,Adrith,Advait,Advay,Adyant,Agastya,Agneya,Agni,Agniv,Agraj,Agrim,Ahil`.split(","),
  i2: `Ahilan,Ahvan,Ajay,Ajeet,Ajinkya,Ajit,Ajitesh,Akash,Akhil,Akrit,Akshaj,Akshan,Akshar,Akshat,Akshay,Akshit,Akul,Alankrit,Alok,Aman,Amar,Amarjit,Amartya,Ambar,Ambuj,Amey,Amin,Amish,Amit,Amlan,Amod,Amogh,Amol,Amresh,Amrish,Amulya,Anagh,Anand,Anant,Ananth`.split(","),
  i3: `Anav,Anay,Angad,Angiras,Anik,Animesh,Anirban,Anirvan,Ankit,Anmol,Anoop,Anshik,Anshu,Anshul,Anshuman,Antim,Anubhav,Anukalp,Anupam,Anurag,Anuvrat,Apramey,Apurv,Aradhya,Aranyak,Aravind,Archish,Archit,Ardhan,Aresh,Arham,Arhan,Arijit,Arik,Arin,Arindam,Arish,Arishrav,Arjav,Arjit`.split(","),
  i4: `Arkav,Arkesh,Arman,Arnab,Arnesh,Arpit,Arshik,Artham,Arthav,Arush,Arvan,Arvid,Arvind,Ashish,Ashok,Ashrav,Ashrit,Ashmit,Ashutosh,Ashvat,Ashvir,Atharv,Atharvan,Athishay,Atiksh,Atish,Atman,Atmadev,Atreya,Atul,Atulya,Avdesh,Avdhesh,Avdhut,Avighna,Avijit,Avijot,Avikesh,Avikalp,Avikshit`.split(","),
  i5: `Avilash,Avimukt,Aviral,Avirup,Avish,Avishkar,Avitaj,Avitej,Avjit,Avjot,Avkash,Avkrit,Avleen,Avlok,Avneet,Avnidh,Avrit,Avtej,Avtesh,Avyan,Avyansh,Avyay,Avyukt,Avyukth,Axat,Ayankrit,Ayansh,Ayojan,Ayush,Badal,Bharat,Bhavin,Bodhi,Brijesh,Chandan,Chetan,Chinmay,Chirag,Daksh,Darsh`.split(","),
  i6: `Darshil,Dev,Devaj,Devang,Devansh,Dhairya,Dhanush,Dhruv,Diyan,Divit,Druv,Druvin,Ekansh,Eshan,Falgun,Garvit,Gaurav,Girish,Govind,Gunvir,Hari,Hardik,Harsh,Hemang,Hemant,Hiten,Jai,Jayant,Jayesh,Jivin,Kabir,Kairav,Kaivalya,Kalash,Kalpit,Kamesh,Kanav,Kanish,Kanishk,Kapish`.split(","),
  i7: `Kartik,Kashyap,Kaushal,Kavish,Kavyam,Keshav,Kethan,Keval,Kiran,Kirtan,Kishore,Koushik,Kovidh,Krishiv,Krish,Kunal,Kundan,Kunesh,Kushan,Kushagr,Kushant,Laksh,Lakshit,Lokesh,Madhav,Madhur,Madhurav,Mahavir,Mainak,Makarand,Malhar,Manan,Manav,Manish,Mangal,Manojit,Manveer,Manvith,Maulik,Mayank`.split(","),
  i8: `Mayansh,Mayur,Mihir,Milap,Milind,Mitesh,Mitransh,Mithilesh,Moksh,Mokshit,Mohan,Mrigank,Mudit,Mukul,Mukund,Naman,Namit,Naveen,Navik,Neeraj,Neil,Nikhil,Nimish,Nipun,Nirav,Nirmal,Nishant,Niyam,Ojas,Ojasvi,Om,Omkar,Pankaj,Param,Paresh,Parth,Pavan,Pinak,Prabal,Prajit`.split(","),
  i9: `Prakrit,Pranav,Pranit,Prasad,Pratham,Pratik,Pravin,Prithvi,Pritam,Pulkit,Pushkar,Rachit,Raghav,Raghuv,Raj,Rajat,Rajveer,Rajvir,Rakshit,Ramesh,Ramik,Ranbir,Ranjit,Rangav,Ranvir,Rasik,Rashmit,Raunak,Ravi,Ravikrit,Ravish,Reyansh,Rian,Ridhan,Rishabh,Rishi,Ritesh,Rituparn,Ritvik,Rochak`.split(","),
  i10: `Rohak,Rohit,Ropesh,Roshik,Ruchir,Rudhir,Rudra,Rudransh,Ruhin,Rupak,Rushil,Rushabh,Sachin,Sachidh,Sahaj,Sahil,Saket,Samar,Samarth,Sameer,Samidh,Samprit,Sambhav,Sanchit,Sandeep,Sanjit,Santosh,Sarthak,Sarvit,Satish,Satvik,Shalin,Shamik,Sharad,Shardul,Sharvil,Shashank,Shekhar,Shivam,Shivansh`.split(","),
  i11: `Shravan,Shresth,Shreyash,Shreyas,Shubham,Siddhesh,Siddh,Siddhanth,Soham,Soumil,Subash,Subir,Sudhir,Sumant,Sumedh,Sumit,Sunrit,Suprit,Suraj,Surya,Swaraj,Taksh,Tamish,Tanay,Tanish,Tapan,Tarun,Tejas,Tejvir,Trilok,Tushar,Uday,Ujash,Ujjwal,Umang,Utkarsh,Vaidik,Vaibhav,Vajrit,Vandish`.split(","),
  i12: `Vanraj,Varadh,Vardhan,Vardhit,Varen,Varish,Varun,Vasanth,Vatsal,Ved,Vedant,Vedansh,Veer,Vibhav,Vidyut,Vihrit,Vijeth,Vikram,Vikrant,Vimal,Vinay,Vineet,Vinesh,Vinit,Vir,Viraj,Viresh,Vishak,Vishrit,Vishrut,Vivek,Vivrit,Yajat,Yash,Yuvan,Avinay,Avindra,Avijay,Avikant,Avijeet`.split(","),
  i13: `Avitesh,Avishar,Avileen,Avikrant,Avitark,Avnidhar,Avijval,Aviketh,Avitav,Avigyan,Avijnan,Avikash,Arindham,Arishan,Arjitav,Arnivash,Arnavish,Arishdev,Arjunvir,Arindav,Arjitmay,Arhamvir,Arinkrit,Arjitnam,Arunkrit,Arinman,Arindra,Arishant,Arnavraj,Arpanvir,Arishvir,Amritdev,Amoghraj,Ameydev,Amoghvir,Amritesh,Amolak,Amvir,Amritpal,Amritkrit`.split(","),
  i14: `Amoghdhar,Amritvan,Ameyraj,Ambarish,Adambir,Adhyapan,Advikam,Agnikesh,Ahankrit,Akhyansh,Amardeep,Ambikvir,Anandvir,Anantdev,Anashvar,Ankurvir,Antarman,Archakam,Atharvish,Athisvir,Atishveer,Atmabodh,Avadhvir,Avyaydev,Ayandev,Ayanesh,Ayantej,Ayanvir,Ayamrit,Adhinav,Adhimukt,Adishvar,Advayam,Agnikrant,Ahirvad,Ajayanth,Akhilnath,Anandmay,Anantpur,Anantrup`.split(","),
  i15: `Aneekrit,Anshvit,Anugyam,Apurvansh,Arimardh,Balvir,Bharatram,Bhuvanesh,Brahmdev,Chanakya,Chandresh,Chiragjit,Dakshraj,Darpanvir,Devprit,Dhanvir,Dhruvraj,Divyesh,Druvansh,Eklavya,Gauravjit,Girivir,Gopalvir,Gunavir,Harivir,Hemkrit,Hridyesh,Indravir,Jagdish,Jaiveer,Janakraj,Jashvir,Jayakrit,Jinveer,Jivakrit,Jyotirish,Kalashvir,Kamdevraj,Kashvir,Kavindra`.split(","),
  i16: `Kedarvir,Keshabh,Kishenvir,Kokilvir,Kundanvir,Lakshraj,Lokprit,Madhavraj,Malkhan,Manvikram,Medhavir,Meghdut,Mohanjit,Mokshvir,Nakshatr,Nalinvir,Narindra,Navjit,Neelkanth,Nikhilvir,Nirantar,Nishkarsh,Nrisimha,Ojasvir,Padmajit,Parakram,Parikshat,Pavankrit,Prabhakar,Pradyumna,Prajvalan,Pranalvir,Prantosha,Pratapvir,Prayagraj,Purnvir,Pushpraj,Rachitdev,Rajvikram,Ramkrit`.split(","),
  i17: `Ranbankur,Ranvijay,Ratnavir,Ravindra,Riddhiman,Rochakdev,Rohanvir,Rukmangad,Sachidev,Sagarjit,Sahajdev,Samritvir,Sanatkrit,Sandipvir,Sarvjit,Shankvir,Sidhvir,Somadev,Subhkrit,Sumanvir,Suryakant,Suryavir,Tapasvir,Tarinvir,Tejashvir,Tribhuvan,Tusharvir,Udayraj,Ujjvaljit,Vajravir,Vanavir,Vibhorvir,Vidhyut,Vijaydev,Vikashdev,Vipulvir,Vishwajit,Vivekjit,Vrindavan,Yajnavir`.split(","),
  i18: `Yamunvir,Yogeshvir,Yudhvir,Yuvrajvir,Avantik,Avdhutesh,Avhijit,Avishkant,Avneetpal,Avrindra,Avtarjit,Avyaktam,Arjitraj,Arkeshvir,Arnabdev,Arnavdev,Arpanraj,Arthvir,Arunraj,Arushdev,Arvindraj,Ameyatman,Amoghdev,Amritraj,Bhadra,Bhanu,Bhavesh,Bheem,Bhishma,Bijal,Bindu,Birbal,Bodhan,Brahm,Chaitanya,Champak,Chandran,Chapal,Charak,Charvik`.split(","),
  i19: `Chetanvir,Chintan,Daman,Darpan,Dayaram,Deepak,Deval,Devdan,Devkrit,Dhaval,Dhimant,Dhriti,Ekadant,Ekaraj,Ekbal,Elangesh,Gandharv,Gaurish,Ghanvir,Gokarn,Gopalkrit,Gulab,Gunakar,Gurudatt,Gyandev,Haimavat,Hansraj,Harekrit,Harihar,Hemkant,Himayu,Hiranyak,Ilakrit,Indranil,Inesh,Jagmeet,Jaimal,Jalaj,Janak,Jashith`.split(","),
  i20: `Jayaram,Jheelan,Jitendra,Joginder,Kaladhar,Kamban,Kamran,Kangkan,Kankana,Kantilal,Kapildev,Karthikey,Kashvant,Kayamkrit,Kedarnath,Keshivir,Ketav,Khajan,Khatrivir,Kirtiman,Kolahit,Kridhan,Kuladhar,Kumarjit,Kusumraj,Lavkush,Lokraj,Mahabir,Mahipal,Majeet,Malvinder,Manasvin,Mandvir,Mangesh,Manohar,Manthan,Meghanath,Meghvir,Mohinder,Mukutraj`.split(","),
  i21: `Nabhkrit,Nakulraj,Nandish,Navkiran,Nilambar,Nirbhav,Nishan,Nripal,Padrajan,Panchvir,Panditraj,Paramvir,Paritosh,Pavankirt,Prashikh,Premvir,Pundalik,Pushpan,Raghunath,Rajhans,Rajneesh,Rajnish,Ramdhar,Ramjit,Randhir,Ratanvir,Ravindhar,Ribhukrit,Rijvan,Rituraj,Rochaman,Rudravir,Rupinder,Sahasra,Sambodhi,Sangamvir,Sanyam,Senajit,Sharavir,Shreshtha`.split(","),
  i22: `Shrinavas,Sivakrit,Somvir,Subodhan,Suchitrav,Sukhvir,Sureshvir,Tanmaydev,Tarakrit,Tattvajit,Thakurvir,Todarmal,Uddhavjit,Ugravir,Unmeshvir,Uttamvir,Vanmali,Vedavrit,Vijudev,Vinayvir,Vishvadev,Vrajesh,Vyomvir,Yagnesh,Yamahit,Yashovir,Yatinkrit,Yoganand,Yuktivir,Zarivir,Avnay,Avdhar,Avjay,Avlesh,Avmit,Avnir,Avprit,Avran,Avsan,Avtan`.split(","),
  i23: `Ariav,Arindh,Arjay,Arkam,Arnish,Artav,Amnay,Amprit,Amlav,Amvan,Amjay,Amkrit,Adnav,Adkrit,Advan,Adraj,Adnir,Adlav,Adrish,Aknav,Aknir,Aklav,Akdhar,Akraj,Akvan,Akjit,Ashnav,Ashnir,Ashdhar,Ashraj,Ashvan,Ashjit,Ashkrit,Annav,Annir,Andhar,Anraj,Anvan,Anjit,Ankrit`.split(","),
  i24: `Anlav,Atnav,Atnir,Atdhar,Atraj,Atvan,Atjit,Atkrit,Aynav,Aynir,Aydhar,Ayraj,Ayvan,Ayjit,Aykrit,Devnav,Devnir,Devraj,Devvan,Harnav,Harnir,Harkrit,Harraj,Harvan,Jagnav,Jagnir,Jagkrit,Jagraj,Jagvan,Kalnav,Kalnir,Kalkrit,Kalraj,Kalvan,Mannav,Mannir,Mankrit,Manraj,Manvan,Navnir`.split(","),
  i25: `Navkrit,Navraj,Navvan,Navdhar,Rajnav,Rajnir,Rajkrit,Rajvan,Rajdhar,Surnav,Surnir,Surkrit,Surraj,Survan,Vednav,Vednir,Vedkrit,Vedraj,Vedvan,Avan,Avash,Avesh,Avin,Avit,Avik,Avaj,Avant,Avith,Avim,Avam,Avut,Avnit,Avdev,Avraj,Avvir,Avpal,Avnav,Avrup,Avvar,Avtav`.split(","),
  i26: `Avvin,Avram,Avman,Avek,Avil,Avarth,Avayan,Arav,Arash,Arir,Arit,Araj,Arant,Arith,Arim,Aram,Arrit,Arnit,Ardev,Arraj,Arvir,Ardhar,Arrup,Arvar,Arvin,Arram,Arek,Arayan,Amav,Amash,Amesh,Amik,Amaj,Amant,Amith,Amim,Amnit,Amdev,Amraj,Amnav`.split(","),
  i27: `Amdhar,Amjit,Amrup,Amvar,Amtav,Amvin,Amram,Amman,Amek,Amayan,Adav,Adash,Adin,Adir,Adik,Adant,Adnit,Addev,Advir,Addhar,Adjit,Adrup,Anash,Anesh,Anir,Anit,Anaj,Anith,Anrit,Annit,Andev,Anvir,Anrup,Anvin,Anek,Anayan,Ashav,Ashin,Ashir,Ashit`.split(","),
  i28: `Ashik,Ashant,Ashith,Ashdev,Ashek,Akav,Akesh,Akin,Akir,Akit,Akik,Akant,Akith,Akdev,Akvir,Akrup,Akvin,Ayav,Ayash,Ayesh,Ayin,Ayir,Ayit,Ayik,Ayant,Ayith,Ayrit,Aydev,Ayvir,Ayvin,Ayayan,Atav,Atash,Atesh,Atin,Atir,Atit,Atik,Atant,Atith`.split(","),
  i29: `Atdev,Atvir,Atvin,Ajav,Ajash,Ajesh,Ajin,Ajir,Ajik,Ajant,Ajith,Ajdev,Ajraj,Ajvir,Ajnav,Ajjit,Abhav,Abhash,Abhin,Abhit,Abhant,Abhith,Abhdev,Abhraj,Abhvir,Abhnav,Abhjit,Abhvin,Abhek,Devash,Devesh,Devin,Devir,Devit,Devik,Devant,Devith,Devvir,Devjit,Devrup`.split(","),
  i30: `Devvin,Harash,Haresh,Harin,Harir,Harit,Harik,Harant,Harith,Hardev,Harvir,Harjit,Harvin,Kalesh,Kalin,Kalir,Kalit,Kalik,Kalant,Kalith,Kaldev,Kalvir,Kaljit,Manash,Manesh,Manin,Manir,Manit,Manik,Manant,Manith,Mandev,Manvir,Manjit,Navash,Navesh,Navin,Navir,Navit,Navant`.split(","),
  i31: `Navith,Navdev,Navvir,Navvin,Navek,Rajash,Rajesh,Rajin,Rajir,Rajit,Rajik,Rajant,Rajith,Rajdev,Rajjit,Rajvin,Surash,Suresh,Surin,Surir,Surit,Surik,Surant,Surith,Surdev,Survir,Surjit,Vedash,Vedesh,Vedin,Vedir,Vedit,Vedik,Vedith,Veddev,Vedvir,Vedjit,Vikash,Vikesh,Vikin`.split(","),
  i32: `Vikir,Vikit,Vikant,Vikith,Vikdev,Vikraj,Vikvir,Viknav,Vikjit,Virash,Virin,Virit,Virik,Virant,Virith,Virdev,Virraj,Virjit,Kirash,Kiresh,Kirin,Kirir,Kirit,Kirik,Kirant,Kirith,Kirdev,Kirraj,Kirvir,Kirnav,Kirjit,Rinav,Rinash,Rinesh,Rinit,Rinik,Rindev,Rinraj,Rinvir,Rinnav`.split(","),
  i33: `Rinjit,Sarav,Sarash,Saresh,Sarin,Sarir,Sarit,Sarik,Sarant,Sarith,Sardev,Sarraj,Sarvir,Sarnav,Sarjit,Samav,Samash,Samesh,Samin,Samit,Samik,Samant,Samith,Samdev,Samraj,Samvir,Samnav,Samjit,Sidash,Sidesh,Sidin,Sidir,Sidit,Sidik,Sidant,Sidith,Siddev,Sidraj,Sidvir,Sidnav`.split(","),
  i34: `Sidjit,Mohin,Mohir,Mohit,Mohik,Mohant,Mohith,Mohdev,Mohraj,Mohvir,Mohnav,Mohjit,Rokash,Rokesh,Rokin,Rokir,Rokit,Rokik,Rokant,Rokdev,Rokraj,Rokvir,Rudin,Rudir,Rudit,Rudik,Rudant,Rudith,Ruddev,Rudraj,Rudvir,Rudnav,Rudjit,Pravir,Pradev,Pratav,Pradish,Pramish,Pravish,Prakash`.split(","),
  i35: `Pravash,Pratan,Shresh,Shrish,Shrivan,Kushav,Kushit,Kushik,Kushal,Kushraj,Kushvir,Niran,Nirit,Nirik,Nirant,Niresh,Nirish,Nirvir,Nirjit,Nirdhar,Nirman,Nirvan,Dhrishta,Tanav,Tanuj,Tanvir,Tanmav,Tanesh,Tanvik,Rupesh,Rupin,Rupik,Rupant,Rupdev,Rupraj,Rupvir,Lokin,Lokit,Lokant,Lokdev`.split(","),
  i36: `Lokvir,Loknath,Bhargav,Bhaskar,Bhupati,Chandak,Chandrash,Charanvir,Darshan,Dayakrit,Deepansh,Devdutt,Devrath,Dharamvir,Dheemant,Digjit,Dinakar,Dipankar,Divyansh,Ekagra,Ekchit,Ethan,Farhan,Gajanan,Girivan,Gokulesh,Gyanesh,Harikesh,Harishvar,Hemraj,Hemvir,Himanshu,Idhant,Indresh,Jaivant,Jalesh,Janvir,Jayakant,Jitesh,Jotsna`.split(","),
  i37: `Kamalesh,Kamdhar,Kamvir,Kanvir,Karnavir,Kartavya,Kavindh,Ketankrit,Kinshuk,Kishorvir,Lavkrit,Mahakrit,Maheshvar,Mahiraj,Malkrit,Manaskrit,Mandarvir,Mantravir,Meghnath,Milankrit,Mitvir,Mohindar,Nagarjit,Nagvir,Narendh,Narottam,Navindh,Navjot,Neelakrit,Niharvir,Nirmit,Nritya,Ojaskrit,Omvir,Padmavir,Pahlaj,Palmit,Paramjit,Paravir,Pavanjit`.split(","),
  i38: `Pilakrit,Prabhjit,Pradhit,Prajval,Pranakrit,Prashvir,Prayukh,Punarvir,Raginath,Rajindh,Ranajit,Ranchit,Rangvir,Rashvir,Ripujit,Ritivir,Rochvir,Rohankrit,Roshvir,Rujavir,Rupkrit,Saindhav,Sajkrit,Samrith,Sandvir,Santakrit,Saptakrit,Saravkrit,Sarvakrit,Satgur,Shanakrit,Shashvir,Shubhvir,Sidakrit,Sindhuraj,Somakrit,Sthankrit,Sudhakrit,Sukhjit,Sunkrit`.split(","),
  i39: `Suprith,Surakvir,Tarkrit,Udakrit,Ujvalkrit,Umakrit,Upakrit,Urjavir,Ushakrit,Vajrakrit,Valkrit,Vanakrit,Varkrit,Vasukrit,Vicharvir,Vidyavir,Vijvir,Vireshvar,Vriddhit,Yajvir,Yamkrit,Yogvir,Yuvakrit,Bhavkrit,Bijvir,Brahmvir,Chaitvir,Charuvir,Chittvir,Darpvir,Devakrit,Dhankrit,Divakrit,Gajavir,Ganvir,Giriraj,Gunakrit,Harikrit,Himvir,Indrakrit`.split(","),
  i40: `Jayvir,Jnankrit,Kalpvir,Karankrit,Kavikrit,Keertivir,Kishanvir,Krishvir,Kumarvir,Lajvir,Mahavkrit,Makarvir,Mativir,Medhvir,Mitrakrit,Nabhovir,Nandvir,Nilkrit,Omakrit,Parmvir,Pavkrit,Pitrakrit,Pranvir,Pritvir,Pujvir,Rachnavir,Ratnvir,Rushivir,Sahvir,Santvir,Sarvvir,Shivkrit,Sukrit,Sunakrit,Tejavir,Udayvir,Umavir,Vayvir,Vidhivir,Vimalkrit`.split(","),
  i41: `Vishvir,Yashvir,Avrant,Avkant,Avdhan,Avrish,Avlav,Avkesh,Avdip,Avmesh,Avnesh,Avsher,Arkrit,Arnir,Ardip,Arpav,Arsan,Artan,Arlav,Arvesh,Arsher,Armit,Amnir,Amsan,Amtan,Amnesh,Amsher,Amdip,Admir,Akmit,Atrak,Aymir,Aylav,Devmit,Devlav,Devsan,Devtan,Harmit,Harlav,Manlav`.split(","),
  i42: `Mantan,Mansan,Navlav,Navtan,Navmit,Navdip,Rajlav,Rajtan,Rajmit,Rajdip,Sarnir,Sarkrit,Sarlav,Sarmit,Vedlav,Vedtan,Vedmit,Veddip,Kaltan,Sunav,Sunir,Sulav,Sudan,Sutan,Jaykrit,Jaylav,Jaytan,Jayraj,Jaynav,Avirit,Avurit,Avarit,Avinrit,Avunrit,Avarrit,Avinit,Avunit,Avanit,Avinnit,Avunnit`.split(","),
  i43: `Avarnit,Avimit,Avumit,Avamit,Avinmit,Avunmit,Avarmit,Avidev,Avudev,Avadev,Avindev,Avundev,Avardev,Avuraj,Avaraj,Avinraj,Avunraj,Avarraj,Avivir,Avuvir,Avavir,Avinvir,Avunvir,Avarvir,Avinav,Avunav,Avanav,Avinnav,Avunnav,Avarnav,Avidhar,Avudhar,Avadhar,Avindhar,Avundhar,Avardhar,Avujit,Avajit,Avinjit,Avunjit`.split(","),
  i44: `Avarjit,Avikrit,Avukrit,Avakrit,Avinkrit,Avunkrit,Avarkrit,Avurup,Avarup,Avinrup,Avunrup,Avarrup,Avivar,Avuvar,Avavar,Avinvar,Avunvar,Avarvar,Avutav,Avatav,Avintav,Avuntav,Avartav,Avivin,Avuvin,Avavin,Avinvin,Avunvin,Avarvin,Aviram,Avuram,Avaram,Avinram,Avunram,Avarram,Aviman,Avuman,Avaman,Avinman,Avunman`.split(","),
  i45: `Avarman,Avipal,Avupal,Avapal,Avinpal,Avunpal,Avarpal,Avivan,Avuvan,Avavan,Avinvan,Avunvan,Avarvan,Aviek,Avuek,Avaek,Avinek,Avunek,Avarek,Aviant,Avuant,Avinant,Avunant,Avarant,Aviish,Avuish,Avaish,Avinish,Avunish`.split(","),
  a0: `Amina,Amir,Ashar,Rafi,Rehan,Adil,Adnan,Ahsan,Akram,Alim,Anwar,Arif,Ashraf,Azim,Aziz,Bashir,Bilal,Cyrus,Dara,Ehsan,Faisal,Faraz,Farid,Hafiz,Hamid,Hamza,Haris,Hasan,Idris,Imran,Iqbal,Jalal,Junaid,Kamil,Karim,Khalid,Khalil,Latif,Luqman,Mahir`.split(","),
  a1: `Malik,Mansur,Mazin,Mirza,Murad,Nabil,Nadir,Nasim,Navid,Omid,Qadir,Rahim,Rafiq,Rashid,Saif,Salim,Samir,Sharif,Sultan,Tahir,Tariq,Wahid,Yusuf,Zafar,Zahir,Zaid`.split(","),
  g0: `Kenzo,Anthon,Ragnar,Rowan,Valrik,Alaric,Ambrose,Anders,Anton,Arturo,Aurelio,Bastian,Benicio,Bjorn,Blaise,Bram,Bruno,Callum,Caspian,Cedric,Cillian,Corbin,Cormac,Cosimo,Dante,Dashiel,Declan,Dimitri,Dorian,Eero,Elio,Emil,Enzo,Evander,Fabian,Felix,Florian,Flynn,Gideon,Griffin`.split(","),
  g1: `Hadrian,Halcyon,Hector,Henrik,Holden,Hugo,Iker,Inigo,Ivar,Jasper,Joaquin,Kai,Kairo,Kellan,Kieran,Lars,Leander,Lennox,Leon,Lionel,Lorcan,Luca,Lucian,Magnus,Marcel,Marco,Matteo,Milo,Miro,Nico,Nikolai,Nils,Noel,Odin,Orion,Oscar,Otto,Pascal,Percival,Rafael`.split(","),
  g2: `Rainer,Raphael,Remy,Ren,Renzo,Rio,Roland,Roman,Ronan,Saxon,Silas,Silvio,Soren,Stellan,Thane,Theo,Tobias,Tristan,Viggo,Viktor,Willem,Xavi,Yohan,Zander,Zen`.split(","),
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
  addNames(RAW_NAMES.i6, "Indian", false);
  addNames(RAW_NAMES.i7, "Indian", false);
  addNames(RAW_NAMES.i8, "Indian", false);
  addNames(RAW_NAMES.i9, "Indian", false);
  addNames(RAW_NAMES.i10, "Indian", false);
  addNames(RAW_NAMES.i11, "Indian", false);
  addNames(RAW_NAMES.i12, "Indian", true);
  addNames(RAW_NAMES.i13, "Indian", true);
  addNames(RAW_NAMES.i14, "Indian", true);
  addNames(RAW_NAMES.i15, "Indian", true);
  addNames(RAW_NAMES.i16, "Indian", false);
  addNames(RAW_NAMES.i17, "Indian", false);
  addNames(RAW_NAMES.i18, "Indian", true);
  addNames(RAW_NAMES.i19, "Indian", false);
  addNames(RAW_NAMES.i20, "Indian", false);
  addNames(RAW_NAMES.i21, "Indian", false);
  addNames(RAW_NAMES.i22, "Indian", true);
  addNames(RAW_NAMES.i23, "Indian", true);
  addNames(RAW_NAMES.i24, "Indian", true);
  addNames(RAW_NAMES.i25, "Indian", true);
  addNames(RAW_NAMES.i26, "Indian", true);
  addNames(RAW_NAMES.i27, "Indian", true);
  addNames(RAW_NAMES.i28, "Indian", true);
  addNames(RAW_NAMES.i29, "Indian", true);
  addNames(RAW_NAMES.i30, "Indian", false);
  addNames(RAW_NAMES.i31, "Indian", false);
  addNames(RAW_NAMES.i32, "Indian", false);
  addNames(RAW_NAMES.i33, "Indian", false);
  addNames(RAW_NAMES.i34, "Indian", false);
  addNames(RAW_NAMES.i35, "Indian", false);
  addNames(RAW_NAMES.i36, "Indian", false);
  addNames(RAW_NAMES.i37, "Indian", false);
  addNames(RAW_NAMES.i38, "Indian", false);
  addNames(RAW_NAMES.i39, "Indian", false);
  addNames(RAW_NAMES.i40, "Indian", false);
  addNames(RAW_NAMES.i41, "Indian", true);
  addNames(RAW_NAMES.i42, "Indian", true);
  addNames(RAW_NAMES.i43, "Indian", true);
  addNames(RAW_NAMES.i44, "Indian", true);
  addNames(RAW_NAMES.i45, "Indian", true);
  addNames(RAW_NAMES.a0, "Arabic/Persian", true);
  addNames(RAW_NAMES.a1, "Arabic/Persian", false);
  addNames(RAW_NAMES.g0, "Global", true);
  addNames(RAW_NAMES.g1, "Global", false);
  addNames(RAW_NAMES.g2, "Global", false);

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
        const DB_VERSION = 3;
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
