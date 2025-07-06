# FIAP Tech Challenge Hackathon - Web Shell

Este projeto é uma aplicação web desenvolvida com [Next.js](https://nextjs.org/) para o Tech Challenge da FIAP. O objetivo do projeto é fornecer uma interface moderna e eficiente para resolver desafios propostos durante o hackathon, utilizando as melhores práticas de desenvolvimento web.

## Sobre o Projeto

O **FIAP Tech Challenge Hackathon - Web Shell** é uma aplicação que permite aos usuários interagir com desafios técnicos, visualizar resultados em tempo real e colaborar em equipe. O projeto foi estruturado para ser facilmente extensível e de fácil manutenção, utilizando tecnologias modernas do ecossistema React.

Este projeto segue o padrão **Clean Architecture**, garantindo separação de responsabilidades e facilitando a escalabilidade e manutenção do código. O gerenciamento de estado é feito com [Zustand](https://zustand-demo.pmnd.rs/), proporcionando uma solução leve e eficiente para estados globais. Além disso, a aplicação é um **Micro Frontend Shell (MFE Shell)** utilizando **Module Federation**, permitindo integração e orquestração de múltiplos micro frontends de forma dinâmica.

## Como Rodar o Projeto

Siga os passos abaixo para executar o projeto localmente:

1. **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/fiap-tech-challenge-hackaton-web-shell.git
    cd fiap-tech-challenge-hackaton-web-shell
    ```

2. **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    # ou
    pnpm install
    # ou
    bun install
    ```

3. **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    # ou
    yarn dev
    # ou
    pnpm dev
    # ou
    bun dev
    ```

4. **Acesse a aplicação:**

    Abra [http://localhost:3000](http://localhost:3000) no seu navegador para visualizar a aplicação.

## Configurações Adicionais

- **Variáveis de Ambiente:**  
  Caso o projeto utilize variáveis de ambiente, crie um arquivo `.env.local` na raiz do projeto e adicione as configurações necessárias conforme a documentação interna.

- **Scripts Disponíveis:**
  - `dev`: Inicia o servidor de desenvolvimento.
  - `build`: Gera a versão de produção do projeto.
  - `start`: Inicia o servidor em modo produção.
  - `lint`: Executa o linter para verificar problemas de código.

## Estrutura do Projeto

- `pages/`: Contém as páginas da aplicação.
- `components/`: Componentes reutilizáveis de UI.
- `public/`: Arquivos estáticos.
- `styles/`: Estilos globais e módulos CSS.

## Tecnologias Utilizadas

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Zustand](https://zustand-demo.pmnd.rs/) para gerenciamento de estado
- [next/font](https://nextjs.org/docs/basic-features/font-optimization) para otimização de fontes
- **Clean Architecture**
- **Module Federation** para Micro Frontends

## Saiba Mais

- [Documentação do Next.js](https://nextjs.org/docs)
- [Tutorial Interativo Next.js](https://nextjs.org/learn)
