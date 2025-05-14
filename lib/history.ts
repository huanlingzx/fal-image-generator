// lib/history.ts
import { HistoryEntry } from "./types"; // Adjust path

const LOCAL_STORAGE_KEY = "generationHistory";

// Mock data for initial state or if localStorage is empty
const mockHistoryData: HistoryEntry[] = [
  {
    id: "mock1",
    modelId: "fal-ai/flux-lora",
    modelName: "Flux LoRA",
    timestamp: new Date().getTime() - 1000 * 60 * 60 * 24, // 1 day ago
    image: {
      url: "https://placehold.co/1024x768/000000/FFF?text=Mock+Image+1",
      content_type: "image/png",
      width: 1024,
      height: 768,
    },
    parameters: {
      prompt: "一只可爱的猫咪在草地上玩耍，阳光明媚，细节丰富",
      image_size: "landscape_16_9",
      seed: 12345,
      num_inference_steps: 25,
    },
    isFavorite: true,
  },
  {
    id: "mock2",
    modelId: "fal-ai/flux-pro",
    modelName: "Flux Pro",
    timestamp: new Date().getTime() - 1000 * 60 * 30, // 30 minutes ago
    image: {
      url: "https://placehold.co/768x1024/333333/EEE?text=Mock+Image+2",
      content_type: "image/jpeg",
      width: 768,
      height: 1024,
    },
    parameters: {
      prompt: "赛博朋克城市的夜景，霓虹灯闪烁，未来感十足",
      image_size: "portrait_9_16",
      seed: 67890,
      guidance_scale: 5.0,
    },
  },
  // Add more mock entries
];

export const getHistory = (): HistoryEntry[] => {
  if (typeof window === "undefined") return mockHistoryData; // For SSR/initial build
  try {
    const storedHistory = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedHistory) {
      return JSON.parse(storedHistory);
    }
    // If no stored history, initialize with mock data and save it
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mockHistoryData));
    return mockHistoryData;
  } catch (error) {
    console.error("Error reading history from localStorage:", error);
    return mockHistoryData; // Fallback to mock
  }
};

export const addHistoryEntry = (entry: Omit<HistoryEntry, 'id' | 'timestamp'>): HistoryEntry => {
  if (typeof window === "undefined") return { ...entry, id: crypto.randomUUID(), timestamp: Date.now()};
  const newEntry: HistoryEntry = {
    ...entry,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };
  const currentHistory = getHistory();
  const updatedHistory = [newEntry, ...currentHistory]; // Add to the beginning
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedHistory));
  return newEntry;
};

export const deleteHistoryEntry = (id: string): HistoryEntry[] => {
    if (typeof window === "undefined") return [];
    let currentHistory = getHistory();
    currentHistory = currentHistory.filter(entry => entry.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentHistory));
    return currentHistory;
};

export const toggleFavoriteHistoryEntry = (id: string, isFavorite: boolean): HistoryEntry[] => {
    if (typeof window === "undefined") return [];
    let currentHistory = getHistory();
    currentHistory = currentHistory.map(entry =>
        entry.id === id ? { ...entry, isFavorite } : entry
    );
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentHistory));
    return currentHistory;
};
