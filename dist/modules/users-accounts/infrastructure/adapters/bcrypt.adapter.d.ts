export declare class BcryptService {
    generateHash(password: string): Promise<string>;
    verifyPassword(password: string, passwordHash: string): Promise<boolean>;
}
