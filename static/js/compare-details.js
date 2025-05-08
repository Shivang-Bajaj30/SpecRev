// Global variables
let bikeData = [];
let selectedBikes = {
    bike1: null,
    bike2: null,
    variant1: null,
    variant2: null,
    img1: null,
    img2: null
};

// Load data and initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Parse URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const bike1Id = urlParams.get('bike1');
    const bike2Id = urlParams.get('bike2');
    const variant1Name = urlParams.get('variant1');
    const variant2Name = urlParams.get('variant2');
    selectedBikes.img1 = urlParams.get('img1');
    selectedBikes.img2 = urlParams.get('img2');
    
    // If no bike IDs are provided, redirect to comparison page
    if (!bike1Id || !bike2Id) {
        window.location.href = 'index.html#compare';
        return;
    }
    
    // Fetch bike data
    fetch('../static/data/bikes.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            bikeData = data;
            
            // Find selected bikes by ID
            selectedBikes.bike1 = bikeData.find(bike => bike.id.toString() === bike1Id);
            selectedBikes.bike2 = bikeData.find(bike => bike.id.toString() === bike2Id);
            
            // If bikes are found, find the selected variants
            if (selectedBikes.bike1 && variant1Name) {
                selectedBikes.variant1 = selectedBikes.bike1.variants.find(variant => variant.name === variant1Name);
            }
            
            if (selectedBikes.bike2 && variant2Name) {
                selectedBikes.variant2 = selectedBikes.bike2.variants.find(variant => variant.name === variant2Name);
            }
            
            // Initialize page content
            initPageContent();
        })
        .catch(error => {
            console.error('Error loading bike data:', error);
            showError('Failed to load bike data. Please try again later.');
        });
        
    // Initialize tab navigation
    initTabs();
    
    // Initialize share button
    document.getElementById('share-btn').addEventListener('click', shareComparison);
});

// Initialize tab navigation
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding tab pane
            const tabId = this.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
}

// Initialize page content with bike data
function initPageContent() {
    if (!selectedBikes.bike1 || !selectedBikes.bike2) {
        showError('One or both selected bikes could not be found.');
        return;
    }
    
    // Set page title with cleaner format
    document.title = `${selectedBikes.bike1.name} vs ${selectedBikes.bike2.name} - BikeCompare`;
    
    // Update the main comparison title 
    const variant1Text = selectedBikes.variant1 ? selectedBikes.variant1.name : '';
    const variant2Text = selectedBikes.variant2 ? selectedBikes.variant2.name : '';
    
    // Format main title and subtitle more elegantly
    document.getElementById('comparison-title').innerHTML = `
        Comparing ${selectedBikes.bike1.brand} ${selectedBikes.bike1.name} ${variant1Text}
        vs ${selectedBikes.bike2.brand} ${selectedBikes.bike2.name} ${variant2Text}
    `;
    
    // Update bike information
    updateBikeHeader(1, selectedBikes.bike1, selectedBikes.variant1, selectedBikes.img1);
    updateBikeHeader(2, selectedBikes.bike2, selectedBikes.variant2, selectedBikes.img2);
    
    // Update specifications tab
    updateSpecsTab();
    
    // Update features tab
    updateFeaturesTab();
    
    // Update pricing tab
    updatePricingTab();
}

// Update bike header information
function updateBikeHeader(bikeNum, bike, variant, imgUrl) {
    document.getElementById(`bike${bikeNum}-name`).textContent = bike.name;
    document.getElementById(`bike${bikeNum}-model`).textContent = `${bike.brand} | ${bike.cc}cc | ${bike.year}`;
    document.getElementById(`bike${bikeNum}-variant-badge`).textContent = variant ? variant.name : 'Standard';
    
    const imgElement = document.getElementById(`bike${bikeNum}-img`);
    
    // Handle image path
    let imagePath = bike.image;
    if (!imagePath) {
        // Construct the image path with proper directory structure
        const brandModel = `${bike.brand.toLowerCase()}-${bike.model?.toLowerCase() || 'default'}`;
        imagePath = `../static/img/bikes/${brandModel}.webp`;
    } else if (!imagePath.startsWith('http')) {
        imagePath = `../static/img/bikes/${imagePath}`;
    }
    
    // Set default variant to the first one if available
    if (variant && variant.image) {
        imagePath = variant.image.startsWith('http') ? variant.image :
            variant.image.startsWith('../') ? variant.image :
            `../static/img/bikes/${variant.image}`;
    }
    
    // Set image with fallback for errors
    imgElement.src = imagePath;
    imgElement.onerror = function() {
        console.error(`Failed to load image: ${imagePath}`);
        this.src = '../static/img/bikes/placeholder-bike.webp';
        this.onerror = null; // Prevent infinite loop
    };
}

