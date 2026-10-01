"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { GoodAccount } from "@/lib/good/types";
import { parseAccountJson } from "@/lib/good/parse";
import { analyzeAccount, type Analysis } from "@/lib/analyze";

const STORAGE_KEY = "teyvat-atelier-account";

interface AccountState {
  account: GoodAccount | null;
  error: string | null;
  analyses: Analysis[];
  loadJson: (text: string) => boolean;
  clear: () => void;
}

const Ctx = createContext<AccountState | null>(null);

function readStored(): GoodAccount | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = parseAccountJson(raw);
    if ("error" in parsed) return null;
    return parsed.account;
  } catch {
    return null;
  }
}

export function AccountProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<GoodAccount | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [didRestore, setDidRestore] = useState(false);

  if (!didRestore) {
    setDidRestore(true);
    const stored = readStored();
    if (stored) setAccount(stored);
  }

  const loadJson = useCallback((text: string) => {
    const parsed = parseAccountJson(text);
    if ("error" in parsed) {
      setError(parsed.error);
      return false;
    }
    setError(null);
    setAccount(parsed.account);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed.account));
    } catch {
      setError("Аккаунт загружен, но браузер не дал сохранить его в localStorage.");
    }
    return true;
  }, []);

  const clear = useCallback(() => {
    setAccount(null);
    setError(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const analyses = useMemo(() => {
    if (!account) return [];
    try {
      return analyzeAccount(account);
    } catch (e) {
      console.error(e);
      return [];
    }
  }, [account]);

  const value = useMemo(
    () => ({ account, error, analyses, loadJson, clear }),
    [account, error, analyses, loadJson, clear],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAccount() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAccount outside provider");
  return ctx;
}
