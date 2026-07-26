import { useEffect, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AcceptCallModalProps {
  isOpen: boolean;
  callerName: string;
  onAccept: () => void;
  onReject: () => void;
}

export default function AcceptCallModal({
  isOpen,
  callerName,
  onAccept,
  onReject,
}: AcceptCallModalProps) {
  const ringtoneRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 🔔 Play ringtone when modal opens
  useEffect(() => {
    if (isOpen) {
      const audio = new Audio("/incoming-call.mp3");
      audio.loop = true;
      audio.play().catch((err) => console.log("🔕 Failed to play:", err));
      ringtoneRef.current = audio;

      timeoutRef.current = setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
        ringtoneRef.current = null;
      }, 30000);
    }

    return () => {
      if (ringtoneRef.current) {
        ringtoneRef.current.pause();
        ringtoneRef.current.currentTime = 0;
        ringtoneRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isOpen]);

  const handleAccept = () => {
    if (ringtoneRef.current) {
      ringtoneRef.current.pause();
      ringtoneRef.current.currentTime = 0;
      ringtoneRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    onAccept();
  };

  const handleReject = () => {
    if (ringtoneRef.current) {
      ringtoneRef.current.pause();
      ringtoneRef.current.currentTime = 0;
      ringtoneRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    onReject();
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="text-center py-6">
        <h2 className="text-xl font-semibold mb-4">
          {callerName} is calling you
        </h2>

        <div className="flex justify-center space-x-4 mt-4">
          <div className="w-4 h-4 rounded-full bg-red-500 animate-ping"></div>
          <Button variant="destructive" onClick={handleReject}>
            Reject
          </Button>
          <Button
            className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
            onClick={handleAccept}
          >
            Accept
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
