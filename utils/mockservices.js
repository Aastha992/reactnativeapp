// mockServices.js

/**
 * Simulates an API call for the "Forgot Password" feature.
 * @param {string} email - The email address entered by the user.
 * @returns {Promise} - Resolves on success, rejects on failure.
 */
export const mockForgotPasswordApi = async (email) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === "test@example.com") {
          resolve({ success: true, message: "Reset link sent successfully" });
        } else {
          reject({ success: false, message: "Email not found" });
        }
      }, 1000); // Simulate network delay
    });
  };
  