export interface StoryTitleDTO{
    id: number;
    title: string;
}

export interface StoryDTO {
    id?:number;
    title: string;
    description?: string;
    audioUrl?: string;
    backgroundImageUrl?: string;
    body: string | file;
}