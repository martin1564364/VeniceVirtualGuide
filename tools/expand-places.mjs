import { writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SOURCE_PATH = path.join(ROOT, "content", "places.source.json");

const places = [
  {
    id: "st-marks-square",
    order: 1,
    coords: { lat: 45.4341, lng: 12.3388 },
    pl: {
      name: "Plac Swietego Marka",
      tagline: "Salon Europy",
      text: "Stoicie na jedynym placu w Wenecji, ktory nosi nazwe piazza. Kazdy inny plac w miescie to campo. Przez ponad tysiac lat to miejsce bylo wielka scena republiki: tu przechodzily procesje, tu wladza pokazywala swoj przepych, a pod arkadami spotykali sie kupcy, pielgrzymi i ciekawscy przybysze.\n\nRozejrzyjcie sie powoli. Z jednej strony blyszczy Bazylika swietego Marka, z drugiej stoja dlugie skrzydla dawnych prokuracji, czyli urzedow najwazniejszych ludzi republiki. Napoleon mial nazwac ten plac salonem Europy i latwo zrozumiec dlaczego: wszystko jest tu ustawione jak dekoracja teatralna.\n\nPlac ma tez praktyczna tajemnice. Lezy bardzo nisko, dlatego podczas acqua alta woda potrafi wyplynac przez odpływy i zamienic kamienna posadzke w plytkie lustro. Najlepiej przejsc sie wzdluz arkad, posluchac kawiarnianych orkiestr i wyobrazic sobie, ze przez chwile stoicie w sercu dawnej morskiej potegi.",
    },
    en: {
      name: "St Mark's Square",
      tagline: "The Drawing Room of Europe",
      text: "You are standing in the only true piazza in Venice. Every other square in the city is called a campo. For more than a thousand years this open space was the grand stage of the republic: processions crossed it, rulers displayed their power here, and merchants, pilgrims, musicians, and visitors met beneath the arcades.\n\nLook around slowly. On one side, St Mark's Basilica glitters with domes and mosaics. Around the square stretch the long Procuratie, once offices and residences for some of Venice's most important officials. Napoleon is said to have called this place the drawing room of Europe, and the phrase still fits: the whole square feels arranged like a theatre set.\n\nThere is also a practical secret under your feet. The piazza lies very low, so during acqua alta, high water can rise through the drains and turn the paving stones into a shallow mirror. Walk along the arcades, listen for the cafe orchestras, and imagine standing at the centre of a republic that once ruled the sea.",
    },
  },
  {
    id: "st-marks-basilica",
    order: 2,
    coords: { lat: 45.4346, lng: 12.3397 },
    pl: {
      name: "Bazylika swietego Marka",
      tagline: "Zloto, mozaiki i morska republika",
      text: "Bazylika swietego Marka nie wyglada jak zwykly kosciol zachodniej Europy. Jej kopuly, marmury i zlote mozaiki przypominaja raczej Konstantynopol, bo Wenecja przez stulecia patrzyla na wschod. Kupcy wracali z Bizancjum z towarami, pomyslami i artystami, a republika zamienila te wplywy w swoj najbardziej rozpoznawalny symbol.\n\nLegenda mowi, ze relikwie swietego Marka przywieziono do Wenecji z Aleksandrii w IX wieku, ukryte pod wieprzowina, aby ominac kontrole. Dla miasta byl to skarb polityczny i duchowy: wlasny patron, wlasna opowiesc, wlasne miejsce w historii chrzescijanstwa.\n\nPrzed fasada warto zwrocic uwage na konie nad wejsciem. Oryginalne rzezby trafily do Wenecji po zdobyciu Konstantynopola w 1204 roku. Dzisiejsze konie na zewnatrz to kopie, ale ich historia nadal przypomina, ze Wenecja byla piekna, pobozna i bardzo skuteczna w zbieraniu trofeow.",
    },
    en: {
      name: "St Mark's Basilica",
      tagline: "Gold, Mosaics, and a Maritime Republic",
      text: "St Mark's Basilica does not look like a typical western European church. Its domes, marbles, and golden mosaics point east, toward Byzantium and Constantinople. For centuries Venice traded across the eastern Mediterranean, bringing back goods, ideas, artists, and architectural forms. The basilica turns all of that into one dazzling symbol.\n\nAccording to tradition, the relics of St Mark were brought from Alexandria in the ninth century, hidden under pork to avoid inspection. For Venice, this was more than a religious treasure. It gave the city its own patron, its own sacred story, and a powerful place in Christian history.\n\nBefore you enter, look at the horses above the main doorway. The originals came to Venice after the sack of Constantinople in 1204. The horses outside are copies today, but the story remains clear: Venice was beautiful, devout, and extremely good at collecting trophies from the wider world.",
    },
  },
  {
    id: "doges-palace",
    order: 3,
    coords: { lat: 45.4337, lng: 12.3404 },
    pl: {
      name: "Palac Dozow",
      tagline: "Serce wladzy Republiki",
      text: "Palac Dozow byl jednoczesnie rezydencja, urzedem, sala sadowa i symbolem panstwa. To tutaj mieszkal doza, wybierany wladca Wenecji, ale nie byl on krollem. Republika bardzo pilnowala, aby zadna osoba nie stala sie zbyt silna. Wladza byla rozdzielona pomiedzy rady, urzednikow i skomplikowane procedury.\n\nZ zewnatrz palac wyglada niemal lekko: gotyckie arkady podtrzymuja wielka bryle z jasnego kamienia i rozowego marmuru. W srodku skala zmienia sie calkowicie. Sale sa ogromne, pelne obrazow, zlocen i scen pokazujacych Wenecje jako miasto wybrane przez historie.\n\nNajmocniejszy kontrast czeka po drugiej stronie. Z reprezentacyjnych sal przechodzi sie do wiezien, waskich korytarzy i cel. Palac przypomina, ze Wenecja potrafila zachwycac sztuka, ale rzadzila twardo i bardzo dokladnie.",
    },
    en: {
      name: "Doge's Palace",
      tagline: "The Republic's Seat of Power",
      text: "The Doge's Palace was a residence, government office, courtroom, and state symbol all at once. The doge lived here, but he was not a king. Venice worked hard to prevent any single person from becoming too powerful. Authority was shared through councils, officials, elections, and carefully designed rules.\n\nFrom the outside, the palace seems almost weightless. Gothic arcades support a broad mass of pale stone and pink marble, as if the building were floating beside the lagoon. Inside, the scale changes completely. The rooms are vast, covered with paintings, gilding, and scenes that present Venice as a city chosen by history.\n\nThe strongest contrast comes near the end of the visit. From ceremonial halls you pass toward prisons, narrow corridors, and cells. The palace reminds you that Venice could dazzle with beauty, but it governed with discipline, paperwork, and a very sharp sense of control.",
    },
  },
  {
    id: "bridge-of-sighs",
    order: 4,
    coords: { lat: 45.4340, lng: 12.3409 },
    pl: {
      name: "Most Westchnien",
      tagline: "Romantyczna nazwa, surowa historia",
      text: "Most Westchnien brzmi jak miejsce dla zakochanych, ale jego historia jest znacznie ciemniejsza. Laczy Palac Dozow z dawnym wiezieniem. Skazani przechodzili tedy z sal sadowych do cel, a przez male kamienne okna mogli po raz ostatni zobaczyc lagune i swiatlo Wenecji.\n\nNazwa stala sie popularna dopiero w epoce romantyzmu. Wyobrazano sobie, ze wiezniowie wzdychali na widok miasta, ktore opuszczali na zawsze. W rzeczywistosci wielu skazanych trafialo do cel na krotszy czas, ale obraz ostatniego spojrzenia okazal sie tak silny, ze zostal z mostem na stale.\n\nNajlepiej popatrzec na niego z Ponte della Paglia, przy nabrzezu. Bialy kamien, delikatna dekoracja i waski kanal tworza piekny widok. Wlasnie dlatego ten most jest tak wenecjanski: elegancka fasada ukrywa bardzo powazna opowiesc o prawie, karze i wolnosci.",
    },
    en: {
      name: "Bridge of Sighs",
      tagline: "A Romantic Name, a Severe Story",
      text: "The Bridge of Sighs sounds like a place for lovers, but its history is much darker. It links the Doge's Palace with the old prison. Prisoners crossed it after judgment, moving from the courtrooms toward their cells, and through the small stone windows they could glimpse the lagoon and the light of Venice.\n\nThe name became famous in the Romantic age. Writers imagined prisoners sighing as they saw the city for the last time. In reality, not every sentence was final or lifelong, but the image of one last look was so powerful that it stayed with the bridge forever.\n\nThe best view is from the Ponte della Paglia, beside the waterfront. White stone, delicate carving, and the narrow canal make a beautiful scene. That is what makes the bridge so Venetian: an elegant surface hiding a serious story about law, punishment, and freedom.",
    },
  },
  {
    id: "campanile-di-san-marco",
    order: 5,
    coords: { lat: 45.4340, lng: 12.3390 },
    pl: {
      name: "Campanile di San Marco",
      tagline: "Dzwonnica, ktora wrocila",
      text: "Campanile swietego Marka jest najlatwiejszym punktem orientacyjnym w Wenecji. Ceglana wieza ma prawie sto metrow wysokosci i przez wieki sluzyl nie tylko jako dzwonnica, lecz takze jako znak dla statkow wplywajacych do laguny.\n\nTo, co widzicie, nie jest jednak sredniowiecznym oryginalem. W 1902 roku stara wieza nagle runela. Wenecjanie mieli szczescie: zginelo bardzo niewiele stworzen, a bazylika zostala ocalona. Decyzja zapadla szybko: odbudowac tam, gdzie byla, i taka, jaka byla. Wloskie haslo brzmialo dov'era e com'era.\n\nWjazd na gore daje jedna z najlepszych lekcji geografii miasta. Zamiast labiryntu ulic widac cala lagune: dachy Wenecji, Giudecce, San Giorgio, Lido i dalekie wyspy. Nagle staje sie jasne, ze Wenecja nie jest tylko miastem kanalow, ale stolica wodnego krajobrazu.",
    },
    en: {
      name: "Campanile di San Marco",
      tagline: "The Bell Tower That Returned",
      text: "The Campanile of St Mark is the easiest landmark in Venice. The brick tower rises almost one hundred metres and served for centuries not only as a bell tower, but also as a signal point for ships entering the lagoon.\n\nWhat you see is not the medieval original. In 1902 the old tower suddenly collapsed. Venice was lucky: very little life was lost, and the basilica survived. The decision was made quickly: rebuild it where it was and as it was. The Italian phrase was dov'era e com'era.\n\nGoing to the top gives one of the best geography lessons in the city. Instead of a maze of alleys, you see the whole lagoon: Venetian rooftops, Giudecca, San Giorgio, the Lido, and distant islands. Suddenly it becomes clear that Venice is not just a city of canals. It is the capital of a watery landscape.",
    },
  },
  {
    id: "st-marks-clock-tower",
    order: 6,
    coords: { lat: 45.4346, lng: 12.3386 },
    pl: {
      name: "Wieza Zegarowa swietego Marka",
      tagline: "Czas Republiki",
      text: "Wieza Zegarowa stoi przy wejsciu na Mercerie, glowna handlowa droge prowadzaca od Placu swietego Marka w strone Rialto. To nie byl przypadkowy adres. Kazdy, kto wchodzil do politycznego serca miasta, widzial, ze Wenecja kontroluje nie tylko handel i morze, ale takze czas.\n\nNa szczycie wiezy dwie brazowe postacie uderzaja w dzwon. Nazywa sie je Maurami, choc sa to raczej symboliczne figury straznikow czasu. Ponizej znajduje sie tarcza z godzinami, znakami zodiaku i fazami ksiezyca. Dla miasta kupcow taka wiedza byla bardzo praktyczna: przyplywy, podroze i umowy zalezne byly od kalendarza.\n\nZatrzymajcie sie na chwile pod lukiem. Pod wami plynie tlum, nad wami pracuje mechanizm, a wokol stoja sklepy. To dobra miniatura Wenecji: piekno, handel, astronomia i teatralny gest w jednym miejscu.",
    },
    en: {
      name: "St Mark's Clock Tower",
      tagline: "The Republic's Timekeeper",
      text: "The Clock Tower stands at the entrance to the Mercerie, the main shopping route from St Mark's Square toward Rialto. That position was not accidental. Everyone entering the political heart of Venice could see that the city controlled not only trade and the sea, but time itself.\n\nAt the top, two bronze figures strike the bell. They are called the Moors, though they are really symbolic guardians of time. Below them is a rich clock face showing hours, zodiac signs, and phases of the moon. For a city of merchants and sailors, that information was practical: tides, journeys, contracts, and feast days all depended on the calendar.\n\nPause beneath the arch. Crowds move below, the mechanism works above, and shops surround you. It is a perfect small version of Venice: beauty, commerce, astronomy, and theatrical display all compressed into one place.",
    },
  },
  {
    id: "museo-correr",
    order: 7,
    coords: { lat: 45.4339, lng: 12.3372 },
    pl: {
      name: "Museo Correr",
      tagline: "Historia Wenecji w palacu",
      text: "Museo Correr zajmuje skrzydlo Placu swietego Marka zwane napoleonskim. To dobre miejsce, aby zrozumiec Wenecje po cichu, z dala od tlumu stojacego przed bazylika. W salach muzeum znajduja sie mapy, obrazy, dokumenty, monety i przedmioty zwiazane z codziennym zyciem republiki.\n\nMuzeum powstalo z kolekcji Teodora Correra, wenecjanina, ktory zbieral pamiatki po upadlym panstwie. Republika zakonczyla istnienie w 1797 roku, a wiele rodzin sprzedawalo wtedy swoje zbiory. Correr ratowal fragmenty pamieci miasta, zanim rozproszyly sie po Europie.\n\nDla rodzin to dobry przystanek po intensywnym Placu swietego Marka. Zamiast jednego wielkiego efektu dostajecie wiele malych odkryc: dawne widoki miasta, instrumenty, mundury i portrety ludzi, ktorzy budowali mit Wenecji.",
    },
    en: {
      name: "Museo Correr",
      tagline: "Venice's History in a Palace",
      text: "Museo Correr occupies the Napoleonic wing of St Mark's Square. It is a good place to understand Venice quietly, away from the crowd in front of the basilica. Its rooms hold maps, paintings, documents, coins, and objects connected with daily life in the republic.\n\nThe museum grew from the collection of Teodoro Correr, a Venetian who gathered memories of a vanished state. The Republic of Venice ended in 1797, and many old families sold their collections in the decades that followed. Correr preserved fragments of the city's memory before they scattered across Europe.\n\nFor families, this is a useful stop after the intensity of St Mark's Square. Instead of one giant spectacle, you get many small discoveries: old views of the city, instruments, uniforms, portraits, and objects that help explain how Venice built its image of power and refinement.",
    },
  },
  {
    id: "rialto-bridge",
    order: 8,
    coords: { lat: 45.4380, lng: 12.3359 },
    pl: {
      name: "Most Rialto",
      tagline: "Kamienny luk nad handlem",
      text: "Most Rialto jest jednym z najbardziej znanych widokow Wenecji, ale najpierw byl przede wszystkim praktyczna przeprawa. Przez stulecia okolica Rialto byla centrum handlu, bankow i rynku. Tu przychodzilo sie po towary, informacje i pieniadze.\n\nDzisiejszy kamienny most powstal pod koniec XVI wieku. Wczesniejsze konstrukcje byly drewniane i nie zawsze dawaly sobie rade z tlumem. Nowy most mial byc mocny, reprezentacyjny i dochodowy, dlatego na jego grzbiecie umieszczono rzad sklepow.\n\nWejdzcie na srodek i spojrzcie na Canal Grande. Gondole, vaporetto, lodzie dostawcze i taksowki wodne mijaja sie pod wami jak ruch uliczny w zwyklym miescie. Rialto pokazuje, ze w Wenecji kanal byl droga, placem, magazynem i scena jednoczesnie.",
    },
    en: {
      name: "Rialto Bridge",
      tagline: "A Stone Arch Over Commerce",
      text: "The Rialto Bridge is one of Venice's most famous views, but it began as a practical crossing. For centuries the Rialto area was the centre of trade, banking, and markets. People came here for goods, information, and money.\n\nThe stone bridge you see today was built at the end of the sixteenth century. Earlier versions were wooden and did not always cope well with the crowds. The new bridge had to be strong, impressive, and profitable, so rows of shops were built along its spine.\n\nStand in the middle and look down the Grand Canal. Gondolas, vaporetti, delivery boats, and water taxis pass below like traffic in an ordinary city. Rialto shows how Venice worked: a canal could be a road, a square, a warehouse route, and a stage all at once.",
    },
  },
  {
    id: "rialto-market",
    order: 9,
    coords: { lat: 45.4392, lng: 12.3358 },
    pl: {
      name: "Targ Rialto",
      tagline: "Kuchnia laguny",
      text: "Targ Rialto to jedno z miejsc, gdzie Wenecja nadal pachnie codziennym zyciem. Rano pojawiaja sie tu ryby z laguny i Adriatyku, warzywa z okolicznych wysp, owoce, przyprawy i glosy sprzedawcow. To nie jest tylko ladny zabytek, ale dzialajacy fragment miasta.\n\nPrzez wieki Rialto bylo gospodarczym sercem Wenecji. W poblizu zalatwiano interesy, wymieniano pieniadze i rozladowywano towary. Rynek pokazuje skromniejsza, ale bardzo wazna strone republiki: wielka historia potrzebowala codziennych dostaw.\n\nDzieciom warto pokazac nazwy ryb i dziwne ksztalty owocow morza. Dorosli zobacza, jak blisko sa tu kuchnia, geografia i handel. Najlepiej przyjsc rano, zanim stragany zaczna znikac, a okolica zamieni sie glownie w trase spacerowa.",
    },
    en: {
      name: "Rialto Market",
      tagline: "The Lagoon's Kitchen",
      text: "Rialto Market is one of the places where Venice still smells like daily life. In the morning you find fish from the lagoon and the Adriatic, vegetables from nearby islands, fruit, spices, and the voices of vendors. It is not just a pretty historic setting, but a working piece of the city.\n\nFor centuries Rialto was Venice's economic heart. Deals were made nearby, money was exchanged, and goods were unloaded. The market shows a humbler but essential side of the republic: grand history still needed daily deliveries.\n\nFor children, the fish names and strange shapes of seafood can be the best part. Adults can see how closely food, geography, and trade connect here. Come in the morning if you can, before the stalls disappear and the area becomes mainly a walking route between famous sights.",
    },
  },
  {
    id: "grand-canal",
    order: 10,
    coords: { lat: 45.4368, lng: 12.3298 },
    pl: {
      name: "Canal Grande",
      tagline: "Glowna ulica z wody",
      text: "Canal Grande jest glowna ulica Wenecji, tylko zamiast asfaltu ma wode. Ma ksztalt wielkiej litery S i przecina miasto od dworca kolejowego az po okolice Placu swietego Marka. Najlepiej poznaje sie go z vaporetto, zwyklego wodnego autobusu.\n\nPo obu stronach stoja palaze dawnych rodow kupieckich. Ich najpiekniejsze fasady zwrocone sa do kanalu, bo to wlasnie od wody przybywali goscie, towary i wiadomosci. Parter czesto sluzyl jako magazyn, wyzsze pietra jako reprezentacyjne mieszkania.\n\nPodczas rejsu warto patrzec na szczegoly: balkony, herby, marmury, slady dawnych drzwi wodnych. Canal Grande opowiada historie miasta bez jednej sali muzealnej. Wystarczy usiasc przy oknie i pozwolic, aby Wenecja przesuwala sie powoli obok.",
    },
    en: {
      name: "Grand Canal",
      tagline: "The Main Street Made of Water",
      text: "The Grand Canal is Venice's main street, except that it is made of water. It forms a huge S through the city, running from the railway station toward the basin near St Mark's. The best way to experience it is from a vaporetto, the ordinary public water bus.\n\nOn both sides stand the palaces of old merchant families. Their finest facades face the canal, because guests, goods, and news arrived by water. The ground floor often worked as a warehouse, while the upper floors held the grand living rooms.\n\nAs you ride, look for details: balconies, coats of arms, marble patterns, and traces of old water doors. The Grand Canal tells the story of Venice without needing a museum room. Sit by the window and let the city slide slowly past.",
    },
  },
  {
    id: "ca-doro",
    order: 11,
    coords: { lat: 45.4409, lng: 12.3335 },
    pl: {
      name: "Ca d'Oro",
      tagline: "Zloty dom nad kanalem",
      text: "Ca d'Oro oznacza Zloty Dom. Dzis fasada jest jasna i elegancka, ale kiedy palac byl nowy, zdobily ja kolory i pozlota. Musial wygladac jak bogata koronka rozciagnieta nad Canal Grande.\n\nPalac powstal w XV wieku dla rodziny Contarini i jest jednym z najpiekniejszych przykladow gotyku weneckiego. Ten styl lubi lekosc, luki, marmur i rytm powtarzajacych sie okien. Budynek mowi: jestesmy bogaci, ale mamy dobry gust.\n\nW srodku znajduje sie dzis galeria sztuki. Nawet jesli ogladacie tylko fasade z vaporetto, warto zwrocic uwage na asymetrie. Wenecjanie nie zawsze szukali idealnej rownowagi. Czasem wazniejsze bylo dopasowanie do dzialki, kanalu i funkcji. Dzieki temu miasto wyglada zywo, nie jak rysunek z linijka.",
    },
    en: {
      name: "Ca' d'Oro",
      tagline: "The Golden House on the Canal",
      text: "Ca' d'Oro means House of Gold. Today the facade is pale and elegant, but when the palace was new it was decorated with colour and gilding. It must have looked like a piece of rich lace stretched above the Grand Canal.\n\nThe palace was built in the fifteenth century for the Contarini family and is one of the finest examples of Venetian Gothic architecture. This style loves lightness, arches, marble, and the rhythm of repeated windows. The building says: we are wealthy, but we also have taste.\n\nInside is now an art gallery. Even if you only see the facade from a vaporetto, notice its asymmetry. Venetians did not always chase perfect balance. Sometimes it was more important to fit the plot, the canal, and the building's function. That is why Venice feels alive rather than drawn with a ruler.",
    },
  },
  {
    id: "frari-basilica",
    order: 12,
    coords: { lat: 45.4363, lng: 12.3267 },
    pl: {
      name: "Bazylika Frari",
      tagline: "Cegla, cisza i Tycjan",
      text: "Bazylika Frari jest ogromna, ale z zewnatrz prawie surowa. Franciszkanie nie potrzebowali marmurowej fasady jak przy Placu swietego Marka. Wybrali cegle, wysokie sciany i przestrzen, ktora miala prowadzic mysli ku gorze.\n\nW srodku czeka jednak jedno z najwazniejszych spotkan ze sztuka w Wenecji. Na oltarzu glownym znajduje sie Wniebowziecie Tycjana, obraz pelen ruchu, czerwieni i swiatla. W kosciele sa tez grobowce wielkich Wenecjan, w tym samego Tycjana i kompozytora Claudia Monteverdiego.\n\nFrari pokazuje inna Wenecje niz ta z pocztowek: mniej blysku, wiecej skupienia. Warto wejsc powoli, pozwolic oczom przyzwyczaic sie do polmroku i zobaczyc, jak prosty ceglany kosciol stal sie jednym z najbogatszych skarbcow sztuki miasta.",
    },
    en: {
      name: "Basilica di Santa Maria Gloriosa dei Frari",
      tagline: "Brick, Silence, and Titian",
      text: "The Frari Basilica is enormous, but from the outside it is almost plain. The Franciscans did not need a marble facade like St Mark's. They chose brick, high walls, and a space meant to lift the mind upward.\n\nInside, however, you meet some of the most important art in Venice. On the high altar is Titian's Assumption of the Virgin, a painting full of movement, red colour, and light. The church also holds tombs of major Venetians, including Titian himself and the composer Claudio Monteverdi.\n\nThe Frari shows a different Venice from the postcard version: less glitter, more concentration. Enter slowly, let your eyes adjust to the dimness, and notice how a simple brick church became one of the richest artistic treasure houses in the city.",
    },
  },
  {
    id: "scuola-grande-di-san-rocco",
    order: 13,
    coords: { lat: 45.4360, lng: 12.3255 },
    pl: {
      name: "Scuola Grande di San Rocco",
      tagline: "Tintoretto od podlogi po sufit",
      text: "Scuola Grande di San Rocco byla siedziba bractwa religijnego i dobroczynnego. Takie scuole odgrywaly w Wenecji wielka role: organizowaly pomoc, procesje, opieke i prestiz swoich czlonkow. San Rocco stalo sie szczegolnie wazne, bo swiety Roch byl patronem chroniacym przed zaraza.\n\nNajwiekszym skarbem budynku sa obrazy Tintoretta. Artysta pracowal tu przez wiele lat i pokryl sale dramatycznymi scenami biblijnymi. Nie oglada sie jednego obrazu, lecz cale otoczenie: sciany, sufit, swiatlo i cien tworza wielki teatr malarstwa.\n\nTo dobre miejsce, aby odpoczac od spaceru i patrzec w gore. Wezcie lusterko, jesli jest dostepne, albo po prostu usiadzcie. San Rocco uczy, ze w Wenecji sztuka byla nie tylko dekoracja. Byla sposobem opowiadania, modlitwy i rywalizacji o pamiec.",
    },
    en: {
      name: "Scuola Grande di San Rocco",
      tagline: "Tintoretto from Floor to Ceiling",
      text: "The Scuola Grande di San Rocco was the headquarters of a religious and charitable brotherhood. These scuole played a major role in Venice: they organized aid, processions, care, and public prestige for their members. San Rocco was especially important because St Roch was invoked against plague.\n\nThe building's greatest treasure is its cycle of paintings by Tintoretto. The artist worked here for many years, covering the rooms with dramatic biblical scenes. You do not look at just one painting. You stand inside an environment where walls, ceiling, light, and shadow become a theatre of painting.\n\nThis is a good place to pause and look upward. Use a mirror if one is available, or simply sit for a while. San Rocco teaches that in Venice art was not only decoration. It was storytelling, prayer, and a competition for memory.",
    },
  },
  {
    id: "ca-rezzonico",
    order: 14,
    coords: { lat: 45.4338, lng: 12.3267 },
    pl: {
      name: "Ca Rezzonico",
      tagline: "Wenecja XVIII wieku",
      text: "Ca Rezzonico to palac nad Canal Grande, ktory przenosi was do Wenecji XVIII wieku. To czas masek, salonow, muzyki, bogatych dekoracji i powolnego konca dawnej republiki. Miasto wciaz bylo olsniewajace, ale jego polityczna potega slabla.\n\nW muzeum zobaczycie meble, freski, obrazy i wnetrza pokazujace zycie arystokracji. Szczegolnie ciekawe jest to, ze luksus miesza sie tu z lekkim niepokojem. Wszystko jest piekne, ale wiemy, ze niedlugo Napoleon zamknie wielki rozdzial historii Wenecji.\n\nDla dzieci moze to byc palac wyobrazni: sale jak scenografia, sufity jak niebo, postacie z perukami i maskami. Dla doroslych to opowiesc o miescie, ktore potrafilo bawic sie z niezwykla elegancja, nawet gdy swiat wokol juz sie zmienial.",
    },
    en: {
      name: "Ca' Rezzonico",
      tagline: "Eighteenth-Century Venice",
      text: "Ca' Rezzonico is a palace on the Grand Canal that carries you into eighteenth-century Venice. This was the age of masks, salons, music, rich decoration, and the slow ending of the old republic. The city was still dazzling, but its political power was fading.\n\nInside the museum you see furniture, frescoes, paintings, and rooms that show aristocratic life. What makes it especially interesting is the mixture of luxury and unease. Everything is beautiful, but we know that Napoleon will soon close a long chapter of Venetian history.\n\nFor children, it can feel like a palace of imagination: rooms like stage sets, ceilings like skies, figures in wigs and masks. For adults, it is a story about a city that knew how to entertain itself with extraordinary elegance, even while the world around it was changing.",
    },
  },
  {
    id: "gallerie-accademia",
    order: 15,
    coords: { lat: 45.4310, lng: 12.3283 },
    pl: {
      name: "Gallerie dell'Accademia",
      tagline: "Najwieksza lekcja malarstwa Wenecji",
      text: "Gallerie dell'Accademia to najwazniejsze miejsce dla tych, ktorzy chca zobaczyc, jak Wenecja malowala sama siebie i swiat. Znajduja sie tu dziela Belliniego, Giorgionego, Tycjana, Veronesa, Tintoretta i wielu innych artystow zwiazanych z miastem.\n\nWenecjanie kochali kolor, swiatlo i material. Ich obrazy czesto wydaja sie bardziej zmyslowe niz precyzyjne rysunki florenckie. Woda, tkaniny, zloto, skora i niebo maja tu niemal fizyczna obecnosc.\n\nNie trzeba ogladac wszystkiego. Lepiej wybrac kilka sal i patrzec uwaznie. Zauwazcie, jak malarze buduja dramat gestem, spojrzeniem i kolorem. Accademia pomaga potem inaczej zobaczyc cale miasto, bo fasady, koscioly i kanaly zaczynaja wygladac jak czesc tej samej wielkiej palety.",
    },
    en: {
      name: "Gallerie dell'Accademia",
      tagline: "Venice's Great Painting Lesson",
      text: "The Gallerie dell'Accademia is the essential place to see how Venice painted itself and the world. It holds works by Bellini, Giorgione, Titian, Veronese, Tintoretto, and many other artists connected with the city.\n\nVenetian painters loved colour, light, and material surfaces. Their pictures often feel more sensual than the precise drawings associated with Florence. Water, fabric, gold, skin, and sky seem almost physically present.\n\nYou do not need to see everything. It is better to choose a few rooms and look carefully. Notice how painters build drama through gesture, gaze, and colour. After visiting the Accademia, the whole city can look different, because facades, churches, and canals begin to feel like part of the same great palette.",
    },
  },
  {
    id: "peggy-guggenheim-collection",
    order: 16,
    coords: { lat: 45.4308, lng: 12.3317 },
    pl: {
      name: "Kolekcja Peggy Guggenheim",
      tagline: "Nowoczesnosc nad Canal Grande",
      text: "Kolekcja Peggy Guggenheim znajduje sie w niezwyklym palacu nad Canal Grande. Budynek jest niski, bo nigdy nie ukonczono go wedlug pierwotnych planow. Dzieki temu wyglada inaczej niz sasiednie palazzi i pasuje do historii wlascicielki: osoby niezaleznej, odwaznej i nieoczywistej.\n\nPeggy Guggenheim kolekcjonowala sztuke XX wieku i wspierala artystow, zanim stali sie powszechnie znani. W jej domu mozna zobaczyc dziela surrealistow, kubistow i ekspresjonistow abstrakcyjnych. To duza zmiana po zlocie bazylik i renesansowych obrazach.\n\nMuzeum pokazuje, ze Wenecja nie jest tylko skansenem. Miasto od dawna przyciagalo ludzi, ktorzy chcieli eksperymentowac, zbierac i rozmawiac ze swiatem. Ogrod, taras nad kanalem i nowoczesne obrazy tworza spokojna, ale bardzo swieza przerwe w zwiedzaniu.",
    },
    en: {
      name: "Peggy Guggenheim Collection",
      tagline: "Modern Art on the Grand Canal",
      text: "The Peggy Guggenheim Collection sits in an unusual palace on the Grand Canal. The building is low because it was never completed according to its original plans. That makes it look different from the neighbouring palazzi and suits the story of its owner: independent, bold, and unexpected.\n\nPeggy Guggenheim collected twentieth-century art and supported artists before many of them became famous. In her former home you can see Surrealism, Cubism, and Abstract Expressionism. It is a striking change after golden basilicas and Renaissance paintings.\n\nThe museum shows that Venice is not only an open-air museum of the past. The city has long attracted people who wanted to experiment, collect, and speak with the wider world. The garden, the terrace over the canal, and the modern paintings make this a calm but fresh pause in the itinerary.",
    },
  },
  {
    id: "santa-maria-della-salute",
    order: 17,
    coords: { lat: 45.4307, lng: 12.3340 },
    pl: {
      name: "Santa Maria della Salute",
      tagline: "Kosciol wdziecznosci po zarazie",
      text: "Bazylika Santa Maria della Salute stoi przy wejsciu do Canal Grande jak wielka kamienna korona. Powstala jako podziekowanie za ocalenie miasta po straszliwej epidemii dżumy w XVII wieku. Sama nazwa Salute oznacza zdrowie i zbawienie.\n\nArchitekt Baldassare Longhena zaprojektowal budowle, ktora widac z daleka: okragla forma, wielka kopula, schody schodzace do wody. Kosciol stal sie jednym z najwazniejszych elementow panoramy Wenecji.\n\nCo roku 21 listopada odbywa sie Festa della Salute. Wenecjanie przechodza wtedy przez tymczasowy most i zapalaja swiece, proszac o zdrowie. To piekny przyklad, jak historia miasta nadal zyje w rytuale. Dla odwiedzajacych Salute jest nie tylko ladnym widokiem, ale pamiatka po strachu, wdziecznosci i wspolnocie.",
    },
    en: {
      name: "Basilica di Santa Maria della Salute",
      tagline: "A Church of Thanks After Plague",
      text: "Santa Maria della Salute stands at the entrance to the Grand Canal like a great stone crown. It was built as an act of thanks after Venice survived a terrible plague in the seventeenth century. The name Salute means both health and salvation.\n\nThe architect Baldassare Longhena designed a building that could be seen from far away: a round form, a huge dome, and steps descending toward the water. The church became one of the defining shapes of the Venetian skyline.\n\nEvery year on 21 November, Venice celebrates the Festa della Salute. People cross a temporary bridge and light candles, praying for health. It is a beautiful example of how the city's history still lives through ritual. For visitors, the Salute is not only a fine view, but a memory of fear, gratitude, and community.",
    },
  },
  {
    id: "teatro-la-fenice",
    order: 18,
    coords: { lat: 45.4337, lng: 12.3339 },
    pl: {
      name: "Teatro La Fenice",
      tagline: "Opera, ktora powstaje z popiolow",
      text: "Nazwa La Fenice oznacza Feniksa, ptaka, ktory odradza sie z popiolow. W przypadku tego teatru to nie tylko poetycka metafora. Budynek plonal kilkakrotnie, w tym dramatycznie w 1996 roku, a mimo to za kazdym razem wracal do zycia.\n\nOd konca XVIII wieku La Fenice nalezala do najwazniejszych scen operowych Europy. Wystawiano tu premiery dziel Rossiniego, Belliniego, Donizettiego i Verdiego. Wenecka publicznosc byla wymagajaca, a sukces w tym teatrze mogl oznaczac wielka kariere.\n\nNawet jesli nie idziecie na spektakl, warto zobaczyc fasade i wyobrazic sobie zloty blask sali. La Fenice przypomina, ze Wenecja byla nie tylko miastem kupcow i malarzy. Byla takze miastem muzyki, glosu, plotek i wieczornego oczekiwania na podniesienie kurtyny.",
    },
    en: {
      name: "Teatro La Fenice",
      tagline: "The Opera House That Rises Again",
      text: "La Fenice means the Phoenix, the bird that rises from its ashes. For this theatre, the name is more than a poetic image. The building burned several times, including a devastating fire in 1996, yet each time it returned to life.\n\nSince the late eighteenth century, La Fenice has been one of Europe's great opera houses. Premieres of works by Rossini, Bellini, Donizetti, and Verdi took place here. Venetian audiences were demanding, and success on this stage could mean a major career.\n\nEven if you do not attend a performance, look at the facade and imagine the golden glow of the auditorium. La Fenice reminds you that Venice was not only a city of merchants and painters. It was also a city of music, voices, gossip, and evening anticipation before the curtain rose.",
    },
  },
  {
    id: "libreria-acqua-alta",
    order: 19,
    coords: { lat: 45.4379, lng: 12.3414 },
    pl: {
      name: "Libreria Acqua Alta",
      tagline: "Ksiazki przygotowane na wysoka wode",
      text: "Libreria Acqua Alta to ksiegarnia, ktora zrobila z weneckiego problemu czesc swojego uroku. Poniewaz woda potrafi wejsc do wnetrza podczas acqua alta, ksiazki leza w wannach, lodziach i gondolach. Wyglada to jak zart, ale ma bardzo praktyczny sens.\n\nW srodku panuje kontrolowany chaos: stosy ksiazek, koty, pocztowki, mapy, schody z dawnych tomow i widok na kanal. To miejsce nie jest eleganckim muzeum, tylko zywym, ciasnym labiryntem papieru.\n\nWarto jednak pamietac, ze jest popularne i bywa zatloczone. Najlepiej wejsc z cierpliwoscia, kupic drobiazg, jesli robicie zdjecia, i potraktowac ksiegarnie jako lekka przerwe. Pokazuje ona Wenecje codzienna: pomyslowa, troche ekscentryczna i zawsze gotowa negocjowac z woda.",
    },
    en: {
      name: "Libreria Acqua Alta",
      tagline: "Books Ready for High Water",
      text: "Libreria Acqua Alta is a bookshop that turned a Venetian problem into part of its charm. Because water can enter during acqua alta, books are stored in bathtubs, boats, and gondolas. It looks like a joke, but it is also practical.\n\nInside is a kind of controlled chaos: piles of books, cats, postcards, maps, steps made from old volumes, and a view toward the canal. This is not an elegant museum. It is a living, narrow maze of paper.\n\nRemember that it is popular and can be crowded. Enter with patience, buy something small if you take photos, and treat the shop as a light pause in the day. It shows everyday Venice at its most inventive: a little eccentric, full of character, and always negotiating with water.",
    },
  },
  {
    id: "venetian-arsenal",
    order: 20,
    coords: { lat: 45.4352, lng: 12.3531 },
    pl: {
      name: "Arsenal Wenecki",
      tagline: "Fabryka morskiej potegi",
      text: "Arsenal byl przemyslowym sercem dawnej Wenecji. Za jego murami budowano i wyposazano statki, ktore dawaly republice bogactwo i bezpieczenstwo. W czasach swojej najwiekszej sprawnosci byl jednym z najbardziej imponujacych kompleksow produkcyjnych Europy.\n\nTo tutaj rzemieslnicy, cieśle, kowale, linarze i urzednicy pracowali w systemie przypominajacym wczesna linie montazowa. Wenecja rozumiala, ze panowanie na morzu wymaga nie tylko odwagi, ale organizacji, materialow i logistyki.\n\nDzis wiele czesci Arsenalu nie jest swobodnie dostepnych, ale juz sama brama z lwami robi wrazenie. To dobry punkt, aby opowiedziec dzieciom, ze za romantycznymi gondolami stala twarda technologia. Wenecja byla piekna, bo byla rowniez bardzo praktyczna.",
    },
    en: {
      name: "Venetian Arsenal",
      tagline: "The Factory of Sea Power",
      text: "The Arsenal was the industrial heart of old Venice. Behind its walls, ships were built and equipped, giving the republic wealth and security. At its most efficient, it was one of the most impressive production complexes in Europe.\n\nHere shipwrights, carpenters, blacksmiths, rope makers, and officials worked in a system sometimes compared to an early assembly line. Venice understood that ruling the sea required not only courage, but organization, materials, and logistics.\n\nToday many parts of the Arsenal are not freely accessible, but the gate with its lions is already powerful. It is a good place to tell children that behind romantic gondolas stood hard technology. Venice was beautiful partly because it was also extremely practical.",
    },
  },
  {
    id: "jewish-ghetto-cannaregio",
    order: 21,
    coords: { lat: 45.4450, lng: 12.3264 },
    pl: {
      name: "Getto zydowskie i Cannaregio",
      tagline: "Cicha historia polnocnej Wenecji",
      text: "W Cannaregio znajduje sie dawne getto zydowskie, jedno z najwazniejszych miejsc pamieci w Wenecji. Samo slowo getto pochodzi wlasnie stad, od nazwy terenu zwiazanego dawniej z odlewnia. Od XVI wieku wladze nakazywaly Zydom mieszkac w tej wydzielonej czesci miasta.\n\nPrzestrzen byla ograniczona, wiec domy rosly w gore. Warto spojrzec na nietypowo wysokie budynki i spokojne place. Za prostymi fasadami ukrywaly sie synagogi roznych wspolnot: niemieckiej, wloskiej, hiszpanskiej i lewantynskiej.\n\nTo miejsce wymaga spokojnego tonu. Opowiada o przymusie, ale tez o kulturze, handlu, nauce i przetrwaniu. Po wyjsciu z getta Cannaregio pokazuje mniej zatloczona Wenecje: z dlugimi kanałami, lokalnymi barami i wieczornym zyciem mieszkancow.",
    },
    en: {
      name: "Jewish Ghetto and Cannaregio",
      tagline: "The Quiet History of Northern Venice",
      text: "Cannaregio holds the old Jewish Ghetto, one of Venice's most important places of memory. The word ghetto itself comes from here, from an area once connected with a foundry. From the sixteenth century, Venetian authorities required Jews to live in this restricted part of the city.\n\nSpace was limited, so the buildings rose upward. Look for the unusually tall houses and quiet squares. Behind plain facades were synagogues serving different communities: German, Italian, Spanish, and Levantine.\n\nThis place asks for a calm tone. It tells a story of restriction, but also of culture, trade, learning, and survival. After leaving the ghetto, Cannaregio shows a less crowded Venice, with long canals, local bars, and evening life that still belongs strongly to residents.",
    },
  },
  {
    id: "san-giorgio-maggiore",
    order: 22,
    coords: { lat: 45.4287, lng: 12.3431 },
    pl: {
      name: "San Giorgio Maggiore",
      tagline: "Wyspa z najlepszym widokiem",
      text: "San Giorgio Maggiore lezy naprzeciw Placu swietego Marka, ale atmosfera jest tu znacznie spokojniejsza. Krotki rejs wystarczy, aby spojrzec na Wenecje z dystansu. Nagle palac Dozow, bazylika i campanile ukladaja sie w panorame, ktora znacie z obrazow i pocztowek.\n\nNajwazniejszym budynkiem wyspy jest kosciol zaprojektowany przez Andrea Palladia. Jego jasna fasada jest uporzadkowana, klasyczna i bardzo inna od bizantyjskiego przepychu swietego Marka. W srodku mozna zobaczyc obrazy Tintoretta.\n\nNajwieksza nagroda czeka na gorze dzwonnicy. Widok obejmuje cale centrum, Giudecce, Lido i lagune. To idealny moment, aby zrozumiec, ze Wenecja najlepiej wyglada nie tylko z bliska, ale takze jako delikatna sylwetka pomiedzy niebem i woda.",
    },
    en: {
      name: "San Giorgio Maggiore",
      tagline: "The Island with the Best View",
      text: "San Giorgio Maggiore lies opposite St Mark's Square, but the atmosphere is much calmer. A short boat ride is enough to see Venice from a distance. Suddenly the Doge's Palace, the basilica, and the campanile form the skyline you know from paintings and postcards.\n\nThe island's main building is the church designed by Andrea Palladio. Its pale facade is ordered, classical, and very different from the Byzantine richness of St Mark's. Inside are paintings by Tintoretto.\n\nThe greatest reward waits at the top of the bell tower. The view takes in the historic centre, Giudecca, the Lido, and the lagoon. It is the perfect moment to understand that Venice is best seen not only close up, but also as a delicate silhouette between sky and water.",
    },
  },
  {
    id: "giudecca-redentore",
    order: 23,
    coords: { lat: 45.4255, lng: 12.3296 },
    pl: {
      name: "Giudecca i Il Redentore",
      tagline: "Szeroka woda i kosciol obietnicy",
      text: "Giudecca lezy na poludnie od glownego centrum Wenecji, po drugiej stronie szerokiego kanalu. Jest blisko, ale czuje sie inaczej: mniej tu ciasnych ulic, wiecej oddechu, warsztatow, domow i widokow na panorame miasta.\n\nNajwazniejszym punktem jest kosciol Il Redentore, zaprojektowany przez Palladia. Powstal jako dziekczynienie po epidemii dżumy w XVI wieku. Co roku podczas Festa del Redentore buduje sie tymczasowy most przez kanal, a Wenecjanie ida do kosciola w procesji.\n\nGiudecca jest dobra na spokojniejszy spacer. Z nabrzeza widac San Marco jak teatralna dekoracje po drugiej stronie wody. To miejsce pokazuje, ze Wenecja ma nie tylko centrum pelne zabytkow, lecz takze dzielnice, gdzie historia miesza sie z codziennym rytmem mieszkancow.",
    },
    en: {
      name: "Giudecca and Il Redentore",
      tagline: "Wide Water and a Church of Promise",
      text: "Giudecca lies south of Venice's main centre, across a broad canal. It is close, but it feels different: fewer tight alleys, more open air, workshops, homes, and views back toward the city's skyline.\n\nThe key landmark is Il Redentore, the church designed by Palladio. It was built as a thanksgiving after a plague in the sixteenth century. Every year during the Festa del Redentore, a temporary bridge is built across the canal and Venetians walk to the church in procession.\n\nGiudecca is good for a quieter walk. From the waterfront, San Marco looks like a stage set across the water. This place shows that Venice is not only a centre packed with monuments, but also a set of neighbourhoods where history mixes with the daily rhythm of residents.",
    },
  },
  {
    id: "murano-glass-museum",
    order: 24,
    coords: { lat: 45.4569, lng: 12.3531 },
    pl: {
      name: "Muzeum Szkla na Murano",
      tagline: "Tysiac lat ognia i piasku",
      text: "Murano od wiekow kojarzy sie ze szklem. W sredniowieczu przeniesiono tu piece szklarskie z centrum Wenecji, czesciowo z obawy przed pozarami, a czesciowo po to, by lepiej kontrolowac cenne umiejetnosci rzemieslnikow.\n\nMuzeum Szkla pokazuje, jak z piasku, ognia i tajemnicy powstawaly przedmioty pozadane w calej Europie. Zobaczycie delikatne kielichy, kolorowe paciorki, lustra, eksperymenty techniczne i wspolczesne formy artystyczne.\n\nDla dzieci najciekawsza jest mysl, ze szklo zaczyna jako rozgrzana, miekka masa. Dla doroslych: ze weneckie bogactwo opieralo sie nie tylko na handlu, ale tez na mistrzostwie produkcji. Po muzeum inaczej patrzy sie na witryny sklepowe Murano, nawet jesli nie wszystko, co blyszczy, jest arcydzielem.",
    },
    en: {
      name: "Murano Glass Museum",
      tagline: "A Thousand Years of Fire and Sand",
      text: "Murano has been linked with glass for centuries. In the Middle Ages, glass furnaces were moved here from central Venice, partly because of fire risk and partly so the republic could better control the valuable skills of glassmakers.\n\nThe Glass Museum shows how sand, fire, and guarded knowledge became objects desired across Europe. You can see delicate goblets, coloured beads, mirrors, technical experiments, and modern artistic forms.\n\nFor children, the most fascinating idea may be that glass begins as a hot, soft mass. For adults, the lesson is that Venetian wealth depended not only on trade, but also on skilled production. After the museum, Murano's shop windows look different, even if not everything that sparkles is a masterpiece.",
    },
  },
  {
    id: "santa-maria-san-donato-murano",
    order: 25,
    coords: { lat: 45.4575, lng: 12.3562 },
    pl: {
      name: "Santa Maria e San Donato na Murano",
      tagline: "Mozaiki i smocze kosci",
      text: "Bazylika Santa Maria e San Donato jest jednym z najpiekniejszych zabytkow Murano. Z zewnatrz zachwyca arkadami i ceglana absyda, a w srodku czeka spokojna przestrzen z mozaikowa posadzka, ktora przypomina kamienny dywan.\n\nKosciol ma tez opowiesc idealna dla dzieci. Za oltarzem pokazywane sa wielkie kosci, ktore tradycja laczyla ze smokiem pokonanym przez swietego Donata. Dzis brzmi to bardziej jak legenda niz nauka, ale wlasnie takie historie sprawialy, ze sredniowieczne koscioly byly pelne wyobrazni.\n\nMurano jest znane ze szkła, ale ta bazylika przypomina, ze wyspa miala takze dluga historie religijna i artystyczna. Warto wejsc tu po spacerze miedzy sklepami, aby zobaczyc starsze, cichsze oblicze wyspy.",
    },
    en: {
      name: "Basilica di Santa Maria e San Donato, Murano",
      tagline: "Mosaics and Dragon Bones",
      text: "The Basilica of Santa Maria e San Donato is one of Murano's most beautiful historic sites. Outside, its arcades and brick apse are striking. Inside is a calm space with a mosaic floor that feels like a stone carpet.\n\nThe church also has a story perfect for children. Behind the altar are large bones traditionally linked with a dragon defeated by St Donatus. Today that sounds more like legend than science, but such stories helped make medieval churches places of imagination.\n\nMurano is famous for glass, but this basilica reminds you that the island also has a long religious and artistic history. It is worth stepping inside after the shop-lined canals to see an older, quieter face of Murano.",
    },
  },
  {
    id: "burano-colored-houses",
    order: 26,
    coords: { lat: 45.4855, lng: 12.4169 },
    pl: {
      name: "Burano: kolorowe domy i Piazza Galuppi",
      tagline: "Wyspa koloru",
      text: "Burano wyglada, jakby ktos pomalowal wyspa najodwazniejszymi kolorami z pudełka. Domy sa rozowe, zielone, niebieskie, zolte i czerwone, a odbicia w kanalach dodaja im drugie zycie. Tradycyjnie mowi sie, ze kolory pomagaly rybakom rozpoznac dom we mgle.\n\nCentrum wyspy stanowi Piazza Galuppi, nazwana od kompozytora Baldassare Galuppiego. Wokol placu znajdziecie sklepy, kawiarnie i slad dawnego rzemiosla koronkarskiego. W oddali widac lekko przechylona dzwonnice kosciola San Martino.\n\nNajlepiej odejsc kilka ulic od glownego tlumu. Burano szybko staje sie spokojniejsze, bardziej domowe. Pamietajcie, ze te kolorowe fasady to nie tylko tlo do zdjec, ale czyjes mieszkania. Najladniejsza pamiatka z Burano to spokojny spacer i uwazne patrzenie.",
    },
    en: {
      name: "Burano: Colored Houses and Piazza Galuppi",
      tagline: "The Island of Colour",
      text: "Burano looks as if someone painted the island with the brightest colours in the box. Houses are pink, green, blue, yellow, and red, and their reflections in the canals give them a second life. Tradition says the colours helped fishermen recognize home through lagoon fog.\n\nThe centre is Piazza Galuppi, named after the composer Baldassare Galuppi. Around the square you find shops, cafes, and traces of the island's lace-making tradition. In the distance, the bell tower of San Martino leans slightly.\n\nThe best thing is to walk a few streets away from the main crowd. Burano quickly becomes quieter and more domestic. Remember that these colourful facades are not just photo backgrounds, but people's homes. The best souvenir from Burano is a slow walk and careful looking.",
    },
  },
  {
    id: "burano-lace-museum",
    order: 27,
    coords: { lat: 45.4853, lng: 12.4176 },
    pl: {
      name: "Muzeum Koronki na Burano",
      tagline: "Cierpliwosc zapisana nicią",
      text: "Burano slynie nie tylko z kolorowych domow, ale takze z koronki. Muzeum Koronki miesci sie przy Piazza Galuppi, w budynku zwiazanym z dawna szkola koronczarska. To dobre miejsce, aby zrozumiec, ile pracy kryje sie w czyms tak lekkim.\n\nKoronka byla luksusem, ktory wymagal czasu, dobrego wzroku i ogromnej cierpliwosci. Delikatne wzory powstawaly z nici prowadzonej reka, bez pospiechu. W muzeum widac, jak rzemioslo laczylo sztuke, mode i ekonomie wyspy.\n\nDla dzieci moze to byc lekcja uwaznosci: jeden maly blad potrafi zepsuc wiele godzin pracy. Dla doroslych to opowiesc o kobietach i domowym rzemiosle, ktore stalo sie slawne daleko poza laguna. Po wizycie inaczej patrzy sie na slowo recznie robione.",
    },
    en: {
      name: "Burano Lace Museum",
      tagline: "Patience Written in Thread",
      text: "Burano is famous not only for colourful houses, but also for lace. The Lace Museum stands on Piazza Galuppi, in a building connected with the old lace school. It is a good place to understand how much work can hide inside something so light.\n\nLace was a luxury that required time, sharp eyes, and extraordinary patience. Delicate patterns were made by hand, thread by thread, without hurry. In the museum you see how craft connected art, fashion, and the island's economy.\n\nFor children, it can be a lesson in attention: one small mistake could spoil many hours of work. For adults, it is a story about women and domestic skill becoming famous far beyond the lagoon. After visiting, the phrase handmade feels much more serious.",
    },
  },
  {
    id: "torcello-basilica",
    order: 28,
    coords: { lat: 45.4989, lng: 12.4188 },
    pl: {
      name: "Torcello: Bazylika Santa Maria Assunta",
      tagline: "Poczatek przed Wenecja",
      text: "Torcello jest dzis ciche i prawie puste, ale kiedys bylo jednym z najwazniejszych miejsc laguny. Zanim Wenecja stala sie potega, to tutaj rozwijala sie osada, biskupstwo i zycie handlowe. Wyspa pomaga wyobrazic sobie poczatki miasta przed wielka slawa.\n\nNajcenniejszym zabytkiem jest Bazylika Santa Maria Assunta. W srodku znajduja sie niezwykle mozaiki, w tym przedstawienie Sadu Ostatecznego. Zloto i ciemne figury robia silne wrazenie, szczegolnie po spokojnym spacerze przez zielona wyspe.\n\nTorcello uczy, ze historia nie zawsze zostaje tam, gdzie zaczela sie najwczesniej. Bagna, choroby i zmiany handlowe sprawily, ze znaczenie wyspy zmalalo. Dzis jej cisza jest czescia uroku. To miejsce dla tych, ktorzy chca uslyszec starszy, wolniejszy glos laguny.",
    },
    en: {
      name: "Torcello: Basilica di Santa Maria Assunta",
      tagline: "The Beginning Before Venice",
      text: "Torcello is quiet and almost empty today, but it was once one of the most important places in the lagoon. Before Venice became powerful, this island had a settlement, a bishopric, and commercial life. It helps you imagine the city's beginnings before its great fame.\n\nThe greatest treasure is the Basilica of Santa Maria Assunta. Inside are extraordinary mosaics, including a Last Judgment. Gold and dark figures make a strong impression, especially after the calm walk across the green island.\n\nTorcello teaches that history does not always remain where it began. Marshes, disease, and changing trade routes reduced the island's importance. Today its silence is part of its charm. This is a place for anyone who wants to hear an older, slower voice of the lagoon.",
    },
  },
  {
    id: "mazzorbo-venissa",
    order: 29,
    coords: { lat: 45.4869, lng: 12.4089 },
    pl: {
      name: "Mazzorbo i winnica Venissa",
      tagline: "Zielona przerwa w lagunie",
      text: "Mazzorbo lezy tuz obok Burano i laczy sie z nim mostem, ale nastroj jest zupelnie inny. Zamiast kolorowego gwaru znajdziecie tu cisze, ogrody, murki, wode i wiecej przestrzeni. To dobra przerwa po tlumach.\n\nNajbardziej znanym miejscem jest Venissa, winnica zwiazana z odrodzeniem lokalnej odmiany winogron dorona. Uprawa winorosli w lagunie brzmi zaskakujaco, ale Wenecja zawsze korzystala z malych wysp jako ogrodow, sadów i zaplecza zywnosciowego.\n\nSpacer po Mazzorbo pokazuje, ze laguna to nie tylko palace i koscioly. To takze ziemia, sol, wiatr i praca ludzi, ktorzy probuja uprawiac rosliny w trudnym srodowisku. Najlepiej potraktowac te wyspe jako oddech: kilka wolnych krokow pomiedzy woda a zielenią.",
    },
    en: {
      name: "Mazzorbo and Venissa Vineyard",
      tagline: "A Green Pause in the Lagoon",
      text: "Mazzorbo lies beside Burano and is connected to it by a bridge, but the mood is completely different. Instead of colourful bustle, you find quiet, gardens, walls, water, and more open space. It is a good pause after crowds.\n\nThe best-known place is Venissa, a vineyard connected with the revival of the local dorona grape. Growing vines in the lagoon may sound surprising, but Venice always used smaller islands as gardens, orchards, and food-producing land.\n\nA walk on Mazzorbo shows that the lagoon is not only palaces and churches. It is also soil, salt, wind, and the work of people trying to cultivate plants in a difficult environment. Treat the island as a breath: a few slow steps between water and green.",
    },
  },
  {
    id: "lido-di-venezia",
    order: 30,
    coords: { lat: 45.4168, lng: 12.3675 },
    pl: {
      name: "Lido di Venezia",
      tagline: "Plaza, kino i bariera laguny",
      text: "Lido di Venezia jest dluga, waska wyspa oddzielajaca lagune od Adriatyku. Po stronie laguny przyplywaja vaporetto, a po drugiej stronie czeka prawdziwa plaza. Po ciasnych ulicach Wenecji sama obecnosc rowerow, samochodow i szerokich alei moze wydac sie zaskakujaca.\n\nLido zaslynelo jako elegancki kurort przełomu XIX i XX wieku. Powstaly tu hotele, kapieliska i wille, a pozniej takze Festiwal Filmowy w Wenecji. To miejsce laczy wakacyjny luz z odrobina dawnego blasku gwiazd.\n\nDla rodziny Lido moze byc dniem odpoczynku: spacer, lody, piasek, morze. Jednoczesnie wyspa pomaga zrozumiec geografie laguny. Bez takich barier Wenecja nie bylaby chroniona w ten sam sposob. Lido jest wiec nie tylko plaża, ale czescia systemu, ktory stworzył miasto.",
    },
    en: {
      name: "Lido di Venezia",
      tagline: "Beach, Cinema, and the Lagoon Barrier",
      text: "The Lido is a long, narrow island separating the lagoon from the Adriatic Sea. Vaporetti arrive on the lagoon side, while a real beach waits on the other side. After Venice's tight alleys, the presence of bicycles, cars, and broad avenues can feel surprising.\n\nThe Lido became famous as an elegant resort in the late nineteenth and early twentieth centuries. Hotels, bathing establishments, villas, and later the Venice Film Festival gave it a mix of holiday ease and old star glamour.\n\nFor a family, the Lido can be a rest day: walking, ice cream, sand, and sea. At the same time, the island helps explain the geography of the lagoon. Without barrier islands like this, Venice would not be protected in the same way. The Lido is not only a beach, but part of the system that made the city possible.",
    },
  },
];

const data = {
  version: "2026-07-07-4",
  places: places.map((place) => ({
    id: place.id,
    order: place.order,
    coords: place.coords,
    image: `images/${place.id}.webp`,
    imageThumb: `images/thumbs/${place.id}.webp`,
    pl: {
      ...place.pl,
      audio: `audio/pl/${place.id}.mp3`,
      audioDuration: 0,
    },
    en: {
      ...place.en,
      audio: `audio/en/${place.id}.mp3`,
      audioDuration: 0,
    },
  })),
};

await writeFile(SOURCE_PATH, JSON.stringify(data, null, 2) + "\n");
console.log(`Wrote ${data.places.length} places to content/places.source.json`);
