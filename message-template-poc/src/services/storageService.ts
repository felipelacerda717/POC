import { Category, Template } from '../models/types';
import fs from 'fs';
import path from 'path';

class StorageService {
    private static instance: StorageService;
    private categories: Category[] = [];
    private templates: Template[] = [];
    private readonly dataDir = path.join(__dirname, '../../data');
    private readonly categoriesFile = path.join(this.dataDir, 'categories.json');
    private readonly templatesFile = path.join(this.dataDir, 'templates.json');

    private constructor() {
        this.initializeStorage();
    }

    private initializeStorage() {
        if (!fs.existsSync(this.dataDir)) {
            fs.mkdirSync(this.dataDir, { recursive: true });
        }

        try {
            if (fs.existsSync(this.categoriesFile)) {
                const data = fs.readFileSync(this.categoriesFile, 'utf8');
                this.categories = JSON.parse(data);
            }
            if (fs.existsSync(this.templatesFile)) {
                const data = fs.readFileSync(this.templatesFile, 'utf8');
                this.templates = JSON.parse(data);
            }
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    public static getInstance(): StorageService {
        if (!StorageService.instance) {
            StorageService.instance = new StorageService();
        }
        return StorageService.instance;
    }

    // Rest of the methods remain the same, just update save methods:

    private saveCategories(): void {
        fs.writeFileSync(this.categoriesFile, JSON.stringify(this.categories, null, 2));
    }

    private saveTemplates(): void {
        fs.writeFileSync(this.templatesFile, JSON.stringify(this.templates, null, 2));
    }

    // Keep all other methods exactly as they were
    async getCategories(): Promise<Category[]> {
        return this.categories;
    }

    async getCategory(id: string): Promise<Category | null> {
        const category = this.categories.find(c => c.id === id);
        return category || null;
    }

    async createCategory(categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
        const newCategory: Category = {
            ...categoryData,
            id: crypto.randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        this.categories.push(newCategory);
        this.saveCategories();
        return newCategory;
    }

    async updateCategory(id: string, categoryData: Partial<Category>): Promise<Category | null> {
        const index = this.categories.findIndex(c => c.id === id);
        if (index === -1) return null;

        const updatedCategory = {
            ...this.categories[index],
            ...categoryData,
            updatedAt: new Date()
        };

        this.categories[index] = updatedCategory;
        this.saveCategories();
        return updatedCategory;
    }

    async deleteCategory(id: string): Promise<boolean> {
        const initialLength = this.categories.length;
        this.categories = this.categories.filter(c => c.id !== id);
        
        if (this.categories.length < initialLength) {
            this.saveCategories();
            return true;
        }
        return false;
    }

    async getTemplates(): Promise<Template[]> {
        return this.templates;
    }

    async getTemplate(id: string): Promise<Template | null> {
        const template = this.templates.find(t => t.id === id);
        return template || null;
    }

    async createTemplate(templateData: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>): Promise<Template> {
        const newTemplate: Template = {
            ...templateData,
            id: crypto.randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        this.templates.push(newTemplate);
        this.saveTemplates();
        return newTemplate;
    }

    async updateTemplate(id: string, templateData: Partial<Template>): Promise<Template | null> {
        const index = this.templates.findIndex(t => t.id === id);
        if (index === -1) return null;

        const updatedTemplate = {
            ...this.templates[index],
            ...templateData,
            updatedAt: new Date()
        };

        this.templates[index] = updatedTemplate;
        this.saveTemplates();
        return updatedTemplate;
    }

    async deleteTemplate(id: string): Promise<boolean> {
        const initialLength = this.templates.length;
        this.templates = this.templates.filter(t => t.id !== id);
        
        if (this.templates.length < initialLength) {
            this.saveTemplates();
            return true;
        }
        return false;
    }
}

export default StorageService.getInstance();