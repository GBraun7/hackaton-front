# Guia para criar novos frontends com os padrões do Portifólio

Referência: `C:\Projeto\portifolio`. Conferência dos arquivos locais: 08/10/2026.
Documento complementar: `ANALISE_TECNICA_PORTIFOLIO.md`.

## 1. Como usar este documento

Entregue este arquivo ao agente ou desenvolvedor junto com a descrição do novo produto. Ele define a base técnica a reutilizar, as responsabilidades de cada camada e o processo de entrega. Não constitui autorização para publicar o projeto ou copiar conteúdo pessoal do portfólio.

O código do projeto original é a fonte de verdade. Em caso de dúvida, consulte os arquivos indicados abaixo. Se a origem não estiver disponível, registre a limitação e não invente comportamentos, endpoints ou integrações.

As seções identificam três categorias:

- **Existente:** tecnologia ou comportamento confirmado no projeto original.
- **Regra de reutilização:** instrução para aplicar essa base no novo projeto.
- **Melhoria proposta:** alteração deliberada em relação à implementação original, sem afirmar que já está implementada.

Este guia não determina o domínio do produto. Antes de implementar, obtenha ou identifique no pedido: objetivo, público, páginas, funcionalidades, identidade visual, idiomas e contrato de API. Progrida nas partes independentes e esclareça somente o que bloquear decisões relevantes.

## 2. Regras principais para o agente

1. Use React, TypeScript e Vite como base de SPA, com a organização por camadas descrita neste guia.
2. Preserve a separação `página/componente -> hook -> serviço -> cliente HTTP`, com contratos TypeScript compartilhados.
3. Reutilize os componentes locais de UI antes de introduzir alternativas para a mesma função.
4. Não introduza Next.js, SSR, Redux, Zustand, TanStack Query, backend, banco de dados ou autenticação como se fossem parte da origem. A inclusão depende de requisito concreto e deve ser registrada como decisão nova.
5. Escolha os módulos opcionais conforme o produto. Chat, partículas, carrossel e conteúdo bilíngue não são funcionalidades obrigatórias de qualquer novo projeto.
6. Não copie nome, contatos, currículo, imagens, textos, links, endpoints de domínio ou credenciais do portfólio para o novo produto sem necessidade expressa.
7. Evite `any`, variáveis não utilizadas, efeitos sem responsabilidade clara e lógica HTTP espalhada pela interface.
8. Verifique os comandos e o comportamento real antes de declarar a entrega concluída. Registre falhas e limitações de forma explícita.

## 3. Stack existente e seleção de bibliotecas

Versões abaixo são as faixas de `package.json` local, não uma indicação das versões mais recentes. Para reprodução exata, consulte também `package-lock.json` e o inventário da análise técnica.

| Área | Bibliotecas existentes | Aplicação no novo projeto |
|---|---|---|
| Interface | `react ^18.3.1`, `react-dom ^18.3.1` | Base da aplicação |
| Linguagem/build | `typescript ~5.6.2`, `vite ^6.0.1`, `@vitejs/plugin-react ^4.3.4` | Build e desenvolvimento |
| Rotas | `react-router-dom ^7.0.2` | Navegação SPA com layout e `Outlet` |
| Estilos | `tailwindcss ^3.4.15`, `postcss ^8.4.49`, `autoprefixer ^10.4.20` | Utilitários e processamento CSS |
| Composição CSS | `clsx ^2.1.1`, `tailwind-merge ^2.5.5`, `class-variance-authority ^0.7.1` | `cn()` e variantes de componentes |
| Animações CSS | `tailwindcss-animate ^1.0.7` | Animações usadas pelos componentes |
| UI | Radix Alert Dialog, Label, Progress, Slot e Tooltip | Base dos componentes locais em `components/ui` |
| Ícones | Font Awesome 6.7.1, integração React 0.2.2, `lucide-react ^0.468.0` | Font Awesome nas áreas do portfólio; Lucide no carrossel base |
| HTTP | `axios ^1.15.2` | Cliente central e serviços tipados |
| Idiomas | `i18next ^24.0.5`, `react-i18next ^15.1.3`, detector `^8.0.0` | Usar quando houver internacionalização |
| Formulários | `react-hook-form ^7.54.2`, `zod ^3.24.1`, `@hookform/resolvers ^3.10.0` | Usar em formulários com validação |
| Carrossel | `embla-carousel-react ^8.5.2`, `embla-carousel-autoplay ^8.5.2` | Opcional |
| Partículas | `@tsparticles/react ^3.0.0`, `tsparticles ^3.7.1` | Opcional |
| Texto animado | `react-simple-typewriter ^5.0.1` | Opcional |
| Qualidade | ESLint 9, typescript-eslint 8, plugins React Hooks e Fast Refresh | Verificação estática |
| Testes | Jest 29, jsdom 29, Testing Library React 16, jest-dom 6, user-event 14 | Testes de comportamento |
| Transformação de testes | Babel 7, presets env/React/TypeScript, babel-jest 29, identity-obj-proxy 3 | TSX e mapeamento de estilos no Jest |

