async function atualizar() {
    try {
      const res = await fetch('/equipamentos');
      const equipamentos = await res.json();
      const monitor = document.getElementById('monitor');
      monitor.innerHTML = '';
  
      equipamentos.forEach(eq => {
        const div = document.createElement('div');
        div.className = 'equipamento';
        div.innerHTML = `
          <img src="${eq.imagem}" alt="Imagem" onerror="this.src='https://via.placeholder.com/70'">
          <div><strong>${eq.nome}</strong></div>
          <div>IP: ${eq.ip}</div>
          <div class="status ${eq.status}">${eq.status.toUpperCase()}</div>
        `;
        monitor.appendChild(div);
      });
    } catch (e) {
      console.error('Erro ao atualizar equipamentos:', e);
    }
  }
  
  // Inicia a atualização e configura o intervalo
  document.addEventListener('DOMContentLoaded', () => {
    atualizar();
    setInterval(atualizar, 5000);
  });