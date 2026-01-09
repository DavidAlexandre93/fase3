# Copilot Instructions for AI Agents

## Visão Geral

Este projeto é um blog escolar construído com React, TypeScript e Vite. O foco está em autenticação, layouts reutilizáveis e navegação baseada em rotas. O código é modular, com separação clara entre contexto de autenticação, layouts, páginas e rotas.

## Estrutura e Fluxo Principal

- **src/contexts/AuthContext.tsx**: Define o contexto de autenticação, incluindo métodos `login`, `logout` e o estado do usuário. Use o `AuthProvider` para envolver a aplicação.
- **src/hooks/useAuth.ts**: Hook customizado para acessar o contexto de autenticação. Sempre use este hook para acessar dados/métodos de autenticação.
- **src/layouts/**: Contém layouts reutilizáveis (ex: `MainLayout`, `LoginLayout`). Layouts são usados para estruturar páginas e podem envolver componentes de página nas rotas.
- **src/pages/**: Páginas principais da aplicação. Exemplo: `Login.tsx` implementa o formulário de login e usa o contexto de autenticação.
- **src/routes/index.tsx**: Define as rotas da aplicação usando `react-router-dom`. Rotas podem ser envolvidas por layouts diferentes.
- **src/App.tsx**: Ponto de entrada do app React. Envolve tudo com `AuthProvider`, `BrowserRouter` e o layout principal.

## Convenções e Padrões

- **Autenticação**: Sempre utilize o contexto e o hook `useAuth` para login/logout. Não manipule autenticação diretamente em componentes.
- **Layouts**: Use layouts para separar visual e lógica de navegação. Exemplo: `LoginLayout` para páginas de login, `MainLayout` para o restante.
- **Rotas**: Adicione novas páginas importando-as em `src/routes/index.tsx` e definindo a rota, preferencialmente usando um layout adequado.
- **Estilos**: Utilize arquivos CSS ou `styled-components` para estilização. O projeto já inclui dependência de `styled-components`.

## Workflows de Desenvolvimento

- **Rodar localmente**: `npm run dev`
- **Build de produção**: `npm run build`
- **Lint**: `npm run lint`
- **Pré-visualização**: `npm run preview`

## Integrações e Dependências

- **React Router**: Navegação entre páginas.
- **Axios**: Para requisições HTTP (ainda não implementado, mas já incluso).
- **styled-components**: Para estilos CSS-in-JS.

## Exemplos de Padrão

- Para adicionar uma nova página:
  1. Crie o componente em `src/pages/`.
  2. Importe e adicione a rota em `src/routes/index.tsx`.
  3. Use um layout apropriado.
- Para acessar autenticação:
  ```tsx
  import useAuth from "../hooks/useAuth";
  const { user, login, logout, isAuthenticated } = useAuth();
  ```

## Observações

- Não há serviços implementados em `src/services/` ainda, mas este diretório é reservado para integrações futuras (ex: API).
- Componentes reutilizáveis devem ser criados em `src/components/`.

Consulte este arquivo antes de automatizar tarefas ou gerar código para garantir alinhamento com os padrões do projeto.