**Regra de reutilização:** mantenha essas gerações como referência de compatibilidade. Não execute geradores sem versão que substituam silenciosamente React, Tailwind, Vite ou o formato das configurações. Se houver atualização solicitada, trate-a como migração e valide o conjunto.

O projeto não depende de um pacote de runtime chamado `shadcn`. Os componentes shadcn/ui são código local apoiado em Radix. `components.json` configura `new-york`, `zinc`, TSX, variáveis CSS, `rsc: false` e ícones Lucide.

## 4. Estrutura de diretórios

**Existente:** a organização é por camada técnica, não por módulos de domínio completos.

```text
novo-projeto/
  public/                     # Recursos com URL pública estável
  src/
    assets/
      img/                    # Imagens importadas pelo código
      locales/                # pt.json e en.json, quando necessários
    components/
      ui/                     # Primitivos locais reutilizáveis
      nome-componente/
        Index.tsx             # Convenção existente
    data/                     # Conteúdo local tipado
    hooks/                    # Estado e coordenação assíncrona
    interface/                # Props e DTOs TypeScript
    layout/
      Index.tsx               # Estrutura compartilhada e Outlet
    lib/
      api-client.ts           # Instância Axios
      utils.ts                # cn()
    pages/
      nome-pagina/
        Index.tsx
    services/                 # Operações HTTP por recurso
    App.tsx
    main.tsx
    routes.tsx
    i18.ts                    # Se houver idiomas
    index.css
    vite-env.d.ts
  .env.example
  components.json
  package.json
  package-lock.json
  vite.config.ts
  tsconfig.json
  tsconfig.app.json
  tsconfig.node.json
  tailwind.config.js
  postcss.config.js
  eslint.config.js
  babel.config.cjs
  setup-tests.js
  index.html
```

A árvore é um modelo para o novo projeto. Na origem existem `pages/home`, `pages/abaout`, `pages/portifolio` e `pages/contact`; não são nomes obrigatórios para o novo domínio.

**Regra de reutilização:** mantenha nomes de diretórios consistentes, arquivos TSX para interface, hooks `useNome.ts`, serviços `recurso.service.ts` e contratos em `interface`. Use `@/` para imports a partir de `src` e garanta seu mapeamento no TypeScript, Vite e Jest.

**Melhoria proposta:** não reproduza erros de grafia como `abaout` e `commom`. Arquivos com nomes descritivos podem substituir `Index.tsx` se a convenção for definida para todo o novo projeto. Considere diferenças de caixa em ambientes Linux.

## 5. Arquitetura e responsabilidades

### Inicialização e navegação

**Existente:** `main.tsx` importa o CSS global e monta `App` com `createRoot` e `StrictMode`. `App.tsx` importa `i18.ts` e renderiza o roteador. `routes.tsx` usa `BrowserRouter`, `Routes` e `Route`; uma rota pai renderiza o layout, e as filhas aparecem em `Outlet`.

**Regra de reutilização:** mantenha a montagem em `main`, composição global em `App`, definição de rotas em `routes` e estrutura compartilhada em `layout`. Coloque no layout apenas elementos que realmente persistem entre páginas.

**Melhorias propostas:** adicionar página de rota inexistente; dividir rotas com lazy loading quando o tamanho justificar; adicionar boundary de erro quando necessário. A origem não possui essas implementações.

### Interface, estado e integração

