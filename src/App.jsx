import React, { useState, useCallback } from 'react';
import Workflow from './Workflow';
import Sidebar from './Sidebar';
import ErrorBoundary from './ErrorBoundary';

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
      <Sidebar onAddNode={handleAddNode} />
      
      <div style={{ flex: 1, paddingLeft: '230px' }}>
      {/* <ErrorBoundary>
        <Workflow addNode={setAddNodeFunc} />
        </ErrorBoundary> */}
        <Workflow addNode={setAddNodeFunc} />

      </div>
    </div>
  );
}

export default App;
