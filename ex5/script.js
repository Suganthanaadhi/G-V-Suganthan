let products = [];
let cart = [];
let notifications = {}; // Object to store user notifications for products

// Initial products array
products = [
    {
        name: 'Bicycle',
        price: 5000,
        description: 'Used bicycle in good condition.',
        image: 'bicycle.jpg',
        reviews: [
            { rating: 4, comment: "Great bike, rides smooth!" },
            { rating: 5, comment: "Amazing value for money." }
        ]
    },
    {
        name: 'Camera',
        price: 3000,
        description: 'Vintage camera for sale.',
        image: 'camera.jpg',
        reviews: [
            { rating: 3, comment: "Works well but a bit outdated." }
        ]
    },
    {
        name: 'Smartphone',
        price: 15000,
        description: 'Latest model smartphone.',
        image: 'smartphone.jpg',
        reviews: [
            { rating: 4, comment: "Works great!" },
            { rating: 5, comment: "Amazing features!" },
            { rating: 3, comment: "Good value for money." }
        ]
    },
    {
        name: 'Leather Jacket',
        price: 500,
        description: 'Cool design.',
        image: 'jacket.jpg',
        reviews: [
            { rating: 5, comment: "Stylish and comfortable!" },
            { rating: 4, comment: "Perfect for winter." }
        ]
    },
    {
        name: 'Gaming Console',
        price: 6000,
        description: 'Latest model console.',
        image: 'console.jpg',
        reviews: [
            { rating: 4, comment: "Great gaming experience!" },
            { rating: 2, comment: "Had some issues with loading." },
            { rating: 5, comment: "Love the graphics!" }
        ]
    }
];

// Load products from localStorage if available
if (localStorage.getItem('products')) {
    products = JSON.parse(localStorage.getItem('products'));
} else {
    // Store initial products in localStorage
    localStorage.setItem('products', JSON.stringify(products));
}

// Load cart from localStorage if available
if (localStorage.getItem('cart')) {
    cart = JSON.parse(localStorage.getItem('cart'));
}

// Load notifications from localStorage if available
if (localStorage.getItem('notifications')) {
    notifications = JSON.parse(localStorage.getItem('notifications'));
}

// Function to display products
function displayProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    products.forEach((product, index) => {
        const div = document.createElement('div');
        div.classList.add('product-card');
        div.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>Price: ₹${product.price}</p>
            <button onclick="addToCart('${product.name}', ${product.price})">Add to Cart</button>
            <button onclick="subscribeToProduct('${product.name}')">Notify Me When Sold</button>
            <div class="reviews">
                <h4>Reviews:</h4>
                ${getProductReviews(product)}
                <form onsubmit="addReview(${index}); return false;">
                    <label>Rating (1-5):</label>
                    <input type="number" min="1" max="5" id="rating-${index}" required>
                    <textarea id="review-${index}" placeholder="Write a review" required></textarea>
                    <button type="submit">Submit Review</button>
                </form>
            </div>
        `;
        productList.appendChild(div);
    });
}

function getProductReviews(product) {
    if (product.reviews.length === 0) return '<p>No reviews yet.</p>';
    return product.reviews
        .map(review => `<p>${review.rating}/5 - ${review.comment}</p>`)
        .join('');
}

function addReview(productIndex) {
    const rating = document.getElementById(`rating-${productIndex}`).value;
    const comment = document.getElementById(`review-${productIndex}`).value;

    const newReview = { rating: parseInt(rating), comment };
    products[productIndex].reviews.push(newReview);

    // Update the product list
    displayProducts();
    // Save updated products to localStorage
    localStorage.setItem('products', JSON.stringify(products));
}

function showCheckout() {
    const address = prompt("Enter your delivery address:");
    const paymentMethod = prompt("Enter your payment method (e.g., Credit Card):");
    alert(`Your order has been placed!\nDelivery Address: ${address}\nPayment Method: ${paymentMethod}`);
    cart = []; // Clear the cart after checkout
    updateCart();
}

function toggleSellProductForm() {
    const form = document.getElementById('sell-product-form');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

function filterProducts() {
    const maxPrice = parseFloat(document.getElementById('price-filter').value);
    document.getElementById('price-display').textContent = `$${maxPrice}`;

    const filteredProducts = products.filter(product => product.price <= maxPrice);
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    if (filteredProducts.length === 0) {
        productList.innerHTML = '<p>No products found in this price range.</p>';
    } else {
        filteredProducts.forEach(product => {
            const div = document.createElement('div');
            div.classList.add('product-card');
            div.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p>Price: ₹${product.price.toFixed(2)}</p>
                <button onclick="addToCart('${product.name}', ${product.price})">Add to Cart</button>
                <button onclick="subscribeToProduct('${product.name}')">Notify Me When Sold</button>
            `;
            productList.appendChild(div);
        });
    }
}

