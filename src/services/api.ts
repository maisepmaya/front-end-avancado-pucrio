import type { Card, Cards } from "../types/Card";
import type { Sheet, Sheets } from "../types/Sheet";
import { iconByKey } from "../data/icons";

/**
 * O HordaMaster funciona em dois modos:
 *
 * - **API**: quando `VITE_API_URL` está definida (ex.: `http://localhost:5000`),
 *   os dados vão para o back-end em Flask + SQLite.
 * - **Demo**: sem essa variável, tudo é salvo no `localStorage` do navegador.
 *   É o modo usado na versão publicada, para qualquer pessoa testar sem instalar nada.
 */
const BASE_URL: string | undefined = import.meta.env.VITE_API_URL;
export const isDemoMode = !BASE_URL;

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

// ---------------------------------------------------------------------------
// Modo API (back-end)
// ---------------------------------------------------------------------------

async function apiRequest<T>(
  url: string,
  {
    method = "GET",
    body,
    headers = {},
  }: {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: unknown;
    headers?: Record<string, string>;
  } = {}
): Promise<T> {
  const isFormData = body instanceof FormData;

  const response = await fetch(`${BASE_URL}${url}`, {
    method,
    headers: isFormData
      ? headers
      : {
          "Content-Type": "application/json",
          ...headers,
        },
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorBody = await response
      .json()
      .catch(() => ({ message: response.statusText }));
    throw new Error(
      `Erro: ${response.status} - ${errorBody.message || response.statusText}`
    );
  }
  return response.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Modo Demo (localStorage)
// ---------------------------------------------------------------------------

const STORAGE_KEY = "hordamaster:v1";

interface LocalDB {
  sheets: Sheets;
  cards: Cards;
}

const seed = (): LocalDB => {
  const sheets: Sheet[] = [
    {
      id: uid(),
      name: "Goblin Saqueador",
      level: "1",
      life: "7",
      ac: "15",
      icon: iconByKey("goblin"),
      info: "Ataque furtivo: +1d6 se um aliado estiver adjacente. Foge quando sobra só um.",
    },
    {
      id: uid(),
      name: "Orc Berserker",
      level: "3",
      life: "30",
      ac: "13",
      icon: iconByKey("orc"),
      info: "Fúria: +2 de dano corpo a corpo. Nunca recua.",
    },
    {
      id: uid(),
      name: "Necromante",
      level: "5",
      life: "45",
      ac: "12",
      icon: iconByKey("wizard"),
      info: "A cada 2 turnos, ergue um zumbi de um inimigo caído.",
    },
    {
      id: uid(),
      name: "Zumbi",
      level: "1",
      life: "22",
      ac: "8",
      icon: iconByKey("zombie"),
      info: "Teimosia de morto-vivo: ao cair a 0 PV, teste de CON para ficar com 1.",
    },
  ];

  const db: LocalDB = {
    sheets: Object.fromEntries(sheets.map((s) => [s.id, s])),
    cards: {},
  };

  const addSeedCard = (sheet: Sheet, currLife: number) => {
    const card = buildCard(db, sheet, sheet.id);
    card.currLife = currLife;
    db.cards[card.id] = card;
  };

  addSeedCard(sheets[0], 7);
  addSeedCard(sheets[0], 3);
  addSeedCard(sheets[0], 0);
  addSeedCard(sheets[1], 30);
  addSeedCard(sheets[2], 38);

  return db;
};

const readDB = (): LocalDB => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as LocalDB;
  } catch {
    /* armazenamento indisponível ou corrompido: recomeça do zero */
  }
  const db = seed();
  writeDB(db);
  return db;
};

const writeDB = (db: LocalDB) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    /* modo privado sem storage: os dados ficam só na memória da sessão */
  }
};

/** Cria um cartão numerado automaticamente (Goblin 1, Goblin 2...). */
function buildCard(db: LocalDB, sheet: Omit<Sheet, "id">, sheetId: string): Card {
  const used = Object.values(db.cards)
    .filter((card) => card.sheetId === sheetId)
    .map((card) => Number(card.name.match(/(\d+)$/)?.[1] ?? 0));
  const next = (used.length ? Math.max(...used) : 0) + 1;

  return {
    id: uid(),
    sheetId,
    name: `${sheet.name} ${next}`,
    life: sheet.life,
    currLife: Number(sheet.life),
    ac: sheet.ac,
    level: sheet.level,
    info: sheet.info,
    icon: sheet.icon,
  };
}

