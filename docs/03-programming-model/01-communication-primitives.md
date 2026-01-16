---
title: Communication Primitives
description: Core GASNet primitives and how they map to latency budgets.
slug: /programming-model/communication-primitives
tags: [programming-model, rma, active-messages]
related:
  - /docs/programming-model/api-reference
  - /docs/benchmarks/microbenchmarks
sidebar_position: 1
---

import CodeTabs from '@site/src/components/CodeTabs';

GASNet-style runtimes generally expose two classes of primitives: remote memory
access and active messages.

## Remote memory access

- **Put**: one-sided write into a remote address space
- **Get**: one-sided read from a remote address space

Focus on these metrics:

- Initiation cost vs. completion latency
- Ordering guarantees
- Alignment and registration penalties

### Put and get across languages

<CodeTabs
title="Remote memory access bindings"
c={`gasnet_put(dest, src, size);\ngasnet_get(dest, src, size);`}
python={`gasnet.put(dest, src, size)\ngasnet.get(dest, src, size)`}
rust={`gasnet::put(dest, src, size);\ngasnet::get(dest, src, size);`}
/>

## Active messages

Active messages combine data movement with a handler invocation on the target
node. They are valuable for control-plane and fine-grained coordination.

Key observations to document:

- Handler queue depth
- Handler execution time
- Progress mode (polling vs. interrupts)

## Interactive latency model

Use the slider to visualize how fixed overhead impacts small message latency.

```jsx live
function LatencyModel() {
  const [payloadKb, setPayloadKb] = React.useState(1);
  const baseUs = 0.7;
  const perKbUs = 0.18;
  const latency = (baseUs + perKbUs * payloadKb).toFixed(2);

  return (
    <div>
      <label>
        Payload (KB): {payloadKb}
        <input
          type="range"
          min="1"
          max="64"
          value={payloadKb}
          onChange={event => setPayloadKb(Number(event.target.value))}
        />
      </label>
      <p>Estimated latency: {latency} μs</p>
    </div>
  );
}
```
