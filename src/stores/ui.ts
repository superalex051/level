import { create } from 'zustand';

interface ToastAction {
  label: string;
  onPress: () => void;
}

export interface Toast {
  message: string;
  action?: ToastAction;
}

interface UiState {
  toast: Toast | null;
  showToast: (message: string, action?: ToastAction) => void;
  hideToast: () => void;
}

let timer: ReturnType<typeof setTimeout> | undefined;

export const useUi = create<UiState>()((set) => ({
  toast: null,
  showToast: (message, action) => {
    if (timer) clearTimeout(timer);
    set({ toast: { message, action } });
    timer = setTimeout(() => set({ toast: null }), action ? 4500 : 1800);
  },
  hideToast: () => {
    if (timer) clearTimeout(timer);
    set({ toast: null });
  },
}));