| Camada | Responsabilidade | Evitar |
|---|---|---|
| `pages` | Compor a página e conectar funcionalidades | Repetir estrutura global ou implementar cliente HTTP |
| `components` | Renderizar e tratar interações do componente | Acoplar primitivas de UI a endpoints de domínio |
| `hooks` | Coordenar estado, efeitos, carregamento e erro | Misturar renderização JSX e configuração do cliente |
| `services` | Executar operações HTTP e retornar dados tipados | Toasts, navegação e estado visual |
| `lib/api-client` | Configuração HTTP compartilhada | Endpoints de cada recurso |
| `interface` | Definir contratos e props | Confundir tipo estático com validação runtime |
| `data` | Dados locais estáticos | Fingir que dados locais vieram do backend |

**Existente:** o estado usa principalmente `useState`, `useEffect` e `useCallback`; há contextos locais em componentes de UI. Hooks de leitura retornam `{ data, loading, error }`. Não há store global de domínio nem cache compartilhado de requisições.

**Regra de reutilização:** use esse retorno como padrão de leitura; exiba carregamento, erro, resultado vazio e sucesso. As telas vazias explícitas são uma melhoria em relação às listas existentes. Para mutações, exponha estado de envio e evite submissões duplicadas.

## 6. HTTP, contratos e ambiente

**Existente:** `src/lib/api-client.ts` cria uma instância Axios com `baseURL: import.meta.env.VITE_API_URL` e cabeçalho JSON. Um interceptor usa `localStorage.accessToken` como Bearer quando presente. Isso não representa um sistema de autenticação completo.

Os serviços existentes cobrem habilidades, projetos do carrossel, trabalhos, links sociais, contato e chat. Os contratos estão em `src/interface/api.types.ts`. Esses recursos pertencem ao domínio do portfólio e não devem virar requisitos automáticos do novo projeto.

**Regra de reutilização:** centralize a base da API, defina DTOs conforme o contrato real e crie serviços por recurso. Não mantenha os endpoints do portfólio por conveniência. Não invente contrato definitivo quando o backend ainda não foi especificado; marque mocks e hipóteses claramente.

```ts
// Exemplo adaptável, não arquivo existente do portfólio.
import { api } from '@/lib/api-client'
import type { ItemDto } from '@/interface/api.types'

export const itensService = {
  getAll: () => api.get<ItemDto[]>('/api/itens').then((response) => response.data),
}
```

O exemplo pressupõe criar `ItemDto` e confirmar `/api/itens` no contrato do novo produto.

Mantenha `.env.example` com nomes e valores de exemplo, como `VITE_API_URL=https://api.example.com`. Variáveis `VITE_*` chegam ao frontend; não coloque chaves privadas nelas. Configure desenvolvimento e produção conforme o novo destino.

**Melhorias propostas:** definir timeout, normalizar erros e cancelar requisições quando adequado. A origem não possui timeout explícito, cancelamento, retry ou validação runtime das respostas Axios. Zod pode validar respostas se o contrato exigir; seu uso original é no formulário.

Não replique automaticamente o interceptor de token sem autenticação necessária e definida para o novo produto.

## 7. Componentes, estilos e formulários

**Existente:** `components/ui` possui `alert-dialog`, `button`, `carousel`, `form`, `input`, `label`, `progress`, `textarea` e `tooltip`. `cn()` combina `clsx` e `tailwind-merge`; CVA define variantes de componentes.

**Regra de reutilização:** mantenha os primitivos livres de conteúdo de domínio, componha componentes específicos sobre eles e concentre variantes reutilizáveis em vez de duplicar classes. Preserve Tailwind 3, sua configuração e as diretivas `@tailwind base`, `components` e `utilities` ao reproduzir esta base.

O tema original usa tokens CSS em HSL, `darkMode: ['class']`, preto/cinza/amarelo, Montserrat e Black Ops One. Não há alternador de tema implementado. A identidade do novo produto deve ser definida no briefing; não precisa repetir as cores e fontes pessoais.

**Melhorias propostas:** evitar regras globais com `!important` para textos e botões; preservar tamanhos por componente; testar responsividade, foco visível, contraste e navegação por teclado. Usar botões semânticos para ações e nomes acessíveis em controles de ícone.

