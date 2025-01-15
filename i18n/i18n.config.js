import no from "./locales/no-NO.js";
import en from "./locales/en-US.js"

export default defineI18nConfig(() => ({
    legacy: false,
    multiDomainLocales: true,
    detectBrowserLanguage: false,
    locale: "en",
    messages: {
      en, 
      no
    },
    locales: [
      {
        name: "Norsk",
        code: "no",
        iso: "no-NO",
        domains: ["kokebokami.no", "localhost:3000"],
      },
      {
        name: "English",
        code: "en",
        iso: "en-US",
        domains: ["kokebokami.com", "kokebokami-development.herokuapp.com", "localhost:3000"],
      },
    ],
    fallbackLocale: "en",
    lazy: true,
  }))