// Update specifications tab
function updateSpecsTab() {
    console.log("Updating specs tab with bike data:", selectedBikes);
    
    // Update bike names in specs table header
    document.getElementById('spec-bike1-name').textContent = selectedBikes.bike1.name + (selectedBikes.variant1 ? ' ' + selectedBikes.variant1.name : '');
    document.getElementById('spec-bike2-name').textContent = selectedBikes.bike2.name + (selectedBikes.variant2 ? ' ' + selectedBikes.variant2.name : '');
    
    // Update specifications
    document.getElementById('cc1').textContent = selectedBikes.bike1.cc + 'cc';
    document.getElementById('cc2').textContent = selectedBikes.bike2.cc + 'cc';
    
    // Check for the Length and Width fields directly
    console.log("Length (mm) in bike1:", selectedBikes.bike1["Length (mm)"]);
    console.log("Width (mm) in bike1:", selectedBikes.bike1["Width (mm)"]);
    
    // Handle length and width more explicitly
    try {
        const length1Element = document.getElementById('lengthmm1');
        const length2Element = document.getElementById('lengthmm2');
        const width1Element = document.getElementById('widthmm1');
        const width2Element = document.getElementById('widthmm2');
        
        console.log("Length elements found:", !!length1Element, !!length2Element);
        console.log("Width elements found:", !!width1Element, !!width2Element);
        
        // Use getVariantOrBikeSpec to check for values in both bike and variant
        if (length1Element && length2Element) {
            const length1 = getVariantOrBikeSpec(selectedBikes.bike1, selectedBikes.variant1, "Length (mm)");
            const length2 = getVariantOrBikeSpec(selectedBikes.bike2, selectedBikes.variant2, "Length (mm)");
            
            length1Element.textContent = length1 ? length1 + ' mm' : 'N/A';
            length2Element.textContent = length2 ? length2 + ' mm' : 'N/A';
        }
        
        if (width1Element && width2Element) {
            const width1 = getVariantOrBikeSpec(selectedBikes.bike1, selectedBikes.variant1, "Width (mm)");
            const width2 = getVariantOrBikeSpec(selectedBikes.bike2, selectedBikes.variant2, "Width (mm)");
            
            width1Element.textContent = width1 ? width1 + ' mm' : 'N/A';
            width2Element.textContent = width2 ? width2 + ' mm' : 'N/A';
        }
    } catch (error) {
        console.error("Error updating length/width:", error);
    }
    
    // Update new specifications
    document.getElementById('power1').textContent = getVariantOrBikeSpec(selectedBikes.bike1, selectedBikes.variant1, 'power') || 'N/A';
    document.getElementById('power2').textContent = getVariantOrBikeSpec(selectedBikes.bike2, selectedBikes.variant2, 'power') || 'N/A';
    
    document.getElementById('torque1').textContent = getVariantOrBikeSpec(selectedBikes.bike1, selectedBikes.variant1, 'torque') || 'N/A';
    document.getElementById('torque2').textContent = getVariantOrBikeSpec(selectedBikes.bike2, selectedBikes.variant2, 'torque') || 'N/A';
    
    document.getElementById('mileage1').textContent = getVariantOrBikeSpec(selectedBikes.bike1, selectedBikes.variant1, 'mileage') ? 
        getVariantOrBikeSpec(selectedBikes.bike1, selectedBikes.variant1, 'mileage') + ' kmpl' : 'N/A';
    document.getElementById('mileage2').textContent = getVariantOrBikeSpec(selectedBikes.bike2, selectedBikes.variant2, 'mileage') ? 
        getVariantOrBikeSpec(selectedBikes.bike2, selectedBikes.variant2, 'mileage') + ' kmpl' : 'N/A';
    
    // Update brake information
    document.getElementById('frontBrake1').textContent = getVariantOrBikeSpec(selectedBikes.bike1, selectedBikes.variant1, 'Front Brake Type') || 
        getVariantOrBikeSpec(selectedBikes.bike1, selectedBikes.variant1, 'frontBrake') || 'N/A';
    document.getElementById('frontBrake2').textContent = getVariantOrBikeSpec(selectedBikes.bike2, selectedBikes.variant2, 'Front Brake Type') || 
        getVariantOrBikeSpec(selectedBikes.bike2, selectedBikes.variant2, 'frontBrake') || 'N/A';
    
    document.getElementById('rearBrake1').textContent = getVariantOrBikeSpec(selectedBikes.bike1, selectedBikes.variant1, 'Rear Brake Type') || 
        getVariantOrBikeSpec(selectedBikes.bike1, selectedBikes.variant1, 'rearBrake') || 'N/A';
    document.getElementById('rearBrake2').textContent = getVariantOrBikeSpec(selectedBikes.bike2, selectedBikes.variant2, 'Rear Brake Type') || 
        getVariantOrBikeSpec(selectedBikes.bike2, selectedBikes.variant2, 'rearBrake') || 'N/A';
    
    document.getElementById('frontSusp1').textContent = getVariantOrBikeSpec(selectedBikes.bike1, selectedBikes.variant1, 'frontSuspension') || 'N/A';
    document.getElementById('frontSusp2').textContent = getVariantOrBikeSpec(selectedBikes.bike2, selectedBikes.variant2, 'frontSuspension') || 'N/A';
    
    document.getElementById('rearSusp1').textContent = getVariantOrBikeSpec(selectedBikes.bike1, selectedBikes.variant1, 'rearSuspension') || 'N/A';
    document.getElementById('rearSusp2').textContent = getVariantOrBikeSpec(selectedBikes.bike2, selectedBikes.variant2, 'rearSuspension') || 'N/A';
    
    // Update general information
    document.getElementById('year1').textContent = selectedBikes.bike1.year;
    document.getElementById('year2').textContent = selectedBikes.bike2.year;
    
    document.getElementById('brand1').textContent = selectedBikes.bike1.brand;
    document.getElementById('brand2').textContent = selectedBikes.bike2.brand;
    
    // Check if additional specification fields exist in HTML before updating them
    const fieldsToUpdate = [
        'Gear Shifting Pattern', 
        'Clutch', 
        'Cylinders', 
        'Cooling System', 
        'Braking System', 
        'Wheel Type', 
        'Front Tyre Size', 
        'Rear Tyre Size', 
        'Tyre Type',
        'Kerb Weight'
        // Length and Width are now handled separately
    ];
    
    console.log("Fields being updated:", fieldsToUpdate);
    
    fieldsToUpdate.forEach(field => {
        updateAdditionalSpecFields(field);
    });
}

