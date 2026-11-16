
export interface AuthContextType{
    isAuthenticated: boolean;
    loading: boolean;
    login: (username: string, userId: number) => void;
    logout: () => void;
    username: string;
    userId: number | null;
    register: (username: string, email: string, password: string) => Promise<{success: boolean,
        message: string}>;
}