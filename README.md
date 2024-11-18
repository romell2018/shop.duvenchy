Clothing E-Commerce Website

Project Overview

This is a fully functional e-commerce platform for selling clothing items, including shirts and hoodies, built using React and TailwindCSS for the front-end and Go for the back-end. The website is optimized for both desktop and mobile experiences, featuring modern UI components and an efficient checkout process.

Features

Front-End (React & TailwindCSS)

	•	Home Page: Displays the logo prominently, with featured items and navigation.
	•	Product List: A vertical list of clothing items with photos, names, descriptions, and interactive elements like color choices and size dropdowns.
	•	Product Details: Each item has a dedicated page that shows stock availability, size options, and an “Add to Cart” button.
	•	Cart Functionality: A cart component displaying the number of items, subtotal, a “View Cart” button, and a “Checkout” button. Users can add, view, or remove items from the cart.
	•	Mobile Navigation: A responsive navbar with the logo on the right and a cart icon on the left.
	•	Checkout Process: Secure checkout options with payment integration.

Back-End (Go)

	•	REST API: Built using Go to handle product management, user authentication, and order processing.
	•	Database Integration: Manages products, users, and order data efficiently.
	•	Stock Management: Real-time stock updates and notifications for sold-out items.
	•	

Technologies Used

	•	Front-End: React, TailwindCSS
	•	Back-End: Go
	•	Database: (Specify the database, e.g., PostgreSQL, MongoDB, etc.)
	•	Payment Integration: (e.g., Stripe, PayPal)

Installation

	1.	Clone the repository:

git clone https://github.com/romell2018/shop.duvenchy.git


	2.	Navigate to the project directory:

cd clothing-website



Front-End Setup

	3.	Install dependencies:

npm install


	4.	Start the development server:

npm start



Back-End Setup

	5.	Install Go and dependencies:

go get ./...


	6.	Run the Go server:

go run main.go



Usage

	•	User Experience: Browse products, customize clothing options, add items to the cart, and proceed to checkout.
	

Mobile Responsiveness

The website is fully responsive, offering an optimized experience for both desktop and mobile users, with a collapsible navbar and easy-to-use mobile cart.

Future Enhancements

	•	User Authentication: Adding secure user login and registration features.
	•	Wishlist Feature: Enabling users to save their favorite items.
	•	Review System: Allowing customers to leave product reviews and ratings.

Contributing

Contributions are welcome! Please submit a pull request with your changes and ensure they align with the project’s guidelines.

License

This project is licensed under the MIT License. See the LICENSE file for more details.

