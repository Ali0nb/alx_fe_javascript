// Array to hold quotes
const quotes = [];

// Load quotes from local storage on page load
function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes.push(...JSON.parse(storedQuotes));
    }
    populateCategories();
    showQuotesBasedOnFilter();
}

// Save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Populate categories in the dropdown
function populateCategories() {
    const categories = new Set();
    quotes.forEach(quote => categories.add(quote.category));
    
    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    Array.from(categories).forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    // Restore the last selected filter
    const lastCategory = localStorage.getItem('lastCategory');
    if (lastCategory) {
        categoryFilter.value = lastCategory;
    }
}

// Show quotes based on the selected category filter
function showQuotesBasedOnFilter() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    const filteredQuotes = selectedCategory === 'all' 
        ? quotes 
        : quotes.filter(quote => quote.category === selectedCategory);

    if (filteredQuotes.length === 0) {
        document.getElementById('quoteDisplay').textContent = 'No quotes available for this category.';
        return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];
    document.getElementById('quoteDisplay').textContent = `"${quote.text}" - ${quote.category}`;
}

// Function to add a new quote
function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value.trim();
    const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

    if (newQuoteText && newQuoteCategory) {
        quotes.push({ text: newQuoteText, category: newQuoteCategory });
        saveQuotes();
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        populateCategories(); // Update the categories dropdown
        alert('Quote added successfully!');
        showQuotesBasedOnFilter(); // Show updated quotes based on filter
    } else {
        alert('Please fill out both the quote and category fields.');
    }
}

// Function to export quotes to a JSON file
function exportToJson() {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories(); // Update the categories dropdown
        alert('Quotes imported successfully!');
        showQuotesBasedOnFilter(); // Show updated quotes based on filter
    };
    fileReader.readAsText(event.target.files[0]);
}

// Function to filter quotes based on selected category
function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    localStorage.setItem('lastCategory', selectedCategory); // Save last selected category
    showQuotesBasedOnFilter();
}

// Event listeners
document.getElementById('newQuote').addEventListener('click', showQuotesBasedOnFilter);
document.getElementById('addQuoteButton').addEventListener('click', addQuote);
document.getElementById('exportButton').addEventListener('click', exportToJson);

// Initialize the application
document.addEventListener('DOMContentLoaded', loadQuotes);

