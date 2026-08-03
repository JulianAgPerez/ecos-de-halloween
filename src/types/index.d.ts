export interface StoryTitleDTO{
    id: number;
    title: string;
}

export interface ClassicStoryTitleDTO {
    slug: string;
    title: string;
    author: string;
}

export interface StoryDTO {
    id?:number;
    title: string;
    description?: string;
    audioUrl?: string;
    backgroundImageUrl?: string;
    body: string | file;
}