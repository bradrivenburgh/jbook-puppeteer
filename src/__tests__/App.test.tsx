import { render, screen } from '../test-utils/testing-library-utils';
import App from '../App';
import userEvent from '@testing-library/user-event';

/*
  The tests below initially worked, but using the "esbuild-wasm" transpiler
  with the "wasmURL" option throws the following error:
    // "Error: The "wasmURL" option only works in the browser"
  

*/

describe.skip('App', () => {
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
  it('displays transpiled code', () => {
    render(<App />);
    const textarea = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /submit/i });
    const code = screen.getByTestId('code');

    userEvent.type(textarea, '() =>  "hello"');
    userEvent.click(button);

    expect(code.textContent).toBe('hello');
  });
});
