import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { firestore } from '../services/firebase/firebase';
import { useAuthStore } from '../store/authStore';

// Tipos melhorados
type NotificationType = 'venda' | 'meta' | 'producao';

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
}

export function useNotifications(products: Product[], fazendas: Farm[]): NotificationHook {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Memoized helper functions
  const getProductName = useCallback((productId: string): string => {
    return products.find(p => p.id === productId)?.nome || productId;
  }, [products]);

  const getFarmName = useCallback((farmId: string): string => {
    return fazendas.find(f => f.id === farmId)?.nome || farmId;
  }, [fazendas]);

  // Generic notification creator
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

  // Handle new notifications
  const addNotification = useCallback((notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
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
            
            addNotification(
              createNotification(
                'venda',
                `Nova venda: ${totalQuantity} unidades de ${productName}`,
                change.doc.id
              )
            );
            checkGoals(newSale);
          }
        }
      });
    });

    return unsubscribe;
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
              meta.safra === item.safraId && 
              item.valor >= meta.valor) {
            
            addNotification(
              createNotification(
                'meta',
                `Meta atingida! ${getProductName(item.produtoId)} na ${getFarmName(item.fazendaId)}`,
                `${doc.id}_${venda.id}`
              )
            );
          }
        });
      }
    });
  }, [user?.uid, getProductName, getFarmName, addNotification, createNotification]);

  // Production listener
  useEffect(() => {
    if (!user?.uid) return;

    const q = query(collection(firestore, 'producoes'), where('uid', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const producao = change.doc.data();
          
          addNotification(
            createNotification(
              'producao',
              `Nova produção: ${producao.quantidade} unidades de ${getProductName(producao.produto)}`,
              change.doc.id,
              producao.produto
            )
          );
        }
      });
    });

    return unsubscribe;
  }, [user?.uid, getProductName, addNotification, createNotification]);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => prev - 1);
  }, []);

  return { notifications, unreadCount, markAsRead };
}