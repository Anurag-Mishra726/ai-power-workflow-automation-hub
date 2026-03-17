import React from 'react';
import AIConfig from '@/components/common/AIConfig';

const OpenAiConfig = ({ selectedNode, onClose, setNodeConfig }) => {
    const configPrams = {
        title: "ChatGPT",
        logo: "openai"
    };

    return (    
        <AIConfig configParams={configPrams} selectedNode={selectedNode} onClose={onClose} setNodeConfig={setNodeConfig} />
    );
};

export default OpenAiConfig;
