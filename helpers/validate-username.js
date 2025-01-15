import { getDatabase, ref, get } from "firebase/database";

export default async function validateUsername(username) {
  console.log("Username:", username);
  let usernameRegex = /^[a-zA-Z\s]+$/;

  if(!usernameRegex.test(username)) {
    return {
      systemMessage: "Username can only consist of letters and spaces",
      valid: false
    }
  } else {
    const db = getDatabase();
    const snapshot = await get(ref(db, "users"));

    if(snapshot.val()){
      let users = snapshot.val();

      for(let key in users) {
        let user = users[key];

        if(user.displayName.toLowerCase() === username.toLowerCase()){
          if(key !== this.user.id) return {
            systemMessage: "This username is already in use",
            valid: false
          }
        }
      }

      return { 
        systemMessage: "",
        valid: true 
      };
    }

    return {
      systemMessage: "Something went wrong...",
      valid: false
    }
  }
}
