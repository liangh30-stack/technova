import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  orderBy,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from './firebase';
import type { Customer, CustomerAddress, CustomerOrder, FirestoreCartItem } from '../types';

// ============ AUTH ============

export const registerCustomer = async (
  email: string,
  password: string,
  displayName: string
): Promise<Customer> => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const now = new Date().toISOString();
  const customer: Customer = {
    uid: cred.user.uid,
    email,
    displayName,
    createdAt: now,
    updatedAt: now,
  };
  await setDoc(doc(db, 'customers', cred.user.uid), customer);
  return customer;
};

export const signInCustomer = async (
  email: string,
  password: string
): Promise<Customer> => {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const profile = await getCustomerProfile(cred.user.uid);
  if (!profile) throw new Error('Customer profile not found');
  return profile;
};

export const signOutCustomer = async (): Promise<void> => {
  await signOut(auth);
};

export const sendCustomerPasswordReset = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};

export const onCustomerAuthChange = (
  callback: (customer: Customer | null) => void
): (() => void) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const profile = await getCustomerProfile(user.uid);
      callback(profile);
    } else {
      callback(null);
    }
  });
};

// ============ PROFILE ============

export const getCustomerProfile = async (uid: string): Promise<Customer | null> => {
  const snap = await getDoc(doc(db, 'customers', uid));
  return snap.exists() ? (snap.data() as Customer) : null;
};

export const updateCustomerProfile = async (
  uid: string,
  data: Partial<Customer>
): Promise<void> => {
  await updateDoc(doc(db, 'customers', uid), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
};

// ============ ADDRESSES ============

export const getAddresses = async (uid: string): Promise<CustomerAddress[]> => {
  const snap = await getDocs(collection(db, 'customers', uid, 'addresses'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as CustomerAddress));
};

export const addAddress = async (
  uid: string,
  address: Omit<CustomerAddress, 'id'>
): Promise<CustomerAddress> => {
  const ref = doc(collection(db, 'customers', uid, 'addresses'));
  const newAddress: CustomerAddress = { ...address, id: ref.id };
  await setDoc(ref, newAddress);
  return newAddress;
};

export const updateAddress = async (
  uid: string,
  addressId: string,
  data: Partial<CustomerAddress>
): Promise<void> => {
  await updateDoc(doc(db, 'customers', uid, 'addresses', addressId), data);
};

export const deleteAddress = async (uid: string, addressId: string): Promise<void> => {
  await deleteDoc(doc(db, 'customers', uid, 'addresses', addressId));
};

export const setDefaultAddress = async (uid: string, addressId: string): Promise<void> => {
  const addresses = await getAddresses(uid);
  const batch = writeBatch(db);
  addresses.forEach((addr) => {
    batch.update(doc(db, 'customers', uid, 'addresses', addr.id), {
      isDefault: addr.id === addressId,
    });
  });
  await batch.commit();
};

// ============ CART ============

export const getFirestoreCart = async (uid: string): Promise<FirestoreCartItem[]> => {
  const snap = await getDocs(collection(db, 'customers', uid, 'cart'));
  return snap.docs.map((d) => d.data() as FirestoreCartItem);
};

export const setFirestoreCart = async (
  uid: string,
  items: FirestoreCartItem[]
): Promise<void> => {
  const batch = writeBatch(db);
  // Delete existing
  const existing = await getDocs(collection(db, 'customers', uid, 'cart'));
  existing.docs.forEach((d) => batch.delete(d.ref));
  // Write new
  items.forEach((item) => {
    const ref = doc(collection(db, 'customers', uid, 'cart'));
    batch.set(ref, item);
  });
  await batch.commit();
};

export const clearFirestoreCart = async (uid: string): Promise<void> => {
  const batch = writeBatch(db);
  const snap = await getDocs(collection(db, 'customers', uid, 'cart'));
  snap.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
};

// ============ ORDERS ============

export const saveCustomerOrder = async (
  uid: string,
  order: CustomerOrder
): Promise<void> => {
  await setDoc(doc(db, 'customers', uid, 'orders', order.id), order);
};

export const getCustomerOrders = async (uid: string): Promise<CustomerOrder[]> => {
  const snap = await getDocs(
    query(collection(db, 'customers', uid, 'orders'), orderBy('date', 'desc'))
  );
  return snap.docs.map((d) => d.data() as CustomerOrder);
};

// ============ FAVORITES ============

export const getFavorites = async (uid: string): Promise<(string | number)[]> => {
  const snap = await getDocs(collection(db, 'customers', uid, 'favorites'));
  return snap.docs.map((d) => d.data().productId);
};

export const addFavorite = async (
  uid: string,
  productId: string | number
): Promise<void> => {
  await setDoc(doc(db, 'customers', uid, 'favorites', String(productId)), {
    productId,
    addedAt: new Date().toISOString(),
  });
};

export const removeFavorite = async (
  uid: string,
  productId: string | number
): Promise<void> => {
  await deleteDoc(doc(db, 'customers', uid, 'favorites', String(productId)));
};
