import express from 'express';
import Auth from '../middleware/auth';
import Users from '../controllers/users';
import Order from '../controllers/orders';
import Menu from '../controllers/menu';


// defining middleware routes
const router = express.Router();

// Users routes
router.post('/api/auth/signup', Users.signup);
router.post('/api/auth/signin', Users.login);
router.get('/api/users', Users.getAllUsers);
router.delete('/api/users', [Auth.verifyToken], Users.delete);

// Order routes
router.post('/api/order', [Auth.verifyToken], Order.create);
router.get('/api/order', Order.getAll);
router.get('/api/order', Order.getOne);

// Menu routes
router.post('/api/menu', [Auth.verifyToken], Menu.create);
router.get('/api/menu', Menu.getAll);
router.get('/api/menu', Menu.getOne);
router.delete('/api/menu', Menu.delete);

export default router;