import { StickyScroll } from "./ui/sticky-scroll";

const content = [
  {
    title: "Byggelaget",
    description:
      "Lag 1 handler om selve strukturen: bærekraftige materialer, trygg logistikk og et bygg som kan endres over tid. Her viser vi planlagte rammer, bæresystemer og hvordan bygget møter nabolaget i første etasje.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop",
  },
  {
    title: "Omsorgslaget",
    description:
      "Lag 2 zoomer inn på hverdagslivet i huset: omsorgssoner, dagslys, sansehager og stille rom. Vi utforsker hvordan pasienter, pårørende og ansatte får sømløse forløp gjennom døgnet.",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&h=1080&fit=crop",
  },
  {
    title: "Fellesskapslaget",
    description:
      "Lag 3 viser møteplassene: kultur, trening, verksteder og nabolagssamarbeid. Vi legger opp til kveldsaktiviteter, åpne verksteder og fleksible flater som kan endres med behovene i bydelen.",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop",
  },
];

export default function StickyScrollDemo() {
  return <StickyScroll items={content} />;
}
