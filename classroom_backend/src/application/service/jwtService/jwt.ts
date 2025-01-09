import { JwtPayload } from "jsonwebtoken";
import { I_JWT, JwtPayloadOutput, UserJwtPayload } from "../../../interface/service_interface/I_jwt";
import jwt from "jsonwebtoken";
import fs from 'fs';
import path from 'path';
import { ClassroomJwtPayload } from "../../../interface/I_classroom.auth.interactor";

export type JWToutput = {
    payload: UserJwtPayload | ClassroomJwtPayload | null,
    message: string
};

export class JWT implements I_JWT {
    private privateKey: string;
    private publicKey: string;

    constructor() {
        try {
            // Load keys from files
            const privateKeyPem = fs.readFileSync(path.resolve("src/application/service/jwtService/private.pem"), 'utf8');
            const publicKeyPem = fs.readFileSync(path.resolve("src/application/service/jwtService/public.pem"), 'utf8');
            
            this.privateKey = privateKeyPem;
            this.publicKey = publicKeyPem;
        } catch (error) {
            console.error("Error loading keys:", error);
            throw new Error("Failed to initialize JWT service due to missing or invalid key files.");
        }
    }

    generateToken(payload: object, expiresIn?: string | number): string {
        try {
            const options: jwt.SignOptions = { algorithm: 'RS256' };
            if (expiresIn) options.expiresIn = expiresIn;
            return jwt.sign(payload, this.privateKey, options);
        } catch (error: any) {
            console.error("Error generating token:", error);
            throw new Error("Token generation failed. Please try again.");
        }
    }

    verifyToken(token: string): JWToutput {
        try {
            const decoded = jwt.verify(token, this.publicKey) as JwtPayloadOutput;
            return {
                payload: decoded,
                message: "Authenticated"
            };
        } catch (error: any) {
            console.error("Error verifying token:", error);

            // Differentiate error messages based on JWT-specific errors
            let errorMessage = "Invalid token.";
            if (error.name === "TokenExpiredError") {
                errorMessage = "Token has expired.";
            } else if (error.name === "JsonWebTokenError") {
                errorMessage = "Malformed token.";
            }

            return {
                payload: null,
                message: errorMessage
            };
        }
    }

    verifyRefreshToken(token: string): JwtPayload | null {
        try {
            // Add refresh token verification logic if needed
            const decoded = jwt.verify(token, this.publicKey) as JwtPayload;
            return decoded;
        } catch (error: any) {
            console.error("Error verifying refresh token:", error);
            return null;
        }
    }
}
