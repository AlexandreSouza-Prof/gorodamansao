const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Servir arquivos estáticos pelo Express (agora que o Vercel incluirá os arquivos)
app.use(express.static(path.join(__dirname)));

// Dados em memória (Mock) para rodar no Vercel sem quebrar
const productsMock = [
    { id: 1, name: "Goró Original", description: "0% Estimulantes, 100% Vibe. O clássico da Mansão.", price: 12.90, image_url: "/goro_hero_promo.png", category: "Energéticos" },
    { id: 2, name: "Goró Zero Sugar", description: "O sabor da vitória sem açúcar e sem calorias.", price: 14.90, image_url: "/goro_zero.png", category: "Energéticos" },
    { id: 3, name: "Monstro Juice", description: "Fórmula hardcore para treinos intensos.", price: 19.90, image_url: "/goro_vibe.png", category: "Elite" },
    { id: 4, name: "Gold Reserve", description: "Edição limitada com eletrólitos premium.", price: 24.90, image_url: "/goro_elite.png", category: "Elite" },
    { id: 5, name: "Fella Energy", description: "A vibe da quebrada em cada gole.", price: 15.90, image_url: "/goro_fella.png", category: "Energéticos" }
];

let ordersMock = [];

// Rotas da API

// Listar produtos
app.get('/api/products', (req, res) => {
    res.json({ products: productsMock });
});

// Criar pedido
app.post('/api/orders', (req, res) => {
    const { customer_name, customer_email, items, total_price } = req.body;
    
    const orderId = ordersMock.length + 1;
    ordersMock.push({
        id: orderId,
        customer_name,
        customer_email,
        items,
        total_price,
        status: 'pending',
        created_at: new Date().toISOString()
    });
    
    res.json({ message: 'Pedido criado com sucesso', orderId });
});

// Rota principal para servir o frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
}

module.exports = app;
