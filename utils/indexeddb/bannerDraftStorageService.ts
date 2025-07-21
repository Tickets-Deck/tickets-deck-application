import { ICreateBannerPayload } from "@/app/models/IBanner";

const DB_NAME = "TDBannerDraftDB";
const DB_VERSION = 1;
const STORE_NAME = "bannerDrafts";

export interface BannerDraft {
  userId: string;
  payload: Partial<ICreateBannerPayload>;
  currentStep: number;
  framePreviewUrl: string | null;
  // We store the frame image file name to reconstruct it from the data URL later
  frameImageFileName: string | null;
}

let db: IDBDatabase;

function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (db) {
      return resolve(db);
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "userId" });
      }
    };
  });
}

export async function saveBannerState(draft: BannerDraft): Promise<void> {
  const db = await initDB();
  const transaction = db.transaction(STORE_NAME, "readwrite");
  const store = transaction.objectStore(STORE_NAME);
  store.put(draft);
}

export async function getBannerState(
  userId: string
): Promise<BannerDraft | null> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(userId);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

export async function clearBannerState(userId: string): Promise<void> {
  const db = await initDB();
  const transaction = db.transaction(STORE_NAME, "readwrite");
  const store = transaction.objectStore(STORE_NAME);
  store.delete(userId);
}