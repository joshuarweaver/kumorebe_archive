import { ReactNode } from 'react';

export default function CampaignLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="absolute top-8 right-8">
        <h1 className="text-xl font-chillax font-medium">kumorebe</h1>
      </div>
      
      {children}
    </div>
  );
}