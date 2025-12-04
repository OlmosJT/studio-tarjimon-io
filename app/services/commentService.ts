
export interface Comment {
    // DB Fields
    id: string;
    chapter_id: string;
    user_id: string;
    parent_comment_id: string | null;
    content: string;
    is_spoiler: boolean;
    created_at: string;
    updated_at: string;

    // Expanded Data (The API adds these via Joins)
    author: {
        username: string;
        avatar_url: string;
    };
    context: {
        project_id: string;
        project_title: string;
        chapter_title: string;
    };

    // UI Helper: Nested replies
    replies?: Comment[];
}

const MOCK_COMMENTS: Comment[] = [
    {
        id: "uuid-c1",
        chapter_id: "chapter-uuid-1", // From content.chapters
        user_id: "user-uuid-101",     // From identity.users
        parent_comment_id: null,
        content: "Wait, did Ye Xiu actually mean to do that? The strategy seems too risky!",
        is_spoiler: false,
        created_at: "2023-12-04T10:00:00Z",
        updated_at: "2023-12-04T10:00:00Z",
        author: {
            username: "FanBoy99",
            avatar_url: "https://i.pravatar.cc/150?u=fanboy"
        },
        context: {
            project_id: "p1",
            project_title: "The King's Avatar",
            chapter_title: "Chapter 12"
        },
        replies: []
    },
    {
        id: "uuid-c2",
        chapter_id: "chapter-uuid-50",
        user_id: "user-uuid-102",
        parent_comment_id: null,
        content: "The translation quality here is amazing. Thanks for the hard work!",
        is_spoiler: false,
        created_at: "2023-12-03T14:30:00Z",
        updated_at: "2023-12-03T14:30:00Z",
        author: {
            username: "SungJinWooFan",
            avatar_url: "https://i.pravatar.cc/150?u=jinwoo"
        },
        context: {
            project_id: "p2",
            project_title: "Solo Leveling: Arise",
            chapter_title: "Chapter 50"
        },
        replies: [
            {
                id: "uuid-reply-1",
                chapter_id: "chapter-uuid-50",
                user_id: "translator-uuid",
                parent_comment_id: "uuid-c2", // Links to parent
                content: "Thank you! I tried really hard to capture the original tone.",
                is_spoiler: false,
                created_at: "2023-12-03T15:00:00Z",
                updated_at: "2023-12-03T15:00:00Z",
                author: {
                    username: "Olmos Davronov",
                    avatar_url: "/avatar-default.png"
                },
                context: {
                    project_id: "p2",
                    project_title: "Solo Leveling: Arise",
                    chapter_title: "Chapter 50"
                },
                replies: []
            }
        ]
    }
];

export const commentService = {
    // Simulate fetching comments with joins
    async getComments(): Promise<Comment[]> {
        return new Promise((resolve) => setTimeout(() => resolve(MOCK_COMMENTS), 500));
    },

    // Simulate replying (Uses parent_comment_id)
    async replyToComment(parentComment: Comment, content: string): Promise<Comment> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newReply: Comment = {
                    id: `uuid-new-${Date.now()}`,
                    chapter_id: parentComment.chapter_id,
                    user_id: "current-user-uuid",
                    parent_comment_id: parentComment.id, // Set the Foreign Key
                    content: content,
                    is_spoiler: false,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    author: {
                        username: "Olmos Davronov",
                        avatar_url: "/avatar-default.png"
                    },
                    context: parentComment.context, // Inherit context
                    replies: []
                };

                // Mock pushing to the parent's replies array
                parentComment.replies?.push(newReply);

                resolve(newReply);
            }, 800);
        });
    }
};