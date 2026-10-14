# Plano de Implementação: Protótipo de Alta Fidelidade M_I Store Gestão

> **Para agentes executores:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recomendado) ou superpowers:executing-plans para implementar este plano tarefa por tarefa. Cada passo usa sintaxe de checkbox (`- [ ]`) para rastreamento.

**Objetivo:** Construir um protótipo navegável de alta fidelidade para o sistema "M_I Store Gestão", cobrindo o Catálogo Público (mobile-first, sob encomenda com envio de pedido via WhatsApp) e o Painel Administrativo Privado para a proprietária Edvania (Dashboard Operacional "Hoje", Solicitações, Vendas, Compra Semanal em João Pessoa por Fornecedor, Cadastro de Produtos/Fornecedores/Clientes, Fiados e A Receber com pagamentos parciais, Entregas/Retiradas, Financeiro e Configurações modulares).

**Arquitetura:** Aplicação Web moderna desenvolvida com React + Vite + Vanilla CSS Tokens (Design System refinado, feminino, profissional e sem poluição visual). Estado global e reativo sincronizado com `localStorage` permitindo fluxo interativo de ponta a ponta (adicionar no carrinho -> gerar solicitação -> confirmar no admin -> enviar para compra da semana -> marcar comprado com ajuste de custo real -> registrar entrega e pagamentos parciais/fiado -> ver atualização instantânea no financeiro e dashboard).

**Tech Stack:** React 18/19, Vite, Lucide Icons (`lucide-react`), Vanilla CSS com Custom Properties (Design System corporativo/feminino elegante).

**Spec:** Especificação completa fornecida na solicitação inicial do usuário (Seções 1 a 30).

---

## Restrições Globais

- **Sem backend real:** Nenhum banco de dados real, Supabase, gateway de pagamento ou API oficial de WhatsApp.
- **Persistência LocalStorage:** Todos os dados (produtos, solicitações, vendas, compra da semana, fornecedores, clientes, pagamentos, configurações) devem iniciar pré-carregados com mocks ricos e persistir em `localStorage`, com botão discreto no rodapé do Admin para "Restaurar Dados de Exemplo".
- **Design System:** Paleta elegante e feminina profissional (tons neutros quentes como alabaster/off-white `#FDFBF9`, rosé sutil e sofisticado `#9E4D68`, bordô/berry suave `#78354A`, grafite profundo para tipografia `#1E2022`, oliva/menta para sucesso `#2E7D5A`, âmbar para pendências `#C0761A`). Sem templates SaaS genéricos, sem cards repetitivos de KPI sem propósito, sem glassmorphism exagerado.
- **Experiência Dupla com Alternador Ágil:** Alternador no topo/rodapé ("Ver Loja como Cliente" vs "Acessar Painel da Edvania") para que a apresentação seja fluida.
- **Responsividade:** Catálogo Público 100% mobile-first com bottom bar intuitiva; Painel Admin desktop-first, mas totalmente utilizável em celulares/tablets com gaveta (drawer) e tabelas adaptáveis.

---

## 1. Mapa de Navegação e Arquitetura de Telas

### A) Catálogo Público (Cliente - Mobile-First)
1. **Início do Catálogo (`/catalogo`):** Header com marca M_I Store, badge "Sob Encomenda", busca em tempo real, chips de categorias (Calçados, Bolsas, Acessórios, Moda Festa, etc.), carrossel de destaques da semana, grid de produtos com badges de variações, botão flutuante de carrinho com contador e botão direto de WhatsApp.
2. **Visualização / Modal de Produto:** Galeria de fotos, seleção de variações (tamanho, cor), indicação de prazo de encomenda semanal (ex: "Encomendas até quarta, compras quinta"), descrição, seletor de quantidade e CTA "Adicionar ao Pedido".
3. **Carrinho / Minha Encomenda (Drawer / Tela dedicada):** Lista de itens selecionados com variações e subtotal, formulário simples do cliente (Nome, WhatsApp, Cidade/Bairro, Observação), opção de Entrega ou Retirada.
4. **Finalização e Modal WhatsApp:** Resumo com código gerado (ex: `#MI-1042`), mensagem pré-formatada para WhatsApp com link `https://wa.me/` e botão de simulação para Edvania testar o fluxo. A solicitação é injetada automaticamente no Painel da Edvania!

