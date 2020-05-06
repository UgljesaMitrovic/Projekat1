import { nadjiPitanje, odbrojavaj } from "../services.js";
import { Observable, from, BehaviorSubject } from "rxjs";
import { filter, switchMap } from "rxjs/operators";
export class Takmicar {
  constructor(id, ime, tip) {
    this.id = id;
    this.ime = ime;
    this.brPoena = 0;
    this.tip = tip;
  }
  crtaj(host, bs) {
    var idPitanja = 1;
    var bs = new BehaviorSubject();
    var sub = nadjiPitanje(idPitanja, bs);

    let divZaPolje = document.createElement("div");
    divZaPolje.className = "divZaPolje";
    host.appendChild(divZaPolje);

    let pitanjeText = document.createElement("label");
    divZaPolje.appendChild(pitanjeText);

    let labelaZaTimer = document.createElement("label");
    divZaPolje.appendChild(labelaZaTimer);

    if (this.tip == "Kompjuter")
      this.subscribeKompjuter(sub, divZaPolje, pitanjeText, idPitanja, bs);
    else
      this.subscribeCovek(
        sub,
        divZaPolje,
        pitanjeText,
        idPitanja,
        bs,
        labelaZaTimer
      );
  }

  subscribeKompjuter(sub, divZaPolje, pitanjeText, idPitanja, bs) {
    sub.subscribe((pitanje) => {
      pitanje.then((p) => {
        pitanjeText.innerHTML = p.text;

        let divZaOdgovore = document.createElement("div");
        divZaOdgovore.className = "divZaOdgovore";
        divZaPolje.appendChild(divZaOdgovore);

        p.odgovori.forEach((odgovor) => {
          var button = document.createElement("button");
          divZaOdgovore.appendChild(button);
          button.innerHTML = odgovor.text;
          button.className = odgovor.id;
        });
        setTimeout(() => {
          var odgovorPod = parseInt(Math.random() * 4) + 1;
          var odgovor = p.odgovori.filter((x) => x.id == odgovorPod);
          var nadjiDugme = divZaPolje.getElementsByClassName(odgovor[0].id);
          if (odgovor[0].tacno == true) {
            nadjiDugme[0].style.background = "green";
          } else nadjiDugme[0].style.background = "red";
        }, Math.random() * 6 * 1000);
        setTimeout(() => {
          divZaOdgovore.innerHTML = "";
          nadjiPitanje(++idPitanja, bs);
        }, 6000);
      });
    });
  }
  subscribeCovek(sub, divZaPolje, pitanjeText, idPitanja, bs, labelaZaTimer) {
    sub.subscribe((pitanje) => {
      pitanje.then((p) => {
        odbrojavaj().subscribe(
          (x) =>
            (labelaZaTimer.innerHTML = "Preostalo vreme za ovo pitanje: " + x)
        );

        pitanjeText.innerHTML = p.text;

        let divZaOdgovore = document.createElement("div");
        divZaOdgovore.className = "divZaOdgovore";
        divZaPolje.appendChild(divZaOdgovore);

        p.odgovori.forEach((odgovor) => {
          var button = document.createElement("button");
          divZaOdgovore.appendChild(button);
          button.innerHTML = odgovor.text;
          button.className = odgovor.id;
          button.onclick = () => {
            if (odgovor.tacno == true) button.style.background = "green";
            else button.style.background = "red";
          };
        });
        setTimeout(() => {
          divZaOdgovore.innerHTML = "";
          nadjiPitanje(++idPitanja, bs);
        }, 6000);
      });
    });
  }
}
