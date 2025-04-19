

import { create } from 'zustand';
//import { Customer } from '../models/Customer';

// Lets use Zustand for state management instead of context api
// Zustand is a small, fast, and scalable bearbones state-management solution

interface AppState {    
    isApiOnline: boolean;    
    setApiOnline: (status: boolean) => void;    
}


export const useAppStore = create<AppState>((set) => ({    
    isApiOnline: true,    
    setApiOnline: (status) => set({ isApiOnline: status }),

  }));