"use client";

import { useRef, useState } from "react";
import { Upload, FileJson, Sparkles, User } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAccount } from "@/components/account-provider";
import { cn } from "@/lib/utils";

export function ImportPanel() {
  const { loadJson, loadSample, loadMyAccount, error, account, clear, loading } = useAccount();
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  async function fromFile(file: File) {
    const text = await file.text();
    if (loadJson(text)) {
      document.getElementById("roster")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          const file = e.dataTransfer.files[0];
          if (file) void fromFile(file);
        }}
        className={`rounded-2xl border border-dashed p-8 text-center transition ${
          drag ? "border-primary bg-primary/10" : "border-white/15 bg-white/4"
        }`}
      >
        <FileJson className="mx-auto mb-3 size-10 text-primary" />
        <p className="text-lg font-medium">JSON аккаунта</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Подходит GOOD v2/v3 (Irminsul, Genshin Optimizer). Сейчас открыт ваш экспорт от 1 октября.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            className={cn(buttonVariants())}
            onClick={() => inputRef.current?.click()}
          >
            <Upload />
            Выбрать файл
          </button>
          <button
            type="button"
            className={cn(buttonVariants({ variant: "secondary" }))}
            onClick={() => {
              void loadMyAccount().then(() =>
                document.getElementById("roster")?.scrollIntoView({ behavior: "smooth" }),
              );
            }}
            disabled={loading}
          >
            <User />
            Мой аккаунт
          </button>
          <button
            type="button"
            className={cn(buttonVariants({ variant: "ghost" }))}
            onClick={() => {
              loadSample();
              document.getElementById("roster")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <Sparkles />
            Учебное демо
          </button>
          {account ? (
            <button type="button" className={cn(buttonVariants({ variant: "ghost" }))} onClick={clear}>
              Сбросить
            </button>
          ) : null}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void fromFile(file);
            e.target.value = "";
          }}
        />
      </div>
      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Не удалось прочитать файл</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}
