"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
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

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", onStoreChange);
  window.addEventListener("teyvat-atelier-account", onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("teyvat-atelier-account", onStoreChange);
  };
}

function getSnapshot() {
  return localStorage.getItem(STORAGE_KEY);
}

function getServerSnapshot() {
  return null;
}

function parseStored(raw: string | null): GoodAccount | null {
  if (!raw) return null;
  const parsed = parseAccountJson(raw);
  if ("error" in parsed) return null;
  return parsed.account;
}

function notify() {
  window.dispatchEvent(new Event("teyvat-atelier-account"));
}

export function AccountProvider({ children }: { children: ReactNode }) {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [error, setError] = useState<string | null>(null);
  const account = useMemo(() => parseStored(raw), [raw]);

  const loadJson = useCallback((text: string) => {
    const parsed = parseAccountJson(text);
    if ("error" in parsed) {
      setError(parsed.error);
      return false;
    }
    setError(null);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed.account));
    notify();
    return true;
  }, []);

  const clear = useCallback(() => {
    setError(null);
    localStorage.removeItem(STORAGE_KEY);
    notify();
  }, []);

  const analyses = useMemo(
    () => (account ? analyzeAccount(account) : []),
    [account],
  );

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
