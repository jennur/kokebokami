//Must be used in combination with user & allusers-mixin
export default {
  computed: {
    followed() {
      let users = this.allUsers;
      let following = [];
      if (this.user && this.user.following)
        following = Object.values(this.user.following);
      return (
        users &&
        users.filter(user => {
          return following.indexOf(user[0]) > -1;
        })
      );
    },
    followers() {
      let users = this.allUsers;
      return (
        users &&
        users.filter(user => {
          let following = user[1].following && user[1].following;
          return (
            following && Object.values(following).indexOf(this.user.id) > -1
          );
        })
      );
    }
  }
};
