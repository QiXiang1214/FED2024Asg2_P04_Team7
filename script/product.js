document.addEventListener('DOMContentLoaded', function() {
    const productData = JSON.parse(sessionStorage.getItem('currentProduct'));
    
    if (!productData) {
        window.location.href = 'home.html';
        return;
    }

    // Update product details
    document.getElementById('mainProductImage').src = productData.image;
    document.querySelector('.product-title').textContent = productData.name;
    document.querySelector('.product-price').textContent = `$${productData.price}`;
    document.querySelector('.product-description p').textContent = productData.description;
    
    // Update rating
    const ratingContainer = document.querySelector('.rating');
    ratingContainer.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('i');
        star.className = i <= productData.rating ? 'fas fa-star' : 'far fa-star';
        ratingContainer.appendChild(star);
    }

    // Update specifications
    const specsList = document.querySelector('.product-specs ul');
    specsList.innerHTML = '';
    for (const [key, value] of Object.entries(productData.specs)) {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${key}:</strong> ${value}`;
        specsList.appendChild(li);
    }

    // Update seller information
    document.querySelector('.seller-avatar').src = productData.seller.avatar;
    document.querySelector('.seller-details h3').textContent = productData.seller.name;
    document.querySelector('.stat-item span').textContent = 
        `Usually responds within ${productData.seller.responseTime}`;
        
    // Update seller rating
    const sellerRatingContainer = document.querySelector('.seller-rating');
    sellerRatingContainer.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('i');
        star.className = i <= Math.floor(productData.seller.rating) ? 'fas fa-star' : 
                         (i === Math.ceil(productData.seller.rating) && !Number.isInteger(productData.seller.rating)) ? 
                         'fas fa-star-half-alt' : 'far fa-star';
        sellerRatingContainer.appendChild(star);
    }
    sellerRatingContainer.innerHTML += ` <span>${productData.seller.rating} (256 reviews)</span>`;
});