// Import Firebase from firebase.js
import { db } from "../script/firebase.js";
import { collection, getDocs, query, orderBy, where } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// Function to Fetch and Display Listings from Firestore (Supports Category Filtering)
async function fetchListings(category = null) {
  const productGrid = document.querySelector('.product-grid');
  productGrid.innerHTML = ""; // Clear existing products

  try {
      let q;

      if (category) {
          console.log(`Fetching category: ${category}`); 
          q = query(collection(db, "listings"), where("category", "==", category), orderBy("createdAt", "desc"));
      } else {
          console.log("Fetching all listings"); 
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
          console.log("Listing found:", listing); 

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
                  createdBy: listing.createdBy || { username: "Unknown Seller", avatar: "mslogo.png" }
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

  //Add click event listener for category buttons
  document.querySelectorAll('.category-item').forEach(button => {
      button.addEventListener('click', () => {
          const selectedCategory = button.dataset.category;
          console.log(`Category clicked: ${selectedCategory}`); 
          fetchListings(selectedCategory);
      });
  });
});

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const productGrid = document.querySelector('.product-grid');
    const noResults = document.createElement('div');
    noResults.className = 'no-results';
    noResults.textContent = 'No products found matching your search.';
    productGrid.appendChild(noResults);

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase().trim();
        const productCards = document.querySelectorAll('.product-card');
        let hasVisibleProducts = false;

        productCards.forEach(card => {
            const title = card.dataset.productName.toLowerCase();
            const description = card.dataset.productDescription.toLowerCase();

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

// Modified Sorting Function
document.addEventListener('DOMContentLoaded', () => {
    const filterSelect = document.querySelector('.filter-select');
    const productGrid = document.querySelector('.product-grid');

    filterSelect.addEventListener('change', async (event) => {
        const sortBy = event.target.value;
        const productCards = Array.from(document.querySelectorAll('.product-card')); 

        // Convert to sortable array with price data
        const productsWithPrices = productCards.map(card => ({
            element: card,
            price: parseFloat(card.dataset.productPrice.replace(/[^0-9.-]+/g, ""))
        }));

        // Sort products based on selection
        switch (sortBy) {
            case 'Price: Low to High':
                productsWithPrices.sort((a, b) => a.price - b.price);
                break;
            case 'Price: High to Low':
                productsWithPrices.sort((a, b) => b.price - a.price);
                break;
            case 'Most Popular':
                break;
            default:
                return;
        }

        // Clear grid and re-append sorted products
        productGrid.innerHTML = '';
        productsWithPrices.forEach(product => {
            productGrid.appendChild(product.element);
        });
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

//Toggle Menu
document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    menuToggle.addEventListener("click", function () {
        navLinks.classList.toggle("active");
    });
});
