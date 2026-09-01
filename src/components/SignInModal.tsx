import { useEffect } from "react";

export function SignInModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="modal-scrim" onClick={onClose} role="presentation">
      <div
        className="modal modal-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="signin-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <div>
            <div className="ai-tag">COMING SOON</div>
            <h3 id="signin-title" style={{ marginTop: 12 }}>
              Accounts are not open yet
            </h3>
            <p>
              Signing in arrives with AI assist. Until then everything here is free to
              browse, and nothing asks you to make an account.
            </p>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="modal-foot">
          <button type="button" className="btn-solid" onClick={onClose}>
            Keep browsing
          </button>
        </div>
      </div>
    </div>
  );
}