### B) Painel Administrativo (Edvania)
1. **Login Simulado (`/admin/login`):** Tela de boas-vindas personalizada para Edvania com acesso com 1 clique ("Entrar no Painel").
2. **Dashboard Operacional (`/admin`):**
   - Bloco "Hoje": Tarefas acionáveis (Solicitações pendentes, Itens para comprar, Pedidos prontos para entrega, Cobranças pendentes).
   - Card "Próxima Compra em João Pessoa": Data da viagem, qtd de itens, fornecedores a visitar, custo estimado, lucro previsto.
   - Resumo Financeiro Real vs Previsto (Vendido, Recebido na mão, A Receber/Fiado, Custo Previsto, Lucro).
   - Atalhos operacionais diretos.
3. **Solicitações de Pedido (`/admin/solicitacoes`):**
   - Lista filtrável (Novas, Aguardando Resposta, Confirmadas, Canceladas).
   - Drawer de Detalhes da Solicitação: Itens, dados do cliente, botão "Conversar no WhatsApp", "Confirmar Venda" (com modal de registro de entrada/forma de entrega) e "Cancelar Solicitação" (com motivo: cliente desistiu, indisponível, etc.).
4. **Vendas (`/admin/vendas`):**
   - Gestão de pedidos confirmados com status operacional: Confirmada -> Aguardando Compra -> Comprada -> Produto Disponível -> Aguardando Entrega -> Entregue -> Finalizada.
   - Detalhes da venda, histórico de pagamentos, registro de novos recebimentos (Pix, Dinheiro, Cartão), controle de saldo em aberto.
5. **Compra da Semana em João Pessoa (`/admin/compra-semana`) - [TELA CHAVE]:**
   - Cabeçalho com métricas da viagem (Data, Fornecedores a visitar, Total de itens, Custo estimado vs Custo real, Lucro projetado).
   - Agrupamento inteligente por Fornecedor (ex: JP Calçados, Bella Atacado, Moda Center JP, Mix Importados).
   - Checklist interativo por item com foto, tamanho, cor, cliente destinatário e status:
     - "Comprado" (com campo para digitar Custo Real caso tenha mudado)
     - "Não Encontrado"
     - "Preço Alterado"
     - "Substituído"
   - Recálculo em tempo real do custo da viagem e do lucro líquido.
6. **Fornecedores (`/admin/fornecedores`):**
   - Cadastro e lista de fornecedores de João Pessoa (nome, telefone/WhatsApp, endereço/box/galeria, observações, produtos habituais).
   - Histórico de preços pagos por fornecedor.
7. **Produtos / Catálogo (`/admin/produtos`):**
   - Listagem com busca, filtro por categoria, status (Ativo no catálogo, Oculto, Arquivado).
   - Cadastro/Edição de produto: Nome, fotos (URLs prontas de alta qualidade), categoria, preço de venda, custo estimado, tamanhos, cores, fornecedor preferencial e alternativos, visibilidade.
   - Preview ao vivo em mockup de celular.
8. **Clientes (`/admin/clientes`):**
   - Listagem com destaque visual para quem possui saldo em aberto (fiado/pendente).
   - Perfil 360º do cliente: histórico de compras, valores totais comprados, valores pagos, saldo devedor atual, endereço/referência de entrega.
9. **A Receber & Fiados (`/admin/a-receber`):**
   - Visão humanizada e direta de quem deve, quanto deve e desde quando.
   - Suporte a: Fiado integral, Entrada + Restante, Pagamentos parciais avulsos.
   - Modal rápido para "Registrar Pagamento" (abate o saldo instantaneamente e gera movimentação).
