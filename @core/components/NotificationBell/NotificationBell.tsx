// components/NotificationBell.tsx
'use client';

import { useNotifications } from '@/@core/hooks/useNotifications';
import { BellButton, EmptyState, NotificationBadge, NotificationContainer, NotificationContent, NotificationItem, NotificationPanel, NotificationTime, PanelHeader, TypeBadge } from '@/@theme/custom/NotificationBellStyle';
import { useEffect, useRef, useState } from 'react';


type NotificationBellProps = {
  products: Array<{
    id: string;
    nome: string;
  }>;
    fazendas: Array<{ // NOVA PROP
    id: string;
    nome: string;
  }>;
};

export function NotificationBell({ products, fazendas }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
   const panelRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markAsRead } = useNotifications(products, fazendas);


   useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Ícone SVG colorido
   const BellIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"

    >
      <path
        d="M18 8C18 4.68629 15.3137 2 12 2C8.68629 2 6 4.68629 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  // Ícones coloridos para cada tipo
  const NotificationIcon = ({ type }: { type: string }) => {
    const iconColor = {
      venda: '#10B981', // verde-500
      meta: '#F59E0B', // amarelo-500
      producao: '#3B82F6' // azul-500
    }[type] || '#6B7280'; // cinza-500

    switch(type) {
      case 'venda':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={iconColor}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        );
      case 'meta':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={iconColor}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        );
      case 'producao':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={iconColor}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={iconColor}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <NotificationContainer>
      <BellButton 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notificações"
        aria-expanded={isOpen}
      >
        <BellIcon />
        {unreadCount > 0 && (
          <NotificationBadge>
            {unreadCount > 9 ? '9+' : unreadCount}
          </NotificationBadge>
        )}
      </BellButton>

      {isOpen && (
        <NotificationPanel style={{
          position: 'fixed',
          right: '1rem',
          top: '4rem'
        }}>
          <PanelHeader>
            <span>Notificações</span>
            <span style={{ fontSize: '0.75rem', color: '#2563EB' }}>
              {unreadCount > 0 ? `${unreadCount} não lidas` : 'Todas lidas'}
            </span>
          </PanelHeader>
          
          {notifications.length === 0 ? (
            <EmptyState>
              <svg 
                width="48" 
                height="48" 
                viewBox="0 0 24 24" 
                stroke="#9CA3AF"
                fill="none"
                style={{ margin: '0 auto' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <p style={{ marginTop: '0.5rem' }}>Nenhuma notificação no momento</p>
            </EmptyState>
          ) : (
            <div style={{ maxHeight: '24rem', overflowY: 'auto' }}>
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  unread={!notification.read}
                  onClick={() => {
                    markAsRead(notification.id);
                    setIsOpen(false);
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <NotificationIcon type={notification.type} />
                  </div>
                  <NotificationContent>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <p style={{ fontWeight: 500, color: '#111827' }}>
                        {notification.message}
                      </p>
                      {!notification.read && (
                        <span style={{
                          display: 'inline-block',
                          height: '0.5rem',
                          width: '0.5rem',
                          borderRadius: '9999px',
                          backgroundColor: '#3B82F6',
                          marginLeft: '0.5rem'
                        }}></span>
                      )}
                    </div>
                    <NotificationTime>
                      <span>
                        {notification.createdAt.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          day: '2-digit',
                          month: 'short'
                        })}
                      </span>
                      <TypeBadge>
                        {notification.type}
                      </TypeBadge>
                    </NotificationTime>
                  </NotificationContent>
                </NotificationItem>
              ))}
            </div>
          )}
        </NotificationPanel>
      )}
    </NotificationContainer>
  );
}