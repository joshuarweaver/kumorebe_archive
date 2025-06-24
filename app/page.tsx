'use client';

import { useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    brandId: 'test-brand-001',
    brandName: 'EcoRevolution',
    industry: 'sustainable fashion',
    targetAudience: 'Environmentally conscious millennials who want style without compromise',
    objectives: ['Increase brand awareness', 'Challenge fast fashion narrative', 'Build community'],
    brandValues: ['Sustainability', 'Transparency', 'Radical honesty', 'Community'],
    brandArchetype: 'rebel',
    riskTolerance: 'high' as const,
    budget: '$75,000',
    timeline: '3 months'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate campaign');
      }
      
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayChange = (field: 'objectives' | 'brandValues', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
          Kumorebe AI
        </h1>
        <p className="text-xl text-gray-400 mb-8">Strategy-First Campaign Generator</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <h2 className="text-2xl font-semibold mb-6">Campaign Parameters</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Brand Name</label>
                <input
                  type="text"
                  name="brandName"
                  value={formData.brandName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Industry</label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Target Audience</label>
                <textarea
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Objectives</label>
                {formData.objectives.map((obj, index) => (
                  <input
                    key={index}
                    type="text"
                    value={obj}
                    onChange={(e) => handleArrayChange('objectives', index, e.target.value)}
                    className="w-full px-4 py-2 mb-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Brand Values</label>
                {formData.brandValues.map((value, index) => (
                  <input
                    key={index}
                    type="text"
                    value={value}
                    onChange={(e) => handleArrayChange('brandValues', index, e.target.value)}
                    className="w-full px-4 py-2 mb-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Brand Archetype</label>
                <select
                  name="brandArchetype"
                  value={formData.brandArchetype}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="rebel">Rebel</option>
                  <option value="hero">Hero</option>
                  <option value="creator">Creator</option>
                  <option value="sage">Sage</option>
                  <option value="explorer">Explorer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Risk Tolerance</label>
                <select
                  name="riskTolerance"
                  value={formData.riskTolerance}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Generating Campaign...' : 'Generate Campaign'}
              </button>
            </form>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <h2 className="text-2xl font-semibold mb-6">Campaign Result</h2>
            
            {error && (
              <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}
            
            {result && (
              <div className="space-y-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-purple-400 mb-2">
                    {result.campaign.title}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-400">Framework:</span> {result.campaign.strategyMetadata.framework}</p>
                    <p><span className="text-gray-400">Cultural Tension:</span> {result.campaign.strategyMetadata.culturalTension}</p>
                    <p><span className="text-gray-400">Myth Market:</span> {result.campaign.strategyMetadata.mythMarket}</p>
                  </div>
                </div>

                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-pink-400 mb-2">Convention Violations</h4>
                  {result.campaign.conventionViolations.map((violation: any, index: number) => (
                    <div key={index} className="mb-2 text-sm">
                      <p className="text-gray-300">{violation.violation}</p>
                      <p className="text-gray-500">Risk: {violation.riskLevel}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-green-400 mb-2">Participation Architecture</h4>
                  <p className="text-sm text-gray-300">Type: {result.campaign.participationArchitecture.engagementType}</p>
                  <p className="text-sm text-gray-300">Platforms: {result.campaign.participationArchitecture.platforms.join(', ')}</p>
                </div>
              </div>
            )}
            
            {!result && !error && (
              <p className="text-gray-500 text-center py-8">
                Configure your campaign parameters and click Generate to see results
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}