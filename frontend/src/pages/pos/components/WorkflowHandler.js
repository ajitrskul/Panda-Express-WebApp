import React from "react";

function WorkflowHandler({
  currentWorkflow,
  workflowStep,
  onStepChange,
  onReset,
  menuEndpoint,
}) {
  if (!currentWorkflow) return null;

  const handleNextStep = () => {
    const steps = currentWorkflow.steps || [];
    if (workflowStep < steps.length - 1) {
      onStepChange(workflowStep + 1, steps[workflowStep + 1]);
    } else {
      onReset(); 
    }
  };

  return (
    <div>
      <h4>Current Workflow: {currentWorkflow.name}</h4>
      <button onClick={handleNextStep}>Next Step</button>
    </div>
  );
}

export default WorkflowHandler;
