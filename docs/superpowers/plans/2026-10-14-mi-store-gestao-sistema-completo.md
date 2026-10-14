# Plano de Implementação: Sistema Completo M_I Store Gestão

> **Para agentes executores:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recomendado) ou superpowers:executing-plans para implementar este plano tarefa por tarefa. Cada passo usa sintaxe de checkbox (`- [ ]`) para rastreamento.

**Goal:** Construir e integrar todas as 12 telas do Painel de Gestão da M_I Store no protótipo navegável de alta fidelidade para apresentação à Edvania, seguindo com exatidão a identidade visual aprovada da tela de Início e as referências visuais documentadas no Obsidian.

**Architecture:** Aplicação React 18 + Vite com navegação reativa por abas gerenciada em `App.jsx`, consumindo o estado global sincronizado em `localStorage` via `AppContext.jsx`. Cada tela encapsula sua lógica e interface em componentes dedicados sob `src/pages/admin/`, utilizando tokens CSS unificados de cores (vinho `#731A30`, off-white `#FAF8F5`, areia `#EAE4DC`, verde `#2E7D5A`, âmbar `#C26725`), cards ricos, modais leves de ação e tabelas responsivas.

**Tech Stack:** React 18, Vite 5, Lucide Icons (`lucide-react`), Vanilla CSS (Tokens de Design System corporativo e feminino refinado).

