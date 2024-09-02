import React from 'react';
import { Handle, Position } from 'reactflow';

const CustomNode = ({ data }) => {
  return (
    <div
      style={{
        padding: '10px',
        borderRadius: '3px',
        background: '#9CA8B3',
        color: 'white',
        textAlign: 'center',
        position: 'relative',
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#555' }}
      />
      <div>{data.label}</div>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#555' }}
      />
    </div>
  );
};

export default CustomNode;
