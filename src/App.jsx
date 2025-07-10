import { useState, useEffect, useRef } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

const compute = (a, b, operator) => {
  try {
    let result;
    switch (operator) {
      case '+':
        result = a + b;
        break;
      case '-':
        result = a - b;
        break;
      case '*':
        result = a * b;
        break;
      case '/':
        result = a / b;
        break;
      default:
        throw new Error('Invalid operator');
    }

    return Number.isInteger(result)
      ? result.toString()
      : parseFloat(result.toFixed(8)).toString();
  } catch {
    return 'Error';
  }
};

function App() {
  const [display, setDisplay] = useState('0');
  const [operation, setOperation] = useState('');
  const [firstOperand, setFirstOperand] = useState(null);
  const [currentOperator, setCurrentOperator] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const displayRef = useRef(null);

  useEffect(() => displayRef.current?.focus(), []);

  const inputDigit = (digit) => {
    if (showResult) {
      setDisplay(digit);
      setOperation('');
      setShowResult(false);
    } else if (
      currentOperator &&
      firstOperand !== null &&
      display === firstOperand.toString()
    ) {
      setDisplay(digit);
      setOperation(`${firstOperand} ${currentOperator} ${digit}`);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
      if (currentOperator) {
        setOperation(
          `${firstOperand} ${currentOperator} ${
            display === '0' ? digit : display + digit
          }`
        );
      }
    }
  };

  const inputDecimal = () => {
    if (showResult) {
      setDisplay('0.');
      setOperation('');
      setShowResult(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
      if (currentOperator) {
        setOperation(`${firstOperand} ${currentOperator} ${display}.`);
      }
    }
  };

  const clearDisplay = () => {
    setDisplay('0');
    setOperation('');
    setFirstOperand(null);
    setCurrentOperator(null);
    setShowResult(false);
  };

  const handleOperator = (nextOperator) => {
    const inputValue = parseFloat(display);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
      setOperation(`${inputValue} ${nextOperator}`);
      setDisplay(inputValue.toString());
    } else if (currentOperator) {
      const result = compute(firstOperand, inputValue, currentOperator);
      setDisplay(result);
      setFirstOperand(parseFloat(result));
      setOperation(`${result} ${nextOperator}`);
    } else {
      setOperation(`${display} ${nextOperator}`);
    }

    setCurrentOperator(nextOperator);
    setShowResult(false);
  };

  const calculate = () => {
    if (firstOperand === null || currentOperator === null) return;

    const inputValue = parseFloat(display);
    const result = compute(firstOperand, inputValue, currentOperator);
    setDisplay(result);
    setOperation(`${firstOperand} ${currentOperator} ${inputValue} =`);
    setFirstOperand(parseFloat(result));
    setCurrentOperator(null);
    setShowResult(true);
  };

  const handleKeyDown = (e) => {
    const { key } = e;

    if (key >= '0' && key <= '9') {
      e.preventDefault();
      inputDigit(key);
    } else if (key === '.') {
      e.preventDefault();
      inputDecimal();
    } else if (key === 'Enter') {
      e.preventDefault();
      calculate();
    } else if (key === 'Escape') {
      e.preventDefault();
      clearDisplay();
    } else if (key === 'Backspace') {
      e.preventDefault();
      setDisplay(display.length === 1 ? '0' : display.slice(0, -1));
    } else if (['+', '-', '*', '/'].includes(key)) {
      e.preventDefault();
      handleOperator(key);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [display, firstOperand, currentOperator, showResult]);

  const buttons = [
    '7',
    '8',
    '9',
    { value: '/', text: '/', cls: 'operator' },
    '4',
    '5',
    '6',
    { value: '*', text: '×', cls: 'operator' },
    '1',
    '2',
    '3',
    { value: '-', text: '-', cls: 'operator' },
    '0',
    '.',
    { value: 'C', text: 'C', cls: 'clear' },
    { value: '+', text: '+', cls: 'operator' },
    { value: '=', text: '=', cls: 'equals', colspan: 4 },
  ];

  return (
    <div className="app">
      <div className="logos">
        <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
          <img src={viteLogo} alt="Vite" className="logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img src={reactLogo} alt="React" className="logo react" />
        </a>
      </div>

      <div className="calculator">
        <div className="operation-display">{operation || '\u00A0'}</div>
        <div
          ref={displayRef}
          className={`display ${showResult ? 'result' : ''}`}
          tabIndex={0}
        >
          {display}
        </div>

        <div className="buttons">
          {buttons.map((btn) => {
            const config =
              typeof btn === 'string' ? { value: btn, text: btn } : btn;

            return (
              <button
                key={config.value}
                className={`btn ${config.cls || ''}`}
                onClick={() => {
                  if (config.value === 'C') clearDisplay();
                  else if (config.value === '=') calculate();
                  else if (config.value === '.') inputDecimal();
                  else if (['+', '-', '*', '/'].includes(config.value))
                    handleOperator(config.value);
                  else inputDigit(config.value);
                }}
                style={
                  config.colspan ? { gridColumn: `span ${config.colspan}` } : {}
                }
              >
                {config.text}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
