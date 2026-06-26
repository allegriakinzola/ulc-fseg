"use client";

import { useState, useRef, useTransition } from "react";
import Image from "next/image";
import { RichEditor } from "@/components/ui/rich-editor";
import { ImagePlus, X, Loader2, FileText } from "lucide-react";
import { toast } from "@/components/ui/toaster";

type NewsLike = {
  title: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  pdfUrl?: string | null;
  published: boolean;
  publishedAt?: Date | string | null;
};

export function NewsForm({
  action,
  initial,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  initial?: NewsLike;
  submitLabel: string;
}) {
  const [content, setContent] = useState(initial?.content ?? "");
  const [coverPreview, setCoverPreview] = useState<string>(initial?.coverImage ?? "");
  const [coverUploading, setCoverUploading] = useState(false);
  const [coverUrl, setCoverUrl] = useState<string>(initial?.coverImage ?? "");
  const [pdfName, setPdfName] = useState<string>("");
  const [pdfUrl, setPdfUrl] = useState<string>(initial?.pdfUrl ?? "");
  const [pdfUploading, setPdfUploading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  function toDatetimeLocal(val?: Date | string | null): string {
    if (!val) return new Date().toISOString().slice(0, 16);
    const d = new Date(val);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  }

  async function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverUploading(true);
    const preview = URL.createObjectURL(file);
    setCoverPreview(preview);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json() as { url?: string; error?: string };
      if (data.url) {
        setCoverUrl(data.url);
        toast("Image uploadée avec succès", "success");
      } else {
        toast(data.error ?? "Erreur lors de l'upload", "error");
        setCoverPreview(initial?.coverImage ?? "");
      }
    } catch {
      toast("Erreur réseau lors de l'upload", "error");
      setCoverPreview(initial?.coverImage ?? "");
    } finally {
      setCoverUploading(false);
    }
  }

  async function handlePdfChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") { toast("Seuls les fichiers PDF sont acceptés", "error"); return; }
    setPdfUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json() as { url?: string; error?: string };
      if (data.url) {
        setPdfUrl(data.url);
        setPdfName(file.name);
        toast("PDF uploadé avec succès", "success");
      } else {
        toast(data.error ?? "Erreur lors de l'upload", "error");
      }
    } catch {
      toast("Erreur réseau lors de l'upload", "error");
    } finally {
      setPdfUploading(false);
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("content", content);
    fd.set("coverImage", coverUrl);
    fd.set("pdfUrl", pdfUrl);
    startTransition(async () => {
      await action(fd);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Titre */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Titre <span className="text-[#8f1913]">*</span>
        </label>
        <input
          name="title"
          required
          defaultValue={initial?.title}
          placeholder="Titre de l'article…"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-[#8f1913] focus:ring-2 focus:ring-[#8f1913]/20 focus:outline-none transition-all"
        />
      </div>

      {/* Image de couverture */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Image de couverture
        </label>
        {coverPreview ? (
          <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50" style={{ height: 220 }}>
            <Image
              src={coverPreview}
              alt="Aperçu couverture"
              fill
              className="object-cover"
              unoptimized
            />
            {coverUploading && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              </div>
            )}
            {!coverUploading && (
              <button
                type="button"
                onClick={() => { setCoverPreview(""); setCoverUrl(""); }}
                className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center w-full h-36 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:border-[#8f1913] hover:bg-[#8f1913]/5 transition-all gap-2 text-slate-500 hover:text-[#8f1913]"
          >
            <ImagePlus className="h-7 w-7" />
            <span className="text-sm font-medium">Cliquer pour ajouter une image</span>
            <span className="text-xs text-slate-400">JPG, PNG, WebP — max 8 Mo</span>
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleCoverChange}
        />
      </div>

      {/* Date de publication */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Date de publication <span className="text-[#8f1913]">*</span>
        </label>
        <input
          type="datetime-local"
          name="publishedAt"
          required
          defaultValue={toDatetimeLocal(initial?.publishedAt)}
          className="w-full sm:w-auto rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-[#8f1913] focus:ring-2 focus:ring-[#8f1913]/20 focus:outline-none transition-all"
        />
      </div>

      {/* PDF attaché */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Document PDF attaché
        </label>
        {pdfUrl ? (
          <div className="flex items-center gap-3 p-3 rounded-xl border border-emerald-200 bg-emerald-50">
            <FileText className="h-5 w-5 text-emerald-600 shrink-0" />
            <span className="text-sm text-emerald-800 font-medium truncate flex-1">
              {pdfName || "Document PDF"}
            </span>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-emerald-700 underline hover:text-emerald-900"
            >
              Voir
            </a>
            <button
              type="button"
              onClick={() => { setPdfUrl(""); setPdfName(""); }}
              className="h-6 w-6 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-700 hover:bg-emerald-300 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => pdfInputRef.current?.click()}
            disabled={pdfUploading}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:border-[#8f1913] hover:bg-[#8f1913]/5 transition-all text-slate-500 hover:text-[#8f1913] disabled:opacity-60"
          >
            {pdfUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <FileText className="h-5 w-5" />}
            <div className="text-left">
              <div className="text-sm font-medium">
                {pdfUploading ? "Upload en cours…" : "Cliquer pour joindre un PDF"}
              </div>
              <div className="text-xs text-slate-400">PDF — max 20 Mo</div>
            </div>
          </button>
        )}
        <input
          ref={pdfInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handlePdfChange}
        />
      </div>

      {/* Contenu riche */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Contenu <span className="text-[#8f1913]">*</span>
        </label>
        <RichEditor
          content={initial?.content}
          onChange={setContent}
          placeholder="Rédigez votre article ici…"
        />
      </div>

      {/* Publier */}
      <label className="flex items-center gap-3 cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            name="published"
            defaultChecked={initial?.published ?? true}
            className="sr-only peer"
          />
          <div className="w-10 h-6 rounded-full bg-slate-200 peer-checked:bg-[#8f1913] transition-colors" />
          <div className="absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
        </div>
        <span className="text-sm font-medium text-slate-700">Publier cet article</span>
      </label>

      {/* Submit */}
      <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
        <button
          type="submit"
          disabled={isPending || coverUploading}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#8f1913] text-white text-sm font-semibold hover:bg-[#6c100b] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitLabel}
        </button>
        {coverUploading && (
          <span className="text-sm text-slate-500 flex items-center gap-1.5">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Upload en cours…
          </span>
        )}
      </div>
    </form>
  );
}
