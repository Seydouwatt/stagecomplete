import React, { useEffect, useRef } from 'react';
import { clsx } from 'clsx';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Check, CheckCheck } from 'lucide-react';
import type { Message } from '../../types/message';
import { useAuthStore } from '../../stores/authStore';

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
  onMessageClick?: (message: Message) => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isLoading = false,
  onMessageClick,
}) => {
  const { user } = useAuthStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll vers le bas quand nouveaux messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-base-content/60">
        <p className="text-lg font-medium">Aucun message</p>
        <p className="text-sm">Soyez le premier à envoyer un message</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4 p-4 overflow-y-auto max-h-[500px]">
      {messages.map((message) => {
        const isMine = message.senderId === user?.id;
        const senderName = message.sender?.profile?.name || 'Utilisateur';

        return (
          <div
            key={message.id}
            className={clsx(
              'flex flex-col',
              isMine ? 'items-end' : 'items-start'
            )}
            onClick={() => onMessageClick?.(message)}
          >
            {/* Nom de l'expéditeur (sauf si c'est moi) */}
            {!isMine && (
              <span className="text-xs text-base-content/60 mb-1 px-2">
                {senderName}
              </span>
            )}

            {/* Bulle de message */}
            <div
              className={clsx(
                'px-4 py-2 rounded-2xl max-w-[70%] break-words',
                isMine
                  ? 'bg-primary text-primary-content rounded-br-sm'
                  : 'bg-base-200 text-base-content rounded-bl-sm'
              )}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>

            {/* Métadonnées (heure + statut de lecture) */}
            <div className="flex items-center gap-1 mt-1 px-2">
              <span className="text-xs text-base-content/50">
                {format(new Date(message.createdAt), 'HH:mm', { locale: fr })}
              </span>
              {isMine && (
                <span className="text-xs text-base-content/50">
                  {message.isRead ? (
                    <CheckCheck className="w-3 h-3 text-success" />
                  ) : (
                    <Check className="w-3 h-3" />
                  )}
                </span>
              )}
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};
