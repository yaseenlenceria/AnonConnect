'use server';

import {z} from 'zod';

/**
 * Basic keyword heuristics to summarize user feedback and surface connection improvements.
 * This keeps the deploy buildable on free Render instances without any external AI SDKs.
 */

const KNOWN_ISSUES: Array<{pattern: RegExp; summary: string; suggestion: string}> = [
  {
    pattern: /(drop|disconnect|connection|lag|delay)/i,
    summary: 'connection stability issues',
    suggestion:
      'Review TURN/STUN availability and consider auto-retries with exponential backoff for flaky peers.',
  },
  {
    pattern: /(audio|voice|mic|volume|echo|noise)/i,
    summary: 'audio quality concerns',
    suggestion: 'Normalize microphone gain, echo cancel, and surface device check reminders before pairing.',
  },
  {
    pattern: /(match|matching|preference|country|language)/i,
    summary: 'matching accuracy feedback',
    suggestion:
      'Weight preferred regions/languages higher and decay low quality matches faster when calculating scores.',
  },
  {
    pattern: /(toxic|abuse|report|spam)/i,
    summary: 'safety or moderation flags',
    suggestion: 'Tighten automated moderation, require quick thumbs-up/down, and rotate reported users rapidly.',
  },
];

const AnalyzeUserFeedbackInputSchema = z.object({
  feedback: z
    .string()
    .min(1, 'Feedback text is required to analyze the call experience.')
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

function summarizeFeedback(feedback: string): string {
  const normalized = feedback.replace(/\s+/g, ' ').trim();
  if (!normalized) {
    return 'No feedback text was provided.';
  }

  const sentences = normalized.split(/(?<=[.!?])\s+/).filter(Boolean);
  const baseSummary = sentences.slice(0, 2).join(' ');

  const issue = KNOWN_ISSUES.find(({pattern}) => pattern.test(feedback));
  return issue ? `${baseSummary} The user is mainly experiencing ${issue.summary}.` : baseSummary;
}

function buildSuggestions(feedback: string): string {
  const matches = KNOWN_ISSUES.filter(({pattern}) => pattern.test(feedback));

  if (!matches.length) {
    return 'Keep monitoring feedback trends and consider improving onboarding prompts for clearer reports.';
  }

  return matches
    .map(match => `• ${match.suggestion}`)
    .join('\n');
}

export async function analyzeUserFeedback(
  input: AnalyzeUserFeedbackInput
): Promise<AnalyzeUserFeedbackOutput> {
  const data = AnalyzeUserFeedbackInputSchema.parse(input);

  const summary = summarizeFeedback(data.feedback);
  const suggestedImprovements = buildSuggestions(data.feedback);

  return AnalyzeUserFeedbackOutputSchema.parse({summary, suggestedImprovements});
}
