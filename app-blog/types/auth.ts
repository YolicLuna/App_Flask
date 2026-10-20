
export interface AuthContextType{
    isAuthenticated: boolean;
    loading: boolean;
    login: () => void;
    logout: () => void;
}