# Kaomoji ＼(^o^)／

Random kaomoji generator with 314 kaomojis across 4 categories.

## Install

```bash
npm install kaomoji
```

## Usage

### In code

```js
const { happy, sad, congrats, thanks } = require('kaomoji');

happy(); // random happy kaomoji
sad(); // random sad kaomoji
congrats(); // random congrats kaomoji
thanks(); // random thanks kaomoji

happy.all; // array of all happy kaomojis
```

### CLI

```bash
kaomoji [happy|sad|congrats|thanks] [--all|-a]
```

Running without arguments launches an interactive category picker.

## Categories

| Category | Count |
| -------- | ----- |
| happy    | 102   |
| sad      | 81    |
| congrats | 85    |
| thanks   | 46    |

## License

BSD
