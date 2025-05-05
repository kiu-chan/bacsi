// firebase/services/userService.js
import {
    collection,
    query,
    where,
    getDocs,
    getDoc,
    doc,
    serverTimestamp,
    updateDoc
  } from 'firebase/firestore';
  import { db } from '../config';
  
  // Collection name
  const USERS_COLLECTION = 'users';
  
  // Tìm kiếm người dùng theo email
  export const getUserByEmail = async (email) => {
    try {
      const q = query(
        collection(db, USERS_COLLECTION),
        where('email', '==', email)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }
      
      // Lấy kết quả đầu tiên
      const userDoc = querySnapshot.docs[0];
      return {
        id: userDoc.id,
        ...userDoc.data()
      };
    } catch (error) {
      console.error("Lỗi khi tìm kiếm người dùng theo email:", error);
      throw error;
    }
  };
  
  // Lấy thông tin người dùng theo ID
  export const getUserById = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, USERS_COLLECTION, userId));
      
      if (!userDoc.exists()) {
        return null;
      }
      
      return {
        id: userDoc.id,
        ...userDoc.data()
      };
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      throw error;
    }
  };
  
  // Cập nhật thông tin người dùng
  export const updateUserProfile = async (userId, userData) => {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      
      await updateDoc(userRef, {
        ...userData,
        updatedAt: serverTimestamp()
      });
      
      return true;
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin người dùng:", error);
      throw error;
    }
  };
  
  // Lấy danh sách bác sĩ
  export const getDoctorsList = async () => {
    try {
      const q = query(
        collection(db, USERS_COLLECTION),
        where('role', '==', 'doctor')
      );
      
      const querySnapshot = await getDocs(q);
      
      const doctors = [];
      querySnapshot.forEach((doc) => {
        doctors.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return doctors;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách bác sĩ:", error);
      throw error;
    }
  };
  
  // Tìm kiếm người dùng theo từ khóa (tên, email, số điện thoại)
  export const searchUsers = async (keyword, role = null) => {
    try {
      // Lấy tất cả người dùng (có thể giới hạn vai trò nếu cần)
      const q = role 
        ? query(collection(db, USERS_COLLECTION), where('role', '==', role))
        : collection(db, USERS_COLLECTION);
      
      const querySnapshot = await getDocs(q);
      
      const users = [];
      const keywordLower = keyword.toLowerCase();
      
      // Lọc kết quả trên client-side
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        if (data.name?.toLowerCase().includes(keywordLower) ||
            data.email?.toLowerCase().includes(keywordLower) ||
            data.phone?.includes(keyword)) {
          users.push({
            id: doc.id,
            ...data
          });
        }
      });
      
      return users;
    } catch (error) {
      console.error("Lỗi khi tìm kiếm người dùng:", error);
      throw error;
    }
  };
  
  // Đếm số lượng người dùng theo vai trò
  export const countUsersByRole = async (role) => {
    try {
      const q = query(
        collection(db, USERS_COLLECTION),
        where('role', '==', role)
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.size;
    } catch (error) {
      console.error(`Lỗi khi đếm số lượng người dùng với vai trò ${role}:`, error);
      throw error;
    }
  };