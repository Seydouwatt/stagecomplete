import React from 'react';
import { Bell } from 'lucide-react';
import { useUnreadNotificationsCount } from '../../hooks/useNotifications';

interface NotificationBadgeProps {
  onClick?: () => void;
  className?: string;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  onClick,
  className = '',
}) => {
  const { count } = useUnreadNotificationsCount();

  return (
    <button
      onClick={onClick}
      className={`btn btn-ghost btn-circle indicator ${className}`}
      aria-label={`Notifications${count > 0 ? ` (${count} non lues)` : ''}`}
    >
      <Bell className="w-5 h-5" />
      {count > 0 && (
        <span className="indicator-item badge badge-primary badge-sm">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
};
