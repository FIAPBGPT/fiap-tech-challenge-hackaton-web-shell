'use client';
import { useEffect, useState } from 'react';
import { listarSafras, excluirSafra } from '@/@core/services/firebase/firebaseService';
import SafraForm from './SafraForm';

export default function SafraList() {
  const [safras, setSafras] = useState<any[]>([]);
  const [safraEditando, setSafraEditando] = useState<any | null>(null);

  const carregar = async () => {
    const lista = await listarSafras();
    setSafras(lista);
  };

  useEffect(() => {
    carregar();
  }, []);

  const handleEditar = (safra: any) => {
    setSafraEditando(safra);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Deseja excluir esta safra?')) {
      await excluirSafra(id);
      carregar();
    }
  };

  const handleCancelEdit = () => {
    setSafraEditando(null);
  };

  const handleSucesso = () => {
    setSafraEditando(null);
    carregar();
  };

  return (
    <div>
      <h3>Safras</h3>

      {safraEditando ? (
        <SafraForm
          editarSafra={safraEditando}
          onSuccess={handleSucesso}
          onCancelEdit={handleCancelEdit}
        />
      ) : (
        <SafraForm onSuccess={handleSucesso} />
      )}

      <ul>
        {safras.map((s) => (
          <li key={s.id}>
            {s.nome} ({s.valor}){' '}
            <button onClick={() => handleEditar(s)}>Editar</button>
            <button onClick={() => handleDelete(s.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
