const express = require("express"); // Importa o framework Express para criar o servidor web
const { SerialPort } = require("serialport"); // Importa a biblioteca SerialPort para comunicação com dispositivos seriais
const { ReadlineParser } = require("@serialport/parser-readline"); // Importa o parser para processar os dados recebidos da porta serial
const cors = require("cors"); // Importa o CORS para permitir requisições de diferentes origens

const app = express(); // Inicializa a aplicação Express
app.use(cors()); // Habilita o CORS para evitar bloqueios de requisição entre diferentes domínios

// ⚠️ Certifique-se de alterar "COM3" para a porta correta no seu PC
// Exemplo para Linux: "/dev/ttyUSB0"
const port = new SerialPort({ path: "COM3", baudRate: 9600 }); // Configura a porta serial com a taxa de transmissão de 9600 baud
const parser = port.pipe(new ReadlineParser({ delimiter: "\n" })); // Cria um parser para ler os dados da porta serial linha por linha

// Objeto para armazenar os últimos dados recebidos do sensor
let lastData = { temperatura: 0, umidade: 0, chuva: "Desconhecido" };

// Evento acionado ao receber dados pela porta serial
parser.on("data", (data) => {
  try {
    const jsonData = JSON.parse(data); // Tenta converter a string recebida em JSON
    lastData = jsonData; // Atualiza os últimos dados recebidos
  } catch (err) {
    console.error("Erro ao processar JSON:", err); // Captura erros na conversão de JSON e exibe no console
  }
});

// Rota HTTP GET para fornecer os últimos dados recebidos via porta serial
app.get("/dados", (req, res) => {
  res.json(lastData); // Retorna os dados armazenados no formato JSON
});

// Inicia o servidor na porta 3000 e exibe a URL no console
app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"));
