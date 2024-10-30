import express from 'express';
import CategoryController from '../controllers/categoryController';

const router = express.Router();
const categoryController = new CategoryController();

// Rotas básicas CRUD
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategory);
router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

export default router;