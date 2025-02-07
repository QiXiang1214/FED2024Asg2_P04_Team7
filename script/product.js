// Image Thumbnail Interaction
document.querySelectorAll('.thumbnail').forEach(thumb => {
    thumb.addEventListener('click', function() {
        // Remove active class from all thumbnails
        document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked thumbnail
        this.classList.add('active');
        
        // Update main image
        const mainImage = document.getElementById('mainProductImage');
        mainImage.src = this.src;
        mainImage.alt = this.alt;
    });
});

// Add to Cart Functionality
document.querySelector('.add-to-cart-btn').addEventListener('click', function() {
    // Add your cart logic here
    console.log('Product added to cart');
    this.textContent = 'Added to Cart!';
    this.disabled = true;
    setTimeout(() => {
        this.textContent = 'Add to Cart';
        this.disabled = false;
    }, 2000);
});

// Chat Button Interaction
document.querySelector('.chat-seller-btn').addEventListener('click', function() {
    // Chat initiation logic
    console.log('Initiating chat with seller');
});