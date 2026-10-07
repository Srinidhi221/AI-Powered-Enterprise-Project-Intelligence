import React from 'react';
import { AssistantPanel } from '../components/chat/AssistantPanel';

export const AssistantChat: React.FC = () => {
  return (
    <div className="h-[calc(100vh-140px)] max-w-5xl mx-auto animate-fade-in">
      <AssistantPanel isFullPage={true} />
    </div>
  );
};
