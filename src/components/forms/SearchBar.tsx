import { Icon } from '@iconify/react';
import './SearchBar.css';

interface Props {
  width?: number | string;
  defaultValue?: string;
}

export default function SearchBar({ width, defaultValue }: Props) {
  return (
    <div id="search-bar" style={{ width }}>
      <Icon
        id="search-bar-icon"
        icon="ci:search-magnifying-glass"
      />
      <input
        type="search"
        aria-label="Search events"
        placeholder="Search for events"
        name="q"
        autoComplete="off"
        defaultValue={defaultValue}
      />
    </div>
  );
}

SearchBar.defaultProps = {
  width: '400px',
  defaultValue: '',
};
