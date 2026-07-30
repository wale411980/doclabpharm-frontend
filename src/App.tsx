import { useEffect, useState, lazy, Suspense } from "react";

import Index from "@/router/index";
import { AuthProvider } from "./providers/AuthProvider";
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import CSS
import "primereact/resources/themes/lara-light-indigo/theme.css"; // or any other theme
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Spinner from "@/components/Spinner";
import { onMessage } from "firebase/messaging";
import { messaging } from "@/lib/firebase";
import AcceptCallModal from "@/components/AcceptCallModal";
import TawkToWidget from "@/components/TawkToWidget";

// Lazy-loaded: pulls in the Agora video SDK (~1.3MB) only when a call opens,
// instead of on every page load.
const VideoCallModal = lazy(() => import("@/components/VideoCallModal"));

const App = () => {
  const [loading, setLoading] = useState(true);
  const [incomingCallData, setIncomingCallData] = useState<any>(null);
  const [isIncomingModalOpen, setIsIncomingModalOpen] = useState(false);
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Listen for call notifications
  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      if (payload?.data?.action === "incoming_call") {
        setIncomingCallData({
          callId: payload.data.call_id,
          channelName: payload.data.channel_name,
          agoraToken: payload.data.agora_token,
          callerName: payload.data.caller_name,
          callerId: payload.data.caller_id,
        });
        setIsIncomingModalOpen(true);
      }
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <TawkToWidget />
      <AuthProvider>
        <Index />
      </AuthProvider>
      <ToastContainer />

      {/* Incoming Call Modal */}
      <AcceptCallModal
        isOpen={isIncomingModalOpen}
        // callData={incomingCallData}
        callerName={incomingCallData?.callerName}
        onAccept={() => {
          setIsIncomingModalOpen(false);
          setIsVideoCallOpen(true);
        }}
        onReject={() => {
          setIsIncomingModalOpen(false);
          // Optional: notify backend about rejection
        }}
      />

      {/* Video Call Modal - only mounted (and its Agora chunk fetched) while a call is open */}
      {isVideoCallOpen && (
        <Suspense fallback={null}>
          <VideoCallModal
            isOpen={isVideoCallOpen}
            onClose={() => setIsVideoCallOpen(false)}
            contactName={incomingCallData?.callerName}
            contactProfile={"/doctor.png"}
            agoraToken={incomingCallData?.agoraToken}
            channelName={incomingCallData?.channelName}
            appId={import.meta.env.VITE_AGORA_APP_ID}
            conversationId={incomingCallData?.conversationId}
            patientIdP={incomingCallData?.patientIdP}
            doctorIdP={incomingCallData?.doctorIdP}
          />
        </Suspense>
      )}
    </>
  );
};

export default App;
