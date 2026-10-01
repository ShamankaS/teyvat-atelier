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
import sampleAccount from "@/data/sample-account.json";

const STORAGE_KEY = "teyvat-atelier-account";
const SAMPLE: GoodAccount = sampleAccount as GoodAccount;

interface AccountState {
  account: GoodAccount | null;
  error: string | null;
  analyses: Analysis[];
  loadJson: (text: string) => boolean;
  loadSample: () => void;
  clear: () => void;
}

const Ctx = createContext<AccountState | null>(null);

export function AccountProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<GoodAccount | null>(SAMPLE);
  const [error, setError] = useState<string | null>(null);

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
      /* private mode — still keep in-memory account */
    }
    return true;
  }, []);

  const loadSample = useCallback(() => {
    setError(null);
    setAccount(SAMPLE);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE));
    } catch {
      /* ignore */
    }
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
    () => ({ account, error, analyses, loadJson, loadSample, clear }),
    [account, error, analyses, loadJson, loadSample, clear],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAccount() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAccount outside provider");
  return ctx;
}
