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

// Add to cart animation
function initLottieAnimation() {
    const player = document.querySelector('dotlottie-player');
    const lottieContainer = document.getElementById('lottie-container');

    // Hide container initially
    lottieContainer.style.display = 'none';
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', initLottieAnimation);

// Update the handleAddToCart function
function handleAddToCart() {
    const lottieContainer = document.getElementById('lottie-container');
    const player = document.querySelector('dotlottie-player');
    
    // Show container and play animation
    lottieContainer.style.display = 'block';
    player.play();
    
    // Hide after animation completes
    setTimeout(() => {
        lottieContainer.style.display = 'none';
        player.stop();
    }, 3000); // 3 seconds to allow animation to complete
}

// Add click event listener to your add to cart button
document.querySelector('.add-to-cart-btn').addEventListener('click', handleAddToCart);

//Toggle Menu
document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    menuToggle.addEventListener("click", function () {
        navLinks.classList.toggle("active");
    });
});