10. **Entregas e Retiradas (`/admin/entregas`):**
    - Abas: "Para Entregar" vs "Aguardando Retirada no Local".
    - Taxa de entrega separada do lucro dos produtos.
    - Ações para "Marcar como Entregue" ou "Retirado".
11. **Financeiro & Despesas (`/admin/financeiro`):**
    - Métricas claras: Vendido total vs Dinheiro Efetivamente Recebido; Lucro Previsto vs Lucro Realizado.
    - Registro de despesas da viagem (Combustível, Refeição, Frete/Passagem, Embalagens).
    - Extrato de movimentações diárias.
12. **Configurações (`/admin/configuracoes`):**
    - Seções modulares onde Edvania pode ligar/desligar funcionalidades (Habilitar/desabilitar Fiado, Vencimento, Taxas de cartão, Despesas, Formas de pagamento, Taxa de entrega fixa/manual).
13. **Relatórios (`/admin/relatorios`):**
    - Visão prática: Mais vendidos, Melhores clientes, Fornecedores mais recorrentes, Resumo mensal.

---

## 2. Design System & Identidade Visual (M_I Store)

- **Cores Primárias e Acentos:**
  - Background Base: `#FAF8F5` (off-white quente e acolhedor)
  - Superfícies/Cards: `#FFFFFF` com bordas sutis `#EAE4DC`
  - Primária (Marca M_I Store): `#853A52` (Vinho/Ameixa sofisticado, transmite feminilidade e solidez comercial)
  - Primária Hover: `#6E2D41`
  - Secundária Suave: `#F5EBEB` (Blush suave para fundos de destaque e tags ativas)
  - Destaque Ouro/Champagne: `#C89D5C` (para selos "Sob Encomenda" e novidades)
  - Texto Principal: `#231F20` (quase preto, contraste excelente)
  - Texto Secundário: `#6B6661` (médio neutro)
  - Sucesso: `#2E7D5A` (verde botânico)
  - Alerta/Fiado: `#C26725` (laranja queimado suave)
  - Info: `#286086` (azul acinzentado)
- **Tipografia:** `Plus Jakarta Sans` ou `Inter` com pesos 400, 500, 600, 700. Escala tipográfica nítida e confortável.
- **Componentes:** Badges com cantos arredondados sutis, botões com feedback de clique e toque, drawers com transição suave, modais focados, inputs acessíveis com labels claras.

---

## 3. Estrutura de Arquivos

```
src/
├── main.jsx
├── App.jsx
├── index.css
├── context/
│   └── AppContext.jsx          # Estado central sincronizado com LocalStorage
├── data/
│   ├── mockProducts.js         # 20 produtos reais de calçados, bolsas, vestidos e acessórios
│   ├── mockSuppliers.js        # 4 fornecedores de João Pessoa (JP Calçados, Bella Atacado, etc.)
│   ├── mockCustomers.js        # 10 clientes com perfis, endereços e saldos
│   ├── mockOrders.js           # 12 solicitações e 15 vendas cobrindo todos os cenários
│   ├── mockShoppingTrip.js     # Compra semanal com itens agrupados por fornecedor
│   └── mockSettings.js         # Configurações iniciais da loja
├── components/
│   ├── common/
│   │   ├── Badge.jsx
│   │   ├── Button.jsx
│   │   ├── Modal.jsx
│   │   ├── Drawer.jsx
│   │   ├── Toast.jsx
│   │   └── ViewSwitcher.jsx    # Barra superior para alternar facilmente entre Catálogo e Painel
│   ├── catalog/
│   │   ├── CatalogHeader.jsx
│   │   ├── ProductCard.jsx
│   │   ├── ProductModal.jsx
│   │   ├── CartDrawer.jsx
│   │   └── OrderSuccessModal.jsx
│   └── admin/
│       ├── AdminLayout.jsx
│       ├── AdminSidebar.jsx
│       ├── AdminHeader.jsx
│       ├── ActionCard.jsx
│       └── StatusBadge.jsx
├── pages/
│   ├── catalog/
│   │   └── CatalogPage.jsx
│   └── admin/
│       ├── LoginPage.jsx
│       ├── DashboardPage.jsx
│       ├── SolicitacoesPage.jsx
│       ├── VendasPage.jsx
│       ├── CompraSemanaPage.jsx
│       ├── ProdutosPage.jsx
│       ├── FornecedoresPage.jsx
│       ├── ClientesPage.jsx
│       ├── AReceberPage.jsx
│       ├── EntregasPage.jsx
│       ├── FinanceiroPage.jsx
│       ├── RelatoriosPage.jsx
│       └── ConfiguracoesPage.jsx
└── utils/
    ├── formatters.js           # Formatação de moeda BRL, data, telefone
    └── idGenerator.js          # Gerador de códigos (#MI-1042)
```

