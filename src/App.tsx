import { useState } from "react";
import "./App.css";

const sampleProduct = {
  id: 123,
  name: "Widget",
  width: 10,
  height: 5,
  thickness: 2,
  isHeated: true,
};

const sampleFactory = {
  location: "Factory City",
  maxWidth: 100,
  maxHeight: 50,
  maxVolume: 1000,
  capacity: 1000,
  heatAvailable: true,
};

const productVariables = [
  { code: "product.width", label: "Ширина продукта" },
  { code: "product.height", label: "Высота продукта" },
  { code: "product.thickness", label: "Толщина продукта" },
  { code: "product.isHeated", label: "Продукт нагревается" },
];

const factoryVariables = [
  { code: "factory.maxWidth", label: "Максимальная ширина станка" },
  { code: "factory.maxHeight", label: "Максимальная высота станка" },
  { code: "factory.maxVolume", label: "Максимальный объем станка" },
  { code: "factory.capacity", label: "Вместимость станка" },
  { code: "factory.heatAvailable", label: "Станок может нагревать" },
];

const operators = [
  { value: "<", display: "меньше" },
  { value: ">", display: "больше" },
  { value: "<=", display: "меньше или равно" },
  { value: ">=", display: "больше или равно" },
  { value: "===", display: "равно" },
  { value: "&&", display: "И" },
  { value: "||", display: "ИЛИ" },
];

function App() {
  const [codeBlocks, setCodeBlocks] = useState<
    Array<{ type: "variable" | "operator"; value: string; display?: string }>
  >([]);
  const [validationResult, setValidationResult] = useState("");
  const [error, setError] = useState("");

  const getVariableDisplay = (code: string) => {
    const allVariables = [...productVariables, ...factoryVariables];
    return allVariables.find(v => v.code === code)?.label || code;
  };

  const insertVariable = (variableCode: string) => {
    setCodeBlocks(prev => [
      ...prev,
      {
        type: "variable",
        value: variableCode,
        display: getVariableDisplay(variableCode),
      },
    ]);
  };

  const insertOperator = (operator: { value: string; display: string }) => {
    setCodeBlocks(prev => [
      ...prev,
      {
        type: "operator",
        value: operator.value,
        display: operator.display,
      },
    ]);
  };

  const removeBlock = (index: number) => {
    setCodeBlocks(prev => prev.filter((_, i) => i !== index));
  };

  const validateFunction = () => {
    try {
      const codeString = codeBlocks.map(block => block.value).join(" ");

      const func = new Function("product", "factory", `return (${codeString})`);
      const result = func(sampleProduct, sampleFactory);
      setValidationResult(
        result ? "✅ Условие выполняется" : "❌ Условие не выполняется"
      );
      setError("");
    } catch (err) {
      setError(
        `Ошибка: ${err instanceof Error ? err.message : "Неверный синтаксис"}`
      );
      setValidationResult("");
    }
  };

  return (
    <>
      <div className="card">
        <h2>Доступные переменные</h2>

        <div className="variables-section">
          <h3>Параметры продукта:</h3>
          <div className="variables-grid">
            {productVariables.map(variable => (
              <button
                key={variable.code}
                onClick={() => insertVariable(variable.code)}
                className="variable-button"
              >
                {variable.label}
              </button>
            ))}
          </div>

          <h3>Параметры станка:</h3>
          <div className="variables-grid">
            {factoryVariables.map(variable => (
              <button
                key={variable.code}
                onClick={() => insertVariable(variable.code)}
                className="variable-button"
              >
                {variable.label}
              </button>
            ))}
          </div>

          <h3>Операторы:</h3>
          <div className="operators-grid">
            {operators.map(operator => (
              <button
                key={operator.value}
                onClick={() => insertOperator(operator)}
                className="operator-button"
              >
                {operator.display}
              </button>
            ))}
          </div>
        </div>

        <div className="code-blocks-container">
          {codeBlocks.map((block, index) => (
            <div
              key={index}
              className={`code-block ${block.type}-block`}
              onClick={() => removeBlock(index)}
              title="Нажмите чтобы удалить"
            >
              {block.display || block.value}
            </div>
          ))}
        </div>

        <button onClick={validateFunction} className="validate-button">
          Проверить
        </button>

        {validationResult && <div className="result">{validationResult}</div>}
        {error && <div className="error">{error}</div>}
      </div>

      <style>{`
        .variables-section {
          margin: 20px 0;
          text-align: left;
        }
        .variables-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 10px;
          margin-bottom: 20px;
        }
        .variable-button {
          padding: 8px 12px;
          background-color: #f0f0f0;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
          text-align: left;
          transition: background-color 0.2s;
        }
        .variable-button:hover {
          background-color: #e0e0e0;
        }
        .operators-grid {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }
        .operator-button {
          padding: 8px 12px;
          background-color: #e6f3ff;
          border: 1px solid #b3d9ff;
          border-radius: 4px;
          cursor: pointer;
        }
        .code-blocks-container {
          min-height: 60px;
          padding: 10px;
          border: 2px dashed #ddd;
          border-radius: 4px;
          margin: 20px 0;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          align-items: center;
        }
        .code-block {
          padding: 8px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          display: inline-block;
        }
        .variable-block {
          background-color: #e8f5e9;
          border: 1px solid #c8e6c9;
        }
        .operator-block {
          background-color: #e3f2fd;
          border: 1px solid #bbdefb;
        }
        .code-block:hover {
          opacity: 0.8;
        }
        .validate-button {
          padding: 10px 20px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }
        .validate-button:hover {
          background-color: #45a049;
        }
        .result {
          margin-top: 10px;
          font-weight: bold;
          color: green;
        }
        .error {
          color: red;
          margin-top: 10px;
        }
      `}</style>
    </>
  );
}

export default App;
