export interface LoginInputModel {
    email: string;
    password: string;
    strategy?: 'admin' | 'user'
}