import { nadjiPitanje } from "../services.js";
import { Observable, from } from "rxjs";
export class Takmicar {
  constructor(id, ime) {
    this.id = id;
    this.ime = ime;
  }
  crtaj(host) {
    var obsPitanje = nadjiPitanje(1);

    let divZaPolje = document.createElement("div");
    divZaPolje.className = "divZaPolje";
    host.appendChild(divZaPolje);

    let pitanjeText = document.createElement("label");
    obsPitanje.subscribe((pitanje) => (pitanjeText.innerHTML = pitanje.text));
    divZaPolje.appendChild(pitanjeText);

    let divZaOdgovore = document.createElement("div");
    divZaOdgovore.className = "divZaOdgovore";
    divZaPolje.appendChild(divZaOdgovore);

    obsPitanje.subscribe((pitanje) =>
      pitanje.odgovori.forEach((odgovor) => {
        var button = document.createElement("button");
        divZaOdgovore.appendChild(button);
        button.innerHTML = odgovor.text;
      })
    );
  }
}
