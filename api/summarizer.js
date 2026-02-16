// api/summarizer.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY;

  try {
    // Calling Gemini 1.5 Flash (Fast and efficient for summaries)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a professional research assistant. 
                     Summarize the following document text into clear, 
                     high-impact bullet points with a brief conclusion: \n\n ${text}`
            }]
          }]
        })
      }
    );

    const data = await response.json();
    
    // Gemini returns data in a specific nested structure
    const summary = data.candidates[0].content.parts[0].text;
    
    res.status(200).json({ summary });
  } catch (error) {
    console.error("Gemini Bridge Error:", error);
    res.status(500).json({ error: 'Failed to reach Neural Engine' });
  }
}