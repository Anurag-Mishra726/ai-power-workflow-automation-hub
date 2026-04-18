import React from 'react';
import AIConfig from '@/components/common/AIConfig';

const GeminiConfig = ({ selectedNode, onClose, setNodeConfig }) => {
    const configPrams = {
        title: "Gemini AI",
        logo: "gemini"
    };
    
    return (    
        <AIConfig configParams={configPrams} selectedNode={selectedNode} onClose={onClose} setNodeConfig={setNodeConfig} />
    );
}

export default GeminiConfig;
