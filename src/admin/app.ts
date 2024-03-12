import newLogo from "./extensions/logo.png";
// import favicon from "./extensions/favicon.png";

export default {
  config: {
    locales: ["de", "ru", "zh"],
    auth: {
      logo: newLogo,
    },
    menu: {
      logo: newLogo,
    },
    // head: {
    //   favicon: favicon,
    // },
  },
  bootstrap() {
  },
};