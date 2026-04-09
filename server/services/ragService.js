import RAGDocument from '../models/RAGDocument.js';

export class SimpleEmbeddingService {
  // Simple embedding: hash-based vector (for demonstration)
  static createEmbedding(text) {
    const embedding = new Array(384).fill(0);

    // Simple approach: hash each word and distribute across vector
    const words = text.toLowerCase().split(/\s+/);

    for (const word of words) {
      let hash = 0;
      for (let i = 0; i < word.length; i++) {
        hash = ((hash << 5) - hash) + word.charCodeAt(i);
        hash = hash & hash; // Convert to 32-bit integer
      }

      const idx = Math.abs(hash) % 384;
      embedding[idx] += 1 / words.length;
    }

    // Normalize
    const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    if (norm > 0) {
      for (let i = 0; i < embedding.length; i++) {
        embedding[i] /= norm;
      }
    }

    return embedding;
  }

  // Cosine similarity
  static cosineSimilarity(embedding1, embedding2) {
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < embedding1.length; i++) {
      dotProduct += embedding1[i] * embedding2[i];
      norm1 += embedding1[i] * embedding1[i];
      norm2 += embedding2[i] * embedding2[i];
    }

    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2) || 1);
  }
}

export class RAGService {
  static async ingestDocuments(documents) {
    const ingested = [];

    for (const doc of documents) {
      const embedding = SimpleEmbeddingService.createEmbedding(doc.content);

      const ragDoc = new RAGDocument({
        title: doc.title,
        content: doc.content,
        category: doc.category || 'documentation',
        embedding,
        source: doc.source,
        keywords: this._extractKeywords(doc.content),
      });

      await ragDoc.save();
      ingested.push(ragDoc);
    }

    console.log(`✓ Ingested ${ingested.length} documents into RAG database`);
    return ingested;
  }

  static _extractKeywords(text, limit = 5) {
    // Simple keyword extraction: split and count
    const words = text
      .toLowerCase()
      .match(/\b\w+\b/g)
      .filter((word) => word.length > 3);

    const freq = {};
    for (const word of words) {
      freq[word] = (freq[word] || 0) + 1;
    }

    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map((entry) => entry[0]);
  }

  static async retrieveRelevantDocuments(query, topK = 5) {
    const queryEmbedding = SimpleEmbeddingService.createEmbedding(query);

    // Retrieve all documents with embeddings
    const documents = await RAGDocument.find().lean();

    if (documents.length === 0) {
      return [];
    }

    // Calculate similarity scores
    const scored = documents
      .map((doc) => ({
        ...doc,
        similarity: SimpleEmbeddingService.cosineSimilarity(
          queryEmbedding,
          doc.embedding || []
        ),
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);

    return scored;
  }

  static async generateResponse(query, userContext = null) {
    const relevantDocs = await this.retrieveRelevantDocuments(query, 3);

    if (relevantDocs.length === 0) {
      return {
        response: "I couldn't find relevant information about your query. Please try rephrasing or ask about financial concepts, investment strategies, or our platform features.",
        confidence: 0,
        sources: [],
      };
    }

    // Build context from retrieved documents
    const context = relevantDocs
      .map((doc) => `[${doc.category}] ${doc.content}`)
      .join('\n\n');

    // Generate response (simple template-based approach)
    const response = this._generateTemplateResponse(query, relevantDocs, userContext);

    return {
      response,
      confidence: Math.min(95, relevantDocs[0].similarity * 100),
      sources: relevantDocs.map((doc) => ({
        title: doc.title,
        category: doc.category,
        relevance: (doc.similarity * 100).toFixed(2),
      })),
    };
  }

  static _generateTemplateResponse(query, docs, userContext) {
    const lowerQuery = query.toLowerCase();

    // Rule-based conversational responses
    if (lowerQuery.includes('portfolio') || lowerQuery.includes('asset')) {
      return `Portfolio management involves diversifying your assets. According to our knowledge base on "${docs[0]?.title}": ${docs[0]?.content}. It's best to maintain a strict balance.`;
    }

    if (lowerQuery.includes('risk') || lowerQuery.includes('conservative')) {
      return `For your specific risk profile (${userContext?.riskProfile || 'Moderate'}): We recommend maintaining a balanced approach utilizing safe growth stocks and bonds simultaneously.`;
    }

    if (lowerQuery.includes('market') && (lowerQuery.includes('trend') || lowerQuery.includes('loss') || lowerQuery.includes('profit'))) {
      return `Market trends are inherently volatile. Instead of focusing on daily losses or profits, ${docs[0]?.title ? `our guide on "${docs[0].title}" suggests:` : 'we recommend:'} maintaining strict dollar-cost averaging and a diversified long-term portfolio focus. Here's a brief detail: ${docs[0]?.content}`;
    }

    if (lowerQuery.includes('recommendation') || lowerQuery.includes('suggest')) {
      return `Based on recent market conditions and your calculated profile, the InvestAI framework continuously suggests focusing on diversified index funds aligned with your age timeline.`;
    }

    // Default response using context naturally
    if (docs[0]?.content) {
      return `I found a relevant resource titled "${docs[0].title}". Here is the core insight: ${docs[0].content}`;
    }

    return 'I understand your question. Based on available analytical data, I recommend consulting the AI Insights tool for specific asset trends!';
  }

  static async initializeDefaultDocuments() {
    const existingCount = await RAGDocument.countDocuments();

    if (existingCount > 0) {
      return;
    }

    const defaultDocs = [
      {
        title: 'What is Portfolio Diversification?',
        content:
          'Portfolio diversification is a risk management strategy that involves spreading investments across different asset classes, sectors, and geographies. By holding a mix of stocks, bonds, real estate, and commodities, investors can reduce the impact of any single investment underperforming. Diversification does not guarantee profits or protect against losses, but it helps balance risk and return.',
        category: 'faq',
        source: 'platform',
      },
      {
        title: 'Understanding Risk Profiles',
        content:
          'An investor risk profile categorizes investors into Conservative, Moderate, and Aggressive based on their age, income, investment horizon, and risk tolerance. Conservative investors prioritize capital preservation and prefer stable, low-volatility investments. Moderate investors seek balance between growth and stability. Aggressive investors aim for maximum capital appreciation and tolerate higher volatility.',
        category: 'knowledge-base',
        source: 'platform',
      },
      {
        title: 'How to Read Technical Indicators',
        content:
          'Technical indicators like RSI (Relative Strength Index), MACD, and Moving Averages help traders identify market trends and potential entry/exit points. RSI above 70 suggests an asset is overbought (may decline), while RSI below 30 suggests it is oversold (may rise). MACD shows momentum shifts, and moving averages reveal trend direction.',
        category: 'knowledge-base',
        source: 'platform',
      },
      {
        title: 'Tax-Efficient Investing',
        content:
          'Tax efficiency in investing means structuring your portfolio to minimize tax liability. Strategies include holding assets for over a year to qualify for long-term capital gains rates, using tax-loss harvesting to offset gains, and investing in tax-advantaged accounts like 401(k)s and IRAs.',
        category: 'tax-rules',
        source: 'platform',
      },
      {
        title: 'Dollar-Cost Averaging Strategy',
        content:
          'Dollar-cost averaging (DCA) is investing a fixed amount regularly (e.g., monthly) regardless of market price. This strategy reduces the impact of market volatility and helps avoid the temptation to time the market. Over time, you buy more shares when prices are low and fewer when prices are high, averaging your purchase price.',
        category: 'documentation',
        source: 'platform',
      },
    ];

    await this.ingestDocuments(defaultDocs);
  }
}

export default RAGService;
