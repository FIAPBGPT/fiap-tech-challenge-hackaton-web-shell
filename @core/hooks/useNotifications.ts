import { useState, useEffect, useCallback, useRef } from 'react';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { firestore } from '../services/firebase/firebase';
import { useAuthStore } from '../store/authStore';

type NotificationType = 'venda' | 'meta';

interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: Date;
  productId?: string;
}

interface Product {
  id: string;
  nome: string;
}

interface Farm {
  id: string;
  nome: string;
}

interface NotificationHook {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

export function useNotifications(products: Product[], fazendas: Farm[]): NotificationHook {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const processedIds = useRef<Set<string>>(new Set());

  // Helper functions
  const getProductName = useCallback((productId: string): string => {
    return products.find(p => p.id === productId)?.nome || productId;
  }, [products]);

  const getFarmName = useCallback((farmId: string): string => {
    return fazendas.find(f => f.id === farmId)?.nome || farmId;
  }, [fazendas]);

  const createNotification = useCallback(
    (type: NotificationType, message: string, id: string, productId?: string): Notification => ({
      id: `${type}_${id}`,
      message,
      type,
      read: false,
      createdAt: new Date(),
      ...(productId && { productId })
    }),
    []
  );

  const addNotification = useCallback((notification: Notification) => {
    // Verifica se a notificação já foi processada
    if (!processedIds.current.has(notification.id)) {
      processedIds.current.add(notification.id);
      setNotifications(prev => {
        // Verifica se já existe uma notificação com o mesmo ID
        const exists = prev.some(n => n.id === notification.id);
        return exists ? prev : [notification, ...prev];
      });
      setUnreadCount(prev => prev + 1);
    }
  }, []);

  // Sales listener
  useEffect(() => {
    if (!user?.uid) return;

    const q = query(collection(firestore, 'vendas'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const newSale = change.doc.data();
          const userItems = newSale.itens.filter((item: any) => item.uid === user.uid);

          if (userItems.length > 0) {
            const totalQuantity = userItems.reduce((acc: number, item: any) => acc + item.quantidade, 0);
            const productName = getProductName(userItems[0].produtoId);

            const notificationId = `venda_${change.doc.id}`;
            if (!processedIds.current.has(notificationId)) {
              addNotification(
                createNotification(
                  'venda',
                  `Nova venda: ${totalQuantity} unidades de ${productName}`,
                  change.doc.id,
                  userItems[0].produtoId
                )
              );
              checkGoals(newSale);
            }
          }
        }
      });
    });

    return () => {
      unsubscribe();
      processedIds.current.clear(); // Limpa o cache ao desmontar
    };
  }, [user?.uid, getProductName, addNotification, createNotification]);

  // Check goals helper
  const checkGoals = useCallback(async (venda: any) => {
    if (!user?.uid) return;

    const metasSnapshot = await getDocs(collection(firestore, 'metas'));

    venda.itens.forEach((item: any) => {
      if (item.uid === user.uid) {
        metasSnapshot.forEach((doc) => {
          const meta = doc.data();
          if (meta.produto === item.produtoId && 
              meta.fazenda === item.fazendaId && 
              item.valor >= meta.valor) {

            const notificationId = `meta_${doc.id}_${venda.id}`;
            if (!processedIds.current.has(notificationId)) {
              addNotification(
                createNotification(
                  'meta',
                  `Meta atingida! ${getProductName(item.produtoId)} na ${getFarmName(item.fazendaId)}`,
                  `${doc.id}_${venda.id}`,
                  item.produtoId
                )
              );
            }
          }
        });
      }
    });
  }, [user?.uid, getProductName, getFarmName, addNotification, createNotification]);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
    setUnreadCount(0);
  }, []);

  return { notifications, unreadCount, markAsRead, markAllAsRead };
}