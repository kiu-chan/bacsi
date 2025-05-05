// firebase/services/patientService.js
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
    setDoc
  } from 'firebase/firestore';
  import { 
    createUserWithEmailAndPassword, 
    sendPasswordResetEmail,
    getAuth
  } from 'firebase/auth';
  import { db } from '../config';
  
  // Collection names
  const USERS_COLLECTION = 'users';
  const PATIENTS_COLLECTION = 'patients';
  const DOCTOR_PATIENTS_COLLECTION = 'doctor_patients';
  
  // Lấy danh sách bệnh nhân của bác sĩ
  export const getDoctorPatients = async (doctorId) => {
    try {
      // Lấy các ID bệnh nhân mà bác sĩ phụ trách
      const doctorPatientsQuery = query(
        collection(db, DOCTOR_PATIENTS_COLLECTION),
        where('doctorId', '==', doctorId)
      );
      
      const doctorPatientsSnapshot = await getDocs(doctorPatientsQuery);
      const patientIds = doctorPatientsSnapshot.docs.map(doc => doc.data().patientId);
      
      if (patientIds.length === 0) {
        return [];
      }
      
      // Lấy thông tin chi tiết của các bệnh nhân
      const patientsData = [];
      
      for (const patientId of patientIds) {
        // Lấy thông tin từ bảng users
        const userDoc = await getDoc(doc(db, USERS_COLLECTION, patientId));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          
          // Lấy thông tin chi tiết từ bảng patients
          const patientDoc = await getDoc(doc(db, PATIENTS_COLLECTION, patientId));
          
          if (patientDoc.exists()) {
            const patientData = patientDoc.data();
            
            patientsData.push({
              id: patientId,
              name: userData.name || '',
              email: userData.email || '',
              phone: userData.phone || '',
              age: patientData.age || '',
              gender: patientData.gender || '',
              lastVisit: patientData.lastVisit || '',
              status: patientData.status || 'Mới',
              diagnosis: patientData.diagnosis || '',
              // Các thông tin khác từ patients
              ...patientData
            });
          } else {
            // Nếu không có thông tin chi tiết, vẫn hiển thị thông tin cơ bản
            patientsData.push({
              id: patientId,
              name: userData.name || '',
              email: userData.email || '',
              phone: userData.phone || '',
              status: 'Mới'
            });
          }
        }
      }
      
      return patientsData;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách bệnh nhân:", error);
      throw error;
    }
  };
  
  // Lấy thông tin chi tiết của bệnh nhân
  export const getPatientDetail = async (patientId) => {
    try {
      // Lấy thông tin từ bảng users
      const userDoc = await getDoc(doc(db, USERS_COLLECTION, patientId));
      
      if (!userDoc.exists()) {
        return null;
      }
      
      const userData = userDoc.data();
      
      // Lấy thông tin chi tiết từ bảng patients
      const patientDoc = await getDoc(doc(db, PATIENTS_COLLECTION, patientId));
      
      if (patientDoc.exists()) {
        const patientData = patientDoc.data();
        
        return {
          id: patientId,
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          role: userData.role || 'patient',
          ...patientData
        };
      } else {
        // Nếu không có thông tin chi tiết, vẫn trả về thông tin cơ bản
        return {
          id: patientId,
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          role: userData.role || 'patient'
        };
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin bệnh nhân:", error);
      throw error;
    }
  };
  
  // Thêm bệnh nhân mới (tạo tài khoản và thông tin bệnh nhân)
  export const createNewPatient = async (patientData, doctorId) => {
    try {
      const auth = getAuth();
      
      // Tạo tài khoản người dùng
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        patientData.email, 
        patientData.password // Mật khẩu tạm thời
      );
      
      const userId = userCredential.user.uid;
      
      // Thêm thông tin vào bảng users
      await setDoc(doc(db, USERS_COLLECTION, userId), {
        name: patientData.name,
        email: patientData.email,
        phone: patientData.phone || '',
        role: 'patient',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // Thêm thông tin chi tiết vào bảng patients
      await setDoc(doc(db, PATIENTS_COLLECTION, userId), {
        patientId: `BN-${String(Date.now()).slice(-6)}`, // Tạo mã BN
        age: patientData.age || '',
        gender: patientData.gender || '',
        address: patientData.address || '',
        lastVisit: patientData.lastVisit || new Date().toLocaleDateString('vi-VN'),
        status: patientData.status || 'Mới',
        diagnosis: patientData.diagnosis || '',
        doctorId: doctorId,
        doctorName: patientData.doctorName || '',
        department: patientData.department || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // Liên kết bệnh nhân với bác sĩ
      await addDoc(collection(db, DOCTOR_PATIENTS_COLLECTION), {
        doctorId: doctorId,
        patientId: userId,
        assignedDate: serverTimestamp()
      });
      
      // Gửi email đặt lại mật khẩu
      if (patientData.sendResetEmail) {
        await sendPasswordResetEmail(auth, patientData.email);
      }
      
      return userId;
    } catch (error) {
      console.error("Lỗi khi tạo bệnh nhân mới:", error);
      throw error;
    }
  };
  
  // Liên kết bệnh nhân có sẵn với bác sĩ
  export const linkPatientToDoctor = async (patientId, doctorId, doctorName = '', department = '') => {
    try {
      // Kiểm tra xem bệnh nhân đã tồn tại chưa
      const userDoc = await getDoc(doc(db, USERS_COLLECTION, patientId));
      
      if (!userDoc.exists()) {
        throw new Error("Bệnh nhân không tồn tại");
      }
      
      // Kiểm tra xem liên kết đã tồn tại chưa
      const linkQuery = query(
        collection(db, DOCTOR_PATIENTS_COLLECTION),
        where('doctorId', '==', doctorId),
        where('patientId', '==', patientId)
      );
      
      const linkSnapshot = await getDocs(linkQuery);
      
      if (linkSnapshot.empty) {
        // Tạo liên kết mới
        await addDoc(collection(db, DOCTOR_PATIENTS_COLLECTION), {
          doctorId: doctorId,
          patientId: patientId,
          assignedDate: serverTimestamp()
        });
  
        // Cập nhật thông tin bác sĩ phụ trách trong hồ sơ bệnh nhân nếu cần
        const patientDoc = await getDoc(doc(db, PATIENTS_COLLECTION, patientId));
        
        if (patientDoc.exists()) {
          await updateDoc(doc(db, PATIENTS_COLLECTION, patientId), {
            doctorId: doctorId,
            doctorName: doctorName,
            department: department,
            updatedAt: serverTimestamp()
          });
        } else {
          // Tạo hồ sơ bệnh nhân nếu chưa có
          await setDoc(doc(db, PATIENTS_COLLECTION, patientId), {
            patientId: `BN-${String(Date.now()).slice(-6)}`, // Tạo mã BN
            doctorId: doctorId,
            doctorName: doctorName,
            department: department,
            status: 'Mới',
            lastVisit: new Date().toLocaleDateString('vi-VN'),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        }
      }
      
      return true;
    } catch (error) {
      console.error("Lỗi khi liên kết bệnh nhân:", error);
      throw error;
    }
  };
  
  // Cập nhật thông tin bệnh nhân
  export const updatePatientInfo = async (patientId, patientData) => {
    try {
      // Cập nhật thông tin cơ bản
      if (patientData.name || patientData.phone) {
        const userData = {};
        
        if (patientData.name) userData.name = patientData.name;
        if (patientData.phone) userData.phone = patientData.phone;
        userData.updatedAt = serverTimestamp();
        
        await updateDoc(doc(db, USERS_COLLECTION, patientId), userData);
      }
      
      // Cập nhật thông tin chi tiết
      const patientInfo = { ...patientData };
      
      // Loại bỏ các trường thông tin cơ bản (đã cập nhật ở users)
      delete patientInfo.name;
      delete patientInfo.email;
      delete patientInfo.phone;
      delete patientInfo.password;
      
      patientInfo.updatedAt = serverTimestamp();
      
      await updateDoc(doc(db, PATIENTS_COLLECTION, patientId), patientInfo);
      
      return true;
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin bệnh nhân:", error);
      throw error;
    }
  };
  
  // Xóa liên kết giữa bác sĩ và bệnh nhân
  export const unlinkPatientFromDoctor = async (patientId, doctorId) => {
    try {
      const linkQuery = query(
        collection(db, DOCTOR_PATIENTS_COLLECTION),
        where('doctorId', '==', doctorId),
        where('patientId', '==', patientId)
      );
      
      const linkSnapshot = await getDocs(linkQuery);
      
      if (!linkSnapshot.empty) {
        // Xóa tất cả các liên kết (thường chỉ có 1)
        const deletePromises = linkSnapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
      }
      
      return true;
    } catch (error) {
      console.error("Lỗi khi xóa liên kết bệnh nhân:", error);
      throw error;
    }
  };
  
  // Tìm kiếm bệnh nhân theo từ khóa
  export const searchPatients = async (doctorId, searchTerm) => {
    try {
      // Lấy tất cả bệnh nhân của bác sĩ
      const allPatients = await getDoctorPatients(doctorId);
      
      // Tìm kiếm trên client-side
      const searchTermLower = searchTerm.toLowerCase();
      
      const filteredPatients = allPatients.filter(patient => 
        patient.name?.toLowerCase().includes(searchTermLower) ||
        patient.diagnosis?.toLowerCase().includes(searchTermLower) ||
        patient.phone?.includes(searchTerm) ||
        patient.email?.toLowerCase().includes(searchTermLower)
      );
      
      return filteredPatients;
    } catch (error) {
      console.error("Lỗi khi tìm kiếm bệnh nhân:", error);
      throw error;
    }
  };
  
  // Lọc bệnh nhân theo trạng thái
  export const filterPatientsByStatus = async (doctorId, status) => {
    try {
      // Lấy tất cả bệnh nhân của bác sĩ 
      const allPatients = await getDoctorPatients(doctorId);
      
      // Lọc theo trạng thái
      const filteredPatients = allPatients.filter(patient => 
        patient.status === status
      );
      
      return filteredPatients;
    } catch (error) {
      console.error("Lỗi khi lọc bệnh nhân:", error);
      throw error;
    }
  };