**Existente:** o formulário de contato usa React Hook Form, `zodResolver` e Zod, mas não está montado nas páginas atuais. Sua chamada `fetch` para localhost é uma exceção ao padrão Axios e não deve ser copiada.

**Regra de reutilização:** validar campos com schema, derivar tipos com `z.infer`, associar labels aos campos, mostrar mensagens junto ao campo e enviar pelo serviço adequado. Implementar respostas de sucesso e erro conforme a API real, sem endereço localhost fixo no componente.

## 8. Idiomas e recursos opcionais

**Existente:** `i18.ts` registra `pt.json` e `en.json`, fallback inglês e detector de navegador. A detecção prioriza `navigator` antes de `localStorage`, e cacheia em localStorage/cookie.

**Regra de reutilização:** se houver dois idiomas, mantenha as chaves equivalentes nos arquivos, use `useTranslation` e traduza estados, erros e rótulos acessíveis. Se o produto tiver apenas um idioma, não imponha esse módulo sem necessidade.

**Melhorias propostas:** priorizar preferência salva quando desejado e sincronizar `document.documentElement.lang` com o idioma. Não apresente esses comportamentos como existentes na origem.

- **Chat:** a origem possui widget global, hook e serviço para `POST /api/chat`, com mensagem, idioma e histórico e resposta `answer`. O provedor de IA não está implementado nesse frontend. Reutilizar só com backend e contrato definidos.
- **Carrossel:** Embla com autoplay; adotar apenas quando útil ao conteúdo e fornecer controles acessíveis.
- **Partículas:** tsParticles com `loadFull`; medir custo antes de copiar 160 partículas e 120 FPS do original.
- **Texto digitado:** react-simple-typewriter; usar sem comprometer leitura e tradução.
- **Imagens:** escolher import em `src/assets` ou URL estável em `public`; evitar cópias duplicadas sem motivo. Adicionar texto alternativo e carregamento adequado.

Suporte a movimento reduzido e otimização de imagens são melhorias propostas, não funcionalidades confirmadas no portfólio.

## 9. Configuração, testes e entrega

**Existente:** módulos ES (`type: module`), Babel em `.cjs`, TypeScript estrito, `noUnusedLocals`, `noUnusedParameters`, `noEmit`, alvo ES2020 na aplicação e ES2022 na configuração Node. O build executa `tsc -b && vite build`.

Jest está configurado no `package.json`, com jsdom, `setup-tests.js`, babel-jest, alias `@/`, mapeamento CSS e exceção de transformação para tsParticles. Existe um teste da Home; isso não implica cobertura ampla.

| Comando | Verificação |
|---|---|
| `npm ci` | Instalação reproduzível quando existir lockfile válido |
| `npm run dev` | Desenvolvimento local |
| `npm run build` | TypeScript e bundle de produção |
| `npm run lint` | ESLint |
| `npm test -- --runInBand` | Testes Jest |
| `npm run preview` | Inspeção do build gerado |

**Regra de reutilização:** use testes de comportamento relevantes ao produto, com Testing Library, e mocks nas fronteiras externas. Valide rotas por acesso direto, navegação, telas pequenas, formulários e estados assíncronos. Não declare integração real validada usando apenas mocks.

A análise anterior registrou falhas de lint e não validou o build Vite completo. Esses registros são históricos; não substituem executar os checks no novo projeto. Não copie problemas para preservar fidelidade e não afirme que a origem está integralmente aprovada.

**Existente:** o workflow publica por FTP em push para `main`, instala com `npm install`, executa build e envia `dist/` para Hostinger. Também há configurações de fallback SPA para diferentes servidores.

**Regra de reutilização:** selecione a hospedagem conforme o novo projeto e configure fallback para `index.html`. Não copie os destinos FTP, segredos ou múltiplas configurações de servidor sem necessidade. Publicar requer autorização correspondente.

**Melhorias propostas:** fixar Node validado, usar `npm ci` e executar os checks relevantes no CI. A origem não define `engines`, `.nvmrc` ou `setup-node` no workflow.

## 10. Skills e competências de implementação

Não foram encontrados `SKILL.md` ou `AGENTS.md` no projeto de referência na busca local. Portanto, este documento não atribui skills instaladas ao portfólio e não é, por si só, um pacote de skill instalado.

