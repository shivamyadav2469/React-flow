import React, { useCallback, useMemo, useState } from 'react';
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

const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY, style = {}, markerEnd, onDelete }) => {
  const edgePath = getBezierPath({ sourceX, sourceY, targetX, targetY });

  if (!edgePath || edgePath.includes('NaN')) {
    console.error('Invalid edgePath:', edgePath);
    return null;
  }

  return (
    <>
      <path id={id} style={style} className="react-flow__edge-path" d={edgePath} markerEnd={markerEnd} />
      <text
        style={{ fontSize: 12, cursor: 'pointer', userSelect: 'none', fill: '#000' }}
        onClick={() => onDelete(id)}
      >
        <textPath href={`#${id}`} startOffset="50%" textAnchor="middle">
          ❌
        </textPath>
      </text>
    </>
  );
};

const generateUniqueId = () => `id_${Math.random().toString(36).substr(2, 9)}`;

const buildNestedJson = (nodes, edges, rootId) => {
  const nodeMap = new Map(nodes.map(node => [node.id, node]));
  const edgeMap = new Map(edges.map(edge => [edge.source, edge.target]));

  const buildNode = (id) => {
    if (!nodeMap.has(id)) return null;

    const node = nodeMap.get(id);
    const newId = generateUniqueId();
    const nextNodeId = edgeMap.get(id);
    const nextNode = buildNode(nextNodeId);

    const commonProps = {
      id: newId,
      bot_terminate: false,
      next_node: nextNode,
    };

    switch (node.type) {
      case 'customNode1':
        return {
          ...commonProps,
          custom_type: 'Document',
          document_url: 'https://example.com',
        };
      case 'customNode2':
        return {
          ...commonProps,
          type: 'Template',
          type_id: newId,
          context: {
            type: 'button_reply',
            button_reply: [
              { id: 'id1', title: 'Yes', next_node: nextNode },
              { id: 'id2', title: 'No', next_node: nextNode }
            ],
          },
        };
      case 'customNode3':
        return {
          ...commonProps,
          type: 'Interactive',
          type_id: newId,
          context: {
            type: 'button_reply',
            button_reply: [
              { id: 'id1', title: 'Register Now', next_node: nextNode },
              { id: 'id2', title: 'Login', next_node: nextNode },
            ],
          },
        };
      case 'customNode4':
        return {
          ...commonProps,
          type: 'Flow',
          type_id: newId,
          context: {
            type: 'button_reply',
            button_reply: [{ id: 'id1', title: 'Sent', next_node: nextNode }],
          },
        };
      case 'customNode5':
        return {
          ...commonProps,
          type: 'Webhook',
          type_id: newId,
          context: {
            type: 'button_reply',
            button_reply: [{ id: 'id1', title: 'Action Completed', next_node: nextNode }],
          },
        };
      default:
        return { id: newId, type: 'Unknown', bot_terminate: true };
    }
  };

  return { create_bot_node: [buildNode(rootId)] };
};

// Function to print nested JSON nodes
const printNestedNodes = (node, depth = 0) => {
  if (!node) return;

  console.log(' '.repeat(depth * 2) + `Node ID: ${node.id}, Type: ${node.type}, Custom Type: ${node.custom_type || 'N/A'}`);
  if (node.next_node) {
    printNestedNodes(node.next_node, depth + 1);
  }
};

export default function Workflow({ addNode }) {
  const initialNodes = [
    { id: '1', type: 'customNode1', position: { x: 100, y: 100 }, data: { title: 'Node 1' } },
    { id: '2', type: 'customNode2', position: { x: 400, y: 100 }, data: { title: 'Node 2' } },
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
    setNodes(nds => nds.concat(newNode));
  }, [setNodes]);

  const handleCopyNode = useCallback((nodeId) => {
    const nodeToCopy = nodes.find(node => node.id === nodeId);
    if (nodeToCopy) {
      const newNode = {
        ...nodeToCopy,
        id: `${+new Date()}`,
        position: { x: nodeToCopy.position.x + 250, y: nodeToCopy.position.y + 150 },
      };
      setNodes(nds => [...nds, newNode]);
    }
  }, [nodes, setNodes]);

  const handleDeleteNode = useCallback((nodeId) => {
    setNodes(nds => nds.filter(node => node.id !== nodeId));
  }, [setNodes]);

  const handleDeleteEdge = useCallback((edgeId) => {
    setEdges(eds => eds.filter(edge => edge.id !== edgeId));
  }, [setEdges]);

  const onConnect = useCallback(
    (params) => {
      setEdges(eds => {
        const updatedEdges = addEdge({ ...params, type: 'custom' }, eds);
        
        const nodesJson = nodes.map(({ id, type, position, data }) => ({
          id, type, position, data
        }));
        
        const edgesJson = updatedEdges.map(({ id, source, target, type }) => ({
          id, source, target, type
        }));

        console.log('Nodes JSON:', JSON.stringify(nodesJson, null, 2));
        console.log('Edges JSON:', JSON.stringify(edgesJson, null, 2));

        const nestedJson = buildNestedJson(nodes, updatedEdges, '1');
        console.log('Nested JSON:', JSON.stringify(nestedJson, null, 2));

        // Print nested nodes
        if (nestedJson.create_bot_node && nestedJson.create_bot_node[0]) {
          printNestedNodes(nestedJson.create_bot_node[0]);
        }

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
