import * as tf from '@tensorflow/tfjs';

// Function to create and train a model
export const trainModel = async (data) => {
  // Example data: { features: [...], labels: [...] }
  const { features, labels } = data;

  // Convert data to tensors
  const featureTensor = tf.tensor2d(features);
  const labelTensor = tf.tensor2d(labels);

  // Define a simple model
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 10, inputShape: [features[0].length], activation: 'relu' }));
  model.add(tf.layers.dense({ units: 1, activation: 'linear' }));

  // Compile the model
  model.compile({
    optimizer: 'adam',
    loss: 'meanSquaredError',
  });

  // Train the model
  await model.fit(featureTensor, labelTensor, {
    epochs: 10,
    batchSize: 32,
  });

  return model;
};

// Function to make predictions
export const makePrediction = (model, inputData) => {
  const inputTensor = tf.tensor2d([inputData]);
  const prediction = model.predict(inputTensor);
  return prediction.dataSync();
};
