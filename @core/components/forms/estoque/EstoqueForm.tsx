'use client'

import { useEffect, useState } from 'react'
import {
  adicionarEstoque,
  atualizarEstoque,
} from '@/@core/services/firebase/pages/estoqueService'
import ProdutoSelect from '../produtos/ProdutoSelect'
import SafraSelect from '../safras/SafraSelect'
import InputComponent from '../../ui/input/Input.component'
import SelectComponent from '../../ui/select/Select.component'
import { Container } from '@/@theme/custom/Forms.styles'
import ButtonComponent from '../../ui/Button'

interface EstoqueFormProps {
  onSuccess: () => void
  editarEstoque?: {
    id: string
    produtoId: string
    safraId?: string | null
    quantidade: number
    tipo: 'Entrada' | 'Saída'
    observacao?: string
  }
  onCancelEdit?: () => void
}

export default function EstoqueForm({
  onSuccess,
  editarEstoque,
  onCancelEdit,
}: EstoqueFormProps) {
  const [form, setForm] = useState({
    produto: '',
    safra: '',
    quantidade: '',
    tipo: 'Entrada',
    observacao: '',
  })

  // Preenche formulário ao editar
  useEffect(() => {
    if (editarEstoque) {
      setForm({
        produto: editarEstoque.produtoId,
        safra: editarEstoque.safraId || '',
        quantidade: editarEstoque.quantidade.toString(),
        tipo: editarEstoque.tipo,
        observacao: editarEstoque.observacao || '',
      })
    } else {
      setForm({
        produto: '',
        safra: '',
        quantidade: '',
        tipo: 'Entrada',
        observacao: '',
      })
    }
  }, [editarEstoque])

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.produto || !form.quantidade || Number(form.quantidade) <= 0) {
      alert('Preencha os campos obrigatórios corretamente.')
      return
    }

    const estoqueData = {
      produtoId: form.produto,
      safraId: form.safra || null,
      quantidade: Number(form.quantidade),
      tipo: form.tipo as 'Entrada' | 'Saída',
      observacao: form.observacao.trim() || undefined,
      data: new Date(),
    }

    try {
      // Não validar saldo aqui pois é movimentação manual (Entrada ou saída arbitrária)
      if (editarEstoque) {
        await atualizarEstoque(editarEstoque.id, estoqueData)
      } else {
        await adicionarEstoque(estoqueData)
      }

      setForm({
        produto: '',
        safra: '',
        quantidade: '',
        tipo: 'Entrada',
        observacao: '',
      })

      onSuccess()
    } catch (error) {
      alert('Erro ao salvar movimentação de estoque.')
      console.error(error)
    }
  }

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <h2 className="title-form">
          {editarEstoque ? 'Editar Movimentação' : 'Nova Movimentação'}
        </h2>

        <ProdutoSelect
          value={form.produto}
          onChange={(value) => handleChange('produto', value)}
          name="produto"
          required
        />

        <SafraSelect
          value={form.safra}
          onChange={(value) => handleChange('safra', value)}
          name="safra"
          required
        />

        <InputComponent
          id="quantidade"
          name="quantidade"
          type="number"
          value={form.quantidade}
          onChange={(value) => handleChange('quantidade', value)}
          placeholder="Digite a quantidade"
          required={true}
          min={1}
        />
        <SelectComponent
          id="tipo"
          value={form.tipo}
          options={['Entrada', 'Saída']}
          onChange={(value) => handleChange('tipo', value)}
          placeholder="Selecione um tipo"
          required={true}
          ariaLabel="Selecionar tipo"
          valueKey="id"
          labelKey="nome"
          name="tipo"
        />

        <InputComponent
          id="observacao"
          name="observacao"
          type="text"
          value={form.observacao}
          onChange={(value) => handleChange('observacao', value)}
          placeholder="Observação (opcional)"
          required={false}
        />

        <div>
          <ButtonComponent
            type="submit"
            label={editarEstoque ? 'Salvar' : 'Cadastrar'}
            onClick={function (): void {}}
            variant="secondary"
          />

          {editarEstoque && onCancelEdit && (
            <ButtonComponent
              type="button"
              label="Cancelar"
              onClick={onCancelEdit}
              variant="buttonGrey"
            />
          )}
        </div>
      </form>
    </Container>
  )
}
