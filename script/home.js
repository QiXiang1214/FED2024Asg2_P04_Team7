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