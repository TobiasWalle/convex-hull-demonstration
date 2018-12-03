import React from 'react';

interface SelectProps<T> {
  options: T[];
  onSelect: (value: T) => void;
  renderOption: (value: T) => React.ReactNode;
}

export function Select<T>({ options, onSelect, renderOption }: SelectProps<T>): React.ReactElement<any> {
  return (
    <select
      onChange={event => onSelect(options[+event.target.value])}
    >
      {options.map((option, index) =>
        <option
          key={index}
          value={index}
        >{renderOption(option)}</option>
      )}
    </select>
  )
}
