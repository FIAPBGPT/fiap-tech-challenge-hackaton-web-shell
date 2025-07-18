
import { 
  BellButton, 
  EmptyState, 
  NotificationBadge, 
  NotificationContainer, 
  NotificationContent, 
  NotificationItem, 
  NotificationPanel, 
  NotificationTime, 
  PanelHeader, 
  TypeBadge 
} from '@/@theme/custom/NotificationBellStyle';
import { 
  FiShoppingBag, 
  FiAward,  
  FiInfo,
  FiBell,
  FiAlertCircle,
  FiCheckCircle
} from 'react-icons/fi';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNotifications } from '@/@core/hooks/useNotifications';

// 1. Single Responsibility: Separamos as interfaces
interface Product {
  id: string;
  nome: string;
}

interface Farm {
  id: string;
  nome: string;
}

interface NotificationBellProps {
  products: Product[];
  fazendas: Farm[];
}

// 2. Open/Closed Principle: Criamos um componente base que pode ser estendido
interface NotificationIconProps {
  type: string;
  size?: number;
}

const NotificationIcon = ({ type, size = 20 }: NotificationIconProps) => {
  const iconMap = {
    venda: <FiShoppingBag size={size} color="#10B981" />,
    meta: <FiAward size={size} color="#F59E0B" />,
    default: <FiInfo size={size} color="#6B7280" />
  };

  return iconMap[type as keyof typeof iconMap] || iconMap.default;
};

// 3. Liskov Substitution: Criamos componentes intercambiáveis
const BaseNotificationBadge = ({ count }: { count: number }) => (
  <NotificationBadge>
    {count > 9 ? '9+' : count}
  </NotificationBadge>
);

// 4. Interface Segregation: Dividimos em componentes menores
const NotificationHeader = ({ 
  unreadCount, 
  onMarkAllAsRead 
}: { 
  unreadCount: number;
  onMarkAllAsRead: () => void;
}) => (
  <PanelHeader>
    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
      <span>Notificações</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.75rem', color: '#2563EB' }}>
          {unreadCount > 0 ? `${unreadCount} não lidas` : 'Todas lidas'}
        </span>
        {unreadCount > 0 && (
          <button 
            onClick={onMarkAllAsRead}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.75rem',
              color: '#2563EB'
            }}
            title="Marcar todas como lidas"
          >
            <FiCheckCircle size={16} />
            <span>Marcar todas</span>
          </button>
        )}
      </div>
    </div>
  </PanelHeader>
);
const EmptyNotifications = () => (
  <EmptyState>
    <FiAlertCircle size={48} color="#9CA3AF" />
    <p style={{ marginTop: '0.5rem' }}>Nenhuma notificação no momento</p>
  </EmptyState>
);

// 5. Dependency Inversion: O componente principal depende de abstrações
export function NotificationBell({ products, fazendas }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markAsRead } = useNotifications(products, fazendas);

  const handleNotificationClick = useCallback((id: string) => {
    markAsRead(id);
    setIsOpen(false);
  }, [markAsRead]);

    const handleMarkAllAsRead = useCallback(() => {
    notifications.forEach(notification => {
      if (!notification.read) {
        markAsRead(notification.id);
      }
    });
  }, [notifications, markAsRead]);

  return (
    <NotificationContainer>
      <BellButton 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notificações"
        aria-expanded={isOpen}
      >
        <FiBell size={24} />
        {unreadCount > 0 && <BaseNotificationBadge count={unreadCount} />}
      </BellButton>

      {isOpen && (
        <NotificationPanel ref={panelRef} style={{ position: 'fixed', left: '1rem', top: '4rem' }}>
             <NotificationHeader 
            unreadCount={unreadCount} 
            onMarkAllAsRead={handleMarkAllAsRead} 
          />

          {notifications.length === 0 ? (
            <EmptyNotifications />
          ) : (
            <div style={{ maxHeight: '24rem', overflowY: 'auto' }}>
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  unread={!notification.read}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <NotificationIcon type={notification.type} />
                  </div>
                  <NotificationContent>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <p style={{ fontWeight: 500, color: '#111827' }}>{notification.message}</p>
                      {!notification.read && (
                        <span style={{
                          display: 'flex',
                          height: '0.5rem',
                          width: '0.5rem',
                          borderRadius: '9999px',
                          backgroundColor: '#3B82F6',
                          marginLeft: '0.5rem'
                        }} />
                      )}
                    </div>
                    <NotificationTime>
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