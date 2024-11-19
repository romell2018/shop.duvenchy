package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
	"github.com/stripe/stripe-go/v81"
	"github.com/stripe/stripe-go/v81/paymentintent"
)

type Product struct {
	Name        string            `json:"name"`
	Description string            `json:"description"`
	Price       float64           `json:"price"`
	Images      map[string]string `json:"images"`
	Sizes       []string          `json:"sizes"`
	Colors      []string          `json:"colors"`
	Variations  []Variation       `json:"variations"`
}

type Variation struct {
	Color string `json:"color"`
	Size  string `json:"size"`
	Stock int    `json:"stock"`
}

// Structure for billing and shipping info
type BillingInfo struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Address string `json:"address"`
	Phone   string `json:"phone"`
}

type ShippingInfo struct {
	Name    string `json:"name"`
	Address string `json:"address"`
	Phone   string `json:"phone"`
}

type OrderItem struct {
	Name     string `json:"name"`
	Quantity int    `json:"quantity"`
	Price    int64  `json:"price"` // Amount in cents
}

var products = []Product{
	{
		Name:        "Cool Shirt",
		Description: "This is a stylish shirt made from high-quality fabric, perfect for casual outings.",
		Price:       9.98,
		Images: map[string]string{
			"black": "https://shop-duvenchy.onrender.com/clothing/shirts/black-shirt.png",
			"white": "https://shop-duvenchy.onrender.com/clothing/shirts/white-shirt.png",
			"pink":  "https://shop-duvenchy.onrender.com/clothing/shirts/pink-shirt.png",
		},
		Sizes:  []string{"S", "M", "L", "XL"},
		Colors: []string{"black", "white", "pink"},
		Variations: []Variation{
			{Color: "black", Size: "S", Stock: 10},
			{Color: "black", Size: "M", Stock: 5},
			{Color: "white", Size: "L", Stock: 8},
			{Color: "pink", Size: "XL", Stock: 3},
		},
	},
	{
		Name:        "Stylish Hoodie",
		Description: "Our comfortable hoodie keeps you warm during the colder months, while also looking great.",
		Price:       99.00,
		Images: map[string]string{
			"white": "https://shop-duvenchy.onrender.com/clothing/hoodies/white-hoodie.png",
			"black": "https://shop-duvenchy.onrender.com/clothing/hoodies/black-hoodie.png",
			"blue":  "https://shop-duvenchy.onrender.com/clothing/hoodies/blue-hoodie.png",
		},
		Sizes:  []string{"S", "M", "L", "XL"},
		Colors: []string{"white", "black", "blue"},
		Variations: []Variation{
			{Color: "white", Size: "S", Stock: 15},
			{Color: "white", Size: "M", Stock: 10},
			{Color: "black", Size: "L", Stock: 7},
			{Color: "blue", Size: "XL", Stock: 4},
		},
	},
}

func getProducts(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(products)
}

func createPaymentIntent(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var req struct {
		Amount int64 `json:"amount"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	params := &stripe.PaymentIntentParams{
		Amount:   stripe.Int64(req.Amount),
		Currency: stripe.String("usd"),
	}

	pi, err := paymentintent.New(params)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"clientSecret": pi.ClientSecret})
}

// Process checkout, including billing/shipping info and items
func processCheckout(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var req struct {
		BillingInfo  BillingInfo  `json:"billingInfo"`
		ShippingInfo ShippingInfo `json:"shippingInfo"`
		Items        []OrderItem  `json:"items"`
		TotalAmount  int64        `json:"totalAmount"` // Amount in cents
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	// You can save order details in the database here (billing, shipping, items)

	// Create PaymentIntent with the totalAmount (amount in cents)
	params := &stripe.PaymentIntentParams{
		Amount:   stripe.Int64(req.TotalAmount),
		Currency: stripe.String("usd"),
	}
	pi, err := paymentintent.New(params)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Respond with the clientSecret to the frontend
	json.NewEncoder(w).Encode(map[string]string{"clientSecret": pi.ClientSecret})
}

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	stripe.Key = os.Getenv("sk_test_4eC39HqLyjWDarjtT1zdp7dc") // Use your Stripe secret key from .env
}

func main() {
	r := mux.NewRouter()

	// API Endpoints
	r.HandleFunc("/products", getProducts).Methods("GET")
	r.HandleFunc("/create-payment-intent", createPaymentIntent).Methods("POST")
	r.HandleFunc("/process-checkout", processCheckout).Methods("POST")

	// Serve static files for React and clothing images
	staticDir := "./build"
	r.PathPrefix("/clothing/").Handler(http.StripPrefix("/clothing/", http.FileServer(http.Dir("./clothing"))))
	r.PathPrefix("/").Handler(http.FileServer(http.Dir(staticDir)))

	// Catch-all handler for React routes
	r.NotFoundHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, filepath.Join(staticDir, "index.html"))
	})

	// Enable CORS
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"https://shop-duvenchy.onrender.com"},
		AllowCredentials: true,
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
	})

	// Start the server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("Server running at :%s", port)
	http.ListenAndServe(":"+port, c.Handler(r))
}