const delay = <T,>(value: T) =>
  new Promise<T>((resolve) => window.setTimeout(() => resolve(value), 120));

// ---------------------------------------------------------------------------
// SHEET
// ---------------------------------------------------------------------------

export async function getAllSheets(
  type?: "independent" | "dependent"
): Promise<Sheets> {
  if (isDemoMode) return delay(readDB().sheets);

  const url = type ? `/sheet/getAll?type=${type}` : "/sheet/getAll";
  return apiRequest<Sheets>(url);
}

export async function createSheet(data: Omit<Sheet, "id">): Promise<Sheet> {
  if (isDemoMode) {
    const db = readDB();
    const sheet: Sheet = { ...data, id: uid() };
    db.sheets[sheet.id] = sheet;
    writeDB(db);
    return delay(sheet);
  }

  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });

  return apiRequest<Sheet>("/sheet/create", {
    method: "POST",
    body: formData,
  });
}

export async function deleteSheet(id: string): Promise<{ message: string }> {
  if (isDemoMode) {
    const db = readDB();
    delete db.sheets[id];
    writeDB(db);
    return delay({ message: "ok" });
  }

  return apiRequest<{ message: string }>(`/sheet/delete?id=${id}`, {
    method: "DELETE",
  });
}

// ---------------------------------------------------------------------------
// CARD
// ---------------------------------------------------------------------------

export async function getAllCards(): Promise<Cards> {
  if (isDemoMode) return delay(readDB().cards);

  return apiRequest<Cards>("/card/getAll");
}

export async function createCard(data: {
  sheet: string | Sheet;
  index: number;
}): Promise<Card> {
  if (isDemoMode) {
    const db = readDB();
    const sheet =
      typeof data.sheet === "string" ? db.sheets[data.sheet] : data.sheet;
    if (!sheet) throw new Error("Ficha não encontrada");

    const sheetId = typeof data.sheet === "string" ? data.sheet : sheet.id;
    const card = buildCard(db, sheet, sheetId);
    db.cards[card.id] = card;
    writeDB(db);
    return delay(card);
  }

  const formData = new FormData();
  if (typeof data.sheet === "string") {
    formData.append("sheet", data.sheet);
  } else {
    formData.append("sheet", JSON.stringify(data.sheet));
  }
  formData.append("index", data.index.toString());

  return apiRequest<Card>("/card/create", {
    method: "POST",
    body: formData,
  });
}

export async function updateCard(data: {
  id: string;
  index?: number;
  currLife?: number;
  info?: string;
}): Promise<Card> {
  if (isDemoMode) {
    const db = readDB();
    const current = db.cards[data.id];
    if (!current) throw new Error("Cartão não encontrado");
    const updated: Card = {
      ...current,
      ...(data.currLife !== undefined && { currLife: data.currLife }),
      ...(data.info !== undefined && { info: data.info }),
    };
    db.cards[data.id] = updated;
    writeDB(db);
    return updated;
  }

  const formData = new FormData();
  formData.append("id", data.id);
  if (data.index !== undefined) {
    formData.append("index", data.index.toString());
  }
  if (data.currLife !== undefined) {
    formData.append("currLife", data.currLife.toString());
  }
  if (data.info !== undefined) {
    formData.append("info", data.info);
  }

  return apiRequest<Card>("/card/update", {
    method: "PUT",
    body: formData,
  });
}

export async function deleteCard(id: string): Promise<{ message: string }> {
  if (isDemoMode) {
    const db = readDB();
    delete db.cards[id];
    writeDB(db);
    return delay({ message: "ok" });
  }

  return apiRequest<{ message: string }>(`/card/delete?id=${id}`, {
    method: "DELETE",
  });
}

export async function deleteAllCards(): Promise<{ message: string }> {
  if (isDemoMode) {
    const db = readDB();
    db.cards = {};
    writeDB(db);
    return delay({ message: "ok" });
  }

  return apiRequest<{ message: string }>("/card/deleteAll", {
    method: "DELETE",
  });
}
