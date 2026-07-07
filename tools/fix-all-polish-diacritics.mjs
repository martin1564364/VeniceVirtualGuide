import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SOURCE_PATH = path.join(ROOT, "content", "places.source.json");

const polish = {
  "st-marks-square": {
    name: "Plac Świętego Marka",
    tagline: "Salon Europy",
    text: "Stoicie na jedynym placu w Wenecji, który nosi nazwę piazza. Każdy inny plac w mieście to campo. Przez ponad tysiąc lat to miejsce było wielką sceną republiki: tu przechodziły procesje, tu władza pokazywała swój przepych, a pod arkadami spotykali się kupcy, pielgrzymi i ciekawscy przybysze.\n\nRozejrzyjcie się powoli. Z jednej strony błyszczy Bazylika Świętego Marka, z drugiej stoją długie skrzydła dawnych prokuracji, czyli urzędów najważniejszych ludzi republiki. Napoleon miał nazwać ten plac salonem Europy i łatwo zrozumieć dlaczego: wszystko jest tu ustawione jak dekoracja teatralna.\n\nPlac ma też praktyczną tajemnicę. Leży bardzo nisko, dlatego podczas acqua alta woda potrafi wypłynąć przez odpływy i zamienić kamienną posadzkę w płytkie lustro. Najlepiej przejść się wzdłuż arkad, posłuchać kawiarnianych orkiestr i wyobrazić sobie, że przez chwilę stoicie w sercu dawnej morskiej potęgi.",
  },
  "st-marks-basilica": {
    name: "Bazylika Świętego Marka",
    tagline: "Złoto, mozaiki i morska republika",
    text: "Bazylika Świętego Marka nie wygląda jak zwykły kościół zachodniej Europy. Jej kopuły, marmury i złote mozaiki przypominają raczej Konstantynopol, bo Wenecja przez stulecia patrzyła na wschód. Kupcy wracali z Bizancjum z towarami, pomysłami i artystami, a republika zamieniła te wpływy w swój najbardziej rozpoznawalny symbol.\n\nLegenda mówi, że relikwie Świętego Marka przywieziono do Wenecji z Aleksandrii w IX wieku, ukryte pod wieprzowiną, aby ominąć kontrolę. Dla miasta był to skarb polityczny i duchowy: własny patron, własna opowieść, własne miejsce w historii chrześcijaństwa.\n\nPrzed fasadą warto zwrócić uwagę na konie nad wejściem. Oryginalne rzeźby trafiły do Wenecji po zdobyciu Konstantynopola w 1204 roku. Dzisiejsze konie na zewnątrz to kopie, ale ich historia nadal przypomina, że Wenecja była piękna, pobożna i bardzo skuteczna w zbieraniu trofeów.",
  },
  "doges-palace": {
    name: "Pałac Dożów",
    tagline: "Serce władzy Republiki",
    text: "Pałac Dożów był jednocześnie rezydencją, urzędem, salą sądową i symbolem państwa. To tutaj mieszkał doża, wybierany władca Wenecji, ale nie był on królem. Republika bardzo pilnowała, aby żadna osoba nie stała się zbyt silna. Władza była rozdzielona pomiędzy rady, urzędników i skomplikowane procedury.\n\nZ zewnątrz pałac wygląda niemal lekko: gotyckie arkady podtrzymują wielką bryłę z jasnego kamienia i różowego marmuru. W środku skala zmienia się całkowicie. Sale są ogromne, pełne obrazów, złoceń i scen pokazujących Wenecję jako miasto wybrane przez historię.\n\nNajmocniejszy kontrast czeka po drugiej stronie. Z reprezentacyjnych sal przechodzi się do więzień, wąskich korytarzy i cel. Pałac przypomina, że Wenecja potrafiła zachwycać sztuką, ale rządziła twardo i bardzo dokładnie.",
  },
  "bridge-of-sighs": {
    name: "Most Westchnień",
    tagline: "Romantyczna nazwa, surowa historia",
    text: "Most Westchnień brzmi jak miejsce dla zakochanych, ale jego historia jest znacznie ciemniejsza. Łączy Pałac Dożów z dawnym więzieniem. Skazani przechodzili tędy z sal sądowych do cel, a przez małe kamienne okna mogli po raz ostatni zobaczyć lagunę i światło Wenecji.\n\nNazwa stała się popularna dopiero w epoce romantyzmu. Wyobrażano sobie, że więźniowie wzdychali na widok miasta, które opuszczali na zawsze. W rzeczywistości wielu skazanych trafiało do cel na krótszy czas, ale obraz ostatniego spojrzenia okazał się tak silny, że został z mostem na stałe.\n\nNajlepiej popatrzeć na niego z Ponte della Paglia, przy nabrzeżu. Biały kamień, delikatna dekoracja i wąski kanał tworzą piękny widok. Właśnie dlatego ten most jest tak wenecki: elegancka fasada ukrywa bardzo poważną opowieść o prawie, karze i wolności.",
  },
  "campanile-di-san-marco": {
    name: "Campanile di San Marco",
    tagline: "Dzwonnica, która wróciła",
    text: "Campanile Świętego Marka jest najłatwiejszym punktem orientacyjnym w Wenecji. Ceglana wieża ma prawie sto metrów wysokości i przez wieki służyła nie tylko jako dzwonnica, lecz także jako znak dla statków wpływających do laguny.\n\nTo, co widzicie, nie jest jednak średniowiecznym oryginałem. W 1902 roku stara wieża nagle runęła. Wenecjanie mieli szczęście: zginęło bardzo niewiele stworzeń, a bazylika została ocalona. Decyzja zapadła szybko: odbudować tam, gdzie była, i taką, jaka była. Włoskie hasło brzmiało dov'era e com'era.\n\nWjazd na górę daje jedną z najlepszych lekcji geografii miasta. Zamiast labiryntu ulic widać całą lagunę: dachy Wenecji, Giudeccę, San Giorgio, Lido i dalekie wyspy. Nagle staje się jasne, że Wenecja nie jest tylko miastem kanałów, ale stolicą wodnego krajobrazu.",
  },
  "st-marks-clock-tower": {
    name: "Wieża Zegarowa Świętego Marka",
    tagline: "Czas Republiki",
    text: "Wieża Zegarowa stoi przy wejściu na Mercerie, główną handlową drogę prowadzącą od Placu Świętego Marka w stronę Rialto. To nie był przypadkowy adres. Każdy, kto wchodził do politycznego serca miasta, widział, że Wenecja kontroluje nie tylko handel i morze, ale także czas.\n\nNa szczycie wieży dwie brązowe postacie uderzają w dzwon. Nazywa się je Maurami, choć są to raczej symboliczne figury strażników czasu. Poniżej znajduje się tarcza z godzinami, znakami zodiaku i fazami księżyca. Dla miasta kupców taka wiedza była bardzo praktyczna: przypływy, podróże i umowy zależne były od kalendarza.\n\nZatrzymajcie się na chwilę pod łukiem. Pod wami płynie tłum, nad wami pracuje mechanizm, a wokół stoją sklepy. To dobra miniatura Wenecji: piękno, handel, astronomia i teatralny gest w jednym miejscu.",
  },
  "museo-correr": {
    name: "Museo Correr",
    tagline: "Historia Wenecji w pałacu",
    text: "Museo Correr zajmuje skrzydło Placu Świętego Marka zwane napoleońskim. To dobre miejsce, aby zrozumieć Wenecję po cichu, z dala od tłumu stojącego przed bazyliką. W salach muzeum znajdują się mapy, obrazy, dokumenty, monety i przedmioty związane z codziennym życiem republiki.\n\nMuzeum powstało z kolekcji Teodora Correra, wenecjanina, który zbierał pamiątki po upadłym państwie. Republika zakończyła istnienie w 1797 roku, a wiele rodzin sprzedawało wtedy swoje zbiory. Correr ratował fragmenty pamięci miasta, zanim rozproszyły się po Europie.\n\nDla rodzin to dobry przystanek po intensywnym Placu Świętego Marka. Zamiast jednego wielkiego efektu dostajecie wiele małych odkryć: dawne widoki miasta, instrumenty, mundury i portrety ludzi, którzy budowali mit Wenecji.",
  },
  "rialto-bridge": {
    name: "Most Rialto",
    tagline: "Kamienny łuk nad handlem",
    text: "Most Rialto jest jednym z najbardziej znanych widoków Wenecji, ale najpierw był przede wszystkim praktyczną przeprawą. Przez stulecia okolica Rialto była centrum handlu, banków i rynku. Tu przychodziło się po towary, informacje i pieniądze.\n\nDzisiejszy kamienny most powstał pod koniec XVI wieku. Wcześniejsze konstrukcje były drewniane i nie zawsze dawały sobie radę z tłumem. Nowy most miał być mocny, reprezentacyjny i dochodowy, dlatego na jego grzbiecie umieszczono rząd sklepów.\n\nWejdźcie na środek i spójrzcie na Canal Grande. Gondole, vaporetto, łodzie dostawcze i taksówki wodne mijają się pod wami jak ruch uliczny w zwykłym mieście. Rialto pokazuje, że w Wenecji kanał był drogą, placem, magazynem i sceną jednocześnie.",
  },
  "rialto-market": {
    name: "Targ Rialto",
    tagline: "Kuchnia laguny",
    text: "Targ Rialto to jedno z miejsc, gdzie Wenecja nadal pachnie codziennym życiem. Rano pojawiają się tu ryby z laguny i Adriatyku, warzywa z okolicznych wysp, owoce, przyprawy i głosy sprzedawców. To nie jest tylko ładny zabytek, ale działający fragment miasta.\n\nPrzez wieki Rialto było gospodarczym sercem Wenecji. W pobliżu załatwiano interesy, wymieniano pieniądze i rozładowywano towary. Rynek pokazuje skromniejszą, ale bardzo ważną stronę republiki: wielka historia potrzebowała codziennych dostaw.\n\nDzieciom warto pokazać nazwy ryb i dziwne kształty owoców morza. Dorośli zobaczą, jak blisko są tu kuchnia, geografia i handel. Najlepiej przyjść rano, zanim stragany zaczną znikać, a okolica zamieni się głównie w trasę spacerową.",
  },
  "grand-canal": {
    name: "Canal Grande",
    tagline: "Główna ulica z wody",
    text: "Canal Grande jest główną ulicą Wenecji, tylko zamiast asfaltu ma wodę. Ma kształt wielkiej litery S i przecina miasto od dworca kolejowego aż po okolice Placu Świętego Marka. Najlepiej poznaje się go z vaporetto, zwykłego wodnego autobusu.\n\nPo obu stronach stoją pałace dawnych rodów kupieckich. Ich najpiękniejsze fasady zwrócone są do kanału, bo to właśnie od wody przybywali goście, towary i wiadomości. Parter często służył jako magazyn, wyższe piętra jako reprezentacyjne mieszkania.\n\nPodczas rejsu warto patrzeć na szczegóły: balkony, herby, marmury, ślady dawnych drzwi wodnych. Canal Grande opowiada historię miasta bez jednej sali muzealnej. Wystarczy usiąść przy oknie i pozwolić, aby Wenecja przesuwała się powoli obok.",
  },
  "ca-doro": {
    name: "Ca' d'Oro",
    tagline: "Złoty dom nad kanałem",
    text: "Ca' d'Oro oznacza Złoty Dom. Dziś fasada jest jasna i elegancka, ale kiedy pałac był nowy, zdobiły ją kolory i pozłota. Musiał wyglądać jak bogata koronka rozciągnięta nad Canal Grande.\n\nPałac powstał w XV wieku dla rodziny Contarini i jest jednym z najpiękniejszych przykładów gotyku weneckiego. Ten styl lubi lekkość, łuki, marmur i rytm powtarzających się okien. Budynek mówi: jesteśmy bogaci, ale mamy dobry gust.\n\nW środku znajduje się dziś galeria sztuki. Nawet jeśli oglądacie tylko fasadę z vaporetto, warto zwrócić uwagę na asymetrię. Wenecjanie nie zawsze szukali idealnej równowagi. Czasem ważniejsze było dopasowanie do działki, kanału i funkcji. Dzięki temu miasto wygląda żywo, nie jak rysunek z linijką.",
  },
  "frari-basilica": {
    name: "Bazylika Frari",
    tagline: "Cegła, cisza i Tycjan",
    text: "Bazylika Frari jest ogromna, ale z zewnątrz prawie surowa. Franciszkanie nie potrzebowali marmurowej fasady jak przy Placu Świętego Marka. Wybrali cegłę, wysokie ściany i przestrzeń, która miała prowadzić myśli ku górze.\n\nW środku czeka jednak jedno z najważniejszych spotkań ze sztuką w Wenecji. Na ołtarzu głównym znajduje się Wniebowzięcie Tycjana, obraz pełen ruchu, czerwieni i światła. W kościele są też grobowce wielkich Wenecjan, w tym samego Tycjana i kompozytora Claudia Monteverdiego.\n\nFrari pokazuje inną Wenecję niż ta z pocztówek: mniej błysku, więcej skupienia. Warto wejść powoli, pozwolić oczom przyzwyczaić się do półmroku i zobaczyć, jak prosty ceglany kościół stał się jednym z najbogatszych skarbców sztuki miasta.",
  },
  "scuola-grande-di-san-rocco": {
    name: "Scuola Grande di San Rocco",
    tagline: "Tintoretto od podłogi po sufit",
    text: "Scuola Grande di San Rocco była siedzibą bractwa religijnego i dobroczynnego. Takie scuole odgrywały w Wenecji wielką rolę: organizowały pomoc, procesje, opiekę i prestiż swoich członków. San Rocco stało się szczególnie ważne, bo święty Roch był patronem chroniącym przed zarazą.\n\nNajwiększym skarbem budynku są obrazy Tintoretta. Artysta pracował tu przez wiele lat i pokrył sale dramatycznymi scenami biblijnymi. Nie ogląda się jednego obrazu, lecz całe otoczenie: ściany, sufit, światło i cień tworzą wielki teatr malarstwa.\n\nTo dobre miejsce, aby odpocząć od spaceru i patrzeć w górę. Weźcie lusterko, jeśli jest dostępne, albo po prostu usiądźcie. San Rocco uczy, że w Wenecji sztuka była nie tylko dekoracją. Była sposobem opowiadania, modlitwy i rywalizacji o pamięć.",
  },
  "ca-rezzonico": {
    name: "Ca' Rezzonico",
    tagline: "Wenecja XVIII wieku",
    text: "Ca' Rezzonico to pałac nad Canal Grande, który przenosi was do Wenecji XVIII wieku. To czas masek, salonów, muzyki, bogatych dekoracji i powolnego końca dawnej republiki. Miasto wciąż było olśniewające, ale jego polityczna potęga słabła.\n\nW muzeum zobaczycie meble, freski, obrazy i wnętrza pokazujące życie arystokracji. Szczególnie ciekawe jest to, że luksus miesza się tu z lekkim niepokojem. Wszystko jest piękne, ale wiemy, że niedługo Napoleon zamknie wielki rozdział historii Wenecji.\n\nDla dzieci może to być pałac wyobraźni: sale jak scenografia, sufity jak niebo, postacie z perukami i maskami. Dla dorosłych to opowieść o mieście, które potrafiło bawić się z niezwykłą elegancją, nawet gdy świat wokół już się zmieniał.",
  },
  "gallerie-accademia": {
    name: "Gallerie dell'Accademia",
    tagline: "Największa lekcja malarstwa Wenecji",
    text: "Gallerie dell'Accademia to najważniejsze miejsce dla tych, którzy chcą zobaczyć, jak Wenecja malowała samą siebie i świat. Znajdują się tu dzieła Belliniego, Giorgionego, Tycjana, Veronesa, Tintoretta i wielu innych artystów związanych z miastem.\n\nWenecjanie kochali kolor, światło i materiał. Ich obrazy często wydają się bardziej zmysłowe niż precyzyjne rysunki florenckie. Woda, tkaniny, złoto, skóra i niebo mają tu niemal fizyczną obecność.\n\nNie trzeba oglądać wszystkiego. Lepiej wybrać kilka sal i patrzeć uważnie. Zauważcie, jak malarze budują dramat gestem, spojrzeniem i kolorem. Accademia pomaga potem inaczej zobaczyć całe miasto, bo fasady, kościoły i kanały zaczynają wyglądać jak część tej samej wielkiej palety.",
  },
  "peggy-guggenheim-collection": {
    name: "Kolekcja Peggy Guggenheim",
    tagline: "Nowoczesność nad Canal Grande",
    text: "Kolekcja Peggy Guggenheim znajduje się w niezwykłym pałacu nad Canal Grande. Budynek jest niski, bo nigdy nie ukończono go według pierwotnych planów. Dzięki temu wygląda inaczej niż sąsiednie palazzi i pasuje do historii właścicielki: osoby niezależnej, odważnej i nieoczywistej.\n\nPeggy Guggenheim kolekcjonowała sztukę XX wieku i wspierała artystów, zanim stali się powszechnie znani. W jej domu można zobaczyć dzieła surrealistów, kubistów i ekspresjonistów abstrakcyjnych. To duża zmiana po złocie bazylik i renesansowych obrazach.\n\nMuzeum pokazuje, że Wenecja nie jest tylko skansenem. Miasto od dawna przyciągało ludzi, którzy chcieli eksperymentować, zbierać i rozmawiać ze światem. Ogród, taras nad kanałem i nowoczesne obrazy tworzą spokojną, ale bardzo świeżą przerwę w zwiedzaniu.",
  },
  "santa-maria-della-salute": {
    name: "Santa Maria della Salute",
    tagline: "Kościół wdzięczności po zarazie",
    text: "Bazylika Santa Maria della Salute stoi przy wejściu do Canal Grande jak wielka kamienna korona. Powstała jako podziękowanie za ocalenie miasta po straszliwej epidemii dżumy w XVII wieku. Sama nazwa Salute oznacza zdrowie i zbawienie.\n\nArchitekt Baldassare Longhena zaprojektował budowlę, którą widać z daleka: okrągła forma, wielka kopuła, schody schodzące do wody. Kościół stał się jednym z najważniejszych elementów panoramy Wenecji.\n\nCo roku 21 listopada odbywa się Festa della Salute. Wenecjanie przechodzą wtedy przez tymczasowy most i zapalają świece, prosząc o zdrowie. To piękny przykład, jak historia miasta nadal żyje w rytuale. Dla odwiedzających Salute jest nie tylko ładnym widokiem, ale pamiątką po strachu, wdzięczności i wspólnocie.",
  },
  "teatro-la-fenice": {
    name: "Teatro La Fenice",
    tagline: "Opera, która powstaje z popiołów",
    text: "Nazwa La Fenice oznacza Feniksa, ptaka, który odradza się z popiołów. W przypadku tego teatru to nie tylko poetycka metafora. Budynek płonął kilkakrotnie, w tym dramatycznie w 1996 roku, a mimo to za każdym razem wracał do życia.\n\nOd końca XVIII wieku La Fenice należała do najważniejszych scen operowych Europy. Wystawiano tu premiery dzieł Rossiniego, Belliniego, Donizettiego i Verdiego. Wenecka publiczność była wymagająca, a sukces w tym teatrze mógł oznaczać wielką karierę.\n\nNawet jeśli nie idziecie na spektakl, warto zobaczyć fasadę i wyobrazić sobie złoty blask sali. La Fenice przypomina, że Wenecja była nie tylko miastem kupców i malarzy. Była także miastem muzyki, głosu, plotek i wieczornego oczekiwania na podniesienie kurtyny.",
  },
  "libreria-acqua-alta": {
    name: "Libreria Acqua Alta",
    tagline: "Książki przygotowane na wysoką wodę",
    text: "Libreria Acqua Alta to księgarnia, która zrobiła z weneckiego problemu część swojego uroku. Ponieważ woda potrafi wejść do wnętrza podczas acqua alta, książki leżą w wannach, łodziach i gondolach. Wygląda to jak żart, ale ma bardzo praktyczny sens.\n\nW środku panuje kontrolowany chaos: stosy książek, koty, pocztówki, mapy, schody z dawnych tomów i widok na kanał. To miejsce nie jest eleganckim muzeum, tylko żywym, ciasnym labiryntem papieru.\n\nWarto jednak pamiętać, że jest popularne i bywa zatłoczone. Najlepiej wejść z cierpliwością, kupić drobiazg, jeśli robicie zdjęcia, i potraktować księgarnię jako lekką przerwę. Pokazuje ona Wenecję codzienną: pomysłową, trochę ekscentryczną i zawsze gotową negocjować z wodą.",
  },
  "venetian-arsenal": {
    name: "Arsenał Wenecki",
    tagline: "Fabryka morskiej potęgi",
    text: "Arsenał był przemysłowym sercem dawnej Wenecji. Za jego murami budowano i wyposażano statki, które dawały republice bogactwo i bezpieczeństwo. W czasach swojej największej sprawności był jednym z najbardziej imponujących kompleksów produkcyjnych Europy.\n\nTo tutaj rzemieślnicy, cieśle, kowale, linarze i urzędnicy pracowali w systemie przypominającym wczesną linię montażową. Wenecja rozumiała, że panowanie na morzu wymaga nie tylko odwagi, ale organizacji, materiałów i logistyki.\n\nDziś wiele części Arsenału nie jest swobodnie dostępnych, ale już sama brama z lwami robi wrażenie. To dobry punkt, aby opowiedzieć dzieciom, że za romantycznymi gondolami stała twarda technologia. Wenecja była piękna, bo była również bardzo praktyczna.",
  },
  "jewish-ghetto-cannaregio": {
    name: "Getto żydowskie i Cannaregio",
    tagline: "Cicha historia północnej Wenecji",
    text: "W Cannaregio znajduje się dawne getto żydowskie, jedno z najważniejszych miejsc pamięci w Wenecji. Samo słowo getto pochodzi właśnie stąd, od nazwy terenu związanego dawniej z odlewnią. Od XVI wieku władze nakazywały Żydom mieszkać w tej wydzielonej części miasta.\n\nPrzestrzeń była ograniczona, więc domy rosły w górę. Warto spojrzeć na nietypowo wysokie budynki i spokojne place. Za prostymi fasadami ukrywały się synagogi różnych wspólnot: niemieckiej, włoskiej, hiszpańskiej i lewantyńskiej.\n\nTo miejsce wymaga spokojnego tonu. Opowiada o przymusie, ale też o kulturze, handlu, nauce i przetrwaniu. Po wyjściu z getta Cannaregio pokazuje mniej zatłoczoną Wenecję: z długimi kanałami, lokalnymi barami i wieczornym życiem mieszkańców.",
  },
  "san-giorgio-maggiore": {
    name: "San Giorgio Maggiore",
    tagline: "Wyspa z najlepszym widokiem",
    text: "San Giorgio Maggiore leży naprzeciw Placu Świętego Marka, ale atmosfera jest tu znacznie spokojniejsza. Krótki rejs wystarczy, aby spojrzeć na Wenecję z dystansu. Nagle Pałac Dożów, bazylika i campanile układają się w panoramę, którą znacie z obrazów i pocztówek.\n\nNajważniejszym budynkiem wyspy jest kościół zaprojektowany przez Andrea Palladia. Jego jasna fasada jest uporządkowana, klasyczna i bardzo inna od bizantyjskiego przepychu Świętego Marka. W środku można zobaczyć obrazy Tintoretta.\n\nNajwiększa nagroda czeka na górze dzwonnicy. Widok obejmuje całe centrum, Giudeccę, Lido i lagunę. To idealny moment, aby zrozumieć, że Wenecja najlepiej wygląda nie tylko z bliska, ale także jako delikatna sylwetka pomiędzy niebem i wodą.",
  },
  "giudecca-redentore": {
    name: "Giudecca i Il Redentore",
    tagline: "Szeroka woda i kościół obietnicy",
    text: "Giudecca leży na południe od głównego centrum Wenecji, po drugiej stronie szerokiego kanału. Jest blisko, ale czuje się inaczej: mniej tu ciasnych ulic, więcej oddechu, warsztatów, domów i widoków na panoramę miasta.\n\nNajważniejszym punktem jest kościół Il Redentore, zaprojektowany przez Palladia. Powstał jako dziękczynienie po epidemii dżumy w XVI wieku. Co roku podczas Festa del Redentore buduje się tymczasowy most przez kanał, a Wenecjanie idą do kościoła w procesji.\n\nGiudecca jest dobra na spokojniejszy spacer. Z nabrzeża widać San Marco jak teatralną dekorację po drugiej stronie wody. To miejsce pokazuje, że Wenecja ma nie tylko centrum pełne zabytków, lecz także dzielnice, gdzie historia miesza się z codziennym rytmem mieszkańców.",
  },
  "murano-glass-museum": {
    name: "Muzeum Szkła na Murano",
    tagline: "Tysiąc lat ognia i piasku",
    text: "Murano od wieków kojarzy się ze szkłem. W średniowieczu przeniesiono tu piece szklarskie z centrum Wenecji, częściowo z obawy przed pożarami, a częściowo po to, by lepiej kontrolować cenne umiejętności rzemieślników.\n\nMuzeum Szkła pokazuje, jak z piasku, ognia i tajemnicy powstawały przedmioty pożądane w całej Europie. Zobaczycie delikatne kielichy, kolorowe paciorki, lustra, eksperymenty techniczne i współczesne formy artystyczne.\n\nDla dzieci najciekawsza jest myśl, że szkło zaczyna jako rozgrzana, miękka masa. Dla dorosłych: że weneckie bogactwo opierało się nie tylko na handlu, ale też na mistrzostwie produkcji. Po muzeum inaczej patrzy się na witryny sklepowe Murano, nawet jeśli nie wszystko, co błyszczy, jest arcydziełem.",
  },
  "santa-maria-san-donato-murano": {
    name: "Santa Maria e San Donato na Murano",
    tagline: "Mozaiki i smocze kości",
    text: "Bazylika Santa Maria e San Donato jest jednym z najpiękniejszych zabytków Murano. Z zewnątrz zachwyca arkadami i ceglaną absydą, a w środku czeka spokojna przestrzeń z mozaikową posadzką, która przypomina kamienny dywan.\n\nKościół ma też opowieść idealną dla dzieci. Za ołtarzem pokazywane są wielkie kości, które tradycja łączyła ze smokiem pokonanym przez świętego Donata. Dziś brzmi to bardziej jak legenda niż nauka, ale właśnie takie historie sprawiały, że średniowieczne kościoły były pełne wyobraźni.\n\nMurano jest znane ze szkła, ale ta bazylika przypomina, że wyspa miała także długą historię religijną i artystyczną. Warto wejść tu po spacerze między sklepami, aby zobaczyć starsze, cichsze oblicze wyspy.",
  },
  "burano-colored-houses": {
    name: "Burano: kolorowe domy i Piazza Galuppi",
    tagline: "Wyspa koloru",
    text: "Burano wygląda, jakby ktoś pomalował wyspę najodważniejszymi kolorami z pudełka. Domy są różowe, zielone, niebieskie, żółte i czerwone, a odbicia w kanałach dodają im drugie życie. Tradycyjnie mówi się, że kolory pomagały rybakom rozpoznać dom we mgle.\n\nCentrum wyspy stanowi Piazza Galuppi, nazwana od kompozytora Baldassare Galuppiego. Wokół placu znajdziecie sklepy, kawiarnie i ślad dawnego rzemiosła koronkarskiego. W oddali widać lekko przechyloną dzwonnicę kościoła San Martino.\n\nNajlepiej odejść kilka ulic od głównego tłumu. Burano szybko staje się spokojniejsze, bardziej domowe. Pamiętajcie, że te kolorowe fasady to nie tylko tło do zdjęć, ale czyjeś mieszkania. Najładniejsza pamiątka z Burano to spokojny spacer i uważne patrzenie.",
  },
  "burano-lace-museum": {
    name: "Muzeum Koronki na Burano",
    tagline: "Cierpliwość zapisana nicią",
    text: "Burano słynie nie tylko z kolorowych domów, ale także z koronki. Muzeum Koronki mieści się przy Piazza Galuppi, w budynku związanym z dawną szkołą koronczarską. To dobre miejsce, aby zrozumieć, ile pracy kryje się w czymś tak lekkim.\n\nKoronka była luksusem, który wymagał czasu, dobrego wzroku i ogromnej cierpliwości. Delikatne wzory powstawały z nici prowadzonej ręką, bez pośpiechu. W muzeum widać, jak rzemiosło łączyło sztukę, modę i ekonomię wyspy.\n\nDla dzieci może to być lekcja uważności: jeden mały błąd potrafi zepsuć wiele godzin pracy. Dla dorosłych to opowieść o kobietach i domowym rzemiośle, które stało się sławne daleko poza laguną. Po wizycie inaczej patrzy się na słowo ręcznie robione.",
  },
  "torcello-basilica": {
    name: "Torcello: Bazylika Santa Maria Assunta",
    tagline: "Początek przed Wenecją",
    text: "Torcello jest dziś ciche i prawie puste, ale kiedyś było jednym z najważniejszych miejsc laguny. Zanim Wenecja stała się potęgą, to tutaj rozwijała się osada, biskupstwo i życie handlowe. Wyspa pomaga wyobrazić sobie początki miasta przed wielką sławą.\n\nNajcenniejszym zabytkiem jest Bazylika Santa Maria Assunta. W środku znajdują się niezwykłe mozaiki, w tym przedstawienie Sądu Ostatecznego. Złoto i ciemne figury robią silne wrażenie, szczególnie po spokojnym spacerze przez zieloną wyspę.\n\nTorcello uczy, że historia nie zawsze zostaje tam, gdzie zaczęła się najwcześniej. Bagna, choroby i zmiany handlowe sprawiły, że znaczenie wyspy zmalało. Dziś jej cisza jest częścią uroku. To miejsce dla tych, którzy chcą usłyszeć starszy, wolniejszy głos laguny.",
  },
  "mazzorbo-venissa": {
    name: "Mazzorbo i winnica Venissa",
    tagline: "Zielona przerwa w lagunie",
    text: "Mazzorbo leży tuż obok Burano i łączy się z nim mostem, ale nastrój jest zupełnie inny. Zamiast kolorowego gwaru znajdziecie tu ciszę, ogrody, murki, wodę i więcej przestrzeni. To dobra przerwa po tłumach.\n\nNajbardziej znanym miejscem jest Venissa, winnica związana z odrodzeniem lokalnej odmiany winogron dorona. Uprawa winorośli w lagunie brzmi zaskakująco, ale Wenecja zawsze korzystała z małych wysp jako ogrodów, sadów i zaplecza żywnościowego.\n\nSpacer po Mazzorbo pokazuje, że laguna to nie tylko pałace i kościoły. To także ziemia, sól, wiatr i praca ludzi, którzy próbują uprawiać rośliny w trudnym środowisku. Najlepiej potraktować tę wyspę jako oddech: kilka wolnych kroków pomiędzy wodą a zielenią.",
  },
  "lido-di-venezia": {
    name: "Lido di Venezia",
    tagline: "Plaża, kino i bariera laguny",
    text: "Lido di Venezia jest długą, wąską wyspą oddzielającą lagunę od Adriatyku. Po stronie laguny przypływają vaporetto, a po drugiej stronie czeka prawdziwa plaża. Po ciasnych ulicach Wenecji sama obecność rowerów, samochodów i szerokich alei może wydać się zaskakująca.\n\nLido zasłynęło jako elegancki kurort przełomu XIX i XX wieku. Powstały tu hotele, kąpieliska i wille, a później także Festiwal Filmowy w Wenecji. To miejsce łączy wakacyjny luz z odrobiną dawnego blasku gwiazd.\n\nDla rodziny Lido może być dniem odpoczynku: spacer, lody, piasek, morze. Jednocześnie wyspa pomaga zrozumieć geografię laguny. Bez takich barier Wenecja nie byłaby chroniona w ten sam sposób. Lido jest więc nie tylko plażą, ale częścią systemu, który stworzył miasto.",
  },
};

const data = JSON.parse(await readFile(SOURCE_PATH, "utf8"));
let updated = 0;
for (const place of data.places) {
  if (!polish[place.id]) throw new Error(`Missing Polish correction for ${place.id}`);
  place.pl = {
    ...place.pl,
    ...polish[place.id],
  };
  updated += 1;
}

await writeFile(SOURCE_PATH, JSON.stringify(data, null, 2) + "\n");
console.log(`Updated Polish diacritics for ${updated} places.`);
