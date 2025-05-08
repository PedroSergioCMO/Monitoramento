async function adicionar() {
    const nome = document.getElementById("nome").value;
    const ip = document.getElementById("ip").value;
    const imagem = document.getElementById("imagem").value;
  
    if (!nome || !ip || !imagem) {
      alert("Preencha todos os campos.");
      return;
    }
  
    await fetch('/add', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({nome, ip, imagem})
    });
  
    document.getElementById("nome").value = "";
    document.getElementById("ip").value = "";
    document.getElementById("imagem").value = "";
    carregar();
  }
  
  async function carregar() {
    const res = await fetch('/equipamentos');
    const dados = await res.json();
    const lista = document.getElementById("lista");
    lista.innerHTML = "";
  
    dados.forEach(eq => {
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
          <button class="btn" onclick="abrirModalEdicao('${eq.nome}', '${eq.ip}', '${eq.imagem}')">Editar</button>
          <button class="btn" onclick="excluir('${eq.ip}')">Excluir</button>
        </div>
      `;
      lista.appendChild(div);
    });
  }
  
  function abrirModalEdicao(nome, ip, imagem) {
    document.getElementById('ip-original').value = ip;
    document.getElementById('editar-nome').value = nome;
    document.getElementById('editar-ip').value = ip;
    document.getElementById('editar-imagem').value = imagem;
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
  
    if (!novoNome || !novoIp || !novaImagem) {
      alert("Preencha todos os campos.");
      return;
    }
  
    await fetch('/update', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        ip_original: ipOriginal,
        novo_nome: novoNome,
        novo_ip: novoIp,
        nova_imagem: novaImagem
      })
    });
  
    fecharModal();
    carregar();
  }
  
  async function excluir(ip) {
    const confirmar = confirm("Deseja realmente excluir?");
    if (!confirmar) return;
  
    await fetch('/delete', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ ip })
    });
  
    carregar();
  }
  
  // Carrega a lista quando a página é aberta
  document.addEventListener('DOMContentLoaded', () => {
    carregar();
  });