import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';

/** Shared persist storage. Each store has its own key so a bad write in one
 * domain cannot take the others down. */
export const storage = createJSONStorage(() => AsyncStorage);
