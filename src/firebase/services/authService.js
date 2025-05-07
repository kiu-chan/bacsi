// firebase/services/authService.js
import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../config';
import { getDocument } from './firestoreService';

// Đăng nhập với email và mật khẩu
export const loginWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Lấy thông tin profile từ Firestore
    const profile = await getDocument('users', user.uid);
    
    console.log("Login successful, user:", user.uid);
    console.log("User profile:", profile);
    
    return {
      user,
      profile
    };
  } catch (error) {
    console.error("Login error:", error.code, error.message);
    throw error;
  }
};

// Đăng nhập bằng Google - chỉ cho phép đăng nhập với tài khoản đã tồn tại
export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;
    
    // Kiểm tra xem user đã tồn tại trong Firestore chưa
    const profile = await getDocument('users', user.uid);
    
    // Nếu chưa tồn tại, thông báo lỗi
    if (!profile) {
      throw {
        code: 'auth/user-not-found',
        message: 'Tài khoản này chưa được đăng ký trong hệ thống. Vui lòng liên hệ quản trị viên.'
      };
    }
    
    console.log("Đăng nhập Google thành công, user:", user.uid);
    console.log("User profile:", profile);
    
    return {
      user,
      profile
    };
  } catch (error) {
    console.error("Lỗi đăng nhập Google:", error.code, error.message);
    throw error;
  }
};

// Đăng xuất
export const logout = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    throw error;
  }
};

// Gửi email đặt lại mật khẩu
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    throw error;
  }
};

// Cập nhật thông tin người dùng
export const updateUserProfile = async (displayName, photoURL) => {
  try {
    const user = auth.currentUser;
    if (user) {
      await updateProfile(user, {
        displayName: displayName || user.displayName,
        photoURL: photoURL || user.photoURL
      });
      return true;
    }
    return false;
  } catch (error) {
    throw error;
  }
};

// Lắng nghe sự thay đổi trạng thái xác thực
export const authStateListener = (callback) => {
  return onAuthStateChanged(auth, callback);
};