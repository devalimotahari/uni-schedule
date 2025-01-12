/**
 * The type definition for a user object.
 */
export type User = {
	id: string;
	role: string[] | string | null;
	username: string;
	loginRedirectUrl?: string; // The URL to redirect to after login.
};
