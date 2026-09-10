# Performance Tests

Automated controls:

- Production JavaScript budget: 750 KiB uncompressed.
- Production CSS budget: 200 KiB uncompressed.
- A 10,000-task board must normalize within 2.5 seconds.

Run `npm run test:performance` for the data budget and `npm run build && npm run performance:budget` for assets. Browser memory, repeated import, and sustained interaction measurements remain manual.
