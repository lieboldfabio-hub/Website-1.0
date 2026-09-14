import Held from "../komponenten/Held.jsx";
import Showroom from "../showroom/Showroom.jsx";
import Leistungen from "../komponenten/Leistungen.jsx";
import UeberUns from "../komponenten/UeberUns.jsx";
import Lebenslagen from "../komponenten/Lebenslagen.jsx";
import Kontakt from "../komponenten/Kontakt.jsx";

export default function Startseite() {
  return (
    <>
      <Held />
      <Showroom />
      <Leistungen />
      <Lebenslagen />
      <UeberUns />
      <Kontakt />
    </>
  );
}
