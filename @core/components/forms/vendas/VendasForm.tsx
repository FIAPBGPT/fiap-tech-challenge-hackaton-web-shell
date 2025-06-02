'use client';
import { useEffect, useState } from 'react';
import { adicionarVenda, atualizarVenda, registrarVendaEstoque, consultarSaldoEstoque } from '@/@core/services/firebase/firebaseService';
import { useAuthStore } from '@/@core/store/authStore';
import FazendaSelect from '../fazendas/FazendaSelect';
import ProdutoSelect from '../produtos/ProdutoSelect';

interface VendaFormProps {
  onSuccess: () => void;
  editarVenda?: {
    id: string;
    produto: string;
    quantidade: number;
    data: string | Date;
    fazenda: string;
    valor: string;
  };
  onCancelEdit?: () => void;
}

export default function VendaForm({ onSuccess, editarVenda, onCancelEdit }: VendaFormProps) {
  const user = useAuthStore((s) => s.user);

  const [form, setForm] = useState({
    produto: '',
    quantidade: '',
    valor: '',
    data: '',
    fazenda: '',
  });

  const [saldoEstoque, setSaldoEstoque] = useState<number | null>(null);

  useEffect(() => {
    if (editarVenda) {
      let dataFormatada = '';
      if (editarVenda.data && typeof editarVenda.data === 'object' && 'seconds' in editarVenda.data) {
        // @ts-ignore
        dataFormatada = new Date(editarVenda.data.seconds * 1000).toISOString().split('T')[0];
      } else if (typeof editarVenda.data === 'string' || editarVenda.data instanceof Date) {
        dataFormatada = new Date(editarVenda.data).toISOString().split('T')[0];
      }

      setForm({
        produto: editarVenda.produto,
        quantidade: String(editarVenda.quantidade),
        valor: String(editarVenda.valor),
        data: dataFormatada,
        fazenda: editarVenda.fazenda,
      });
    } else {
      setForm({
        produto: '',
        quantidade: '',
        valor: '',
        data: '',
        fazenda: '',
      });
    }
  }, [editarVenda]);

  // Atualiza saldo do estoque ao selecionar produto
  useEffect(() => {
    async function fetchSaldo() {
      if (form.produto) {
        const saldo = await consultarSaldoEstoque(form.produto, null); // null caso não use safra
        setSaldoEstoque(saldo);
      } else {
        setSaldoEstoque(null);
      }
    }

    fetchSaldo();
  }, [form.produto]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!user) return alert('Usuário não autenticado');

    if (!form.data || isNaN(new Date(form.data).getTime())) {
      alert('Data inválida');
      return;
    }

    const quantidadeVendida = Number(form.quantidade);
    const saldoAtual = await consultarSaldoEstoque(form.produto, null);

    if (quantidadeVendida > saldoAtual) {
      return alert(`Quantidade indisponível em estoque. Saldo atual: ${saldoAtual}`);
    }

    const dataBr = new Date(`${form.data}T00:00:00-03:00`);
    const novaVenda = {
      produto: form.produto,
      quantidade: quantidadeVendida,
      valor: Number(form.valor),
      uid: user.uid,
      data: dataBr,
      fazenda: form.fazenda,
    };

    try {
      if (editarVenda) {
        await atualizarVenda(editarVenda.id, novaVenda);
        // Atualização de estoque em edição não implementada
      } else {
        const docRef = await adicionarVenda(novaVenda);
        await registrarVendaEstoque({
          id: docRef.id,
          itens: [
            {
              produtoId: form.produto,
              quantidade: quantidadeVendida,
              // safraId: null // Se necessário, adicionar
            },
          ],
        });
      }

      setForm({ produto: '', quantidade: '', valor: '', data: '', fazenda: '' });
      onSuccess();
    } catch (error) {
      console.error('Erro ao salvar venda:', error);
      alert('Erro ao salvar venda');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <ProdutoSelect value={form.produto} onChange={handleChange} name="produto" required />
      {saldoEstoque !== null && (
        <p style={{ fontSize: '0.9rem', color: saldoEstoque <= 0 ? 'red' : 'green' }}>
          Saldo em estoque: {saldoEstoque}
        </p>
      )}

      <input
        type="number"
        name="quantidade"
        value={form.quantidade}
        onChange={handleChange}
        placeholder="Quantidade"
        required
      />
      <input
        type="number"
        name="valor"
        value={form.valor}
        onChange={handleChange}
        placeholder="Valor"
        required
      />
      <input
        type="date"
        name="data"
        value={form.data}
        onChange={handleChange}
        required
      />
      <FazendaSelect value={form.fazenda} onChange={handleChange} name="fazenda" />

      <button type="submit">{editarVenda ? 'Salvar' : 'Cadastrar'}</button>
      {editarVenda && (
        <button type="button" onClick={onCancelEdit}>
          Cancelar
        </button>
      )}
    </form>
  );
}
