# Hackathon — Frontend

Esqueleto baseado em GUIA_NOVOS_PROJETOS_PORTIFOLIO.md e na arquitetura de C:\Projeto\portifolio.
Sem regras de negócio, backend ou contrato de API definidos nesta etapa.

## Executar

Node 22.15.0 (também indicado em .nvmrc) e npm 10.9.2 foram usados para preparar a base.

```powershell
cd C:\Projeto\Hackaton_frontend
npm ci
npm run dev
```

Após a instalação inicial, basta executar npm run dev. Abra o endereço indicado pelo Vite.

## Verificar

- npm run lint: ESLint.
- npm run build: TypeScript e bundle de produção em dist.
- npm run preview: servir o build gerado localmente.

## Rotas de exemplo

- /: início.
- /exemplo-1: demonstração interativa de Button, Input e Label, sem API.
- /exemplo-2: outro texto de exemplo.
- Qualquer outra rota: página não encontrada.

## Estrutura

- src/pages: páginas; src/routes.tsx: rotas.
- src/layout: estrutura compartilhada com Outlet.
- src/components: cabeçalho, rodapé e futuros componentes; ui contém os primitivos locais Button, Input e Label.
- src/data: menu local tipado; src/interface: contratos TypeScript.
- src/hooks: reservado para estado e coordenação assíncrona.
- src/services: reservado para operações HTTP.
- src/lib: cliente Axios e utilitário cn.
- src/assets/img e public: reservados para recursos.

O fluxo futuro de dados deve seguir página/componente -> hook -> serviço -> cliente HTTP.
Não há chamadas à API nesta etapa. Quando o backend for definido, copie .env.example para .env.local
e preencha VITE_API_URL. Não coloque segredos em variáveis VITE_*.

## Decisões desta etapa

React 18, Vite 6, TypeScript 5.6, React Router 7, Tailwind 3, Axios e ESLint seguem a base do guia.
As dependências diretas foram fixadas nas versões resolvidas da referência.
O CSS usa fontes do sistema e um tema claro neutro, com apenas espaçamento e tipografia básica.
A rota de página não encontrada é uma melhoria prevista no guia.
O alias @/ está configurado em TypeScript e Vite. O alias de Vite usa import.meta.url em módulos ES.
components.json e os tokens CSS configuram o shadcn/ui. Button, Input e Label já foram adicionados como código local.
Idiomas, formulários, ícones, chat, carrossel, partículas e infraestrutura Jest ficam para etapas
que precisem desses recursos. Não há script de teste ou suíte de testes instalada nesta fase.
Nenhum conteúdo pessoal, destino de publicação ou endpoint de domínio do portfólio foi copiado.

## Retomar no hackathon

1. Registrar finalidade, público, regras de negócio e funcionalidades prioritárias.
2. Substituir as páginas de exemplo pelas páginas necessárias.
3. Definir contratos da API e implementar serviços e hooks.
4. Selecionar componentes de UI e dependências opcionais conforme a necessidade.
5. Validar os fluxos, executar lint e build e adicionar testes de comportamento relevantes.

Ao publicar futuramente, configurar o servidor para entregar index.html em rotas SPA.
A configuração de hospedagem ainda não foi definida.

## Tailwind CSS: instalação e funcionamento

Tailwind CSS **3.4.15** já está instalado como dependência de desenvolvimento.
As classes usadas nos arquivos TSX são detectadas durante o desenvolvimento e o build.
Não é necessário carregar Tailwind por CDN nem instalar algo além de npm ci.

O processamento segue este caminho:

1. src/main.tsx importa src/index.css.
2. src/index.css inclui as diretivas @tailwind base, components e utilities.
3. postcss.config.js executa os plugins tailwindcss e autoprefixer.
4. tailwind.config.js define os arquivos analisados, cores, raios e animações.
5. Vite serve o CSS em desenvolvimento e gera o arquivo final em dist no build.

A configuração analisa index.html e os arquivos HTML/JS/TS/JSX/TSX em src.
Use nomes completos de classes no código. Para valores condicionais, prefira um
mapeamento de classes completas em vez de construir nomes como bg- + cor + -500.

Exemplo de uso:

```tsx
<section className="space-y-4 rounded-md border border-border p-4">
  <h2 className="text-xl font-semibold">Título</h2>
  <p className="text-muted-foreground">Conteúdo da página.</p>
</section>
```

