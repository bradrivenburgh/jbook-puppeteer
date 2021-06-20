interface ActionButtonProps {
  id: string;
  action: string;
  onClick(id: string, action?: string): void;
}

const icon: { [key: string]: string } = {
  up: 'fas fa-arrow-up',
  down: 'fas fa-arrow-down',
  delete: 'fas fa-times',
};

const ActionButton: React.FC<ActionButtonProps> = ({ id, action, onClick }) => {
  return (
    <button
      className='button is-primary is-small'
      onClick={() => onClick(id, action)}>
      <span className='icon'>
        <i className={icon[action]} />
      </span>
    </button>
  );
};

export default ActionButton;
