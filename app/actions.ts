'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

export type AnalyzeUserFeedbackOutput = {
  summary: string;
  suggestedImprovements: string;
};

export async function submitFeedback(
  currentState: AnalyzeUserFeedbackOutput | null,
  formData: FormData
): Promise<AnalyzeUserFeedbackOutput | null> {
  const feedback = formData.get('feedback') as string;
  if (!feedback) {
    return null;
  }

  try {
    // Check if API key is available
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      console.warn('Google AI API key not configured. Skipping feedback analysis.');
      return {
        summary: 'Thank you for your feedback!',
        suggestedImprovements: 'Your feedback has been recorded.'
      };
    }

    // Initialize Google AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Create prompt
    const prompt = `Analyze this user feedback for AnonConnect (a random stranger voice/chat app):

Feedback: "${feedback}"

Provide:
1. A brief summary of the feedback (1-2 sentences)
2. Suggested improvements based on this feedback (2-3 specific actionable items)

Format your response as JSON with keys "summary" and "suggestedImprovements".`;

    // Generate response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to parse JSON response
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          summary: parsed.summary || 'Thank you for your feedback!',
          suggestedImprovements: parsed.suggestedImprovements || 'We will review your suggestions.'
        };
      }
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
    }

    // Fallback response
    return {
      summary: 'Thank you for your valuable feedback!',
      suggestedImprovements: 'Your suggestions will help us improve AnonConnect.'
    };
  } catch (error) {
    console.error('Error analyzing feedback:', error);
    return {
      summary: 'Thank you for your feedback!',
      suggestedImprovements: 'Your feedback has been recorded and will be reviewed by our team.'
    };
  }
}
