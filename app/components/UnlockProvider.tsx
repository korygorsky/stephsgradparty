'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import PassphraseGate from './PassphraseGate';

type UnlockContextValue = {
  unlocked: boolean;
  requireUnlock: () => Promise<boolean>;
  setUnlocked: (v: boolean) => void;
};

const UnlockContext = createContext<UnlockContextValue | null>(null);

function readHintCookie(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie
    .split('; ')
    .some((c) => c.startsWith('party_has_unlocked=1'));
}

export function UnlockProvider({ children }: { children: ReactNode }) {
  const [unlocked, setUnlockedState] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);
  const pendingRef = useRef<((ok: boolean) => void) | null>(null);

  useEffect(() => {
    setUnlockedState(readHintCookie());
  }, []);

  const setUnlocked = useCallback((v: boolean) => {
    setUnlockedState(v);
    if (v && pendingRef.current) {
      pendingRef.current(true);
      pendingRef.current = null;
      setGateOpen(false);
    }
  }, []);

  const requireUnlock = useCallback(async (): Promise<boolean> => {
    if (readHintCookie()) {
      setUnlockedState(true);
      return true;
    }
    return new Promise<boolean>((resolve) => {
      pendingRef.current = resolve;
      setGateOpen(true);
    });
  }, []);

  const onGateClose = useCallback(() => {
    if (pendingRef.current) {
      pendingRef.current(false);
      pendingRef.current = null;
    }
    setGateOpen(false);
  }, []);

  const value = useMemo(
    () => ({ unlocked, requireUnlock, setUnlocked }),
    [unlocked, requireUnlock, setUnlocked],
  );

  return (
    <UnlockContext.Provider value={value}>
      {children}
      {gateOpen && <PassphraseGate onClose={onGateClose} onUnlocked={() => setUnlocked(true)} />}
    </UnlockContext.Provider>
  );
}

export function useUnlock(): UnlockContextValue {
  const ctx = useContext(UnlockContext);
  if (!ctx) throw new Error('useUnlock must be used within UnlockProvider');
  return ctx;
}