// Helper function to update additional specification fields
function updateAdditionalSpecFields(fieldName) {
    // Create element ID from field name - handle field names with parentheses
    let elementId = fieldName.toLowerCase().replace(/\s+/g, '');
    
    // Special case for length and width which have (mm) in their field names
    if (fieldName === 'Length (mm)') {
        elementId = 'lengthmm';
    } else if (fieldName === 'Width (mm)') {
        elementId = 'widthmm';
    } else {
        elementId = elementId.replace(/\(|\)/g, '');
    }
    
    const field1Id = elementId + '1';
    const field2Id = elementId + '2';
    
    console.log(`Looking for elements with IDs: ${field1Id}, ${field2Id} for field: ${fieldName}`);
    
    const field1Element = document.getElementById(field1Id);
    const field2Element = document.getElementById(field2Id);
    
    if (field1Element && field2Element) {
        const value1 = getVariantOrBikeSpec(selectedBikes.bike1, selectedBikes.variant1, fieldName);
        const value2 = getVariantOrBikeSpec(selectedBikes.bike2, selectedBikes.variant2, fieldName);
        
        console.log(`Found values for ${fieldName}: ${value1}, ${value2}`);
        
        field1Element.textContent = formatSpecValue(fieldName, value1);
        field2Element.textContent = formatSpecValue(fieldName, value2);
    } else {
        console.log(`Elements not found for ${fieldName} with IDs ${field1Id}, ${field2Id}`);
    }
}

// Helper function to format specification values based on their type
function formatSpecValue(fieldName, value) {
    if (value === undefined) {
        return 'N/A';
    }
    
    if (fieldName.includes('Tyre Size') && !isNaN(value)) {
        return value + ' inch';
    }
    
    if (fieldName.includes('Length') || fieldName.includes('Width')) {
        return value + ' mm';
    }
    
    return value;
}

// Helper function to get specification value from variant if available, otherwise from bike
function getVariantOrBikeSpec(bike, variant, specName) {
    if (variant && variant[specName] !== undefined) {
        return variant[specName];
    }
    
    // For Width (mm) - also check for just "Width" in the variant data
    if (specName === "Width (mm)" && variant && variant["Width"] !== undefined) {
        return variant["Width"];
    }
    
    // For Length (mm) - also check for just "Length" in the variant data
    if (specName === "Length (mm)" && variant && variant["Length"] !== undefined) {
        return variant["Length"];
    }
    
    return bike[specName];
}

