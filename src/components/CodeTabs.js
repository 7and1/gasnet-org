/**
 * CodeTabs component - render multi-language code samples.
 *
 * @module components/CodeTabs
 */

import React from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

export default function CodeTabs({ title, groupId = 'language', c, cpp, python, rust, bash }) {
  const entries = [
    { value: 'c', label: 'C', language: 'c', code: c },
    { value: 'cpp', label: 'C++', language: 'cpp', code: cpp },
    { value: 'python', label: 'Python', language: 'python', code: python },
    { value: 'rust', label: 'Rust', language: 'rust', code: rust },
    { value: 'bash', label: 'Bash', language: 'bash', code: bash },
  ].filter(entry => entry.code);

  if (entries.length === 0) {
    return null;
  }

  const defaultValue = entries[0].value;

  return (
    <div className="code-tabs">
      {title ? <div className="code-tabs__title">{title}</div> : null}
      <Tabs groupId={groupId} defaultValue={defaultValue}>
        {entries.map(entry => (
          <TabItem key={entry.value} value={entry.value} label={entry.label}>
            <CodeBlock language={entry.language}>{entry.code}</CodeBlock>
          </TabItem>
        ))}
      </Tabs>
    </div>
  );
}
