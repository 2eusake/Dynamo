import * as tf from '@tensorflow/tfjs';

// Function to preprocess the data
const preprocessData = (features) => {
  // Example normalization process
  const normalizedFeatures = features.map(feature => {
    return feature.map(value => (value - Math.min(...feature)) / (Math.max(...feature) - Math.min(...feature)));
  });
  return normalizedFeatures;
};

// Function to create and train a model
export const trainModel = async (data) => {
  const { features, labels } = data;

  // Preprocess the features
  const processedFeatures = preprocessData(features);

  // Convert data to tensors
  const featureTensor = tf.tensor2d(processedFeatures);
  const labelTensor = tf.tensor2d(labels);

  // Define a more complex model
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 32, inputShape: [processedFeatures[0].length], activation: 'relu' }));
  model.add(tf.layers.dense({ units: 16, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 1, activation: 'linear' }));

  // Compile the model
  model.compile({
    optimizer: 'adam',
    loss: 'meanSquaredError',
  });

  // Train the model
  await model.fit(featureTensor, labelTensor, {
    epochs: 50,  // Increase the number of epochs
    batchSize: 32,
  });

  // Save the model if needed
  // await model.save('localstorage://my-model');

  return model;
};

// Function to make predictions
export const makePrediction = (model, inputData) => {
  const inputTensor = tf.tensor2d([inputData]);
  const prediction = model.predict(inputTensor);
  return prediction.dataSync();
};
