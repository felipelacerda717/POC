import express from 'express';
import templateController from '../controllers/templateController';

const router = express.Router();

router.get('/', templateController.getAllTemplates);
router.get('/:id', templateController.getTemplate);
router.post('/', templateController.createTemplate);
router.put('/:id', templateController.updateTemplate);
router.delete('/:id', templateController.deleteTemplate);

export default router;