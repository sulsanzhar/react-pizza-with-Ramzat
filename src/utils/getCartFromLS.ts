import { get, ref } from 'firebase/database';
import { db } from '../firebase';
import { CartItem } from '../redux/cart/types';
import { calcTotalPrice } from './calcTotalPrice';

export const getCartFromFirebase = async () => {
  const snapshot = await get(ref(db, 'cart'));
  
  if (snapshot.exists()) {
    const data = snapshot.val();
    const items = data.items || [];
    const totalPrice = calcTotalPrice(items);
    
    return {
      items: items as CartItem[],
      totalPrice,
    };
  } else {
    return { items: [], totalPrice: 0 };
  }
};
