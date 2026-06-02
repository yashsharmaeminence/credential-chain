import * as React from "react";

export default function LogoMark({
  className,
  title = "JournalsPro",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 512 512"
      role="img"
      aria-label={title}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M112 144C112 126.327 126.327 112 144 112H236C253.673 112 268 126.327 268 144V384C268 384 248 368 220 368H144C126.327 368 112 353.673 112 336V144Z"
        stroke="currentColor"
        strokeWidth="18"
        strokeLinejoin="round"
      />
      <path
        d="M400 144C400 126.327 385.673 112 368 112H276C258.327 112 244 126.327 244 144V384C244 384 264 368 292 368H368C385.673 368 400 353.673 400 336V144Z"
        stroke="currentColor"
        strokeWidth="18"
        strokeLinejoin="round"
      />
      <path
        d="M256 128V384"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
        opacity="0.35"
      />

      <path
        d="M212 272L238 298L304 232"
        stroke="hsl(var(--primary))"
        strokeWidth="20"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path d="M152 176H224" stroke="currentColor" strokeWidth="10" strokeLinecap="round" opacity="0.18" />
      <path d="M288 176H360" stroke="currentColor" strokeWidth="10" strokeLinecap="round" opacity="0.18" />
    </svg>
  );
}

