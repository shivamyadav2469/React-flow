import React, { useCallback, useState, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNodeComponent from './CustomNodeComponent';
import CustomNodeComponent2 from './CustomNodeComponent2';
import Sidebar from './Sidebar';

const getBezierPath = ({ sourceX, sourceY, targetX, targetY }) => {
  const controlX = (sourceX + targetX) / 2;
  const controlY = (sourceY + targetY) / 2;

  return `M ${sourceX} ${sourceY} C ${controlX} ${sourceY} ${controlX} ${targetY} ${targetX} ${targetY}`;
};

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

  if (typeof edgePath !== 'string' || edgePath.includes('NaN')) {
    console.error('Invalid edgePath:', edgePath);
    return null;
  }

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

const buildNestedJson = (nodes, edges, rootId) => {
  const nodeMap = new Map(nodes.map(node => [node.id, node]));
  const edgeMap = new Map(edges.map(edge => [edge.source, edge.target]));

  const buildNode = (id) => {
    const node = nodeMap.get(id);
    if (!node) return null;

    const nextNodeId = edgeMap.get(id);
    return {
      ...node.data,
      type: node.type,
      next_node: nextNodeId ? buildNode(nextNodeId) : null,
    };
  };

  return buildNode(rootId);
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
          x: nodeToCopy.position.x + 250, // Offset position to avoid overlap
          y: nodeToCopy.position.y + 150,
        },
        data: {
          ...nodeToCopy.data, // Ensure independent data state
        }
      };
      
      setNodes((nds) => [...nds, newNode]);
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
        
        // Log nodes and edges in JSON format
        const nodesJson = nodes.map(node => ({
          id: node.id,
          type: node.type,
          position: node.position,
          data: node.data,
        }));
        
        const edgesJson = updatedEdges.map(edge => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          type: edge.type,
        }));

        console.log('Nodes JSON:', JSON.stringify(nodesJson, null, 2));
        console.log('Edges JSON:', JSON.stringify(edgesJson, null, 2));

        // Assuming '1' is the root node id
        const nestedJson = buildNestedJson(nodes, updatedEdges, '1');
        console.log('Nested JSON:', JSON.stringify(nestedJson, null, 2));

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
