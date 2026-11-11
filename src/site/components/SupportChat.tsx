import Script from "next/script";

// Walex help-desk chat on the public website (AI first, then the DocLabPharm team).
// The signed-in app loads the same chat from src/components/WalexChatWidget.tsx.
// NEXT_PUBLIC_WALEX_CHAT_URL overrides the help-desk address.
const HELPDESK = (process.env.NEXT_PUBLIC_WALEX_CHAT_URL || "https://helpdesk.walexbiznig.com").replace(/\/$/, "");

export function SupportChat() {
  if (!/^https:\/\/[a-z0-9.-]+(\/[\w./-]*)?$/i.test(HELPDESK)) return null;
  return <Script id="walex-chat-script" src={`${HELPDESK}/livechat-loader.js?brand=doclabpharm`} strategy="lazyOnload" />;
}
