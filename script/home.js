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