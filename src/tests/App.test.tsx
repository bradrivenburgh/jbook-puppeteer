import { render, screen } from '../test-utils/testing-library-utils';
import App from '../App';
import userEvent from '@testing-library/user-event';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
  });
  it('displays a textarea, "submit" button, and preformatted code output', () => {
    render(<App />);
    const textarea = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /submit/i });
    const code = screen.getByTestId('code');
    expect(textarea).toBeInTheDocument();
    expect(button).toBeInTheDocument();
    expect(code).toBeInTheDocument();
  });
  // "Error: The "wasmURL" option only works in the browser"
  it.skip('displays text in the code section', () => {
    render(<App />);
    const textarea = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /submit/i });
    const code = screen.getByTestId('code');

    userEvent.type(textarea, '() =>  "hello"');
    userEvent.click(button);

    expect(code.textContent).toBe('hello');
  });
});
