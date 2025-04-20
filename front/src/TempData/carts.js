// src/TempData/carts.js
import { getCookie, setCookie } from './auth';

const CART_COOKIE = 'cart';

/**
 * Прочитать корзину из куки (массив объектов { id, seance_id, seat_id })
 */
function readCartFromCookie() {
  const raw = getCookie(CART_COOKIE);
  try {
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Записать корзину в куки (max-age ≈ 10 лет)
 */
function writeCartToCookie(items) {
  setCookie(CART_COOKIE, JSON.stringify(items), 3650);
}

/**
 * Получить все элементы из корзины
 * @returns {Promise<Array<{ id: number, seance_id: number, seat_id: number }>>}
 */
export function getUserCart() {
  const items = readCartFromCookie();
  console.log('Cart loaded from cookie:', items);
  return Promise.resolve(items);
}

/**
 * Добавить один билет в корзину
 * @param {{ user_id: number, seance_id: number, seat_id: number }} payload
 * @returns {Promise<{ id: number, seance_id: number, seat_id: number }>}
 */
export function addCart({ user_id, seance_id, seat_id }) {
  const items = readCartFromCookie();
  const id = Date.now(); // уникальный идентификатор
  const entry = { id, seance_id, seat_id };
  items.push(entry);
  writeCartToCookie(items);
  console.log(`Added to cart (user ${user_id}):`, entry);
  return Promise.resolve(entry);
}

/**
 * Удалить один элемент из корзины по его cartId
 * @param {number} cartId
 * @returns {Promise<'deleted'>}
 */
export function deleteCart(cartId) {
  let items = readCartFromCookie();
  items = items.filter(item => item.id !== cartId);
  writeCartToCookie(items);
  console.log('Removed from cart:', cartId);
  return Promise.resolve('deleted');
}

/**
 * Очистить всю корзину
 * @returns {Promise<'cleared'>}
 */
export function deleteUserCart() {
  writeCartToCookie([]);
  console.log('Cleared entire cart');
  return Promise.resolve('cleared');
}
