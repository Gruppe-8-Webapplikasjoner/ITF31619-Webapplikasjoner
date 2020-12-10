import express from 'express';
import { currentUser } from '../controllers/auth.js';
import { articleController } from '../controllers/index.js';
import { isAuthenticated, isAuthorized } from '../middleware/auth.js';

const router = express.Router();

/** BASERT PÅ FORELESERS EKSEMPLER
 * get(hente artikkel basert på id), get(liste artikler),
 * post(lage bruker med autorisasjo og autentisering),
 * put(oppdatere artikkel), delete(slette artikkel)
 */
router.get('/:id', articleController.get);
router.get('/', articleController.listAllArticles);
router.get('/:id', articleController.get);
const roles = ['admin', 'superadmin'];
router.post(
  '/',
  isAuthenticated,
  isAuthorized(roles),
  articleController.create
);
router.put('/:id', articleController.update);
router.delete('/:id', articleController.remove);

/** SKAL VI BRUKE DENNE? */
router.get('/clicks', articleController.getClicksOnArticle);

export default router;
