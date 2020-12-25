interface Props {
  active: boolean;
  children: JSX.Element | JSX.Element[];
  onClick: () => void;
}

export const Button = (props: Props) =>
  <button
    className={props.active ? 'active' : ''}
    onClick={props.onClick}
    >
    { props.children }
  </button>