---

## 4. Tarefas de Implementação

### Tarefa 1: Setup do Projeto Vite + React + Lucide + Design System Base
- [x] Inicializar projeto Vite com template React.
- [x] Instalar `lucide-react`.
- [x] Configurar `index.css` com todas as variáveis CSS (Cores, Tipografia, Espaçamentos, Sombras, Transições).
- [x] Testar compilação limpa via `npm.cmd run build`.

### Tarefa 2: Mocks de Dados Ricos e Contexto Global com LocalStorage
- [x] Criar `mockProducts.js` (20 produtos com fotos autênticas do Unsplash de sapatos femininos, bolsas, vestidos, rasteirinhas, bijuterias com variações de cores e tamanhos).
- [x] Criar `mockSuppliers.js` (JP Calçados, Bella Atacado, Moda Center JP, Mix Importados com contatos e localização em JP).
- [x] Criar `mockCustomers.js` (Maria, Ana, Juliana, Carla, Patrícia, etc., com histórico e endereços em Cuité de Mamanguape / região).
- [x] Criar `mockOrders.js` e `mockShoppingTrip.js` com cenários variados (pago integral, entrada + fiado, compra pendente, entregue, etc.).
- [x] Implementar `AppContext.jsx` com ações completas:
  - `addCartItem`, `removeCartItem`, `submitOrderRequest`
  - `confirmOrderRequest`, `cancelOrderRequest`
  - `updateSaleStatus`, `recordPayment`
  - `updateShoppingItemStatus` (comprado, custo real, etc.)
  - `addProduct`, `updateProduct`, `toggleProductVisibility`
  - `addSupplier`, `addExpense`, `updateSettings`, `resetToDefaultData`

### Tarefa 3: Catálogo Público (Mobile-First)
- [x] Implementar `CatalogHeader.jsx` com logo M_I Store, badge de encomenda, busca rápida e botão do carrinho.
- [x] Implementar `ProductCard.jsx` e grid com filtro por categoria (Calçados, Bolsas, Acessórios, Looks).
- [x] Implementar `ProductModal.jsx` com galeria, seletor de tamanho/cor, quantidade e aviso transparente: "Produto sob encomenda — compras toda quinta em João Pessoa".
- [x] Implementar `CartDrawer.jsx` com resumo, dados do cliente e opção Entrega/Retirada.
- [x] Implementar `OrderSuccessModal.jsx` gerando `#MI-1042` e montando texto pronto para envio do WhatsApp + inserção direta na lista de solicitações do Admin!
- [x] Implementar `CatalogPage.jsx` com filtros dinâmicos, busca e barra flutuante mobile.

### Tarefa 4: Layout Admin e Autenticação Simulada
- [x] Implementar `LoginPage.jsx` elegante e acolhedor para Edvania.
- [x] Implementar `AdminLayout.jsx` com barra lateral colapsável, navegação limpa, cabeçalho com notificações e alternador rápido para ver o catálogo público.
- [x] Barra superior `ViewSwitcher.jsx` com botão "Restaurar Dados de Demonstração" e alternador ágil Catálogo / Painel.

