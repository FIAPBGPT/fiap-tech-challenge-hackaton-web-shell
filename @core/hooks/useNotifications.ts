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

export function useNotifications(products: Array<{id: string, nome: string}>, fazendas: Array<{id: string, nome: string}>) {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Função para obter nome do produto
  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? product.nome : productId;
  };

    // Função para obter nome da fazenda - NOVO
  const getFarmName = (farmId: string) => {
    const fazenda = fazendas.find(f => f.id === farmId);
    return fazenda ? fazenda.nome : farmId;
  };

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
            
            const newNotification: Notification = {
              id: `sale_${change.doc.id}`,
              message: `Nova venda: ${totalQuantity} unidades de ${productName}`,
              type: 'sale',
              read: false,
              createdAt: new Date(newSale.data.seconds * 1000)
            };
            
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
            checkGoals(newSale);
          }
        }
      });
    });

    return () => unsubscribe();
  }, [user?.uid, products, fazendas]);

  // Verificar metas - ATUALIZADO com nome da fazenda
  const checkGoals = async (sale: any) => {
    if (!user?.uid) return;

    const metasSnapshot = await getDocs(collection(firestore, 'metas'));
    
    sale.itens.forEach((item: any) => {
      if (item.uid === user.uid) {
        metasSnapshot.forEach((doc) => {
          const meta = doc.data();
          if (meta.produto === item.produtoId && 
              meta.fazenda === item.fazendaId && 
              meta.safra === item.safraId && 
              item.valor >= meta.valor) {
            
            const productName = getProductName(item.produtoId);
            const farmName = getFarmName(item.fazendaId); // NOVO
            
            const goalNotification: Notification = {
              id: `goal_${doc.id}_${sale.id}`,
              message: `Meta atingida! ${productName} na ${farmName}`, // ATUALIZADO
              type: 'goal',
              read: false,
              createdAt: new Date()
            };
            
            setNotifications(prev => [goalNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
          }
        });
      }
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