// ProducoesForm.tsx
'use client'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/@core/store/authStore'
import FazendaSelect from '../fazendas/FazendaSelect'
import ProdutoSelect from '../produtos/ProdutoSelect'
import SafraSelect from '../safras/SafraSelect'
import {
  registrarProducaoEstoque,
  removerProducaoEstoque,
  consultarSaldoEstoque,
} from '@/@core/services/firebase/pages/estoqueService'
import {
  adicionarProducao,
  atualizarProducao,
} from '@/@core/services/firebase/pages/producoesService'
import InputComponent from '../../ui/input/Input.component'
import { Container } from '@/@theme/custom/Forms.styles'
import ButtonComponent from '../../ui/Button'

interface ProducoesFormProps {
  onSuccess: () => void
  editarProducao?: {
    id: string
    produto: string
    quantidade: number
    fazenda: string
    safra: string
    data?: string
  }
  onCancelEdit?: () => void
}

export default function ProducoesForm({
  onSuccess,
  editarProducao,
  onCancelEdit,
}: ProducoesFormProps) {
  const user = useAuthStore((s) => s.user)
  const [form, setForm] = useState({
    produto: '',
    quantidade: '',
    fazenda: '',
    safra: '',
    data: '',
  })

  const [saldoEstoque, setSaldoEstoque] = useState<number | null>(null)
  const [quantidadeAnterior, setQuantidadeAnterior] = useState<number>(0)

  const fetchSaldoEstoque = async (
    produto: string,
    safra: string,
    fazenda: string
  ) => {
    if (produto && safra && fazenda) {
      const saldo = await consultarSaldoEstoque(produto, safra, fazenda);
      setSaldoEstoque(saldo);
    } else {
      setSaldoEstoque(null);
    }
  };

  useEffect(() => {
    if (editarProducao) {
      setForm({
        produto: editarProducao.produto,
        quantidade: String(editarProducao.quantidade),
        fazenda: editarProducao.fazenda,
        safra: editarProducao.safra,
        data: editarProducao.data || '',
      })
      setQuantidadeAnterior(editarProducao.quantidade)
    } else {
      setForm({
        produto: '',
        quantidade: '',
        fazenda: '',
        safra: '',
        data: '',
      })
      setQuantidadeAnterior(0)
    }
  }, [editarProducao])

  useEffect(() => {
    fetchSaldoEstoque(form.produto, form.safra, form.fazenda)
  }, [form.produto, form.safra, form.fazenda])

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return alert('Usuário não autenticado')

    const { produto, safra, fazenda, quantidade } = form
    const quantidadeNum = Number(quantidade)

    if (!produto || !safra || !fazenda || quantidadeNum <= 0) {
      alert('Todos os campos devem ser preenchidos corretamente')
      return
    }

    // Set datetime now in ISO format
    const data = new Date().toISOString()

    const payload = {
      produto,
      safra,
      fazenda,
      quantidade: quantidadeNum,
      uid: user.uid,
      data,
    }

    try {
      if (editarProducao) {
        // Corrige o estoque antigo
        await removerProducaoEstoque({
          id: editarProducao.id,
          itens: [
            {
              produtoId: editarProducao.produto,
              quantidade: quantidadeAnterior,
              safraId: editarProducao.safra,
              fazendaId: editarProducao.fazenda,
            },
          ],
        })

        // Atualiza a produção
        await atualizarProducao(editarProducao.id, payload)

        // Registra novo estoque
        await registrarProducaoEstoque({
          id: editarProducao.id,
          itens: [
            {
              produtoId: produto,
              quantidade: quantidadeNum,
              safraId: safra,
              fazendaId: fazenda,
            },
          ],
        })
      } else {
        const docRef = await adicionarProducao(payload)

        await registrarProducaoEstoque({
          id: docRef.id,
          itens: [
            {
              produtoId: produto,
              quantidade: quantidadeNum,
              safraId: safra,
              fazendaId: fazenda,
            },
          ],
        })
      }

      setForm({
        produto: '',
        quantidade: '',
        fazenda: '',
        safra: '',
        data: '',
      })
      onSuccess()
    } catch (err: any) {
      console.error(err)
      alert('Erro ao salvar a produção: ' + err.message)
    }
  }

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <div className="form-container">
          <h2 className="title-form">Cadastrar ou consultar os saldos</h2>
          <h3 className="subtitle-form" style={{margin: "0"}}>
            Selecione produto, safra e fazenda para ver saldo.
          </h3>
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
          <FazendaSelect
            id="filtro-fazenda"
            value={form.fazenda}
            onChange={(value) => handleChange('fazenda', value)}
            name="fazenda"
            required={false}
          />
        </div>
        {saldoEstoque !== null ? (
          <div style={{ width: '100%' }}>
            <p>Saldo atual do estoque:</p>
            <p id="text-destaque">{saldoEstoque}</p>
          </div>
        ) : (
          <>
            <h3 className="subtitle-form">
              Selecione todos os itens acima e digite uma quantidade para nova
              produção.
            </h3>
          </>
        )}

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

        {/* Hidden input to show the datetime now if needed */}
        <input type="hidden" name="data" value={form.data} />
        <div className="div-buttons">
          <ButtonComponent
            type="submit"
            label={editarProducao ? 'Atualizar' : 'Cadastrar'}
          />

          {editarProducao && onCancelEdit && (
            <ButtonComponent
              type="button"
              label="Cancelar"
              onClick={onCancelEdit}
              variant="buttonGrey"
              textColor="secondary"
            />
          )}
        </div>
      </form>
    </Container>
  )
}
