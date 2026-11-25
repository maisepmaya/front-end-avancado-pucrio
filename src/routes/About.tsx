import { Link, useParams } from "react-router-dom";
import type { ReactNode } from "react";
import {
  ArrowSquareOutIcon,
  HouseIcon,
  PencilSimpleIcon,
  ScrollIcon,
} from "@phosphor-icons/react";
import D20 from "../assets/icon.png";
import { isDemoMode } from "../services/api";

interface InfoSection {
  id: string;
  label: string;
  content: ReactNode;
}

const Strong = ({ children }: { children: ReactNode }) => (
  <strong className="font-bold text-brown-800">{children}</strong>
);

const sections: InfoSection[] = [
  {
    id: "introduction",
    label: "Introdução",
    content: (
      <div className="space-y-4">
        <p>
          Se você é mestre de RPG de mesa, já sabe: nada gera mais confusão do
          que gerenciar uma horda de inimigos ao mesmo tempo — cada um com vida,
          nível, armadura, poderes especiais e, claro, aquela capacidade de
          virar a mesa no momento mais dramático da sessão.
        </p>
        <p>
          O HordaMaster nasceu para resolver isso. Você cria, organiza e
          controla seus inimigos em poucos cliques e guarda sua atenção para o
          que importa: <Strong>narrar histórias incríveis</Strong>. Ele também
          se conecta à <Strong>D&D 5e API</Strong>, com centenas de monstros
          prontos de Dungeons & Dragons 5ª edição — você não precisa inventar
          tudo do zero (a menos que queira!).
        </p>
      </div>
    ),
  },
  {
    id: "how",
    label: "Como funciona",
    content: (
      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            icon: <HouseIcon weight="fill" />,
            title: "Mesa de combate",
            to: "/",
            text: (
              <>
                O centro de operações. Escolha fichas em <Strong>Minhas</Strong>{" "}
                ou no bestiário <Strong>D&D 5e</Strong> e cada clique invoca um
                inimigo numerado (Goblin 1, Goblin 2...). Aplique dano, cure,
                anote condições e acompanhe quem já caiu.
              </>
            ),
          },
          {
            icon: <PencilSimpleIcon weight="fill" />,
            title: "Criar ficha",
            to: "/criar",
            text: (
              <>
                Seu laboratório de monstros: nome, nível, pontos de vida, classe
                de armadura, um ícone e anotações. A prévia mostra o cartão
                exatamente como ele vai aparecer na mesa.
              </>
            ),
          },
          {
            icon: <ScrollIcon weight="fill" />,
            title: "Sobre",
            to: "/sobre/introduction",
            text: (
              <>
                Você está aqui! Um resumo do que é o HordaMaster, de onde vêm os
                dados e como aproveitar melhor a ferramenta.
              </>
            ),
          },
        ].map((item) => (
          <Link
            key={item.title}
            to={item.to}
            className="group rounded-xl bg-brown-100 p-4 ring-1 ring-brown-300 transition-all hover:-translate-y-1 hover:shadow-[0_4px_0_var(--color-brown-300)]"
          >
            <span className="mb-2 inline-flex size-9 items-center justify-center rounded-lg bg-brown-700 text-lg text-brown-100">
              {item.icon}
            </span>
            <h3 className="mb-1 text-lg font-bold text-brown-800 group-hover:underline">
              {item.title}
            </h3>
            <p className="text-sm">{item.text}</p>
          </Link>
        ))}
      </div>
    ),
  },
  {
    id: "why",
    label: "Por que usar",
    content: (
      <ul className="grid gap-3 sm:grid-cols-2">
        {[
          ["Organize em segundos", "Uma ficha vira quantas cópias você quiser, já numeradas."],
          ["Tudo à vista", "Vida, CA e anotações de cada inimigo no mesmo cartão."],
          ["Feedback imediato", "O coração racha, o cartão balança e o carimbo de derrota aparece."],
          ["Do seu jeito", "Monstros oficiais do D&D 5e ou criaturas inventadas por você."],
        ].map(([title, text]) => (
          <li key={title} className="rounded-xl bg-brown-100 p-4 ring-1 ring-brown-300">
            <p className="font-bold text-brown-800">{title}</p>
            <p className="text-sm">{text}</p>
          </li>
        ))}
      </ul>
    ),
  },
];

const About = () => {
  const { id } = useParams<{ id: string }>();
  const current = sections.find((section) => section.id === id) ?? sections[0];

  return (
    <main className="absolute inset-0 overflow-y-auto p-4 pb-28 sm:p-10">
      <article
        className="mx-auto flex max-w-4xl flex-col gap-6 rounded-2xl bg-parchment p-5 text-left text-brown-700 shadow-[0_8px_0_var(--color-brown-800),0_20px_40px_rgb(0_0_0/0.45)] ring-4 ring-brown-300 animate-slide-up sm:p-10"
        aria-labelledby="about-title"
      >
        <header className="flex items-center gap-4">
          <img src={D20} alt="" className="w-14 -rotate-12 sm:w-16" />
          <div>
            <h1 id="about-title" className="text-2xl font-bold text-brown-800 sm:text-3xl">
              Sobre o HordaMaster
            </h1>
            <p className="text-brown-600">
              Sua tábua de salvação para batalhas épicas — sem papel rabiscado
              nem conta de cabeça.
            </p>
          </div>
        </header>

        <nav aria-label="Seções" className="flex gap-1 rounded-xl bg-brown-200/70 p-1">
          {sections.map((section) => {
            const active = section.id === current.id;
            return (
              <Link
                key={section.id}
                to={`/sobre/${section.id}`}
                aria-current={active ? "page" : undefined}
                className={`flex-1 rounded-lg px-2 py-2 text-center font-title text-sm font-semibold transition-all sm:text-base ${
                  active
                    ? "bg-brown-700 text-brown-100 shadow-[0_3px_0_var(--color-brown-900)]"
                    : "text-brown-600 hover:bg-brown-100"
                }`}
              >
                {section.label}
              </Link>
            );
          })}
        </nav>

        <section key={current.id} className="min-h-40 animate-fade-in">
          <h2 className="sr-only">{current.label}</h2>
          {current.content}
        </section>

        <footer className="mt-2 flex flex-col gap-3 border-t-2 border-dashed border-brown-300 pt-5 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-bold text-brown-800">
              Crie, invoque, ataque e vença — o HordaMaster cuida do resto.
            </p>
            <p className="text-brown-500">
              Ilustrações originais feitas à mão · ícones de criaturas por Freepik
              {isDemoMode && " · modo demonstração: seus dados ficam salvos neste navegador"}
            </p>
          </div>
          <a
            href="https://www.dnd5eapi.co/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-lg bg-brown-700 px-3 py-2 font-bold text-brown-100 shadow-[0_3px_0_var(--color-brown-900)] hover:bg-brown-600"
          >
            Conhecer a D&D 5e API <ArrowSquareOutIcon weight="bold" />
          </a>
        </footer>
      </article>
    </main>
  );
};

export default About;
