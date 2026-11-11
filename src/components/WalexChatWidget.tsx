import { useEffect } from "react";

// Walex support chat (help desk widget): AI first, then the DocLabPharm team.
// Replaces Tawk.to. VITE_WALEX_CHAT_URL overrides the help-desk address.
const HELPDESK = (import.meta.env.VITE_WALEX_CHAT_URL || "https://helpdesk.walexbiznig.com").replace(/\/$/, "");

declare global {
  interface Window {
    BeChat?: { open: (options?: { newChat?: boolean }) => void };
  }
}

export const openSupportChat = (e?: { preventDefault: () => void }) => {
  if (window.BeChat?.open) {
    e?.preventDefault();
    window.BeChat.open();
  }
  // otherwise the link's normal href (e-mail) is used
};

const WalexChatWidget = () => {
  useEffect(() => {
    if (document.getElementById("walex-chat-loader")) return;
    const script = document.createElement("script");
    script.id = "walex-chat-loader";
    script.async = true;
    script.src = `${HELPDESK}/livechat-loader.js?brand=doclabpharm`;
    document.body.appendChild(script);
  }, []);
  return null;
};

export default WalexChatWidget;
