import { Takmicar } from "./models/takmicar";
import { odbrojavaj } from "./services.js";
import { BehaviorSubject, fromEvent, timer } from "rxjs";
import {
  debounceTime,
  map,
  filter,
  switchMap,
  takeWhile,
  tap,
} from "rxjs/operators";

const labelIme = document.createElement("label");
labelIme.innerHTML = "Unesite svoje ime";
document.body.appendChild(labelIme);
const inputIme = document.createElement("input");
document.body.appendChild(inputIme);
const labelaTimer = document.createElement("label");
document.body.appendChild(labelaTimer);

fromEvent(inputIme, "input")
  .pipe(
    debounceTime(500),
    map((ev) => ev.target.value),
    filter((ime) => ime.length >= 3),
    switchMap(() => odbrojavaj())
  )
  .subscribe((timer) => {
    labelaTimer.innerHTML = "Kviz krece za " + timer;
    if (timer == 0) {
      crtajTakmicare(inputIme.value);
      document.body.removeChild(labelIme);
      document.body.removeChild(inputIme);
      document.body.removeChild(labelaTimer);
    }
  });

function crtajTakmicare(ime) {
  let takmicar1 = new Takmicar(1, "Pera", "Kompjuter");
  let takmicar2 = new Takmicar(2, "Mika", "Kompjuter");
  let takmicar3 = new Takmicar(3, "Janko", "Kompjuter");
  let takmicar4 = new Takmicar(4, "Petko", "Kompjuter");
  let takmicar5 = new Takmicar(5, ime, "Covek");

  takmicar1.crtaj(document.body);
  takmicar2.crtaj(document.body);
  takmicar3.crtaj(document.body);
  takmicar4.crtaj(document.body);
  takmicar5.crtaj(document.body);
}

//napravis observable sa imenima i svakom od njih sa map dodas broj bodova?
//komituj ako si siguran da ovo valja pa nastavi da radis
