// hooks/useNotifications.ts
import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { firestore } from '../services/firebase/firebase';
import { useAuthStore } from '../store/authStore';

type Notification = {
  id: string;
  message: string;
  type: 'sale' | 'goal' | 'production';
  read: boolean;
  createdAt: Date;
  productId?: string;
};

type Product = {
  id: string;
  nome: string;
};

export function useNotifications(products: Product[]) {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Função para obter o nome do produto
  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? product.nome : productId;
  };

  // Monitorar vendas em tempo real
  useEffect(() => {
    if (!user?.uid) return;

    const q = query(collection(firestore, 'vendas'), where('itens.uid', 'array-contains', user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const newSale = change.doc.data();
          const totalItems = newSale.itens.reduce((acc: number, item: any) => acc + item.quantidade, 0);
          
          const newNotification: Notification = {
            id: `sale_${change.doc.id}`,
            message: `Nova venda: ${totalItems} unidades`,
            type: 'sale',
            read: false,
            createdAt: new Date(newSale.data.seconds * 1000),
            productId: newSale.itens[0]?.produtoId
          };
          
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
          checkGoals(newSale);
        }
      });
    });

    return () => unsubscribe();
  }, [user?.uid, products]);

  // Verificar metas atingidas
  const checkGoals = async (sale: any) => {
    const metasSnapshot = await getDocs(collection(firestore, 'metas'));
    
    sale.itens.forEach((item: any) => {
      metasSnapshot.forEach((doc) => {
        const meta = doc.data();
        if (meta.produto === item.produtoId && 
            meta.fazenda === item.fazendaId && 
            meta.safra === item.safraId && 
            item.valor >= meta.valor) {
              
          const productName = getProductName(item.produtoId);
          const goalNotification: Notification = {
            id: `goal_${doc.id}_${sale.id}`,
            message: `Meta atingida! ${productName} na fazenda ${meta.fazenda}`,
            type: 'goal',
            read: false,
            createdAt: new Date(),
            productId: item.produtoId
          };
          
          setNotifications(prev => [goalNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
        }
      });
    });
  };

  // Monitorar produção
  useEffect(() => {
    if (!user?.uid) return;

    const q = query(collection(firestore, 'producoes'), where('uid', '==', user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const production = change.doc.data();
          const productName = getProductName(production.produto);
          
          const newNotification: Notification = {
            id: `prod_${change.doc.id}`,
            message: `Nova produção: ${production.quantidade} unidades de ${productName}`,
            type: 'production',
            read: false,
            createdAt: new Date(),
            productId: production.produto
          };
          
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
        }
      });
    });

    return () => unsubscribe();
  }, [user?.uid, products]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => prev - 1);
  };

  return { notifications, unreadCount, markAsRead };
}