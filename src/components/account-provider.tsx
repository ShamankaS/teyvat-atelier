"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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
  loading: boolean;
  analyses: Analysis[];
  loadJson: (text: string) => boolean;
  loadSample: () => void;
  loadMyAccount: () => Promise<void>;
  clear: () => void;
}

const Ctx = createContext<AccountState | null>(null);

export function AccountProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<GoodAccount | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const applyText = useCallback((text: string) => {
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
      /* ignore quota */
    }
    return true;
  }, []);

  const loadMyAccount = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/my-account.json");
      if (!res.ok) throw new Error("no file");
      const text = await res.text();
      if (!applyText(text)) setAccount(SAMPLE);
    } catch {
      setAccount(SAMPLE);
    } finally {
      setLoading(false);
    }
  }, [applyText]);

  useEffect(() => {
    void loadMyAccount();
  }, [loadMyAccount]);

  const loadJson = useCallback(
    (text: string) => {
      setLoading(false);
      return applyText(text);
    },
    [applyText],
  );

  const loadSample = useCallback(() => {
    setError(null);
    setLoading(false);
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
    () => ({
      account,
      error,
      loading,
      analyses,
      loadJson,
      loadSample,
      loadMyAccount,
      clear,
    }),
    [account, error, loading, analyses, loadJson, loadSample, loadMyAccount, clear],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAccount() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAccount outside provider");
  return ctx;
}
