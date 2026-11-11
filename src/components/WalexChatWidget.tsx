import { useEffect } from "react";

// Walex help-desk chat (AI first, then the DocLabPharm team). Replaces Tawk.to.
// NEXT_PUBLIC_WALEX_CHAT_URL overrides the help-desk address.
const HELPDESK = (process.env.NEXT_PUBLIC_WALEX_CHAT_URL || "https://helpdesk.walexbiznig.com").replace(/\/$/, "");

/** Open the support chat from any button or link. */
export function openSupportChat(): void {
  const chat = (window as unknown as { BeChat?: { open?: () => void } }).BeChat;
  chat?.open?.();
}

const WalexChatWidget = () => {
  useEffect(() => {
    if (document.getElementById("walex-chat-script")) return;
    if (!/^https:\/\/[a-z0-9.-]+(\/[\w./-]*)?$/i.test(HELPDESK)) return;

    const script = document.createElement("script");
    script.id = "walex-chat-script";
    script.async = true;
    script.src = `${HELPDESK}/livechat-loader.js?brand=doclabpharm`;
    document.body.appendChild(script);
  }, []);

  return null;
};

export default WalexChatWidget;
