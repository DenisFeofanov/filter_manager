import { useState, useCallback } from "react";
import "./App.css";

interface Rule {
  id: string;
  description: string;
  functionString: string;
}

interface FactoryResult {
  factory: any;
  matches: boolean;
  failedRules: string[];
}

// Sample data structure
const sampleProduct = {
  requirements: {
    weight: 150,
    precision: 0.01,
    material: "steel",
  },
};

const sampleFactories = [
  {
    name: "Factory A",
    capabilities: {
      maxWeight: 100,
      minPrecision: 0.1,
      materials: ["aluminum"],
    },
  },
  {
    name: "Factory B",
    capabilities: {
      maxWeight: 200,
      minPrecision: 0.01,
      materials: ["steel", "titanium"],
    },
  },
];

function App() {
  const [rules, setRules] = useState<Rule[]>([
    {
      id: "1",
      description: "Weight Capacity",
      functionString: `(product, factory) => product.requirements.weight <= factory.capabilities.maxWeight`,
    },
  ]);
  const [results, setResults] = useState<FactoryResult[]>([]);

  // Add new rule with default template
  const addRule = () => {
    setRules([
      ...rules,
      {
        id: Date.now().toString(),
        description: `New Rule ${rules.length + 1}`,
        functionString: `(product, factory) => {\n  // Add your comparison logic here\n  return true;\n}`,
      },
    ]);
  };

  // Update rule function
  const updateRule = (id: string, field: keyof Rule, value: string) => {
    setRules(
      rules.map(rule => (rule.id === id ? { ...rule, [field]: value } : rule))
    );
  };

  // Evaluate factories against rules
  const evaluateFactories = useCallback(() => {
    const results = sampleFactories.map(factory => {
      const failedRules: string[] = [];

      const matches = rules.every(rule => {
        try {
          const func = new Function(
            "product",
            "factory",
            `return ${rule.functionString}`
          )(sampleProduct, factory);
          if (!func) failedRules.push(rule.description);
          return func;
        } catch (error) {
          console.error("Error in rule:", rule.description, error);
          failedRules.push(`${rule.description} (Invalid syntax)`);
          return false;
        }
      });

      return { factory, matches, failedRules };
    });

    setResults(results);
  }, [rules]);

  // Get available properties for suggestions
  const availableProperties = (obj: any, path = ""): string[] => {
    if (typeof obj !== "object" || obj === null) return [path];
    return Object.keys(obj).flatMap(key =>
      availableProperties(obj[key], path ? `${path}.${key}` : key)
    );
  };

  return (
    <div className="App">
      <h1>Factory Matching Configuration</h1>

      {/* Rule Builder Section */}
      <div className="rule-builder">
        <button onClick={addRule}>Add New Rule</button>

        {rules.map(rule => (
          <div key={rule.id} className="rule">
            <input
              value={rule.description}
              onChange={e => updateRule(rule.id, "description", e.target.value)}
              placeholder="Rule description"
            />
            <div className="suggestions">
              <span>
                Available product properties:{" "}
                {availableProperties(sampleProduct).join(", ")}
              </span>
              <span>
                Available factory properties:{" "}
                {availableProperties(sampleFactories[0]).join(", ")}
              </span>
            </div>
            <textarea
              value={rule.functionString}
              onChange={e =>
                updateRule(rule.id, "functionString", e.target.value)
              }
              placeholder="Enter rule function"
              rows={6}
            />
          </div>
        ))}
      </div>

      {/* Results Section */}
      <button onClick={evaluateFactories}>Run Matching</button>
      <div className="results">
        {results.map((result, index) => (
          <div
            key={index}
            className={`result ${result.matches ? "match" : "no-match"}`}
          >
            <h3>{result.factory.name}</h3>
            <p>Status: {result.matches ? "✅ Match" : "❌ No Match"}</p>
            {result.failedRules.length > 0 && (
              <div>
                <p>Failed rules:</p>
                <ul>
                  {result.failedRules.map((rule, i) => (
                    <li key={i}>{rule}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
