import React from 'react';
import { AssistantPanel } from '../components/chat/AssistantPanel';

export const AssistantChat: React.FC = () => {
  return (
    <div className="h-[calc(100vh-100px)] max-w-5xl mx-auto animate-fade-in px-2">
      <AssistantPanel isFullPage={true} />
    </div>
  );
};
