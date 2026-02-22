import React, { useEffect, useRef } from 'react';
import { MessageSquare } from 'lucide-react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { useMessages, useSendMessage, useMarkAllAsRead } from '../../hooks/useMessages';

interface MessageThreadProps {
  eventId: string;
  eventTitle?: string;
}

export const MessageThread: React.FC<MessageThreadProps> = ({
  eventId,
  eventTitle,
}) => {
  const { messages, isLoading } = useMessages(eventId);
  const sendMessage = useSendMessage();
  const markAllAsRead = useMarkAllAsRead();
  const prevMessageCount = useRef(0);

  // Marquer les messages comme lus a l'ouverture et quand de nouveaux arrivent
  useEffect(() => {
    if (eventId && messages.length > 0 && messages.length !== prevMessageCount.current) {
      markAllAsRead.mutate(eventId);
      prevMessageCount.current = messages.length;
    }
  }, [eventId, messages.length]);

  const handleSendMessage = (content: string) => {
    sendMessage.mutate({
      eventId,
      content,
    });
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      {/* En-tête */}
      <div className="card-body p-4 border-b border-base-300">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h3 className="card-title text-lg">
            {eventTitle ? `Messages - ${eventTitle}` : 'Messages'}
          </h3>
        </div>
      </div>

      {/* Liste des messages */}
      <MessageList
        messages={messages}
        isLoading={isLoading}
      />

      {/* Input pour nouveau message */}
      <MessageInput
        onSend={handleSendMessage}
        isLoading={sendMessage.isPending}
      />
    </div>
  );
};
