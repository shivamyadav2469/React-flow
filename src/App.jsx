import React, { useState, useCallback } from 'react';
import Workflow from './Workflow';
import Sidebar from './Sidebar';

function App() {
  const [addNodeFunc, setAddNodeFunc] = useState(null);

  const handleAddNode = useCallback(
    (type) => {
      if (addNodeFunc) {
        addNodeFunc(type);
      }
    },
    [addNodeFunc]
  );

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar component */}
      <Sidebar onAddNode={handleAddNode} />
      
      {/* Workflow component */}
      <div style={{ flex: 1, paddingLeft: '230px' }}>
        <Workflow addNode={setAddNodeFunc} />
      </div>
    </div>
  );
}

export default App;
