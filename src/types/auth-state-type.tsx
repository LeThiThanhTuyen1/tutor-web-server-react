
export interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// export interface DecodedToken {
//   role?: string;
//   exp?: number;
//   iat?: number;
// }
