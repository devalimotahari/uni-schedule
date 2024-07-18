import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import history from '@history';
import { useMutation } from '@tanstack/react-query';
import { i18nNamespaces, LocalStorageKeys } from 'app/constants';
import { apiClient } from 'app/services/apiClient';
import { GetUserProfile, PostAuthLogin, PostAuthRegister, PostAuthSendCode } from 'app/services/apiShortRequests';
import { IAuthLogin, IAuthRegister, IAuthSendCode } from 'app/services/requestTypes';
import { IAuthLoginResponse } from 'app/services/responseTypes';
import { useAppDispatch } from 'app/store/hooks';
import { AxiosResponse, isAxiosError } from 'axios';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PartialDeep } from 'type-fest';
import { User } from '../../user';

export type JwtAuthStatus = 'configuring' | 'authenticated' | 'unauthenticated';

export type JwtAuthContextType = {
	user?: User;
	userEmail: string;
	updateUser: (U: User) => void;
	signIn?: (credentials: IAuthLogin) => Promise<AxiosResponse<IAuthLoginResponse>>;
	sendCode?: (credentials: IAuthSendCode) => Promise<AxiosResponse>;
	signUp?: (U: IAuthRegister) => Promise<AxiosResponse>;
	signOut?: () => void;
	refreshToken?: () => void;
	isAuthenticated: boolean;
	isLoading: boolean;
	authStatus: JwtAuthStatus;
};

const defaultAuthContext: JwtAuthContextType = {
	isAuthenticated: false,
	isLoading: false,
	user: null,
	userEmail: '',
	updateUser: null,
	sendCode: null,
	signIn: null,
	signUp: null,
	signOut: null,
	refreshToken: null,
	authStatus: 'configuring'
};

export const JwtAuthContext = createContext<JwtAuthContextType>(defaultAuthContext);

export type JwtAuthProviderProps = {
	children: React.ReactNode;
};

