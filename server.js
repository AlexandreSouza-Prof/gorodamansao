const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Conexão com o Banco de Dados
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Erro ao conectar ao SQLite:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
        initializeDatabase();
    }
});

// Inicialização do Banco de Dados
function initializeDatabase() {
    db.serialize(() => {
        // Tabela de Produtos
        db.run(`CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            price REAL NOT NULL,
            image_url TEXT,
            category TEXT
        )`);

        // Tabela de Pedidos
        db.run(`CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_name TEXT NOT NULL,
            customer_email TEXT,
            total_price REAL NOT NULL,
            status TEXT DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Tabela de Itens do Pedido
        db.run(`CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER,
            product_id INTEGER,
            quantity INTEGER,
            price REAL,
            FOREIGN KEY (order_id) REFERENCES orders (id),
            FOREIGN KEY (product_id) REFERENCES products (id)
        )`);

        // Inserir dados de exemplo se a tabela estiver vazia
        db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
            if (row.count === 0) {
                const stmt = db.prepare("INSERT INTO products (name, description, price, image_url, category) VALUES (?, ?, ?, ?, ?)");
                stmt.run("Goró Original", "0% Estimulantes, 100% Vibe. O clássico da Mansão.", 12.90, "https://lh3.googleusercontent.com/aida-public/AB6AXuA_JJsYigz7abbkVXKOUqM1zO5T7YgVg7kwr3pbuvJaphAAwI3-kJ0ysbpmFMKIojZdDgC1UdmUy0HZM3rrCQMJmfw029hsQIRUH-bQqJ7VgEEoMB_6wAvjnUUGVIkYCWqxNsRUJjRfWH8RJtGhBLjsBsAyW-hL4fXpxObPfhnlpfWUYZgkPX2fLOLuNLTHU7pViOMTHHSF7woY0AnkSG0K_N8zwqHfiKMl3LazyK0fHKb70iTQqoa0nhjhyeJ1_S19TV18vs64yw", "Energéticos");
                stmt.run("Goró Zero Sugar", "O sabor da vitória sem açúcar e sem calorias.", 14.90, "/goro_zero.png", "Energéticos");
                stmt.run("Monstro Juice", "Fórmula hardcore para treinos intensos.", 19.90, "https://lh3.googleusercontent.com/aida-public/AB6AXuCL42T2Win-7zZIKLB4hFJHHTPYwpSUxRIUkfoc1x2xjT8bmz472CBEgHlkjYMxve4rPsQh58cy2j1mgGD3jz5DvBXtr02zFNifiKU5-UTdO-3-6M-8b-N2tIIiJ_xbzsNUOs3ljwl4_DCgfJ-bQD_a2DLyCoyi01jfxsz1IZ8YcJtBQhNeSA339nVU788x-8xmJLNM1i5YKrKr04NutUgUUmgb6BDVgRovFZtmP_dB1Y_8NVLWRZTI8bgMZjZeDle5zPj9iGnwtQ", "Elite");
                stmt.run("Gold Reserve", "Edição limitada com eletrólitos premium.", 24.90, "https://lh3.googleusercontent.com/aida-public/AB6AXuCnfDEaLPF422u0HBQbpWK-BdDCiXgoJMxnHXn2UhD5LQEzTHU77RsSPCRxMgDoF5oh_3vQbyTtD8L6VWGgEkib1dNBc4bh_F6oWCMxkJWfyiA1GxBS4xeo20snr1mSM1xjFcaPERcKnqyrFYSWz4r0UUs_j2MYbaOiN2Exk9awZ0nYavsOhFW3Tl2tyNRrTFMqWuyd9PVKnhjlodkhWJn4WcMmVplazprXzkwj563eGKiJdlmBPvkCsEFsI76NOP2cauxt-XF2FA", "Elite");
                stmt.run("Fella Energy", "A vibe da quebrada em cada gole.", 15.90, "/goro_fella.png", "Energéticos");
                stmt.finalize();
                console.log('Novos produtos inseridos.');
            }
        });
    });
}

// Rotas da API

// Listar produtos
app.get('/api/products', (req, res) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ products: rows });
    });
});

// Criar pedido
app.post('/api/orders', (req, res) => {
    const { customer_name, customer_email, items, total_price } = req.body;
    
    db.run(`INSERT INTO orders (customer_name, customer_email, total_price) VALUES (?, ?, ?)`,
        [customer_name, customer_email, total_price],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            const orderId = this.lastID;
            
            // Inserir itens do pedido
            const stmt = db.prepare(`INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`);
            items.forEach(item => {
                stmt.run(orderId, item.product_id, item.quantity, item.price);
            });
            stmt.finalize();
            
            res.json({ message: 'Pedido criado com sucesso', orderId });
        }
    );
});

// Rota principal para servir o frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
