// Auth
export interface IAuthSendCode {
	email: string;
	password: string;
}
export interface IAuthLogin {
	email: string;
	totp: string;
}
export interface IAuthForgotPassword {
	email?: string;
	newPassword?: string;
	hash?: string;
}
export interface IAuthRegister {
	firstName: string;
	lastName: string;
	email: string;
	username: string;
	password: string;
}
