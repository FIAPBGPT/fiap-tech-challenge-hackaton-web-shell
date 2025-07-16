'use client';
import { useNotifications } from '@/@core/hooks/useNotifications';
import { BellButton, EmptyState, NotificationBadge, NotificationContainer, NotificationContent, NotificationItem, NotificationPanel, NotificationTime, PanelHeader, TypeBadge } from '@/@theme/custom/NotificationBellStyle';
import { useCallback, useEffect, useRef, useState } from 'react';
import { 
  FiShoppingBag, 
  FiAward, 
  FiLayers, 
  FiInfo,
  FiBell,
  FiAlertCircle
} from 'react-icons/fi';

type Product = { id: string; nome: string };
type Farm = { id: string; nome: string };

type NotificationBellProps = {
  products: Product[];
  fazendas: Farm[];
};

const NotificationIcons = {
  venda: <FiShoppingBag size={20} color="#10B981" />,
  meta: <FiAward size={20} color="#F59E0B" />,
  producao: <FiLayers size={20} color="#3B82F6" />,
  default: <FiInfo size={20} color="#6B7280" />
};

const BellIcon = () => <FiBell size={24} />;

const EmptyNotificationIcon = () => <FiAlertCircle size={48} color="#9CA3AF" />;

export function NotificationBell({ products, fazendas }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markAsRead } = useNotifications(products, fazendas);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, handleClickOutside]);

  const handleNotificationClick = useCallback((id: string) => {
    markAsRead(id);
    setIsOpen(false);
  }, [markAsRead]);

  const formatDate = useCallback((date: Date) => (
    date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: 'short'
    })
  ), []);

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
        <NotificationPanel ref={panelRef} style={{ position: 'fixed', right: '1rem', top: '4rem' }}>
          <PanelHeader>
            <span>Notificações</span>
            <span style={{ fontSize: '0.75rem', color: '#2563EB' }}>
              {unreadCount > 0 ? `${unreadCount} não lidas` : 'Todas lidas'}
            </span>
          </PanelHeader>
          
          {notifications.length === 0 ? (
            <EmptyState>
              <EmptyNotificationIcon />
              <p style={{ marginTop: '0.5rem' }}>Nenhuma notificação no momento</p>
            </EmptyState>
          ) : (
            <div style={{ maxHeight: '24rem', overflowY: 'auto' }}>
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  unread={!notification.read}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {NotificationIcons[notification.type as keyof typeof NotificationIcons] || NotificationIcons.default}
                  </div>
                  <NotificationContent>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <p style={{ fontWeight: 500, color: '#111827' }}>{notification.message}</p>
                      {!notification.read && (
                        <span style={{
                          display: 'inline-block',
                          height: '0.5rem',
                          width: '0.5rem',
                          borderRadius: '9999px',
                          backgroundColor: '#3B82F6',
                          marginLeft: '0.5rem'
                        }} />
                      )}
                    </div>
                    <NotificationTime>
                      <span>{formatDate(notification.createdAt)}</span>
                      <TypeBadge>{notification.type}</TypeBadge>
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