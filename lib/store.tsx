"use client";

import { createContext, useContext, useReducer, ReactNode } from 'react';

// Types
export interface Release {
  id: string;
  title: string;
  artist: string;
  status: 'draft' | 'processing' | 'live' | 'ready';
  date: string;
  cover: string;
  audioFile?: File | null;
  artworkFile?: File | null;
  releaseType: 'single' | 'ep' | 'album';
  streams?: number;
  downloads?: number;
  revenue?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  totalReleases: number;
  totalStreams: number;
  totalRevenue: number;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
}

export interface AppState {
  user: User | null;
  releases: Release[];
  isLoading: boolean;
  notifications: Notification[];
}

// Actions
type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'ADD_RELEASE'; payload: Release }
  | { type: 'UPDATE_RELEASE'; payload: Release }
  | { type: 'DELETE_RELEASE'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string };

// Initial State
const initialState: AppState = {
  user: {
    id: '1',
    name: 'Milton Kizzy',
    email: 'milton@kushtunes.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    totalReleases: 3,
    totalStreams: 125000,
    totalRevenue: 1250
  },
  releases: [
    {
      id: 'REL-001',
      title: 'Falling',
      artist: 'Milton Kizzy',
      status: 'ready',
      date: '2025-10-15',
      cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=600&auto=format&fit=crop',
      releaseType: 'single',
      streams: 45000,
      downloads: 1200,
      revenue: 450
    },
    {
      id: 'REL-002',
      title: 'Golden Nile',
      artist: 'Milton Kizzy',
      status: 'processing',
      date: '2025-10-20',
      cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop',
      releaseType: 'single',
      streams: 0,
      downloads: 0,
      revenue: 0
    },
    {
      id: 'REL-003',
      title: 'Cairo Nights',
      artist: 'Milton Kizzy',
      status: 'live',
      date: '2025-09-15',
      cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=600&auto=format&fit=crop',
      releaseType: 'single',
      streams: 80000,
      downloads: 2100,
      revenue: 800
    }
  ],
  isLoading: false,
  notifications: []
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'ADD_RELEASE':
      return { ...state, releases: [...state.releases, action.payload] };
    case 'UPDATE_RELEASE':
      return {
        ...state,
        releases: state.releases.map(release =>
          release.id === action.payload.id ? action.payload : release
        )
      };
    case 'DELETE_RELEASE':
      return {
        ...state,
        releases: state.releases.filter(release => release.id !== action.payload)
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [...state.notifications, action.payload] };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
    default:
      return state;
  }
}

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Utility functions
export const appActions = {
  setUser: (user: User) => ({ type: 'SET_USER' as const, payload: user }),
  addRelease: (release: Release) => ({ type: 'ADD_RELEASE' as const, payload: release }),
  updateRelease: (release: Release) => ({ type: 'UPDATE_RELEASE' as const, payload: release }),
  deleteRelease: (id: string) => ({ type: 'DELETE_RELEASE' as const, payload: id }),
  setLoading: (loading: boolean) => ({ type: 'SET_LOADING' as const, payload: loading }),
  addNotification: (notification: Notification) => ({ type: 'ADD_NOTIFICATION' as const, payload: notification }),
  removeNotification: (id: string) => ({ type: 'REMOVE_NOTIFICATION' as const, payload: id })
};
