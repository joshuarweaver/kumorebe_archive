'use client';

// Helper function to clean markdown formatting
const cleanMarkdown = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/^[-•]\s*/gm, '')
    .replace(/^\d+\.\s*/gm, '')
    .trim();
};

interface CreativeExecutionProps {
  campaign: any;
}

export default function CreativeExecution({ campaign }: CreativeExecutionProps) {
  // Handle both direct campaign object and database-stored campaign
  const creativeData = campaign.creative_data || campaign.creative || {};
  const heroConcept = creativeData.heroConcept?.narrative || 
                     creativeData.description ||
                     'A bold creative concept that breaks category conventions and invites authentic participation.';
  
  return (
    <div className="space-y-8">
      <div className="bg-neutral-900/50 p-8 rounded-2xl border border-neutral-800">
        <h3 className="text-2xl font-medium mb-6 text-green-400">Creative Execution</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-medium mb-4 text-blue-400">Hero Concept</h4>
            <p className="text-neutral-300 leading-relaxed mb-6">
              {cleanMarkdown(heroConcept)}
            </p>
            
            <h4 className="text-lg font-medium mb-4 text-purple-400">Key Messages</h4>
            <ul className="space-y-2 text-neutral-300">
              {creativeData.keyMessages?.map((message: string, index: number) => (
                <li key={index}>• {cleanMarkdown(message)}</li>
              )) || (
                <>
                  <li>• Authentic rebellion against industry norms</li>
                  <li>• Community-driven change movement</li>
                  <li>• Cultural disruption through participation</li>
                </>
              )}
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4 text-yellow-400">Activation Strategy</h4>
            <div className="space-y-4">
              {creativeData.activationPhases?.map((phase: any, index: number) => (
                <div key={index} className="p-4 bg-neutral-800/50 rounded-lg">
                  <h5 className="font-medium text-white mb-2">{phase.name || `Phase ${index + 1}`}</h5>
                  <p className="text-sm text-neutral-400">{cleanMarkdown(phase.description)}</p>
                </div>
              )) || (
                <>
                  <div className="p-4 bg-neutral-800/50 rounded-lg">
                    <h5 className="font-medium text-white mb-2">Phase 1: Ignition</h5>
                    <p className="text-sm text-neutral-400">Launch with cultural provocateurs and early adopters</p>
                  </div>
                  <div className="p-4 bg-neutral-800/50 rounded-lg">
                    <h5 className="font-medium text-white mb-2">Phase 2: Amplification</h5>
                    <p className="text-sm text-neutral-400">Scale through participation mechanics and viral loops</p>
                  </div>
                  <div className="p-4 bg-neutral-800/50 rounded-lg">
                    <h5 className="font-medium text-white mb-2">Phase 3: Institutionalization</h5>
                    <p className="text-sm text-neutral-400">Embed in cultural conversation and normalize change</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}