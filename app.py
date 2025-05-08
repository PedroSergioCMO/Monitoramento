from flask import Flask, render_template, request, jsonify, redirect, url_for, send_from_directory
from ping3 import ping
import json
import os

app = Flask(__name__, static_folder='static')
ARQUIVO_JSON = 'equipamentos.json'

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
    return render_template('cadastro.html')

@app.route('/gerenciar')
def gerenciar_page():
    return render_template('gerenciar.html', equipamentos=equipamentos)

@app.route('/cadastro', methods=['POST'])
def cadastro():
    nome = request.form['nome']
    ip = request.form['ip']
    imagem = request.form['imagem']
    equipamentos.append({'nome': nome, 'ip': ip, 'imagem': imagem, 'status': 'offline'})
    salvar_equipamentos(equipamentos)
    return redirect(url_for('index'))

@app.route('/add', methods=['POST'])
def add():
    data = request.get_json()
    equipamentos.append({
        'nome': data['nome'],
        'ip': data['ip'],
        'imagem': data['imagem'],
        'status': 'offline'
    })
    salvar_equipamentos(equipamentos)
    return jsonify({'status': 'ok'})

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

if __name__ == '__main__':
    app.run(debug=True)