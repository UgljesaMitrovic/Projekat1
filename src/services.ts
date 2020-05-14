import {
  from,
  interval,
  zip,
  Subject,
  BehaviorSubject,
  SubscribableOrPromise,
} from "rxjs";
import { takeUntil, map } from "rxjs/operators";

export function izbrojPitanja() {
  return fetch("http://localhost:3000/pitanja").then((response) => {
    if (response.ok) {
      return response.json();
    } else console.log("nece nesto");
  });
}

var emiterZaUcitavanjeKviza = new Subject();

export function nadjiPitanje(id: number, bs: BehaviorSubject<any>) {
  if (id == 1) {
    emiterZaUcitavanjeKviza.next("Stopiraj ucitavanje");
  }
  bs.next(
    fetch("http://localhost:3000/pitanja/" + id)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Nije nadjeno pitanje");
        } else {
          return response.json();
        }
      })
      .catch((err) => console.log(`Error `, err))
  );
}

const $timer = interval(1000);
const $numbers = from([6, 5, 4, 3, 2, 1, 0]);
export function odbrojavaj() {
  return zip($timer, $numbers, (time, number) => number);
}
var maxPoeni = 5;
export function dodajPoene() {
  return maxPoeni--;
}
export function resetujPoene() {
  maxPoeni = 5;
}
export function ucitavajKviz() {
  return interval(100).pipe(
    map((x: any) => (x = "/")),
    takeUntil(emiterZaUcitavanjeKviza)
  );
}
