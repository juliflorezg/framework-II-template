import { Platform } from "react-native";

if (Platform.OS === 'ios') {
    import('@formatjs/intl-getcanonicallocales/polyfill');
    import('@formatjs/intl-locale/polyfill');
    import('@formatjs/intl-pluralrules/polyfill');
    import('@formatjs/intl-pluralrules/locale-data/en');
    import('@formatjs/intl-pluralrules/locale-data/es');
    import('@formatjs/intl-numberformat/polyfill');
    import('@formatjs/intl-numberformat/locale-data/en');
    import('@formatjs/intl-numberformat/locale-data/es-CO');
    import('@formatjs/intl-datetimeformat/polyfill');
    import('@formatjs/intl-datetimeformat/locale-data/en');
    import('@formatjs/intl-datetimeformat/locale-data/es-CO');
    import('@formatjs/intl-datetimeformat/add-all-tz');
}


export { App } from "./App";
