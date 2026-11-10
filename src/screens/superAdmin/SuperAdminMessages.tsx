

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  MessageSquare,

  Users,
  Search,

  MoreVertical,

  Trash2,
  MoreHorizontal,
  Check,
  X,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useSuperAdminConversation, useSuperAdminConversationMessages, useSuperAdminMessagesStats, useSuperAdminDeleteConversation, useSuperAdminDeleteMessage } from "@/queries"
import type { SuperAdminConversations, SuperAdminConversationsMessages } from "@/types"
import { format, isToday, isYesterday, parseISO } from "date-fns"
import { toast } from "react-toastify"

export default function SuperAdminMessages() {
  const [selectedContact, setSelectedContact] = useState<SuperAdminConversations | null>(null)

  const [searchQuery, setSearchQuery] = useState("")

  const [selectedMessages, setSelectedMessages] = useState<Set<number>>(new Set())
  const [isSelectingMessages, setIsSelectingMessages] = useState(false)
  const [messageToDelete, setMessageToDelete] = useState<number | null>(null)
  const [conversationToDelete, setConversationToDelete] = useState<number | null>(null)

  const [, setMessagesList] = useState<SuperAdminConversationsMessages[]>([])

  const { data: stats, isLoading } = useSuperAdminMessagesStats()
  const { data: conversations, refetch: refetchConversation } = useSuperAdminConversation()
  const { data: conversationMessages, isLoading: isMessagesLoading, refetch: refetchMessages } = useSuperAdminConversationMessages(selectedContact?.id ?? 0)
  const { mutate: deleteMessage } = useSuperAdminDeleteMessage()
  const { mutate: deleteConversation } = useSuperAdminDeleteConversation()

  const filteredContacts = conversations?.filter((conversation: SuperAdminConversations) => {
    const matchesSearch = conversation.sender.firstName?.toLowerCase().includes(searchQuery?.toLowerCase()) || conversation.sender.lastName?.toLowerCase().includes(searchQuery?.toLowerCase())
    return matchesSearch
  })


  useEffect(() => {
    setSelectedMessages(new Set())
    setIsSelectingMessages(false)
  }, [selectedContact])

    const isDoctor = true

  const messagesListed: SuperAdminConversationsMessages[] = (conversationMessages ?? []).map((msg) => ({
    id: msg.id,
      conversationId: msg.conversationId,
      senderId: msg.senderId,

    message: msg.message,
      readAt: msg.readAt,
    createdAt: msg.createdAt,
    updatedAt: msg.updatedAt,
  senderType: isDoctor ? "MydocLab\\Models\\Doctor" : "MydocLab\\Models\\User",
  }))


  function groupMessagesByDate(messages: SuperAdminConversationsMessages[]) {
    const grouped: Record<string, SuperAdminConversationsMessages[]> = {}

    for (const msg of messages) {
      const date = parseISO(msg.createdAt) // ✅ now it's valid
      const dateKey = format(date, "yyyy-MM-dd")

      if (!grouped[dateKey]) grouped[dateKey] = []
      grouped[dateKey].push(msg)
    }

    return grouped
  }


  const groupedMessages = groupMessagesByDate(messagesListed)




  const handleDeleteConversation = (contactId: number) => {
    setConversationToDelete(contactId)
  }

  const confirmDeleteConversation = () => {
    if (conversationToDelete) {
      deleteConversation(
        { id: conversationToDelete },
        {
          onSuccess: () => {
            refetchConversation()
            toast.success("Conversation deleted successfully", {
              position: "top-right"})
            if (Number(selectedContact?.id) === conversationToDelete) {
  setSelectedContact(null)
}
            setConversationToDelete(null)
          },
          onError: (error: any) => {
            const errMsg = error?.response?.data?.message;
            toast.error("Failed to delete conversation " + errMsg, {
              position: "top-right",
            })
            setConversationToDelete(null)
          },
        }
      )
    }
  }

  const handleDeleteMessage = (messageId: number) => {
    setMessageToDelete(messageId)
  }

 const confirmDeleteMessage = () => {
    if (messageToDelete) {
      deleteMessage(
        { id: messageToDelete },
        {
          onSuccess: () => {
            refetchMessages()
            toast.success("Message deleted successfully", {
              position: "top-right",
            })
            setMessagesList((prev) => prev.filter((msg) => msg.id !== Number(messageToDelete)))
            setMessageToDelete(null)
          },
          onError: (error: any) => {
            const errMsg = error?.response?.data?.message;
            toast.error("Failed to delete message " + errMsg, {
              position: "top-right",
            })
          },
        }
      )
    }
  }

  const handleSelectMessage = (messageId: number) => {
    if (isSelectingMessages) {
      const newSelected = new Set(selectedMessages)
      if (newSelected.has(messageId)) {
        newSelected.delete(messageId)
      } else {
        newSelected.add(messageId)
      }
      setSelectedMessages(newSelected)
    }
  }

  const handleDeleteSelectedMessages = () => {
    setMessagesList((prev) => prev.filter((message) => !selectedMessages.has(message.id)))
    setSelectedMessages(new Set())
    setIsSelectingMessages(false)
  }



  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen p-4 lg:p-6">
      <div className="">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Chat with patients and healthcare providers</h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className={`bg-green-600 text-white border-0`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/90 text-sm font-medium mb-1">Total Conversations</p>
                    <p className="text-3xl font-bold mb-2">{stats?.totalConversations}</p>
                    <p className="text-white/80 text-sm">Conversations in the system</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-white/80" />
                </div>
              </CardContent>
            </Card>

            <Card className={`bg-green-600 text-white border-0`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/90 text-sm font-medium mb-1">Total Messages</p>
                    <p className="text-3xl font-bold mb-2">{stats?.totalMessages}</p>
                    <p className="text-white/80 text-sm">Messages in the system</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-white/80" />
                </div>
              </CardContent>
            </Card>

            <Card className={`bg-green-600 text-white border-0`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/90 text-sm font-medium mb-1">Today's Messages</p>
                    <p className="text-3xl font-bold mb-2">{stats?.messagesToday}</p>
                    <p className="text-white/80 text-sm">Today's Messages in the system</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-white/80" />
                </div>
              </CardContent>
            </Card>

            <Card className={`bg-green-600 text-white border-0`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/90 text-sm font-medium mb-1">Active Users</p>
                    <p className="text-3xl font-bold mb-2">{stats?.activeUsersLast24h}</p>
                    <p className="text-white/80 text-sm">Active Users Last 24 Hours</p>
                  </div>
                  <Users className="h-8 w-8 text-white/80" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-300px)] min-h-[600px]">
          {/* Messages Sidebar */}
          <div className="lg:col-span-4 xl:col-span-3">
            <Card className="h-full">
              <CardContent className="p-0 h-full flex flex-col">
                {/* Messages Header */}
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Messages</h2>
                 
                  </div>

                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search Messages"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                </div>

                {/* Contacts List */}
                 <ScrollArea className="flex-1 overflow-y-auto max-h-[calc(100vh-300px)] px-2">
                  <div className="p-2">
                    {filteredContacts?.map((conversation: SuperAdminConversations) => (
                      <div
                        key={conversation.id}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors relative ${selectedContact?.id === conversation?.id ? "bg-green-50 border border-green-200" : "hover:bg-gray-50"
                          }`}
                      >
                        <div
                          className="flex items-center gap-3 flex-1 cursor-pointer"
                          onClick={() => setSelectedContact(conversation)}
                        >
                          <div className="relative">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={conversation.sender.profileImage || "/placeholder.svg"} alt={conversation.sender.firstName} />
                              <AvatarFallback>
                                {`${conversation.sender.firstName} ${conversation.sender.lastName}`
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
               
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-sm truncate">{`${conversation.sender.firstName} ${conversation.sender.lastName}`}</p>
                              <span className="text-xs text-gray-500">
                                {new Date("2025-07-07T08:04:06.000Z").getHours().toString().padStart(2, '0')}:
                                {new Date("2025-07-07T08:04:06.000Z").getMinutes().toString().padStart(2, '0')}
                              </span>

                            </div>
                            <p className="text-xs text-green-600 mb-1">{conversation.sender.speciality}</p>
                          </div>

                         
                        </div>

                        
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-8 xl:col-span-9">
            <Card className="h-full">
              <CardContent className="p-0 h-full flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
           

                    {selectedContact && (
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={selectedContact.sender.profileImage || "/placeholder.svg"}
                              alt={selectedContact.sender.firstName}
                            />
                            <AvatarFallback>
                              {`${selectedContact.sender.firstName} ${selectedContact.sender.lastName}`
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                      
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {selectedContact.sender.firstName} {selectedContact.sender.lastName}
                          </h3>
                          <div className="flex items-center gap-2 text-sm">
                            <Badge variant="secondary" className="text-xs">
                              {format(new Date(selectedContact.createdAt), 'dd/MM/yyyy')}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )}


                    <div className="flex items-center gap-2">
                      {isSelectingMessages ? (
                        <>
                          <Button variant="outline" size="sm" onClick={() => setIsSelectingMessages(false)}>
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                          {selectedMessages.size > 0 && (
                            <Button variant="destructive" size="sm" onClick={handleDeleteSelectedMessages}>
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete ({selectedMessages.size})
                            </Button>
                          )}
                        </>
                      ) : (
                        <>


                            {selectedContact ? (
                              <>
                                <span className="text-xs text-green-700">Contact selected</span>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <div className="">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6"
                                      >
                                        <MoreVertical className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </DropdownMenuTrigger>
                                 <DropdownMenuContent align="end" className="z-50">
                                          <DropdownMenuItem
                                            onClick={() => handleDeleteConversation(selectedContact.id)}
                                            className="text-red-600 focus:text-red-600"
                                          >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete Conversation
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                </DropdownMenu>
                              </>
                            ) : (
                              <span className="text-xs text-red-500">No contact selected</span>
                            )}


                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                {isMessagesLoading ? (
                  <div className="p-4 text-center text-gray-500">Loading messages...</div>
                ) : (
                  <ScrollArea className="flex-1 overflow-y-auto max-h-[calc(100vh-450px)] px-4">
                    <div className="space-y-4">
          

                      {Object.entries(groupedMessages).map(([dateKey, messages]) => {
                        const date = parseISO(messages[0].createdAt)

                        let label = format(date, "dd/MM/yyyy")
                        if (isToday(date)) label = "Today"
                        else if (isYesterday(date)) label = "Yesterday"

                        return (
                          <div key={dateKey}>
                            <div className="text-center my-4">
                              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{label}</span>
                            </div>

                            {messagesListed.map((message) => (
                              <div key={message.id} className={`flex ${message.senderType ? "justify-end" : "justify-start"}`}>
                                <div className="flex items-start gap-2 max-w-[70%] group">
                                  {isSelectingMessages && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className={`mt-2 p-1 h-6 w-6 ${selectedMessages.has(message.id) ? "bg-green-100 text-green-600" : ""
                                        }`}
                                      onClick={() => handleSelectMessage(message.id)}
                                    >
                                      <Check className="h-3 w-3" />
                                    </Button>
                                  )}

                                  <div
                                    className={`p-3 m-2 rounded-lg cursor-pointer relative ${selectedMessages.has(message.id) ? "ring-2 ring-green-500" : ""
                                      } ${message.senderType ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"}`}
                                    onClick={() => isSelectingMessages && handleSelectMessage(message.id)}
                                  >
                                    <p className="text-sm">{message.message}</p>
                                    <p className={`text-xs mt-1 ${message.senderType ? "text-blue-100" : "text-gray-500"}`}>
                                      {/* {message.createdAt} */}
                                      {format(parseISO(message.createdAt), "hh:mm a")}
                                    </p>

                                    {!isSelectingMessages && (
                                   

                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <div className="absolute -top-2 -right-2 z-10">
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                              <MoreHorizontal className="h-3 w-3" />
                                            </Button>
                                          </div>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="z-50">
                                          <DropdownMenuItem
                                            onClick={() => handleDeleteMessage(message.id)}
                                            className="text-red-600 focus:text-red-600"
                                          >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete Message
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>

                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )
                      })}

                    </div>
                  </ScrollArea>
                )}

                
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {/* Delete Conversation Confirmation */}
  <AlertDialog open={!!conversationToDelete} onOpenChange={() => setConversationToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Contact</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this contact and all associated conversations? This action cannot be
              undone and all messages with this contact will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteConversation} className="bg-red-600 hover:bg-red-700">
              Delete Contact
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

       {/* Delete Message Confirmation */}
      <AlertDialog open={!!messageToDelete} onOpenChange={() => setMessageToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Message</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this message? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteMessage} className="bg-red-600 hover:bg-red-700">
              Delete Message
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
