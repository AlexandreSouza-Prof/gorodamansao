const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Se não estivermos no Vercel, serve os estáticos pelo Express
if (!process.env.VERCEL) {
    app.use(express.static(path.join(__dirname)));
}

// Dados em memória (Mock) para rodar no Vercel sem quebrar
const productsMock = [
    { id: 1, name: "Goró Original", description: "0% Estimulantes, 100% Vibe. O clássico da Mansão.", price: 12.90, image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuA_JJsYigz7abbkVXKOUqM1zO5T7YgVg7kwr3pbuvJaphAAwI3-kJ0ysbpmFMKIojZdDgC1UdmUy0HZM3rrCQMJmfw029hsQIRUH-bQqJ7VgEEoMB_6wAvjnUUGVIkYCWqxNsRUJjRfWH8RJtGhBLjsBsAyW-hL4fXpxObPfhnlpfWUYZgkPX2fLOLuNLTHU7pViOMTHHSF7woY0AnkSG0K_N8zwqHfiKMl3LazyK0fHKb70iTQqoa0nhjhyeJ1_S19TV18vs64yw", category: "Energéticos" },
    { id: 2, name: "Goró Zero Sugar", description: "O sabor da vitória sem açúcar e sem calorias.", price: 14.90, image_url: "/goro_zero.png", category: "Energéticos" },
    { id: 3, name: "Monstro Juice", description: "Fórmula hardcore para treinos intensos.", price: 19.90, image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCL42T2Win-7zZIKLB4hFJHHTPYwpSUxRIUkfoc1x2xjT8bmz472CBEgHlkjYMxve4rPsQh58cy2j1mgGD3jz5DvBXtr02zFNifiKU5-UTdO-3-6M-8b-N2tIIiJ_xbzsNUOs3ljwl4_DCgfJ-bQD_a2DLyCoyi01jfxsz1IZ8YcJtBQhNeSA339nVU788x-8xmJLNM1i5YKrKr04NutUgUUmgb6BDVgRovFZtmP_dB1Y_8NVLWRZTI8bgMZjZeDle5zPj9iGnwtQ", category: "Elite" },
    { id: 4, name: "Gold Reserve", description: "Edição limitada com eletrólitos premium.", price: 24.90, image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCnfDEaLPF422u0HBQbpWK-BdDCiXgoJMxnHXn2UhD5LQEzTHU77RsSPCRxMgDoF5oh_3vQbyTtD8L6VWGgEkib1dNBc4bh_F6oWCMxkJWfyiA1GxBS4xeo20snr1mSM1xjFcaPERcKnqyrFYSWz4r0UUs_j2MYbaOiN2Exk9awZ0nYavsOhFW3Tl2tyNRrTFMqWuyd9PVKnhjlodkhWJn4WcMmVplazprXzkwj563eGKiJdlmBPvkCsEFsI76NOP2cauxt-XF2FA", category: "Elite" },
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

// Rota principal para servir o frontend apenas fora do Vercel
if (!process.env.VERCEL) {
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'index.html'));
    });
}

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
}

module.exports = app;
