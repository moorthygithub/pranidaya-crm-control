// import CryptoJS from "crypto-js";

// // const secretKey = "a$9P&hA2vX@7ZkY1lR8o$y5Q!LmJwF#2$9jHqT&3uS";
// const secretKey = import.meta.env.VITE_SECRET_KEY;

// export const encryptId = (id) => {
//   if (!id) {
//     console.error("ID is missing");
//     return "";
//   }
//   return CryptoJS.AES.encrypt(id.toString(), secretKey).toString();
// };

// export const decryptId = (encryptedId) => {
//   try {
//     const bytes = CryptoJS.AES.decrypt(encryptedId, secretKey);
//     return bytes.toString(CryptoJS.enc.Utf8);
//   } catch (error) {
//     console.error("Decryption Error:", error);
//   }
// };

import CryptoJS from "crypto-js";

// Accessing the secret key from environment variables
const secretKey = import.meta.env.VITE_SECRET_KEY;

if (!secretKey) {
  console.error("Secret key is not defined in .env");
  // Handle gracefully if the secret key is missing.
  // We cannot use return here as it's outside the function scope.
}

// Function to encrypt an ID
export const encryptId = (id) => {
  if (!id) {
    console.error("ID is missing");
    return ""; // Return an empty string if ID is missing
  }
  return CryptoJS.AES.encrypt(id.toString(), secretKey).toString(); // Encrypt the ID and return it
};

// Function to decrypt an encrypted ID
export const decryptId = (encryptedId) => {
  try {
    if (!encryptedId) {
      console.error("Encrypted ID is missing");
      return ""; // Return an empty string if encrypted ID is missing
    }
    const bytes = CryptoJS.AES.decrypt(encryptedId, secretKey); // Decrypt the ID
    return bytes.toString(CryptoJS.enc.Utf8); // Return the decrypted ID
  } catch (error) {
    console.error("Decryption Error:", error);
    return ""; // Return an empty string if decryption fails
  }
};
