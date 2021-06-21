import './action-bar.css';
import { useActions } from '../hooks/useActions';
import ActionButton from './action-button';

interface ActionBarProps {
  id: string;
}

const ActionBar: React.FC<ActionBarProps> = ({ id }) => {
  const { moveCell, deleteCell } = useActions();

  return (
    <div className="action-bar">
      <ActionButton id={id} action='up' onClick={moveCell} />
      <ActionButton id={id} action='down' onClick={moveCell} />
      <ActionButton id={id} action='delete' onClick={deleteCell} />
    </div>
  );
};

export default ActionBar;
