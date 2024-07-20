import React, { createContext, useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';

export const ProjectContext = createContext();

const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([
    { id: 1, name: 'IT Audit Project A', description: 'Audit of network security', progress: 30, features: [1, 0, 0, 1] },
    { id: 2, name: 'IT Audit Project B', description: 'Audit of software compliance', progress: 60, features: [0, 1, 1, 0] },
    { id: 3, name: 'IT Audit Project C', description: 'Audit of data privacy policies', progress: 45, features: [1, 1, 0, 0] },
  ]);
  const [model, setModel] = useState(null);

  useEffect(() => {
    const trainModel = async (data) => {
      const { features, labels } = data;

      const featureTensor = tf.tensor2d(features);
      const labelTensor = tf.tensor2d(labels);

      const model = tf.sequential();
      model.add(tf.layers.dense({ units: 10, inputShape: [features[0].length], activation: 'relu' }));
      model.add(tf.layers.dense({ units: 1, activation: 'linear' }));

      model.compile({
        optimizer: 'adam',
        loss: 'meanSquaredError',
      });

      await model.fit(featureTensor, labelTensor, {
        epochs: 10,
        batchSize: 32,
      });

      setModel(model);
    };

    const features = projects.map(project => project.features);
    const labels = projects.map(project => [100 - project.progress]); // Assuming the goal is 100% completion

    trainModel({ features, labels });
  }, [projects]);

  const predictProjectCompletion = (project) => {
    if (!model) return null;

    const inputTensor = tf.tensor2d([project.features]);
    const prediction = model.predict(inputTensor);
    return prediction.dataSync();
  };

  return (
    <ProjectContext.Provider value={{ projects, predictProjectCompletion }}>
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectProvider;