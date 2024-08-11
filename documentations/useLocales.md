# useLocaleInfo

`useLocaleInfo` in Framer allows you to know the active locale as the available locales from your framer project.

````js
import { useLocaleInfo } from "framer"

export default function CodeComponent(props) {
    const { activeLocale, locales } = useLocaleInfo()
    return <div>{activeLocale.name}</div>
}
````

The `activeLocale` parameter returns an object with the following properties:

- id: The Locale ID (e.g., `otsmaRta5`). It will be `default` for the default locale.
- code: The [ISO 639 language code](https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes) of the current locale (e.g., en).
- slug: The slug used in the URL (e.g., `/en`).
- name: The name defined in the Framer project (e.g., `English`).

The `locales` parameter returns an array that contains the available locales from your Framer project, using the same properties as mentioned above. The `useLocaleCode` hook is available as shorter version to get the active language code:

```js
import { useLocaleCode } from "framer"

export default function CodeComponent(props) {
    const localeCode = useLocaleCode()
    return <div>{localeCode}</div>
}
```