### Tarefa 5: Dashboard Operacional "Hoje"
- [x] Bloco "Hoje": 4 cartões de ação prioritária com contadores reais (Solicitações pendentes, Compras da semana, Entregas prontas, Fiados vencendo).
- [x] Painel "Compra da Semana em João Pessoa": Próxima data, total de itens, custo estimado, lucro projetado e botão direto para abrir a lista.
- [x] Financeiro Resumido Operacional (Total Vendido, Recebido no Bolso, A Receber, Custo Mercadoria, Lucro Líquido Previsto).
- [x] Lista de Solicitações Recentes para ação imediata.

### Tarefa 6: Solicitações de Pedido & Gestão de Vendas
- [x] `SolicitacoesPage.jsx`: Listagem com filtros de status (Nova, Aguardando Resposta, Confirmada, Cancelada).
  - Modal de Detalhes: Itens pedidos, contato do cliente, botão WhatsApp.
  - Ação "Confirmar Venda": Permite definir se já houve entrada e envia diretamente para a lista de compras semanal.
  - Ação "Cancelar": Com seletor de motivo (cliente desistiu, fornecedor sem estoque, etc.).
- [x] `VendasPage.jsx`: Tabela/Cards das vendas confirmadas.
  - Linha do tempo visual do status: Confirmada -> Aguardando Compra -> Comprada -> Disponível -> Em Entrega -> Finalizada.
  - Botão para registrar pagamentos e ver saldo devedor.

### Tarefa 7: Compra da Semana em João Pessoa (Tela Especial)
- [x] `CompraSemanaPage.jsx`:
  - Visão geral da viagem semanal: data prevista, valor estimado a levar, lucro total das vendas ligadas.
  - Abas/Agrupamento por Fornecedor (JP Calçados, Bella Atacado, etc.).
  - Cards de produtos a comprar com foto, variação exata (tam/cor), cliente solicitante e preço previsto.
  - Botões de ação rápida: "Marcar Comprado", "Não Encontrado", "Alterar Preço" (com input para novo custo real).
  - Atualização automática do lucro quando o custo real varia!

### Tarefa 8: Fornecedores & Catálogo de Produtos (Admin)
- [x] `FornecedoresPage.jsx`: Lista de parceiros de JP, histórico de compras neles, telefones e notas.
- [x] `ProdutosPage.jsx`: Cadastro rápido de produtos, edição, alternador de "Mostrar no Catálogo" e preview interativo.

### Tarefa 9: Clientes, Fiados e Contas a Receber
- [x] `ClientesPage.jsx`: Lista de clientes com tags de saldo em aberto e histórico completo de pedidos.
- [x] `AReceberPage.jsx`: Visão humanizada de cobrança — quem deve, valor total, quanto já pagou, saldo restante, data de vencimento (se houver) e botão com 1 clique para "Registrar Pagamento" (Pix, Dinheiro, Cartão).

### Tarefa 10: Entregas, Financeiro & Despesas, Configurações e Relatórios
- [x] `EntregasPage.jsx`: Gestão de quem vai buscar na loja vs quem pediu entrega em casa (com taxa separada).
- [x] `FinanceiroPage.jsx`: Separação cristalina entre "Total Vendido" e "Dinheiro Efetivamente Recebido", registro de despesas da viagem (combustível, refeição, frete).
- [x] `ConfiguracoesPage.jsx`: Toggles para ligar/desligar fiado, vencimento, despesas, métodos de pagamento.
- [x] `RelatoriosPage.jsx`: Métricas essenciais e produtos mais vendidos.

### Tarefa 11: Validação de Navegabilidade, Responsividade e Polimento Visual
- [x] Testado build de produção via `npm.cmd run build` (0 erros, bundle gerado com sucesso).
- [x] Testado `node --check` em todos os arquivos `.js` (0 erros).
- [x] Servidor Vite rodando em `http://localhost:3000/`.
