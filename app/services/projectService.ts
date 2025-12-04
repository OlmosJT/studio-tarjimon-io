export type ProjectStatus = 'ONGOING' | 'COMPLETED' | 'HIATUS' | 'DROPPED';
export type ChapterStatus = 'DRAFT' | 'COMPLETED' | 'PUBLISHED';
export type ProjectType = 'NOVEL' | 'MANHWA';

export interface Project {
    id: string; // UUID
    translator_id: string;
    title: string;
    original_author_name?: string;
    original_language: string;
    target_language: string;
    description?: string;
    cover_image_url?: string; // Nullable in DB
    project_type: ProjectType;
    genre?: string;
    tags?: string[];
    status: ProjectStatus;
    total_chapters: number;
    created_at: string; // ISO Timestamp string
    updated_at: string; // ISO Timestamp string
}

export interface Chapter {
    id: string;
    project_id: string;
    sequence_number: number;
    title: string;
    subtitle?: string; // Optional (not in SQL but useful for UI)
    google_doc_url: string;
    status: ChapterStatus;
    published_at?: string;
    created_at: string;
}

const MOCK_CHAPTERS: Chapter[] = [
    {
        id: "c1",
        project_id: "f47ac10b-58cc-4372-a567-0e02b2c3d479", // Matches the mock project ID
        sequence_number: 1,
        title: "The Beginning of the End",
        subtitle: "Introduction",
        google_doc_url: "https://docs.google.com/document/d/mock-doc-1",
        status: "PUBLISHED",
        created_at: "2023-10-01T10:00:00Z"
    },
    {
        id: "c2",
        project_id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        sequence_number: 2,
        title: "The Second Step",
        google_doc_url: "https://docs.google.com/document/d/mock-doc-2",
        status: "COMPLETED", // Completed but not published
        created_at: "2023-10-05T10:00:00Z"
    },
    {
        id: "c3",
        project_id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        sequence_number: 3,
        title: "The Third Goddess",
        google_doc_url: "https://docs.google.com/document/d/mock-doc-2",
        status: "DRAFT",
        created_at: "2023-10-05T10:00:00Z"
    }
    // Notice: No Draft chapter here, so the user SHOULD be able to create Chapter 3
];

const MOCK_PROJECTS: Project[] = [
    {
        id: "f47ac10b-58cc-4372-a567-0e02b2c3d479", // UUID
        translator_id: "user-uuid-1",
        title: "The King's Avatar: Return of the Glory",
        original_language: "zh",
        target_language: "uz",
        project_type: "NOVEL",
        status: "ONGOING",
        total_chapters: 120,
        cover_image_url: "https://m.media-amazon.com/images/I/81+y+rWwJFL._AC_UF1000,1000_QL80_.jpg",
        created_at: "2023-10-01T10:00:00Z",
        updated_at: "2023-12-04T08:30:00Z" // Just now
    },
    {
        id: "550e8400-e29b-41d4-a716-446655440000",
        translator_id: "user-uuid-1",
        title: "Solo Leveling: Arise",
        original_language: "ko",
        target_language: "uz",
        project_type: "NOVEL",
        description: "This is Korean Manhwa which is best sold in the world.",
        status: "ONGOING",
        total_chapters: 270,
        cover_image_url: "https://m.media-amazon.com/images/I/81X4R7QhFkL._AC_UF1000,1000_QL80_.jpg",
        created_at: "2023-01-15T10:00:00Z",
        updated_at: "2023-11-20T14:00:00Z"
    },
    {
        id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
        translator_id: "user-uuid-1",
        title: "Omniscient Reader's Viewpoint",
        original_language: "ko",
        target_language: "uz",
        project_type: "NOVEL",
        status: "ONGOING",
        total_chapters: 55,
        cover_image_url: "https://m.media-amazon.com/images/I/81B-L1w5ZWL._AC_UF1000,1000_QL80_.jpg",
        created_at: "2023-08-05T10:00:00Z",
        updated_at: "2023-12-01T09:15:00Z"
    }
];

export const projectService = {
    async getProjects(): Promise<Project[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(MOCK_PROJECTS);
            }, 500);
        });
    },

    async getProjectById(id: string): Promise<Project | undefined> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const project = MOCK_PROJECTS.find(p => p.id === id);
                resolve(project);
            }, 400);
        });
    },

    async getChapters(projectId: string): Promise<Chapter[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Return sorted by sequence
                resolve(MOCK_CHAPTERS.sort((a, b) => a.sequence_number - b.sequence_number));
            }, 300);
        });
    },

    async createChapter(payload: { projectId: string, title: string, sequence: number }): Promise<Chapter> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newChapter: Chapter = {
                    id: `new-${Date.now()}`,
                    project_id: payload.projectId,
                    sequence_number: payload.sequence,
                    title: payload.title,
                    google_doc_url: `https://docs.google.com/document/d/new-generated-doc-${Date.now()}`,
                    status: 'DRAFT',
                    created_at: new Date().toISOString()
                };
                resolve(newChapter);
            }, 1000); // Simulate API + Google API delay
        });
    },

    async updateChapterStatus(chapterId: string, newStatus: ChapterStatus): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const chapter = MOCK_CHAPTERS.find(c => c.id === chapterId);
                if (chapter) {
                    chapter.status = newStatus;
                    if (newStatus === 'PUBLISHED') chapter.published_at = new Date().toISOString();
                }
                resolve();
            }, 800); // 800ms delay to see the loading spinner
        });
    }
};