**Spec:** [docs/superpowers/specs/2026-10-14-mi-store-gestao-sistema-completo-design.md](file:///c:/Users/GABRI/Downloads/PROTOTIPO%20MI%20STORE/docs/superpowers/specs/2026-10-14-mi-store-gestao-sistema-completo-design.md)  
**Referências Visuais:** `C:\Users\GABRI\OneDrive\Documentos\Obsidian Vault\01 Projetos\07 M_I Store Gestão\03 - Referências Visuais\Painel de Gestão\referencias-painel-gestao.html`

## Global Constraints

- Todas as 12 abas do menu lateral devem ser clicáveis e renderizar sua respectiva tela: `inicio`, `vendas`, `solicitacoes`, `compra-semana`, `entregas`, `produtos`, `categorias`, `clientes`, `fornecedores`, `financeiro`, `relatorios`, `configuracoes`.
- Nenhuma dependência externa adicional de UI ou backend pode ser instalada; usar `lucide-react` e Vanilla CSS já configurados.
- Paleta visual deve seguir rigorosamente: Primária Vinho `#731A30` / `#853A52`, Fundo `#FAF8F5`, Superfícies `#FFFFFF`, Bordas `#EAE4DC`, Verde `#2E7D5A`, Âmbar `#C26725`.
- Todos os dados devem operar localmente com persistência em `localStorage` e opção de restauração instantânea ("Restaurar Demonstração").
- `node --check` em cada arquivo `.js` alterado e build limpo verificado via `npm.cmd run build`.

## Review Focus

1. **Troca de abas sem perda de estado:** Navegar entre Início, Vendas e Compra da Semana deve manter as alterações feitas na sessão (ex: itens marcados como comprados ou baixas de pagamentos).
2. **Formatação de Moeda Brasileira (BRL):** Todos os valores monetários devem exibir prefixo `R$` e duas casas decimais com vírgula (`R$ 150,00`).
3. **Registro e Abatimento de Fiados:** Abater R$ 50 de um saldo devedor de R$ 120 deve atualizar imediatamente o saldo da cliente para R$ 70 e registrar a entrada de R$ 50 no caixa do Financeiro.
4. **Compra da Semana em João Pessoa:** Alterar o custo real de um item comprado deve recalcular instantaneamente o custo total da viagem e o lucro previsto.
5. **Responsividade em Tela Estreita (Mobile 390px):** Nenhuma tabela ou card deve estourar com rolagem horizontal indesejada no corpo da página; tabelas devem possuir scroll interno ou visualização em cartões.

---

### Tarefa 1: Shell de Navegação Reativo em `App.jsx`, `Sidebar.jsx` e `Topbar.jsx`

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/components/layout/Sidebar.jsx`
- Modify: `src/components/layout/Topbar.jsx`

**Interfaces:**
- Consumes: `AppContext` (`activeTab`, `setActiveTab`)
- Produces: `onNavigate(tabId)` compartilhado com Sidebar, Topbar e todas as páginas filhas.

- [ ] **Passo 1: Atualizar `Sidebar.jsx` para suportar navegação real em todas as 12 abas**
  Remover a trava `onSelectSoon` e invocar `onNavigate(item.id)` para os 12 itens do menu, mantendo o highlight visual ativo no item selecionado.

- [ ] **Passo 2: Atualizar `Topbar.jsx` para exibir o título da aba atual e atalho do Catálogo**
  Ajustar o título dinâmico da tela conforme a aba selecionada (ex: "Compra da Semana", "Vendas & Pedidos", "Financeiro") e incluir atalho "Ver Catálogo da Cliente".

- [ ] **Passo 3: Atualizar `App.jsx` com roteador declarativo de abas**
  Substituir a renderização fixa de `DashboardOverview` por um seletor que renderiza o componente da tela ativa (`inicio`, `vendas`, `solicitacoes`, `compra-semana`, `entregas`, `produtos`, `categorias`, `clientes`, `fornecedores`, `financeiro`, `relatorios`, `configuracoes`).

- [ ] **Passo 4: Verificar compilação e alternância de abas**
  Executar: `npm.cmd run build`  
  Esperado: Compilação bem-sucedida sem erros de JSX ou imports quebrados.

- [ ] **Passo 5: Commit do Shell de Navegação**
  ```bash
  git add src/App.jsx src/components/layout/Sidebar.jsx src/components/layout/Topbar.jsx
  git commit -m "feat: habilitar navegacao reativa para todas as abas do painel"
  ```

---

### Tarefa 2: Tela de Vendas & Pedidos (`vendas`)

**Files:**
- Create/Modify: `src/pages/admin/VendasPage.jsx`
- Test: Build local e validação visual

**Interfaces:**
- Consumes: `useApp()` (`sales`, `customers`, `addSale`, `updateSaleStatus`, `recordPayment`)
- Produces: Visualização de vendas confirmadas com filtros, métricas (confirmadas, recebido, em aberto), tabela/cards com fotos e modal "Anotar Nova Venda" e "Detalhes da Venda".

- [ ] **Passo 1: Estruturar layout e métricas conforme referência do Obsidian**
  Cards de topo: *Vendas Confirmadas*, *Total Recebido*, *Em Aberto (Fiados)*. Barra de busca por cliente/código e filtros rápidos de status e forma de pagamento.

- [ ] **Passo 2: Implementar listagem rica com fotos, status e dados de pagamento**
  Exibir para cada venda: código `#MI-xxxx`, foto miniatura do calçado/bolsa, cliente com link rápido de WhatsApp, data, valor total, detalhamento (ex: Pix R$ 50 + Fiado R$ 70) e badge de status com cores oficiais.

- [ ] **Passo 3: Implementar modal "Anotar Nova Venda"**
  Formulário acolhedor para selecionar cliente, produtos (com tamanho e cor), valor de venda, entrada em dinheiro/Pix (se houver) e definir se haverá entrega ou retirada.

- [ ] **Passo 4: Implementar modal "Detalhes da Venda & Baixa de Pagamento"**
  Visualização detalhada dos itens e botão para registrar recebimento de fiado com atualização imediata no saldo.

- [ ] **Passo 5: Verificar compilação**
  Executar: `npm.cmd run build`

- [ ] **Passo 6: Commit da Tela de Vendas**
  ```bash
  git add src/pages/admin/VendasPage.jsx
  git commit -m "feat: implementar tela de vendas com anotacao de pedidos e baixa de pagamentos"
  ```

---

### Tarefa 3: Tela de Solicitações de Pedido (`solicitacoes`)

**Files:**
- Create/Modify: `src/pages/admin/SolicitacoesPage.jsx`

**Interfaces:**
- Consumes: `useApp()` (`orderRequests`, `confirmOrderRequest`, `cancelOrderRequest`)
- Produces: Fila de solicitações pendentes com decisão explícita (Confirmar Venda / Recusar) e link formatado para WhatsApp.

- [ ] **Passo 1: Implementar filtros de fila e contadores de status**
  Filtros: *Pendentes* (badge âmbar), *Confirmadas* (verde), *Recusadas* e *Canceladas*.

- [ ] **Passo 2: Implementar lista/tabela de solicitações com fotos e variações**
  Exibir itens com foto, tamanho, cor, cliente, telefone, endereço/bairro e valor previsto.

- [ ] **Passo 3: Implementar ações "Confirmar Venda" e "Falar no WhatsApp"**
  - "Confirmar Venda": Transforma a solicitação em Venda confirmada e envia os itens automaticamente para a lista de Compra da Semana em JP!
  - "Falar no WhatsApp": Abre mensagem pré-formatada no `wa.me`.
  - "Recusar / Indisponível": Modal amigável com motivo da recusa.

- [ ] **Passo 4: Verificar compilação**
  Executar: `npm.cmd run build`

- [ ] **Passo 5: Commit da Tela de Solicitações**
  ```bash
  git add src/pages/admin/SolicitacoesPage.jsx
  git commit -m "feat: implementar fila de solicitacoes com confirmacao e integracao de compra"
  ```

---

### Tarefa 4: Tela de Compra da Semana em João Pessoa (`compra-semana`) [TELA ESTRELA]

**Files:**
- Create/Modify: `src/pages/admin/CompraSemanaPage.jsx`

**Interfaces:**
- Consumes: `useApp()` (`shoppingTrip`, `updateShoppingItemStatus`, `suppliers`)
- Produces: Roteiro da viagem de compras com agrupamento por fornecedor, checklist interativo com Custo Real e recálculo dinâmico de margem/lucro.

- [ ] **Passo 1: Painel de cabeçalho da viagem de João Pessoa**
  Métricas: *Data da Viagem (Toda Quinta)*, *Total de Peças*, *Custo Estimado a Levar*, *Lucro Projetado da Semana*.

- [ ] **Passo 2: Agrupamento inteligente por Fornecedor de JP**
  Abas/cards segmentados por fornecedor (JP Calçados, Bella Atacado, Moda Center JP, Mix Importados) com total de itens por loja.

- [ ] **Passo 3: Checklist interativo de compra com ajuste de custo real**
  Cada item exibe foto, cliente destinatário, modelo, tamanho, cor e custo estimado. Ações com 1 clique:
  - Checkbox "Comprado" (com campo inline para digitar o Custo Real pago).
  - Botão "Não Encontrado".
  - Recálculo em tempo real do custo da viagem e do lucro líquido no painel!

- [ ] **Passo 4: Verificar compilação**
  Executar: `npm.cmd run build`

- [ ] **Passo 5: Commit da Tela de Compra da Semana**
  ```bash
  git add src/pages/admin/CompraSemanaPage.jsx
  git commit -m "feat: implementar compra da semana por fornecedor com custo real e checklist interativo"
  ```

---

### Tarefa 5: Tela de Entregas & Retiradas (`entregas`)

**Files:**
- Create/Modify: `src/pages/admin/EntregasPage.jsx`

**Interfaces:**
- Consumes: `useApp()` (`sales`, `updateSaleStatus`)
- Produces: Fila de expedição separada entre entregas em domicílio e retiradas na loja.

- [ ] **Passo 1: Estruturar cabeçalho e abas "Para Entregar" vs "Aguardando Retirada"**
  Filtros por status de atendimento (Pendentes, Em rota, Concluídas).

- [ ] **Passo 2: Implementar lista de entregas com taxa e endereço**
  Card para cada cliente com itens do pacote, taxa de entrega separada do valor das peças e botão "Marcar como Entregue".

- [ ] **Passo 3: Implementar lista de encomendas para retirada na loja**
  Visualização das clientes já avisadas e botão direto "Registrar Retirada".

- [ ] **Passo 4: Verificar compilação**
  Executar: `npm.cmd run build`

- [ ] **Passo 5: Commit da Tela de Entregas**
  ```bash
  git add src/pages/admin/EntregasPage.jsx
  git commit -m "feat: implementar tela de entregas e retiradas com controle de expedicao"
  ```

---

### Tarefa 6: Telas de Produtos (`produtos`) & Categorias (`categorias`)

**Files:**
- Create/Modify: `src/pages/admin/ProdutosPage.jsx`
- Create/Modify: `src/pages/admin/CategoriasPage.jsx`

**Interfaces:**
- Consumes: `useApp()` (`products`, `addProduct`, `updateProduct`, `toggleProductVisibility`)
- Produces: Gestão de catálogo com fotos, variações, preço público vs custo interno, e organização de categorias.

- [ ] **Passo 1: Implementar `ProdutosPage.jsx` com catálogo interno rico**
  Cards de topo (Cadastrados, Publicados, Rascunhos). Tabela/Grid de produtos com busca, filtro de categoria e toggle "Exibir na Loja". Modal "+ Cadastrar Produto".

- [ ] **Passo 2: Implementar `CategoriasPage.jsx` conforme referência visual do Obsidian**
  Grid de cartões de categorias (Calçados, Bolsas, Acessórios, Vestuário), contagem de produtos vinculados, status ativo e botão "+ Nova Categoria".

- [ ] **Passo 3: Verificar compilação**
  Executar: `npm.cmd run build`

- [ ] **Passo 4: Commit de Produtos e Categorias**
  ```bash
  git add src/pages/admin/ProdutosPage.jsx src/pages/admin/CategoriasPage.jsx
  git commit -m "feat: implementar telas de produtos e categorias com gestao de visibilidade"
  ```

---

### Tarefa 7: Telas de Clientes (`clientes`) & Fornecedores (`fornecedores`)

**Files:**
- Create/Modify: `src/pages/admin/ClientesPage.jsx`
- Create/Modify: `src/pages/admin/FornecedoresPage.jsx`

**Interfaces:**
- Consumes: `useApp()` (`customers`, `suppliers`, `addCustomer`, `addSupplier`)
- Produces: Perfil 360° da cliente com extrato de fiados e agenda de parceiros de João Pessoa.

- [ ] **Passo 1: Implementar `ClientesPage.jsx` com destaque para saldos devedores**
  Listagem de clientes com busca, filtro "Com saldo em aberto", valor total comprado e saldo devedor atual com badge âmbar. Drawer de perfil da cliente com histórico de compras e fiados.

- [ ] **Passo 2: Implementar `FornecedoresPage.jsx` com parceiros de JP**
  Cards dos fornecedores de João Pessoa com telefone WhatsApp, localização física (box/galeria em JP), produtos habituais e observações internas.

- [ ] **Passo 3: Verificar compilação**
  Executar: `npm.cmd run build`

- [ ] **Passo 4: Commit de Clientes e Fornecedores**
  ```bash
  git add src/pages/admin/ClientesPage.jsx src/pages/admin/FornecedoresPage.jsx
  git commit -m "feat: implementar telas de clientes e fornecedores com historico e fiados"
  ```

---

### Tarefa 8: Telas de Financeiro (`financeiro`), Relatórios (`relatorios`) & Configurações (`configuracoes`)

**Files:**
- Create/Modify: `src/pages/admin/FinanceiroPage.jsx`
- Create/Modify: `src/pages/admin/RelatoriosPage.jsx`
- Create/Modify: `src/pages/admin/ConfiguracoesPage.jsx`

**Interfaces:**
- Consumes: `useApp()` (`sales`, `expenses`, `addExpense`, `recordPayment`, `resetToDefaultData`)
- Produces: Fluxo financeiro (caixa real vs fiados), relatórios essenciais e configurações com botão de reset da demo.

- [ ] **Passo 1: Implementar `FinanceiroPage.jsx` com divisão Recebimentos vs Despesas**
  - Bloco Recebimentos: Vendas pagas, parciais e a receber, com botão rápido "+ Abater Pagamento".
  - Bloco Despesas: Registro de despesas da viagem a JP (combustível, frete, refeição) e saldo líquido.

- [ ] **Passo 2: Implementar `RelatoriosPage.jsx` conforme referência do Obsidian**
  4 cards executivos, gráfico de evolução e indicadores de mais vendidos e clientes mais recorrentes.

- [ ] **Passo 3: Implementar `ConfiguracoesPage.jsx` com "Restaurar Demonstração"**
  Configurações da loja e botão de destaque para restaurar dados de exemplo a qualquer momento.

- [ ] **Passo 4: Verificar compilação**
  Executar: `npm.cmd run build`

- [ ] **Passo 5: Commit de Financeiro, Relatórios e Configurações**
  ```bash
  git add src/pages/admin/FinanceiroPage.jsx src/pages/admin/RelatoriosPage.jsx src/pages/admin/ConfiguracoesPage.jsx
  git commit -m "feat: implementar financeiro, relatorios e configuracoes com restauracao da demo"
  ```

---

### Tarefa 9: Conexão dos Atalhos do Início e Modal do Catálogo da Cliente

**Files:**
- Modify: `src/pages/dashboard/DashboardOverview.jsx`
- Modify: `src/components/layout/Topbar.jsx`
- Modify: `src/pages/catalog/CatalogPage.jsx`

**Interfaces:**
- Consumes: `onNavigate(tabId)`
- Produces: Interatividade total entre a tela de Início, as telas operacionais e a visão da cliente.

- [ ] **Passo 1: Conectar todos os botões e cards de `DashboardOverview.jsx` às abas reais**
  Substituir os handlers temporários para navegar diretamente para `vendas`, `compra-semana`, `solicitacoes`, `financeiro`, `entregas`.

- [ ] **Passo 2: Integrar o botão "Ver Catálogo da Cliente" na Topbar**
  Permitir alternar com 1 clique para ver como a cliente enxerga os calçados e bolsas no celular.

- [ ] **Passo 3: Verificar compilação e navegação cruzada**
  Executar: `npm.cmd run build`

- [ ] **Passo 4: Commit da Interligação e Catálogo**
  ```bash
  git add src/pages/dashboard/DashboardOverview.jsx src/components/layout/Topbar.jsx src/pages/catalog/CatalogPage.jsx
  git commit -m "feat: conectar atalhos do dashboard as telas operacionais e catalogo da cliente"
  ```

---

### Tarefa 10: Validação Visual, Testes de Viewport e Polimento Final

**Files:**
- Verify: Todas as rotas e componentes
- Test: Build de produção e verificação no navegador

- [ ] **Passo 1: Executar verificação estática com `node --check` em todos os `.js`**
- [ ] **Passo 2: Executar build de produção com `npm.cmd run build`**
- [ ] **Passo 3: Validar visualmente todas as 12 abas em viewport desktop e mobile (390px)**
- [ ] **Passo 4: Commit final de entrega**
  ```bash
  git add .
  git commit -m "chore: finalizacao e polimento completo do prototipo MI Store Gestao"
  ```
