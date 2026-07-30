import { useState, useEffect, useRef, useMemo, lazy, Suspense } from "react";
import {
  Search,
  Lock,
  MessageSquare,
  Video,
  Send,
  Check,
  CheckCheck,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  useGetAllMessages,
  useGetUserConversationMessages,
  useUserSendMessage,
  usePatientVideoCall,
  useUserAcceptCallMutation,
  useUserDeclineCallMutation,
  useReadMessage,
} from "@/queries";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import AcceptCallModal from "@/components/AcceptCallModal";
import { useIncomingCallListener } from "@/hooks/useIncomingCallListener";
// Lazy-loaded: Agora SDK only fetched when a call actually opens.
const VideoCallModal = lazy(() => import("@/components/VideoCallModal"));
import { toast } from "react-toastify";

export default function PatientMessages() {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [agoraToken, setAgoraToken] = useState("");
  const [channelName, setChannelName] = useState("");

  const { data: allMessages, refetch } = useGetAllMessages();

  const { data: allConversationMessages, isLoading: isMessagesLoading } =
    useGetUserConversationMessages(Number(selectedContact));

  const { mutate: sendMessage } = useUserSendMessage();

  const { mutate: videoCall } = usePatientVideoCall();

  const { mutate: acceptCall } = useUserAcceptCallMutation();

  const { mutate: rejectCall } = useUserDeclineCallMutation();

  const { mutate: readMessage } = useReadMessage();

  const [searchQuery, setSearchQuery] = useState("");

  const [newMessage, setNewMessage] = useState("");

  const [isFirstRender, setIsFirstRender] = useState(true);

  const [isCalling, setIsCalling] = useState(false);

  const [incomingCallData, setIncomingCallData] = useState<any | null>(null);

  // Auto timeout ref
  const [autoRejectTimer, setAutoRejectTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  const [, setUid] = useState<number>(0);

  const [activeCallId, setActiveCallId] = useState<number | undefined>();

  const [doctorIdP, setDoctorIdP] = useState<number | null>(null);

  useIncomingCallListener(
    (data) => {
      setIncomingCallData(data);

      const timer = setTimeout(() => {
        data?._audio?.pause();
        if (data?.call_id) rejectCall(data.call_id);
        setIncomingCallData(null);
      }, 30_000);

      setAutoRejectTimer(timer);
    },
    () => {
      // 👉 This runs when the call ends
      setIsVideoCallOpen(false);
      setIncomingCallData(null);
    },
    // ✅ Chat Message Notification Handler
    (chatData) => {
      if (chatData?.type === "call" && chatData?.action === "call_rejected") {

        // Clean up any active call states
        setIsVideoCallOpen(false); // Close call modal
        setIsCalling(false); // Remove "Connecting" overlay
        setActiveCallId(undefined); // Reset call ID

        // ✅ Notify doctor
        toast.error(`${chatData.sender_name} rejected the call.`, {
          position: "top-right",
          autoClose: 4000,
        });
      } else if (
        chatData?.type === "call" &&
        chatData?.action === "call_ended"
      ) {
        toast.info(`${chatData.sender_name} ended the call.`, {
          position: "top-right",
          autoClose: 4000,
        });
      } else {
        // Existing fallback for chat messages
        toast.info(`${chatData.sender_name}: ${chatData.message}`, {
          position: "bottom-right",
          autoClose: 5000,
          closeOnClick: true,
        });
      }
    }
  );

  const handleAccept = () => {
    incomingCallData?._audio?.pause();
    acceptCall({ call_id: parseInt(incomingCallData?.call_id || "0") });

    if (autoRejectTimer) clearTimeout(autoRejectTimer);

    // 👇 Save the call info before clearing
    setChannelName(incomingCallData?.channel_name);
    setAgoraToken(incomingCallData?.agora_token);
    setUid(Number(incomingCallData?.uid)); // create this state
    setIsVideoCallOpen(true);
    refetch();

    setActiveCallId(parseInt(incomingCallData?.call_id || "0"));

    setDoctorIdP(incomingCallData?.caller_id ?? null);

    // ✅ Delay clearing this to avoid loss of token data
    setTimeout(() => setIncomingCallData(null), 500);
  };

  const handleReject = () => {
    incomingCallData?._audio?.pause();
    rejectCall({
      call_id: parseInt(incomingCallData?.call_id || "0"),
      conversation_id: incomingCallData?.conversation_id,
      receiver_id: incomingCallData?.caller_id, // the doctor who called
      receiver_type: "Doctor",
    });
    setIncomingCallData(null);
  };

  const location = useLocation();
  const chatState = location.state as {
    receiverId: number;
    receiverType: string;
    conversationId: number;
    contactName: string;
    contactProfile?: string;
  } | null;

  useEffect(() => {
    if (
      chatState?.receiverId &&
      chatState.conversationId === 0 &&
      location.state?.isNewChat
    ) {
      setSelectedContact("0");

      // Clear state after use to avoid sticky state on reload
      window.history.replaceState({}, document.title);
    }
  }, [chatState, location.state]);

  const filteredMessages = useMemo(() => {
    const baseList =
      allMessages?.filter((messages) =>
        messages.contactName.toLowerCase().includes(searchQuery.toLowerCase())
      ) || [];

    // Add chatState user if conversationId is 0 and not in the list already

    if (chatState?.conversationId === 0) {
      const realConvExists = baseList.some(
        (m) => String(m.contactId) === String(chatState.receiverId) // ensure both are strings
      );

      if (!realConvExists) {
        baseList.unshift({
          conversationId: 0,
          contactName: chatState.contactName,
          contactProfile: chatState.contactProfile || "/placeholder.svg",
          isOnline: true,
          lastMessage: "",
          lastMessageTime: new Date().toISOString(),
          unreadCount: 0,
          contactType: "",
          contactId: "",
          status: "",
          isBlocked: 0,
        });
      }
    }

    return baseList;
  }, [allMessages, searchQuery, chatState]);

  const selectedMessageData = allMessages?.find(
    (selectedMessage) =>
      selectedMessage.conversationId === Number(selectedContact)
  );

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Send the message using the mutation
      sendMessage(
        {
          conversationId: parseInt(selectedContact || "0"),
          receiverId:
            selectedContact === "0"
              ? chatState?.receiverId ?? 0
              : allConversationMessages?.[0]?.sender?.id ?? 0,
          receiverType: "MydocLab\\Models\\Doctor",
          message: newMessage,
        },
        {
          onSuccess: async (data) => {
            const realId = data?.conversationId;

            // 👇 only switch if it's a new conversation
            if (selectedContact === "0" && realId) {
              setSelectedContact(String(realId));
            }

            refetch(); // refresh sidebar
            toast.success("Message sent successfully", {
              position: "top-right",
            });
            setNewMessage("");
          },

          onError: (error: any) => {
            const errMsg = error?.response?.data?.message;

            // Handle error, e.g., show an error message
            toast.error(
              "Failed to update profile. Please try again. " + errMsg,
              { position: "top-right" }
            );
          },
        }
      );
      setNewMessage("");
    }
  };

  const patientMessage = allConversationMessages?.find(
    (msg) => msg.senderType === "MydocLab\\Models\\User"
  );

  const patientIdP = patientMessage?.senderId ?? null;

  const handleVideoCall = () => {
    setIsCalling(true);

    // Find the doctor (non-patient) message sender
    const doctorMessage = allConversationMessages?.find(
      (msg) => msg.senderType !== "MydocLab\\Models\\User"
    );

    const doctorId = doctorMessage?.senderId ?? chatState?.receiverId ?? 0;

    setDoctorIdP(doctorId);

    videoCall(
      {
        conversationId: Number.parseInt(selectedContact || "0"),
        receiverId: doctorId,
        receiverType:
          allConversationMessages?.[0]?.senderType ===
          "MydocLab\\Models\\Doctor"
            ? "Doctor"
            : "Doctor",
      },
      {
        onSuccess: (data) => {
          setActiveCallId(data.callId);
          setAgoraToken(data.token); // ✅ Correct key
          setChannelName(data.channelName); // ✅ Correct key
          setIsCalling(false); // ✅ hide connecting overlay
          setIsVideoCallOpen(true);
        },

        onError: () => {
          setIsCalling(false);
          // Optionally show an error toast or message
          alert("Failed to initiate video call.");
        },
      }
    );
  };

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({
        behavior: isFirstRender ? "auto" : "smooth",
      });

      if (isFirstRender) {
        setIsFirstRender(false); // Only once
      }
    }
  }, [allConversationMessages]);

  // Polling messages when a conversation is selected
  useEffect(() => {
    if (!selectedContact) return;

    const interval = setInterval(() => {
      refetch();
    }, 5000); // every 5 seconds

    return () => clearInterval(interval); // cleanup when chat is closed or unmounted
  }, [selectedContact]);

  const groupMessagesByDate = (messages: any[]) => {
    const grouped: { [date: string]: any[] } = {};

    messages.forEach((msg) => {
      const date = parseISO(msg.createdAt);
      let key = "";

      if (isToday(date)) {
        key = "Today";
      } else if (isYesterday(date)) {
        key = "Yesterday";
      } else {
        key = format(date, "MMMM dd, yyyy");
      }

      if (!grouped[key]) {
        grouped[key] = [];
      }

      grouped[key].push(msg);
    });

    return grouped;
  };

  return (
    <>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar - Contact List */}
        <div
          className={`${
            selectedContact && "hidden md:flex"
          } w-full md:w-96 bg-white border-r border-gray-200 flex flex-col`}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-lg font-semibold text-gray-900 mb-4">
              Chat with your healthcare providers
            </h1>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search Contacts"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
              />
            </div>
          </div>

          {/* Contact List */}
          <div className="flex-1 overflow-y-auto">
            {filteredMessages?.map((messages) => (
              <div
                key={messages.conversationId}
                onClick={() => {
                  setSelectedContact(String(messages.conversationId));
                  readMessage({ conversationId: messages.conversationId });
                }}
                className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors ${
                  Number(selectedContact) === messages.conversationId
                    ? "bg-blue-50"
                    : ""
                }`}
              >
                {/* Avatar with online indicator */}
                <div className="relative mr-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={messages.contactProfile || "/placeholder.svg"}
                      alt={messages.contactName}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                      {messages.contactName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Contact Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {messages.contactName}
                    </h3>
                    <span className="text-xs text-gray-500 ml-2">
                      {new Date(messages.lastMessageTime).toLocaleTimeString(
                        [],
                        { hour: "2-digit", minute: "2-digit" }
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate">
                      {messages.lastMessage}
                    </p>
                    {Number(messages.unreadCount) > 0 && (
                      <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs ml-2 h-5 w-5 rounded-full flex items-center justify-center p-0">
                        {messages.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-center text-xs text-gray-500">
              <Lock className="h-3 w-3 mr-1" />
              Your Personal Messages are end to end encrypted
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div
          className={`${
            !selectedContact && "hidden md:flex"
          } flex-1 flex flex-col bg-white relative mb-16`}
        >
          {selectedContact !== null ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                <div className="flex items-center">
                  <button
                    onClick={() => setSelectedContact(null)}
                    className="mr-3 p-1 hover:bg-gray-100 rounded md:hidden"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage
                      src={
                        selectedMessageData?.contactProfile ||
                        (selectedContact === "0"
                          ? chatState?.contactProfile
                          : "/placeholder.svg")
                      }
                      alt={
                        selectedMessageData?.contactName ||
                        (selectedContact === "0" ? chatState?.contactName : "")
                      }
                    />
                  </Avatar>
                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {selectedMessageData?.contactName ||
                        (selectedContact === "0" ? chatState?.contactName : "")}
                    </h2>
                    {selectedMessageData?.status && (
                      <div className="flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                        <span className="text-xs text-gray-500">
                          {selectedMessageData.status}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center">
                  {selectedMessageData?.isBlocked === 1 ? (
                    <div className="text-xs text-red-500 ml-2">
                      You can't call this contact. Your appointment is
                      completed.
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                      onClick={handleVideoCall}
                    >
                      <Video
                        style={{ width: "32px", height: "32px" }}
                        className="text-gray-500"
                      />
                    </Button>
                  )}

                  {isCalling && !isVideoCallOpen && (
                    <div className="absolute top-0 left-0 right-0 flex justify-center items-center bg-black bg-opacity-30 h-full z-50">
                      <div className="bg-white px-6 py-4 rounded shadow text-gray-700 font-medium">
                        Connecting to video call...
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50 pt-6">
                {isMessagesLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <span className="text-sm text-gray-500">
                      Loading messages...
                    </span>
                  </div>
                ) : (
                  <>
                    {Object.entries(
                      groupMessagesByDate(allConversationMessages || [])
                    ).map(([dateLabel, messages]) => (
                      <div key={dateLabel}>
                        <div className="flex justify-center my-4">
                          <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
                            {dateLabel}
                          </span>
                        </div>

                        {messages.map((message) => {
                          const isUserMessage =
                            message.senderType === "MydocLab\\Models\\User";

                          return (
                            <div
                              key={message.id}
                              className={`flex mb-4 ${
                                isUserMessage ? "justify-end" : "justify-start"
                              }`}
                            >
                              <div
                                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                                  isUserMessage
                                    ? "bg-blue-500 text-white rounded-tr-none"
                                    : "bg-gray-100 text-gray-800 rounded-tl-none"
                                }`}
                              >
                                <p>{message.message}</p>
                                <div
                                  className={`text-xs mt-1 flex justify-between items-center ${
                                    isUserMessage
                                      ? "text-blue-100"
                                      : "text-gray-500"
                                  }`}
                                >
                                  <span>
                                    {new Date(
                                      message.createdAt
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: true,
                                    })}
                                  </span>

                                  {isUserMessage && (
                                    <span className="ml-2">
                                      {message.readAt ? (
                                        <CheckCheck className="w-4 h-4 text-blue-300" />
                                      ) : (
                                        <Check className="w-4 h-4 text-white/50" />
                                      )}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                    <div ref={bottomRef} />
                  </>
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center">
                  <Input
                    type="text"
                    placeholder="Type message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="mx-2 bg-gray-50"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage();
                      }
                    }}
                    disabled={selectedMessageData?.isBlocked === 1}
                  />

                  {selectedMessageData?.isBlocked === 1 ? (
                    <div className="text-xs text-red-500 ml-2"></div>
                  ) : (
                    <Button
                      onClick={handleSendMessage}
                      size="icon"
                      className="rounded-full bg-gray-100 hover:bg-gray-200"
                    >
                      <Send className="h-5 w-5 text-gray-600" />
                    </Button>
                  )}
                </div>

                {selectedMessageData?.isBlocked === 1 && (
                  <p className="text-sm text-red-500 mt-2">
                    You can't send messages to this contact. Your appointment is
                    completed.
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <MessageSquare className="h-10 w-10 text-gray-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  Connect with doctors
                </h2>
                <p className="text-gray-500 max-w-sm">
                  Select a conversation from the sidebar to start chatting with
                  your healthcare providers
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {isVideoCallOpen && (
        <Suspense fallback={null}>
          <VideoCallModal
            isOpen={isVideoCallOpen}
            onClose={() => {
              setIsVideoCallOpen(false); // ✅ closes modal
              setIsCalling(false); // ✅ hides overlay
            }}
            contactName={selectedMessageData?.contactName || "Doctor"}
            contactProfile={selectedMessageData?.contactProfile}
            agoraToken={agoraToken}
            channelName={channelName}
            appId={import.meta.env.VITE_AGORA_APP_ID}
            role="patient" // or "patient"
            callId={activeCallId}
            conversationId={
              incomingCallData?.conversation_id ?? Number(selectedContact)
            }
            doctorIdP={doctorIdP} // Pass the doctor ID here
            patientIdP={patientIdP}
          />
        </Suspense>
      )}

      <AcceptCallModal
        isOpen={!!incomingCallData}
        callerName={incomingCallData?.caller_name || "Doctor"}
        onAccept={handleAccept}
        onReject={handleReject}
      />
    </>
  );
}
