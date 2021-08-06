
const anonymousTemplate = (path, recipeTitle) => `
            <p>
              <br>Someone shared a recipe with you:
              <br>Check it out: <a href="https://kokebokami.com${path}">'${recipeTitle}'</a>.
              <br>
              <br>Best wishes,
              <br>Your Kokebokami team 👩‍🍳
            </p>
            `

const kokebokamiUsersTemplate = (receiver, sender, path, recipeTitle) => `
        <p>Hi ${receiver},
          <br>
          <br>${sender} just shared a recipe with you!
          <br>
          <br>Check it out: <a href="https://kokebokami.com${path}">'${recipeTitle}'</a>.
          <br>PS: You might need to login to see this recipe.
          <br>
          <br>Best wishes,
          <br>Your Kokebokami team 👩‍🍳</p>`

const commentTemplate = () => ``

const shoppingListTemplate = (receiver, sender, listTitle) => `
        <p>Hi ${receiver},
          <br>
          <br>You just received a shopping list from ${sender}.
          <br>'${listTitle}' is now available among your shopping list.
          <br>
          <br>Login to <a href="https://kokebokami.com">Kokebokami</a> to check it out!
          <br>
          <br>Best wishes,
          <br>Your Kokebokami team 👩‍🍳
        </p>`

module.exports = {
  anonymousTemplate,
  kokebokamiUsersTemplate,
  commentTemplate,
  shoppingListTemplate
}
