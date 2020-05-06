import {
  Observable,
  from,
  of,
  BehaviorSubject,
  interval,
  zip,
  timer,
} from "rxjs";
import { switchMap, tap, takeUntil } from "rxjs/operators";

export function nadjiPitanje(id, bs) {
  bs.next(
    fetch("http://localhost:3000/pitanja/" + id)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Pitanje nije nadjeno"); //pravis ga ovde i saljes u catch
          //bs.switchMap()
        } else {
          return response.json();
        }
      })
      .catch((err) => console.log(`Error `, err))
  );
  return bs;
}
const $timer = interval(1000);
const $numbers = from([5, 4, 3, 2, 1, 0]);
export function odbrojavaj() {
  return zip($timer, $numbers, (time, number) => number);
}
