import { useAuthStore } from "~/store/authStore";

export default function useUser() {
  const authStore = useAuthStore();
  const userData = JSON.parse(JSON.stringify(authStore.user));
  return (
    userData || {
      id: null,
      displayName: null,
      photoURL: null,
      email: null
    }
  );
};
