/*import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "renderer.js";
const ProductList = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8000/billing');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div>
            <h1>Patient Records</h1>
            <ul>
                {products.map((product) => (
                    <li key={product._id}>
                        <h2>{product.patientName}</h2>
                        <p>Prescription: {product.prescription}</p>
                        <p>Registration No: {product.registrationNumber}</p>
                        <p>Scan Type: {product.scanType}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductList;*/

