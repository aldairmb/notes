import express from 'express';
import { saveContactMessage } from '../../models/contact/index.js';

const router = express.Router();

// Show the contact form
router.get('/', (req, res) => {
    res.render('contact/index', { title: 'Contact Us' });
});

router.get('/success', (req, res) => {
    res.render('contact/success', { title: 'Message Sent' });
});

// Handle form submission
router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).send('All fields are required.');
        }

        await saveContactMessage(name, email, message);
        res.redirect('/contact/success'); // Redirect to a success page
    } catch (error) {
        console.error('❌ Error saving contact message:', error);
        res.status(500).send('Internal Server Error');
    }
});

export default router;
