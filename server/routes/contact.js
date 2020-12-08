import express from 'express';
import { mailController } from '../controllers/index.js';
import { isAuthenticated, isAuthorized } from '../middleware/auth.js';

const router = express.Router();

router.post('/', mailController.sendUserMail);
router.post('/adminmail', mailController.sendAdminMail);
router.get('/', mailController.list);

export default router;