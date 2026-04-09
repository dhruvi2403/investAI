// Simple Random Forest implementation in JavaScript
// For production, consider using ml.js or TensorFlow.js

export class DecisionTree {
  constructor(depth = 5, minSplit = 2) {
    this.depth = depth;
    this.minSplit = minSplit;
    this.tree = null;
  }

  fit(X, y) {
    this.tree = this._buildTree(X, y, 0);
  }

  _buildTree(X, y, currentDepth) {
    if (currentDepth >= this.depth || X.length < this.minSplit || this._isPure(y)) {
      return {
        isLeaf: true,
        prediction: this._majorityClass(y),
      };
    }

    const bestSplit = this._findBestSplit(X, y);
    if (!bestSplit) {
      return {
        isLeaf: true,
        prediction: this._majorityClass(y),
      };
    }

    const { featureIdx, threshold, leftIndices, rightIndices } = bestSplit;

    const leftX = leftIndices.map((i) => X[i]);
    const leftY = leftIndices.map((i) => y[i]);
    const rightX = rightIndices.map((i) => X[i]);
    const rightY = rightIndices.map((i) => y[i]);

    return {
      isLeaf: false,
      featureIdx,
      threshold,
      left: this._buildTree(leftX, leftY, currentDepth + 1),
      right: this._buildTree(rightX, rightY, currentDepth + 1),
    };
  }

  _findBestSplit(X, y) {
    let bestGain = -1;
    let bestSplit = null;

    for (let featureIdx = 0; featureIdx < X[0].length; featureIdx++) {
      const values = X.map((x) => x[featureIdx]).sort((a, b) => a - b);
      const uniqueValues = [...new Set(values)];

      for (const value of uniqueValues) {
        const leftIndices = [];
        const rightIndices = [];

        for (let i = 0; i < X.length; i++) {
          if (X[i][featureIdx] <= value) {
            leftIndices.push(i);
          } else {
            rightIndices.push(i);
          }
        }

        if (leftIndices.length === 0 || rightIndices.length === 0) continue;

        const gain = this._calculateGini(
          y,
          leftIndices,
          rightIndices
        );

        if (gain > bestGain) {
          bestGain = gain;
          bestSplit = { featureIdx, threshold: value, leftIndices, rightIndices };
        }
      }
    }

    return bestSplit;
  }

  _calculateGini(y, leftIndices, rightIndices) {
    const parentGini = this._gini(y);
    const nLeft = leftIndices.length;
    const nRight = rightIndices.length;
    const total = y.length;

    const leftY = leftIndices.map((i) => y[i]);
    const rightY = rightIndices.map((i) => y[i]);

    const leftGini = this._gini(leftY);
    const rightGini = this._gini(rightY);

    const weightedGini = (nLeft / total) * leftGini + (nRight / total) * rightGini;

    return parentGini - weightedGini;
  }

  _gini(y) {
    const counts = {};
    for (const label of y) {
      counts[label] = (counts[label] || 0) + 1;
    }

    let gini = 1;
    for (const count of Object.values(counts)) {
      const p = count / y.length;
      gini -= p * p;
    }

    return gini;
  }

  _isPure(y) {
    return new Set(y).size === 1;
  }

  _majorityClass(y) {
    const counts = {};
    for (const label of y) {
      counts[label] = (counts[label] || 0) + 1;
    }
    return Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b));
  }

  predict(X) {
    return X.map((x) => this._traverse(x, this.tree));
  }

  _traverse(x, node) {
    if (node.isLeaf) {
      return node.prediction;
    }

    if (x[node.featureIdx] <= node.threshold) {
      return this._traverse(x, node.left);
    } else {
      return this._traverse(x, node.right);
    }
  }
}

export class RandomForest {
  constructor(nTrees = 10, maxDepth = 5) {
    this.nTrees = nTrees;
    this.maxDepth = maxDepth;
    this.trees = [];
  }

  fit(X, y) {
    this.featureNames = Array.from({ length: X[0].length }, (_, i) => `feature_${i}`);

    for (let i = 0; i < this.nTrees; i++) {
      const { XBootstrap, yBootstrap } = this._bootstrapSample(X, y);

      const tree = new DecisionTree(this.maxDepth);
      tree.fit(XBootstrap, yBootstrap);
      this.trees.push(tree);
    }

    console.log(`✓ Trained Random Forest with ${this.nTrees} trees`);
  }

  _bootstrapSample(X, y) {
    const n = X.length;
    const indices = [];

    for (let i = 0; i < n; i++) {
      const idx = Math.floor(Math.random() * n);
      indices.push(idx);
    }

    const XBootstrap = indices.map((i) => X[i]);
    const yBootstrap = indices.map((i) => y[i]);

    return { XBootstrap, yBootstrap };
  }

  predict(X) {
    const predictions = this.trees.map((tree) => tree.predict(X));

    // Majority voting
    const finalPredictions = [];
    for (let i = 0; i < X.length; i++) {
      const votes = predictions.map((pred) => pred[i]);
      const counts = {};

      for (const vote of votes) {
        counts[vote] = (counts[vote] || 0) + 1;
      }

      const majority = Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b));
      finalPredictions.push(majority);
    }

    return finalPredictions;
  }

  predictProba(X) {
    const predictions = this.trees.map((tree) => tree.predict(X));
    const proba = [];

    for (let i = 0; i < X.length; i++) {
      const votes = predictions.map((pred) => pred[i]);
      const counts = {};

      for (const vote of votes) {
        counts[vote] = (counts[vote] || 0) + 1;
      }

      const normalized = {};
      for (const [label, count] of Object.entries(counts)) {
        normalized[label] = (count / this.nTrees) * 100;
      }

      proba.push(normalized);
    }

    return proba;
  }

  getFeatureImportance() {
    // Simple importance based on tree depth and splits
    const importance = {};

    for (const featureName of this.featureNames) {
      importance[featureName] = 0;
    }

    // In a real implementation, we'd track feature usage
    // For now, use uniform importance
    for (const featureName of this.featureNames) {
      importance[featureName] = 100 / this.featureNames.length;
    }

    return Object.entries(importance)
      .map(([name, imp]) => ({ feature: name, importance: imp }))
      .sort((a, b) => b.importance - a.importance);
  }
}
