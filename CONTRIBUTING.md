# Contributing Benchmark Data

Thanks for helping grow the Gasnet.org benchmark corpus. The workflow below
keeps datasets consistent and easy to compare.

## Workflow

1. Fork this repository.
2. Copy `static/data/benchmarks/TEMPLATE.json` to
   `static/data/benchmarks/<your-cluster>.json`.
3. Fill in your measurements and metadata.
4. Run validation locally:

```bash
npm install
npm run validate:benchmarks
```

5. Submit a pull request with a brief summary of your test environment.

## Data requirements

- Provide at least 3 message sizes for latency and bandwidth.
- Include hardware metadata: nodes, network, and CPU model.
- Use consistent units (microseconds, GB/s).
- Measurements should be reproducible and include warm-up runs.

## Tips

- Record the exact commit or tag of the runtime you tested.
- Capture compiler versions and job launcher settings in your PR description.
- If you omit metadata, explain why in the PR.
