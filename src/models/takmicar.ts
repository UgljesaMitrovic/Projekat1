import {
  nadjiPitanje,
  odbrojavaj,
  dodajPoene,
  resetujPoene,
  izbrojPitanja,
} from "../services";
import { odluciPobednika } from "../index";
import { fromEvent, BehaviorSubject, merge, Observable } from "rxjs";
import { take } from "rxjs/operators";

export class Takmicar {
  id: number;
  ime: string;
  brPoena: number;
  bsPoeni: BehaviorSubject<string>;
  bsPlusPoeni: BehaviorSubject<string>;
  bsMerge: Observable<string>;
  tip: string;
  constructor(id: number, ime: string, tip: string) {
    this.id = id;
    this.ime = ime;
    this.brPoena = 0;
    this.bsPoeni = new BehaviorSubject<string>("");
    this.bsPlusPoeni = new BehaviorSubject<string>("");
    this.bsMerge = merge(this.bsPoeni, this.bsPlusPoeni);
    this.tip = tip;
  }
  crtaj(host: HTMLElement) {
    var idPitanja = 1;
    var bs: BehaviorSubject<string> = new BehaviorSubject<string>("");
    nadjiPitanje(idPitanja, bs);

    let divZaPolje = document.createElement("div");
    divZaPolje.className = "divZaPolje";
    host.appendChild(divZaPolje);

    let pitanjeText = document.createElement("label");
    divZaPolje.appendChild(pitanjeText);

    let divZaOdgovore = document.createElement("div");
    divZaOdgovore.className = "divZaOdgovore";
    divZaPolje.appendChild(divZaOdgovore);

    let labelaZaTimer = document.createElement("label");
    divZaPolje.appendChild(labelaZaTimer);

    let labelaZaPoene = document.createElement("label");
    divZaPolje.appendChild(labelaZaPoene);
    let labelaZaPoene2 = document.createElement("label");
    divZaPolje.appendChild(labelaZaPoene2);
    this.bsMerge.subscribe((x) => (labelaZaPoene.innerHTML = x));

    if (this.tip == "Kompjuter")
      this.subscribeKompjuter(
        divZaOdgovore,
        pitanjeText,
        divZaPolje,
        idPitanja,
        bs
      );
    else {
      this.subscribeCovek(
        divZaOdgovore,
        pitanjeText,
        divZaPolje,
        idPitanja,
        bs,
        labelaZaTimer
      );
    }
    this.novoPitanje(divZaOdgovore, pitanjeText, idPitanja, bs, labelaZaTimer);
  }

  subscribeKompjuter(
    divZaOdgovore: HTMLDivElement,
    pitanjeText: HTMLLabelElement,
    divZaPolje: HTMLDivElement,
    idPitanja: number,
    bs: BehaviorSubject<string>
  ) {
    bs.subscribe((pitanje: any) => {
      pitanje.then((p: any) => {
        this.bsPoeni.next(this.ime + " ima " + this.brPoena + " poena.");

        pitanjeText.innerHTML = p.text;

        p.odgovori.forEach((odgovor: any) => {
          var button = document.createElement("button");
          divZaOdgovore.appendChild(button);
          button.innerHTML = odgovor.text;
          button.className = odgovor.id;
        });
        setTimeout(() => {
          let odgovorPod = Math.floor(Math.random() * 4) + 1;
          var odgovor = p.odgovori.filter((x: any) => x.id == odgovorPod);
          var nadjiDugme = divZaPolje.getElementsByClassName(odgovor[0].id);
          if (odgovor[0].tacno == true) {
            (nadjiDugme[0] as HTMLButtonElement).style.background = "green";
            var br = dodajPoene();
            this.brPoena += br;
            this.bsPlusPoeni.next(
              "Pogodak! + " +
                br +
                ", " +
                this.ime +
                " ima " +
                this.brPoena +
                " poena."
            );
          } else {
            (nadjiDugme[0] as HTMLButtonElement).style.background = "red";
          }
        }, Math.random() * 5 * 1000);
      });
    });
  }
  subscribeCovek(
    divZaOdgovore: HTMLDivElement,
    pitanjeText: HTMLLabelElement,
    divZaPolje: HTMLDivElement,
    idPitanja: number,
    bs: BehaviorSubject<string>,
    labelaZaTimer: HTMLLabelElement
  ) {
    bs.subscribe((pitanje: any) => {
      pitanje.then((p: any) => {
        odbrojavaj().subscribe(
          (x) =>
            (labelaZaTimer.innerHTML = "Preostalo vreme za ovo pitanje: " + x)
        );
        this.bsPoeni.next(this.ime + " ima " + this.brPoena + " poena.");

        pitanjeText.innerHTML = p.text;

        divZaPolje.className = "divZaPoljeCovek";

        p.odgovori.forEach((odgovor: any) => {
          var button = document.createElement("button");
          divZaOdgovore.appendChild(button);
          button.innerHTML = odgovor.text;
          button.className = odgovor.id;
        });
        var buttons = divZaPolje.querySelectorAll("button");

        fromEvent(buttons, "click")
          .pipe(take(1))
          .subscribe((click: any) => {
            var nadjenOdgovor = p.odgovori.find(
              (odgovor: any) => odgovor.id == click.target.className
            );
            if (nadjenOdgovor.tacno == true) {
              click.target.style.background = "green";
              var br = dodajPoene();
              this.brPoena += br;
              this.bsPlusPoeni.next(
                "Pogodak! + " +
                  br +
                  ", " +
                  this.ime +
                  " ima " +
                  this.brPoena +
                  " poena."
              );
            } else {
              click.target.style.background = "red";
            }
          });
      });
    });
  }
  novoPitanje(
    divZaOdgovore: HTMLDivElement,
    pitanjeText: HTMLLabelElement,
    idPitanja: number,
    bs: BehaviorSubject<string>,
    labelaZaTimer: HTMLLabelElement
  ) {
    setTimeout(() => {
      divZaOdgovore.innerHTML = "";
      pitanjeText.innerHTML = "";
      izbrojPitanja().then((pitanja) => {
        if (pitanja.length >= ++idPitanja) {
          this.novoPitanje(
            divZaOdgovore,
            pitanjeText,
            idPitanja,
            bs,
            labelaZaTimer
          );
          nadjiPitanje(idPitanja, bs);
        } else {
          labelaZaTimer.innerHTML = "";
          this.bsPoeni.next(this.ime + " ima " + this.brPoena + " poena.");
          setTimeout(() => odluciPobednika(), 4000);
        }
      });
      resetujPoene();
    }, 7000);
  }
}
