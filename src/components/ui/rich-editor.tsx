"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import FontFamily from "@tiptap/extension-font-family";
import { useRef, useCallback, useState } from "react";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Link as LinkIcon, ImageIcon,
  Quote, Code, Code2, Undo, Redo, Highlighter,
  Minus, Type, Check, X,
} from "lucide-react";
import { toast } from "@/components/ui/toaster";

function ToolBtn({
  onClick,
  active,
  title,
  children,
  disabled,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`flex items-center justify-center h-8 w-8 rounded-lg text-sm transition-colors shrink-0 ${
        active
          ? "bg-[#8f1913] text-white"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      } disabled:opacity-30 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="h-6 w-px bg-slate-200 mx-1 shrink-0" />;
}

function Toolbar({ editor }: { editor: Editor | null }) {
  const colorInputRef = useRef<HTMLInputElement>(null);
  const highlightInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const linkInputRef = useRef<HTMLInputElement>(null);
  const [linkPanelOpen, setLinkPanelOpen] = useState(false);
  const [linkValue, setLinkValue] = useState("");

  const openLinkPanel = useCallback(() => {
    if (!editor) return;
    const prev = (editor.getAttributes("link").href as string) ?? "";
    setLinkValue(prev);
    setLinkPanelOpen(true);
    setTimeout(() => linkInputRef.current?.focus(), 50);
  }, [editor]);

  const applyLink = useCallback(() => {
    if (!editor) return;
    if (!linkValue.trim()) {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().setLink({ href: linkValue.trim(), target: "_blank" }).run();
    }
    setLinkPanelOpen(false);
    setLinkValue("");
  }, [editor, linkValue]);

  const cancelLink = useCallback(() => {
    setLinkPanelOpen(false);
    setLinkValue("");
    editor?.chain().focus().run();
  }, [editor]);

  const uploadImage = useCallback(async (file: File) => {
    if (!editor) return;
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json() as { url?: string };
      if (data.url) {
        editor.chain().focus().setImage({ src: data.url }).run();
        toast("Image insérée avec succès", "success");
      } else {
        toast("Échec de l'upload de l'image", "error");
      }
    } catch {
      toast("Erreur réseau lors de l'upload", "error");
    }
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="border-b border-slate-200 rounded-t-xl overflow-hidden">
    <div className="flex flex-wrap items-center gap-0.5 p-2 bg-slate-50">
      {/* Undo / Redo */}
      <ToolBtn title="Annuler" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
        <Undo className="h-4 w-4" />
      </ToolBtn>
      <ToolBtn title="Rétablir" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
        <Redo className="h-4 w-4" />
      </ToolBtn>

      <Divider />

      {/* Font family */}
      <select
        title="Police"
        className="h-8 rounded-lg border border-slate-200 bg-white px-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#8f1913] cursor-pointer"
        value={editor.getAttributes("textStyle").fontFamily ?? ""}
        onChange={(e) => {
          if (!e.target.value) {
            editor.chain().focus().unsetFontFamily().run();
          } else {
            editor.chain().focus().setFontFamily(e.target.value).run();
          }
        }}
      >
        <option value="">Police par défaut</option>
        <option value="Arial, sans-serif">Arial</option>
        <option value="'Times New Roman', serif">Times New Roman</option>
        <option value="Georgia, serif">Georgia</option>
        <option value="'Courier New', monospace">Courier New</option>
        <option value="Verdana, sans-serif">Verdana</option>
        <option value="Trebuchet MS, sans-serif">Trebuchet MS</option>
      </select>

      {/* Headings */}
      <select
        title="Style de titre"
        className="h-8 rounded-lg border border-slate-200 bg-white px-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#8f1913] cursor-pointer"
        value={
          editor.isActive("heading", { level: 1 }) ? "1"
          : editor.isActive("heading", { level: 2 }) ? "2"
          : editor.isActive("heading", { level: 3 }) ? "3"
          : editor.isActive("heading", { level: 4 }) ? "4"
          : "0"
        }
        onChange={(e) => {
          const val = Number(e.target.value);
          if (val === 0) {
            editor.chain().focus().setParagraph().run();
          } else {
            editor.chain().focus().toggleHeading({ level: val as 1|2|3|4 }).run();
          }
        }}
      >
        <option value="0">Paragraphe</option>
        <option value="1">Titre 1</option>
        <option value="2">Titre 2</option>
        <option value="3">Titre 3</option>
        <option value="4">Titre 4</option>
      </select>

      <Divider />

      {/* Text formatting */}
      <ToolBtn title="Gras (Ctrl+B)" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold className="h-4 w-4" />
      </ToolBtn>
      <ToolBtn title="Italique (Ctrl+I)" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic className="h-4 w-4" />
      </ToolBtn>
      <ToolBtn title="Souligné (Ctrl+U)" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <UnderlineIcon className="h-4 w-4" />
      </ToolBtn>
      <ToolBtn title="Barré" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
        <Strikethrough className="h-4 w-4" />
      </ToolBtn>
      <ToolBtn title="Code en ligne" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>
        <Code className="h-4 w-4" />
      </ToolBtn>

      <Divider />

      {/* Color */}
      <div className="relative h-8 w-8" title="Couleur du texte">
        <button
          type="button"
          onClick={() => colorInputRef.current?.click()}
          className="flex flex-col items-center justify-center h-8 w-8 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <Type className="h-3.5 w-3.5 text-slate-600" />
          <div
            className="h-1 w-5 rounded-full mt-0.5"
            style={{ backgroundColor: editor.getAttributes("textStyle").color ?? "#000000" }}
          />
        </button>
        <input
          ref={colorInputRef}
          type="color"
          className="absolute opacity-0 w-0 h-0"
          value={editor.getAttributes("textStyle").color ?? "#000000"}
          onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
        />
      </div>

      {/* Highlight */}
      <div className="relative h-8 w-8" title="Surlignage">
        <button
          type="button"
          onClick={() => highlightInputRef.current?.click()}
          className="flex flex-col items-center justify-center h-8 w-8 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <Highlighter className="h-3.5 w-3.5 text-slate-600" />
          <div
            className="h-1 w-5 rounded-full mt-0.5"
            style={{ backgroundColor: (editor.getAttributes("highlight").color as string) ?? "#fef08a" }}
          />
        </button>
        <input
          ref={highlightInputRef}
          type="color"
          className="absolute opacity-0 w-0 h-0"
          value={(editor.getAttributes("highlight").color as string) ?? "#fef08a"}
          onChange={(e) =>
            editor.chain().focus().setHighlight({ color: e.target.value }).run()
          }
        />
      </div>

      <ToolBtn
        title="Effacer mise en forme"
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
      >
        <span className="text-xs font-bold">A<sub>x</sub></span>
      </ToolBtn>

      <Divider />

      {/* Alignment */}
      <ToolBtn title="Aligner à gauche" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
        <AlignLeft className="h-4 w-4" />
      </ToolBtn>
      <ToolBtn title="Centrer" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
        <AlignCenter className="h-4 w-4" />
      </ToolBtn>
      <ToolBtn title="Aligner à droite" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
        <AlignRight className="h-4 w-4" />
      </ToolBtn>
      <ToolBtn title="Justifier" active={editor.isActive({ textAlign: "justify" })} onClick={() => editor.chain().focus().setTextAlign("justify").run()}>
        <AlignJustify className="h-4 w-4" />
      </ToolBtn>

      <Divider />

      {/* Lists */}
      <ToolBtn title="Liste à puces" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List className="h-4 w-4" />
      </ToolBtn>
      <ToolBtn title="Liste numérotée" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered className="h-4 w-4" />
      </ToolBtn>
      <ToolBtn title="Citation" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <Quote className="h-4 w-4" />
      </ToolBtn>
      <ToolBtn title="Bloc de code" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
        <Code2 className="h-4 w-4" />
      </ToolBtn>
      <ToolBtn title="Ligne horizontale" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <Minus className="h-4 w-4" />
      </ToolBtn>

      <Divider />

      {/* Link */}
      <ToolBtn title="Lien" active={editor.isActive("link")} onClick={openLinkPanel}>
        <LinkIcon className="h-4 w-4" />
      </ToolBtn>

      {/* Image upload */}
      <ToolBtn title="Insérer une image" onClick={() => imageInputRef.current?.click()}>
        <ImageIcon className="h-4 w-4" />
      </ToolBtn>
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) uploadImage(file);
          e.target.value = "";
        }}
      />
    </div>

    {/* Link panel */}
    {linkPanelOpen && (
      <div className="flex items-center gap-2 px-3 py-2 bg-white border-t border-slate-200">
        <LinkIcon className="h-4 w-4 text-slate-400 shrink-0" />
        <input
          ref={linkInputRef}
          type="url"
          value={linkValue}
          onChange={(e) => setLinkValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); applyLink(); }
            if (e.key === "Escape") { e.preventDefault(); cancelLink(); }
          }}
          placeholder="https://exemple.com"
          className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#8f1913] focus:ring-1 focus:ring-[#8f1913]/30"
        />
        <button
          type="button"
          onClick={applyLink}
          className="flex items-center justify-center h-7 w-7 rounded-lg bg-[#8f1913] text-white hover:bg-[#6c100b] transition-colors shrink-0"
          title="Appliquer"
        >
          <Check className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={cancelLink}
          className="flex items-center justify-center h-7 w-7 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors shrink-0"
          title="Annuler"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )}
    </div>
  );
}

export function RichEditor({
  content,
  onChange,
  placeholder,
}: {
  content?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3, 4] } }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Image.configure({ inline: false, allowBase64: true }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-[#8f1913] underline" } }),
      Placeholder.configure({ placeholder: placeholder ?? "Rédigez votre article ici..." }),
      FontFamily,
    ],
    content: content ?? "",
    editorProps: {
      attributes: {
        class: "prose prose-slate max-w-none min-h-[400px] px-5 py-4 focus:outline-none text-slate-800",
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    immediatelyRender: false,
  });

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden focus-within:border-[#8f1913] focus-within:ring-2 focus-within:ring-[#8f1913]/20 transition-all">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
