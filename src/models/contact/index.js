import dbClient from '../index.js';

// Function to save contact message
export const saveContactMessage = async (name, email, message) => {
    try {
        await dbClient.query(
            'INSERT INTO contact_messages (name, email, message) VALUES ($1, $2, $3)',
            [name, email, message]
        );
        console.log('✅ Contact message saved.');
    } catch (error) {
        console.error('❌ Error saving contact message:', error);
        throw error;
    }
};
