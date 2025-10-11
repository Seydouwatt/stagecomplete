import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

interface MessageInputProps {
  onSend: (content: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  isLoading = false,
  placeholder = 'Écrire un message...',
  disabled = false,
}) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && !isLoading && !disabled) {
      onSend(content.trim());
      setContent('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Envoyer avec Ctrl+Enter ou Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-base-300 p-4">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            className={clsx(
              'textarea textarea-bordered w-full resize-none',
              'focus:outline-none focus:border-primary',
              'min-h-[60px] max-h-[120px]'
            )}
            rows={2}
          />
          <p className="text-xs text-base-content/50 mt-1">
            Ctrl + Entrée pour envoyer
          </p>
        </div>

        <button
          type="submit"
          disabled={!content.trim() || isLoading || disabled}
          className={clsx(
            'btn btn-primary btn-circle btn-lg',
            isLoading && 'loading'
          )}
          aria-label="Envoyer le message"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
    </form>
  );
};
