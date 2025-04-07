import express from 'express';
import dbClient from '../models/index.js';

const router = express.Router();

// Check if the user is logged in and redirect based on their role
router.get('/', (req, res) => {
    if (!req.session.userId) {
        // If the user is not logged in, redirect to the login page
        return res.redirect('/account/login');
    }

    const userId = req.session.userId;
    
    // Check the user's role and redirect based on that
    dbClient.query('SELECT * FROM users WHERE id = $1', [userId])
        .then((userResult) => {
            const user = userResult.rows[0];
            if (!user) {
                // If the user doesn't exist in the database
                return res.redirect('/account/login');
            }
            // Redirect to the appropriate page based on the user's role
            if (user.role === 'admin' || user.role === 'owner') {
                return res.redirect('/admin'); // Admins and owners go to the admin dashboard
            } else {
                return res.redirect('/notes'); // Regular users go to notes
            }
        })
        .catch((error) => {
            console.error('Error checking user role:', error);
            res.status(500).send('Internal server error.');
        });
});

export default router;

