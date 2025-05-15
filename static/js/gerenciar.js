async function adicionar() {
  const nome = document.getElementById("nome").value;
  const ip = document.getElementById("ip").value;
  const imagem = document.getElementById("imagem").value;
  const categoria = document.getElementById("categoria").value;

  if (!nome || !ip || !imagem || !categoria) {
      alert("Preencha todos os campos.");
      return;
  }

  try {
      const response = await fetch('/add', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({nome, ip, imagem, categoria})
      });

      if (!response.ok) {
          throw new Error('Erro ao cadastrar equipamento');
      }

      // Limpar campos após cadastro
      document.getElementById("nome").value = "";
      document.getElementById("ip").value = "";
      document.getElementById("imagem").value = "";
      document.getElementById("categoria").value = "";
      
      // Atualizar lista
      await carregar();
      
      // Feedback visual
      alert("Equipamento cadastrado com sucesso!");
  } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao cadastrar equipamento. Verifique o console para mais detalhes.");
  }
}

async function carregar() {
  try {
      const res = await fetch('/equipamentos');
      if (!res.ok) {
          throw new Error('Erro ao carregar equipamentos');
      }
      
      const dados = await res.json();
      const lista = document.getElementById("lista");
      lista.innerHTML = "";

      // Agrupar por categoria para melhor organização
      const categorias = {};
      dados.forEach(eq => {
          if (!categorias[eq.categoria]) {
              categorias[eq.categoria] = [];
          }
          categorias[eq.categoria].push(eq);
      });

      // Criar seções para cada categoria
      for (const [categoria, equipamentos] of Object.entries(categorias)) {
          const categoriaSection = document.createElement("div");
          categoriaSection.className = "categoria-section";
          
          // Nome da categoria (traduzindo o valor para o nome exibido)
          const nomeCategoria = {
              'armario': 'Armário Inteligente',
              'servidor': 'Servidores',
              'equipamento': 'Equipamentos',
              'atm': 'ATM\'s',
              'iot': 'IOT\'s'
          }[categoria] || categoria;
          
          categoriaSection.innerHTML = `
              <h3 class="categoria-titulo">${nomeCategoria}</h3>
              <div class="equipamentos-container"></div>
          `;
          
          const container = categoriaSection.querySelector('.equipamentos-container');
          
          equipamentos.forEach(eq => {
              const div = document.createElement("div");
              div.className = "equipamento";
              div.innerHTML = `
                  <img src="${eq.imagem}" alt="img" onerror="this.src='https://via.placeholder.com/64'">
                  <div class="equipamento-info">
                      <div><strong>${eq.nome}</strong></div>
                      <div>IP: ${eq.ip}</div>
                      <div class="status ${eq.status}">${eq.status.toUpperCase()}</div>
                  </div>
                  <div class="equipamento-actions">
                      <button class="btn btn-edit" onclick="abrirModalEdicao('${eq.nome}', '${eq.ip}', '${eq.imagem}', '${eq.categoria}')">
                          <i class="fas fa-edit"></i> Editar
                      </button>
                      <button class="btn btn-delete" onclick="excluir('${eq.ip}')">
                          <i class="fas fa-trash"></i> Excluir
                      </button>
                  </div>
              `;
              container.appendChild(div);
          });
          
          lista.appendChild(categoriaSection);
      }
  } catch (error) {
      console.error("Erro ao carregar equipamentos:", error);
      alert("Erro ao carregar equipamentos. Verifique o console para mais detalhes.");
  }
}

function abrirModalEdicao(nome, ip, imagem, categoria) {
  document.getElementById('ip-original').value = ip;
  document.getElementById('editar-nome').value = nome;
  document.getElementById('editar-ip').value = ip;
  document.getElementById('editar-imagem').value = imagem;
  document.getElementById('editar-categoria').value = categoria;
  document.getElementById('modalEditar').style.display = 'flex';
}

function fecharModal() {
  document.getElementById('modalEditar').style.display = 'none';
}

async function salvarEdicao() {
  const ipOriginal = document.getElementById('ip-original').value;
  const novoNome = document.getElementById('editar-nome').value;
  const novoIp = document.getElementById('editar-ip').value;
  const novaImagem = document.getElementById('editar-imagem').value;
  const novaCategoria = document.getElementById('editar-categoria').value;

  if (!novoNome || !novoIp || !novaImagem || !novaCategoria) {
      alert("Preencha todos os campos.");
      return;
  }

  try {
      const response = await fetch('/update', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
              ip_original: ipOriginal,
              novo_nome: novoNome,
              novo_ip: novoIp,
              nova_imagem: novaImagem,
              nova_categoria: novaCategoria
          })
      });

      if (!response.ok) {
          throw new Error('Erro ao atualizar equipamento');
      }

      fecharModal();
      await carregar();
      alert("Equipamento atualizado com sucesso!");
  } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao atualizar equipamento. Verifique o console para mais detalhes.");
  }
}

async function excluir(ip) {
  const confirmar = confirm("Deseja realmente excluir este equipamento?");
  if (!confirmar) return;

  try {
      const response = await fetch('/delete', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ ip })
      });

      if (!response.ok) {
          throw new Error('Erro ao excluir equipamento');
      }

      await carregar();
      alert("Equipamento excluído com sucesso!");
  } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao excluir equipamento. Verifique o console para mais detalhes.");
  }
}

// Carrega a lista quando a página é aberta
document.addEventListener('DOMContentLoaded', () => {
  carregar();
  
  // Adiciona máscara para IP se necessário
  const ipInput = document.getElementById('ip');
  if (ipInput) {
      ipInput.addEventListener('input', function(e) {
          // Validação básica de formato IP
          this.value = this.value.replace(/[^0-9.]/g, '');
      });
  }
});