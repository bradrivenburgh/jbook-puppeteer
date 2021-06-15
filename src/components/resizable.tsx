import './resizable.css';
import { ResizableBox } from 'react-resizable';

interface ResizableProps {
  direction: 'horizontal' | 'vertical';
}

const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  return (
    <ResizableBox
      height={300}
      width={Infinity}
      resizeHandles={['s']}
      minConstraints={[Infinity, 24]}
      maxConstraints={[Infinity, window.innerHeight * 0.9]}>
      {children}
    </ResizableBox>
  );
};

export default Resizable;