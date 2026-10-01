"use client";

import { useRef, useState } from "react";
import { Upload, FileJson, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAccount } from "@/components/account-provider";
import sampleAccount from "../../public/sample-account.json";
import { cn } from "@/lib/utils";

export function ImportPanel() {
  const { loadJson, error, account, clear } = useAccount();
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  async function fromFile(file: File) {
    const text = await file.text();
    loadJson(text);
  }

  function loadSample() {
    loadJson(JSON.stringify(sampleAccount));
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
            onClick={loadSample}
          >
            <Sparkles />
            Демо-аккаунт
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
