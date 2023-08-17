import { AddressConfig } from "./logs.js";


export const arr = []; // Оголошуємо масив за межами функції

export function UsersData() {
  const userData = {
    id: arr.length + 1, // Використовуємо довжину масиву для визначення нового id
    address: AddressConfig.addressGen(),
    balance: AddressConfig.balanceLog(),
    privatKey: AddressConfig.privatKeyGen(),
    publicKey: AddressConfig.publicKeyGen(),
  };

  arr.push(userData); // Додаємо об'єкт userData до масиву
  //debugger;
  return userData;
}

