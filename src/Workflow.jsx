import React, { useCallback, useState, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  getBezierPath,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNodeComponent from './CustomNodeComponent';
import CustomNodeComponent2 from './CustomNodeComponent2';
import Sidebar from './Sidebar';

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  markerEnd,
  data,
  onDelete,
}) => {
  const edgePath = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <text
        style={{
          fontSize: 12,
          cursor: 'pointer',
          userSelect: 'none',
          fill: '#000',
        }}
        onClick={() => onDelete(id)} 
      >
        <textPath
          href={`#${id}`}
          startOffset="50%"
          textAnchor="middle"
        >
          ❌
        </textPath>
      </text>
    </>
  );
};

export default function Workflow({ addNode }) {
  const initialNodes = [
    {
      id: '1',
      type: 'customNode1',
      position: { x: 100, y: 100 },
      data: { title: 'Node 1' },
    },
    {
      id: '2',
      type: 'customNode2',
      position: { x: 400, y: 100 },
      data: { title: 'Node 2' },
    },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const handleAddNode = useCallback((type) => {
    const newNode = {
      id: `${+new Date()}`,
      type,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { title: `Node ${type}` },
    };

    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  const handleCopyNode = useCallback((nodeId) => {
    const nodeToCopy = nodes.find(node => node.id === nodeId);
    if (nodeToCopy) {
      const newNode = {
        ...nodeToCopy,
        id: `${+new Date()}`, // New ID for the copied node
        position: {
          ...nodeToCopy.position, // Copy position
          x: nodeToCopy.position.x + 50, // Offset position to avoid overlap
          y: nodeToCopy.position.y + 50,
        },
        data: {
          ...nodeToCopy.data, // Ensure independent data state
        }
      };
      
      setNodes((nds) => nds.concat(newNode));
    }
  }, [nodes, setNodes]);
  

  const handleDeleteNode = useCallback((nodeId) => {
    setNodes((nds) => nds.filter(node => node.id !== nodeId));
  }, [setNodes]);

  const handleDeleteEdge = useCallback((edgeId) => {
    setEdges((eds) => eds.filter(edge => edge.id !== edgeId));
  }, [setEdges]);

  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => {
        const updatedEdges = addEdge({ ...params, type: 'custom' }, eds);
        
        // Find source and target nodes based on edge params
        const sourceNode = nodes.find(node => node.id === params.source);
        const targetNode = nodes.find(node => node.id === params.target);
        
        console.log('Source Node ID:', params.source);
        console.log('Target Node Data:', targetNode ? targetNode.data : 'Not found');
        console.log('Updated Nodes Tree:', updatedEdges.map(edge => ({
          id: edge.id,
          source: edge.source,
          target: edge.target
        })));
        console.log('Updated Edges:', updatedEdges);
        
        return updatedEdges;
      });
    },
    [nodes, setEdges]
  );

  const nodeTypes = useMemo(() => ({
    customNode1: (node) => (
      <CustomNodeComponent
        data={node.data}
        node={node}
        onCopy={handleCopyNode}
        onDelete={handleDeleteNode}
      />
    ),
    customNode2: (node) => (
      <CustomNodeComponent2
        data={node.data}
        node={node}
        onCopy={handleCopyNode}
        onDelete={handleDeleteNode}
      />
    ),
  }), [handleCopyNode, handleDeleteNode]);

  const edgeTypes = useMemo(() => ({
    custom: (props) => (
      <CustomEdge {...props} onDelete={handleDeleteEdge} />
    ),
  }), [handleDeleteEdge]);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar onAddNode={handleAddNode} />
      <div style={{ flexGrow: 1 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          edgeTypes={edgeTypes}
          nodeTypes={nodeTypes}
        >
          <Controls />
          <MiniMap />
          <Background gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}