import Dice from "../assets/flaticon/dice.png";
import Banshee from "../assets/flaticon/banshee.png";
import Cyclops from "../assets/flaticon/cyclops.png";
import Devil from "../assets/flaticon/devil.png";
import Ghost from "../assets/flaticon/ghost.png";
import Goblin from "../assets/flaticon/goblin.png";
import Grim from "../assets/flaticon/grim-reaper.png";
import Knight from "../assets/flaticon/knight.png";
import Monster from "../assets/flaticon/monster.png";
import Ninja from "../assets/flaticon/ninja.png";
import Orc from "../assets/flaticon/orc.png";
import Pirate from "../assets/flaticon/pirate.png";
import Vampire from "../assets/flaticon/vampire.png";
import Viking from "../assets/flaticon/viking.png";
import Werewolf from "../assets/flaticon/werewolf.png";
import Wizard from "../assets/flaticon/wizard.png";
import Zombie from "../assets/flaticon/zombie.png";

export interface IconOption {
  key: string;
  label: string;
  src: string;
}

export const ICONS: IconOption[] = [
  { key: "dice", label: "Dado", src: Dice },
  { key: "goblin", label: "Goblin", src: Goblin },
  { key: "orc", label: "Orc", src: Orc },
  { key: "zombie", label: "Zumbi", src: Zombie },
  { key: "werewolf", label: "Lobisomem", src: Werewolf },
  { key: "vampire", label: "Vampiro", src: Vampire },
  { key: "ghost", label: "Fantasma", src: Ghost },
  { key: "banshee", label: "Banshee", src: Banshee },
  { key: "devil", label: "Demônio", src: Devil },
  { key: "grim-reaper", label: "Ceifador", src: Grim },
  { key: "cyclops", label: "Ciclope", src: Cyclops },
  { key: "monster", label: "Monstro", src: Monster },
  { key: "wizard", label: "Mago", src: Wizard },
  { key: "knight", label: "Cavaleiro", src: Knight },
  { key: "viking", label: "Viking", src: Viking },
  { key: "ninja", label: "Ninja", src: Ninja },
  { key: "pirate", label: "Pirata", src: Pirate },
];

export const DEFAULT_ICON = Dice;

export const iconByKey = (key: string) =>
  ICONS.find((icon) => icon.key === key)?.src ?? DEFAULT_ICON;

/**
 * Ícones salvos guardam a URL gerada pelo build (ex.: /assets/goblin-3f9a.png).
 * Se o hash mudar num novo deploy, a URL antiga quebra — então reconhecemos o
 * ícone pelo nome do arquivo e devolvemos a URL atual.
 */
export const resolveIcon = (src?: string | null): string => {
  if (!src) return DEFAULT_ICON;
  if (src.startsWith("data:") || /^https?:\/\//.test(src)) {
    if (ICONS.some((icon) => icon.src === src)) return src;
    if (src.startsWith("data:")) return src;
  }
  const file = src.split("/").pop() ?? "";
  const match = ICONS.find(
    (icon) => file.startsWith(`${icon.key}-`) || file.startsWith(`${icon.key}.`)
  );
  return match ? match.src : src;
};