function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const address = document.getElementById('address').value;

    alert(`Registered Successfully!\nUsername: ${username}\nAddress: ${address}`);
    window.location.href = 'index.html';
}

function addToCart(name, price) {
    cart.push({ name, price });
    updateCart();
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${name} has been added to your cart!`);
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const totalPriceElem = document.getElementById('total-price');
    const cartCount = document.getElementById('cart-count');
    cartItems.innerHTML = '';

    let total = 0;
    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${item.name} - ₹${item.price}
            <button onclick="removeFromCart(${index})">Remove</button>
        `;
        cartItems.appendChild(li);
        total += item.price;
    });
    totalPriceElem.textContent = `Total: ₹${total.toFixed(2)}`;
    cartCount.textContent = cart.length;
}

function removeFromCart(index) {
    const removedItem = cart[index].name; // Get the name of the product to alert
    cart.splice(index, 1);
    updateCart();
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${removedItem} has been removed from your cart.`);
}

function proceedToPayment() {
    window.location.href = "payment.html";
}

function addProduct() {
    const productName = document.getElementById('product-name').value;
    const productPrice = document.getElementById('product-price').value;
    const productDescription = document.getElementById('product-description').value;
    const productImage = document.getElementById('product-image').files[0];

    const reader = new FileReader();
    reader.onload = function (e) {
        const newProduct = {
            name: productName,
            price: parseFloat(productPrice),
            description: productDescription,
            image: e.target.result,
            reviews: []
        };

        products.push(newProduct);
        displayProducts();
        // Save updated products to localStorage
        localStorage.setItem('products', JSON.stringify(products));
        alert(`Your product has been added to the display for SALE!`);
    };

    reader.readAsDataURL(productImage);
    document.getElementById('sell-product-form').reset();
}

// Function to subscribe to product notifications
function subscribeToProduct(productName) {
    if (!notifications[productName]) {
        notifications[productName] = [];
    }
    const email = prompt("Enter your email to subscribe for notifications:");
    if (email) {
        notifications[productName].push(email);
        alert(`You will be notified when ${productName} is sold!`);
        // Save updated notifications to localStorage
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }
}

// Function to notify users when a product is sold
function notifyUsers(productName) {
    if (notifications[productName]) {
        notifications[productName].forEach(email => {
            alert(`Notifying ${email}: ${productName} has been sold!`);
        });
        // Clear notifications after sending
        delete notifications[productName];
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }
}

// Example of selling a product
function sellProduct(productName) {
    // Logic to sell the product
    alert(`${productName} has been sold!`);
    notifyUsers(productName); // Notify all subscribers
}

// Function to show different sections
function showSection(sectionId) {
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');
}
function addProduct() {
    // Product addition logic goes here (already implemented).

    // Trigger a rotation animation on the cart link.
    const cartLink = document.getElementById("cart-link");
    cartLink.classList.add("rotating");

    // Remove rotation class after animation ends.
    setTimeout(() => {
        cartLink.classList.remove("rotating");
    }, 600); // Duration should match the CSS rotation animation time.
}

function filterProducts() {
    const priceFilter = document.getElementById("price-filter").value;
    document.getElementById("price-display").innerText = `Max Price: $${priceFilter}`;
    // Filter logic would be implemented here.
}


// Initialize product display
displayProducts();
updateCart(); // Initialize cart display
