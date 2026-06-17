# Finance2Win CRM Interno - Demo Estática

Protótipo visual, navegável e interativo para demonstração do futuro CRM interno da Finance2Win.

Esta versão é exclusivamente uma demo estática. Não tem backend, autenticação real, base de dados, integração bancária, upload real, email real ou ferramentas de build.

## Como executar

Abrir diretamente o ficheiro `index.html` no navegador.

Não é necessário instalar dependências. Não existe `npm install`, `npm run build`, Vite, React, TypeScript ou Node.js no projeto.

## Ficheiros

- `index.html`: página base da aplicação.
- `styles.css`: layout, componentes visuais e responsividade.
- `app.js`: dados demo, router por hash, renderização das páginas e interações.
- `README.md`: documentação da demo.

## Dados demo

Os dados são fictícios e em português de Portugal:

- 12 clientes.
- 15 processos distribuídos por Contacto, Proposta, Contrato/APV e Encerrado.
- Propostas, contratos, documentos, contactos, submissões do website e auditoria relacionados.
- 6 utilizadores: António Marques, Ricardo Santos, Marta Oliveira, João Silva, Carla Ferreira e Sofia Almeida.

As alterações feitas na demo ficam guardadas no `localStorage` com as chaves:

- `f2w_demo_state`
- `f2w_demo_settings`

Na página `#/configuracoes`, separador `Dados da demonstração`, existe um botão para repor todos os dados fictícios.

## Rotas

- `#/login`
- `#/recuperar-password`
- `#/ativar-conta`
- `#/dashboard`
- `#/clientes`
- `#/clientes/novo`
- `#/clientes/:id`
- `#/clientes/:id/editar`
- `#/processos`
- `#/processos/pipeline`
- `#/processos/novo`
- `#/processos/:id`
- `#/processos/:id/editar`
- `#/contactos/novo`
- `#/contactos/:id`
- `#/contactos/:id/editar`
- `#/propostas`
- `#/propostas/nova`
- `#/propostas/:id`
- `#/propostas/:id/editar`
- `#/contratos`
- `#/contratos/novo`
- `#/contratos/:id`
- `#/contratos/:id/editar`
- `#/encerrados`
- `#/encerrados/:id`
- `#/utilizadores`
- `#/utilizadores/novo`
- `#/utilizadores/:id/editar`
- `#/perfis`
- `#/perfis/permissoes`
- `#/documentos`
- `#/documentos/novo`
- `#/documentos/:id`
- `#/website/configuracao`
- `#/website/submissoes`
- `#/importacoes/nova`
- `#/importacoes/mapear`
- `#/importacoes/validar`
- `#/importacoes/resultado`
- `#/relatorios`
- `#/relatorios/exportar`
- `#/auditoria`
- `#/perfil`
- `#/configuracoes`

## Funcionalidades simuladas

- Login, recuperação de password e ativação de conta.
- Dashboard com indicadores e gráficos simples.
- Pesquisa global por cliente, NIF, email, telefone, processo, proposta e contrato.
- Listas, filtros visuais, paginação visual e detalhes.
- Criar e editar clientes, processos, contactos, propostas, contratos, documentos e utilizadores.
- Aviso de NIF duplicado ao criar cliente.
- Pipeline Kanban com alteração de fase e histórico.
- Aprovação de proposta com modal, email simulado, toast e atualização do processo.
- Upload/link My Cloud simulado para documentos.
- Website e importação Excel/CSV simulados.
- Matriz de permissões clicável.
- Exportação CSV simples no navegador.
- Auditoria com drawer de detalhe.
- Configurações e reposição dos dados demo.

## Limitações

- Todos os dados são fictícios.
- Nenhuma integração apresentada está realmente ativa.
- Não há autenticação real.
- Não há validações de produção.
- Não há backend nem persistência fora do navegador local.
- O ficheiro CSV é gerado localmente apenas para demonstração.
