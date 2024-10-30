import { Request, Response, NextFunction } from 'express';
import storageService from '../services/storageService';

class TemplateController {
    getAllTemplates = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const templates = await storageService.getTemplates();
            res.json(templates);
        } catch (error) {
            next(error);
        }
    };

    getTemplate = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const template = await storageService.getTemplate(id);
            if (!template) {
                return res.status(404).json({ error: 'Template não encontrado' });
            }
            res.json(template);
        } catch (error) {
            next(error);
        }
    };

    createTemplate = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { categoryId, text } = req.body;
            if (!categoryId || !text) {
                return res.status(400).json({ error: 'Dados incompletos' });
            }
            const newTemplate = await storageService.createTemplate({ categoryId, text });
            res.status(201).json(newTemplate);
        } catch (error) {
            next(error);
        }
    };

    updateTemplate = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { categoryId, text } = req.body;
            const updatedTemplate = await storageService.updateTemplate(id, { categoryId, text });
            if (!updatedTemplate) {
                return res.status(404).json({ error: 'Template não encontrado' });
            }
            res.json(updatedTemplate);
        } catch (error) {
            next(error);
        }
    };

    deleteTemplate = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const deleted = await storageService.deleteTemplate(id);
            if (!deleted) {
                return res.status(404).json({ error: 'Template não encontrado' });
            }
            res.json({ message: 'Template deletado com sucesso' });
        } catch (error) {
            next(error);
        }
    };
}

export default new TemplateController();