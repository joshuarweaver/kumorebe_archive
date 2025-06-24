export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1>Kumorebe AI Engine</h1>
      <p>AI-first marketing campaign intelligence</p>
      
      <h2>API Endpoints:</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li>POST /api/v1/analyze - Cultural analysis</li>
        <li>POST /api/v1/generate - Campaign generation</li>
        <li>POST /api/v1/predict - Performance prediction</li>
        <li>POST /api/v1/optimize - Campaign optimization</li>
        <li>GET /api/v1/explain - AI reasoning</li>
      </ul>
      
      <h2>Test the AI:</h2>
      <pre style={{ background: '#f0f0f0', padding: '1rem', borderRadius: '4px' }}>
{`curl -X POST http://localhost:3000/api/v1/analyze \\
  -H "Content-Type: application/json" \\
  -d '{
    "brand": "Nike",
    "industry": "sportswear",
    "target": "Gen Z athletes"
  }'`}
      </pre>
    </main>
  );
}