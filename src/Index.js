import { Takmicar } from "./models/takmicar";
import { ucitavajKviz } from "./services.js";
import { fromEvent } from "rxjs";
import { debounceTime, map, filter, switchMap } from "rxjs/operators";

let takmicari = [
  new Takmicar(1, "Kompjuter1", "Kompjuter"),
  new Takmicar(2, "Kompjuter2", "Kompjuter"),
  new Takmicar(3, "Kompjuter3", "Kompjuter"),
  new Takmicar(4, "Kompjuter4", "Kompjuter"),
  new Takmicar(5, "Inicijalno", "Covek"),
];

const labelIme = document.createElement("label");
labelIme.innerHTML = "Unesite svoje ime";
document.body.appendChild(labelIme);
const inputIme = document.createElement("input");
document.body.appendChild(inputIme);
const labelaUcitavanje = document.createElement("label");
document.body.appendChild(labelaUcitavanje);
var string = "Ucitavanje ";

fromEvent(inputIme, "input")
  .pipe(
    debounceTime(500),
    map((ev) => ev.target.value),
    filter((ime) => ime.length > 2),
    switchMap(() => ucitavajKviz())
  )
  .subscribe((crta) => {
    labelaUcitavanje.innerHTML = string;
    if (string == "Ucitavanje ") {
      setTimeout(() => {
        crtajTakmicare(inputIme.value, takmicari);
        document.body.removeChild(labelIme);
        document.body.removeChild(inputIme);
        document.body.removeChild(labelaUcitavanje);
      }, 4000);
    }
    labelaUcitavanje.innerHTML += crta;
    string = labelaUcitavanje.innerHTML;
  });

function crtajTakmicare(ime, takmicari) {
  takmicari.forEach((takmicar) => {
    if (takmicar.tip == "Covek") takmicar.ime = ime;
    takmicar.crtaj(document.body);
  });
}
export function odluciPobednika() {
  var prvoMesto = takmicari[0];
  takmicari.forEach((takmicar) => {
    if (takmicar.brPoena > prvoMesto.brPoena) prvoMesto = takmicar;
  });
  var delePrvoMesto = new Array();
  takmicari.forEach((takmicar) => {
    if (prvoMesto.brPoena == takmicar.brPoena) delePrvoMesto.push(takmicar.ime);
  });
  if (delePrvoMesto.length == 1) {
    document.body.innerHTML =
      prvoMesto.ime +
      " je pobedio sa osovjenih " +
      prvoMesto.brPoena +
      " poena";
  } else {
    document.body.innerHTML =
      "Prvo mesto dele takmicari " +
      delePrvoMesto +
      " sa osvojenih " +
      prvoMesto.brPoena +
      " poena";
  }
}
