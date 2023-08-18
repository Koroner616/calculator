import React, { useState, useEffect, useCallback } from 'react';
import './Calculator.css';
import { evaluate } from 'mathjs';

const OPERATOR_REGEX = /[-+x/]/;

const Calculator = () => {
  const [currentValue, setCurrentValue] = useState('0');
  const [calculationHistory, setCalculationHistory] = useState('');

  const updateValueAndHistory = (newValue, newHistory) => {
    setCurrentValue(newValue);
    setCalculationHistory(newHistory);
  };

  const handleOperator = useCallback((event) => {
    const selectedOperator = event.target.value;
    let updatedHistory = calculationHistory;

    if (updatedHistory === '') {
      updatedHistory = '0';
    } else if (updatedHistory[updatedHistory.length - 1] === '.' || OPERATOR_REGEX.test(currentValue)) {
      updatedHistory = updatedHistory.slice(0, updatedHistory.length - 1);
    }

    updateValueAndHistory('', updatedHistory + selectedOperator);
  }, [calculationHistory, currentValue]);

  const handleNumber = useCallback((event) => {
    const selectedNumber = event.target.value;

    if (OPERATOR_REGEX.test(currentValue) || currentValue === '0') {
      updateValueAndHistory(selectedNumber, calculationHistory + selectedNumber);
    } else {
      updateValueAndHistory(currentValue + selectedNumber, calculationHistory + selectedNumber);
    }
  }, [calculationHistory, currentValue]);

  const handleDecimal = useCallback(() => {
    if (!OPERATOR_REGEX.test(currentValue) && !currentValue.includes('.')) {
      updateValueAndHistory(currentValue + '.', calculationHistory + (calculationHistory === '' ? '0.' : '.'));
    }
  }, [calculationHistory, currentValue]);

  const clear = () => {
    updateValueAndHistory('0', '');
  };

  const calculate = useCallback(() => {
    let formula = calculationHistory;
    if (OPERATOR_REGEX.test(formula[formula.length - 1])) {
      formula = formula.slice(0, formula.length - 1);
    }

    try {
      const result = evaluate(formula.replace(/x/g, '*'));
      updateValueAndHistory(result.toString(), result.toString());
    } catch (error) {
      console.error('Calculation error:', error);
      updateValueAndHistory('Error', '');
    }
  }, [calculationHistory]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      const key = event.key;
      const keyPressed = event.code;
      const button = document.getElementById(keyPressed);
      if (button) {
        button.classList.add('pressed');
        setTimeout(() => {
          button.classList.remove('pressed');
        }, 100);
      }
      if (/\d/.test(key)) {
        handleNumber({ target: { value: key } });
      } else if (OPERATOR_REGEX.test(key)) {
        handleOperator({ target: { value: key } });
      } else if (key === '.') {
        handleDecimal();
      } else if (key === 'Enter' || key === '=') {
        calculate();
      } else if (key === 'Backspace') {
        const newValue = currentValue.slice(0, -1);
        setCurrentValue(newValue === '' ? '0' : newValue);
        setCalculationHistory(calculationHistory.slice(0, -1));
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentValue, calculationHistory, handleNumber, handleOperator, handleDecimal, calculate]);

  return (
    <div id="calculator">
        <div id="screen">
            <div id="history">{calculationHistory}</div>
            <div id="display">{currentValue}</div>
        </div>
      <button id="clear" onClick={clear}>
        AC
      </button>
      <button id="NumpadDivide" value="/" onClick={handleOperator}>
        /
      </button>
      <button id="NumpadMultiply" value="x" onClick={handleOperator}>
        x
      </button>
      <button id="NumpadSubtract" value="-" onClick={handleOperator}>
        -
      </button>
      <button id="NumpadAdd" value="+" onClick={handleOperator}>
        +
      </button>
      <button id="NumpadEnter" onClick={calculate}>
        =
      </button>
      <button id="NumpadDecimal" onClick={handleDecimal}>
        .
      </button>
      <button id="Numpad0" value="0" onClick={handleNumber}>
        0
      </button>
      <button id="Numpad1" value="1" onClick={handleNumber}>
        1
      </button>
      <button id="Numpad2" value="2" onClick={handleNumber}>
        2
      </button>
      <button id="Numpad3" value="3" onClick={handleNumber}>
        3
      </button>
      <button id="Numpad4" value="4" onClick={handleNumber}>
        4
      </button>
      <button id="Numpad5" value="5" onClick={handleNumber}>
        5
      </button>
      <button id="Numpad6" value="6" onClick={handleNumber}>
        6
      </button>
      <button id="Numpad7" value="7" onClick={handleNumber}>
        7
      </button>
      <button id="Numpad8" value="8" onClick={handleNumber}>
        8
      </button>
      <button id="Numpad9" value="9" onClick={handleNumber}>
        9
      </button>
    </div>
  );
};

export default Calculator;
