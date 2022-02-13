import styles from './Button.module.css'

interface Props {
  active?: boolean;
  children: JSX.Element | JSX.Element[] | string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button = (props: Props) =>
  <button
    className={(props.variant ? styles[props.variant] : '') + (props.active ? ' active' : '')}
    onClick={props.onClick}
    >
    { props.children }
  </button>
