import React from 'react';

export default function APIReference({ name, signature, description, params = [], returns }) {
  return (
    <div className="api-reference">
      <h3>
        <code>{name}</code>
      </h3>
      {signature && <pre>{signature}</pre>}
      {description && <p>{description}</p>}
      {params.length > 0 && (
        <>
          <h4>Parameters</h4>
          <ul>
            {params.map((param, index) => (
              <li key={index}>
                <code>{param.name}</code>: {param.description}
              </li>
            ))}
          </ul>
        </>
      )}
      {returns && (
        <>
          <h4>Returns</h4>
          <p>{returns}</p>
        </>
      )}
    </div>
  );
}
