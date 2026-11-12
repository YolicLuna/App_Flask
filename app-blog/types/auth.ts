
export interface AuthContextType{
    isAuthenticated: boolean;
    loading: boolean;
    login: (username: string) => void;
    logout: () => void;
    username: string;
    register: (username: string, email: string, password: string) => Promise<{success: boolean,
        message: string}>;
}