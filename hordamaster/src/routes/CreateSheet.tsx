import { ChangeEvent, FormEvent, useState } from "react";
import { createPortal } from "react-dom";
import SheetBar from "../components/SheetBar";
import ImgDiv from "../components/ImgDiv";
import { FormSelect, FormInput, FormTextarea } from "../components/Form";
import { CaretDownIcon } from "@phosphor-icons/react";

import Dice from "./../assets/flaticon/dice.png";
import Banshee from "./../assets/flaticon/banshee.png";
import Cyclops from "./../assets/flaticon/cyclops.png";
import Devil from "./../assets/flaticon/devil.png";
import Ghost from "./../assets/flaticon/ghost.png";
import Goblin from "./../assets/flaticon/goblin.png";
import Grim from "./../assets/flaticon/grim-reaper.png";
import Knight from "./../assets/flaticon/knight.png";
import Monster from "./../assets/flaticon/monster.png";
import Ninja from "./../assets/flaticon/ninja.png";
import Orc from "./../assets/flaticon/orc.png";
import Pirate from "./../assets/flaticon/pirate.png";
import Vampire from "./../assets/flaticon/vampire.png";
import Viking from "./../assets/flaticon/viking.png";
import Werewolf from "./../assets/flaticon/werewolf.png";
import Wizard from "./../assets/flaticon/wizard.png";
import Zombie from "./../assets/flaticon/zombie.png";

import SheetFold from "./../assets/sheet-fold-90.png";
import ButtonDefault from "../components/ButtonDefault";
import useSheet from "../contexts/SheetContext/useSheet";
import { SheetCreation } from "../types/Sheet";
import ConfirmModal from "../components/ConfirmModal";
import useCard from "../contexts/CardContext/useCard";

const icons = [
  { value: Dice, label: "Dado" },
  { value: Banshee, label: "Banshee" },
  { value: Cyclops, label: "Ciclope" },
  { value: Devil, label: "Demônio" },
  { value: Ghost, label: "Fantasma" },
  { value: Goblin, label: "Goblin" },
  { value: Grim, label: "Ceifador" },
  { value: Knight, label: "Cavalheiro" },
  { value: Monster, label: "Monstro" },
  { value: Ninja, label: "Ninja" },
  { value: Orc, label: "Orc" },
  { value: Pirate, label: "Pirata" },
  { value: Vampire, label: "Vampiro" },
  { value: Viking, label: "Viking" },
  { value: Werewolf, label: "Lobisomem" },
  { value: Wizard, label: "Mago" },
  { value: Zombie, label: "Zumbi" },
];

interface FormErrors {
  name?: string;
  level?: string;
  life?: string;
  ac?: string;
  icon?: string;
}

const CreateSheet: React.FC = () => {
  const { handleCreate, handleDelete } = useSheet();
  const { handleRemoveBySheetId } = useCard();
  const [modal, openModal] = useState({ active: false, param: "" });

  const handleDeleteSheet = (sheetId: string) => {
    handleDelete(sheetId);
    handleRemoveBySheetId(sheetId);
  };

  return (
    <div className="absolute inset-0 flex flex-row">
      {modal.active &&
        createPortal(
          <ConfirmModal
            onClose={() => openModal((prev) => ({ ...prev, active: false }))}
            onConfirm={() => handleDeleteSheet(modal.param)}
            title="Deletar Ficha"
            text={
              "Deseja realmente apagar esta ficha? Todos os cartões vinculados a ela serão apagados junto."
            }
          />,
          document.body
        )}

      {/* SideBar */}
      <SheetBar
        handleDeleteItem={(param) => openModal({ param, active: true })}
      />

      {/* Form */}
      <SheetForm handleCreate={handleCreate} />
    </div>
  );
};

