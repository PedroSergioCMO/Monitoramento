from flask import Flask, render_template, request, jsonify, redirect, url_for, send_from_directory
from ping3 import ping
import json
import os

app = Flask(__name__, static_folder='static')
ARQUIVO_JSON = 'equipamentos.json'

# Lista de categorias disponíveis
CATEGORIAS = {
    'armario': 'Armário Inteligente',
    'servidor': 'Servidores',
    'equipamento': 'Equipamentos',
    'atm': 'ATM\'s',
    'iot': 'IOT\'s'
}

def carregar_equipamentos():
    if os.path.exists(ARQUIVO_JSON):
        with open(ARQUIVO_JSON, 'r') as f:
            return json.load(f)
    return []

def salvar_equipamentos(equipamentos):
    with open(ARQUIVO_JSON, 'w') as f:
        json.dump(equipamentos, f, indent=4)

equipamentos = carregar_equipamentos()

@app.route('/')
def index():
    return render_template('monitor.html')

@app.route('/cadastro')
def cadastro_page():
    return render_template('cadastro.html', categorias=CATEGORIAS)

@app.route('/gerenciar')
def gerenciar_page():
    return render_template('gerenciar.html', equipamentos=equipamentos, categorias=CATEGORIAS)

@app.route('/cadastro', methods=['POST'])
def cadastro():
    nome = request.form['nome']
    ip = request.form['ip']
    imagem = request.form['imagem']
    categoria = request.form['categoria']
    
    # Verifica se a categoria é válida
    if categoria not in CATEGORIAS:
        categoria = 'equipamento'  # Categoria padrão
    
    equipamentos.append({
        'nome': nome,
        'ip': ip,
        'imagem': imagem,
        'categoria': categoria,
        'status': 'offline'
    })
    salvar_equipamentos(equipamentos)
    return redirect(url_for('index'))

@app.route('/add', methods=['POST'])
def add():
    data = request.get_json()
    
    # Verifica se a categoria é válida
    categoria = data.get('categoria', 'equipamento')
    if categoria not in CATEGORIAS:
        categoria = 'equipamento'  # Categoria padrão
    
    equipamentos.append({
        'nome': data['nome'],
        'ip': data['ip'],
        'imagem': data['imagem'],
        'categoria': categoria,
        'status': 'offline'
    })
    salvar_equipamentos(equipamentos)
    return jsonify({'status': 'ok'})

@app.route('/update', methods=['POST'])
def update():
    data = request.get_json()
    ip_original = data['ip_original']
    
    # Verifica se a nova categoria é válida
    nova_categoria = data.get('nova_categoria', 'equipamento')
    if nova_categoria not in CATEGORIAS:
        nova_categoria = 'equipamento'  # Categoria padrão
    
    for eq in equipamentos:
        if eq['ip'] == ip_original:
            eq['nome'] = data['novo_nome']
            eq['ip'] = data['novo_ip']
            eq['imagem'] = data['nova_imagem']
            eq['categoria'] = nova_categoria
            break
    
    salvar_equipamentos(equipamentos)
    return jsonify({'status': 'updated'})

@app.route('/equipamentos')
def get_equipamentos():
    for eq in equipamentos:
        resposta = ping(eq['ip'], timeout=1)
        eq['status'] = 'online' if resposta else 'offline'
    return jsonify(equipamentos)

@app.route('/delete', methods=['POST'])
def delete():
    data = request.get_json()
    ip = data['ip']
    global equipamentos
    equipamentos = [eq for eq in equipamentos if eq['ip'] != ip]
    salvar_equipamentos(equipamentos)
    return jsonify({'status': 'deleted'})

# Adicione estas rotas se necessário
@app.route('/static/js/select2.min.js')
def serve_select2_js():
    return send_from_directory('static/js', 'select2.min.js')

@app.route('/static/css/select2.min.css')
def serve_select2_css():
    return send_from_directory('static/css', 'select2.min.css')

if __name__ == '__main__':
    app.run(debug=True)