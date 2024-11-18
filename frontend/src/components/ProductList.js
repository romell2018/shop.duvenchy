import React, { useState, useEffect } from 'react';
import Product from '../components/Product';

const ProductList = ({ addToCart }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const response = await fetch('http://localhost:8080/products'); // Call Go server
            const data = await response.json();
            setProducts(data); // Set products state
        };
        fetchProducts();
    }, []);

    return (
        <div className="container mx-auto px-30">
            <h1 className="text-2xl font-bold text-center my-8">Our Products</h1>
            <div className="grid gap-20">
                {products.map((product) => (
                    <Product
                        key={product.name} // Assuming name is unique
                        name={product.name}
                        description={product.description}
                        price={product.price}
                        images={product.images}
                        sizes={product.sizes}
                        colors={product.colors}
                        variations={product.variations}
                        addToCart={addToCart}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProductList;
