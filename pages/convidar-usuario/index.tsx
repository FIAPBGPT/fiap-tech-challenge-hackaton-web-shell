'use client'
import ButtonComponent from '@/@core/components/ui/Button'
import InputComponent from '@/@core/components/ui/input/Input.component'
import { sendInviteEmail } from '@/@core/services/firebase/pages/inviteUserService'
import { Container } from '@/@theme/custom/Forms.styles'
import { useState } from 'react'

export default function InviteUser() {
  const [email, setEmail] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Função para tratar o envio do convite
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      setError('O e-mail é obrigatório')
      return
    }

    setError(null) // Limpar qualquer erro anterior
    setLoading(true) // Iniciar o processo de loading

    try {
      await sendInviteEmail(email) // Envia o convite
      setSuccessMessage('Convite enviado com sucesso!')
      setEmail('') // Limpar o campo de e-mail após envio
    } catch (err) {
      setError('Erro ao enviar o convite. Tente novamente.')
    } finally {
      setLoading(false) // Finalizar o processo de loading
    }
  }

  return (
    <Container>
      <div className="form-container">
        <h2 className="title-form">Enviar Convite para Cadastro</h2>

        {/* Mensagem de Sucesso */}
        {successMessage && (
          <div
            style={{
              color: 'green',
              marginBottom: '15px',
              textAlign: 'center',
            }}
          >
            {successMessage}
          </div>
        )}

        {/* Mensagem de Erro */}
        {error && (
          <div
            style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="div-input-senha">
            <InputComponent
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(value) => setEmail(value)}
              placeholder="Digite o e-mail do usuário"
              required
            />
            <div className="div-buttons">
              <ButtonComponent
                type="submit"
                disabled={loading}
                label={loading ? 'Enviando...' : 'Enviar Convite'}
              />
            </div>
          </div>
        </form>
      </div>
    </Container>
  )
}