// Update features tab
function updateFeaturesTab() {
    // Update feature list titles
    const variant1Text = selectedBikes.variant1 ? ` ${selectedBikes.variant1.name}` : '';
    const variant2Text = selectedBikes.variant2 ? ` ${selectedBikes.variant2.name}` : '';
    document.getElementById('features1-title').textContent = `${selectedBikes.bike1.name}${variant1Text} Features`;
    document.getElementById('features2-title').textContent = `${selectedBikes.bike2.name}${variant2Text} Features`;
    
    // Clear loading indicators
    document.getElementById('features1-list').innerHTML = '';
    document.getElementById('features2-list').innerHTML = '';
    
    // Add features for bike 1
    const features1 = selectedBikes.variant1 ? selectedBikes.variant1.features : [];
    if (features1.length > 0) {
        features1.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            document.getElementById('features1-list').appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.textContent = 'No features available';
        document.getElementById('features1-list').appendChild(li);
    }
    
    // Add features for bike 2
    const features2 = selectedBikes.variant2 ? selectedBikes.variant2.features : [];
    if (features2.length > 0) {
        features2.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            document.getElementById('features2-list').appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.textContent = 'No features available';
        document.getElementById('features2-list').appendChild(li);
    }
}

// Update pricing tab
function updatePricingTab() {
    // Update pricing titles
    const variant1Text = selectedBikes.variant1 ? ` ${selectedBikes.variant1.name}` : '';
    const variant2Text = selectedBikes.variant2 ? ` ${selectedBikes.variant2.name}` : '';
    document.getElementById('pricing1-title').textContent = `${selectedBikes.bike1.name}${variant1Text} Pricing`;
    document.getElementById('pricing2-title').textContent = `${selectedBikes.bike2.name}${variant2Text} Pricing`;
    
    // Get prices
    const price1 = selectedBikes.variant1 ? selectedBikes.variant1.price : 0;
    const price2 = selectedBikes.variant2 ? selectedBikes.variant2.price : 0;
    
    // Calculate estimated on-road prices (this is simplified)
    const roadTax1 = Math.round(price1 * 0.10);
    const roadTax2 = Math.round(price2 * 0.10);
    
    const insurance1 = Math.round(price1 * 0.065); // 3% insurance (example)
    const insurance2 = Math.round(price2 * 0.065);
    
    const onRoad1 = price1 + roadTax1 + insurance1; 
    const onRoad2 = price2 + roadTax2 + insurance2;
    
    // Update UI
    document.getElementById('price1-badge').textContent = `₹ ${price1.toLocaleString()}`;
    document.getElementById('price2-badge').textContent = `₹ ${price2.toLocaleString()}`;
    
    document.getElementById('ex-showroom1').textContent = `₹ ${price1.toLocaleString()}`;
    document.getElementById('ex-showroom2').textContent = `₹ ${price2.toLocaleString()}`;
    
    document.getElementById('tax1').textContent = `₹ ${roadTax1.toLocaleString()}`;
    document.getElementById('tax2').textContent = `₹ ${roadTax2.toLocaleString()}`;
    
    document.getElementById('insurance1').textContent = `₹ ${insurance1.toLocaleString()}`;
    document.getElementById('insurance2').textContent = `₹ ${insurance2.toLocaleString()}`;
    
    document.getElementById('onroad1').textContent = `₹ ${onRoad1.toLocaleString()}`;
    document.getElementById('onroad2').textContent = `₹ ${onRoad2.toLocaleString()}`;
}


function shareComparison() {
   alert("Implementation in progress")
}

// Show error message
function showError(message) {
    const comparisonSection = document.querySelector('.comparison-result');
    comparisonSection.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
            <a href="index.html#compare" class="btn-primary">Return to Comparison</a>
        </div>
    `;
    
    // Add error message styles if they don't exist yet
    if (!document.querySelector('style#error-styles')) {
        const style = document.createElement('style');
        style.id = 'error-styles';
        style.textContent = `
            .error-message {
                padding: 40px 20px;
                text-align: center;
                color: var(--text-primary);
            }
            .error-message i {
                font-size: 3rem;
                color: var(--error-color);
                margin-bottom: 20px;
            }
            .error-message p {
                font-size: 1.2rem;
                margin-bottom: 30px;
            }
        `;
        document.head.appendChild(style);
    }
}