function JwtAuthProvider(props: JwtAuthProviderProps) {
	const [user, setUser] = useState<User>(null);
	const [userEmail, setUserEmail] = useState<string>('');
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [authStatus, setAuthStatus] = useState('configuring');

	const { children } = props;

	const dispatch = useAppDispatch();

	const { t } = useTranslation();

	const searchParams = new URLSearchParams(history.location.search);
	const autoLoginToken = searchParams.get(LocalStorageKeys.autoLoginToken);

	const { mutateAsync: sendCodeMutate, isPending: sendCodePending } = useMutation({
		mutationFn: PostAuthSendCode,
		onError: (err) => {
			if (isAxiosError(err)) {
				if (err.response.status === 401) {
					dispatch(
						showMessage({ message: t(`${i18nNamespaces.pages.signIn}:userBlocked`), variant: 'error' })
					);
					return;
				}
			}

			dispatch(showMessage({ message: t(`${i18nNamespaces.pages.signIn}:userNotExist`), variant: 'error' }));
		}
	});

	const { mutateAsync: loginMutate, isPending: loginPending } = useMutation({
		mutationFn: PostAuthLogin,
		onSuccess: (res) => {
			handleSignInSuccess(res.data.user, res.data.access_token);
		}
	});

	const { mutateAsync: registerMutate, isPending: registerPending } = useMutation({
		mutationFn: PostAuthRegister,
		onSuccess: () => {
			dispatch(
				showMessage({ message: t(`${i18nNamespaces.pages.signUp}:signUpSuccessfully`), variant: 'success' })
			);
			history.push('/sign-in');
		},
		onError: (err) => {
			if (isAxiosError(err)) {
				if (err.response.status === 400) {
					dispatch(showMessage({ message: t(`${i18nNamespaces.pages.signUp}:userExist`), variant: 'error' }));
				}
			}
		}
	});

	const { mutateAsync: profileMutate, isPending: profilePending } = useMutation({
		mutationFn: GetUserProfile
	});

	const isLoading: boolean = sendCodePending || loginPending || registerPending || profilePending;

	/**
	 * Handle sign-in success
	 */
	const handleSignInSuccess = useCallback((userData: User, accessToken: string) => {
		setSession(accessToken);

		setIsAuthenticated(true);

		setUser({ ...userData, role: 'user' });
		setAuthStatus('authenticated');
	}, []);

	// Set session
	const setSession = useCallback((accessToken: string) => {
		if (accessToken) {
			localStorage.setItem(LocalStorageKeys.jwtToken, accessToken);
		}
	}, []);

	// Reset session
	const resetSession = useCallback(() => {
		localStorage.removeItem(LocalStorageKeys.jwtToken);
	}, []);

	// Get access token from local storage
	const getAccessToken = useCallback(() => {
		return localStorage.getItem(LocalStorageKeys.jwtToken);
	}, []);

	// Check if the access token is valid
	const isTokenValid = useCallback((accessToken: string) => {
		if (accessToken) {
			try {
				const decoded = jwtDecode<JwtPayload>(accessToken);
				const currentTime = Math.floor(Date.now() / 1000);
				return decoded.exp > currentTime;
			} catch (error) {
				return false;
			}
		}

		return false;
	}, []);

	// Check if the access token exist and is valid on mount
	useEffect(() => {
		const attemptAutoLogin = async () => {
			const accessToken = autoLoginToken || getAccessToken();

			if (autoLoginToken) {
				searchParams.delete(LocalStorageKeys.autoLoginToken);
				history.replace({
					search: searchParams.toString()
				});
			}

			if (isTokenValid(accessToken)) {
				try {
					const response = await profileMutate({ token: accessToken });
					const userData = response?.data;

					handleSignInSuccess(userData, accessToken);

					return true;
				} catch (error) {
					signOut();
					return false;
				}
			} else {
				resetSession();
				return false;
			}
		};

		if (!isAuthenticated) {
			attemptAutoLogin().then((signedIn) => {
				setAuthStatus(signedIn ? 'authenticated' : 'unauthenticated');
			});
		}
	}, [isTokenValid, setSession, getAccessToken, isAuthenticated]);

	const sendCode = useCallback((credentials: IAuthSendCode) => {
		setUserEmail(credentials.email);
		return sendCodeMutate(credentials);
	}, []);

	const signIn = (credentials: IAuthLogin) => {
		return loginMutate(credentials);
	};

	const signUp = useCallback((data: IAuthRegister) => {
		return registerMutate(data);
	}, []);

	/**
	 * Sign out
	 */
	const signOut = useCallback(() => {
		resetSession();

		setIsAuthenticated(false);
		setAuthStatus('unauthenticated');
		setUser(null);
	}, []);

	/**
	 * Update user
	 */
	const updateUser = useCallback(async (userData: PartialDeep<User>) => {
		return null;
	}, []);

	useEffect(() => {
		const requestInterceptorId = apiClient.interceptors.request.use((config) => {
			const token = getAccessToken();

			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}

			return config;
		});

		const responseInterceptorId = apiClient.interceptors.response.use(
			(response) => response,
			(error: unknown) => {
				if (isAxiosError(error) && error?.response?.status === 401) {
					signOut();
				}

				return Promise.reject(error);
			}
		);
		return () => {
			apiClient.interceptors.request.eject(requestInterceptorId);
			apiClient.interceptors.response.eject(responseInterceptorId);
		};
	}, []);

	const authContextValue = useMemo(
		() =>
			({
				user,
				userEmail,
				isAuthenticated,
				authStatus,
				isLoading,
				signIn,
				sendCode,
				signUp,
				signOut,
				updateUser
			}) as JwtAuthContextType,
		[user, isAuthenticated, isLoading, signIn, signUp, signOut, updateUser]
	);

	return <JwtAuthContext.Provider value={authContextValue}>{children}</JwtAuthContext.Provider>;
}

export default JwtAuthProvider;
