import React from 'react';
import ReactDOM from 'react-dom';

const App = () => {
  return (
    <div>
      <textarea>
        <div>
          <button>Submit</button>
        </div>
      </textarea>
      <pre></pre>
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));
