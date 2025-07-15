import { EventRequest } from "@/app/models/IEvents"; 

const DB_NAME = 'EventDraftDB';
const STORE_NAME = 'eventDrafts';
const DB_VERSION = 1;

let db: IDBDatabase | null = null;

/**
 * Initializes the IndexedDB database.
 */
const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      return resolve(db);
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(new Error('Error opening database.'));
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };
    request.onupgradeneeded = (event) => {
      const tempDb = (event.target as IDBOpenDBRequest).result;
      if (!tempDb.objectStoreNames.contains(STORE_NAME)) {
        tempDb.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

/**
 * Interface for the data structure we will store.
 * We use a single object with a fixed ID to always overwrite the same draft.
 */
export interface EventDraft {
  id: 'currentDraft'; // Fixed key to always update the same entry
  eventData?: EventRequest;
  imageFile?: File;
}

/**
 * Saves the event draft (form data and image file) to IndexedDB.
 * @param {EventRequest | undefined} eventData The main object with form fields.
 * @param {File | undefined} imageFile The user-selected image file.
 */
export const saveEventDraft = async (
  eventData?: EventRequest,
  imageFile?: File
): Promise<void> => {
  const currentDb = await initDB();
  const transaction = currentDb.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);

  // First, get the existing draft to update it
  const getRequest = store.get('currentDraft');

  getRequest.onsuccess = () => {
    const existingDraft: EventDraft = getRequest.result || { id: 'currentDraft' };
    
    const updatedDraft: EventDraft = {
      ...existingDraft,
      eventData: eventData ?? existingDraft.eventData,
      imageFile: imageFile ?? existingDraft.imageFile,
    };

    const putRequest = store.put(updatedDraft);
    putRequest.onerror = () => console.error('Error saving draft:', putRequest.error);
    putRequest.onsuccess = () => console.log('Draft saved successfully.');
  };

  getRequest.onerror = () => console.error('Could not retrieve draft for update:', getRequest.error);
};

/**
 * Retrieves the event draft from IndexedDB.
 * @returns {Promise<Partial<EventDraft>>} An object containing the retrieved data.
 */
export const getEventDraft = async (): Promise<Partial<EventDraft>> => {
  const currentDb = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = currentDb.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get('currentDraft');

    request.onsuccess = () => resolve(request.result || {});
    request.onerror = () => reject(new Error('Could not retrieve draft.'));
  });
};

/**
 * Clears the event draft data from IndexedDB.
 */
export const clearEventDraft = async (): Promise<void> => {
  const currentDb = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = currentDb.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete('currentDraft');

    request.onsuccess = () => {
      console.log('Cleared event draft from IndexedDB.');
      resolve();
    };
    request.onerror = () => reject(new Error('Could not clear draft.'));
  });
};