As competências necessárias para executar o guia são:

| Competência | Resultado esperado |
|---|---|
| React e TypeScript | Componentes funcionais, props tipadas, hooks e efeitos coerentes |
| Arquitetura de frontend | Separação entre UI, estado, contratos e integração |
| Tailwind e UI local | Composição dos primitivos, variantes e responsividade |
| Integração HTTP | Serviços Axios e estados de requisição |
| Formulários | React Hook Form e schemas Zod quando necessários |
| Internacionalização | Chaves e textos completos quando houver idiomas |
| Acessibilidade | Semântica, labels, foco, teclado e mensagens compreensíveis |
| Qualidade | Build, lint, testes relevantes e verificação visual |

Se o ambiente oferecer skills reais, leia as instruções delas antes de usar e aplique somente as pertinentes ao trabalho. A disponibilidade de uma skill não altera a stack deste guia nem cria dependência do projeto. A criação de uma skill instalável é uma tarefa separada.

## 11. Roteiro para iniciar um projeto

1. Ler o briefing e este guia; consultar a origem quando houver dúvida de implementação.
2. Definir páginas, entidades, contrato de API, idiomas e módulos opcionais.
3. Criar o projeto sem conteúdo pessoal ou histórico Git da origem; selecionar dependências e configurações compatíveis com a base.
4. Configurar TypeScript, alias, Tailwind, UI local, scripts e ambiente de exemplo.
5. Implementar `main`, `App`, rotas e layout.
6. Definir DTOs, cliente, serviços e hooks dos recursos usados.
7. Compor as páginas e implementar estados de carregamento, erro, vazio e sucesso.
8. Implementar formulários, traduções e módulos opcionais selecionados.
9. Executar build, lint e testes relevantes; verificar a interface e corrigir problemas.
10. Documentar comandos, variáveis, decisões novas e limitações no README do novo projeto.

Critério de entrega: projeto executável, fluxo principal implementado, checks registrados, configuração reproduzível e ausência de conteúdo pessoal residual. Quando uma API ou outro recurso externo estiver indisponível, descreva precisamente quais comportamentos foram validados e quais permanecem dependentes dele.

## 12. Prompt reutilizável

```text
Crie o frontend descrito no briefing abaixo seguindo
GUIA_NOVOS_PROJETOS_PORTIFOLIO.md.

Use React + TypeScript + Vite e a arquitetura por camadas do guia.
Selecione apenas as bibliotecas e funcionalidades necessárias ao produto.
Consulte C:\Projeto\portifolio quando houver dúvida sobre o padrão original.
Distinga padrões existentes de melhorias e decisões novas.
Não copie conteúdo pessoal, endpoints do portfólio ou credenciais.
Implemente o fluxo principal, valide os checks pertinentes e documente
comandos, ambiente, decisões e limitações. Não publique sem autorização.

Briefing: [objetivo, público, páginas, funcionalidades e identidade visual]
API: [contrato fornecido, mocks necessários ou pontos pendentes]
Idiomas: [idioma único ou pt/en]
Destino: [pasta do novo projeto]
```

## 13. Fontes para conferir fidelidade

- Stack, scripts e testes: `package.json`, `package-lock.json`, `babel.config.cjs`, `setup-tests.js`.
- Inicialização e rotas: `src/main.tsx`, `src/App.tsx`, `src/routes.tsx`, `src/layout/Index.tsx`.
- Camadas de dados: `src/lib/api-client.ts`, `src/interface/api.types.ts`, `src/services/*`, `src/hooks/*`.
- UI e estilos: `components.json`, `src/components/ui/*`, `src/lib/utils.ts`, `tailwind.config.js`, `src/index.css`.
- Formulário: `src/components/form-contact/Index.tsx`.
- Idiomas: `src/i18.ts`, `src/assets/locales/pt.json`, `src/assets/locales/en.json`.
- Qualidade e build: `vite.config.ts`, `tsconfig*.json`, `eslint.config.js`.
- Publicação original: `.github/workflows/deploy.yml`, `vercel.json`, `web.config` e configurações em `public`.

Para inventário completo e achados detalhados, consulte `ANALISE_TECNICA_PORTIFOLIO.md`. Este guia orienta novos projetos; o relatório registra a implementação original.
