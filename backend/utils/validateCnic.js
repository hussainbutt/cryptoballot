// Utility function to validate CNIC format (e.g., "1234567890123" or "12345678901234")
export const validateCNIC = (cnic) => {
    const cnicRegex = /^[0-9]{13,14}$/;

    return cnicRegex.test(cnic);
};
