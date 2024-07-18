/**
 * The type definition for a user object.
 */
export type User = {
	id: string;
	role: string[] | string | null;
	firstName: string;
	lastName: string;
	username: string;
	bankAccounts: [];
	cryptoAccounts: [];
	email: string;
	createdAt: number;
	updatedAt: number;
	profileImg?: string;
	nationalCardImg?: string;
	recognizanceImg?: string;
	loginRedirectUrl?: string; // The URL to redirect to after login.
};
