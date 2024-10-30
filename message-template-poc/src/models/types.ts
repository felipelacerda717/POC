export interface Category {
    id: string;
    name: string;
    keywords: string[];
    weight: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Template {
    id: string;
    categoryId: string;
    text: string;
    createdAt: Date;
    updatedAt: Date;
}