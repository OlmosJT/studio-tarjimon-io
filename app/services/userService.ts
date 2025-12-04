export type TranslatorBadge = 'HOBBYIST' | 'PRO' | 'EXPERT';

export interface UserProfile {
    // From identity.users
    id: string;
    email: string;
    role: string;

    // From identity.translator_profiles
    profileId: string;
    displayName: string;
    bio: string;
    avatarUrl: string;
    badge: TranslatorBadge;
    totalProjects: number;
    totalFollowers: number;
}

// Mock Data (Simulating a joined query)
let MOCK_USER: UserProfile = {
    id: "user-uuid-1",
    email: "translator@studiotarjimon.com",
    role: "TRANSLATOR",
    profileId: "profile-uuid-1",
    displayName: "Olmos Davronov",
    bio: "Passionate about translating fantasy novels. I love bringing stories to life for Uzbek readers.",
    avatarUrl: "/avatar-default.png", // Ensure this exists in public/
    badge: "HOBBYIST",
    totalProjects: 12,
    totalFollowers: 340
};

export const userService = {
    // Fetch current user profile
    async getProfile(): Promise<UserProfile> {
        return new Promise((resolve) => setTimeout(() => resolve({ ...MOCK_USER }), 500));
    },

    // Update Profile Information (Bio, Name, Avatar)
    async updateProfile(payload: Partial<UserProfile>): Promise<UserProfile> {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Merge updates into mock data
                MOCK_USER = { ...MOCK_USER, ...payload };
                resolve({ ...MOCK_USER });
            }, 800);
        });
    },

    // Update Password (Mock)
    async updatePassword(current: string, newPass: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (current === "wrong") reject("Incorrect current password");
                else resolve(true);
            }, 800);
        });
    }
};