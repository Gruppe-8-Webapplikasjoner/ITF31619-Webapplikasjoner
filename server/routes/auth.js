import express from 'express';
import { authController } from '../controllers/index.js';
import { isAuthenticated } from '../middleware/auth.js';
import { validateFields } from '../middleware/validate.js';
import { loginSchema, registerSchema } from '../schemas/user.js';

const router = express.Router();

/** GJENBRUKT FRA FORELESERS EKSEMPLER
 * post(registrering med validering), post(logge inn med validering),
 * post(logge ut), get(hente innlogger bruker)
 */
router.post(
  '/register',
  validateFields(registerSchema),
  authController.register
);
router.post('/login', validateFields(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.get('/me', isAuthenticated, authController.currentUser);

export default router;
