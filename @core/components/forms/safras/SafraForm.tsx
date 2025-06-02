'use client';
import { useEffect, useState } from 'react';
import { adicionarSafra, atualizarSafra } from '@/@core/services/firebase/firebaseService';

interface SafraFormProps {
  onSuccess: () => void;
  editarSafra?: { id: string; nome: string; valor: string };
  onCancelEdit?: () => void;
}

export default function SafraForm({ onSuccess, editarSafra, onCancelEdit }: SafraFormProps) {
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');

  useEffect(() => {
    if (editarSafra) {
      setNome(editarSafra.nome);
      setValor(editarSafra.valor);
    } else {
      setNome('');
      setValor('');
    }
  }, [editarSafra]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !valor.trim()) return alert('Preencha todos os campos');

    const dados = { nome, valor };

    if (editarSafra) {
      await atualizarSafra(editarSafra.id, dados);
    } else {
      await adicionarSafra(dados);
    }

    setNome('');
    setValor('');
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder='Ex: SAF23/24'
        required
      />
      <input
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        placeholder='Ex: SAF2324'
        required
      />
      <button type='submit'>{editarSafra ? 'Salvar' : 'Cadastrar'}</button>
      {editarSafra && (
        <button type='button' onClick={onCancelEdit}>
          Cancelar
        </button>
      )}
    </form>
  );
}
