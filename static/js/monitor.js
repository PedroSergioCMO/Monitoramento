// Configuração inicial
const CATEGORIAS = {
  'armario': { nome: 'Armários', icone: 'fa-box icon-armario' },
  'servidor': { nome: 'Servidores', icone: 'fa-server icon-servidor' },
  'equipamento': { nome: 'Equipamentos', icone: 'fa-desktop icon-equipamento' },
  'atm': { nome: 'ATM\'s', icone: 'fa-money-bill-wave icon-atm' },
  'iot': { nome: 'IoT', icone: 'fa-microchip icon-iot' }
};

let todosEquipamentos = [];
let filtrosAtivos = Object.keys(CATEGORIAS);

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  // Configura eventos do filtro
  document.getElementById('btn-filtrar').addEventListener('click', toggleFiltro);
  document.querySelectorAll('.filtro-option input').forEach(checkbox => {
    checkbox.addEventListener('change', verificarFiltros);
  });

  // Fecha o filtro ao clicar fora
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.filtro-wrapper')) {
      fecharFiltro();
    }
  });

  carregarEquipamentos();
  setInterval(carregarEquipamentos, 5000);
});

function toggleFiltro() {
  const dropdown = document.getElementById('filtro-dropdown');
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

function fecharFiltro() {
  document.getElementById('filtro-dropdown').style.display = 'none';
}

function verificarFiltros() {
  const checkboxes = document.querySelectorAll('.filtro-option input:checked');
  filtrosAtivos = Array.from(checkboxes).map(cb => cb.value);
}

function limparFiltros() {
  document.querySelectorAll('.filtro-option input').forEach(checkbox => {
    checkbox.checked = true;
  });
  filtrosAtivos = Object.keys(CATEGORIAS);
  aplicarFiltros();
  fecharFiltro();
}

function aplicarFiltros() {
  verificarFiltros();
  exibirEquipamentos();
  fecharFiltro();
}

async function carregarEquipamentos() {
  try {
    const response = await fetch('/equipamentos');
    if (!response.ok) throw new Error('Erro na rede');
    
    todosEquipamentos = await response.json();
    exibirEquipamentos();
    
  } catch (error) {
    console.error('Erro:', error);
    document.getElementById('monitor-container').innerHTML = `
      <div class="error">
        <i class="fas fa-exclamation-triangle"></i>
        <p>Erro ao carregar equipamentos</p>
      </div>
    `;
  }
}

function exibirEquipamentos() {
  const container = document.getElementById('monitor-container');
  
  // Filtra os equipamentos
  const equipamentosFiltrados = todosEquipamentos.filter(equip => 
    filtrosAtivos.includes(equip.categoria || 'equipamento')
  );

  if (equipamentosFiltrados.length === 0) {
    container.innerHTML = '<div class="no-equipments">Nenhum equipamento encontrado</div>';
    return;
  }

  // Agrupa por categoria
  const equipamentosPorCategoria = {};
  equipamentosFiltrados.forEach(equip => {
    const categoria = equip.categoria || 'equipamento';
    if (!equipamentosPorCategoria[categoria]) {
      equipamentosPorCategoria[categoria] = [];
    }
    equipamentosPorCategoria[categoria].push(equip);
  });

  // Cria as colunas
  container.innerHTML = '';
  for (const [categoriaId, equipamentos] of Object.entries(equipamentosPorCategoria)) {
    const categoriaInfo = CATEGORIAS[categoriaId] || {
      nome: categoriaId,
      icone: 'fa-tag'
    };

    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'category-container';
    
    categoryDiv.innerHTML = `
      <div class="category-header">
        <i class="fas ${categoriaInfo.icone} category-icon"></i>
        <span>${categoriaInfo.nome} (${equipamentos.length})</span>
      </div>
      <div class="equipment-list" id="lista-${categoriaId}"></div>
    `;

    container.appendChild(categoryDiv);
    
    // Adiciona os equipamentos
    const lista = categoryDiv.querySelector(`#lista-${categoriaId}`);
    equipamentos.forEach(equip => {
      const item = document.createElement('div');
      item.className = 'equipment-item';
      item.innerHTML = `
        <img src="${equip.imagem}" class="equipment-image" 
             onerror="this.src='https://via.placeholder.com/30?text=E'">
        <div class="equipment-info">
          <div class="equipment-name" title="${equip.nome}">${equip.nome}</div>
          <div class="equipment-ip">${equip.ip}</div>
        </div>
        <div class="equipment-status status-${equip.status}">${equip.status.toUpperCase()}</div>
      `;
      lista.appendChild(item);
    });
  }
}