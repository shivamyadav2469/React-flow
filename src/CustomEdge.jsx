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
          onClick={() => onDelete(id)} // Handle click to remove edge
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
  