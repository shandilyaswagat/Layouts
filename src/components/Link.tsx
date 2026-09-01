import type { MouseEvent, ReactNode } from "react";

type Props = {
  to: string;
  navigate: (to: string) => void;
  className?: string;
  children: ReactNode;
};

/** Internal link. Falls back to normal navigation for modified clicks. */
export function Link({ to, navigate, className, children }: Props) {
  function onClick(e: MouseEvent<HTMLAnchorElement>) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    navigate(to);
  }

  return (
    <a href={to} className={className} onClick={onClick}>
      {children}
    </a>
  );
}
