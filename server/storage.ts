// AirMems is a client-side only application
// All data storage uses IndexedDB in the browser
// No server-side storage is required

export interface IStorage {
  // AirMems doesn't require server-side storage
  // All data is stored client-side using IndexedDB
}

export class MemStorage implements IStorage {
  constructor() {
    // No server-side storage needed for AirMems
  }
}

export const storage = new MemStorage();
