import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, set, get, update, child, query, orderByChild, equalTo, onValue } from 'firebase/database';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import bcrypt from 'bcryptjs';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { app, db, storage, auth, ref, push, set, get, update, query, orderByChild, equalTo, onValue, onAuthStateChanged };

export const listenToDeviceData = (callback) => {
  const deviceRef = ref(db, 'device/-OgEmMPsbUdxg_k3bnOh');
  
  const unsubscribe = onValue(deviceRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      callback(data);
    }
  }, (error) => {
  });
  
  return unsubscribe;
};

export const sendCommandToDevice = async (command) => {
  const commandRef = ref(db, 'device/-OgEmMPsbUdxg_k3bnOh/command');
  try {
    await set(commandRef, {
      ...command,
      timestamp: Date.now()
    });
    return true;
  } catch (error) {
    return false;
  }
};

export const hashPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw error;
  }
};

export const generateReferralCode = (name) => {
  const cleanName = name.toUpperCase().replace(/\s+/g, '').substring(0, 5);
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${cleanName}${year}${randomNum}`;
};

export const checkEmailExists = async (email) => {
  const usersRef = ref(db, 'users');
  const snapshot = await get(usersRef);
  if (snapshot.exists()) {
    const users = snapshot.val();
    return Object.values(users).some(user => user.email === email);
  }
  return false;
};

export const checkUniqueCodeExists = async (code) => {
  const codesRef = ref(db, 'users');
  const snapshot = await get(codesRef);
  if (snapshot.exists()) {
    const users = snapshot.val();
    return Object.values(users).some(user => user.uniqueCode === code);
  }
  return false;
};

export const saveUserToDatabase = async (userData) => {
  try {
    const usersRef = ref(db, 'users');
    const newUserRef = push(usersRef);
    await set(newUserRef, userData);
    return newUserRef.key;
  } catch (error) {
    console.error('Error saving user:', error);
    throw error;
  }
};

export const addValidUniqueCode = async (code, deviceInfo) => {
  try {
    const validCodesRef = ref(db, 'validCodes');
    const newCodeRef = push(validCodesRef);
    await set(newCodeRef, {
      code,
      deviceInfo,
      createdAt: new Date().toISOString(),
      isActive: true
    });
    return newCodeRef.key;
  } catch (error) {
    console.error('Error adding valid code:', error);
    throw error;
  }
};

export const isValidUniqueCode = async (code) => {
  const validCodesRef = ref(db, 'validCodes');
  const snapshot = await get(validCodesRef);
  if (snapshot.exists()) {
    const data = snapshot.val();
    return Object.values(data).some(item => item.code === code && item.isActive);
  }
  return false;
};

export const getAllUsers = async () => {
  try {
    const usersRef = ref(db, 'users');
    const snapshot = await get(usersRef);
    
    if (snapshot.exists()) {
      const users = snapshot.val();
      return Object.keys(users).map(key => ({
        id: key,
        ...users[key]
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getUserStats = async () => {
  try {
    const users = await getAllUsers();
    
    const stats = {
      totalUsers: users.length,
      activeUsers: users.filter(user => user.status === 'active').length,
      inactiveUsers: users.filter(user => user.status === 'inactive').length,
      newUsersThisMonth: users.filter(user => {
        const joinDate = new Date(user.createdAt);
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        return joinDate.getMonth() === currentMonth && joinDate.getFullYear() === currentYear;
      }).length
    };
    
    return stats;
  } catch (error) {
    console.error('Error calculating user stats:', error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const userRef = ref(db, `users/${userId}`);
    await set(userRef, null);
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const updateUserStatus = async (userId, status) => {
  try {
    const userRef = ref(db, `users/${userId}`);
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
      await set(userRef, {
        ...snapshot.val(),
        status: status,
        updatedAt: new Date().toISOString()
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error;
  }
};

export const addAdmin = async (adminData) => {
  try {
    const adminId = adminData.email.replace(/[^a-zA-Z0-9]/g, '_');
    const adminRef = ref(db, `admins/${adminId}`);
    
    const adminWithTimestamp = {
      ...adminData,
      id: adminId,
      email: adminData.email,
      emailVerified: true,
      isActive: true,
      password: await hashPassword(adminData.password),
      createdAt: new Date().toISOString(),
      verifiedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      role: 'admin',
      permissions: adminData.permissions || 'full'
    };
    await set(adminRef, adminWithTimestamp);
    return adminId;
  } catch (error) {
    console.error('Error adding admin:', error);
    throw error;
  }
};

export const getAllAdmins = async () => {
  try {
    const adminsRef = ref(db, 'admins');
    const snapshot = await get(adminsRef);
    
    if (snapshot.exists()) {
      const admins = snapshot.val();
      return Object.keys(admins).map(key => ({
        id: key,
        ...admins[key]
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching admins:', error);
    throw error;
  }
};

export const isAdmin = async (email) => {
  try {
    const adminsRef = ref(db, 'admins');
    const snapshot = await get(adminsRef);
    
    if (snapshot.exists()) {
      const admins = snapshot.val();
      return Object.values(admins).some(admin => admin.email === email);
    }
    return false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

export const deleteAdmin = async (adminId) => {
  try {
    const adminRef = ref(db, `admins/${adminId}`);
    await set(adminRef, null);
    return true;
  } catch (error) {
    console.error('Error deleting admin:', error);
    throw error;
  }
};

export const updateAdmin = async (adminId, adminData) => {
  try {
    const adminRef = ref(db, `admins/${adminId}`);
    const snapshot = await get(adminRef);
    
    if (snapshot.exists()) {
      await set(adminRef, {
        ...snapshot.val(),
        ...adminData,
        updatedAt: new Date().toISOString()
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating admin:', error);
    throw error;
  }
};

export const promoteUserToAdmin = async (userId, adminData) => {
  try {
    const userRef = ref(db, `users/${userId}`);
    const userSnapshot = await get(userRef);
    
    if (!userSnapshot.exists()) {
      throw new Error('User tidak ditemukan');
    }
    
    const userData = userSnapshot.val();
    
    const adminId = await addAdmin({
      name: userData.name || userData.email?.split('@')[0],
      email: userData.email,
      originalUserId: userId,
      ...adminData
    });
    
    await set(userRef, {
      ...userData,
      role: 'admin',
      updatedAt: new Date().toISOString()
    });
    
    return adminId;
  } catch (error) {
    console.error('Error promoting user to admin:', error);
    throw error;
  }
};

export const addProduct = async (productData) => {
  try {
    const productsRef = ref(db, 'products');
    const newProductRef = push(productsRef);
    
    const productWithTimestamp = {
      ...productData,
      id: newProductRef.key,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await set(newProductRef, productWithTimestamp);
    return newProductRef.key;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const getAllProducts = async () => {
  try {
    const productsRef = ref(db, 'products');
    const snapshot = await get(productsRef);
    
    if (snapshot.exists()) {
      const products = snapshot.val();
      return Object.keys(products).map(key => ({
        id: key,
        ...products[key]
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    const productRef = ref(db, `products/${productId}`);
    await set(productRef, null);
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    const productRef = ref(db, `products/${productId}`);
    const snapshot = await get(productRef);
    
    if (snapshot.exists()) {
      await set(productRef, {
        ...snapshot.val(),
        ...productData,
        updatedAt: new Date().toISOString()
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const addFormula = async (formulaData) => {
  try {
    const formulasRef = ref(db, 'formulas');
    const newFormulaRef = push(formulasRef);
    await set(newFormulaRef, formulaData);
    return newFormulaRef.key;
  } catch (error) {
    console.error('Error adding formula:', error);
    throw error;
  }
};

export const getAllFormulas = async () => {
  try {
    const formulasRef = ref(db, 'formulas');
    const snapshot = await get(formulasRef);
    
    if (snapshot.exists()) {
      const formulas = snapshot.val();
      return Object.keys(formulas).map(key => ({
        id: key,
        ...formulas[key]
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching formulas:', error);
    throw error;
  }
};

export const deleteFormula = async (formulaId) => {
  try {
    const formulaRef = ref(db, `formulas/${formulaId}`);
    await set(formulaRef, null);
    return true;
  } catch (error) {
    console.error('Error deleting formula:', error);
    throw error;
  }
};

export const updateFormula = async (formulaId, formulaData) => {
  try {
    const formulaRef = ref(db, `formulas/${formulaId}`);
    const snapshot = await get(formulaRef);
    
    if (snapshot.exists()) {
      await set(formulaRef, {
        ...snapshot.val(),
        ...formulaData,
        updatedAt: new Date().toISOString()
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating formula:', error);
    throw error;
  }
};

export const updateUserProfile = async (userEmail, profileData) => {
  try {
    const sanitizedEmail = userEmail.replace(/[^a-zA-Z0-9]/g, '_');
    const userRef = ref(db, `users/${sanitizedEmail}`);
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
      await update(userRef, profileData);
      return true;
    }
    
    const adminRef = ref(db, `admins/${sanitizedEmail}`);
    const adminSnapshot = await get(adminRef);
    
    if (adminSnapshot.exists()) {
      await update(adminRef, profileData);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const uploadImage = async (file, folder = 'products') => {
  try {
    const timestamp = Date.now();
    const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const filename = `${timestamp}_${cleanName}`;
    const imageRef = storageRef(storage, `${folder}/${filename}`);
    
    const metadata = {
      contentType: file.type,
      cacheControl: 'public,max-age=31536000'
    };
    
    await uploadBytes(imageRef, file, metadata);
    
    const downloadURL = await getDownloadURL(imageRef);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    
    if (error.code === 'storage/unauthorized' || error.message.includes('CORS')) {
      console.error('CORS Error: Please configure Firebase Storage CORS rules');
      throw new Error('Firebase Storage CORS configuration required. Please check console for details.');
    }
    
    throw error;
  }
};

export const addProductWithImage = async (productData, imageFile) => {
  try {
    let imageUrl = '';
    
    if (imageFile) {
      if (typeof imageFile === 'object' && imageFile.name) {
        imageUrl = await uploadImage(imageFile, 'products');
      } 
      else if (typeof imageFile === 'string') {
        imageUrl = imageFile;
      }
    }
    
    const productsRef = ref(db, 'products');
    const newProductRef = push(productsRef);
    
    const productWithTimestamp = {
      ...productData,
      id: newProductRef.key,
      image: imageUrl,
      price: parseInt(productData.price),
      stock: parseInt(productData.stock),
      status: parseInt(productData.stock) <= 5 ? 'low-stock' : 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await set(newProductRef, productWithTimestamp);
    return newProductRef.key;
  } catch (error) {
    console.error('Error adding product with image:', error);
    throw error;
  }
};

export const getCartItems = async (userId) => {
  try {
    const cartRef = ref(db, `carts/${userId}`);
    const snapshot = await get(cartRef);
    
    if (snapshot.exists()) {
      const cart = snapshot.val();
      return Object.keys(cart).map(key => ({
        id: key,
        ...cart[key]
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching cart items:', error);
    throw error;
  }
};

export const addToCart = async (userId, productData) => {
  try {
    const cartRef = ref(db, `carts/${userId}`);
    const newCartItemRef = push(cartRef);
    
    const cartItem = {
      ...productData,
      id: newCartItemRef.key,
      userId: userId,
      quantity: productData.quantity || 1,
      addedAt: new Date().toISOString()
    };
    
    await set(newCartItemRef, cartItem);
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

export const updateCartItem = async (userId, itemId, quantity) => {
  try {
    const itemRef = ref(db, `carts/${userId}/${itemId}`);
    const snapshot = await get(itemRef);
    
    if (snapshot.exists()) {
      await set(itemRef, {
        ...snapshot.val(),
        quantity: quantity,
        updatedAt: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
};

export const removeFromCart = async (userId, itemId) => {
  try {
    const itemRef = ref(db, `carts/${userId}/${itemId}`);
    await set(itemRef, null);
    return true;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

export const clearCart = async (userId) => {
  try {
    const cartRef = ref(db, `carts/${userId}`);
    await set(cartRef, null);
    return true;
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};

export const getProductById = async (productId) => {
  try {
    const productRef = ref(db, `products/${productId}`);
    const snapshot = await get(productRef);
    
    if (snapshot.exists()) {
      return {
        id: productId,
        ...snapshot.val()
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};