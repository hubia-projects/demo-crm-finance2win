(function () {
  "use strict";

  const STORAGE_KEY = "f2w_demo_state";
  const SETTINGS_KEY = "f2w_demo_settings";
  const phases = ["Contacto", "Proposta", "Contrato / APV", "Encerrado"];
  const statuses = [
    "Novo contacto",
    "Contactado",
    "Em recolha de dados",
    "Em análise",
    "Novos elementos",
    "Aprovada",
    "Recusada",
    "Contrato em preparação",
    "Contrato enviado",
    "Assinado",
    "Encerrado com contrato",
    "Encerrado sem contrato"
  ];
  const banks = ["Banco Atlântico", "Crédito Norte", "Financeira Lusitana", "Banco Central Auto", "Solução Crédito", "Banco Horizonte"];
  const vehicles = ["Renault Clio", "Peugeot 208", "Volkswagen Golf", "BMW Série 1", "Mercedes Classe A", "Toyota Corolla", "Nissan Qashqai", "Ford Focus", "Opel Corsa", "Seat Leon"];
  const products = ["Crédito automóvel", "Crédito pessoal", "Leasing", "Renting", "Consolidação"];

  let state = loadState();
  let settings = loadSettings();
  let currentTab = {};

  function defaultState() {
    const users = [
      { id: "u1", name: "António Marques", email: "antonio@finance2win.demo", role: "Administrador", status: "Ativo", lastAccess: "2026-06-16 17:42" },
      { id: "u2", name: "Ricardo Santos", email: "ricardo@finance2win.demo", role: "Gestor", status: "Ativo", lastAccess: "2026-06-16 16:10" },
      { id: "u3", name: "Marta Oliveira", email: "marta@finance2win.demo", role: "Comercial", status: "Ativo", lastAccess: "2026-06-17 09:05" },
      { id: "u4", name: "João Silva", email: "joao@finance2win.demo", role: "Comercial", status: "Ativo", lastAccess: "2026-06-17 08:55" },
      { id: "u5", name: "Carla Ferreira", email: "carla@finance2win.demo", role: "Back-office", status: "Ativo", lastAccess: "2026-06-15 15:20" },
      { id: "u6", name: "Sofia Almeida", email: "sofia@finance2win.demo", role: "Back-office", status: "Inativo", lastAccess: "2026-06-10 11:12" }
    ];
    const names = ["João Martins", "Ana Ribeiro", "Rui Ferreira", "Marta Lopes", "Carlos Almeida", "Sofia Carvalho", "Diogo Santos", "Patrícia Silva", "Miguel Rodrigues", "Catarina Costa", "Luís Fernandes", "Helena Moreira"];
    const clients = names.map((name, index) => ({
      id: `c${index + 1}`,
      name,
      nif: `99900${String(index + 1).padStart(4, "0")}`,
      phone: `91${(2300000 + index * 7123).toString().slice(0, 7)}`,
      email: name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, ".") + "@demo.pt",
      address: `Rua Demo ${index + 8}, Lisboa`,
      status: index % 5 === 0 ? "Inativo" : "Ativo",
      rgpd: index % 3 === 0 ? "Consentimento pendente" : "Consentimento registado",
      responsibleId: users[(index % 4) + 1].id,
      lastActivity: `2026-06-${String(3 + index).padStart(2, "0")}`,
      notes: "Dados fictícios para demonstração."
    }));
    const processData = [
      ["p1", "c1", "Contacto", "Novo contacto", 12800, "Banco Atlântico", "Crédito automóvel"],
      ["p2", "c2", "Contacto", "Contactado", 9200, "Crédito Norte", "Crédito pessoal"],
      ["p3", "c3", "Proposta", "Em análise", 18400, "Financeira Lusitana", "Crédito automóvel"],
      ["p4", "c4", "Proposta", "Novos elementos", 21300, "Banco Central Auto", "Leasing"],
      ["p5", "c5", "Proposta", "Aprovada", 15650, "Solução Crédito", "Crédito automóvel"],
      ["p6", "c6", "Proposta", "Recusada", 11000, "Banco Horizonte", "Consolidação"],
      ["p7", "c7", "Contrato / APV", "Contrato em preparação", 24800, "Banco Atlântico", "Renting"],
      ["p8", "c8", "Contrato / APV", "Contrato enviado", 19900, "Crédito Norte", "Crédito automóvel"],
      ["p9", "c9", "Contrato / APV", "Assinado", 17250, "Financeira Lusitana", "Crédito pessoal"],
      ["p10", "c10", "Encerrado", "Encerrado com contrato", 26500, "Banco Central Auto", "Leasing"],
      ["p11", "c11", "Encerrado", "Encerrado sem contrato", 7900, "Solução Crédito", "Crédito pessoal"],
      ["p12", "c12", "Contacto", "Em recolha de dados", 14300, "Banco Horizonte", "Crédito automóvel"],
      ["p13", "c1", "Proposta", "Em análise", 33200, "Banco Atlântico", "Leasing"],
      ["p14", "c3", "Contrato / APV", "Contrato em preparação", 22500, "Financeira Lusitana", "Renting"],
      ["p15", "c9", "Encerrado", "Encerrado com contrato", 12100, "Crédito Norte", "Crédito automóvel"]
    ];
    const processes = processData.map((p, index) => ({
      id: p[0],
      number: `F2W-2026-${String(index + 101).padStart(4, "0")}`,
      clientId: p[1],
      phase: p[2],
      status: p[3],
      amount: p[4],
      bank: p[5],
      product: p[6],
      vehicle: vehicles[index % vehicles.length],
      term: [36, 48, 60, 72, 84][index % 5],
      responsibleId: users[(index % 4) + 1].id,
      updatedAt: `2026-06-${String(2 + index).padStart(2, "0")}`,
      origin: index % 3 === 0 ? "Website" : "Contacto direto",
      closeReason: p[2] === "Encerrado" ? (p[3].includes("com") ? "Contrato concluído" : "Cliente sem interesse") : "",
      history: [
        { date: `2026-05-${String(10 + index).padStart(2, "0")}`, user: "Sistema demo", text: "Processo criado em ambiente de demonstração." },
        { date: `2026-06-${String(2 + index).padStart(2, "0")}`, user: users[(index % 4) + 1].name, text: `Estado atualizado para ${p[3]}.` }
      ]
    }));
    const proposals = processes.filter((p) => ["Proposta", "Contrato / APV", "Encerrado"].includes(p.phase)).slice(0, 10).map((p, index) => ({
      id: `pr${index + 1}`,
      number: `PROP-${String(index + 331).padStart(4, "0")}`,
      processId: p.id,
      clientId: p.clientId,
      bank: p.bank,
      modality: p.product,
      amount: p.amount,
      term: p.term,
      monthly: Math.round((p.amount / p.term) * 1.12),
      status: p.status === "Contrato em preparação" || p.status === "Contrato enviado" || p.status === "Assinado" || p.status.includes("Encerrado") ? "Aprovada" : p.status,
      notes: "Proposta fictícia para validação de fluxo."
    }));
    const contracts = processes.filter((p) => ["Contrato / APV", "Encerrado"].includes(p.phase)).slice(0, 7).map((p, index) => {
      const proposal = proposals.find((item) => item.processId === p.id);
      return {
        id: `ct${index + 1}`,
        number: `APV-${String(index + 71).padStart(4, "0")}`,
        processId: p.id,
        clientId: p.clientId,
        proposalId: proposal ? proposal.id : "",
        bank: p.bank,
        amount: p.amount,
        term: p.term,
        monthly: Math.round((p.amount / p.term) * 1.12),
        signatureType: index % 2 ? "Presencial" : "Digital simulada",
        location: index % 2 ? "Escritório Finance2Win" : "My Cloud",
        date: `2026-06-${String(8 + index).padStart(2, "0")}`,
        status: p.status.includes("Encerrado") ? "Concluído" : p.status
      };
    });
    const contacts = processes.slice(0, 10).map((p, index) => ({
      id: `i${index + 1}`,
      clientId: p.clientId,
      processId: p.id,
      type: ["Chamada", "Email", "Reunião", "Nota", "Tentativa sem resposta"][index % 5],
      userId: p.responsibleId,
      date: `2026-06-${String(5 + index).padStart(2, "0")} 10:${String(index * 5).padStart(2, "0")}`,
      result: index % 2 ? "Aguardar documentação" : "Cliente contactado",
      notes: "Interação fictícia registada para demonstração.",
      next: index % 2 ? "Enviar lembrete" : "Preparar proposta"
    }));
    const documents = processes.slice(0, 9).map((p, index) => ({
      id: `d${index + 1}`,
      name: ["Cartão de cidadão", "Comprovativo IBAN", "Declaração rendimentos", "Proposta assinada", "Ficha cliente", "Contrato APV", "Comprovativo morada", "Documento viatura", "Simulação banco"][index],
      category: ["Identificação", "Financeiro", "Contrato", "Viatura"][index % 4],
      clientId: p.clientId,
      processId: p.id,
      origin: index % 2 ? "My Cloud" : "Ficheiro interno",
      fileName: `demo-documento-${index + 1}.pdf`,
      date: `2026-06-${String(4 + index).padStart(2, "0")}`,
      responsibleId: p.responsibleId,
      description: "Metadados fictícios. Sem upload real."
    }));
    const websiteSubmissions = clients.slice(0, 8).map((c, index) => ({
      id: `w${index + 1}`,
      name: c.name,
      nif: c.nif,
      email: c.email,
      phone: c.phone,
      product: products[index % products.length],
      date: `2026-06-${String(9 + index).padStart(2, "0")}`,
      status: index % 4 === 0 ? "Possível duplicado" : "Convertida",
      clientCreated: index % 4 !== 0,
      processCreated: index % 3 !== 0,
      error: index === 6 ? "Telefone incompleto" : ""
    }));
    const auditLogs = [
      { id: "a1", date: "2026-06-17 09:12", user: "Marta Oliveira", action: "Criou processo", module: "Processos", record: "F2W-2026-0101", before: "-", after: "Novo contacto" },
      { id: "a2", date: "2026-06-17 09:40", user: "Ricardo Santos", action: "Alterou estado", module: "Propostas", record: "PROP-0333", before: "Em análise", after: "Aprovada" },
      { id: "a3", date: "2026-06-17 10:15", user: "Carla Ferreira", action: "Adicionou documento", module: "Documentos", record: "Contrato APV", before: "-", after: "My Cloud" },
      { id: "a4", date: "2026-06-17 11:05", user: "António Marques", action: "Atualizou permissões", module: "Perfis", record: "Comercial", before: "Exportar: não", after: "Exportar: sim" }
    ];
    return {
      session: false,
      clients,
      users,
      processes,
      proposals,
      contracts,
      contacts,
      documents,
      websiteSubmissions,
      auditLogs,
      permissions: defaultPermissions()
    };
  }

  function defaultPermissions() {
    const modules = ["Clientes", "Processos", "Propostas", "Contratos", "Documentos", "Relatórios", "Auditoria", "Configurações"];
    const roles = ["Administrador", "Gestor", "Comercial", "Back-office"];
    const output = {};
    modules.forEach((module) => {
      output[module] = {};
      roles.forEach((role) => {
        output[module][role] = role === "Administrador" || (role === "Gestor" && module !== "Configurações") || (role === "Comercial" && !["Auditoria", "Configurações"].includes(module)) || (role === "Back-office" && ["Clientes", "Processos", "Documentos"].includes(module));
      });
    });
    return output;
  }

  function defaultSettings() {
    return {
      company: "Finance2Win",
      senderName: "Finance2Win CRM Demo",
      senderEmail: "demo@finance2win.pt",
      approvalSubject: "Proposta aprovada - demonstração",
      emailTemplate: "Olá {{nome}}, a sua proposta foi aprovada. Esta é uma simulação.",
      myCloudUrl: "https://my-cloud.example/demo",
      websiteUrl: "https://finance2win.example/formulario",
      defaultResponsibleId: "u3"
    };
  }

  function loadState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultState();
    } catch (error) {
      console.warn("Estado demo inválido. A repor dados.", error);
      return defaultState();
    }
  }

  function loadSettings() {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      return stored ? JSON.parse(stored) : defaultSettings();
    } catch (error) {
      return defaultSettings();
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function saveSettings() {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  function resetDemo() {
    state = defaultState();
    settings = defaultSettings();
    saveState();
    saveSettings();
    toast("Dados de demonstração restaurados.");
    go("/dashboard");
  }

  function go(path) {
    window.location.hash = `#${path}`;
  }

  function path() {
    return (window.location.hash || "#/").replace(/^#/, "");
  }

  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
  }

  function money(value) {
    return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(Number(value || 0));
  }

  function client(id) { return state.clients.find((item) => item.id === id) || {}; }
  function user(id) { return state.users.find((item) => item.id === id) || {}; }
  function processItem(id) { return state.processes.find((item) => item.id === id) || {}; }
  function proposal(id) { return state.proposals.find((item) => item.id === id) || {}; }
  function contract(id) { return state.contracts.find((item) => item.id === id) || {}; }
  function contact(id) { return state.contacts.find((item) => item.id === id) || {}; }
  function documentItem(id) { return state.documents.find((item) => item.id === id) || {}; }

  function statusClass(status) {
    if (!status) return "neutral";
    if (/aprovada|assinado|conclu|com contrato|ativo/i.test(status)) return "success";
    if (/recusada|sem contrato|inativo|erro/i.test(status)) return "danger";
    if (/análise|elementos|preparação|pendente|duplicado/i.test(status)) return "warning";
    return "neutral";
  }

  function badge(text) {
    return `<span class="badge ${statusClass(text)}">${esc(text)}</span>`;
  }

  function pageHeader(title, description, actions = "") {
    return `<div class="page-header"><div><h1 class="page-title">${esc(title)}</h1><p class="page-desc">${esc(description)}</p></div><div class="actions">${actions}</div></div>`;
  }

  function button(label, href, extra = "") {
    return href ? `<a class="btn ${extra}" href="#${href}">${label}</a>` : `<button class="btn ${extra}" type="button">${label}</button>`;
  }

  function card(title, body, extra = "") {
    return `<section class="card ${extra}">${title ? `<h2 class="section-title">${esc(title)}</h2>` : ""}${body}</section>`;
  }

  function fields(values, spec) {
    return `<div class="form-grid">${spec.map((item) => {
      const value = values[item.name] ?? item.value ?? "";
      if (item.type === "textarea") {
        return `<div class="field ${item.full ? "full" : ""}"><label>${esc(item.label)}</label><textarea name="${esc(item.name)}">${esc(value)}</textarea></div>`;
      }
      if (item.type === "select") {
        return `<div class="field ${item.full ? "full" : ""}"><label>${esc(item.label)}</label><select name="${esc(item.name)}">${item.options.map((option) => `<option value="${esc(option.value ?? option)}" ${String(value) === String(option.value ?? option) ? "selected" : ""}>${esc(option.label ?? option)}</option>`).join("")}</select></div>`;
      }
      return `<div class="field ${item.full ? "full" : ""}"><label>${esc(item.label)}</label><input type="${esc(item.type || "text")}" name="${esc(item.name)}" value="${esc(value)}" ${item.required ? "required" : ""}></div>`;
    }).join("")}</div>`;
  }

  function dataTable(headers, rows, empty = "Sem resultados para apresentar.") {
    if (!rows.length) return `<div class="empty-state">${esc(empty)}</div>`;
    return `<div class="table-wrap"><table><thead><tr>${headers.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${rows.join("")}</tbody></table></div><div class="pagination"><span>${rows.length} registos nesta página</span><span>Página 1 de 1</span></div>`;
  }

  function filterBar(items) {
    return `<div class="card"><div class="filter-bar">${items.map((item) => {
      if (item.type === "select") {
        return `<div class="field"><label>${esc(item.label)}</label><select data-filter="${esc(item.name)}"><option value="">Todos</option>${item.options.map((option) => `<option>${esc(option)}</option>`).join("")}</select></div>`;
      }
      return `<div class="field"><label>${esc(item.label)}</label><input data-filter="${esc(item.name)}" placeholder="${esc(item.placeholder || "")}"></div>`;
    }).join("")}</div></div>`;
  }

  function shell(content, routePath) {
    return `<div class="app-shell ${settings.sidebarCollapsed ? "sidebar-collapsed" : ""}">
      ${sidebar(routePath)}
      <main class="main-area">
        ${topbar(routePath)}
        <section class="content">${content}</section>
      </main>
    </div>`;
  }

  function sidebar(routePath) {
    const groups = [
      ["Visão geral", [["◎", "Dashboard", "/dashboard"]]],
      ["Operação", [["◇", "Clientes", "/clientes"], ["▣", "Processos", "/processos"], ["▥", "Pipeline", "/processos/pipeline"], ["✉", "Contactos", "/contactos/novo"], ["₪", "Propostas", "/propostas"], ["§", "Contratos / APV", "/contratos"], ["✓", "Processos encerrados", "/encerrados"]]],
      ["Documentação e dados", [["□", "Documentos", "/documentos"], ["⌁", "Entradas do website", "/website/submissoes"], ["⇧", "Importação Excel/CSV", "/importacoes/nova"]]],
      ["Controlo", [["▤", "Relatórios", "/relatorios"], ["≡", "Auditoria", "/auditoria"]]],
      ["Administração", [["○", "Utilizadores", "/utilizadores"], ["◫", "Perfis e permissões", "/perfis"], ["⚙", "Configurações", "/configuracoes"]]]
    ];
    return `<aside class="sidebar">
      <div class="brand">
        <div class="brand-mark">F2W</div>
        <div class="brand-text"><div class="brand-title">Finance2Win</div><div class="brand-subtitle">CRM Interno</div></div>
        <button class="icon-btn" data-action="toggle-sidebar" title="Recolher/expandir">☰</button>
      </div>
      <nav>${groups.map(([label, links]) => `<div class="nav-group"><div class="nav-label">${esc(label)}</div>${links.map(([icon, text, href]) => {
        const active = routePath === href || (href !== "/dashboard" && routePath.startsWith(href + "/"));
        return `<a class="nav-link ${active ? "active" : ""}" href="#${href}"><span class="nav-icon">${icon}</span><span class="nav-text">${esc(text)}</span></a>`;
      }).join("")}</div>`).join("")}</nav>
      <div class="sidebar-footer"><a class="user-mini" href="#/perfil"><span class="avatar">AM</span><span class="user-text"><strong>António Marques</strong><br><small>Administrador demo</small></span></a></div>
    </aside>`;
  }

  function topbar(routePath) {
    return `<header class="topbar">
      <button class="icon-btn mobile-menu" data-action="mobile-sidebar" title="Menu">☰</button>
      <div class="breadcrumbs">${breadcrumb(routePath)}</div>
      <div class="global-search">
        <input id="global-search" placeholder="Pesquisar nome, NIF, email, telefone, processo ou proposta">
        <div id="search-results" class="search-results" hidden></div>
      </div>
      <a class="btn small" href="#/clientes/novo">+ Novo</a>
      <button class="btn small secondary" type="button" data-action="notify">Notificações</button>
      <span class="demo-pill">Modo demonstração</span>
    </header>`;
  }

  function breadcrumb(routePath) {
    const parts = routePath.split("/").filter(Boolean);
    if (!parts.length) return "Finance2Win";
    return ["Finance2Win"].concat(parts.map((part) => part.replace(/-/g, " "))).join(" / ");
  }

  function authLayout(title, description, body) {
    return `<main class="auth-page"><section class="auth-card"><h1 class="auth-logo">Finance2Win</h1><p class="auth-subtitle">CRM Interno · Demonstração visual</p><h2>${esc(title)}</h2><p class="page-desc">${esc(description)}</p>${body}</section></main>`;
  }

  function renderLogin() {
    return authLayout("Entrar", "Autenticação simulada para apresentar o fluxo inicial.", `<form data-form="login" class="grid">
      ${fields({}, [{ label: "Email", name: "email", type: "email", value: "demo@finance2win.pt" }, { label: "Palavra-passe", name: "password", type: "password", value: "demo123" }])}
      <label><input type="checkbox" checked> Manter sessão</label>
      <button class="btn" type="submit">Entrar</button>
      <a href="#/recuperar-password">Recuperar palavra-passe</a>
      <div class="notice">Credenciais demo: demo@finance2win.pt / demo123</div>
    </form>`);
  }

  function renderRecover() {
    return authLayout("Recuperar palavra-passe", "Envia um link fictício para demonstrar o fluxo.", `<form data-form="recover" class="grid">
      ${fields({}, [{ label: "Email", name: "email", type: "email", value: "demo@finance2win.pt" }])}
      <button class="btn" type="submit">Enviar link</button>
      <a href="#/login">Voltar ao login</a>
    </form>`);
  }

  function renderActivate() {
    return authLayout("Ativar conta", "Convite fictício para novo utilizador.", `<form data-form="activate" class="grid">
      ${fields({ name: "Novo Utilizador", email: "convite@finance2win.pt" }, [{ label: "Nome do utilizador", name: "name" }, { label: "Email", name: "email", type: "email" }, { label: "Nova palavra-passe", name: "password", type: "password" }, { label: "Confirmar palavra-passe", name: "confirm", type: "password" }])}
      <button class="btn" type="submit">Aceitar convite</button>
    </form>`);
  }

  function renderDashboard() {
    const active = state.processes.filter((p) => p.phase !== "Encerrado").length;
    const stats = [
      ["Total de clientes", state.clients.length, "/clientes"],
      ["Processos ativos", active, "/processos"],
      ["Propostas em análise", state.proposals.filter((p) => p.status === "Em análise").length, "/propostas"],
      ["Propostas aprovadas", state.proposals.filter((p) => p.status === "Aprovada").length, "/propostas"],
      ["Contratos em preparação", state.processes.filter((p) => p.status === "Contrato em preparação").length, "/contratos"],
      ["Processos encerrados", state.processes.filter((p) => p.phase === "Encerrado").length, "/encerrados"]
    ];
    const byPhase = phases.map((phase) => [phase, state.processes.filter((p) => p.phase === phase).length]);
    const recentRows = state.processes.slice(0, 6).map((p) => `<tr><td><a href="#/processos/${p.id}">${esc(p.number)}</a></td><td>${esc(client(p.clientId).name)}</td><td>${esc(p.phase)}</td><td>${badge(p.status)}</td><td>${esc(user(p.responsibleId).name)}</td></tr>`);
    return pageHeader("Dashboard geral", "Indicadores fictícios para validar o dia a dia operacional.", `${button("Novo cliente", "/clientes/novo")} ${button("Novo processo", "/processos/novo", "secondary")}`)
      + `<div class="grid cols-6">${stats.map(([label, value, href]) => `<a class="card stat-card" href="#${href}"><div class="stat-label">${esc(label)}</div><div class="stat-value">${value}</div><div class="stat-hint">Abrir módulo</div></a>`).join("")}</div>`
      + `<div class="grid cols-2" style="margin-top:14px">${card("Processos por fase", bars(byPhase))}${card("Processos por responsável", bars(state.users.map((u) => [u.name, state.processes.filter((p) => p.responsibleId === u.id).length]).filter(([, n]) => n > 0)))}</div>`
      + `<div class="grid cols-2" style="margin-top:14px">${card("Últimas atividades", timeline(state.auditLogs.slice(0, 4).map((a) => ({ date: a.date, user: a.user, text: `${a.action} em ${a.module}` }))))}${card("Processos recentes", dataTable(["Processo", "Cliente", "Fase", "Estado", "Responsável"], recentRows))}</div>`;
  }

  function bars(rows) {
    const max = Math.max(1, ...rows.map(([, value]) => value));
    return `<div class="chart-bars">${rows.map(([label, value]) => `<div class="bar-row"><span>${esc(label)}</span><div class="bar-track"><div class="bar-fill" style="width:${(value / max) * 100}%"></div></div><strong>${value}</strong></div>`).join("")}</div>`;
  }

  function timeline(items) {
    return `<div class="timeline">${items.map((item) => `<div class="timeline-item"><strong>${esc(item.date)}</strong><div><b>${esc(item.user)}</b><br><span class="meta">${esc(item.text)}</span></div></div>`).join("")}</div>`;
  }

  function renderClients() {
    const rows = state.clients.map((c) => `<tr><td><a href="#/clientes/${c.id}">${esc(c.name)}</a></td><td>${esc(c.nif)}</td><td>${esc(c.phone)}</td><td>${esc(c.email)}</td><td>${esc(user(c.responsibleId).name)}</td><td>${badge(c.status)}</td><td class="row-actions"><a class="btn small secondary" href="#/clientes/${c.id}">Detalhe</a><a class="btn small secondary" href="#/clientes/${c.id}/editar">Editar</a></td></tr>`);
    return pageHeader("Clientes", "Pesquisa e consulta da base de clientes fictícia.", button("Novo cliente", "/clientes/novo"))
      + filterBar([{ label: "Nome", name: "name" }, { label: "NIF", name: "nif" }, { label: "Telefone", name: "phone" }, { label: "Email", name: "email" }, { label: "Responsável", name: "responsible", type: "select", options: state.users.map((u) => u.name) }, { label: "Estado", name: "status", type: "select", options: ["Ativo", "Inativo"] }])
      + card("", dataTable(["Nome", "NIF", "Telefone", "Email", "Responsável", "Estado", "Ações"], rows));
  }

  function renderClientForm(existing) {
    const isEdit = Boolean(existing);
    const values = existing || { status: "Ativo", responsibleId: settings.defaultResponsibleId, rgpd: "Consentimento registado" };
    return pageHeader(isEdit ? "Editar cliente" : "Criar cliente", isEdit ? "Formulário preenchido com dados existentes." : "Registo visual com validação de NIF duplicado.", "")
      + card("", `<form data-form="${isEdit ? "client-edit" : "client-new"}" data-id="${esc(values.id || "")}" class="grid">
        ${fields(values, [
          { label: "Nome", name: "name", required: true },
          { label: "NIF", name: "nif", required: true },
          { label: "Telefone", name: "phone" },
          { label: "Email", name: "email", type: "email" },
          { label: "Morada", name: "address", full: true },
          { label: "RGPD", name: "rgpd", type: "select", options: ["Consentimento registado", "Consentimento pendente", "Não autorizado"] },
          { label: "Responsável", name: "responsibleId", type: "select", options: state.users.map((u) => ({ value: u.id, label: u.name })) },
          { label: "Estado", name: "status", type: "select", options: ["Ativo", "Inativo"] },
          { label: "Notas", name: "notes", type: "textarea", full: true }
        ])}
        <div id="nif-warning"></div>
        <div class="actions"><button class="btn" type="submit">Guardar cliente</button><a class="btn secondary" href="#/clientes">Cancelar</a></div>
      </form>`);
  }

  function renderClientDetail(id) {
    const c = client(id);
    if (!c.id) return missing("Cliente não encontrado.");
    const tab = currentTab[`client-${id}`] || "Resumo";
    const tabs = ["Resumo", "Dados pessoais", "Processos", "Propostas", "Contratos", "Viaturas", "Documentos", "Histórico"];
    const relatedProcesses = state.processes.filter((p) => p.clientId === id);
    const body = {
      "Resumo": summaryGrid([["Estado", badge(c.status)], ["Responsável", user(c.responsibleId).name], ["NIF", c.nif], ["Contacto", `${c.phone}<br>${c.email}`], ["Última atividade", c.lastActivity], ["RGPD", c.rgpd]]),
      "Dados pessoais": summaryGrid([["Nome", c.name], ["Morada", c.address], ["Email", c.email], ["Telefone", c.phone], ["Notas", c.notes]]),
      "Processos": dataTable(["Processo", "Fase", "Estado", "Valor"], relatedProcesses.map((p) => `<tr><td><a href="#/processos/${p.id}">${esc(p.number)}</a></td><td>${esc(p.phase)}</td><td>${badge(p.status)}</td><td>${money(p.amount)}</td></tr>`)),
      "Propostas": dataTable(["Proposta", "Banco", "Estado", "Valor"], state.proposals.filter((p) => p.clientId === id).map((p) => `<tr><td><a href="#/propostas/${p.id}">${esc(p.number)}</a></td><td>${esc(p.bank)}</td><td>${badge(p.status)}</td><td>${money(p.amount)}</td></tr>`)),
      "Contratos": dataTable(["Contrato", "Banco", "Estado", "Valor"], state.contracts.filter((p) => p.clientId === id).map((p) => `<tr><td><a href="#/contratos/${p.id}">${esc(p.number)}</a></td><td>${esc(p.bank)}</td><td>${badge(p.status)}</td><td>${money(p.amount)}</td></tr>`)),
      "Viaturas": dataTable(["Processo", "Viatura"], relatedProcesses.map((p) => `<tr><td>${esc(p.number)}</td><td>${esc(p.vehicle)}</td></tr>`)),
      "Documentos": dataTable(["Documento", "Categoria", "Origem"], state.documents.filter((d) => d.clientId === id).map((d) => `<tr><td><a href="#/documentos/${d.id}">${esc(d.name)}</a></td><td>${esc(d.category)}</td><td>${esc(d.origin)}</td></tr>`)),
      "Histórico": timeline(relatedProcesses.flatMap((p) => p.history).slice(0, 8))
    }[tab];
    return pageHeader(c.name, "Visão 360.º do cliente, processos e histórico.", `${button("Editar", `/clientes/${id}/editar`)} ${button("Novo processo", `/processos/novo?client=${id}`, "secondary")} <a class="btn secondary" href="#/contactos/novo">Registar contacto</a>`)
      + tabsHtml(`client-${id}`, tabs, tab)
      + card("", body);
  }

  function summaryGrid(items) {
    return `<div class="grid cols-3">${items.map(([label, value]) => `<div class="notice"><strong>${esc(label)}</strong><br>${typeof value === "string" && value.includes("<") ? value : esc(value)}</div>`).join("")}</div>`;
  }

  function tabsHtml(key, list, active) {
    return `<div class="tabs">${list.map((name) => `<button class="tab ${name === active ? "active" : ""}" type="button" data-action="tab" data-key="${esc(key)}" data-tab="${esc(name)}">${esc(name)}</button>`).join("")}</div>`;
  }

  function renderProcesses() {
    const rows = state.processes.map((p) => `<tr><td><a href="#/processos/${p.id}">${esc(p.number)}</a></td><td>${esc(client(p.clientId).name)}</td><td>${esc(p.phase)}</td><td>${badge(p.status)}</td><td>${esc(user(p.responsibleId).name)}</td><td>${esc(p.bank)}</td><td>${money(p.amount)}</td><td class="row-actions"><a class="btn small secondary" href="#/processos/${p.id}">Consultar</a><a class="btn small secondary" href="#/processos/${p.id}/editar">Editar</a></td></tr>`);
    return pageHeader("Processos", "Lista operacional com pesquisa, filtros e ações.", `${button("Novo processo", "/processos/novo")} ${button("Ver pipeline", "/processos/pipeline", "secondary")}`)
      + filterBar([{ label: "Pesquisa", name: "q" }, { label: "Fase", name: "phase", type: "select", options: phases }, { label: "Estado", name: "status", type: "select", options: statuses }, { label: "Responsável", name: "responsible", type: "select", options: state.users.map((u) => u.name) }, { label: "Banco", name: "bank", type: "select", options: banks }, { label: "Período", name: "period" }])
      + card("", dataTable(["Processo", "Cliente", "Fase", "Estado", "Responsável", "Banco", "Valor", "Ações"], rows));
  }

  function renderPipeline() {
    return pageHeader("Pipeline operacional", "Kanban com botões para mover processos entre fases e registar histórico.", button("Novo processo", "/processos/novo"))
      + `<div class="pipeline">${phases.map((phase) => {
        const items = state.processes.filter((p) => p.phase === phase);
        return `<section class="pipeline-col"><div class="pipeline-title"><span>${esc(phase)}</span><span>${items.length}</span></div>${items.map((p) => `<article class="pipeline-card">
          <h4><a href="#/processos/${p.id}">${esc(client(p.clientId).name)}</a></h4>
          <div class="meta">NIF ${esc(client(p.clientId).nif)}<br>${esc(p.product)} · ${money(p.amount)}<br>${esc(user(p.responsibleId).name)} · ${esc(p.updatedAt)}</div>
          <p>${badge(p.status)}</p>
          <div class="row-actions">${phaseIndex(p.phase) > 0 ? `<button class="btn small secondary" data-action="move-process" data-id="${p.id}" data-dir="-1">←</button>` : ""}${phaseIndex(p.phase) < phases.length - 1 ? `<button class="btn small secondary" data-action="move-process" data-id="${p.id}" data-dir="1">→</button>` : ""}</div>
        </article>`).join("")}</section>`;
      }).join("")}</div>`;
  }

  function phaseIndex(phase) {
    return phases.indexOf(phase);
  }

  function renderProcessForm(existing) {
    const isEdit = Boolean(existing);
    const values = existing || { clientId: state.clients[0].id, responsibleId: settings.defaultResponsibleId, phase: "Contacto", status: "Novo contacto", bank: banks[0], product: products[0], vehicle: vehicles[0], term: 60, amount: 12000 };
    return pageHeader(isEdit ? "Editar processo" : "Criar processo", "Dados principais do processo, produto, banco, viatura e estado.", "")
      + card("", `<form data-form="${isEdit ? "process-edit" : "process-new"}" data-id="${esc(values.id || "")}" class="grid">
        ${fields(values, [
          { label: "Cliente existente", name: "clientId", type: "select", options: state.clients.map((c) => ({ value: c.id, label: `${c.name} · ${c.nif}` })) },
          { label: "Cliente rápido (opcional)", name: "quickClient" },
          { label: "Responsável", name: "responsibleId", type: "select", options: state.users.map((u) => ({ value: u.id, label: u.name })) },
          { label: "Tipo de crédito", name: "product", type: "select", options: products },
          { label: "Produto", name: "modality", value: values.modality || "Produto standard" },
          { label: "Banco", name: "bank", type: "select", options: banks },
          { label: "Viatura", name: "vehicle", type: "select", options: vehicles },
          { label: "Valor", name: "amount", type: "number" },
          { label: "Prazo", name: "term", type: "number" },
          { label: "Fase", name: "phase", type: "select", options: phases },
          { label: "Estado inicial", name: "status", type: "select", options: statuses }
        ])}
        <div class="actions"><button class="btn" type="submit">Guardar processo</button><a class="btn secondary" href="#/processos">Cancelar</a></div>
      </form>`);
  }

  function renderProcessDetail(id) {
    const p = processItem(id);
    if (!p.id) return missing("Processo não encontrado.");
    const tab = currentTab[`process-${id}`] || "Resumo";
    const tabs = ["Resumo", "Cliente", "Contacto", "Viatura", "Proposta", "Contrato / APV", "Documentos", "Histórico", "Encerramento"];
    const prop = state.proposals.find((item) => item.processId === id);
    const cont = state.contracts.find((item) => item.processId === id);
    const body = {
      "Resumo": summaryGrid([["Número", p.number], ["Cliente", client(p.clientId).name], ["NIF", client(p.clientId).nif], ["Fase", p.phase], ["Estado", badge(p.status)], ["Responsável", user(p.responsibleId).name], ["Última atualização", p.updatedAt], ["Banco", p.bank], ["Valor", money(p.amount)]]),
      "Cliente": summaryGrid([["Nome", client(p.clientId).name], ["Email", client(p.clientId).email], ["Telefone", client(p.clientId).phone], ["NIF", client(p.clientId).nif]]),
      "Contacto": dataTable(["Tipo", "Data", "Resultado"], state.contacts.filter((c) => c.processId === id).map((c) => `<tr><td><a href="#/contactos/${c.id}">${esc(c.type)}</a></td><td>${esc(c.date)}</td><td>${esc(c.result)}</td></tr>`)),
      "Viatura": summaryGrid([["Modelo", p.vehicle], ["Produto", p.product], ["Prazo", `${p.term} meses`], ["Valor", money(p.amount)]]),
      "Proposta": prop ? summaryGrid([["Proposta", `<a href="#/propostas/${prop.id}">${esc(prop.number)}</a>`], ["Banco", prop.bank], ["Estado", badge(prop.status)], ["Mensalidade", money(prop.monthly)]]) : `<div class="empty-state">Sem proposta associada.</div>`,
      "Contrato / APV": cont ? summaryGrid([["Contrato", `<a href="#/contratos/${cont.id}">${esc(cont.number)}</a>`], ["Estado", badge(cont.status)], ["Assinatura", cont.signatureType], ["Local", cont.location]]) : `<div class="empty-state">Sem contrato associado.</div>`,
      "Documentos": dataTable(["Documento", "Categoria", "Origem"], state.documents.filter((d) => d.processId === id).map((d) => `<tr><td><a href="#/documentos/${d.id}">${esc(d.name)}</a></td><td>${esc(d.category)}</td><td>${esc(d.origin)}</td></tr>`)),
      "Histórico": timeline(p.history),
      "Encerramento": summaryGrid([["Resultado final", p.phase === "Encerrado" ? p.status : "Ainda ativo"], ["Motivo", p.closeReason || "Não aplicável"], ["Responsável", user(p.responsibleId).name]])
    }[tab];
    return pageHeader(p.number, `${client(p.clientId).name} · ${p.phase} · ${p.updatedAt}`, `${button("Editar", `/processos/${id}/editar`)} <button class="btn secondary" data-action="cycle-status" data-id="${id}">Mudar estado</button> <a class="btn secondary" href="#/contactos/novo">Adicionar contacto</a> <a class="btn secondary" href="#/documentos/novo">Adicionar documento</a>`)
      + progress(p.phase)
      + tabsHtml(`process-${id}`, tabs, tab)
      + card("", body);
  }

  function progress(activePhase) {
    const active = phaseIndex(activePhase);
    return `<div class="progress">${phases.map((phase, index) => `<div class="progress-step ${index < active ? "done" : ""} ${index === active ? "active" : ""}">${esc(phase)}</div>`).join("")}</div>`;
  }

  function renderContactForm(existing) {
    const values = existing || { clientId: state.clients[0].id, processId: state.processes[0].id, type: "Chamada", userId: "u3", date: "2026-06-17 10:00", result: "Cliente contactado" };
    const isEdit = Boolean(existing);
    return pageHeader(isEdit ? "Editar contacto" : "Registar contacto", "Interação com cliente ou processo.", "")
      + card("", `<form data-form="${isEdit ? "contact-edit" : "contact-new"}" data-id="${esc(values.id || "")}" class="grid">${fields(values, [
        { label: "Cliente", name: "clientId", type: "select", options: state.clients.map((c) => ({ value: c.id, label: c.name })) },
        { label: "Processo", name: "processId", type: "select", options: state.processes.map((p) => ({ value: p.id, label: p.number })) },
        { label: "Tipo de interação", name: "type", type: "select", options: ["Chamada", "Email", "Reunião", "Nota", "Tentativa sem resposta"] },
        { label: "Data", name: "date" },
        { label: "Utilizador", name: "userId", type: "select", options: state.users.map((u) => ({ value: u.id, label: u.name })) },
        { label: "Resultado", name: "result" },
        { label: "Próximas informações", name: "next" },
        { label: "Observações", name: "notes", type: "textarea", full: true }
      ])}<div class="actions"><button class="btn" type="submit">Guardar contacto</button></div></form>`);
  }

  function renderContactDetail(id) {
    const c = contact(id);
    if (!c.id) return missing("Contacto não encontrado.");
    return pageHeader("Detalhe do contacto", `${c.type} · ${c.date}`, `${button("Editar", `/contactos/${id}/editar`)}`)
      + card("", summaryGrid([["Tipo", c.type], ["Cliente", `<a href="#/clientes/${c.clientId}">${esc(client(c.clientId).name)}</a>`], ["Processo", `<a href="#/processos/${c.processId}">${esc(processItem(c.processId).number)}</a>`], ["Responsável", user(c.userId).name], ["Data", c.date], ["Resultado", c.result], ["Observações", c.notes], ["Próximas informações", c.next]]));
  }

  function renderProposals() {
    const rows = state.proposals.map((p) => `<tr><td><a href="#/propostas/${p.id}">${esc(p.number)}</a></td><td>${esc(client(p.clientId).name)}</td><td>${esc(processItem(p.processId).number)}</td><td>${esc(p.bank)}</td><td>${badge(p.status)}</td><td>${money(p.amount)}</td><td class="row-actions"><a class="btn small secondary" href="#/propostas/${p.id}/editar">Editar</a></td></tr>`);
    return pageHeader("Propostas", "Propostas enviadas, aprovadas, recusadas ou em análise.", button("Nova proposta", "/propostas/nova"))
      + filterBar([{ label: "Pesquisa", name: "q" }, { label: "Estado", name: "status", type: "select", options: ["Em análise", "Novos elementos", "Aprovada", "Recusada"] }, { label: "Banco", name: "bank", type: "select", options: banks }, { label: "Responsável", name: "responsible", type: "select", options: state.users.map((u) => u.name) }, { label: "Valor", name: "amount" }, { label: "Cliente", name: "client" }])
      + card("", dataTable(["Proposta", "Cliente", "Processo", "Banco", "Estado", "Valor", "Ações"], rows));
  }

  function renderProposalForm(existing) {
    const values = existing || { processId: state.processes[2].id, clientId: state.processes[2].clientId, bank: banks[0], number: `PROP-${Date.now().toString().slice(-4)}`, modality: products[0], amount: 12000, term: 60, monthly: 260, status: "Em análise" };
    const isEdit = Boolean(existing);
    return pageHeader(isEdit ? "Editar proposta" : "Criar proposta", "Ao aprovar, a demo simula envio automático de email.", "")
      + card("", `<form data-form="${isEdit ? "proposal-edit" : "proposal-new"}" data-id="${esc(values.id || "")}" class="grid">${fields(values, [
        { label: "Processo", name: "processId", type: "select", options: state.processes.map((p) => ({ value: p.id, label: p.number })) },
        { label: "Cliente", name: "clientId", type: "select", options: state.clients.map((c) => ({ value: c.id, label: c.name })) },
        { label: "Banco", name: "bank", type: "select", options: banks },
        { label: "Número da proposta", name: "number" },
        { label: "Modalidade", name: "modality", type: "select", options: products },
        { label: "Valor", name: "amount", type: "number" },
        { label: "Prazo", name: "term", type: "number" },
        { label: "Mensalidade", name: "monthly", type: "number" },
        { label: "Estado", name: "status", type: "select", options: ["Em análise", "Novos elementos", "Aprovada", "Recusada"] },
        { label: "Observações", name: "notes", type: "textarea", full: true }
      ])}<div class="actions"><button class="btn" type="submit">Guardar proposta</button></div></form>`);
  }

  function renderProposalDetail(id) {
    const p = proposal(id);
    if (!p.id) return missing("Proposta não encontrada.");
    const docs = state.documents.filter((d) => d.processId === p.processId);
    return pageHeader(p.number, `${client(p.clientId).name} · ${p.bank}`, `${button("Editar", `/propostas/${id}/editar`)} <button class="btn secondary" data-action="approve-proposal" data-id="${id}">Mudar estado para aprovada</button>`)
      + card("Resumo da proposta", summaryGrid([["Cliente", `<a href="#/clientes/${p.clientId}">${esc(client(p.clientId).name)}</a>`], ["Processo", `<a href="#/processos/${p.processId}">${esc(processItem(p.processId).number)}</a>`], ["Banco", p.bank], ["Valor", money(p.amount)], ["Prazo", `${p.term} meses`], ["Mensalidade", money(p.monthly)], ["Estado", badge(p.status)]]))
      + `<div class="grid cols-2" style="margin-top:14px">${card("Histórico", timeline(processItem(p.processId).history || []))}${card("Documentos relacionados", dataTable(["Documento", "Categoria", "Origem"], docs.map((d) => `<tr><td><a href="#/documentos/${d.id}">${esc(d.name)}</a></td><td>${esc(d.category)}</td><td>${esc(d.origin)}</td></tr>`)))}</div>`;
  }

  function renderContracts() {
    const rows = state.contracts.map((c) => `<tr><td><a href="#/contratos/${c.id}">${esc(c.number)}</a></td><td>${esc(client(c.clientId).name)}</td><td>${esc(c.bank)}</td><td>${badge(c.status)}</td><td>${money(c.amount)}</td><td>${esc(c.date)}</td><td><a class="btn small secondary" href="#/contratos/${c.id}/editar">Editar</a></td></tr>`);
    return pageHeader("Contratos / APV", "Contratos fictícios associados a propostas aprovadas.", button("Novo contrato", "/contratos/novo"))
      + filterBar([{ label: "Pesquisa", name: "q" }, { label: "Cliente", name: "client" }, { label: "Banco", name: "bank", type: "select", options: banks }, { label: "Estado", name: "status" }, { label: "Valor", name: "amount" }, { label: "Data", name: "date" }])
      + card("", dataTable(["Contrato", "Cliente", "Banco", "Estado", "Valor", "Data", "Ações"], rows));
  }

  function renderContractForm(existing) {
    const values = existing || { clientId: state.clients[0].id, processId: state.processes[6].id, proposalId: state.proposals[0].id, bank: banks[0], amount: 12000, term: 60, monthly: 260, signatureType: "Digital simulada", location: "My Cloud", date: "2026-06-17", status: "Contrato em preparação" };
    const isEdit = Boolean(existing);
    return pageHeader(isEdit ? "Editar contrato/APV" : "Criar contrato/APV", "Formulário visual associado a cliente, processo e proposta.", "")
      + card("", `<form data-form="${isEdit ? "contract-edit" : "contract-new"}" data-id="${esc(values.id || "")}" class="grid">${fields(values, [
        { label: "Cliente", name: "clientId", type: "select", options: state.clients.map((c) => ({ value: c.id, label: c.name })) },
        { label: "Processo", name: "processId", type: "select", options: state.processes.map((p) => ({ value: p.id, label: p.number })) },
        { label: "Proposta", name: "proposalId", type: "select", options: state.proposals.map((p) => ({ value: p.id, label: p.number })) },
        { label: "Banco", name: "bank", type: "select", options: banks },
        { label: "Valor", name: "amount", type: "number" },
        { label: "Prazo", name: "term", type: "number" },
        { label: "Mensalidade", name: "monthly", type: "number" },
        { label: "Tipo de assinatura", name: "signatureType", type: "select", options: ["Digital simulada", "Presencial"] },
        { label: "Local", name: "location" },
        { label: "Data", name: "date", type: "date" },
        { label: "Estado", name: "status", type: "select", options: ["Contrato em preparação", "Contrato enviado", "Assinado", "Concluído"] }
      ])}<div class="actions"><button class="btn" type="submit">Guardar contrato</button></div></form>`);
  }

  function renderContractDetail(id) {
    const c = contract(id);
    if (!c.id) return missing("Contrato não encontrado.");
    const docs = state.documents.filter((d) => d.processId === c.processId);
    return pageHeader(c.number, "Resumo contratual e documentos associados.", button("Editar", `/contratos/${id}/editar`))
      + card("Resumo contratual", summaryGrid([["Cliente", `<a href="#/clientes/${c.clientId}">${esc(client(c.clientId).name)}</a>`], ["Processo", `<a href="#/processos/${c.processId}">${esc(processItem(c.processId).number)}</a>`], ["Proposta", `<a href="#/propostas/${c.proposalId}">${esc(proposal(c.proposalId).number || "Sem proposta")}</a>`], ["Banco", c.bank], ["Valor", money(c.amount)], ["Prazo", `${c.term} meses`], ["Mensalidade", money(c.monthly)], ["Datas", c.date], ["Estado", badge(c.status)]]))
      + `<div class="grid cols-2" style="margin-top:14px">${card("Histórico", timeline(processItem(c.processId).history || []))}${card("Documentos", dataTable(["Documento", "Origem"], docs.map((d) => `<tr><td>${esc(d.name)}</td><td>${esc(d.origin)}</td></tr>`)))}</div>`;
  }

  function renderClosedList() {
    const tab = currentTab.closed || "Encerrados com contrato";
    const items = state.processes.filter((p) => p.phase === "Encerrado" && p.status === tab);
    return pageHeader("Processos encerrados", "Separação por resultado final com ou sem contrato.", "")
      + tabsHtml("closed", ["Encerrados com contrato", "Encerrados sem contrato"], tab)
      + filterBar([{ label: "Pesquisa", name: "q" }, { label: "Motivo", name: "reason" }, { label: "Data", name: "date" }, { label: "Responsável", name: "responsible" }, { label: "Cliente", name: "client" }, { label: "Valor", name: "amount" }])
      + card("", dataTable(["Processo", "Cliente", "Motivo", "Data", "Responsável", "Valor"], items.map((p) => `<tr><td><a href="#/encerrados/${p.id}">${esc(p.number)}</a></td><td>${esc(client(p.clientId).name)}</td><td>${esc(p.closeReason)}</td><td>${esc(p.updatedAt)}</td><td>${esc(user(p.responsibleId).name)}</td><td>${money(p.amount)}</td></tr>`)));
  }

  function renderClosedDetail(id) {
    const p = processItem(id);
    if (!p.id) return missing("Processo encerrado não encontrado.");
    const prop = state.proposals.find((item) => item.processId === id);
    const cont = state.contracts.find((item) => item.processId === id);
    return pageHeader("Detalhe do processo encerrado", p.number, "")
      + card("", summaryGrid([["Resultado final", badge(p.status)], ["Motivo", p.closeReason], ["Data", p.updatedAt], ["Cliente", `<a href="#/clientes/${p.clientId}">${esc(client(p.clientId).name)}</a>`], ["Proposta", prop ? `<a href="#/propostas/${prop.id}">${esc(prop.number)}</a>` : "Não aplicável"], ["Contrato", cont ? `<a href="#/contratos/${cont.id}">${esc(cont.number)}</a>` : "Sem contrato"], ["Responsável", user(p.responsibleId).name]]))
      + card("Histórico completo", timeline(p.history), "spaced");
  }

  function renderUsers() {
    const rows = state.users.map((u) => `<tr><td>${esc(u.name)}</td><td>${esc(u.email)}</td><td>${esc(u.role)}</td><td>${badge(u.status)}</td><td>${esc(u.lastAccess)}</td><td>${state.processes.filter((p) => p.responsibleId === u.id).length}</td><td class="row-actions"><a class="btn small secondary" href="#/utilizadores/${u.id}/editar">Editar</a><button class="btn small secondary" data-action="toggle-user" data-id="${u.id}">${u.status === "Ativo" ? "Desativar" : "Ativar"}</button></td></tr>`);
    return pageHeader("Utilizadores", "Gestão visual de equipa e perfis.", button("Novo utilizador", "/utilizadores/novo"))
      + card("", dataTable(["Nome", "Email", "Perfil", "Estado", "Último acesso", "Processos atribuídos", "Ações"], rows));
  }

  function renderUserForm(existing) {
    const values = existing || { role: "Comercial", status: "Ativo" };
    const isEdit = Boolean(existing);
    return pageHeader(isEdit ? "Editar utilizador" : "Criar utilizador", "Convite e gestão de estado simulados.", "")
      + card("", `<form data-form="${isEdit ? "user-edit" : "user-new"}" data-id="${esc(values.id || "")}" class="grid">${fields(values, [
        { label: "Nome", name: "name" },
        { label: "Email", name: "email", type: "email" },
        { label: "Perfil", name: "role", type: "select", options: ["Administrador", "Gestor", "Comercial", "Back-office"] },
        { label: "Estado", name: "status", type: "select", options: ["Ativo", "Inativo", "Convite enviado"] }
      ])}<label><input type="checkbox" name="invite" checked> Enviar convite / reenviar convite</label>${isEdit ? card("Processos atribuídos", dataTable(["Processo", "Cliente"], state.processes.filter((p) => p.responsibleId === values.id).map((p) => `<tr><td>${esc(p.number)}</td><td>${esc(client(p.clientId).name)}</td></tr>`))) : ""}<div class="actions"><button class="btn" type="submit">Guardar utilizador</button></div></form>`);
  }

  function renderProfiles() {
    const profiles = [
      ["Administrador", "Acesso total à demo.", state.users.filter((u) => u.role === "Administrador").length],
      ["Gestor", "Acompanha operação e relatórios.", state.users.filter((u) => u.role === "Gestor").length],
      ["Comercial", "Gere clientes, contactos e processos próprios.", state.users.filter((u) => u.role === "Comercial").length],
      ["Back-office", "Apoia documentação e contratos.", state.users.filter((u) => u.role === "Back-office").length]
    ];
    return pageHeader("Perfis", "Perfis simulados e descrição de responsabilidade.", button("Matriz de permissões", "/perfis/permissoes"))
      + `<div class="grid cols-4">${profiles.map(([name, desc, count]) => card(name, `<p class="meta">${esc(desc)}</p><p><strong>${count}</strong> utilizador(es)</p>`)).join("")}</div>`;
  }

  function renderPermissions() {
    const roles = ["Administrador", "Gestor", "Comercial", "Back-office"];
    const modules = Object.keys(state.permissions);
    const rows = modules.map((module) => `<tr><td><strong>${esc(module)}</strong><br><span class="meta">Ver, criar, editar, eliminar, aprovar, encerrar, exportar</span></td>${roles.map((role) => `<td><input type="checkbox" data-action="permission" data-module="${esc(module)}" data-role="${esc(role)}" ${state.permissions[module][role] ? "checked" : ""}></td>`).join("")}</tr>`);
    return pageHeader("Matriz de permissões", "Controlos clicáveis com persistência local.", "")
      + card("", `<div class="table-wrap"><table class="permission-table"><thead><tr><th>Módulo</th>${roles.map((r) => `<th>${esc(r)}</th>`).join("")}</tr></thead><tbody>${rows.join("")}</tbody></table></div>`);
  }

  function renderDocuments() {
    const rows = state.documents.map((d) => `<tr><td><a href="#/documentos/${d.id}">${esc(d.name)}</a></td><td>${esc(d.category)}</td><td>${esc(client(d.clientId).name)}</td><td>${esc(processItem(d.processId).number)}</td><td>${esc(d.origin)}</td><td>${esc(d.date)}</td><td>${esc(user(d.responsibleId).name)}</td></tr>`);
    return pageHeader("Documentos", "Ficheiros internos e links My Cloud simulados.", button("Adicionar documento", "/documentos/novo"))
      + filterBar([{ label: "Pesquisa", name: "q" }, { label: "Categoria", name: "category" }, { label: "Cliente", name: "client" }, { label: "Processo", name: "process" }])
      + card("", dataTable(["Nome", "Categoria", "Cliente", "Processo", "Origem", "Data", "Responsável"], rows));
  }

  function renderDocumentForm() {
    const values = { origin: "Ficheiro interno", clientId: state.clients[0].id, processId: state.processes[0].id, responsibleId: "u5", category: "Identificação", date: "2026-06-17" };
    return pageHeader("Adicionar documento", "Upload e link My Cloud são apenas simulados.", "")
      + card("", `<form data-form="document-new" class="grid">
        <div class="file-drop">Arrastar ficheiro ou indicar link My Cloud<br><small>Sem envio para servidor</small></div>
        ${fields(values, [
          { label: "Nome do ficheiro/link", name: "name", value: "novo-documento-demo.pdf" },
          { label: "Origem", name: "origin", type: "select", options: ["Ficheiro interno", "My Cloud"] },
          { label: "Cliente", name: "clientId", type: "select", options: state.clients.map((c) => ({ value: c.id, label: c.name })) },
          { label: "Processo", name: "processId", type: "select", options: state.processes.map((p) => ({ value: p.id, label: p.number })) },
          { label: "Categoria", name: "category", type: "select", options: ["Identificação", "Financeiro", "Contrato", "Viatura", "Outro"] },
          { label: "Data", name: "date", type: "date" },
          { label: "Responsável", name: "responsibleId", type: "select", options: state.users.map((u) => ({ value: u.id, label: u.name })) },
          { label: "Descrição", name: "description", type: "textarea", full: true }
        ])}<div class="actions"><button class="btn" type="submit">Guardar documento</button></div></form>`);
  }

  function renderDocumentDetail(id) {
    const d = documentItem(id);
    if (!d.id) return missing("Documento não encontrado.");
    return pageHeader(d.name, `${d.category} · ${d.origin}`, `<button class="btn secondary" data-action="fake-download">Descarregar</button> <button class="btn secondary" data-action="toast" data-message="Metadados prontos para edição simulada.">Editar metadados</button>`)
      + card("", summaryGrid([["Nome", d.name], ["Categoria", d.category], ["Cliente", `<a href="#/clientes/${d.clientId}">${esc(client(d.clientId).name)}</a>`], ["Processo", `<a href="#/processos/${d.processId}">${esc(processItem(d.processId).number)}</a>`], ["Origem", d.origin], ["Data", d.date], ["Responsável", user(d.responsibleId).name], ["Link fictício", settings.myCloudUrl]]))
      + card("Pré-visualização", `<div class="empty-state">Pré-visualização placeholder do documento. Integração não ativa.</div><p><button class="btn secondary" data-action="toast" data-message="Abertura My Cloud simulada.">Abrir My Cloud</button></p>`, "spaced");
  }

  function renderWebsiteConfig() {
    return pageHeader("Configuração do formulário do website", "Integração simulada, não ativa.", `<button class="btn" data-action="toast" data-message="Teste de integração simulado com sucesso.">Testar integração</button>`)
      + card("", summaryGrid([["Estado da integração", badge("Simulação")], ["URL do website", settings.websiteUrl], ["Campos recebidos", "Nome, NIF, Email, Telefone, Produto"], ["Correspondência CRM", "Nome→Cliente, NIF→NIF, Mail→Email"], ["Estado inicial", "Novo contacto"], ["Responsável padrão", user(settings.defaultResponsibleId).name]]));
  }

  function renderWebsiteSubmissions() {
    const rows = state.websiteSubmissions.map((s) => `<tr><td>${esc(s.name)}</td><td>${esc(s.nif)}</td><td>${esc(s.email)}</td><td>${esc(s.phone)}</td><td>${esc(s.product)}</td><td>${esc(s.date)}</td><td>${badge(s.status)}</td><td>${s.clientCreated ? "Sim" : "Não"}</td><td>${s.processCreated ? "Sim" : "Não"}</td><td><button class="btn small secondary" data-action="submission" data-id="${s.id}">Detalhe</button></td></tr>`);
    return pageHeader("Submissões recebidas pelo website", "Entradas fictícias recebidas pelo formulário público.", button("Configuração", "/website/configuracao", "secondary"))
      + card("", dataTable(["Nome", "NIF", "Email", "Telefone", "Produto", "Data", "Estado", "Cliente criado", "Processo criado", "Ações"], rows));
  }

  function renderImport(step) {
    const map = {
      nova: ["Carregar ficheiro", `<div class="file-drop">Escolher Excel ou CSV<br>clientes-demo.xlsx · 48 KB</div><p class="actions"><a class="btn" href="#/importacoes/mapear">Continuar</a></p>`],
      mapear: ["Mapear colunas", dataTable(["Coluna Excel", "Campo CRM"], [["Nome Cliente", "Nome"], ["Contribuinte", "NIF"], ["Telemóvel", "Telefone"], ["Mail", "Email"], ["Situação", "Estado"], ["Comercial", "Responsável"]].map((r) => `<tr><td>${esc(r[0])}</td><td><select><option>${esc(r[1])}</option></select></td></tr>`)) + `<p class="actions"><a class="btn" href="#/importacoes/validar">Continuar</a></p>`],
      validar: ["Pré-visualizar e validar", dataTable(["Linha", "Nome", "Estado", "Ação"], [["1", "Inês Demo", "Válido"], ["2", "NIF repetido", "Duplicado"], ["3", "Sem email", "Campos em falta"], ["4", "NIF 123", "NIF inválido"]].map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${badge(r[2])}</td><td><select><option>Corrigir</option><option>Ignorar</option></select></td></tr>`)) + `<p class="actions"><a class="btn" href="#/importacoes/resultado">Importar</a></p>`],
      resultado: ["Resultado da importação", summaryGrid([["Total lido", 42], ["Total importado", 31], ["Total atualizado", 5], ["Total ignorado", 4], ["Total com erro", 2]]) + `<p class="actions"><button class="btn secondary" data-action="fake-download">Descarregar relatório</button><a class="btn" href="#/clientes">Ver clientes importados</a></p>`]
    };
    const steps = ["nova", "mapear", "validar", "resultado"];
    return pageHeader(map[step][0], "Wizard visual de importação Excel/CSV sem upload real.", "")
      + `<div class="wizard">${steps.map((s, i) => `<div class="wizard-step ${s === step ? "active" : ""}">${i + 1}. ${esc(map[s][0])}</div>`).join("")}</div>`
      + card("", map[step][1]);
  }

  function renderReports() {
    return pageHeader("Relatórios operacionais", "Gráficos fictícios e filtros por período.", button("Exportar dados", "/relatorios/exportar"))
      + filterBar([{ label: "Período", name: "period" }, { label: "Responsável", name: "responsible", type: "select", options: state.users.map((u) => u.name) }])
      + `<div class="grid cols-2">${card("Processos por fase", bars(phases.map((phase) => [phase, state.processes.filter((p) => p.phase === phase).length])))}${card("Propostas aprovadas/recusadas", bars([["Aprovadas", state.proposals.filter((p) => p.status === "Aprovada").length], ["Recusadas", state.proposals.filter((p) => p.status === "Recusada").length], ["Em análise", state.proposals.filter((p) => p.status === "Em análise").length]]))}${card("Contratos concluídos", bars([["Concluídos", state.contracts.filter((c) => c.status === "Concluído").length], ["Em preparação", state.contracts.filter((c) => c.status !== "Concluído").length]]))}${card("Origens dos contactos", bars([["Website", state.processes.filter((p) => p.origin === "Website").length], ["Contacto direto", state.processes.filter((p) => p.origin !== "Website").length]]))}</div>`;
  }

  function renderExport() {
    return pageHeader("Exportação de dados", "Gera um CSV simples no navegador.", `<button class="btn" data-action="export-csv">Exportar CSV</button>`)
      + card("", fields({ module: "Clientes", format: "CSV" }, [
        { label: "Módulo", name: "module", type: "select", options: ["Clientes", "Processos", "Propostas", "Contratos", "Documentos"] },
        { label: "Campos", name: "fields", value: "Nome,NIF,Email,Telefone,Estado" },
        { label: "Estado", name: "status", type: "select", options: ["Todos", "Ativo", "Em análise", "Aprovada", "Encerrado"] },
        { label: "Período", name: "period", value: "2026" },
        { label: "Responsável", name: "responsible", type: "select", options: ["Todos"].concat(state.users.map((u) => u.name)) },
        { label: "Formato", name: "format", type: "select", options: ["CSV", "Excel"] }
      ]));
  }

  function renderAudit() {
    const rows = state.auditLogs.map((a) => `<tr><td>${esc(a.date)}</td><td>${esc(a.user)}</td><td><button class="btn small secondary" data-action="audit" data-id="${a.id}">${esc(a.action)}</button></td><td>${esc(a.module)}</td><td>${esc(a.record)}</td><td>${esc(a.before)}</td><td>${esc(a.after)}</td></tr>`);
    return pageHeader("Auditoria global", "Registo fictício de alterações e eventos.", "")
      + card("", dataTable(["Data e hora", "Utilizador", "Ação", "Módulo", "Registo", "Valor anterior", "Novo valor"], rows));
  }

  function renderProfile() {
    return pageHeader("Meu perfil", "Preferências e sessão simuladas.", `<button class="btn secondary" data-action="logout">Terminar sessão</button>`)
      + card("", `<form data-form="profile" class="grid">${fields({ name: "António Marques", email: "antonio@finance2win.demo", image: "Placeholder", preferences: "Receber notificações de propostas aprovadas" }, [
        { label: "Nome", name: "name" },
        { label: "Email", name: "email", type: "email" },
        { label: "Imagem placeholder", name: "image" },
        { label: "Nova palavra-passe", name: "password", type: "password" },
        { label: "Preferências", name: "preferences", type: "textarea", full: true }
      ])}<div class="actions"><button class="btn" type="submit">Guardar perfil</button></div></form>`);
  }

  function renderSettings() {
    const tab = currentTab.settings || "Empresa";
    const tabs = ["Empresa", "Email automático", "Website", "My Cloud", "Integrações", "Segurança", "Dados da demonstração"];
    const content = tab === "Dados da demonstração"
      ? `<div class="notice warning">Esta ação repõe todos os dados fictícios guardados no navegador.</div><p><button class="btn danger" data-action="reset-demo">Repor dados demo</button></p>`
      : `<form data-form="settings" class="grid">${fields(settings, [
        { label: "Nome da empresa", name: "company" },
        { label: "Nome do remetente", name: "senderName" },
        { label: "Email remetente", name: "senderEmail", type: "email" },
        { label: "Assunto do email de aprovação", name: "approvalSubject", full: true },
        { label: "Template", name: "emailTemplate", type: "textarea", full: true },
        { label: "URL My Cloud", name: "myCloudUrl" },
        { label: "URL Website", name: "websiteUrl" },
        { label: "Responsável padrão", name: "defaultResponsibleId", type: "select", options: state.users.map((u) => ({ value: u.id, label: u.name })) }
      ])}<div class="actions"><button class="btn" type="submit">Guardar configurações</button><button class="btn secondary" type="button" data-action="toast" data-message="Email de teste simulado.">Enviar email de teste</button></div></form>`;
    return pageHeader("Configurações gerais e integrações", "Todas as integrações estão marcadas como simulação.", "")
      + tabsHtml("settings", tabs, tab)
      + card(tab, content);
  }

  function missing(message) {
    return pageHeader("Página não encontrada", message, button("Voltar ao dashboard", "/dashboard"));
  }

  function routeContent(routePath) {
    if (routePath === "/" || routePath === "") return renderLogin();
    if (routePath === "/login") return renderLogin();
    if (routePath === "/recuperar-password") return renderRecover();
    if (routePath === "/ativar-conta") return renderActivate();
    const route = routePath.split("?")[0];
    const match = (regex) => route.match(regex);
    let m;
    if (route === "/dashboard") return shell(renderDashboard(), route);
    if (route === "/clientes") return shell(renderClients(), route);
    if (route === "/clientes/novo") return shell(renderClientForm(), route);
    if ((m = match(/^\/clientes\/([^/]+)\/editar$/))) return shell(renderClientForm(client(m[1])), route);
    if ((m = match(/^\/clientes\/([^/]+)$/))) return shell(renderClientDetail(m[1]), route);
    if (route === "/processos") return shell(renderProcesses(), route);
    if (route === "/processos/pipeline") return shell(renderPipeline(), route);
    if (route === "/processos/novo") return shell(renderProcessForm(), route);
    if ((m = match(/^\/processos\/([^/]+)\/editar$/))) return shell(renderProcessForm(processItem(m[1])), route);
    if ((m = match(/^\/processos\/([^/]+)$/))) return shell(renderProcessDetail(m[1]), route);
    if (route === "/contactos/novo") return shell(renderContactForm(), route);
    if ((m = match(/^\/contactos\/([^/]+)\/editar$/))) return shell(renderContactForm(contact(m[1])), route);
    if ((m = match(/^\/contactos\/([^/]+)$/))) return shell(renderContactDetail(m[1]), route);
    if (route === "/propostas") return shell(renderProposals(), route);
    if (route === "/propostas/nova") return shell(renderProposalForm(), route);
    if ((m = match(/^\/propostas\/([^/]+)\/editar$/))) return shell(renderProposalForm(proposal(m[1])), route);
    if ((m = match(/^\/propostas\/([^/]+)$/))) return shell(renderProposalDetail(m[1]), route);
    if (route === "/contratos") return shell(renderContracts(), route);
    if (route === "/contratos/novo") return shell(renderContractForm(), route);
    if ((m = match(/^\/contratos\/([^/]+)\/editar$/))) return shell(renderContractForm(contract(m[1])), route);
    if ((m = match(/^\/contratos\/([^/]+)$/))) return shell(renderContractDetail(m[1]), route);
    if (route === "/encerrados") return shell(renderClosedList(), route);
    if ((m = match(/^\/encerrados\/([^/]+)$/))) return shell(renderClosedDetail(m[1]), route);
    if (route === "/utilizadores") return shell(renderUsers(), route);
    if (route === "/utilizadores/novo") return shell(renderUserForm(), route);
    if ((m = match(/^\/utilizadores\/([^/]+)\/editar$/))) return shell(renderUserForm(user(m[1])), route);
    if (route === "/perfis") return shell(renderProfiles(), route);
    if (route === "/perfis/permissoes") return shell(renderPermissions(), route);
    if (route === "/documentos") return shell(renderDocuments(), route);
    if (route === "/documentos/novo") return shell(renderDocumentForm(), route);
    if ((m = match(/^\/documentos\/([^/]+)$/))) return shell(renderDocumentDetail(m[1]), route);
    if (route === "/website/configuracao") return shell(renderWebsiteConfig(), route);
    if (route === "/website/submissoes") return shell(renderWebsiteSubmissions(), route);
    if (route === "/importacoes/nova") return shell(renderImport("nova"), route);
    if (route === "/importacoes/mapear") return shell(renderImport("mapear"), route);
    if (route === "/importacoes/validar") return shell(renderImport("validar"), route);
    if (route === "/importacoes/resultado") return shell(renderImport("resultado"), route);
    if (route === "/relatorios") return shell(renderReports(), route);
    if (route === "/relatorios/exportar") return shell(renderExport(), route);
    if (route === "/auditoria") return shell(renderAudit(), route);
    if (route === "/perfil") return shell(renderProfile(), route);
    if (route === "/configuracoes") return shell(renderSettings(), route);
    return shell(missing("A rota pedida não existe na demonstração."), route);
  }

  function render() {
    document.getElementById("app").innerHTML = routeContent(path());
    document.body.classList.remove("sidebar-open");
  }

  function formData(form) {
    return Object.fromEntries(new FormData(form).entries());
  }

  function nextId(prefix, list) {
    return `${prefix}${list.length + 1 + Math.floor(Math.random() * 1000)}`;
  }

  function addAudit(action, module, record, before, after) {
    state.auditLogs.unshift({ id: nextId("a", state.auditLogs), date: new Date().toLocaleString("pt-PT"), user: "António Marques", action, module, record, before, after });
  }

  function attachEvents() {
    document.addEventListener("submit", (event) => {
      const form = event.target.closest("form[data-form]");
      if (!form) return;
      event.preventDefault();
      handleForm(form.dataset.form, formData(form), form.dataset.id || "");
    });

    document.addEventListener("click", (event) => {
      const target = event.target.closest("[data-action]");
      if (!target) return;
      const action = target.dataset.action;
      if (action === "toggle-sidebar") {
        settings.sidebarCollapsed = !settings.sidebarCollapsed;
        saveSettings();
        render();
      }
      if (action === "mobile-sidebar") document.body.classList.toggle("sidebar-open");
      if (action === "tab") {
        currentTab[target.dataset.key] = target.dataset.tab;
        render();
      }
      if (action === "move-process") moveProcess(target.dataset.id, Number(target.dataset.dir));
      if (action === "cycle-status") cycleStatus(target.dataset.id);
      if (action === "approve-proposal") confirmApprove(target.dataset.id);
      if (action === "permission") {
        state.permissions[target.dataset.module][target.dataset.role] = target.checked;
        saveState();
        toast("Permissões guardadas.");
      }
      if (action === "toggle-user") toggleUser(target.dataset.id);
      if (action === "submission") showSubmission(target.dataset.id);
      if (action === "audit") showAudit(target.dataset.id);
      if (action === "fake-download") fakeDownload();
      if (action === "export-csv") exportCsv();
      if (action === "reset-demo") resetDemo();
      if (action === "logout") {
        state.session = false;
        saveState();
        go("/login");
      }
      if (action === "notify") toast("3 notificações fictícias: proposta aprovada, documento recebido, contacto pendente.");
      if (action === "toast") toast(target.dataset.message || "Ação simulada.");
      if (action === "modal-close") closeModal();
      if (action === "confirm-approve") approveProposal(target.dataset.id);
    });

    document.addEventListener("input", (event) => {
      if (event.target && event.target.id === "global-search") updateSearch(event.target.value);
      if (event.target && event.target.name === "nif") checkNif(event.target);
      if (event.target && event.target.matches("[data-filter]")) applyVisualFilters();
    });

    document.addEventListener("change", (event) => {
      if (event.target && event.target.matches("[data-filter]")) applyVisualFilters();
    });
  }

  function handleForm(type, data, id) {
    if (type === "login") {
      state.session = true;
      saveState();
      go("/dashboard");
      return;
    }
    if (type === "recover") return toast("Link de recuperação enviado de forma simulada.");
    if (type === "activate") {
      toast("Conta ativada de forma simulada.");
      go("/login");
      return;
    }
    if (type === "client-new" || type === "client-edit") return saveClient(type, data, id);
    if (type === "process-new" || type === "process-edit") return saveProcess(type, data, id);
    if (type === "contact-new" || type === "contact-edit") return saveContact(type, data, id);
    if (type === "proposal-new" || type === "proposal-edit") return saveProposal(type, data, id);
    if (type === "contract-new" || type === "contract-edit") return saveContract(type, data, id);
    if (type === "document-new") return saveDocument(data);
    if (type === "user-new" || type === "user-edit") return saveUser(type, data, id);
    if (type === "profile") return toast("Perfil guardado de forma simulada.");
    if (type === "settings") {
      settings = { ...settings, ...data };
      saveSettings();
      toast("Configurações guardadas.");
      render();
    }
  }

  function saveClient(type, data, id) {
    if (type === "client-new") {
      const existing = state.clients.find((c) => c.nif === data.nif);
      if (existing) {
        toast("Este NIF já está associado a um cliente.");
      }
      const newClient = { id: nextId("c", state.clients), lastActivity: new Date().toISOString().slice(0, 10), ...data };
      state.clients.unshift(newClient);
      addAudit("Criou cliente", "Clientes", newClient.name, "-", "Criado");
      saveState();
      toast("Cliente guardado.");
      go(`/clientes/${newClient.id}`);
      return;
    }
    const item = client(id);
    Object.assign(item, data, { lastActivity: new Date().toISOString().slice(0, 10) });
    addAudit("Editou cliente", "Clientes", item.name, "Dados anteriores", "Dados atualizados");
    saveState();
    toast("Alterações guardadas.");
    go(`/clientes/${id}`);
  }

  function saveProcess(type, data, id) {
    let selectedClient = data.clientId;
    if (data.quickClient) {
      const quick = { id: nextId("c", state.clients), name: data.quickClient, nif: `99988${state.clients.length}`, phone: "", email: "", address: "", status: "Ativo", rgpd: "Consentimento pendente", responsibleId: data.responsibleId, lastActivity: new Date().toISOString().slice(0, 10), notes: "Criado rapidamente em processo." };
      state.clients.unshift(quick);
      selectedClient = quick.id;
    }
    if (type === "process-new") {
      const item = { id: nextId("p", state.processes), number: `F2W-2026-${String(200 + state.processes.length).padStart(4, "0")}`, updatedAt: new Date().toISOString().slice(0, 10), origin: "Manual", closeReason: "", history: [{ date: new Date().toLocaleString("pt-PT"), user: "António Marques", text: "Processo criado na demo." }], ...data, clientId: selectedClient, amount: Number(data.amount), term: Number(data.term) };
      delete item.quickClient;
      state.processes.unshift(item);
      addAudit("Criou processo", "Processos", item.number, "-", item.status);
      saveState();
      toast("Processo guardado.");
      go(`/processos/${item.id}`);
      return;
    }
    const item = processItem(id);
    Object.assign(item, data, { clientId: selectedClient, amount: Number(data.amount), term: Number(data.term), updatedAt: new Date().toISOString().slice(0, 10) });
    delete item.quickClient;
    item.history.unshift({ date: new Date().toLocaleString("pt-PT"), user: "António Marques", text: "Processo editado." });
    saveState();
    toast("Processo atualizado.");
    go(`/processos/${id}`);
  }

  function saveContact(type, data, id) {
    if (type === "contact-new") {
      const item = { id: nextId("i", state.contacts), ...data };
      state.contacts.unshift(item);
      const p = processItem(data.processId);
      if (p.id) p.history.unshift({ date: data.date, user: user(data.userId).name, text: `${data.type}: ${data.result}` });
      saveState();
      toast("Contacto registado.");
      go(`/contactos/${item.id}`);
      return;
    }
    Object.assign(contact(id), data);
    saveState();
    toast("Contacto atualizado.");
    go(`/contactos/${id}`);
  }

  function saveProposal(type, data, id) {
    if (type === "proposal-new") {
      const item = { id: nextId("pr", state.proposals), ...data, amount: Number(data.amount), term: Number(data.term), monthly: Number(data.monthly) };
      state.proposals.unshift(item);
      saveState();
      toast("Proposta criada.");
      go(`/propostas/${item.id}`);
      return;
    }
    const before = proposal(id).status;
    Object.assign(proposal(id), data, { amount: Number(data.amount), term: Number(data.term), monthly: Number(data.monthly) });
    if (data.status === "Aprovada" && before !== "Aprovada") approveProposal(id, true);
    saveState();
    toast("Proposta guardada.");
    go(`/propostas/${id}`);
  }

  function saveContract(type, data, id) {
    if (type === "contract-new") {
      const item = { id: nextId("ct", state.contracts), number: `APV-${String(90 + state.contracts.length).padStart(4, "0")}`, ...data, amount: Number(data.amount), term: Number(data.term), monthly: Number(data.monthly) };
      state.contracts.unshift(item);
      saveState();
      toast("Contrato criado.");
      go(`/contratos/${item.id}`);
      return;
    }
    Object.assign(contract(id), data, { amount: Number(data.amount), term: Number(data.term), monthly: Number(data.monthly) });
    saveState();
    toast("Contrato atualizado.");
    go(`/contratos/${id}`);
  }

  function saveDocument(data) {
    const item = { id: nextId("d", state.documents), fileName: data.name, ...data };
    state.documents.unshift(item);
    const p = processItem(data.processId);
    if (p.id) p.history.unshift({ date: new Date().toLocaleString("pt-PT"), user: user(data.responsibleId).name, text: `Documento adicionado: ${data.name}` });
    saveState();
    toast(data.origin === "My Cloud" ? "Link My Cloud adicionado." : "Documento adicionado.");
    go(`/documentos/${item.id}`);
  }

  function saveUser(type, data, id) {
    if (type === "user-new") {
      const item = { id: nextId("u", state.users), lastAccess: "Convite pendente", ...data };
      state.users.push(item);
      saveState();
      toast("Utilizador criado e convite simulado enviado.");
      go("/utilizadores");
      return;
    }
    Object.assign(user(id), data);
    saveState();
    toast("Utilizador atualizado.");
    go("/utilizadores");
  }

  function moveProcess(id, dir) {
    const item = processItem(id);
    const next = Math.max(0, Math.min(phases.length - 1, phaseIndex(item.phase) + dir));
    const before = item.phase;
    item.phase = phases[next];
    item.updatedAt = new Date().toISOString().slice(0, 10);
    if (item.phase === "Encerrado" && !item.status.includes("Encerrado")) item.status = "Encerrado com contrato";
    item.history.unshift({ date: new Date().toLocaleString("pt-PT"), user: "António Marques", text: `Movido de ${before} para ${item.phase}.` });
    addAudit("Moveu processo", "Processos", item.number, before, item.phase);
    saveState();
    toast("Processo movido no pipeline.");
    render();
  }

  function cycleStatus(id) {
    const item = processItem(id);
    const next = statuses[(statuses.indexOf(item.status) + 1) % statuses.length];
    const before = item.status;
    item.status = next;
    item.history.unshift({ date: new Date().toLocaleString("pt-PT"), user: "António Marques", text: `Estado alterado de ${before} para ${next}.` });
    saveState();
    toast("Estado atualizado.");
    render();
  }

  function confirmApprove(id) {
    const p = proposal(id);
    showModal(`<h2>Aprovar proposta</h2><p>A demo vai simular o envio automático de email de aprovação para ${esc(client(p.clientId).email)}.</p><div class="actions"><button class="btn" data-action="confirm-approve" data-id="${esc(id)}">Confirmar aprovação</button><button class="btn secondary" data-action="modal-close">Cancelar</button></div>`);
  }

  function approveProposal(id, silent) {
    const prop = proposal(id);
    if (!prop.id) return;
    prop.status = "Aprovada";
    const p = processItem(prop.processId);
    if (p.id) {
      p.phase = "Contrato / APV";
      p.status = "Contrato em preparação";
      p.history.unshift({ date: new Date().toLocaleString("pt-PT"), user: "Sistema demo", text: "Proposta aprovada. Email de aprovação enviado de forma simulada." });
    }
    addAudit("Aprovou proposta", "Propostas", prop.number, "Em análise", "Aprovada");
    saveState();
    closeModal();
    toast("Email de aprovação enviado.");
    if (!silent) render();
  }

  function toggleUser(id) {
    const u = user(id);
    u.status = u.status === "Ativo" ? "Inativo" : "Ativo";
    saveState();
    toast("Estado do utilizador alterado.");
    render();
  }

  function checkNif(input) {
    const form = input.closest("form");
    if (!form || form.dataset.form !== "client-new") return;
    const found = state.clients.find((c) => c.nif === input.value);
    const host = document.getElementById("nif-warning");
    if (!host) return;
    if (!found) {
      host.innerHTML = "";
      return;
    }
    const last = state.processes.find((p) => p.clientId === found.id);
    host.innerHTML = `<div class="notice warning"><strong>Este NIF já está associado a um cliente.</strong><br>Cliente existente: ${esc(found.name)}<br>Último processo: ${esc(last ? last.number : "Sem processo")}<br>Fase onde parou: ${esc(last ? last.phase : "N/A")}<p class="actions"><a class="btn small" href="#/clientes/${found.id}">Abrir cliente existente</a><a class="btn small secondary" href="#/processos/novo?client=${found.id}">Criar novo processo para este cliente</a></p></div>`;
  }

  function updateSearch(query) {
    const host = document.getElementById("search-results");
    if (!host) return;
    const q = query.trim().toLowerCase();
    if (!q) {
      host.hidden = true;
      host.innerHTML = "";
      return;
    }
    const contains = (value) => String(value || "").toLowerCase().includes(q);
    const groups = [
      ["Clientes", state.clients.filter((c) => [c.name, c.nif, c.email, c.phone].some(contains)).slice(0, 5).map((c) => [c.name, c.nif, `/clientes/${c.id}`])],
      ["Processos", state.processes.filter((p) => [p.number, client(p.clientId).name, client(p.clientId).nif].some(contains)).slice(0, 5).map((p) => [p.number, client(p.clientId).name, `/processos/${p.id}`])],
      ["Propostas", state.proposals.filter((p) => [p.number, client(p.clientId).name].some(contains)).slice(0, 5).map((p) => [p.number, p.status, `/propostas/${p.id}`])],
      ["Contratos", state.contracts.filter((c) => [c.number, client(c.clientId).name].some(contains)).slice(0, 5).map((c) => [c.number, c.status, `/contratos/${c.id}`])]
    ].filter(([, items]) => items.length);
    host.hidden = false;
    host.innerHTML = groups.length ? groups.map(([label, items]) => `<div class="search-group-title">${esc(label)}</div>${items.map(([title, desc, href]) => `<a class="search-result" href="#${href}"><strong>${esc(title)}</strong><br><span class="meta">${esc(desc)}</span></a>`).join("")}`).join("") : `<div class="empty-state">Nenhum resultado encontrado.</div>`;
  }

  function applyVisualFilters() {
    const values = Array.from(document.querySelectorAll("[data-filter]")).map((input) => input.value.trim().toLowerCase()).filter(Boolean);
    const rows = Array.from(document.querySelectorAll(".content tbody tr"));
    rows.forEach((row) => {
      const text = row.textContent.toLowerCase();
      row.style.display = values.every((value) => text.includes(value)) ? "" : "none";
    });
  }

  function showSubmission(id) {
    const s = state.websiteSubmissions.find((item) => item.id === id);
    if (!s) return;
    showDrawer("Submissão do website", summaryGrid([["Nome", s.name], ["NIF", s.nif], ["Email", s.email], ["Telefone", s.phone], ["Produto", s.product], ["Estado", badge(s.status)], ["Cliente criado", s.clientCreated ? "Sim" : "Não"], ["Processo criado", s.processCreated ? "Sim" : "Não"], ["Possível erro", s.error || "Sem erro"]]));
  }

  function showAudit(id) {
    const a = state.auditLogs.find((item) => item.id === id);
    if (!a) return;
    showDrawer("Detalhe da auditoria", summaryGrid([["Data", a.date], ["Utilizador", a.user], ["Ação", a.action], ["Módulo", a.module], ["Registo", a.record], ["Valor anterior", a.before], ["Novo valor", a.after]]));
  }

  function showModal(content) {
    document.getElementById("modal-root").innerHTML = `<div class="modal-backdrop"><section class="modal">${content}</section></div>`;
  }

  function showDrawer(title, content) {
    document.getElementById("modal-root").innerHTML = `<div class="drawer-backdrop"><aside class="drawer"><div class="page-header"><div><h2>${esc(title)}</h2><p class="page-desc">Detalhe fictício da demonstração.</p></div><button class="icon-btn" data-action="modal-close">×</button></div>${content}</aside></div>`;
  }

  function closeModal() {
    document.getElementById("modal-root").innerHTML = "";
  }

  function toast(message) {
    const root = document.getElementById("toast-root");
    const node = document.createElement("div");
    node.className = "toast";
    node.textContent = message;
    root.appendChild(node);
    setTimeout(() => node.remove(), 3200);
  }

  function fakeDownload() {
    toast("Download simulado. Nenhum ficheiro real foi obtido.");
  }

  function exportCsv() {
    const rows = [["Nome", "NIF", "Email", "Telefone", "Estado"]].concat(state.clients.map((c) => [c.name, c.nif, c.email, c.phone, c.status]));
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "finance2win-demo-clientes.csv";
    link.click();
    URL.revokeObjectURL(url);
    toast("CSV gerado no navegador.");
  }

  window.addEventListener("hashchange", render);
  attachEvents();
  if (!window.location.hash) window.location.hash = "#/login";
  render();
})();
