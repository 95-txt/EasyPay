const generateUPI = (userName) => {
    // Generate a random string (e.g., 4 characters long)
    const cleanedUserName = userName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const uniqueId = Math.random().toString(36).substring(2, 6);
    // You might want to make this more robust for a production app,
    // potentially using a library like `uuid` or `nanoid`

    return `${cleanedUserName}${uniqueId}@fastpay`;
};

module.exports = generateUPI; // Export the function 