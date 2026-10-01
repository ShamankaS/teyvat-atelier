"use client";

import { useRef, useState } from "react";
import { Upload, FileJson, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAccount } from "@/components/account-provider";

export function ImportPanel() {
  const { loadJson, error, account, clear } = useAccount();
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [loadingSample, setLoadingSample] = useState(false);

  async function fromFile(file: File) {
    const text = await file.text();
    loadJson(text);
  }

  async function loadSample() {
    setLoadingSample(true);
    try {
      const res = await fetch("/sample-account.json");
      const text = await res.text();
      loadJson(text);
    } finally {
      setLoadingSample(false);
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
        <p className="text-lg font-medium">Загрузите JSON аккаунта</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Формат GOOD — как в Genshin Optimizer. Свой формат подключим, когда пришлёте схему.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Button onClick={() => inputRef.current?.click()}>
            <Upload />
            Выбрать файл
          </Button>
          <Button variant="secondary" onClick={() => void loadSample()} disabled={loadingSample}>
            <Sparkles />
            Демо-аккаунт
          </Button>
          {account ? (
            <Button variant="ghost" onClick={clear}>
              Сбросить
            </Button>
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
