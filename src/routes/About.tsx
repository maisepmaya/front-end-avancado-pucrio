import { CaretRightIcon, SwordIcon } from "@phosphor-icons/react";
import { Link, useNavigate, useParams } from "react-router-dom";
import SquareButton from "../components/SquareButton";

const About = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const infos = {
    introduction: (
      <div className="space-y-4">
        <p>
          Se você é mestre de RPG de mesa, já sabe: nada gera mais confusão do
          que gerenciar uma horda de inimigos ao mesmo tempo — cada um com vida,
          nível, armadura, poderes especiais e, claro, aquela capacidade de
          virar a mesa no momento mais dramático da sessão.
        </p>
        <p>
          Foi para resolver exatamente isso que o HordaMaster nasceu! Com ele,
          você cria, organiza e gerencia seus inimigos em poucos cliques,
          deixando todo seu foco para o que realmente importa: narrar histórias
          incríveis para seu grupo. O HordaMaster se integra com a{" "}
          <span className="font-semibold">D&amp;D 5e API</span>, que fornece
          informações de criaturas, classes e monstros do universo de Dungeons
          &amp; Dragons 5ª edição. Assim, você não precisa inventar tudo do zero
          (a menos que queira!).
        </p>

        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2">
            Saiba mais sobre o HordaMaster
          </h3>
          <div className="flex justify-evenly p-2">
            <div
              className={
                "transition-all cursor-pointer p-2 bg-brown-600 rounded text-brown-100 text-center hover:scale-105"
              }
            >
              <Link to="/sobre/how">Como funciona?</Link>
            </div>
            <div
              className={
                "transition-all cursor-pointer p-2 bg-brown-600 rounded text-brown-100 text-center hover:scale-105"
              }
            >
              <Link to="/sobre/why">Por que usar?</Link>
            </div>
          </div>
        </div>
      </div>
    ),
    how: (
      <div className="flex flex-col gap-4">
        {/* Como funciona */}
        <div>
          <h3 className="text-xl font-semibold flex gap-2">
            ⚔️ Como funciona?
          </h3>
          <p>
            O HordaMaster é dividido em três áreas principais, cada uma pensada
            para facilitar sua vida de narrador:
          </p>
        </div>
        {/* Página Principal */}
        <div>
          <h4 className="text-lg font-semibold flex items-center gap-2">
            <p className="mt-2">🏠 Página Principal</p>
            <ButtonNavigate
              onClick={() => {
                navigate("/");
              }}
            />
          </h4>
          <p>
            É o centro de operações do mestre. Aqui você encontra
            <span className="font-semibold"> Minhas Fichas</span> — sua coleção
            de fichas criadas ou
            <span className="font-semibold"> Procura por Fichas </span>
            diretamente da API. A partir delas, você adiciona inimigos ao
            <span className="font-semibold"> Grid de Combate</span>, que os
            organiza automaticamente com nomes numerados (ex.: Goblin 1, Goblin
            2...).
          </p>
          <p>
            Durante o combate, é aqui que a mágica acontece: você pode editar os
            pontos de vida, acompanhar quem ainda está vivo ou quem já virou
            história e até remover ou resetar tudo com um clique quando a luta
            terminar. Sem bagunça, sem papel, sem risco de esquecer quem
            apanhou!
          </p>
        </div>
        {/* Página Criar Ficha */}
        <div>
          <h4 className="text-lg font-semibold flex items-center gap-2">
            <p className="mt-2"> ✏️ Página Criar Ficha</p>
            <ButtonNavigate
              onClick={() => {
                navigate("/criar");
              }}
            />
          </h4>

          <p>
            É o seu laboratório de monstros! Nesta área, você cria fichas de
            inimigos do jeito que quiser:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Escolha o nome do inimigo;</li>
            <li>Defina nível, pontos de vida e classe de armadura (CA);</li>
            <li>Adicione um ícone para identificar no grid;</li>
            <li>
              Insira informações adicionais para lembrar habilidades ou
              comportamentos especiais.
            </li>
          </ul>
          <p>
            Quando estiver satisfeito, basta clicar em{" "}
            <span className="font-semibold">Salvar</span> para guardar sua ficha
            — ela aparecerá automaticamente na Página Principal, dentro de{" "}
            <span className="font-semibold">Minhas Fichas</span>. Se mudar de
            ideia, é só no botão{" "}
            <span className="font-semibold"> com o simbolo de lixeira </span> e
            se livrar de fichas que não usa mais.
          </p>
        </div>
        {/* Página Sobre */}
        <div>
          <h4 className="text-lg font-semibold flex items-center gap-2">
            <p className="mt-2"> 📜 Página Sobre</p>
            <ButtonNavigate
              onClick={() => {
                navigate("/about/introduction");
              }}
            />
          </h4>

          <p>
            Aqui você está agora! Neste cantinho, você descobre como o
            HordaMaster funciona, qual problema ele resolve, de onde vêm os
            dados e dicas de como aproveitar ao máximo a ferramenta para tornar
            suas sessões mais fluidas, imersivas e livres de bagunça.
          </p>
        </div>
      </div>
    ),
    why: (
      <div>
        <h3 className="text-xl font-semibold flex items-center gap-2">
          🎲 Por que usar o HordaMaster?
        </h3>

        <ul className="list-disc  pl-6 space-y-1">
          <li>Organize inimigos em segundos.</li>
          <li>Edite vida e atributos em tempo real.</li>
          <li>Pegue fichas prontas de D&amp;D 5e ou crie tudo do seu jeito.</li>
          <li>
            Foque no que importa: narrar aventuras incríveis para seu grupo!
          </li>
        </ul>
      </div>
    ),
  };

  return (
    <div className="size-full p-4 sm:p-16 flex items-center justify-center">
      <div className="flex justify-center items-center size-full relative max-w-6xl">
        <div className="absolute text-brown-800 text-start inset-0 p-4  sm:p-10 w-full flex flex-col gap-6 bg-brown-200 rounded-lg shadow-lg shadown-brown-900 overflow-auto">
          {/* Título */}
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              {id != "introduction" && (
                <ButtonNavigate
                  onClick={() => navigate("/sobre/introduction")}
                  position="left"
                />
              )}
              🗡️ Sobre o HordaMaster
            </h2>
            <p>
              O HordaMaster é a sua tábua de salvação para controlar batalhas
              épicas de RPG sem enlouquecer no meio de papéis rabiscados e
              cálculos de última hora!
            </p>
          </div>
          {id && infos[id]}
          {/* Encerramento */}
          <div className="text-center flex flex-col gap-2">
            <p className="font-bold">
              Chega de tabelas improvisadas: controle sua horda como um
              verdadeiro mestre.
            </p>
            <p className="italic">
              Crie, invoque, ataque e vença — o HordaMaster cuida do resto!
            </p>

            <div className="flex w-full items-center gap-2 justify-center">
              <p className="text-sm">
                Clique aqui para conhecer a API utilizada:
              </p>
              <SquareButton
                onClick={() => window.open("https://www.dnd5eapi.co/")}
                icon={<SwordIcon size={30} className="fill-brown-200" />}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ButtonNavigate = ({
  onClick,
  position = "right",
}: {
  onClick: () => void;
  position?: "left" | "right";
}) => {
  return (
    <button
      className={`transition-all p-1 rounded-md bg-brown-700 hover:scale-105 active:scale-95 ${
        position === "right" ? "rotate-0" : "rotate-180"
      }`}
      onClick={onClick}
    >
      <CaretRightIcon size={15} weight="fill" className="fill-brown-200" />
    </button>
  );
};

export default About;
