declare namespace Express {
    // passando a type user para a request
    export interface Request {
        user?: {
            id: string
            role: string
        }
    }
}