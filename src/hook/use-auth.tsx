import { useSelector, useDispatch } from "react-redux";
import { logout as logoutAction } from "@/store/authSlice";
import { useEffect } from "react";
import { getProfile } from "@/services/authService";
import { RootState } from "@/store/store";

export function useAuth() {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    const fetchUserProfile = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken && !user) {
        try {
          const profile = await getProfile();
          if (profile) {
            dispatch({ type: "auth/login", payload: profile });
          }
        } catch (error) {
          console.error("Failed to fetch user profile", error);
        }
      }
    };

    fetchUserProfile();
  }, [dispatch, user]);

  const logout = () => {
    dispatch(logoutAction());
  };

  return { user, isAuthenticated, isLoading, logout };
}
