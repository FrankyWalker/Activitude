import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    signInWithPopup,
    GoogleAuthProvider,
    createUserWithEmailAndPassword
} from "firebase/auth";
import { auth } from "../firebase/firebase";

// Async thunk for email/password login
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            localStorage.setItem('user', JSON.stringify(user)); // Store user in localStorage
            return user;
        } catch (error) {
            let errorMessage = 'Login failed';

            // Handle specific Firebase auth errors
            if (error.code === 'auth/user-not-found') {
                errorMessage = 'No user found with this email';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'Invalid password';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email format';
            } else if (error.code === 'auth/invalid-credential') {
                errorMessage = 'Invalid credentials';
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Too many failed login attempts. Please try again later.';
            } else if (error.code === 'auth/user-disabled') {
                errorMessage = 'This account has been disabled';
            } else if (error.message) {
                errorMessage = error.message;
            }

            return rejectWithValue(errorMessage);
        }
    }
);

// Async thunk for email/password signup
export const signUpUser = createAsyncThunk(
    "auth/signUpUser",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            localStorage.setItem('user', JSON.stringify(user)); // Store user in localStorage
            return user;
        } catch (error) {
            let errorMessage = 'Signup failed';

            // Handle specific Firebase auth errors
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'This email is already in use';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Password is too weak';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email format';
            } else if (error.message) {
                errorMessage = error.message;
            }

            return rejectWithValue(errorMessage);
        }
    }
);

// Async thunk for Google Sign-In
export const googleSignIn = createAsyncThunk(
    "auth/googleSignIn",
    async (_, { rejectWithValue }) => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            localStorage.setItem('user', JSON.stringify(user)); // Store user in localStorage
            return user;
        } catch (error) {
            let errorMessage = 'Google sign-in failed';

            // Handle specific Firebase auth errors
            if (error.code === 'auth/popup-closed-by-user') {
                errorMessage = 'Sign-in popup was closed before completion';
            } else if (error.code === 'auth/cancelled-popup-request') {
                errorMessage = 'Multiple popup requests were made in quick succession';
            } else if (error.code === 'auth/popup-blocked') {
                errorMessage = 'Popup was blocked by the browser. Please allow popups for this site.';
            } else if (error.message) {
                errorMessage = error.message;
            }

            return rejectWithValue(errorMessage);
        }
    }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
    "auth/logoutUser",
    async (_, { rejectWithValue }) => {
        try {
            await signOut(auth);
            localStorage.removeItem('user'); // Remove user from localStorage
            return true;
        } catch (error) {
            return rejectWithValue(error.message || 'Logout failed');
        }
    }
);

// Auth slice
const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: JSON.parse(localStorage.getItem('user')) || null, // Retrieve user from localStorage (if any)
        loading: false,
        error: null,
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Handling loginUser actions
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handling signUpUser actions
            .addCase(signUpUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signUpUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(signUpUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handling googleSignIn actions
            .addCase(googleSignIn.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(googleSignIn.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(googleSignIn.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handling logoutUser actions
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.error = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Sync auth state with Redux
export const listenToAuthChanges = (dispatch) => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            dispatch(setUser(user));
            localStorage.setItem('user', JSON.stringify(user)); // Save user in localStorage
        } else {
            dispatch(setUser(null));
            localStorage.removeItem('user'); // Remove user from localStorage
        }
    });
};

export const { setUser, clearError } = authSlice.actions;

export default authSlice.reducer;
