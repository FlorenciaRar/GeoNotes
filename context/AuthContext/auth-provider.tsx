import { useEffect, useReducer } from 'react'
import AuthContext from './auth-context'
import { IUser } from '../../src/shared/models/user'
import { AUTH_ACTIONS } from './enums'
import { auth, db } from '../../src/firebase/config'
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User, UserCredential } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

// --- Tipos locales ---
interface Action {
	type: AUTH_ACTIONS
	payload?: any
}

interface State {
	isLoading: boolean
	user: IUser | null
	token: string | null
	refreshToken: string | null
}

// --- Estado inicial ---
const initialState: State = {
	isLoading: true,
	user: null,
	token: null,
	refreshToken: null,
}

// --- Reducer ---
function reducer(prevState: State, action: Action): State {
	const { payload } = action

	switch (action.type) {
		case AUTH_ACTIONS.LOGIN:
			return {
				...prevState,
				isLoading: false,
				user: payload.user,
				token: payload.token,
				refreshToken: payload.refreshToken,
			}

		case AUTH_ACTIONS.LOGOUT:
			return { ...initialState, isLoading: false }

		case AUTH_ACTIONS.SET_LOADING:
			return { ...prevState, isLoading: payload }

		default:
			return prevState
	}
}

// --- Provider principal ---
const AuthProvider = (props: any) => {
	const [state, dispatch] = useReducer(reducer, initialState)

	// --- Escucha persistencia de sesión (Firebase la maneja internamente) ---
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
			// Simulación de carga para probar el loader
			// await new Promise((resolve) => setTimeout(resolve, 3000));

			if (user) {
				const token = await user.getIdToken()
				const refreshToken = user.refreshToken

				// Leer los datos del perfil en Firestore
				let profileData = null
				try {
					const userDoc = await getDoc(doc(db, 'users', user.uid))
					if (userDoc.exists()) {
						profileData = userDoc.data()
					}
				} catch (err) {
					console.error('Error al leer datos de Firestore:', err)
				}

				// Creamos el objeto IUser
				const currentUser: IUser = {
					id: user.uid,
					name: profileData?.name ?? user.displayName ?? '',
					surname: profileData?.surname ?? '',
					email: user.email ?? '',
					birthdate: profileData?.birthdate ?? '',
				}

				dispatch({
					type: AUTH_ACTIONS.LOGIN,
					payload: { user: currentUser, token, refreshToken },
				})
			} else {
				dispatch({ type: AUTH_ACTIONS.LOGOUT })
			}
		})

		return unsubscribe // Limpia el listener cuando se desmonta
	}, [])

	// --- LOGIN: Inicia sesión en Firebase ---
	const login = async (email: string, password: string) => {
		dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true })
		try {
			const userCredential = await signInWithEmailAndPassword(auth, email, password)
			return userCredential
		} catch (error: any) {
			console.log('Error en login:', error.code)
			if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
				return Promise.reject('Credenciales inválidas')
			}

			return Promise.reject(error)
		} finally {
			dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false }) // 🔚 oculta loader
		}
	}

	// --- REGISTER: Crea usuario + devuelve el userCredential ---
	const register = async (email: string, password: string): Promise<UserCredential> => {
		dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true })
		try {
			const userCredential = await createUserWithEmailAndPassword(auth, email, password)
			return userCredential
		} catch (error: any) {
			console.error('Error en registro:', error.code)
			throw error
		} finally {
			dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false })
		}
	}

	// --- LOGOUT: Cierra sesión ---
	const logout = async () => {
		try {
			await signOut(auth)
			dispatch({ type: AUTH_ACTIONS.LOGOUT })
		} catch (error: any) {
			console.error('Error al cerrar sesión:', error.code)
			throw error
		}
	}

	return (
		<AuthContext.Provider
			value={{
				state,
				dispatch,
				login,
				register,
				logout,
			}}
		>
			{props.children}
		</AuthContext.Provider>
	)
}

export default AuthProvider
