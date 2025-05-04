import {
    ref,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject,
    listAll
  } from 'firebase/storage';
  import { storage } from '../config';
  
  // Tải lên tệp vào Firebase Storage
  export const uploadFile = (file, path, onProgress, onError, onSuccess) => {
    try {
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file);
  
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(progress);
        },
        (error) => {
          if (onError) onError(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          if (onSuccess) onSuccess(downloadURL);
        }
      );
  
      return uploadTask;
    } catch (error) {
      throw error;
    }
  };
  
  // Tải lên tệp và trả về URL tải xuống
  export const uploadFileAndGetURL = async (file, path) => {
    try {
      const storageRef = ref(storage, path);
      const uploadTask = await uploadBytesResumable(storageRef, file);
      const downloadURL = await getDownloadURL(uploadTask.ref);
      return downloadURL;
    } catch (error) {
      throw error;
    }
  };
  
  // Lấy URL tải xuống từ đường dẫn tệp
  export const getFileURL = async (path) => {
    try {
      const storageRef = ref(storage, path);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      throw error;
    }
  };
  
  // Xóa tệp từ Firebase Storage
  export const deleteFile = async (path) => {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
      return true;
    } catch (error) {
      throw error;
    }
  };
  
  // Liệt kê tất cả các tệp trong một thư mục
  export const listFiles = async (folderPath) => {
    try {
      const folderRef = ref(storage, folderPath);
      const fileList = await listAll(folderRef);
      const fileURLs = await Promise.all(
        fileList.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          return {
            name: itemRef.name,
            fullPath: itemRef.fullPath,
            url
          };
        })
      );
      return fileURLs;
    } catch (error) {
      throw error;
    }
  };