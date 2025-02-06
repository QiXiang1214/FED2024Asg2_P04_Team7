document.getElementById('listingForm').addEventListener('submit', function(event) {
    event.preventDefault();
    alert('Listing Created Successfully!');
    this.reset();
});