import { Request, Response, NextFunction } from 'express';
import storageService from '../services/storageService';

class CategoryController {
    public async getAllCategories(req: Request, res: Response, next: NextFunction) {
        try {
            const categories = await storageService.getCategories();
            res.json(categories);
        } catch (error) {
            next(error);
        }
    }

    public async getCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const category = await storageService.getCategory(id);
            
            if (!category) {
                return res.status(404).json({ error: 'Categoria não encontrada' });
            }
            
            res.json(category);
        } catch (error) {
            next(error);
        }
    }

    public async createCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, keywords, weight } = req.body;

            if (!name || !keywords || weight === undefined) {
                return res.status(400).json({
                    error: 'Dados incompletos',
                    received: { name, keywords, weight }
                });
            }

            const weightNum = Number(weight);
            if (isNaN(weightNum)) {
                return res.status(400).json({
                    error: 'Peso inválido',
                    received: weight
                });
            }

            const newCategory = await storageService.createCategory({
                name,
                keywords,
                weight: weightNum
            });

            res.status(201).json(newCategory);
        } catch (error) {
            next(error);
        }
    }

    public async updateCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            
            const updatedCategory = await storageService.updateCategory(id, updateData);

            if (!updatedCategory) {
                return res.status(404).json({ error: 'Categoria não encontrada' });
            }

            res.json(updatedCategory);
        } catch (error) {
            next(error);
        }
    }

    public async deleteCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const deleted = await storageService.deleteCategory(id);

            if (!deleted) {
                return res.status(404).json({ error: 'Categoria não encontrada' });
            }

            res.json({ message: 'Categoria deletada com sucesso' });
        } catch (error) {
            next(error);
        }
    }
}

export default CategoryController;