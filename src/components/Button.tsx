import { ReactNode } from 'react';
import './Button.css';

interface Props {
  children: ReactNode;
  type: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
  width?: number | string;
  margin?: number | string;
}

export default function Button({
  children, type, width, margin,
}: Props) {
  return (
    <button
      className="button-primary"
      type={type}
      style={{ width, margin }}
    >
      {children}
    </button>
  );
}

Button.defaultProps = {
  width: undefined,
  margin: undefined,
};
