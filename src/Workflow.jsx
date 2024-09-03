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
  const edgeMap = new Map();
  edges.forEach(edge => {
    if (!edgeMap.has(edge.source)) {
      edgeMap.set(edge.source, []);
    }
    edgeMap.get(edge.source).push(edge.target);
  });

  const buildNode = (id, visited = new Set()) => {
    const node = nodeMap.get(id);
    if (!node) return null;

    if (visited.has(id)) {
      return { $ref: id };
    }

    visited.add(id);

    const nextNodes = edgeMap.get(id) || [];
    const nextNodesJson = nextNodes.map(nextNodeId => buildNode(nextNodeId, visited));

    let nextNode;
    if (nextNodesJson.length > 0) {
      nextNode = nextNodesJson[0];
    }

    let customType;
    let documentUrl;
    let botTerminate;
    let typeId;
    let timeDelay;
    let context;
    let buttonReply;

    switch (node.type) {
      case 'customNode1':
        customType = 'Image';
        documentUrl = 'https://example.com/image.jpg';
        botTerminate = false;
        break;
      case 'customNode2':
        customType = 'Video';
        typeId = '67890fghij';
        botTerminate = false;
        timeDelay = 10;
        context = {
          type: 'button_reply',
          button_reply: [],
        };
        break;
      default:
        break;
    }

    let newNode;
    if (node.type === 'customNode1') {
      newNode = {
        custom_type: customType,
        document_url: documentUrl,
        bot_terminate: botTerminate,
        next_node: nextNode,
      };
    } else if (node.type === 'customNode2') {
      newNode = {
        type: customType,
        type_id: typeId,
        bot_terminate: botTerminate,
        time_delay: timeDelay,
        context: context,
        next_node: nextNode,
      };
    } else {
      newNode = {
        custom_type: 'Audio',
        text: node.data.title,
        bot_terminate: true,
      };
    }

    if (context && nextNode) {
      context.button_reply.push({
        id: `btn${node.id}`,
        title: node.data.title,
        next_node: nextNode,
      });
    }

    return newNode;
  };

  const rootNode = buildNode(rootId);
  const nestedJson = {
    create_bot_node: [rootNode],
  };

  return nestedJson;
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
        id: `${+new Date()}`, 
        position: {
          x: nodeToCopy.position.x + 250, 
          y: nodeToCopy.position.y + 150,
        },
        data: {
          ...nodeToCopy.data,
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