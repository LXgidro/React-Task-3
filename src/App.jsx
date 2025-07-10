import { useState, useEffect, useRef } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

const calculate = (expression) => {
  try {
    const cleanExpr = expression
      .replace(/×/g, '*')
      .replace(/[^\d+\-*/.()]/g, '');

    if (!cleanExpr) return { value: 'Error', isResult: true };

    const result = new Function(`return ${cleanExpr}`)();

    const formattedResult = Number.isInteger(result)
      ? result.toString()
      : parseFloat(result.toFixed(8)).toString();

    return {
      value: formattedResult,
      isResult: true,
      rawValue: result,
    };
  } catch {
    return { value: 'Error', isResult: true };
  }
};

function App() {
  const [input, setInput] = useState({ value: '', isResult: false });
  const displayRef = useRef(null);

  useEffect(() => {
    displayRef.current?.focus();
  }, []);

  const handleButtonClick = (value) => {
    if (value === 'C') {
      setInput({ value: '', isResult: false });
    } else if (value === '=') {
      const result = calculate(input.value);
      setInput(result);
    } else if (['+', '-', '*', '/'].includes(value)) {
      setInput((prev) => ({
        value: prev.isResult
          ? `${prev.value}${value}`
          : `${prev.value}${value}`,
        isResult: false,
      }));
    } else {
      setInput((prev) => ({
        value: prev.isResult ? value : prev.value + value,
        isResult: false,
      }));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key >= '0' && e.key <= '9') {
      setInput((prev) => ({
        value: prev.isResult ? e.key : prev.value + e.key,
        isResult: false,
      }));
    } else if (['+', '-', '*', '/', '.'].includes(e.key)) {
      setInput((prev) => ({
        value: prev.isResult
          ? `${prev.value}${e.key}`
          : `${prev.value}${e.key}`,
        isResult: false,
      }));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const result = calculate(input.value);
      setInput(result);
    } else if (e.key === 'Backspace') {
      setInput((prev) => ({
        value: prev.value.slice(0, -1),
        isResult: false,
      }));
    } else if (e.key === 'Escape') {
      setInput({ value: '', isResult: false });
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [input.value]);

  const buttons = [
    { value: '7', text: '7' },
    { value: '8', text: '8' },
    { value: '9', text: '9' },
    { value: '/', text: '/', cls: 'calculator-operations' },
    { value: '4', text: '4' },
    { value: '5', text: '5' },
    { value: '6', text: '6' },
    { value: '*', text: '×', cls: 'calculator-operations' },
    { value: '1', text: '1' },
    { value: '2', text: '2' },
    { value: '3', text: '3' },
    { value: '-', text: '-', cls: 'calculator-operations' },
    { value: '0', text: '0' },
    { value: '.', text: '.' },
    { value: 'C', text: 'C', cls: 'calculator-clear' },
    { value: '+', text: '+', cls: 'calculator-operations' },
    { value: '=', text: '=', cls: 'calculator-equals', colspan: 4 },
  ];

  return (
    <>
      <div className="logodiv">
        <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <div className="calculator">
        <div
          ref={displayRef}
          className={`calculator-display ${input.isResult ? 'result' : ''}`}
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          {input.value || <span className="placeholder">0</span>}
        </div>

        <div className="calculator-buttons">
          {buttons.map((btn) => (
            <button
              key={btn.value || btn.text}
              className={`calculator-btn ${btn.cls || ''}`}
              onClick={() => handleButtonClick(btn.value)}
              style={btn.colspan ? { gridColumn: `span ${btn.colspan}` } : {}}
            >
              {btn.text}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
