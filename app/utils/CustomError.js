// utils/CustomError.js

class CustomError extends Error {
    constructor(code, message) {
      super(message); // Call the parent Error class constructor
      this.code = code; // Add a custom error code property
    }
  }
  
  module.exports = CustomError; // Export the class for use in other files
  