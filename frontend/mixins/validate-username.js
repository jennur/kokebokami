export default {
  methods: {
    async validateUsername(username) {
      console.log("Username:", username);
      let usernameRegex = /^[a-zA-Z\s]+$/;
      if(!usernameRegex.test(username)) {
        this.usernameSystemMessage = "Username can only consist of letters and spaces";
        return false;
      } else {
        let valid = true;
        let snapshot = await this.$fire.database
          .ref("users")
          .once("value");
        if(snapshot.val()){
          let users = snapshot.val();
          for(let key in users) {
            let user = users[key];
            if(user.displayName.toLowerCase() === username.toLowerCase()){
              if(key === this.user.id) valid = true;
              else {
                this.usernameSystemMessage = "This username is already in use";
                valid = false;
              }
            }
          }
          if(valid) this.usernameSystemMessage = "";
        }

        return valid;
      }
    }
  }
}
