export interface LoginRequest{
    username:string;
    password:string;
}

export interface Token{
    token?: string;
    refreshToken?: string;
    mfaRequerido?: boolean;
    mfaSetupRequerido?: boolean;
    mfaToken?: string;
    mfaSecretoManual?: string;
    mfaOtpAuthUri?: string;
}

export interface VerificarMfaRequest {
    mfaToken?: string;
    codigo?: string;
}
