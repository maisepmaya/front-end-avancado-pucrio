import { type ChangeEvent, type FormEvent, type ReactNode, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import {
  ArrowRightIcon,
  ShieldIcon,
  HeartIcon,
  StarIcon,
  MinusIcon,
  PlusIcon,
  LightbulbIcon,
  FloppyDiskIcon,
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
      <div className="mx-auto grid max-w-5xl gap-6 px-4 pt-4 pb-28 sm:px-8 sm:pt-6 sm:pb-10 xl:grid-cols-[minmax(0,1fr)_300px]">
        {/* Formulário */}
        <section aria-labelledby="create-title" className="animate-slide-up">
          <div className="relative z-10 -mb-24 hidden aspect-[853/167] sm:block">
            <ImgDiv src={SheetFold} className="absolute inset-0">
              <div className="flex size-full items-center pr-10 pb-2 pl-[15%] text-left">
                <h1 id="create-title" className="pt-1 text-2xl font-bold text-brown-700">
                  Nova ficha de inimigo
                </h1>
              </div>
            </ImgDiv>
          </div>
          <h1 className="mb-3 pl-10 text-left text-2xl font-bold text-brown-100 sm:hidden">
            Nova ficha de inimigo
          </h1>

          <form
            noValidate
            onSubmit={handleSubmit}
            className="mx-1 space-y-5 rounded-b-xl rounded-t-md bg-tag-bg p-5 text-left shadow-[0_6px_0_var(--color-brown-800),0_16px_32px_rgb(0_0_0/0.35)] sm:mx-5 sm:p-7 sm:pt-16"
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
              <div className="grid gap-3 sm:grid-cols-3">
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
                className="grid grid-cols-6 gap-2 sm:grid-cols-9"
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
        </section>

        {/* Prévia + dicas */}
        <aside className="flex flex-col gap-5 text-left xl:pt-10" aria-label="Prévia e dicas">
          <div>
            <h2 className="mb-3 text-sm font-bold tracking-wider text-brown-300 uppercase">
              Prévia na mesa
            </h2>
            <CardPreview form={form} />
          </div>

          <div className="rounded-xl bg-brown-950/40 p-4 text-sm text-brown-200 ring-1 ring-brown-700">
            <h2 className="mb-2 flex items-center gap-2 font-bold text-brown-100">
              <LightbulbIcon weight="fill" className="fill-gold-300" /> Dicas do mestre
            </h2>
            <ul className="list-disc space-y-1.5 pl-5 marker:text-brown-500">
              <li>Uma ficha vira quantas cópias você quiser — Goblin 1, Goblin 2, Goblin 3...</li>
              <li>Use as anotações para habilidades que você sempre esquece no calor da batalha.</li>
              <li>Fichas que não servem mais vão para o limbo pela lixeira, na barra lateral.</li>
            </ul>
            <Link
              to="/"
              className="mt-3 inline-flex items-center gap-1 rounded font-bold text-gold-300 hover:underline"
            >
              Ir para a mesa de combate <ArrowRightIcon weight="bold" />
            </Link>
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
        className={`flex items-stretch overflow-hidden rounded-lg bg-brown-50 ring-1 focus-within:ring-2 ${
          error ? "ring-2 ring-blood-500" : "ring-brown-300 focus-within:ring-brown-600"
        }`}
      >
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label={`Diminuir ${label}`}
          className="px-2.5 text-brown-600 hover:bg-brown-200"
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
          className="w-full min-w-0 bg-transparent py-2 text-center text-lg font-bold text-brown-900"
        />
        <button
          type="button"
          onClick={() => step(1)}
          aria-label={`Aumentar ${label}`}
          className="px-2.5 text-brown-600 hover:bg-brown-200"
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
