# Especificação de Design: Sistema Completo M_I Store Gestão

**Data:** 14/10/2026  
**Status:** Rascunho para Aprovação  
**Autores:** Victor Gabriel & Antigravity  
**Público-alvo:** Edvania (Proprietária da M_I Store)  
**Ambiente:** Protótipo navegável de alta fidelidade local (React 18 + Vite)

---

## 1. Intenção e o "Porquê"

A M_I Store é uma boutique de calçados, bolsas e moda feminina que opera em modelo híbrido e de encomendas semanais com viagens de compras a João Pessoa (PB). No dia a dia da Edvania, as vendas acontecem por conversa, WhatsApp e confiança pessoal, gerando quatro dores críticas:
1. **Anotações dispersas de encomendas:** Risco de esquecer tamanhos, cores ou clientes na hora de comprar nos boxes e galerias de JP.
2. **Descontrole de fiados e pagamentos parciais:** Clientes pagam metade no Pix, metade depois em dinheiro, ou compram no carnê/fiado sem controle centralizado do saldo devedor.
3. **Falta de clareza sobre o lucro da semana:** Dificuldade em saber quanto realmente sobrou no bolso após descontar o custo das mercadorias e as despesas da viagem.
4. **Separação de entregas e retiradas:** Confusão sobre quem vai buscar na loja e quem precisa receber em casa.

**Objetivo:** Entregar um sistema navegável completo, acolhedor e visualmente deslumbrante para apresentar à Edvania, permitindo que ela navegue por todas as telas e sinta imediatamente que o software resolve sua rotina real sem sobrecarregá-la.

---

## 2. Metas, Não-Metas e Anti-Metas

### Metas (O que o sistema deve cumprir)
- **Navegação 100% Funcional:** Todas as 12 abas do menu lateral ativas e clicáveis:
  1. **Início:** Panorama geral da semana, alertas do dia, atalhos rápidos e métricas reais.
  2. **Vendas:** Histórico e gestão de pedidos confirmados com linha do tempo de status (Aguardando Compra -> Comprada -> Disponível -> Entregue).
  3. **Solicitações:** Fila de pedidos recebidos para análise, confirmação ou recusa com envio de WhatsApp.
  4. **Compra da Semana:** Roteiro da viagem a João Pessoa agrupado por fornecedor, com checklist interativo de itens comprados e ajuste de custo real.
  5. **Entregas:** Gestão de pacotes para despachar em domicílio vs encomendas para retirada na loja.
  6. **Produtos:** Catálogo administrativo com preços de venda, custo previsto, tamanhos, cores e controle de visibilidade.
  7. **Categorias:** Organização das linhas (Calçados, Bolsas, Acessórios, Vestuário).
  8. **Clientes:** Ficha da cliente com histórico de compras e extrato de fiados em aberto.
  9. **Fornecedores:** Lista dos parceiros atacadistas de JP com contatos e localização.
  10. **Financeiro:** Extrato de entradas reais, saldo pendente a receber e despesas de viagem.
  11. **Relatórios:** Indicadores práticos de produtos mais vendidos e clientes fiéis.
  12. **Configurações:** Preferências da loja, prazos de viagem e botão de restaurar demonstração.
- **Identidade Visual Idêntica ao Início:** Todas as telas devem herdar rigorosamente os tokens visuais, paleta vinho (`#731A30`), tipografia, cantos arredondados, sombras suaves e cabeçalhos da tela de Início já aprovada.
- **Interatividade & Reatividade Ponta a Ponta:** Registrar uma nova venda ou abater um fiado atualiza instantaneamente a tela de Início, o Financeiro e o extrato da cliente, persistindo no `localStorage`.

### Não-Metas (Fora do escopo deste protótipo)
- Nenhum backend em nuvem, banco de dados PostgreSQL/Supabase ou API oficial de WhatsApp.
- Nenhum gateway de pagamento real (Stripe, Mercado Pago) ou emissão de nota fiscal.
- Nenhuma alteração da tela de Início já aprovada, exceto para conectar atalhos reais para as outras abas.

### Anti-Metas (O que arruinaria a apresentação)
- Telas com visual genérico de SaaS tecnológico cinza/frio que não combine com a elegância feminina da M_I Store.
- Tabelas cruas sem formatação de moeda brasileira (`R$ 0,00`), sem fotos de produtos ou sem badges coloridos de status.
- Cliques que resultem em avisos de "Em breve" ou páginas em branco durante a apresentação.

---

## 3. Diretrizes de Design & Identidade Visual

