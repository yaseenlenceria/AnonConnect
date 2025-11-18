'use server';

import { analyzeUserFeedback, AnalyzeUserFeedbackOutput } from '@/ai/flows/analyze-user-feedback';

export async function submitFeedback(
  currentState: AnalyzeUserFeedbackOutput | null,
  formData: FormData
): Promise<AnalyzeUserFeedbackOutput | null> {
  const feedback = formData.get('feedback') as string;
  if (!feedback) {
    // You could return an error message here
    return null;
  }

  try {
    const analysis = await analyzeUserFeedback({ feedback });
    return analysis;
  } catch (error) {
    console.error("Error analyzing feedback:", error);
    // You could return an error message here
    return null;
  }
}
