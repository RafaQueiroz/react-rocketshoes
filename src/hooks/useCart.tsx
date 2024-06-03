import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';


const CART_LOCALSTORAGE_KEY = 'cart';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
     const storagedCart = localStorage.getItem(CART_LOCALSTORAGE_KEY);

     if (storagedCart) {
       return JSON.parse(storagedCart);
     }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const response = await api.get<Stock>('/stock/' + productId);
      
      if(response.status !== 200){
        throw Error('Sorry. Something went wrong with the request.');
      }
      
      const stockProduct: Stock = response.data;
      if(stockProduct == null){
        throw Error('There is no product with id ' + productId + 'in our stock.');
      }
      
      if(stockProduct.amount <= 0){
        throw Error('Empty stock!');
      }
      
      const productCart = cart.find((product: Product) => product.id === productId);

      if(productCart == null && stockProduct.amount > 0){
        const { data } = await api.get<Product>('/products/' + productId);
        data.amount = 1;
        setCart([...cart, data]);
        return;
      }

      const productAmount = productCart?.amount;
      if( productAmount != null && productAmount + 1 > stockProduct.amount){
        throw Error('Sorry! There is not enough of this product in our stock');
      }
       
      if( productCart?.amount != null ){
        productCart.amount += 1;
      }

      setCart([...cart]);
    } catch (error) {
      alert(error);
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
