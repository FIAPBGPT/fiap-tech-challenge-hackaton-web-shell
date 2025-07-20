'use client'
import { Container } from '@/@theme/custom/Menu.styles'
import UserIcon from '@/public/contact.svg'
import HomeIcon from '@/public/home.svg'
import RegisterIcon from '@/public/cadastro_check.svg'
import { useEffect, useState } from 'react'
import useWindowSize from '../../../hooks/useWindowSize'
import CardapioIcon from '@/public/icons8cardapio.svg'
import Seta from '@/public/play.svg'
import FazendasPage from '@/pages/fazendas'
import DashboardPage from '@/pages/dashboard'
import ProdutosPage from '@/pages/produtos'
import EstoquePage from '@/pages/estoque'
import ProducoesPage from '@/pages/producoes'
import InviteUser from '@/pages/convidar-usuario'
import { ItemProps } from '@/@core/hooks/useSection'
import MetasPage from '@/pages/metas'
import SafrasPage from '@/pages/safras'
import VendasPage from '@/pages/vendas'
import { useAuthStore } from '@/@core/store/authStore'
import { useAuthListener } from '@/@core/hooks/useAuthListener'

interface MenuComponentProps {
  isMenuOpen: boolean
  onClose?: () => void
  onOpenCadastro: (form: React.ReactNode, item: ItemProps) => void
}

export default function MenuComponent({
  isMenuOpen,
  onClose,
  onOpenCadastro,
}: MenuComponentProps) {
  const [logoutLoading, setLogoutLoading] = useState(false)
  const [isMenuLinksOpen, setIsMenuLinksOpen] = useState(false)
  const [isActiveBtn, setIsActiveBtn] = useState<ItemProps>(() => {
    const saved =
      typeof window !== 'undefined'
        ? localStorage.getItem('activeMenuBtn')
        : null
    return saved ? (saved as ItemProps) : ItemProps.HOME
  })

  // Map ItemProps to corresponding content page
  const getContentByItem = (item: ItemProps) => {
    switch (item) {
      case ItemProps.HOME:
        return <DashboardPage />
      case ItemProps.USUARIO:
        return <InviteUser />
      case ItemProps.PRODUTO:
        return <ProdutosPage />
      case ItemProps.ESTOQUE:
        return <EstoquePage />
      case ItemProps.PRODUCAO:
        return <ProducoesPage />
      case ItemProps.VENDA:
        return <VendasPage />
      case ItemProps.FAZENDA:
        return <FazendasPage />
      case ItemProps.SAFRA:
        return <SafrasPage />
      case ItemProps.METAS:
        return <MetasPage />
      default:
        return null
    }
  }

  // On mount, open the content page corresponding with activeMenuBtn
  // Only run once on mount
  // Execute this before useWindowSize
  useEffect(() => {
    // Always call onOpenCadastro with a valid ItemProps
    const content = getContentByItem(isActiveBtn)
    onOpenCadastro(content, isActiveBtn)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const { width } = useWindowSize()
  const isMobile = width <= 720
  const user = useAuthStore((state) => state.user)
  const { logout } = useAuthListener()

  // Desktop: sempre visível | Mobile: só se isMenuOpen for true
  const isVisible = !isMobile || isMenuOpen
  if (!isVisible) return null

  function toggleMenuLinks() {
    setIsMenuLinksOpen((isMenuLinksOpen) => !isMenuLinksOpen)
  }

  const renderActiveButton = (
    id: string,
    item: ItemProps,
    content: React.ReactNode,
    label: string,
    icon?: React.ReactNode
  ) => {
    return (
      <button
        onClick={() => {
          onOpenCadastro(content, item)
          setIsActiveBtn(item)
          if (typeof window !== 'undefined') {
            localStorage.setItem('activeMenuBtn', item)
          }
        }}
        className={`menu-button ${isActiveBtn === item ? 'isActive' : ''}`}
      >
        {icon}
        {label}
      </button>
    )
  }

  const handleLogout = async () => {
    setLogoutLoading(true)

    try {
      await logout()
    } catch (error) {
      setLogoutLoading(false)
    }
  }

  return (
    <Container className={isMobile && isMenuOpen ? 'mobile-menu-open' : ''}>
      {isMobile && onClose && (
        <div className="menu-close-button">
          <button onClick={onClose}>
            <CardapioIcon />
          </button>
        </div>
      )}

      <div id="menu-header">
        <div id="menu-user-icon">
          <UserIcon />
        </div>
        <div id="menu-data-user">
          <h1>{user?.email || 'Usuário'}</h1>
          <p>Analista Administrativo</p>
          <p>Matrícula: 12345</p>
        </div>
      </div>

      <div id="menu-navigation">
        <div className="menu-navigation-item">
          {renderActiveButton(
            'home',
            ItemProps.HOME,
            <DashboardPage />,
            'Home',
            <HomeIcon />
          )}
        </div>
        <div className="menu-navigation-item">
          <button
            onClick={toggleMenuLinks}
            className={`menu-button ${isMenuLinksOpen ? 'isActive' : ''}`}
          >
            <Seta />
            Cadastrar
          </button>
        </div>

        <div
          id="menu-button-cadastro"
          className={isMenuLinksOpen ? 'show' : ''}
        >
          {renderActiveButton(
            'usuario',
            ItemProps.USUARIO,
            <InviteUser />,
            'Usuário'
          )}
          {renderActiveButton(
            'produto',
            ItemProps.PRODUTO,
            <ProdutosPage />,
            'Produto'
          )}
          {renderActiveButton(
            'estoque',
            ItemProps.ESTOQUE,
            <EstoquePage />,
            'Estoque'
          )}
          {renderActiveButton(
            'producao',
            ItemProps.PRODUCAO,
            <ProducoesPage />,
            'Produção'
          )}
          {renderActiveButton(
            'venda',
            ItemProps.VENDA,
            <VendasPage />,
            'Venda'
          )}
          {renderActiveButton(
            'fazenda',
            ItemProps.FAZENDA,
            <FazendasPage />,
            'Fazenda'
          )}
          {renderActiveButton(
            'safra',
            ItemProps.SAFRA,
            <SafrasPage />,
            'Safra'
          )}
          {renderActiveButton('metas', ItemProps.METAS, <MetasPage />, 'Metas')}
        </div>
        <div className="logout-button">
          
          <button
            onClick={handleLogout}
            className="menu-button"
            disabled={logoutLoading}
          >
            <div><Seta /></div>
            {logoutLoading ? 'Saindo...' : 'Logout'}
          </button>
        </div>
      </div>
    </Container>
  )
}
