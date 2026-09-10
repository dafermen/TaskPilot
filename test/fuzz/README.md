# Fuzz Tests

Run the deterministic suite with:

```bash
npm run test:fuzz
```

The current seed is `0x1badb002`. The suite mutates 750 JSON inputs and covers malformed roots, unsupported backup versions, parser failures, and unavailable/quota-exceeded browser storage. A failing input must be retained as a regression fixture before changing its seed.
