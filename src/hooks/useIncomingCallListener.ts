import { useEffect } from "react";
import { onMessage } from "firebase/messaging";
import { messaging } from "@/lib/firebase";
import { toast } from "react-toastify";

type IncomingCallHandler = (data: any) => void;
type CallEndedHandler = () => void;
type ChatMessageHandler = (data: any) => void;

export function useIncomingCallListener(
  onIncomingCall: IncomingCallHandler,
  onCallEnded?: CallEndedHandler,
  onMessageReceived?: ChatMessageHandler
) {
  useEffect(() => {
    const audio = new Audio("/incoming-call.mp3");
    audio.loop = true;
    audio.volume = 1.0;

    const unsubscribe = onMessage(messaging, async (payload) => {
      const data = payload.data;

      // ✅ Handle incoming call
      if (data?.type === "call" && data?.action === "incoming_call") {
        try {
          await audio.play();
        } catch (err) {
          console.warn("🎵 Autoplay blocked or error:", err);
        }
        onIncomingCall({ ...data, _audio: audio });
      }

      // ✅ Handle call ended
      if (data?.type === "call" && data?.action === "call_ended") {
        toast.error(`${data.sender_name} ended the call.`, {
          position: "top-center",
          autoClose: 4000,
        });
        onCallEnded?.();
      }

      // ✅ Handle call rejected
      if (data?.type === "call" && data?.action === "call_rejected") {
        toast.error(`${data.sender_name} rejected the call.`, {
          position: "top-center",
          autoClose: 4000,
        });
        onCallEnded?.(); // This is the fix to close the modal
      }

      // ✅ Handle incoming chat message
      if (data?.message && data?.sender_name) {

        // 👉 Play ding sound
        const ding = new Audio("/ding.mp3");
        ding.volume = 0.6; // Set volume to 60%
        try {
          await ding.play();
        } catch (err) {
          console.warn("🔇 Could not play notification sound:", err);
        }

        if (onMessageReceived) {
          onMessageReceived(data); // Pass to external handler
        } else {
          // Default toast display if no handler is provided
          toast.info(`${data.sender_name}: ${data.message}`, {
            position: "bottom-right",
            autoClose: 5000,
            closeOnClick: true,
          });
        }
      }
    });

    return () => {
      audio.pause();
      unsubscribe();
    };
  }, [onIncomingCall, onCallEnded, onMessageReceived]);
}
