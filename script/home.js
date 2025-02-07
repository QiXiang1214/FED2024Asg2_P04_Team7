// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyCeZEByafoJgLvZDxc0DCuUIYL2_37XT2c",
    authDomain: "fed-assignment-2-54ec3.firebaseapp.com",
    projectId: "fed-assignment-2-54ec3",
    storageBucket: "fed-assignment-2-54ec3.firebasestorage.app",
    messagingSenderId: "398158834633",
    appId: "1:398158834633:web:c025708b57da0f4e109618",
    measurementId: "G-HC6YLQLFK5"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const productCards = document.querySelectorAll('.product-card');
    const productGrid = document.querySelector('.product-grid');
    const noResults = document.createElement('div');
    noResults.className = 'no-results';
    noResults.textContent = 'No products found matching your search.';
    productGrid.appendChild(noResults);
  
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase().trim();
      let hasVisibleProducts = false;
  
      productCards.forEach(card => {
        const title = card.querySelector('.product-title').textContent.toLowerCase();
        const description = card.querySelector('.product-description')?.textContent.toLowerCase() || '';
  
        if (title.includes(query) || description.includes(query)) {
          card.style.display = 'block';
          hasVisibleProducts = true;
        } else {
          card.style.display = 'none';
        }
      });
  
      noResults.style.display = hasVisibleProducts ? 'none' : 'block';
    });
  });

  document.addEventListener('DOMContentLoaded', () => {
    const filterSelect = document.querySelector('.filter-select');
    const productGrid = document.querySelector('.product-grid');
    const productCards = Array.from(document.querySelectorAll('.product-card'));
  
    filterSelect.addEventListener('change', (event) => {
      const sortBy = event.target.value;
  
      // Sort products based on the selected option
      switch (sortBy) {
        case 'Price: Low to High':
          productCards.sort((a, b) => {
            const priceA = parseFloat(a.querySelector('.product-price').textContent.replace('$', ''));
            const priceB = parseFloat(b.querySelector('.product-price').textContent.replace('$', ''));
            return priceA - priceB;
          });
          break;
  
        case 'Price: High to Low':
          productCards.sort((a, b) => {
            const priceA = parseFloat(a.querySelector('.product-price').textContent.replace('$', ''));
            const priceB = parseFloat(b.querySelector('.product-price').textContent.replace('$', ''));
            return priceB - priceA;
          });
          break;
  
        case 'Most Popular':
          // Assuming popularity is based on the number of stars (rating)
          productCards.sort((a, b) => {
            const ratingA = a.querySelectorAll('.rating .fas').length;
            const ratingB = b.querySelectorAll('.rating .fas').length;
            return ratingB - ratingA;
          });
          break;
  
        default:
          // Default sorting (no change)
          break;
      }
  
      // Clear the grid and re-append sorted products
      productGrid.innerHTML = '';
      productCards.forEach(card => productGrid.appendChild(card));
    });
  });

  document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.querySelector('.product-grid');

    // Fetch listings from Firestore
    db.collection("listings").orderBy("createdAt", "desc").get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const listing = doc.data();

                // Create product card for each listing
                const productCard = document.createElement('div');
                productCard.classList.add('product-card');

                productCard.innerHTML = `
                    <img src="${listing.image}" alt="Product Image" class="product-image">
                    <div class="product-info">
                        <h4 class="product-title">${listing.name}</h4>
                        <p class="product-price">${listing.price}</p>
                        <p class="product-description">${listing.description}</p>
                        <button class="btn">Add to Cart</button>
                    </div>
                `;

                productGrid.appendChild(productCard);
            });
        })
        .catch(error => {
            console.error("Error fetching listings:", error);
        });
});


// Add click event to all product cards
document.querySelectorAll('.product-card').forEach(card => {
  card.addEventListener('click', function(e) {
      // Don't navigate if clicking on buttons inside the card
      if (e.target.tagName === 'BUTTON') return;
      
      // Get all product data
      const productData = {
          id: this.dataset.productId,
          name: this.dataset.productName,
          price: this.dataset.productPrice,
          rating: this.dataset.productRating,
          image: this.dataset.productImage,
          description: this.dataset.productDescription || 'Nil',
          specs: JSON.parse(this.dataset.productSpecs),
          seller: JSON.parse(this.dataset.seller)
      };
      
      // Store in session storage
      sessionStorage.setItem('currentProduct', JSON.stringify(productData));
      
      // Navigate to product page
      window.location.href = 'product.html';
  });
});