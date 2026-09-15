/*
  Die Stationen der Ausstellung: Immobilienarten, nicht Leistungen.

  Was hier steht, ist bewusst **kein Angebot**. Es sind die Objektarten, die
  Marion Sens betreut, und das, worauf es bei jeder von ihnen in Augsburg
  ankommt. Erfundene Objekte mit Quadratmetern und Preisen wären bei einem
  realen Maklerbüro irreführende Werbung — echte Objekte gehören hier hinein,
  sobald sie vorliegen, und dann mit Bildern und Energieangaben.

  Die Zeichnungen (`motiv`) stammen aus `bausteine/Motiv.jsx` und sind hier
  nach dem gezeigten Gebäudetyp zugeordnet, nicht mehr nach der Leistung.

  Der Knopf (`weg`) führt zu der Leistung, die zu diesem Objekttyp am ehesten
  gesucht wird.
*/
export const stationen = [
  {
    nummer: "01",
    kategorie: "Einfamilienhaus",
    titel: "Das Haus, in dem eine Familie groß geworden ist",
    text: "Der häufigste Fall in Augsburgs Randlagen — und der mit dem größten Gefühlsanteil. Beim Preis entscheidet selten die Wohnfläche allein: Grundstückszuschnitt, Baujahr, der energetische Zustand und die Frage, wie sich das Haus umbauen lässt, wenn die Kinder aus sind.",
    weg: "/immobilienbewertung",
    aufruf: "Wert ermitteln lassen",
    motiv: "bewertung",
  },
  {
    nummer: "02",
    kategorie: "Eigentumswohnung",
    titel: "Vier Wände mit einer Gemeinschaft dahinter",
    text: "Bei einer Wohnung verkauft man nicht nur Räume, sondern auch die Eigentümergemeinschaft. Teilungserklärung, Protokolle, Rücklage und anstehende Beschlüsse gehören deshalb von Anfang an auf den Tisch — sie entscheiden über den Preis mit.",
    weg: "/immobilienverkauf",
    aufruf: "Zum Verkauf",
    motiv: "vermietung",
  },
  {
    nummer: "03",
    kategorie: "Doppelhaushälfte",
    titel: "Eine Wand, zwei Eigentümer",
    text: "Doppelhaushälften und Reihenendhäuser sind in Göggingen, Haunstetten und Neusäß stark gefragt. Wo zwei Parteien an einer Wand hängen, lohnt der Blick in Grundbuch und Nachbarvereinbarungen, bevor der erste Interessent kommt.",
    weg: "/immobilienverkauf",
    aufruf: "Zum Verkauf",
    motiv: "mediation",
  },
  {
    nummer: "04",
    kategorie: "Mehrfamilienhaus",
    titel: "Wenn die Immobilie arbeiten soll",
    text: "Bei einem Anlageobjekt zählt nicht der erste Eindruck, sondern die Zahlenreihe dahinter: Mieterträge, Laufzeiten, Instandhaltungsstau, Rendite nach Kosten. Käufer rechnen hier, statt sich zu verlieben — und erwarten Unterlagen, die das aushalten.",
    weg: "/immobilienvermietung",
    aufruf: "Zur Vermietung",
    motiv: "verkauf",
  },
  {
    nummer: "05",
    kategorie: "Grundstück",
    titel: "Was auf diesem Boden entstehen darf",
    text: "Ein Grundstück ist so viel wert, wie darauf gebaut werden darf. Bebauungsplan, Erschließung, Altlastenverdacht und Baulasten bestimmen den Preis — und alles davon lässt sich vor der Vermarktung klären statt danach.",
    weg: "/beratung",
    aufruf: "Beraten lassen",
    motiv: "beratung",
  },
  {
    nummer: "06",
    kategorie: "Altbau",
    titel: "Häuser mit Vergangenheit und Auflagen",
    text: "Augsburgs Bestand reicht weit zurück. Bei Altbauten entscheiden Dämmung, Heizung und die Anforderungen des Gebäudeenergiegesetzes darüber, was ein Käufer noch investieren muss — und damit darüber, was er zu zahlen bereit ist.",
    weg: "/energieausweis",
    aufruf: "Zum Energieausweis",
    motiv: "raum",
  },
  {
    nummer: "07",
    kategorie: "Geerbtes Haus",
    titel: "Das Objekt, für das mehrere unterschreiben müssen",
    text: "Geerbte Häuser stehen oft jahrelang still, weil sich eine Erbengemeinschaft nicht einigt oder niemand weiß, wo anzufangen ist. Hier geht es zuerst um Unterlagen und um ein Gespräch — und erst danach um einen Preis.",
    weg: "/immobilienmediation",
    aufruf: "Zur Mediation",
    motiv: "betreuung",
  },
];