const SheetForm = ({
  handleCreate,
}: {
  handleCreate: (sheet: SheetCreation) => boolean;
}) => {
  const [errors, setErrors] = useState<FormErrors>({});
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<SheetCreation>({
    name: "",
    level: "1",
    life: "1",
    ac: "1",
    info: "",
    icon: Dice,
  });
  const [modal, openModal] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    } else if (form.name.length > 120) {
      newErrors.name = "Nome deve ter no máximo 120 caracteres";
    }
    if (!form.level || Number(form.level) < 0 || Number(form.level) > 9999) {
      newErrors.level = "Nível deve estar entre 0 e 100";
    }
    if (!form.ac || Number(form.ac) < 1 || Number(form.ac) > 9999) {
      newErrors.ac = "CA deve estar entre 1 e 100";
    }

    if (!form.life || Number(form.life) < 1 || Number(form.life) > 9999) {
      newErrors.life = "Vida deve estar entre 1 e 5000";
    }
    if (!form.icon) {
      newErrors.icon = "Ícone é obrigatório";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      handleCreate(form);
      setForm({
        name: "",
        level: "1",
        life: "1",
        ac: "1",
        info: "",
        icon: Dice,
      });
      openModal(true);
    }
  };

  return (
    <>
      {/* Modal */}
      {modal &&
        createPortal(
          <ConfirmModal
            title="Ficha Criada"
            onClose={() => openModal(false)}
            text={"Sua ficha foi criada com sucesso!"}
          />,
          document.body
        )}

      {/* Form */}
      <div className="w-full flex justify-center">
        <div className="flex w-full sm:w-auto group items-center justify-center transition-all align-center lg:w-2xl 2xl:w-4xl 2xl:h-160">
          <div className="size-full p-3 relative sm:pt-16 sm:pr-10 overflow-y-auto overflow-x-hidden">
            <div className="transition-all z-5 sm:min-w-sm relative bg-tag-bg w-full rounded-lg shadow-lg">
              {/* Header */}
              <div
                onClick={() => setOpen((prev) => !prev)}
                className="hidden sm:flex absolute h-24 -top-12 -left-1 -right-10 z-5 active:brightness-95 cursor-pointer"
              >
                <div className="bg-brown-900 -right-5 -left-7 h-full -top-10 absolute"></div>
                <div className="size-full">
                  <ImgDiv src={SheetFold} className="size-full" />
                </div>
                <div className="z-80 text-brown-700 flex items-center justify-between absolute font-bold text-xl left-25 xl:left-28 right-8 top-5">
                  Criar Ficha
                  <CaretDownIcon
                    weight={open ? "fill" : "bold"}
                    className={`text-brown-700 group-hover:rotate-180 transition-transform ${
                      open ? "rotate-180" : "rotate-0"
                    }`}
                    size={24}
                  />
                </div>
              </div>

              {/* Content */}
              <div
                className={`transition-all w-full p-8 ${
                  !open && "sm:p-0 sm:max-h-0 sm:group-hover:max-h-160"
                } sm:group-hover:p-8 overflow-hidden shadow-lg shadow-brown-900`}
              >
                <div className="flex sm:hidden z-80 text-brown-700 items-center justify-center font-bold text-xl mb-4">
                  Criar Ficha
                </div>

                <form className="space-y-4">
                  {/* Name */}
                  <FormInput
                    label="Nome"
                    id="sheet-name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    maxLength={120}
                    placeholder="Insira o nome do personagem..."
                    className={`bg-brown-400 text-brown-100 placeholder:text-brown-200 ${
                      errors.name && "ring-red-800 ring-2"
                    }`}
                  />
                  <div className="w-full flex justify-between flex-row-reverse">
                    <p className="text-brown-300 text-xs text-end mt-1">
                      {form.name.length}/120
                    </p>
                    {errors.name && (
                      <p className="text-red-800 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Level / Life / AC */}
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                    {["level", "life", "ac"].map((field) => (
                      <div key={field}>
                        <FormInput
                          label={
                            field === "level"
                              ? "Nível"
                              : field === "life"
                              ? "Vida"
                              : "CA"
                          }
                          id={`sheet-${field}`}
                          name={field}
                          type="number"
                          value={form[field as keyof FormData]}
                          onChange={handleChange}
                          min={field === "level" ? "0" : "1"}
                          max={field === "life" ? "50000" : "100"}
                          className={`bg-brown-400 text-brown-100 ${
                            errors[field as keyof FormErrors] &&
                            "ring-red-800 ring-2"
                          }`}
                        />
                        {errors[field as keyof FormErrors] && (
                          <p
                            key={field}
                            className="text-red-800 text-start w-full text-xs mt-1"
                          >
                            {errors[field as keyof FormErrors]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Image and Information */}
                  <div className="flex flex-col sm:flex-row justify-center items-start gap-4 w-full">
                    <div className="flex flex-col items-center w-full sm:w-1/4">
                      <label
                        htmlFor="sheet-select-image"
                        className="mb-2 text-sm font-medium text-brown-700"
                      >
                        Ícone:
                      </label>
                      <div className="w-16 h-16 bg-brown-900 rounded shadow border-4 border-brown-400 mb-2">
                        <img
                          src={form.icon}
                          alt="Icon"
                          className="p-2 w-full h-full object-contain"
                        />
                      </div>
                      <FormSelect
                        name="icon"
                        id="sheet-select-image"
                        value={form.icon}
                        optionList={icons.map((icon) => ({
                          value: icon.value,
                          label: icon.label,
                        }))}
                        onChange={handleChange}
                        className="bg-brown-400 text-brown-100"
                      />
                      {errors.icon && (
                        <p className="text-red-800 text-xs mt-1">
                          {errors.icon}
                        </p>
                      )}
                    </div>

                    <div className="w-full sm:w-3/4">
                      <FormTextarea
                        label="Informações"
                        id="sheet-info"
                        name="info"
                        value={form.info}
                        onChange={handleChange}
                        rows={4}
                        className="bg-brown-400 text-brown-100"
                        placeholder="Adicione informações extras aqui..."
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-center mt-6">
                    <ButtonDefault
                      onClick={handleSubmit}
                      className="bg-teal-800 text-brown-200 shadow-teal-600"
                      text="Salvar"
                    />
                  </div>

                  {/* Icons credit */}
                  <div className="absolute text-brown-400 bottom-2 text-xs right-2">
                    Icons made by{" "}
                    <a
                      target="_blank"
                      href="https://www.freepik.com"
                      title="Freepik"
                      className="text-brown-700 underline"
                    >
                      Freepik
                    </a>
                  </div>
                </form>
              </div>
            </div>

            {/* Instructions */}
            <div className="absolute top-0 flex justify-center z-0 p-4 mt-16 lg:p-8 inset-0">
              <div className="max-w-2xl w-full rounded-lg overflow-hidden">
                <div className="p-6">
                  <p className="sm:text-sm lg:text-base md:text-base mb-4 text-brown-100">
                    Bem-vindo! Aqui é o lugar onde você dá vida aos inimigos que
                    vão testar a coragem dos seus jogadores.
                  </p>
                  <ul className="text-xs lg:text-sm list-disc list-inside space-y-2 mb-4 text-brown-200">
                    <li>
                      Preencha o nome, defina o nível, os pontos de vida, a
                      classe de armadura e adicione informações extras para não
                      esquecer nenhum detalhe dessa criatura.
                    </li>
                    <li>
                      Escolha um ícone que combine com o terror que ela vai
                      espalhar na sua mesa!
                    </li>
                    <li>
                      Quando terminar, clique em Salvar para guardar sua ficha.
                      Ela ficará prontinha e organizada na página inicial,
                      dentro de Minhas Fichas, para você invocar quantas cópias
                      quiser durante o combate.
                    </li>
                    <li>
                      E se a criatura não estiver mais à altura da sua horda?
                      Sem problema: use o botão de lixeira a esquerda e mande
                      ela para o limbo sem dó!
                    </li>
                  </ul>
                  <p className="text-sm lg:text-base font-semibold text-brown-100 mb-4">
                    Prepare-se: suas sessões de RPG nunca mais serão as mesmas
                    com suas hordas sob controle. Crie, solte e vença!
                  </p>
                  <p className="text-xs font-semibold text-brown-400">
                    Alias! Você pode clicar no pergaminho para deixa-lo aberto!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateSheet;
