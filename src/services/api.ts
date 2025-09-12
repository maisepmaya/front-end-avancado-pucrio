import type { Card, Cards } from "../types/Card";
import type { Sheet, Sheets } from "../types/Sheet";

const BASE_URL = "http://localhost:5000";

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

// ---------------- SHEET ----------------
export async function getAllSheets(
  type?: "independent" | "dependent"
): Promise<Sheets> {
  const url = type ? `/sheet/getAll?type=${type}` : "/sheet/getAll";
  const data = await apiRequest<Sheets>(url);
  return data;
}

export async function createSheet(data: Omit<Sheet, "id">): Promise<Sheet> {
  console.log(data);
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
  return apiRequest<{ message: string }>(`/sheet/delete?id=${id}`, {
    method: "DELETE",
  });
}

// ---------------- CARD ----------------
export async function getAllCards(): Promise<Cards> {
  const data = await apiRequest<Cards>("/card/getAll");

  return data;
}

export async function createCard(data: {
  sheet: string | Omit<Sheet, "id">;
  index: number;
}): Promise<Card> {
  console.log(data);
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
  return apiRequest<{ message: string }>(`/card/delete?id=${id}`, {
    method: "DELETE",
  });
}

export async function deleteAllCards(): Promise<{ message: string }> {
  return apiRequest<{ message: string }>("/card/deleteAll", {
    method: "DELETE",
  });
}
