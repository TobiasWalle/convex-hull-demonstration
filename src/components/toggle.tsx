import React from 'react';

interface ToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export const Toggle: React.FunctionComponent<ToggleProps> = ({
  value,
  onChange,
  children
}) => (
  <label>
    <input
      type="checkbox"
      checked={value}
      onChange={event => onChange((event.target as any).checked)}
    />
    {children}
  </label>
);