As novas telas devem replicar com perfeição o padrão estabelecido em `DashboardOverview.jsx` e `Sidebar.jsx`:
- **Cor Primária da Marca:** Vinho bordô profundo `#731A30` / `#853A52` para títulos, botões principais e itens ativos.
- **Fundo Base:** Off-white suave `#FAF8F5`, transmitindo acolhimento e sofisticação.
- **Cards e Superfícies:** Fundo branco `#FFFFFF` com bordas sutis em tom areia `#EAE4DC` e cantos arredondados de `12px` a `14px`.
- **Badges de Status:**
  - *Verde Botânico (`#2E7D5A` / `#EBF5F0`):* Pago, Comprado, Entregue, Ativo.
  - *Âmbar / Ferrugem (`#C26725` / `#FDF4ED`):* Fiado em aberto, Pagamento Parcial, Aguardando Compra.
  - *Vinho Blush (`#731A30` / `#F5EBEB`):* Destaques, Encomendas, Sob Medida.
  - *Cinza Neutro (`#6B6661` / `#F2EFEA`):* Cancelado, Inativo, Arquivado.
- **Estrutura Padrão de Cada Tela:**
  - **Header da Página:** Título claro (ex: "Compra da Semana em João Pessoa"), subtítulo amigável, badges de contagem e botão de ação principal (ex: `+ Anotar Pedido`).
  - **Barra de Ferramentas:** Campo de busca rápida com ícone de lupa, filtros em formato de chips/pills (ex: "Todos", "Aguardando", "Concluídos").
  - **Área Central:** Cards de resumo com métricas no topo + Tabela/Cards ricos de listagem com fotos reais de produtos.
  - **Interação Lateral / Modal:** Drawer lateral elegante ou modal suave para visualizar detalhes e registrar ações (ex: "Dar Baixa em Pagamento", "Marcar como Comprado").

---

## 4. Detalhamento de Cada Tela do Sistema

### 4.1 Início (`inicio`)
- Já existente (`DashboardOverview.jsx`).
- Conexão dos cards de ação e botões de atalho para navegar diretamente para as telas correspondentes (`vendas`, `compra-semana`, `a-receber`, etc.).

