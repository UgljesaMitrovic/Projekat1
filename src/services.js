import { Observable, from, of } from "rxjs";
import { map, takeUntil, timeout } from "rxjs/operators";

export function nadjiPitanje(id) {
  return from(
    fetch("http://localhost:3000/pitanja/" + id)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Pitanje nije nadjeno");
        } else {
          return response.json();
        }
      })
      .catch((err) => console.log(`Error `, err))
  );
}
