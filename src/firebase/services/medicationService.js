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
  const MEDICATION_CATALOG_COLLECTION = 'medication_catalog';
  
// Lấy tất cả đơn thuốc của một bệnh nhân
export const getPatientPrescriptions = async (patientId) => {
    try {
      console.log("Đang lấy đơn thuốc cho bệnh nhân ID:", patientId);
      
      const q = query(
        collection(db, PRESCRIPTIONS_COLLECTION),
        where('patientId', '==', patientId)
      );
      
      const querySnapshot = await getDocs(q);
      console.log("Số lượng đơn thuốc tìm thấy:", querySnapshot.size);
      
      const prescriptions = [];
      
      querySnapshot.forEach((docSnapshot) => {
        const prescriptionData = { id: docSnapshot.id, ...docSnapshot.data() };
        console.log("Đơn thuốc ID:", docSnapshot.id, "Data:", prescriptionData);
        prescriptions.push(prescriptionData);
      });
      
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
      
      // Trả về đơn thuốc với medications đã có sẵn trong document
      // Không cần truy vấn thêm medications từ collection khác
      return prescriptionData;
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết đơn thuốc:", error);
      throw error;
    }
  };
  
  // Tạo đơn thuốc mới
  export const createPrescription = async (prescriptionData, medications = []) => {
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
      if (Array.isArray(medications) && medications.length > 0) {
        const medicationPromises = medications.map(medication => 
          addDoc(collection(db, MEDICATIONS_COLLECTION), {
            ...medication,
            prescriptionId: prescriptionRef.id,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          })
        );
        
        await Promise.all(medicationPromises);
      }
      
      return prescriptionRef.id;
    } catch (error) {
      console.error("Lỗi khi tạo đơn thuốc:", error);
      throw error;
    }
  };
  
  // Cập nhật đơn thuốc
  export const updatePrescription = async (prescriptionId, prescriptionData, medications = []) => {
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
      if (Array.isArray(medications) && medications.length > 0) {
        const medicationPromises = medications.map(medication => 
          addDoc(collection(db, MEDICATIONS_COLLECTION), {
            ...medication,
            prescriptionId: prescriptionId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          })
        );
        
        await Promise.all(medicationPromises);
      }
      
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
        if (prescription.prescriptionId?.toLowerCase().includes(searchTermLower) ||
            prescription.doctorName?.toLowerCase().includes(searchTermLower) ||
            prescription.diagnosis?.toLowerCase().includes(searchTermLower) ||
            prescription.department?.toLowerCase().includes(searchTermLower)) {
          return true;
        }
        
        // Tìm trong danh sách thuốc
        const foundInMedications = prescription.medications.some(med => 
          med.name?.toLowerCase().includes(searchTermLower)
        );
        
        return foundInMedications;
      });
      
      return filteredPrescriptions;
    } catch (error) {
      console.error("Lỗi khi tìm kiếm đơn thuốc:", error);
      throw error;
    }
  };
  
  // Lấy danh sách thuốc từ catalog
  export const getMedicationsList = async () => {
    try {
      const q = query(
        collection(db, MEDICATION_CATALOG_COLLECTION),
        orderBy('name', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Lỗi khi lấy danh sách thuốc:", error);
      throw error;
    }
  };
  
  // Lấy chi tiết một loại thuốc từ catalog
  export const getMedicationDetail = async (medicationId) => {
    try {
      const docRef = doc(db, MEDICATION_CATALOG_COLLECTION, medicationId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }
      
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết thuốc:", error);
      throw error;
    }
  };
  
  // Tìm kiếm thuốc trong catalog
  export const searchMedicationCatalog = async (searchTerm) => {
    try {
      // Lấy tất cả danh sách thuốc
      const medicationsList = await getMedicationsList();
      
      // Lọc dựa trên từ khóa tìm kiếm
      return medicationsList.filter(medication => {
        const searchTermLower = searchTerm.toLowerCase();
        
        return (
          medication.name?.toLowerCase().includes(searchTermLower) ||
          medication.category?.toLowerCase().includes(searchTermLower) ||
          medication.manufacturer?.toLowerCase().includes(searchTermLower) ||
          medication.description?.toLowerCase().includes(searchTermLower)
        );
      });
    } catch (error) {
      console.error("Lỗi khi tìm kiếm thuốc:", error);
      throw error;
    }
  };
  
  // Cập nhật trạng thái đơn thuốc
  export const updatePrescriptionStatus = async (prescriptionId, newStatus) => {
    try {
      const prescriptionRef = doc(db, PRESCRIPTIONS_COLLECTION, prescriptionId);
      
      await updateDoc(prescriptionRef, {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
      
      return true;
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn thuốc:", error);
      throw error;
    }
  };
  
  // Lấy đơn thuốc mới nhất của bệnh nhân
  export const getLatestPrescription = async (patientId) => {
    try {
      const q = query(
        collection(db, PRESCRIPTIONS_COLLECTION),
        where('patientId', '==', patientId),
        orderBy('createdAt', 'desc'),
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }
      
      const prescriptionDoc = querySnapshot.docs[0];
      const prescriptionData = { id: prescriptionDoc.id, ...prescriptionDoc.data() };
      
      // Lấy danh sách thuốc
      const medicationsQuery = query(
        collection(db, MEDICATIONS_COLLECTION),
        where('prescriptionId', '==', prescriptionDoc.id)
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
      console.error("Lỗi khi lấy đơn thuốc mới nhất:", error);
      throw error;
    }
  };
  
  // Thêm thuốc mới vào catalog
  export const addMedicationToCatalog = async (medicationData) => {
    try {
      const docRef = await addDoc(collection(db, MEDICATION_CATALOG_COLLECTION), {
        ...medicationData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return docRef.id;
    } catch (error) {
      console.error("Lỗi khi thêm thuốc vào catalog:", error);
      throw error;
    }
  };
  
  // Cập nhật thông tin thuốc trong catalog
  export const updateMedicationInCatalog = async (medicationId, medicationData) => {
    try {
      const medicationRef = doc(db, MEDICATION_CATALOG_COLLECTION, medicationId);
      
      await updateDoc(medicationRef, {
        ...medicationData,
        updatedAt: serverTimestamp()
      });
      
      return true;
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin thuốc:", error);
      throw error;
    }
  };
  
  // Xóa thuốc khỏi catalog
  export const deleteMedicationFromCatalog = async (medicationId) => {
    try {
      await deleteDoc(doc(db, MEDICATION_CATALOG_COLLECTION, medicationId));
      return true;
    } catch (error) {
      console.error("Lỗi khi xóa thuốc khỏi catalog:", error);
      throw error;
    }
  };
  
  // Alias cho hàm createPrescription để tương thích với code hiện tại
  export const savePrescription = createPrescription;