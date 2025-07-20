import HeaderComponent from '@/@core/components/ui/header/Header.component'
import MenuComponent from '@/@core/components/ui/menu/Menu.component'
import { ItemProps } from '@/@core/hooks/useSection'
import { Container } from '@/@theme/custom/HeaderMenu.styles'
import {
  FooterContainer,
  ContactContainer,
  ContactText,
  IconsContainer,
  IconLink,
  FooterInsideContainer,
} from '@/@theme/custom/Footer.style'
import { FaInstagram, FaLinkedin, FaWhatsapp } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { NotificationBell } from '../NotificationBell/NotificationBell'
import { listar } from '@/@core/services/firebase/firebaseService'

export default function HeaderMenuComponent({
  children,
}: {
  children: React.ReactNode
}) {
  const [activeContent, setActiveContent] = useState<React.ReactNode | null>(
    null
  )
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeItem, setActiveItem] = useState<ItemProps>(ItemProps.HOME)
  const closeMenu = () => setIsMenuOpen(false)

  const [loading, setLoading] = useState(true)
  const [produtos, setProdutos] = useState<any[]>([])
  const [fazendas, setFazendas] = useState<any[]>([])

  const handleOpenCadastro = (form: React.ReactNode, item: ItemProps) => {
    setActiveContent(form)
    setActiveItem(item)
  }

  const handleCloseCadastro = () => {
    setActiveContent(null)
  }

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true)
        const [produtosRaw, fazendasData] = await Promise.all([
          listar('produtos'),
          listar('fazendas'),
        ])

        setProdutos(produtosRaw)
        const fazendasMapped = fazendasData.map((f: any) => ({
          id: f.id,
          nome: f.nome ?? '',
          estado: f.estado ?? '',
          latitude: f.latitude ?? 0,
          longitude: f.longitude ?? 0,
        }))
        setFazendas(fazendasMapped)
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setLoading(false)
      }
    }

    carregarDados()
  }, [])

  return (
    <Container>
      <HeaderComponent
        toggleMenu={() => setIsMenuOpen((visible) => !visible)}
        isActive={isMenuOpen}
        item={activeItem}
      />
      <div id="menu-main-container">
        {/* mobile */}

        <div
          className={`menu-overlay ${isMenuOpen ? 'show' : ''}`}
          onClick={closeMenu}
        />

        <MenuComponent
          isMenuOpen={isMenuOpen}
          onClose={closeMenu}
          onOpenCadastro={handleOpenCadastro}
        />

        <main>
          {activeItem === ItemProps.USUARIO ? (
            <div id="div-main-image">
              <div id="div-main-container">
                {activeContent ? <>{activeContent}</> : children}
              </div>
            </div>
          ) : (
            <div id="div-main">
              <div id="div-main-container">
                <Row>
                  <Col md={12}>
                    <NotificationBell products={produtos} fazendas={fazendas} />
                  </Col>
                </Row>
                {activeContent ? <>{activeContent}</> : children}
              </div>
            </div>
          )}
        </main>
      </div>
      <FooterContainer>
        <FooterInsideContainer>
          <ContactContainer>
            <ContactText>Contate-nos</ContactText>
            <IconsContainer>
              <IconLink
                href="https://instagram.com"
                target="_blank"
                aria-label="Instagram"
              >
                <FaInstagram />
              </IconLink>
              <IconLink
                href="https://linkedin.com"
                target="_blank"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </IconLink>
              <IconLink
                href="https://wa.me/1234567890"
                target="_blank"
                aria-label="WhatsApp"
              >
                <FaWhatsapp />
              </IconLink>
            </IconsContainer>
          </ContactContainer>

          <ContactContainer>
            <ContactText>0800 004 250 08 | suporte@fiapfams.com.br</ContactText>
            <ContactText>Desenvolvido por Grupo 29</ContactText>
          </ContactContainer>
        </FooterInsideContainer>
      </FooterContainer>
    </Container>
  )
}
