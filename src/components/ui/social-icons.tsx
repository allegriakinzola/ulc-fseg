import type { SVGProps } from "react";

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M13.5 21v-7.5h2.55l.38-2.97h-2.93V8.64c0-.86.24-1.45 1.47-1.45h1.57V4.54a21 21 0 0 0-2.29-.12c-2.27 0-3.82 1.39-3.82 3.93v2.18H7.88v2.97h2.55V21h3.07Z" />
    </svg>
  );
}

export function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4V21H3V9.75ZM9.5 9.75h3.84v1.54h.05c.54-.97 1.87-2 3.85-2 4.12 0 4.88 2.55 4.88 5.87V21h-4v-5.07c0-1.21-.02-2.77-1.78-2.77-1.78 0-2.05 1.31-2.05 2.68V21h-4V9.75Z" />
    </svg>
  );
}
