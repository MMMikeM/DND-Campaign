'use client';

import React, { useState } from 'react';
import YamlDisplay from './YamlDisplay';
import NavigationDrawer from './NavigationDrawer';
import { ProcessedData } from '@/types/yamlTypes';

interface YamlViewerContainerProps {
  initialFiles: string[];
  fileDataMap?: Record<string, ProcessedData>; // Pre-loaded file data
}

export default function YamlViewerContainer({ 
  initialFiles,
  fileDataMap = {} 
}: YamlViewerContainerProps) {
  const [activeFile, setActiveFile] = useState<string | null>(null);
  
  // Handle file selection
  const handleSelectFile = (fileName: string) => {
    setActiveFile(fileName);
  };
  
  // Get data for the active file if available
  const activeFileData = activeFile ? fileDataMap[activeFile] || null : null;
  
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Navigation sidebar */}
      <NavigationDrawer 
        files={initialFiles} 
        activeFile={activeFile} 
        onSelectFile={handleSelectFile} 
      />
      
      {/* Content area */}
      <div className="flex-1 overflow-auto p-6">
        <YamlDisplay 
          filename={activeFile}
          data={activeFileData}
        />
      </div>
    </div>
  );
} 