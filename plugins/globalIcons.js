export default defineNuxtPlugin((nuxtApp) => {
  const svgFiles = import.meta.glob("~/assets/graphics/icons/*.svg", { eager: true });

  for (const path in svgFiles) {
    const componentName = path.split("/").pop().replace(".svg", "");
    nuxtApp.vueApp.component(componentName, svgFiles[path].default);
  }
});
