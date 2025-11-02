import { useState, useCallback } from 'react';

export const useOptimisticUpdate = (initialData = []) => {
  const [data, setData] = useState(initialData);
  const [pendingActions, setPendingActions] = useState(new Map());

  const optimisticUpdate = useCallback((id, updates, apiCall) => {
    // Immediately update UI
    setData(prev => prev.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ));

    // Track pending action
    const actionId = Date.now();
    setPendingActions(prev => new Map(prev).set(actionId, { id, originalData: data.find(item => item.id === id) }));

    // Perform actual API call
    apiCall()
      .then(() => {
        // Success - remove from pending
        setPendingActions(prev => {
          const newMap = new Map(prev);
          newMap.delete(actionId);
          return newMap;
        });
      })
      .catch((error) => {
        // Error - revert changes
        const action = pendingActions.get(actionId);
        if (action) {
          setData(prev => prev.map(item =>
            item.id === action.id ? action.originalData : item
          ));
        }
        setPendingActions(prev => {
          const newMap = new Map(prev);
          newMap.delete(actionId);
          return newMap;
        });
        throw error;
      });
  }, [data, pendingActions]);

  const optimisticDelete = useCallback((id, apiCall) => {
    const original = data.find(item => item.id === id);

    // Immediately remove from UI
    setData(prev => prev.filter(item => item.id !== id));

    // Perform actual API call
    apiCall()
      .catch((error) => {
        // Error - restore item
        setData(prev => [...prev, original]);
        throw error;
      });
  }, [data]);

  return {
    data,
    setData,
    optimisticUpdate,
    optimisticDelete,
    hasPendingActions: pendingActions.size > 0
  };
};
