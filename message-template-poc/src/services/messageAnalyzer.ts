import storageService from './storageService';
import { Category, Template } from '../models/types';

export interface AnalysisResult {
   categories: {
       [key: string]: number;
   };
   dominantCategory: string; 
   suggestedTemplates: string[];
   confidence: number;
}

export class MessageAnalyzer {
   private normalizeText(text: string): string {
       return text.toLowerCase()
           .normalize('NFD')
           .replace(/[\u0300-\u036f]/g, '')
           .replace(/[^\w\s]/g, ' ');
   }

   private calculateCategoryScore(text: string, category: Category): number {
       let score = 0;
       const normalizedText = this.normalizeText(text);
       
       category.keywords.forEach(keyword => {
           if (normalizedText.includes(this.normalizeText(keyword))) {
               score += category.weight;
           }
       });
   
       return score;
   }

   public async analyzeMessage(message: string): Promise<AnalysisResult> {
       const categories = await storageService.getCategories();
       const templates = await storageService.getTemplates();
       const scores: { [key: string]: number } = {};
       let totalScore = 0;

       // Calculate scores
       for (const category of categories) {
           const score = this.calculateCategoryScore(message, category);
           scores[category.name] = score;
           totalScore += score;
       }

       // Find dominant category
       const sortedCategories = Object.entries(scores)
           .sort(([,a], [,b]) => b - a);
       
       const dominantCategory = sortedCategories.length > 0 && sortedCategories[0][1] > 0 
           ? sortedCategories[0][0]
           : categories[0]?.name || 'default';

       // Get suggested templates
       const categoryObj = categories.find(c => c.name === dominantCategory);
       const suggestedTemplates = templates
           .filter(t => t.categoryId === categoryObj?.id)
           .map(t => t.text);

       const confidence = totalScore > 0 ? scores[dominantCategory] / totalScore : 0;

       return {
           categories: scores,
           dominantCategory,
           suggestedTemplates: suggestedTemplates.length > 0 ? suggestedTemplates : [],
           confidence
       };
   }
}