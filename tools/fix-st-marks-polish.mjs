import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SOURCE_PATH = path.join(ROOT, "content", "places.source.json");

const data = JSON.parse(await readFile(SOURCE_PATH, "utf8"));
const place = data.places.find((item) => item.id === "st-marks-square");
if (!place) throw new Error("st-marks-square not found");

place.pl.name = "Plac Świętego Marka";
place.pl.text = "Stoicie na jedynym placu w Wenecji, który nosi nazwę piazza. Każdy inny plac w mieście to campo. Przez ponad tysiąc lat to miejsce było wielką sceną republiki: tu przechodziły procesje, tu władza pokazywała swój przepych, a pod arkadami spotykali się kupcy, pielgrzymi i ciekawscy przybysze.\n\nRozejrzyjcie się powoli. Z jednej strony błyszczy Bazylika Świętego Marka, z drugiej stoją długie skrzydła dawnych prokuracji, czyli urzędów najważniejszych ludzi republiki. Napoleon miał nazwać ten plac salonem Europy i łatwo zrozumieć dlaczego: wszystko jest tu ustawione jak dekoracja teatralna.\n\nPlac ma też praktyczną tajemnicę. Leży bardzo nisko, dlatego podczas acqua alta woda potrafi wypłynąć przez odpływy i zamienić kamienną posadzkę w płytkie lustro. Najlepiej przejść się wzdłuż arkad, posłuchać kawiarnianych orkiestr i wyobrazić sobie, że przez chwilę stoicie w sercu dawnej morskiej potęgi.";

await writeFile(SOURCE_PATH, JSON.stringify(data, null, 2) + "\n");
console.log("Updated Polish diacritics for st-marks-square.");
