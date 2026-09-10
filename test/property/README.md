# Property and Invariant Tests

Run the deterministic generated checks with:

```bash
npm run test:property
```

The suite generates 300 boards from seed `0x5eed1234` and verifies:

- Every task references an existing project and activity after normalization.
- Every activity references an existing project.
- Points remain an integer from 1 through 13.
- Columns, priorities, and statuses remain inside their documented sets.
- Backup export and import preserve valid relationships.
- Missing activities and malformed records recover without losing tasks.
