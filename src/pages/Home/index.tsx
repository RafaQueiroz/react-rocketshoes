import React, { useState, useEffect } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';

import { ProductList } from './styles';
import { api } from '../../services/api';
import { formatPrice } from '../../util/format';
import { useCart } from '../../hooks/useCart';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
}

interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
  const { addProduct, cart } = useCart();
  
  const cartItemsAmount = cart.reduce((sumAmount, product) => {
    sumAmount[product.id] = product.amount;
    return sumAmount;

  }, {} as CartItemsAmount)
    
  const [products, setProducts] = useState<ProductFormatted[]>([]);
  
  useEffect(() => {
    
    function loadProducts() {
      const formattedProducts: ProductFormatted[] = []
      api.get('/products').then((response) => {
        response.data.forEach((product: Product) => {
          formattedProducts.push(
            ...products,
            {
              ...product,
              priceFormatted: formatPrice(product.price)
            }
          );
        });
        setProducts(formattedProducts);
      });
    }

    loadProducts();
  }, []);

  async function handleAddProduct(id: number) {
    await addProduct(id);
  }

  return (
    <ProductList>
      {
        products.map((product) => {
          return (
            <li key={product.id}>
              <img src={product.image} alt={product.title} />
              <strong>{product.title}</strong>
              <span>{product.priceFormatted}</span>
              <button
                type="button"
                data-testid="add-product-button"
                onClick={() => handleAddProduct(product.id)}
              >
                <div data-testid="cart-product-quantity">
                  <MdAddShoppingCart size={16} color="#FFF" />
                  { cartItemsAmount[product.id] || 0 }
                </div>

                <span>ADICIONAR AO CARRINHO</span>
              </button>
            </li>
          )
        })
      }
      
    </ProductList>
  );
};

export default Home;
