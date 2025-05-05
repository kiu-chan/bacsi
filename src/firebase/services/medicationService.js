// firebase/services/medicationService.js
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
    serverTimestamp
  } from 'firebase/firestore';
  import { db } from '../config';
  
  // Collection name
  const PRESCRIPTIONS_COLLECTION = 'prescriptions';
  const MEDICATIONS_COLLECTION = 'medications';
  
  // Lấy tất cả đơn thuốc của một bệnh nhân
  export const getPatientPrescriptions = async (patientId) => {
    try {
      const q = query(
        collection(db, PRESCRIPTIONS_COLLECTION),
        where('patientId', '==', patientId),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const prescriptions = [];
      
      for (const docSnapshot of querySnapshot.docs) {
        const prescriptionData = { id: docSnapshot.id, ...docSnapshot.data() };
        
        // Lấy danh sách thuốc cho mỗi đơn
        const medicationsQuery = query(
          collection(db, MEDICATIONS_COLLECTION),
          where('prescriptionId', '==', docSnapshot.id)
        );
        
        const medicationsSnapshot = await getDocs(medicationsQuery);
        const medications = medicationsSnapshot.docs.map(medDoc => ({
          id: medDoc.id,
          ...medDoc.data()
        }));
        
        prescriptions.push({
          ...prescriptionData,
          medications
        });
      }
      
      return prescriptions;
    } catch (error) {
      console.error("Lỗi khi lấy đơn thuốc:", error);
      throw error;
    }
  };
  
  // Lấy chi tiết một đơn thuốc
  export const getPrescriptionDetail = async (prescriptionId) => {
    try {
      const docRef = doc(db, PRESCRIPTIONS_COLLECTION, prescriptionId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }
      
      const prescriptionData = { id: docSnap.id, ...docSnap.data() };
      
      // Lấy danh sách thuốc
      const medicationsQuery = query(
        collection(db, MEDICATIONS_COLLECTION),
        where('prescriptionId', '==', prescriptionId)
      );
      
      const medicationsSnapshot = await getDocs(medicationsQuery);
      const medications = medicationsSnapshot.docs.map(medDoc => ({
        id: medDoc.id,
        ...medDoc.data()
      }));
      
      return {
        ...prescriptionData,
        medications
      };
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết đơn thuốc:", error);
      throw error;
    }
  };
  
  // Tạo đơn thuốc mới
  export const createPrescription = async (prescriptionData, medications) => {
    try {
      // Thêm timestamp
      const prescriptionWithTimestamp = {
        ...prescriptionData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      // Tạo đơn thuốc mới
      const prescriptionRef = await addDoc(
        collection(db, PRESCRIPTIONS_COLLECTION),
        prescriptionWithTimestamp
      );
      
      // Thêm các thuốc vào collection medications
      const medicationPromises = medications.map(medication => 
        addDoc(collection(db, MEDICATIONS_COLLECTION), {
          ...medication,
          prescriptionId: prescriptionRef.id,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        })
      );
      
      await Promise.all(medicationPromises);
      
      return prescriptionRef.id;
    } catch (error) {
      console.error("Lỗi khi tạo đơn thuốc:", error);
      throw error;
    }
  };
  
  // Cập nhật đơn thuốc
  export const updatePrescription = async (prescriptionId, prescriptionData, medications) => {
    try {
      const prescriptionRef = doc(db, PRESCRIPTIONS_COLLECTION, prescriptionId);
      
      // Cập nhật thông tin đơn thuốc
      await updateDoc(prescriptionRef, {
        ...prescriptionData,
        updatedAt: serverTimestamp()
      });
      
      // Lấy danh sách thuốc hiện tại
      const medicationsQuery = query(
        collection(db, MEDICATIONS_COLLECTION),
        where('prescriptionId', '==', prescriptionId)
      );
      
      const medicationsSnapshot = await getDocs(medicationsQuery);
      
      // Xóa tất cả thuốc hiện tại
      const deletePromises = medicationsSnapshot.docs.map(medDoc => 
        deleteDoc(doc(db, MEDICATIONS_COLLECTION, medDoc.id))
      );
      
      await Promise.all(deletePromises);
      
      // Thêm lại danh sách thuốc mới
      const medicationPromises = medications.map(medication => 
        addDoc(collection(db, MEDICATIONS_COLLECTION), {
          ...medication,
          prescriptionId: prescriptionId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        })
      );
      
      await Promise.all(medicationPromises);
      
      return true;
    } catch (error) {
      console.error("Lỗi khi cập nhật đơn thuốc:", error);
      throw error;
    }
  };
  
  // Xóa đơn thuốc
  export const deletePrescription = async (prescriptionId) => {
    try {
      // Xóa tất cả thuốc liên quan
      const medicationsQuery = query(
        collection(db, MEDICATIONS_COLLECTION),
        where('prescriptionId', '==', prescriptionId)
      );
      
      const medicationsSnapshot = await getDocs(medicationsQuery);
      
      const deletePromises = medicationsSnapshot.docs.map(medDoc => 
        deleteDoc(doc(db, MEDICATIONS_COLLECTION, medDoc.id))
      );
      
      await Promise.all(deletePromises);
      
      // Xóa đơn thuốc
      await deleteDoc(doc(db, PRESCRIPTIONS_COLLECTION, prescriptionId));
      
      return true;
    } catch (error) {
      console.error("Lỗi khi xóa đơn thuốc:", error);
      throw error;
    }
  };
  
  // Lọc đơn thuốc theo trạng thái
  export const filterPrescriptionsByStatus = async (patientId, status) => {
    try {
      const q = query(
        collection(db, PRESCRIPTIONS_COLLECTION),
        where('patientId', '==', patientId),
        where('status', '==', status),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const prescriptions = [];
      
      for (const docSnapshot of querySnapshot.docs) {
        const prescriptionData = { id: docSnapshot.id, ...docSnapshot.data() };
        
        // Lấy danh sách thuốc cho mỗi đơn
        const medicationsQuery = query(
          collection(db, MEDICATIONS_COLLECTION),
          where('prescriptionId', '==', docSnapshot.id)
        );
        
        const medicationsSnapshot = await getDocs(medicationsQuery);
        const medications = medicationsSnapshot.docs.map(medDoc => ({
          id: medDoc.id,
          ...medDoc.data()
        }));
        
        prescriptions.push({
          ...prescriptionData,
          medications
        });
      }
      
      return prescriptions;
    } catch (error) {
      console.error("Lỗi khi lọc đơn thuốc:", error);
      throw error;
    }
  };
  
  // Tìm kiếm đơn thuốc
  export const searchPrescriptions = async (patientId, searchTerm) => {
    try {
      // Lấy tất cả đơn thuốc của bệnh nhân
      const allPrescriptions = await getPatientPrescriptions(patientId);
      
      // Lọc trên client-side vì Firestore không hỗ trợ tìm kiếm text đầy đủ
      const filteredPrescriptions = allPrescriptions.filter(prescription => {
        const searchTermLower = searchTerm.toLowerCase();
        
        // Tìm trong thông tin đơn thuốc
        if (prescription.prescriptionId.toLowerCase().includes(searchTermLower) ||
            prescription.doctorName.toLowerCase().includes(searchTermLower) ||
            prescription.diagnosis.toLowerCase().includes(searchTermLower) ||
            prescription.department.toLowerCase().includes(searchTermLower)) {
          return true;
        }
        
        // Tìm trong danh sách thuốc
        const foundInMedications = prescription.medications.some(med => 
          med.name.toLowerCase().includes(searchTermLower)
        );
        
        return foundInMedications;
      });
      
      return filteredPrescriptions;
    } catch (error) {
      console.error("Lỗi khi tìm kiếm đơn thuốc:", error);
      throw error;
    }
  };