import firebaseApp from "@/config/firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  getMetadata,
  listAll,
} from "firebase/storage";


//upload image to firebase storage
export const uploadImageToFirebase = async (file: any) => {
  try {
    const storageRef = getStorage(firebaseApp);
    const storagePath = ref(storageRef, `images/${file.name}`);
    const uploadedImageRef = await uploadBytes(storagePath, file);
    const downloadbleURL = await getDownloadURL(uploadedImageRef.ref);
    return downloadbleURL;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getImageDetailsFromFirebase = async () => {
  try {
    const storageRef = getStorage(firebaseApp);
    const imagesRef = ref(storageRef, "images"); // Reference to the images folder

    const imageObjects = [];
    const imageList = await listAll(imagesRef);

    for (const imageRef of imageList.items) {
      const downloadURL = await getDownloadURL(imageRef);
      const metadata = await getMetadata(imageRef);
      const fileName = imageRef.name; // Fetch file name

      const imageObject = {
        fileName: fileName, // Include file name
        downloadURL: downloadURL,
        metadata: {
          fullPath: metadata.fullPath,
          size: metadata.size,
          contentType: metadata.contentType,
          updated: metadata.updated,
          created: metadata.timeCreated
        },
      };

      imageObjects.push(imageObject);
    }
    return imageObjects
  } catch (error: any) {
    throw new Error(error.message);
  }
};
