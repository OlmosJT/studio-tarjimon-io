export type UserRole = 'TRANSLATOR' | 'READER';

export interface Follower {
    id: string;
    name: string;
    avatar: string;
    role: UserRole;
    isFollowing: boolean; // State: Are we following them back?
    stats: {
        projects_count?: number; // Only for Translators
        reading_list_count?: number; // Only for Readers
    };
}

// Mock Data
const MOCK_FOLLOWERS: Follower[] = [
    // --- Translators ---
    {
        id: "t1",
        name: "Jasmina Karimova",
        avatar: "https://i.pravatar.cc/150?u=jasmina",
        role: "TRANSLATOR",
        isFollowing: true,
        stats: { projects_count: 12 }
    },
    {
        id: "t2",
        name: "Rustam Aliyev",
        avatar: "https://i.pravatar.cc/150?u=rustam",
        role: "TRANSLATOR",
        isFollowing: false,
        stats: { projects_count: 5 }
    },
    // --- Readers ---
    {
        id: "r1",
        name: "FanBoy99",
        avatar: "https://i.pravatar.cc/150?u=fanboy",
        role: "READER",
        isFollowing: false,
        stats: { reading_list_count: 45 }
    },
    {
        id: "r2",
        name: "BookWorm_UZ",
        avatar: "https://i.pravatar.cc/150?u=bookworm",
        role: "READER",
        isFollowing: true,
        stats: { reading_list_count: 120 }
    },
    {
        id: "r3",
        name: "Newbie_Reader",
        avatar: "/avatar-default.png",
        role: "READER",
        isFollowing: false,
        stats: { reading_list_count: 2 }
    }
];

export const followerService = {
    async getFollowers(): Promise<Follower[]> {
        return new Promise((resolve) => setTimeout(() => resolve(MOCK_FOLLOWERS), 500));
    },

    async toggleFollow(id: string): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Find and toggle (Mock logic)
                const user = MOCK_FOLLOWERS.find(u => u.id === id);
                if (user) user.isFollowing = !user.isFollowing;
                resolve(true);
            }, 300);
        });
    }
};