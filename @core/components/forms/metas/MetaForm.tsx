import { useEffect, useState } from 'react'
import { useAuthStore } from '@/@core/store/authStore'
import FazendaSelect from '../fazendas/FazendaSelect'
import SafraSelect from '../safras/SafraSelect'
import ProdutoSelect from '../produtos/ProdutoSelect'
import {
  adicionarMeta,
  atualizarMeta,
} from '@/@core/services/firebase/pages/metasService'
import InputComponent from '../../ui/input/Input.component'
import SelectComponent from '../../ui/select/Select.component'
import { Container } from '@/@theme/custom/Forms.styles'
import ButtonComponent from '../../ui/Button'

interface MetaFormProps {
  onSuccess: () => void
  editarMeta?: {
    id: string
    produto: string
    valor: number
    safra?: string
    fazenda: string
    tipo?: string
  }
  onCancelEdit?: () => void
}

export default function MetaForm({
  onSuccess,
  editarMeta,
  onCancelEdit,
}: MetaFormProps) {
  const user = useAuthStore((state) => state.user)

  const [form, setForm] = useState({
    produto: '',
    valor: '',
    safra: '',
    fazenda: '',
    tipo: 'producao', // valor padrão
  })

  useEffect(() => {
    if (editarMeta) {
      setForm({
        produto: editarMeta.produto,
        valor: String(editarMeta.valor),
        safra: editarMeta.safra!,
        fazenda: editarMeta.fazenda,
        tipo: editarMeta.tipo ?? 'producao',
      })
    } else {
      setForm({
        produto: '',
        valor: '',
        safra: '',
        fazenda: '',
        tipo: 'producao',
      })
    }
  }, [editarMeta])

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      alert('Usuário não autenticado')
      return
    }

    const novaMeta = {
      produto: form.produto,
      valor: Number(form.valor),
      safra: form.safra,
      fazenda: form.fazenda,
      tipo: form.tipo,
      uid: user.uid,
    }

    try {
      if (editarMeta) {
        await atualizarMeta(editarMeta.id, novaMeta)
      } else {
        await adicionarMeta(novaMeta)
      }

      setForm({
        produto: '',
        valor: '',
        safra: '',
        fazenda: '',
        tipo: 'producao',
      })
      onSuccess()
    } catch (error) {
      console.error('Erro ao salvar meta:', error)
      alert('Erro ao salvar meta')
    }
  }

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <div id="containers-legend">
            <legend className="title-form">
              {editarMeta ? "Editar Meta" : "Cadastrar Meta"}
            </legend>
          </div>
          <ProdutoSelect
            name="produto"
            value={form.produto}
            onChange={(value) => handleChange("produto", value)}
            required
          />

          <InputComponent
            type="number"
            name="valor"
            value={form.valor}
            onChange={(value) => handleChange("valor", value)}
            placeholder="Valor da meta"
            min={0}
            required
            id={"valor"}
          />

          <SafraSelect
            name="safra"
            valueKey="id"
            labelKey="nome"
            value={form.safra}
            onChange={(value) => handleChange("safra", value)}
            required
          />

          <FazendaSelect
            name="fazenda"
            value={form.fazenda}
            onChange={(value) => handleChange("fazenda", value)}
            id={"fazenda"}
            required
          />

          <SelectComponent
            name="tipo"
            value={form.tipo}
            onChange={(value) => handleChange("tipo", value)}
            required
            options={[
              { label: "Meta de Produção", value: "producao" },
              { label: "Meta de Vendas", value: "vendas" },
            ]}
            valueKey="value"
            labelKey="label"
          />
          <div className="div-buttons">
            <ButtonComponent
              type="submit"
              label={editarMeta ? "Salvar" : "Cadastrar"}
            />

            {editarMeta && onCancelEdit && (
              <ButtonComponent
                type="button"
                label="Cancelar"
                onClick={onCancelEdit}
                variant="buttonGrey"
                textColor="secondary"
              />
            )}
          </div>
        </fieldset>
      </form>
    </Container>
  );
}
