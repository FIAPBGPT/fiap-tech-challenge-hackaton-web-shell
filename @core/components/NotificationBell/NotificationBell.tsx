// components/NotificationBell.tsx
'use client';

import { useNotifications } from '@/@core/hooks/useNotifications';
import { useState } from 'react';

type NotificationBellProps = {
  products: Array<{
    id: string;
    nome: string;
  }>;
};

export function NotificationBell({ products }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead } = useNotifications(products);

  return (
    <div className="relative inline-flex items-center">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-100 relative"
        aria-label="Notificações"
        aria-expanded={isOpen}
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-72 bg-white rounded-md shadow-lg z-50 border border-gray-200">
          <div className="py-2">
            <div className="px-4 py-2 font-semibold border-b bg-gray-50">Notificações</div>
            
            {notifications.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500">Nenhuma notificação</div>
            ) : (
              <div className="max-h-60 overflow-y-auto divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => {
                      markAsRead(notification.id);
                      setIsOpen(false);
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-medium text-sm block">
                        {notification.message}
                      </span>
                      {!notification.read && (
                        <span className="inline-block h-2 w-2 rounded-full bg-blue-500 ml-2 mt-1"></span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {notification.createdAt.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}