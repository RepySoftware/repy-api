export interface LoginInputModel {
    username: string;
    password: string;
    strategy?: 'admin' | 'user'
}