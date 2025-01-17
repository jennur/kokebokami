import { getDatabase, ref, get } from "firebase/database";
import userModel from "~/helpers/user-model";
import { useAuthStore } from "~/store";

export default function useConnectedUsers() {
  const authStore = useAuthStore();
  
  const followed = [];
  const followers = [];
  let errorMessage = null;

  async function getConnectedUsers() {
    if (authStore.user) {
      try {
        const db = getDatabase();
        const snapshot = await get(ref(db, "users"));
  
        if (snapshot.exists()) {
          const users = snapshot.val();
  
          for (const key in users) {
            const user = users[key];
            //If followed ...
            if (
              user.following &&
              Object.values(user.following).some(id => id === authStore.user.id)
            ) {
              followers.push(userModel(user, key));
            }
            //If following ...
            if (
              authStore.user.following &&
              Object.values(authStore.user.following).some(id => id === key)
            ) {
              followed.push(userModel(user, key));
            }
          }
        }
      } catch (error) {
        console.log("[useConnectedUsers]", error.message);
        errorMessage =
          "Unable to load users. If the issue continues, please contact us.";
      }
    }

    return {
      followed,
      followers,
      errorMessage,
    };
  }
  
  return { getConnectedUsers };
}
