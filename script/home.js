// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-analytics.js";
import { getFirestore, collection, getDocs, query, orderBy, where } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyCeZEByafoJgLvZDxc0DCuUIYL2_37XT2c",
    authDomain: "fed-assignment-2-54ec3.firebaseapp.com",
    projectId: "fed-assignment-2-54ec3",
    storageBucket: "fed-assignment-2-54ec3.appspot.com",
    messagingSenderId: "398158834633",
    appId: "1:398158834633:web:c025708b57da0f4e109618",
    measurementId: "G-HC6YLQLFK5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); //  Now Firestore is properly initialized

//  Function to Fetch Listings from Firestore
// Function to Fetch and Display Listings from Firestore (Supports Category Filtering)
async function fetchListings(category = null) {
  const productGrid = document.querySelector('.product-grid');
  productGrid.innerHTML = ""; // Clear existing products

  try {
      let q;

      if (category) {
          console.log(`Fetching category: ${category}`); // Debugging log
          q = query(collection(db, "listings"), where("category", "==", category), orderBy("createdAt", "desc"));
      } else {
          console.log("Fetching all listings"); // Debugging log
          q = query(collection(db, "listings"), orderBy("createdAt", "desc"));
      }

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
          console.log("No listings found.");
          productGrid.innerHTML = `<p>No listings available for this category.</p>`;
          return;
      }

      querySnapshot.forEach((doc) => {
          const listing = doc.data();
          console.log("Listing found:", listing); // Debugging log

          const productCard = document.createElement('div');
          productCard.classList.add('product-card');

          // Store product details in dataset
          productCard.dataset.productId = doc.id;
          productCard.dataset.productName = listing.name;
          productCard.dataset.productPrice = listing.price;
          productCard.dataset.productImage = listing.image;
          productCard.dataset.productDescription = listing.description;

          productCard.innerHTML = `
              <img src="${listing.image}" alt="Product Image" class="product-image">
              <div class="product-info">
                  <h4 class="product-title">${listing.name}</h4>
                  <p class="product-price">${listing.price}</p>
                  <p class="product-description">${listing.description}</p>
                  <button class="btn">Add to Cart</button>
              </div>
          `;

          // Add Click Event Listener
          productCard.addEventListener('click', function(e) {
              if (e.target.tagName === 'BUTTON') return;
              
              const productData = {
                  id: doc.id,
                  name: listing.name,
                  price: listing.price,
                  image: listing.image,
                  description: listing.description,
                  seller: listing.seller || { name: "Unknown Seller" }
              };
  
              sessionStorage.setItem('currentProduct', JSON.stringify(productData));
              window.location.href = 'product.html';
          });

          productGrid.appendChild(productCard);
      });

  } catch (error) {
      console.error("Error fetching listings:", error);
  }
}


// Load all listings on page load
document.addEventListener('DOMContentLoaded', () => {
  fetchListings();

  // ✅ Add click event listener for category buttons
  document.querySelectorAll('.category-item').forEach(button => {
      button.addEventListener('click', () => {
          const selectedCategory = button.dataset.category;
          console.log(`Category clicked: ${selectedCategory}`); // Debugging log
          fetchListings(selectedCategory);
      });
  });
});


//  Your Existing Search Function (Unchanged)
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

//  Your Existing Sorting Function (Unchanged)
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

//  Handle Clicking on Products to View Details (Unchanged)
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', function (e) {
        if (e.target.tagName === 'BUTTON') return;
        
        const productData = {
            name: this.dataset.productName,
            price: this.dataset.productPrice,
            image: this.dataset.productImage,
            description: this.dataset.productDescription || 'Nil',
            seller: JSON.parse(this.dataset.seller)
        };

        sessionStorage.setItem('currentProduct', JSON.stringify(productData));
        window.location.href = 'product.html';
    });
});