### 4.2 Vendas & Pedidos (`vendas`)
- **Objetivo:** Visualizar todas as vendas confirmadas da loja e seu ciclo de vida.
- **Barra Superior:** Busca por cliente ou código (#MI-1042), filtro por status (Todas, Aguardando Compra, Compradas, Prontas para Entrega, Finalizadas) e botão `+ Anotar Nova Venda`.
- **Listagem Rica:** Foto miniatura dos itens, nome da cliente, data, valor total, forma de pagamento (ex: "Pix - Entrada R$ 50 + Fiado R$ 70") e badge visual de status do pedido.
- **Modal de Detalhes:** Abertura ao clicar na venda com resumo dos itens, histórico de pagamentos e botão para registrar novo pagamento ou atualizar status.

### 4.3 Solicitações de Pedido (`solicitacoes`)
- **Objetivo:** Fila de pedidos que chegaram pelo catálogo público ou WhatsApp e aguardam confirmação da Edvania.
- **Ações Rápidas por Solicitação:**
  - Botão "Confirmar Pedido" (converte em Venda e lança na lista de compras de JP).
  - Botão "Falar no WhatsApp" (abre link formatado wa.me com mensagem simpática).
  - Botão "Recusar / Indisponível" (com justificativa amigável).

### 4.4 Compra da Semana em João Pessoa (`compra-semana`) [TELA ESTRELA]
- **Objetivo:** O companheiro da Edvania no dia da viagem a João Pessoa.
- **Painel de Cabeçalho da Viagem:** Data da próxima viagem (quinta-feira), total de peças a comprar, valor estimado a levar em dinheiro/Pix e lucro projetado.
- **Agrupamento Inteligente por Fornecedor:** Abas ou blocos divididos por fornecedor de JP (ex: *JP Calçados*, *Bella Atacado*, *Moda Center JP*, *Mix Importados*).
- **Cards de Itens para Compra:** Foto do calçado/bolsa, cliente solicitante, modelo, tamanho, cor e custo estimado.
- **Ações com 1 Clique:**
  - Checkbox "Comprado" (com opção de ajustar o custo real caso o fornecedor tenha cobrado diferente).
  - Botão "Não Encontrado".
  - Recálculo dinâmico e em tempo real do custo total da viagem!

### 4.5 Entregas & Retiradas (`entregas`)
- **Objetivo:** Organizar a expedição dos pacotes após o retorno da viagem de compras.
- **Divisão em 2 Abas Claras:**
  - *Para Entregar em Domicílio:* Lista com endereço da cliente, taxa de entrega e botão "Marcar como Entregue".
  - *Aguardando Retirada na Loja:* Lista de clientes avisadas que o produto chegou, com botão "Registrar Retirada".

### 4.6 Produtos & Catálogo (`produtos`)
- **Objetivo:** Gestão dos sapatos, bolsas e looks que a loja oferece.
- **Recursos:** Grid e tabela com fotos reais, categoria, tamanhos disponíveis, cores, preço de venda e custo previsto.
- **Ações:** Alternador visual "Exibir na Loja", botão `+ Novo Produto` e modal de edição rápida.

### 4.7 Categorias (`categorias`)
- **Objetivo:** Organização visual das linhas de produtos (Calçados, Bolsas, Moda Festa, Acessórios) com contagem de produtos vinculados e botão para adicionar/reordenar.

### 4.8 Clientes (`clientes`)
- **Objetivo:** Conhecer cada cliente pelo nome e histórico.
- **Listagem com Destaques:** Nome, telefone WhatsApp, endereço/bairro e indicador visual destacado se possui saldo em aberto.
- **Drawer de Perfil 360°:** Histórico de compras da cliente, total acumulado já gasto e extrato das compras fiadas.

### 4.9 Fornecedores (`fornecedores`)
- **Objetivo:** Agenda dos parceiros de confiança em João Pessoa.
- **Cards de Fornecedores:** Nome da loja/box, localização (galeria/endereço em JP), WhatsApp para contato rápido e produtos habitualmente comprados neles.

### 4.10 Financeiro & Fiados (`financeiro`)
- **Objetivo:** Clareza absoluta do dinheiro da Edvania.
- **3 Blocos Principais:**
  1. *Recebimentos & Caixa:* Total vendido vs Dinheiro efetivamente em caixa (Pix/Dinheiro já recebidos).
  2. *Contas a Receber & Fiados:* Tabela direta de quem deve, valor pendente, data combinada e botão rápido `+ Abater Pagamento`.
  3. *Despesas da Viagem:* Registro simples de custos operacionais (combustível, refeição, frete).

### 4.11 Relatórios (`relatorios`)
- **Objetivo:** Informações que dão orgulho e orientam decisões.
- **Cards Visuais:** Calçados mais vendidos da temporada, melhores clientes do mês e faturamento total.

### 4.12 Configurações (`configuracoes`)
- **Objetivo:** Ajustes da loja e controle da demonstração.
- **Recursos:** Informações da loja (nome, WhatsApp comercial, cidade de atendimento), taxa padrão de entrega e botão de destaque: **"Restaurar Dados de Demonstração"** (reseta os mocks para a apresentação começar sempre perfeita).

---

## 5. Arquitetura Técnica & Transição de Estado

- **Gerenciador de Telas em `App.jsx`:**
  - Substituição da trava `onSelectSoon` por um estado reativo `activeTab` que renderiza o componente da tela selecionada.
  - Topbar atualizada para exibir o título da tela ativa e manter os atalhos funcionais.
- **Contexto Centralizado (`AppContext`):**
  - Todas as telas consom e emitem eventos para o estado global já preparado com sincronização em `localStorage`.
- **Qualidade de Código & Verificação:**
  - `node --check` em cada arquivo `.js` / `.jsx`.
  - Build limpo com `npm.cmd run build` sem avisos ou erros.
  - Layout testado e validado em desktop e em viewport mobile (390px).

---

## 6. Decisões do Executor (Builder Calls)
- **Aproveitamento e Refinamento de Código:** Os componentes existentes em `src/pages/admin/` e `src/components/admin/` serão elevados e estilizados para usar exatamente o mesmo design system de `DashboardOverview.jsx` (mesmos cards, fontes, bordas e paleta `#731A30`).
- **Alternador Rápido:** Será mantido na Topbar ou Rodapé um botão sutil para ver o "Catálogo da Cliente" (Mobile), permitindo à Edvania ver a visão que a cliente dela teria ao pedir pelo WhatsApp.
- **Modais e Drawers de Ação:** Formulários rápidos como "Anotar Venda", "Abater Pagamento" e "Registrar Compra" abrirão em modais suaves com animação leve, garantindo que a Edvania não se perca trocando de página desnecessariamente.
- **Restauração de Demonstração em 1 Clique:** Um botão claro na tela de Configurações e no banner superior permitirá reiniciar os dados para o estado inicial a qualquer momento antes ou depois de demonstrar para ela.

## 7. O que Fica a Critério do Executor
- Ajuste fino dos textos de ajuda e placeholders amigáveis.
- Escolha dos ícones Lucide específicos para cada ação secundária.
- Transições sutis de fade/slide entre as abas.

