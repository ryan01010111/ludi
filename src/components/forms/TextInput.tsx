import { Icon } from '@iconify/react';
import './TextInput.css';

interface Props {
  type?: React.HTMLInputTypeAttribute;
  name: string;
  placeholder?: string;
  defaultValue?: string;
  width?: number | string;
  margin?: number | string;
}

export default function TextInput({
  type, name, placeholder, defaultValue, width, margin,
}: Props) {
  const className = `text-input${type === 'search'
    ? ' search-input'
    : ''}`;

  return (
    <div className={className} style={{ width, margin }}>
      {type === 'search' ? (
        <Icon
          className="search-input-icon"
          icon="ci:search-magnifying-glass"
        />
      ) : null}

      <input
        type={type}
        aria-label={placeholder}
        placeholder={placeholder}
        name={name}
        autoComplete="off"
        defaultValue={defaultValue}
      />
    </div>
  );
}

TextInput.defaultProps = {
  type: 'text',
  placeholder: '',
  defaultValue: '',
  width: 400,
  margin: 0,
};
