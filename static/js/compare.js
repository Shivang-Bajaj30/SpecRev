// Load bike data from the JSON file
let bikeData = [];

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, fetching bike data...');
    // Fetch bike data from JSON file
    fetch('../static/data/bikes.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log('Bike data loaded successfully:', data.length + ' bikes');
            bikeData = data;
            initBikeComparison();
        })
        .catch(error => {
            console.error('Error loading bike data:', error);
            document.getElementById('bike1-results').innerHTML = '<div class="search-item">Error loading bike data. Please refresh the page.</div>';
            document.getElementById('bike2-results').innerHTML = '<div class="search-item">Error loading bike data. Please refresh the page.</div>';
            // Still initialize with empty data
            initBikeComparison();
        });
});

function initBikeComparison() {
    console.log('Initializing bike comparison...');
    // Clear any potential stray content
    const searchResults = document.querySelectorAll('.search-results');
    searchResults.forEach(el => {
        el.innerHTML = '';
    });
    
    // Clear the search results elements at start
    const bike1Results = document.getElementById('bike1-results');
    const bike2Results = document.getElementById('bike2-results');
    bike1Results.innerHTML = '';
    bike2Results.innerHTML = '';
    
    const bike1Search = document.getElementById('bike1-search');
    const bike2Search = document.getElementById('bike2-search');
    const bike1Selected = document.getElementById('bike1-selected');
    const bike2Selected = document.getElementById('bike2-selected');
    const bike1Reset = document.getElementById('bike1-reset');
    const bike2Reset = document.getElementById('bike2-reset');
    const compareBtn = document.getElementById('compare-btn');
    const bikePlaceholders = document.querySelectorAll('.bike-placeholder');

    let selectedBike1 = null;
    let selectedBike2 = null;

    // Handle search input for bike 1
    bike1Search.addEventListener('input', function() {
        console.log('Searching bike 1:', this.value);
        handleSearch(this.value, bike1Results, 1);
    });

    // Handle search input for bike 2
    bike2Search.addEventListener('input', function() {
        console.log('Searching bike 2:', this.value);
        handleSearch(this.value, bike2Results, 2);
    });

    // Show all bikes grouped by brand when search input is focused
    bike1Search.addEventListener('focus', function() {
        console.log('Bike 1 search focused');
        showAllBikes(bike1Results, 1);
    });

    bike2Search.addEventListener('focus', function() {
        console.log('Bike 2 search focused');
        showAllBikes(bike2Results, 2);
    });

    // Hide search results when clicking outside
    document.addEventListener('click', function(e) {
        if (!bike1Search.contains(e.target) && !bike1Results.contains(e.target)) {
            bike1Results.classList.remove('active');
        }
        if (!bike2Search.contains(e.target) && !bike2Results.contains(e.target)) {
            bike2Results.classList.remove('active');
        }
    });

    // Make placeholders clickable to focus on search
    bikePlaceholders.forEach((placeholder, index) => {
        placeholder.addEventListener('click', function() {
            if (index === 0) {
                bike1Search.focus();
            } else {
                bike2Search.focus();
            }
        });
    });

    // Reset bike selection
    bike1Reset.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent event bubbling
        resetBike(1);
    });

    bike2Reset.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent event bubbling
        resetBike(2);
    });

    // Function to show all bikes grouped by brand
    function showAllBikes(resultsElement, bikeNumber) {
        // Clear previous results first
        resultsElement.innerHTML = '';
        resultsElement.classList.add('active');
        
        // Check if we have bike data
        if (!bikeData || bikeData.length === 0) {
            const noData = document.createElement('div');
            noData.className = 'search-item';
            noData.textContent = 'No bike data available. Please refresh the page.';
            resultsElement.appendChild(noData);
            return;
        }
        
        // Get unique brands and sort alphabetically
        const brands = [...new Set(bikeData.map(bike => bike.brand))].sort();
        
        brands.forEach(brand => {
            // Create brand heading
            const brandHeading = document.createElement('div');
            brandHeading.className = 'brand-heading';
            brandHeading.textContent = brand;
            resultsElement.appendChild(brandHeading);
            
            // Filter bikes by brand
            const brandBikes = bikeData.filter(bike => bike.brand === brand);
            
            // Create bike items under this brand
            brandBikes.forEach(bike => {
                const item = document.createElement('div');
                item.className = 'search-item brand-model';
                
                // Remove brand name from display since it's already in the heading
                let displayName = bike.name;
                if (displayName.toLowerCase().includes(brand.toLowerCase())) {
                    displayName = displayName.replace(new RegExp(brand, 'i'), '').trim();
                }
                
                // If empty or just whitespace, use the model instead
                if (!displayName || displayName.length < 2) {
                    displayName = bike.model || bike.name;
                }
                
                item.innerHTML = `
                    <div class="search-item-name">${displayName}</div>
                    <div class="search-item-model">${bike.cc}cc | ${bike.year}</div>
                `;
                
                item.addEventListener('click', function() {
                    selectBike(bike, bikeNumber);
                    resultsElement.classList.remove('active');
                });
                
                resultsElement.appendChild(item);
            });
        });
    }

    // Function to handle search
    function handleSearch(query, resultsElement, bikeNumber) {
        if (query.length < 2) {
            showAllBikes(resultsElement, bikeNumber);
            return;
        }

        // Clear previous results
        resultsElement.innerHTML = '';
        
        const filteredBikes = bikeData.filter(bike => {
            return bike.name.toLowerCase().includes(query.toLowerCase()) || 
                   bike.brand.toLowerCase().includes(query.toLowerCase()) ||
                   bike.model.toLowerCase().includes(query.toLowerCase()) ||
                   bike.cc.toString().includes(query);
        });
        
        if (filteredBikes.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'search-item';
            noResults.textContent = 'No bikes found';
            resultsElement.appendChild(noResults);
        } else {
            // Group filtered bikes by brand
            const filteredBrands = [...new Set(filteredBikes.map(bike => bike.brand))].sort();
            
            filteredBrands.forEach(brand => {
                // Create brand heading
                const brandHeading = document.createElement('div');
                brandHeading.className = 'brand-heading';
                brandHeading.textContent = brand;
                resultsElement.appendChild(brandHeading);
                
                // Filter bikes by brand
                const brandBikes = filteredBikes.filter(bike => bike.brand === brand);
                
                // Create bike items under this brand
                brandBikes.forEach(bike => {
                    const item = document.createElement('div');
                    item.className = 'search-item brand-model';
                    
                    // Remove brand name from display since it's already in the heading
                    let displayName = bike.name;
                    if (displayName.toLowerCase().includes(brand.toLowerCase())) {
                        displayName = displayName.replace(new RegExp(brand, 'i'), '').trim();
                    }
                    
                    // If empty or just whitespace, use the model instead
                    if (!displayName || displayName.length < 2) {
                        displayName = bike.model;
                    }
                    
                    item.innerHTML = `
                        <div class="search-item-name">${displayName}</div>
                        <div class="search-item-model">${bike.cc}cc | ${bike.year}</div>
                    `;
                    
                    item.addEventListener('click', function() {
                        selectBike(bike, bikeNumber);
                        resultsElement.classList.remove('active');
                    });
                    
                    resultsElement.appendChild(item);
                });
            });
        }
        
        resultsElement.classList.add('active');
    }

    // Function to select a bike
    function selectBike(bike, bikeNumber) {
        const bikeSelected = document.getElementById(`bike${bikeNumber}-selected`);
        const bikePlaceholder = bikeSelected.previousElementSibling;
        const bikeNameElement = document.getElementById(`bike${bikeNumber}-name`);
        const bikeModelElement = document.getElementById(`bike${bikeNumber}-model`);
        const bikeImageElement = document.getElementById(`bike${bikeNumber}-img`);
        const compareBtn = document.getElementById('compare-btn');
        
        // Update bike details
        bikeNameElement.textContent = bike.name;
        bikeModelElement.textContent = `${bike.brand} | ${bike.cc}cc | ${bike.year}`;
        
        // Handle image path
        let imagePath = bike.image || `../static/img/bikes/${bike.brand.toLowerCase()}-${bike.model?.toLowerCase() || 'default'}.webp`;
        
        // Set default variant to the first one if available
        let defaultVariant = null;
        if (bike.variants && bike.variants.length > 0) {
            defaultVariant = bike.variants[0];
            // Use variant image if available
            if (defaultVariant.image) {
                imagePath = defaultVariant.image;
            }
        }
        
        // Set image with fallback for errors
        bikeImageElement.src = imagePath;
        bikeImageElement.onerror = function() {
            console.error(`Failed to load image: ${imagePath}`);
            // Use an existing image from the codebase instead of placeholder-bike.jpg which doesn't exist
            this.src = 'img/bikes/duke125.webp'; 
            this.onerror = null; // Prevent infinite loop
        };
        
        // Show selected bike and hide placeholder
        bikeSelected.style.display = 'block';
        bikePlaceholder.style.display = 'none';
        
        // Clear search input
        document.getElementById(`bike${bikeNumber}-search`).value = '';
        
        // Save reference to selected bike
        if (bikeNumber === 1) {
            selectedBike1 = bike;
        } else {
            selectedBike2 = bike;
        }
        
        // Check if both bikes are selected to enable compare button
        if (selectedBike1 && selectedBike2) {
            compareBtn.classList.remove('disabled');
        }
        
        // Create and append variant select if variants available
        if (bike.variants && bike.variants.length > 0) {
            // Remove all existing variant selectors first
            const existingSelectors = document.querySelectorAll(`#bike${bikeNumber}-selected .variant-select-container`);
            existingSelectors.forEach(selector => selector.remove());
            
            const variantSelectContainer = document.createElement('div');
            variantSelectContainer.className = 'variant-select-container';
            
            const variantLabel = document.createElement('label');
            variantLabel.htmlFor = `bike${bikeNumber}-variant`;
            variantLabel.textContent = 'Variant:';
            variantSelectContainer.appendChild(variantLabel);
            
            const variantSelect = document.createElement('select');
            variantSelect.id = `bike${bikeNumber}-variant`;
            variantSelect.className = 'variant-select';
            
            // Add options for each variant
            bike.variants.forEach(variant => {
                const option = document.createElement('option');
                option.value = variant.name;
                option.textContent = `${variant.name} - ₹${variant.price.toLocaleString()}`;
                variantSelect.appendChild(option);
            });
            
            // Add event listener to handle variant change
            variantSelect.addEventListener('change', function() {
                updateVariantImage(this, bikeNumber);
            });
            
            variantSelectContainer.appendChild(variantSelect);
            
            // Insert after bike model element
            bikeModelElement.parentNode.insertBefore(variantSelectContainer, bikeModelElement.nextSibling);
        }
    }
    
    // Function to update the bike image when variant changes
    function updateVariantImage(selectElement, bikeNumber) {
        const selectedBike = bikeNumber === 1 ? selectedBike1 : selectedBike2;
        const variantName = selectElement.value;
        const bikeImageElement = document.getElementById(`bike${bikeNumber}-img`);
        
        // Find the selected variant
        const selectedVariant = selectedBike.variants.find(v => v.name === variantName);
        
        if (selectedVariant && selectedVariant.image) {
            bikeImageElement.src = selectedVariant.image;
            bikeImageElement.onerror = function() {
                console.error(`Failed to load variant image: ${selectedVariant.image}`);
                // Try fallback to bike's main image
                this.src = selectedBike.image || 'img/bikes/duke125.webp';
                this.onerror = null; // Prevent infinite loop
            };
        } else if (selectedBike.image) {
            // Fallback to bike's main image
            bikeImageElement.src = selectedBike.image;
        }
    }

    // Function to reset bike selection
    function resetBike(bikeNumber) {
        if (bikeNumber === 1) {
            selectedBike1 = null;
            bike1Selected.style.display = 'none';
            document.querySelector('.bike-card:first-child .bike-placeholder').style.display = 'flex';
            // Remove variant selector if it exists
            const variantSelect = document.getElementById('bike1-variant');
            if (variantSelect) {
                variantSelect.parentElement.remove();
            }
        } else {
            selectedBike2 = null;
            bike2Selected.style.display = 'none';
            document.querySelector('.bike-card:nth-child(3) .bike-placeholder').style.display = 'flex';
            // Remove variant selector if it exists
            const variantSelect = document.getElementById('bike2-variant');
            if (variantSelect) {
                variantSelect.parentElement.remove();
            }
        }
        
        // Disable compare button if one or both bikes are not selected
        if (!selectedBike1 || !selectedBike2) {
            compareBtn.classList.add('disabled');
        }
    }

    // Compare button click handler
    compareBtn.addEventListener('click', function() {
        if (selectedBike1 && selectedBike2) {
            // Get selected variants if any
            let variant1 = document.getElementById('bike1-variant');
            let variant2 = document.getElementById('bike2-variant');
            
            let variant1Name = variant1 ? variant1.value : null;
            let variant2Name = variant2 ? variant2.value : null;
            
            // Get variant images if available
            let selectedImage1 = selectedBike1.image;
            let selectedImage2 = selectedBike2.image;
            
            if (variant1) {
                const selectedOption1 = variant1.options[variant1.selectedIndex];
                const variantImage1 = selectedOption1.getAttribute('data-image');
                if (variantImage1 && variantImage1 !== '') {
                    selectedImage1 = variantImage1;
                }
            }
            
            if (variant2) {
                const selectedOption2 = variant2.options[variant2.selectedIndex];
                const variantImage2 = selectedOption2.getAttribute('data-image');
                if (variantImage2 && variantImage2 !== '') {
                    selectedImage2 = variantImage2;
                }
            }
            
            // Build URL with bike IDs, variant names, and image URLs
            let url = `compare?bike1=${selectedBike1.id}&bike2=${selectedBike2.id}`;
            
            if (variant1Name) url += `&variant1=${encodeURIComponent(variant1Name)}`;
            if (variant2Name) url += `&variant2=${encodeURIComponent(variant2Name)}`;
            url += `&img1=${encodeURIComponent(selectedImage1)}&img2=${encodeURIComponent(selectedImage2)}`;
            
            // Navigate to the comparison page
            window.location.href = url;
        }
    });
    
    // Function to get variant features
    function getVariantFeatures(bike, variantName) {
        if (!bike.variants || !variantName) {
            return [];
        }
        
        const variant = bike.variants.find(v => v.name === variantName);
        return variant ? variant.features : [];
    }

    // Add animation effects to bike cards
    const bikeCards = document.querySelectorAll('.bike-card');
    bikeCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const actionBtn = this.querySelector('.card-action');
            if (actionBtn) {
                actionBtn.style.transform = 'scale(1.1)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const actionBtn = this.querySelector('.card-action');
            if (actionBtn) {
                actionBtn.style.transform = 'scale(1)';
            }
        });
    });
} 