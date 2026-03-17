import React from 'react';
import AIConfig from '@/components/common/AIConfig';

const PerplexityConfig = ({ selectedNode, onClose, setNodeConfig }) => {
    const configPrams = {
        title: "Perplexity AI",
        logo: "perplexity"
    };

    return (    
        <AIConfig configParams={configPrams} selectedNode={selectedNode} onClose={onClose} setNodeConfig={setNodeConfig} />
    );
};

export default PerplexityConfig;
