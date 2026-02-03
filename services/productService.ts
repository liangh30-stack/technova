import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';
import { Product } from '../types';

const PRODUCTS_COLLECTION = 'products';

export interface FirestoreProduct {
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  brand?: string;
  compatibleModels?: string[];
  image: string;
  description: string;
  isBundle?: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Convert Firestore document to Product type
const docToProduct = (id: string, data: FirestoreProduct): Product => ({
  id,
  name: data.name,
  price: data.price,
  originalPrice: data.originalPrice,
  category: data.category,
  brand: data.brand,
  compatibleModels: data.compatibleModels,
  image: data.image,
  description: data.description,
  isBundle: data.isBundle,
});

// Get all products
export const getProducts = async (): Promise<Product[]> => {
  const q = query(collection(db, PRODUCTS_COLLECTION), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => docToProduct(doc.id, doc.data() as FirestoreProduct));
};

// Get a single product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return docToProduct(docSnap.id, docSnap.data() as FirestoreProduct);
};

// Create a new product
export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  const now = Timestamp.now();
  const firestoreProduct: FirestoreProduct = {
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice,
    category: product.category,
    brand: product.brand,
    compatibleModels: product.compatibleModels,
    image: product.image,
    description: product.description,
    isBundle: product.isBundle,
    createdAt: now,
    updatedAt: now,
  };

  const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), firestoreProduct);
  return docToProduct(docRef.id, firestoreProduct);
};

// Update an existing product
export const updateProduct = async (
  id: string,
  data: Partial<Omit<Product, 'id'>>
): Promise<void> => {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
};

// Delete a product
export const deleteProduct = async (id: string): Promise<void> => {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  await deleteDoc(docRef);
};

// Upload product image to Firebase Storage
export const uploadProductImage = async (file: File): Promise<string> => {
  const timestamp = Date.now();
  const fileName = `products/${timestamp}_${file.name}`;
  const storageRef = ref(storage, fileName);

  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);

  return downloadURL;
};

// Delete product image from Firebase Storage
export const deleteProductImage = async (imageUrl: string): Promise<void> => {
  try {
    // Extract the path from the URL
    const storageRef = ref(storage, imageUrl);
    await deleteObject(storageRef);
  } catch (error) {
    // Ignore errors for external URLs or already deleted images
    console.warn('Could not delete image:', error);
  }
};

// Import mock products to Firestore (migration helper)
export const importMockProducts = async (products: Omit<Product, 'id'>[]): Promise<void> => {
  const batch = products.map(product => createProduct(product));
  await Promise.all(batch);
};
