document.addEventListener('DOMContentLoaded', function() {
    const productData = JSON.parse(sessionStorage.getItem('currentProduct'));
    const chatSellerBtn = document.getElementById('chatSellerBtn');

    if (!productData) {
        window.location.href = 'home.html';
        return;
    }

    // Update product details
    document.getElementById('mainProductImage').src = productData.image;
    document.querySelector('.product-title').textContent = productData.name;
    document.querySelector('.product-price').textContent = `$${productData.price}`;
    document.querySelector('.product-description p').textContent = productData.description;

    // Update seller information

    document.querySelector('.seller-details h3').textContent = productData.createdBy.username || "Unknown Seller";
    document.querySelector('.stat-item span').textContent = `Usually responds within 5 hours`;

    // Update chat button URL
    chatSellerBtn.addEventListener('click', () => {
        const sellerUsername = encodeURIComponent(productData.createdBy.username);
        window.location.href = `chat.html?seller=${sellerUsername}`;
    });
});