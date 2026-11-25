import {
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import {
  ShieldIcon,
  HeartIcon,
  StarIcon,
  MinusIcon,
  PlusIcon,
  ScrollIcon,
  FloppyDiskIcon,
  CaretDownIcon,
} from "@phosphor-icons/react";

import SheetBar from "../components/SheetBar";
import ImgDiv from "../components/ImgDiv";
import { FormInput, FormTextarea } from "../components/Form";
import ButtonDefault from "../components/ButtonDefault";
import ConfirmModal from "../components/ConfirmModal";
import useSheet from "../contexts/SheetContext/useSheet";
import useCard from "../contexts/CardContext/useCard";
import type { SheetCreation } from "../types/Sheet";
import { ICONS, DEFAULT_ICON } from "../data/icons";
import { toast } from "../utils/toast";

import SheetFold from "./../assets/sheet-fold-90.png";
import CardBase from "./../assets/card-base.png";
import CardTitle from "./../assets/card-title.png";
import FullHeart from "./../assets/full-heart.png";
import Shield from "./../assets/shield.png";
import CardTag from "./../assets/card-tag.png";

type FormErrors = Partial<Record<"name" | "level" | "life" | "ac", string>>;

const EMPTY_FORM: SheetCreation = {
  name: "",
  level: "1",
  life: "10",
  ac: "10",
  info: "",
  icon: DEFAULT_ICON,
};

const LIMITS = {
  level: { min: 0, max: 100 },
  life: { min: 1, max: 5000 },
  ac: { min: 1, max: 100 },
} as const;

const isInteger = (value: string) => /^\d+$/.test(value);

const validate = (form: SheetCreation): FormErrors => {
  const errors: FormErrors = {};

  if (!form.name.trim()) errors.name = "Dê um nome para a criatura.";

  (Object.keys(LIMITS) as Array<keyof typeof LIMITS>).forEach((field) => {
    const { min, max } = LIMITS[field];
    const value = form[field];
    if (!isInteger(value) || Number(value) < min || Number(value) > max) {
      errors[field] = `Use um número entre ${min} e ${max}.`;
    }
  });

  return errors;
};

const CreateSheet = () => {
  const { handleDelete, sheetList } = useSheet();
  const { handleRemoveBySheetId } = useCard();
  const [toDelete, setToDelete] = useState<string | null>(null);

  const handleDeleteSheet = (sheetId: string) => {
    handleDelete(sheetId);
    handleRemoveBySheetId(sheetId);
  };

  return (
    <div className="absolute inset-0 flex flex-row">
      {toDelete &&
        createPortal(
          <ConfirmModal
            onClose={() => setToDelete(null)}
            onConfirm={() => handleDeleteSheet(toDelete)}
            title="Apagar ficha?"
            text={`“${sheetList[toDelete]?.name ?? "Esta ficha"}” será apagada, e os inimigos dela que estiverem na mesa também saem.`}
            confirmText="Apagar"
            tone="danger"
          />,
          document.body
        )}

      <SheetBar handleDeleteSheet={setToDelete} />

      <SheetForm />
    </div>
  );
};

// ---------------------------------------------------------------------------

const SheetForm = () => {
  const { handleCreate } = useSheet();
  const [form, setForm] = useState<SheetCreation>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  // O pergaminho começa enrolado, com as instruções à vista logo abaixo.
  // Ao abrir, as instruções saem de cena e o formulário se desenrola.
  const [open, setOpen] = useState(false);
  // Altura real do formulário: o papel anima de 0 até ela, e o rolo de baixo
  // fica preso à borda — os dois se movem como um bloco só.
  const formRef = useRef<HTMLFormElement>(null);
  const [paperHeight, setPaperHeight] = useState(0);

  useLayoutEffect(() => {
    const el = formRef.current;
    if (!el) return;
    const measure = () => setPaperHeight(el.offsetHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const update = (patch: Partial<SheetCreation>) => {
    const next = { ...form, ...patch };
    setForm(next);
    // Depois da primeira tentativa, os erros somem assim que o campo é corrigido.
    if (submitted) setErrors(validate(next));
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => update({ [e.target.name]: e.target.value });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const found = validate(form);
    setErrors(found);

    if (Object.keys(found).length) {
      const first = Object.keys(found)[0];
      document.getElementById(`sheet-${first}`)?.focus();
      return;
    }

    setSaving(true);
    const ok = await handleCreate({ ...form, name: form.name.trim() });
    setSaving(false);

    if (ok) {
      toast(`“${form.name.trim()}” foi para Minhas fichas!`, "success");
      setForm(EMPTY_FORM);
      setSubmitted(false);
      setErrors({});
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto grid max-w-[1200px] grid-cols-4 gap-6 px-4 pt-16 pb-10 sm:grid-cols-8 sm:px-6 sm:pt-8 xl:grid-cols-12">
        {/* Formulário */}
        <section aria-labelledby="create-title" className="col-span-full mx-auto mb-8 w-full max-w-[760px] animate-slide-up xl:col-span-8">
          {/* Rolo de cima: clicar enrola / desenrola o pergaminho */}
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-controls="sheet-paper"
            title={open ? "Enrolar pergaminho" : "Abrir pergaminho"}
            className="group relative z-30 ml-[6%] block aspect-[853/167] w-[94%] rounded-2xl transition-transform active:scale-[0.99]"
          >
            <img
              src={SheetFold}
              alt=""
              aria-hidden
              draggable={false}
              className="pointer-events-none absolute inset-0 size-full object-fill drop-shadow-[0_8px_6px_rgb(0_0_0/0.35)] select-none"
            />
            {/* O texto fica no "corpo" do rolo (a base do desenho é um arco,
                mais alta no meio), depois da espiral da esquerda. */}
            <span className="absolute top-[42%] right-[7%] left-[14%] flex -translate-y-1/2 items-center justify-between gap-3 text-left">
              <h1
                id="create-title"
                className="-rotate-[1.5deg] font-title text-[clamp(15px,4.6vw,30px)] leading-none font-bold whitespace-nowrap text-brown-800 [text-shadow:1px_1px_0_#fff8f2,-1px_-1px_0_#fff8f2,1px_-1px_0_#fff8f2,-1px_1px_0_#fff8f2,0_3px_0_rgb(130_88_63/0.35)]"
              >
                Nova ficha de inimigo
              </h1>
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brown-700/10 sm:size-8 text-brown-600 transition-colors group-hover:bg-brown-700/20">
                <CaretDownIcon
                  weight="bold"
                  className={`size-5 transition-transform duration-500 ${open ? "rotate-180" : ""}`}
                />
              </span>
            </span>
          </button>

          {/* Palco: instruções (embaixo) e papel (em cima) ocupam o mesmo espaço.
              Ao abrir, o papel se desenrola por cima das instruções. */}
          {/* Encaixe de pergaminho de verdade: os dois rolos têm a mesma largura,
              mas ficam deslocados. O de cima começa junto com o papel e passa um
              pouco à direita; o de baixo termina junto com o papel, passa um pouco
              à esquerda e fica atrás dele. */}
          <div className="relative -mt-[7.1%] grid">
            <div
              inert={open}
              aria-hidden={open}
              className={`relative z-0 mx-auto max-w-2xl px-2 pt-[calc(6.5%+0.75rem)] pb-4 text-center transition-opacity [grid-area:1/1] sm:px-8 ${
                open ? "opacity-0 delay-150 duration-500" : "opacity-100 delay-500 duration-500"
              }`}
            >
              <p className="text-base text-brown-100 sm:text-lg">
                Aqui você dá vida aos inimigos que vão testar a coragem dos seus jogadores.
              </p>
              <ul className="mx-auto mt-4 max-w-xl space-y-2 text-left text-sm text-brown-200 sm:text-base">
                {[
                  "Defina nome, nível, pontos de vida e classe de armadura — e anote habilidades para não esquecer nenhum detalhe.",
                  "Escolha um ícone que combine com o terror que a criatura vai espalhar na mesa.",
                  "Salve: a ficha vai para Minhas fichas, pronta para invocar quantas cópias você quiser.",
                  "Criatura que não serve mais vai para o limbo pela lixeira, na barra lateral.",
                ].map((tip) => (
                  <li key={tip} className="flex gap-3">
                    <span aria-hidden className="mt-2 size-2 shrink-0 rotate-45 bg-gold-500" />
                    {tip}
                  </li>
                ))}
              </ul>
              <ButtonDefault
                onClick={() => setOpen(true)}
                icon={<ScrollIcon size={20} weight="fill" />}
                text="Abrir pergaminho"
                className="mt-6"
              />
              <p className="mt-4 text-sm text-brown-400">
                ou{" "}
                <Link to="/" className="font-semibold text-gold-300 underline-offset-4 hover:underline">
                  volte para a mesa de combate
                </Link>
              </p>
                        </div>

            <div
              id="sheet-paper"
              className="relative z-10 ml-[7.2%] w-[86.8%] self-start transition-[height] duration-[900ms] ease-[cubic-bezier(0.33,1,0.68,1)] [grid-area:1/1]"
              style={{ height: open ? paperHeight : 0 }}
              inert={!open}
            >
              <div className="relative z-10 h-full overflow-hidden rounded-br-[20px]">
          <form
            ref={formRef}
            noValidate
            onSubmit={handleSubmit}
            className="space-y-5 bg-[#fbdbc2] px-5 pt-[calc(6.5%+0.5rem)] pb-10 text-left shadow-[inset_10px_0_14px_-10px_rgb(130_88_63/0.45),inset_-10px_0_14px_-10px_rgb(130_88_63/0.45)] sm:px-8"
          >
            {/* Nome */}
            <div>
              <FormInput
                label="Nome"
                id="sheet-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                maxLength={120}
                placeholder="Ex.: Goblin Saqueador"
                error={errors.name}
                className="bg-brown-50 text-brown-900 ring-1 ring-brown-300 placeholder:text-brown-400"
              />
              <p className="-mt-1 text-right text-xs text-brown-500">
                {form.name.length}/120
              </p>
            </div>

            {/* Atributos */}
            <fieldset>
              <legend className="mb-2 text-sm font-bold text-brown-800">
                Atributos
              </legend>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(144px,1fr))] gap-3">
                <NumberField
                  id="sheet-level"
                  label="Nível"
                  hint="Nível ou nível de desafio (ND)"
                  icon={<StarIcon weight="fill" />}
                  value={form.level}
                  error={errors.level}
                  {...LIMITS.level}
                  onChange={(level) => update({ level })}
                />
                <NumberField
                  id="sheet-life"
                  label="Vida máx."
                  hint="Pontos de vida (PV) máximos"
                  icon={<HeartIcon weight="fill" />}
                  value={form.life}
                  error={errors.life}
                  {...LIMITS.life}
                  onChange={(life) => update({ life })}
                />
                <NumberField
                  id="sheet-ac"
                  label="Armadura"
                  hint="Classe de armadura (CA)"
                  icon={<ShieldIcon weight="fill" />}
                  value={form.ac}
                  error={errors.ac}
                  {...LIMITS.ac}
                  onChange={(ac) => update({ ac })}
                />
              </div>
            </fieldset>

            {/* Ícone */}
            <fieldset>
              <legend className="mb-2 text-sm font-bold text-brown-800">
                Ícone{" "}
                <span className="font-normal text-brown-500">
                  — {ICONS.find((i) => i.src === form.icon)?.label}
                </span>
              </legend>
              <div
                role="radiogroup"
                aria-label="Ícone da criatura"
                className="grid grid-cols-[repeat(auto-fill,minmax(44px,1fr))] gap-2 sm:grid-cols-[repeat(auto-fill,minmax(48px,1fr))]"
              >
                {ICONS.map((icon) => {
                  const selected = form.icon === icon.src;
                  return (
                    <button
                      key={icon.key}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      aria-label={icon.label}
                      title={icon.label}
                      onClick={() => update({ icon: icon.src })}
                      className={`aspect-square rounded-lg border-[3px] bg-brown-900 p-1.5 transition-all hover:-translate-y-0.5 ${
                        selected
                          ? "scale-105 border-gold-300 shadow-[0_3px_0_var(--color-gold-500)]"
                          : "border-brown-300 opacity-75 shadow-[0_3px_0_var(--color-brown-400)] hover:opacity-100"
                      }`}
                    >
                      <img src={icon.src} alt="" className="size-full object-contain" />
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* Anotações */}
            <FormTextarea
              label="Anotações"
              id="sheet-info"
              name="info"
              value={form.info}
              onChange={handleChange}
              rows={4}
              className="bg-brown-50 text-brown-900 ring-1 ring-brown-300 placeholder:text-brown-400"
              placeholder="Habilidades, táticas, fraquezas... tudo que você quer lembrar no meio do combate."
            />

            <div className="flex flex-col-reverse items-stretch gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-brown-500">
                Ícones por{" "}
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://www.freepik.com"
                  className="underline hover:text-brown-700"
                >
                  Freepik
                </a>
              </p>
              <div className="flex gap-3">
                <ButtonDefault
                  variant="neutral"
                  text="Limpar"
                  onClick={() => {
                    setForm(EMPTY_FORM);
                    setErrors({});
                    setSubmitted(false);
                  }}
                  className="flex-1 sm:flex-none"
                />
                <ButtonDefault
                  type="submit"
                  disabled={saving}
                  icon={<FloppyDiskIcon size={18} weight="fill" />}
                  text={saving ? "Salvando..." : "Salvar ficha"}
                  className="flex-1 sm:flex-none"
                />
              </div>
            </div>
          </form>
              </div>

              {/* Rolo de baixo (atrás do papel): termina junto com a borda direita do
                  papel e passa um pouco à esquerda. Acompanha a borda enquanto desce.
                  Fechado, some para não aparecer ao lado do rolo de cima. */}
              <div
                aria-hidden
                className={`absolute right-0 -bottom-5 -left-[8.29%] z-0 h-10 rounded-full transition-opacity bg-gradient-to-b from-[#fde6d4] via-[#f1cdb0] to-[#d4a07c] shadow-[inset_0_2px_0_rgb(255_255_255/0.6),0_6px_8px_rgb(0_0_0/0.35)] before:absolute before:inset-y-1 before:left-1 before:w-3 before:rounded-full before:bg-[#c98f68]/70 after:absolute after:inset-y-1 after:right-1 after:w-2.5 after:rounded-full after:bg-[#c98f68]/70 ${
                  open ? "opacity-100 duration-200" : "opacity-0 delay-700 duration-200"
                }`}
              />
            </div>
          </div>
        </section>

        {/* Prévia */}
        <aside className="col-span-full flex flex-col gap-6 text-left sm:col-span-8 xl:col-span-4 xl:pt-12" aria-label="Prévia do cartão">
          <div>
            <h2 className="mb-3 text-sm font-bold tracking-wider text-brown-300 uppercase">
              Prévia na mesa
            </h2>
            <CardPreview form={form} />
          </div>

        </aside>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------

const NumberField = ({
  id,
  label,
  hint,
  icon,
  value,
  min,
  max,
  error,
  onChange,
}: {
  id: string;
  label: string;
  hint: string;
  icon: ReactNode;
  value: string;
  min: number;
  max: number;
  error?: string;
  onChange: (value: string) => void;
}) => {
  const step = (delta: number) => {
    const n = isInteger(value) ? Number(value) : min;
    onChange(String(Math.min(max, Math.max(min, n + delta))));
  };
  const errorId = `${id}-error`;

  return (
    <div>
      <label
        htmlFor={id}
        title={hint}
        className="mb-1 flex items-center gap-1.5 text-sm font-medium whitespace-nowrap text-brown-800"
      >
        <span className="text-brown-500">{icon}</span>
        {label}
        <span className="text-xs font-normal text-brown-500">
          ({hint.match(/\((\w+)\)/)?.[1]})
        </span>
      </label>
      <div
        className={`flex h-12 items-stretch overflow-hidden rounded-lg bg-brown-50 ring-1 focus-within:ring-2 ${
          error ? "ring-2 ring-blood-500" : "ring-brown-300 focus-within:ring-brown-600"
        }`}
      >
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label={`Diminuir ${label}`}
          className="flex w-12 flex-none items-center justify-center text-brown-600 hover:bg-brown-200"
        >
          <MinusIcon weight="bold" />
        </button>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className="w-full min-w-0 bg-transparent text-center text-lg font-bold text-brown-900"
        />
        <button
          type="button"
          onClick={() => step(1)}
          aria-label={`Aumentar ${label}`}
          className="flex w-12 flex-none items-center justify-center text-brown-600 hover:bg-brown-200"
        >
          <PlusIcon weight="bold" />
        </button>
      </div>
      {error && (
        <p id={errorId} className="mt-1 text-xs font-semibold text-blood-500">
          {error}
        </p>
      )}
    </div>
  );
};

/** Miniatura do cartão como ele vai aparecer na mesa de combate. */
const CardPreview = ({ form }: { form: SheetCreation }) => (
  <div className="relative mx-auto w-[260px] pt-2 pl-2 select-none" aria-hidden>
    <ImgDiv src={CardBase} className="aspect-[12/8] w-full">
      <div className="relative flex size-full flex-col items-center">
        <div className="absolute -top-3 -left-3 z-20 size-10 rounded-lg border-[3px] border-brown-200 bg-brown-900 p-1 shadow-[2px_2px_0_#9b8356]">
          <img src={form.icon} alt="" className="size-full object-contain" />
        </div>
        <div className="absolute -top-2 right-0 left-0 flex h-[18%] justify-center">
          <ImgDiv src={CardTitle} className="h-full w-[66%]">
            <div className="flex size-full rotate-[3deg] items-center justify-center gap-1 px-4">
              <span className="mt-1 truncate font-title text-[11px] font-bold text-brown-800">
                {form.name.trim() || "Sem nome"} 1
              </span>
              <span className="shrink-0 rounded bg-brown-800 px-1 text-[10px] font-bold text-brown-200">
                Nv {form.level || "?"}
              </span>
            </div>
          </ImgDiv>
        </div>
        <div className="mt-6 flex h-[58%] w-[70%] items-center justify-center gap-6">
          <ImgDiv src={FullHeart} className="aspect-square h-[72%]">
            <span className="text-xl font-extrabold text-brown-50 [text-shadow:0_2px_0_rgb(0_0_0/0.35)]">
              {form.life || "?"}
            </span>
          </ImgDiv>
          <ImgDiv src={Shield} className="mt-5 aspect-square h-[42%]">
            <span className="pt-1 text-[10px] leading-none font-bold text-brown-50">
              CA
              <br />
              {form.ac || "?"}
            </span>
          </ImgDiv>
        </div>
        <div className="absolute -right-3 -bottom-4 left-0 flex h-[42%] justify-end">
          <ImgDiv src={CardTag} className="h-full w-[85%]">
            <p className="mr-16 line-clamp-3 w-[70%] rotate-[-2deg] px-2 pt-2 text-left text-[9px] leading-snug text-brown-700">
              {form.info.trim() || "Suas anotações aparecem aqui."}
            </p>
          </ImgDiv>
        </div>
      </div>
    </ImgDiv>
  </div>
);

export default CreateSheet;
