import { get, ref } from 'firebase/database';
import { db } from '../firebase';
import { CartItem } from '../redux/cart/types';
import { calcTotalPrice } from './calcTotalPrice';


export const getCartFromFirebase = async (uid: string) => {
  const snapshot = await get(ref(db, `carts/${uid}`));
  
  if (snapshot.exists()) {
    const data = snapshot.val();
    
    const items = (data.items || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      price: Number(item.price),
      imageUrl: item.imageUrl,
      type: item.type,
      size: item.size,
      count: Number(item.count) || 1,
    }));
    
    const totalPrice = calcTotalPrice(items);
    
    console.log('✅ Загруженные товары из Firebase:', items);
    console.log('💰 Пересчитанная сумма:', totalPrice);
    
    return { items: items as CartItem[], totalPrice };
  }
  
  return { items: [], totalPrice: 0 };
};
