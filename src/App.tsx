import { useState } from "react";
import "./App.css";

function App() {
  const [userCode, setUserCode] = useState("");
  const [validationResult, setValidationResult] = useState("");
  const [error, setError] = useState("");

  // Sample objects with available properties
  const sampleProduct = {
    id: 123,
    name: "Widget",
    price: 29.99,
    stock: 150,
    dimensions: { width: 10, height: 5 },
  };

  const sampleFactory = {
    location: "Factory City",
    capacity: 1000,
    isOperational: true,
    productionRate: 50,
  };

  const validateFunction = () => {
    try {
      const func = new Function("product", "factory", `return (${userCode})`);
      const result = func(sampleProduct, sampleFactory);
      setValidationResult(result ? "✅ Valid" : "❌ Invalid");
      setError("");
    } catch (err) {
      setError(
        `Error: ${err instanceof Error ? err.message : "Invalid syntax"}`
      );
      setValidationResult("");
    }
  };

  return (
    <>
      <div className="card">
        <h2>Available Variables</h2>
        <div className="variables-list">
          <strong>Product:</strong> id, name, price, stock, dimensions (width,
          height)
          <br />
          <strong>Factory:</strong> location, capacity, isOperational,
          productionRate
        </div>

        <textarea
          value={userCode}
          onChange={e => setUserCode(e.target.value)}
          placeholder="Enter your validation function (e.g.: return product.price > 20 && factory.capacity > 500)"
          rows={5}
        />

        <button onClick={validateFunction}>Validate</button>

        {validationResult && <div className="result">{validationResult}</div>}
        {error && <div className="error">{error}</div>}
      </div>

      {/* Add some CSS for the new elements */}
      <style>{`
        .variables-list {
          border: 1px solid #444;
          padding: 10px;
          margin: 10px 0;
          text-align: left;
        }
        textarea {
          width: 80%;
          margin: 10px 0;
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
