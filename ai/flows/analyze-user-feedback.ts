'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing user feedback after calls.
 *
 * It identifies common issues and suggests improvements to the matching algorithm or connection quality.
 *
 * @exports analyzeUserFeedback - The main function to analyze user feedback.
 * @exports AnalyzeUserFeedbackInput - The input type for the analyzeUserFeedback function.
 * @exports AnalyzeUserFeedbackOutput - The output type for the analyzeUserFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeUserFeedbackInputSchema = z.object({
  feedback: z
    .string()
    .describe('The user feedback text provided after a call.'),
});

export type AnalyzeUserFeedbackInput = z.infer<typeof AnalyzeUserFeedbackInputSchema>;

const AnalyzeUserFeedbackOutputSchema = z.object({
  summary: z.string().describe('A summary of the feedback provided.'),
  suggestedImprovements: z
    .string()
    .describe(
      'Suggested improvements to the matching algorithm or connection quality based on the feedback.'
    ),
});

export type AnalyzeUserFeedbackOutput = z.infer<typeof AnalyzeUserFeedbackOutputSchema>;

export async function analyzeUserFeedback(input: AnalyzeUserFeedbackInput): Promise<AnalyzeUserFeedbackOutput> {
  return analyzeUserFeedbackFlow(input);
}

const analyzeUserFeedbackPrompt = ai.definePrompt({
  name: 'analyzeUserFeedbackPrompt',
  input: {schema: AnalyzeUserFeedbackInputSchema},
  output: {schema: AnalyzeUserFeedbackOutputSchema},
  prompt: `You are an AI assistant tasked with analyzing user feedback to improve a random stranger calling system.
  Analyze the following user feedback and provide a summary of the feedback and suggest improvements to the matching algorithm or connection quality.
  \nFeedback: {{{feedback}}}
  \nSummary:
  Suggested Improvements: `,
});

const analyzeUserFeedbackFlow = ai.defineFlow(
  {
    name: 'analyzeUserFeedbackFlow',
    inputSchema: AnalyzeUserFeedbackInputSchema,
    outputSchema: AnalyzeUserFeedbackOutputSchema,
  },
  async input => {
    const {output} = await analyzeUserFeedbackPrompt(input);
    return output!;
  }
);
