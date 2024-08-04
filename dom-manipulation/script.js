const quotes = [];
const API_URL = 'https://jsonplaceholder.typicode.com/posts'; // Mock API URL

// Load quotes from local storage
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

// Fetch quotes from server and update local storage
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(API_URL);
        const serverQuotes = await response.json();
        
        // Example conflict resolution: server data takes precedence
        quotes.length = 0; // Clear local quotes
        quotes.push(...serverQuotes); // Update with server quotes
        saveQuotes();
        populateCategories(); // Update categories dropdown
        showQuotesBasedOnFilter();
        
        alert('Quotes updated from server!');
    } catch (error) {
        console.error('Failed to fetch quotes from server:', error);
    }
}

// Periodically fetch updates from the server
setInterval(fetchQuotesFromServer, 60000); // Fetch every 60 seconds

// Add a new quote and send to server
async function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value.trim();
    const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

    if (newQuoteText && newQuoteCategory) {
        const newQuote = { text: newQuoteText, category: newQuoteCategory };

        // Add to local storage
        quotes.push(newQuote);
        saveQuotes();

        // Send new quote to the server (for simulation)
        try {
            await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newQuote)
            });
            alert('Quote added successfully!');
        } catch (error) {
            console.error('Failed to add quote to server:', error);
        }

        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        populateCategories(); // Update categories dropdown
        showQuotesBasedOnFilter(); // Show updated quotes based on filter
    } else {
        alert('Please fill out both the quote and category fields.');
    }
}

// Export quotes to JSON file
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

// Import quotes from JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories(); // Update categories dropdown
        alert('Quotes imported successfully!');
        showQuotesBasedOnFilter(); // Show updated quotes based on filter
    };
    fileReader.readAsText(event.target.files[0]);
}

// Filter quotes based on selected category
function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    localStorage.setItem('lastCategory', selectedCategory); // Save last selected category
    showQuotesBasedOnFilter();
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    loadQuotes();
    document.getElementById('newQuote').addEventListener('click', addQuote);
    document.getElementById('categoryFilter').addEventListener('change', filterQuotes);
    document.getElementById('exportQuotes').addEventListener('click', exportToJson);
    document.getElementById('importFile').addEventListener('change', importFromJsonFile);
});
