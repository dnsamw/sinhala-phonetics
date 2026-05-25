# @dnsam/sinhala-phonetics

> Type Sinhala phonetically. Get Unicode. Instantly.

A fully TypeScript-supported npm package for Sinhala phonetic input — ships React components with real-time conversion, word prediction, and full Tailwind CSS support.

```
npm install @dnsam/sinhala-phonetics
```

---

## Features

- **Real-time conversion** — type `ayubowan`, get `ආයුබෝවන්`
- **Word prediction** — dropdown suggestions as you type, powered by a built-in Sinhala dictionary
- **React-ready** — drop-in `<SinhalaTypewriter>` component with suggestion dropdown
- **Tailwind styled** — default styles included; fully overridable via `className` props
- **Headless option** — pass `unstyled` to get bare elements and style your own way
- **Framework-agnostic core** — use `convertText()` and `SinhalaPredictor` anywhere (Node, browser, Svelte, Vue…)
- **Dual ESM + CJS** — tree-shakeable, works in all modern bundlers
- **Zero runtime dependencies**

---

## Quick Start

### All-in-one component (recommended)

```tsx
import { SinhalaTypewriter } from '@dnsam/sinhala-phonetics';

export default function App() {
  const [text, setText] = useState('');

  return (
    <SinhalaTypewriter
      onChange={setText}
      placeholder='Type "ayubowan"…'
      maxSuggestions={5}
    />
  );
}
```

### Tailwind content path

Add this to your `tailwind.config.js` so the default styles are not purged:

```js
content: [
  // ... your other paths
  './node_modules/@dnsam/sinhala-phonetics/dist/**/*.js',
]
```

---

## Phonetic Reference

| Type      | You get   | Meaning        |
|-----------|-----------|----------------|
| `ayubowan`| ආයුබෝවන් | Hello / Welcome |
| `mama`    | මම        | I / Me          |
| `amma`    | අම්මා     | Mother          |
| `kohomada`| කොහොමද   | How are you?    |
| `rata`    | රට        | Country         |
| `gama`    | ගම        | Village         |
| `aadare`  | ආදරේ      | Love            |
| `isthuthi`| ඉස්තූති   | Thanks          |

Full phonetic mapping: [see the converter source](src/core/converter.ts).

---

## API Reference

### `<SinhalaTypewriter>` — all-in-one component

```tsx
<SinhalaTypewriter
  value={string}                   // controlled value (Sinhala)
  defaultValue={string}            // uncontrolled initial value
  onChange={(sinhala) => void}     // fires with converted Sinhala text
  onPhoneticChange={(raw) => void} // fires with raw phonetic input
  onSuggestionSelect={(word) => void}
  showSuggestions={true}           // default: true
  maxSuggestions={5}               // default: 5
  placeholder={string}
  disabled={boolean}
  rows={number}                    // default: 4
  unstyled={boolean}               // strip all default styles

  // className overrides
  className={string}               // wrapper div
  inputClassName={string}          // textarea
  suggestionsClassName={string}    // dropdown list <ul>
  suggestionItemClassName={string} // each <li>
/>
```

### `<SinhalaInput>` — textarea only (no suggestions)

```tsx
<SinhalaInput
  onChange={(sinhala) => void}
  placeholder="Type here…"
  rows={6}
/>
```

### `<SuggestionList>` — standalone suggestion dropdown

```tsx
<SuggestionList
  suggestions={[{ word: 'ගෙදර' }, { word: 'ගෙනාවා' }]}
  onSelect={(word) => console.log(word)}
/>
```

---

## Hooks

### `useSinhalaConverter`

Manages the phonetic ↔ Sinhala state. Useful when building a custom UI.

```tsx
import { useSinhalaConverter } from '@dnsam/sinhala-phonetics';

const {
  phoneticValue,       // raw typed input
  sinhalaValue,        // converted Sinhala text
  currentWordPhonetic, // phonetic text of the word being typed
  currentWordSinhala,  // Sinhala conversion of current word
  handlePhoneticChange,// call this with textarea value on onChange
  replaceCurrentWord,  // inject a word, replaces current partial word
  reset,               // clear everything
} = useSinhalaConverter('', (sinhala) => console.log(sinhala));
```

### `useWordPrediction`

```tsx
import { useWordPrediction } from '@dnsam/sinhala-phonetics';

const suggestions = useWordPrediction(currentWordSinhala, {
  maxSuggestions: 5,
  predictor: myCustomPredictor, // optional, defaults to built-in
});
// suggestions: Array<{ word: string }>
```

---

## Core Utilities

### `convertText(input: string): string`

Framework-agnostic converter. Works in Node, Deno, browsers — anywhere.

```ts
import { convertText } from '@dnsam/sinhala-phonetics';

convertText('mama')      // → 'මම'
convertText('ayubowan') // → 'ආයුබෝවන්'
convertText('kohomada') // → 'කොහොමද'
```

### `SinhalaPredictor`

Build your own predictor with a custom word list.

```ts
import { SinhalaPredictor } from '@dnsam/sinhala-phonetics';

const predictor = new SinhalaPredictor(['ගෙදර', 'ගෙනාවා', 'ගෙල']);
predictor.addWords(['අම්මා', 'තාත්තා']);

predictor.predict('ගෙ', 3);
// → [{ word: 'ගෙදර' }, { word: 'ගෙනාවා' }, { word: 'ගෙල' }]
```

### `SINHALA_WORDS`

The built-in dictionary (~350 common words) as a plain `string[]`. Import it to extend or inspect.

```ts
import { SINHALA_WORDS } from '@dnsam/sinhala-phonetics';
```

---

## TypeScript Types

```ts
import type {
  WordSuggestion,        // { word: string; frequency?: number }
  SinhalaInputProps,
  SinhalaTypewriterProps,
  SuggestionListProps,
} from '@dnsam/sinhala-phonetics';
```

---

## Unstyled / Headless Usage

Pass `unstyled` to remove all default Tailwind classes and style entirely yourself:

```tsx
<SinhalaTypewriter
  unstyled
  inputClassName="my-textarea-class"
  suggestionsClassName="my-dropdown-class"
  suggestionItemClassName="my-item-class"
  onChange={setText}
/>
```

---

## Roadmap

- [ ] Keyboard navigation for suggestions (↑ ↓ Enter)
- [ ] Larger curated word dictionary
- [ ] Frequency-based suggestion ranking
- [ ] `<SinhalaInlineInput>` (single-line `<input>`)
- [ ] Svelte / Vue wrappers

---

## License

MIT © [Dileepa Sam](https://github.com/dnsamw)
