// Lógica do Frontend - Goró da Mansão

document.addEventListener('DOMContentLoaded', () => {
    console.log('App inicializado');
    
    // Carregar produtos se estivermos na página de catálogo
    if (document.getElementById('product-list')) {
        fetchProducts();
    }

    // Gerenciamento do Carrinho
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartBadge();

    // Event Delegation para botões de compra
    document.addEventListener('click', (e) => {
        if (e.target.innerText === 'ADQUIRIR AGORA' || e.target.closest('.add-to-cart')) {
            const product = {
                id: 1, // Exemplo
                name: 'Goró Original',
                price: 12.90
            };
            addToCart(product);
        }
    });
});

async function fetchProducts() {
    try {
        const response = await fetch('/api/products');
        const data = await response.json();
        const container = document.getElementById('product-list');
        
        if (container && data.products) {
            container.innerHTML = data.products.map(product => `
                <div class="bg-surface-container p-6 border border-white/5 group relative overflow-hidden">
                    <img src="${product.image_url}" alt="${product.name}" class="w-full aspect-square object-contain mb-4 transform group-hover:scale-110 transition-transform">
                    <h3 class="font-headline-md text-white mb-2">${product.name}</h3>
                    <p class="text-zinc-500 text-sm mb-4">${product.description}</p>
                    <div class="flex justify-between items-center">
                        <span class="text-primary-container font-black text-xl">R$ ${product.price.toFixed(2)}</span>
                        <button onclick="addToCart({id: ${product.id}, name: '${product.name}', price: ${product.price}})" class="bg-primary-container text-on-primary p-2 hover:scale-110 transition-transform">
                             <span class="material-symbols-outlined">add_shopping_cart</span>
                        </button>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
}

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    
    // Feedback visual
    alert(`${product.name} adicionado ao carrinho!`);
}

function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartBtn = document.getElementById('cart-button');

    if (cartBtn) {
        let badge = cartBtn.querySelector('.badge');
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'badge absolute -top-1 -right-1 bg-primary-container text-on-primary text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-[0_0_5px_rgba(204,255,0,0.5)]';
            cartBtn.appendChild(badge);
        }
        badge.innerText = cart.length;
        badge.style.display = cart.length > 0 ? 'flex' : 'none';
    }
}
