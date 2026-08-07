export interface StoryTitleDTO{
    id: number;
    title: string;
}

export interface ClassicStoryTitleDTO {
    slug: string;
    title: string;
    author: string;
}

export type ClassicLicense = "dominio-publico" | "cc-by-sa-4.0";

export interface ClassicStoryDTO {
    slug: string;
    title: string;
    author: string;
    translator?: string;
    year?: number;
    license: ClassicLicense;
    licenseUrl?: string;
    sourceUrl?: string;
    body?: string;
}

export interface StoryDTO {
    id?:number;
    title: string;
    description?: string;
    audioUrl?: string;
    backgroundImageUrl?: string;
    body: string;
}