As cores semânticas (background, foreground, primary, muted, border etc.) vêm das
variáveis HSL em src/index.css. O mapeamento para as classes está em tailwind.config.js.
Para mudar a identidade visual, ajuste esses tokens em vez de alterar cada componente.
O projeto usa tema claro. A estratégia darkMode por classe está preparada na configuração,
mas não há alternador nem paleta escura definidos nesta etapa.
tailwindcss-animate fornece utilitários de animação; não há animações obrigatórias nas páginas.

## shadcn/ui: componentes locais

shadcn/ui fornece código de componentes que fica no próprio repositório.
Não há um pacote de runtime chamado shadcn instalado: os arquivos em src/components/ui
são os componentes reais e podem ser lidos, alterados e versionados pela equipe.
Não foi instalada uma CLI nesta etapa; os componentes foram reutilizados do portfólio
para preservar a compatibilidade com React 18 e Tailwind 3.

components.json registra estilo new-york, base zinc, TSX, rsc false,
variáveis CSS e aliases @/components, @/components/ui, @/lib e @/hooks.
O campo iconLibrary indica lucide como preferência de configuração; lucide-react
ainda não é dependência porque os três componentes adicionados não usam ícones.

### Componentes disponíveis

| Componente | Arquivo | Uso |
|---|---|---|
| Button | src/components/ui/button.tsx | Botões e links com variantes |
| Input | src/components/ui/input.tsx | Campo HTML input com estilos e suporte a ref |
| Label | src/components/ui/label.tsx | Rótulo acessível associado ao campo por htmlFor/id |

As dependências acrescentadas são @radix-ui/react-slot 1.1.1,
@radix-ui/react-label 2.1.1 e class-variance-authority 0.7.1.
Radix Slot permite compor Button com outro elemento usando asChild; Radix Label
fornece a base do rótulo. CVA define variantes e tamanhos de maneira tipada.
clsx e tailwind-merge já estavam instalados e são combinados pelo utilitário cn()
em src/lib/utils.ts para compor classes e resolver conflitos de utilitários.

### Exemplos de uso

```tsx
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function ExampleFields() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" name="name" placeholder="Digite seu nome" />
      </div>
      <Button type="button" variant="outline" size="sm">Exemplo</Button>
      <Button asChild>
        <Link to="/">Ir para o início</Link>
      </Button>
    </div>
  )
}
```

Button aceita variant: default, destructive, outline, secondary, ghost e link;
size: default, sm, lg e icon. Também aceita props HTML, como disabled e type.
Informe type="button" para ações que não devem submeter um formulário.
Com asChild, passe um único elemento filho apropriado e evite aninhar um botão em um link.
Input aceita props nativas como type, value, onChange, disabled e required.
Associe cada Input a um Label com o mesmo id/htmlFor; placeholder não substitui o rótulo.
Botões compostos apenas por ícones precisam de nome acessível.

A página /exemplo-1 usa os três componentes: o botão é habilitado quando há texto
e mostra o valor enviado em uma região de status. O estado é local, sem persistência
ou requisição HTTP. Digite um texto e pressione Enter ou clique em Mostrar texto para testar.

### Adaptações e como acrescentar componentes

Input foi adaptado para usar border, border-input e bg-background, evitando o fundo
escuro fixo do portfólio. As variantes do botão foram separadas em src/lib/button-variants.ts
para que button.tsx exporte apenas o componente e respeite a regra de Fast Refresh do ESLint.
Caso precise das classes do botão em outro lugar, importe buttonVariants desse arquivo.

Para acrescentar outro componente, consulte primeiro o código em C:\Projeto\portifolio\src\components\ui.
Copie apenas o necessário, confira suas dependências e mantenha os tokens e o alias @/.
Se usar a CLI do shadcn futuramente, confira a compatibilidade da versão e do registro
com Tailwind 3 e React 18 antes de gerar arquivos; a CLI não é necessária para executar o projeto.
Não migre automaticamente para Tailwind 4 nem sobrescreva configurações sem revisar as alterações.
Depois de qualquer inclusão, atualize este README, execute npm run lint e npm run build
e confira o componente no navegador. npm ci instala tudo que está registrado no lockfile.
