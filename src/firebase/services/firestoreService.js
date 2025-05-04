// Cập nhật file: firebase/services/firestoreService.js
import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp,
    onSnapshot
  } from 'firebase/firestore';
  import { db } from '../config';
  
  // Thêm tài liệu mới vào collection
  export const addDocument = async (collectionName, data) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding document:", error);
      throw error;
    }
  };
  
  // Lấy một tài liệu theo ID
  export const getDocument = async (collectionName, docId) => {
    try {
      console.log(`Getting document from ${collectionName} with ID: ${docId}`);
      
      if (!docId) {
        console.error("Invalid document ID");
        return null;
      }
      
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() };
        console.log("Document data:", data);
        return data;
      } else {
        console.log("No such document!");
        return null;
      }
    } catch (error) {
      console.error("Error getting document:", error);
      throw error;
    }
  };
  
  // Lấy tất cả tài liệu từ một collection
  export const getAllDocuments = async (collectionName) => {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const documents = [];
      
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      
      return documents;
    } catch (error) {
      throw error;
    }
  };
  
  // Cập nhật một tài liệu
  export const updateDocument = async (collectionName, docId, data) => {
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      throw error;
    }
  };
  
  // Xóa một tài liệu
  export const deleteDocument = async (collectionName, docId) => {
    try {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      throw error;
    }
  };
  
  // Truy vấn tài liệu với điều kiện
  export const queryDocuments = async (collectionName, conditions = [], orderByField = null, orderDirection = 'asc', limitCount = null) => {
    try {
      let q = collection(db, collectionName);
      
      // Thêm các điều kiện
      if (conditions.length > 0) {
        conditions.forEach(condition => {
          q = query(q, where(condition.field, condition.operator, condition.value));
        });
      }
      
      // Thêm sắp xếp
      if (orderByField) {
        q = query(q, orderBy(orderByField, orderDirection));
      }
      
      // Giới hạn số lượng kết quả trả về
      if (limitCount) {
        q = query(q, limit(limitCount));
      }
      
      const querySnapshot = await getDocs(q);
      const documents = [];
      
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      
      return documents;
    } catch (error) {
      throw error;
    }
  };
  
  // Lắng nghe sự thay đổi theo thời gian thực
  export const listenToDocuments = (collectionName, callback, conditions = []) => {
    try {
      let q = collection(db, collectionName);
      
      // Thêm các điều kiện
      if (conditions.length > 0) {
        conditions.forEach(condition => {
          q = query(q, where(condition.field, condition.operator, condition.value));
        });
      }
      
      return onSnapshot(q, (querySnapshot) => {
        const documents = [];
        querySnapshot.forEach((doc) => {
          documents.push({ id: doc.id, ...doc.data() });
        });
        callback(documents);
      });
    } catch (error) {
      throw error;
    }
  };