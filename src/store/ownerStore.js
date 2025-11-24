import { create } from 'zustand';
import apiClient from '../api/axiosConfig';

// Define the structure of an Owner object (as returned by /auth/me)
const defaultOwner = {
    id: null,
    name: '',
    email: '',
    type: null,
    status: null, // 'pending', 'approved', 'rejected'
};

export const useOwnerStore = create((set, get) => ({
    // State
    owner: defaultOwner,
    // Public-facing state names (used across components):
    // `isAuthenticated` mirrors previous `isLoggedIn` and `loading` mirrors `isSessionLoading`.
    isAuthenticated: false,
    loading: true, // Tracks if the session check is currently running
    authError: null,
    // Signup state for the registration page
    signupSuccess: false,
    error: null,
    books: [],
    booksLoading: false,

    // Actions

    /**
     * Attempts to log in an owner.
     * Handles the 'pending' status case explicitly.
     */
    login: async (credentials) => {
        set({ authError: null });
        try {
            // Note: The backend handles the cookie setting upon success.
            const response = await apiClient.post('/auth/login', credentials);

            // The owner-backend returns the owner object directly in `response.data`.
            // The backend already enforces approval (403) before returning a session,
            // so we simply set the returned owner as the authenticated user.
            const ownerData = response.data;
            set({
                owner: ownerData,
                isAuthenticated: true,
            });
            return { success: true };
        } catch (error) {
            console.error("Login Error:", error);
            const errorMessage = error.response?.data?.message || "Login failed. Check credentials or approval status.";
            set({ authError: errorMessage });
            return { success: false, message: errorMessage };
        }
    },

    /**
     * Attempts to restore session from the HTTP-Only cookie.
     * This is the function called in RequireOwner.jsx's useEffect.
     */
    restoreSession: async () => {
        // Prevent duplicate calls if already authenticated
        if (get().isAuthenticated) {
            set({ loading: false });
            return; // Already logged in, prevent duplicate check
        }

        set({ loading: true });
        try {
            const response = await apiClient.get('/auth/me');
            
            // Check status for edge cases where the session token might still be valid
            // but status has changed to pending/rejected. The backend returns the
            // owner object directly in `response.data`.
            const ownerData = response.data;
            if (ownerData.status === 'approved') {
                set({
                    owner: ownerData,
                    isAuthenticated: true,
                });
            } else {
                 // Clear session if token is present but status is not approved
                get().logout(); 
            }
        } catch (error) {
            // 401 Unauthorized or other network error means no valid session
            get().logout(); 
        } finally {
            // CRITICAL FIX: Ensure loading state is turned OFF after the check completes.
            set({ loading: false }); 
        }
    },

    /**
     * Clears session and removes the cookie on the backend.
     */
    logout: async () => {
        // Owner backend currently does not expose a logout endpoint to clear
        // the HTTP-only cookie. Clearing client state locally to avoid leaving
        // stale data in the UI. If a server logout endpoint is added later,
        // we can call it here and keep clearing local state in `finally`.
        set({
            owner: defaultOwner,
            isAuthenticated: false,
            books: [],
            authError: null,
            signupSuccess: false,
            error: null,
        });
    },

    /**
     * Register a new owner. Accepts plain object or FormData (for profileImage).
     */
    signup: async (payload) => {
        set({ error: null, signupSuccess: false, loading: true });
        try {
            let response;
            if (payload instanceof FormData) {
                response = await apiClient.post('/auth/signup', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
            } else if (payload && payload.profileImage instanceof File) {
                const fd = new FormData();
                Object.keys(payload).forEach((k) => {
                    if (payload[k] !== undefined && payload[k] !== null) {
                        if (k === 'profileImage') fd.append('profileImage', payload[k]);
                        else fd.append(k, payload[k]);
                    }
                });
                response = await apiClient.post('/auth/signup', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            } else {
                response = await apiClient.post('/auth/signup', payload);
            }

            // On success we show a submitted state; backend will set status to 'pending'
            set({ signupSuccess: true, loading: false });
            return { success: true, data: response.data };
        } catch (err) {
            console.error('Signup Error:', err);
            const msg = err.response?.data?.message || err.message || 'Signup failed.';
            set({ error: msg, loading: false });
            return { success: false, message: msg };
        }
    },

    /**
     * Fetches the owner's uploaded books.
     * This function is called in Dashboard.jsx's useEffect.
     */
    fetchBooks: async () => {
        // Do not fetch books if the owner is not authenticated or a fetch is already in progress
        if (!get().isAuthenticated || get().booksLoading) return;

        set({ booksLoading: true });
        try {
            const response = await apiClient.get('/books');
            // The book controller returns an array of books directly.
            set({ books: response.data || [] });
        } catch (error) {
            console.error('Error fetching books:', error);
            // Handle specific errors like 401 unauthorized if necessary
        } finally {
            // CRITICAL FIX: Ensure loading state is turned OFF after the fetch completes.
            set({ booksLoading: false });
        }
    },

    /**
     * Uploads a new book using FormData.
     */
    uploadBook: async (bookData) => {
        try {
            // Axios will automatically set Content-Type to multipart/form-data 
            // when it detects a FormData object.
            const response = await apiClient.post('/books', bookData);
            // After successful upload, refresh the list of books
            get().fetchBooks(); 
            return { success: true, book: response.data };
        } catch (error) {
            // Log detailed information to help diagnose server-side 500s
            console.error("Book Upload Error:", error);
            if (error.response) {
                console.error('Upload response data:', error.response.data);
                console.error('Upload response status:', error.response.status);
            }
            const errorMessage = error.response?.data?.message || error.message || "Book upload failed.";
            return { success: false, message: errorMessage };
        }
    },
        updateBook: async (id, bookData) => {
        try {
            const response = await apiClient.put(`/books/${id}`, bookData);
            // Refresh list after update
            get().fetchBooks();
            return { success: true, book: response.data };
        } catch (error) {
            console.error('Book Update Error:', error);
            if (error.response) console.error('Update response:', error.response.data);
            return { success: false, message: error.response?.data?.message || error.message };
        }
    },
    deleteBook: async (id) => {
        try {
            const response = await apiClient.delete(`/books/${id}`);
            get().fetchBooks();
            return { success: true };
        } catch (error) {
            console.error('Book Delete Error:', error);
            if (error.response) console.error('Delete response:', error.response.data);
            return { success: false, message: error.response?.data?.message || error.message };
        }
    },
    /**
     * Update owner's profile (bio, storeName, whatsappNumber, name, profileImage)
     * Accepts either a plain object or a FormData when updating an image.
     */
    updateProfile: async (payload) => {
        try {
            let response;
            // If payload contains a File (profileImage) or is already FormData, send as multipart
            if (payload instanceof FormData) {
                response = await apiClient.put('/auth/me', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
            } else if (payload && payload.profileImage instanceof File) {
                const fd = new FormData();
                Object.keys(payload).forEach((k) => {
                    if (payload[k] !== undefined && payload[k] !== null) {
                        if (k === 'profileImage') fd.append('profileImage', payload[k]);
                        else fd.append(k, payload[k]);
                    }
                });
                response = await apiClient.put('/auth/me', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            } else {
                // plain json update
                response = await apiClient.put('/auth/me', payload);
            }

            const updatedOwner = response.data;
            set({ owner: { ...get().owner, ...updatedOwner } });
            return { success: true, owner: updatedOwner };
        } catch (error) {
            console.error('Update Profile Error:', error);
            return { success: false, message: error.response?.data?.message || error.message };
        }
    },
}));

// Provide a default export for compatibility with files that import the store as default.
export default useOwnerStore;