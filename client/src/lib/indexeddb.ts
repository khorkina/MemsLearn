import { Meme, Lesson, UserProgress, SavedLesson } from "@shared/schema";

const DB_NAME = "AirMemsDB";
const DB_VERSION = 1;

class IndexedDBService {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Memes store
        if (!db.objectStoreNames.contains("memes")) {
          const memesStore = db.createObjectStore("memes", { keyPath: "id" });
          memesStore.createIndex("subreddit", "subreddit", { unique: false });
        }

        // Lessons store
        if (!db.objectStoreNames.contains("lessons")) {
          const lessonsStore = db.createObjectStore("lessons", { keyPath: "id" });
          lessonsStore.createIndex("memeId", "memeId", { unique: false });
        }

        // User progress store
        if (!db.objectStoreNames.contains("userProgress")) {
          db.createObjectStore("userProgress", { keyPath: "lessonId" });
        }

        // Saved lessons store
        if (!db.objectStoreNames.contains("savedLessons")) {
          db.createObjectStore("savedLessons", { keyPath: "lessonId" });
        }
      };
    });
  }

  async saveMemes(memes: Meme[]): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    const transaction = this.db.transaction(["memes"], "readwrite");
    const store = transaction.objectStore("memes");

    for (const meme of memes) {
      await new Promise<void>((resolve, reject) => {
        const request = store.put(meme);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }
  }

  async getMemes(limit: number = 20, offset: number = 0): Promise<Meme[]> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["memes"], "readonly");
      const store = transaction.objectStore("memes");
      const request = store.getAll();

      request.onsuccess = () => {
        const memes = request.result.slice(offset, offset + limit);
        resolve(memes);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getMeme(id: string): Promise<Meme | null> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["memes"], "readonly");
      const store = transaction.objectStore("memes");
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async saveLesson(lesson: Lesson): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["lessons"], "readwrite");
      const store = transaction.objectStore("lessons");
      const request = store.put(lesson);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getLesson(id: string): Promise<Lesson | null> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["lessons"], "readonly");
      const store = transaction.objectStore("lessons");
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async saveUserProgress(progress: UserProgress): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["userProgress"], "readwrite");
      const store = transaction.objectStore("userProgress");
      const request = store.put(progress);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async saveLesson_favorite(lessonId: string): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    const savedLesson: SavedLesson = {
      lessonId,
      savedAt: Date.now(),
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["savedLessons"], "readwrite");
      const store = transaction.objectStore("savedLessons");
      const request = store.put(savedLesson);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getSavedLessons(): Promise<SavedLesson[]> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["savedLessons"], "readonly");
      const store = transaction.objectStore("savedLessons");
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllLessons(): Promise<Lesson[]> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["lessons"], "readonly");
      const store = transaction.objectStore("lessons");
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteLesson(id: string): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["lessons"], "readwrite");
      const store = transaction.objectStore("lessons");
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clearAllData(): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["lessons", "savedLessons", "userProgress"], "readwrite");
      
      const clearStore = (storeName: string) => {
        return new Promise<void>((resolveStore, rejectStore) => {
          const store = transaction.objectStore(storeName);
          const request = store.clear();
          request.onsuccess = () => resolveStore();
          request.onerror = () => rejectStore(request.error);
        });
      };

      Promise.all([
        clearStore("lessons"),
        clearStore("savedLessons"),
        clearStore("userProgress")
      ]).then(() => resolve()).catch(reject);
    });
  }
}

export const indexedDBService = new IndexedDBService();

// Export convenience functions for direct use
export const getAllLessons = () => indexedDBService.getAllLessons();
export const deleteLesson = (id: string) => indexedDBService.deleteLesson(id);
export const clearAllData = () => indexedDBService.clearAllData();
