import { FAQ } from '@/types';

// Product-page evidence: key trials as "vs placebo" bars, an honest "what to expect" timeline and extra FAQs.
// Numbers come only from sources already verified for the ingredient guide (lib/guides.ts), never from unchecked
// research reports. Changes are shown as magnitudes ("fell by"), so bigger bars mean a bigger effect.

export interface TrialResult {
  label: string;
  unit: '%' | 'min';
  ours: number;
  placebo: number;
}
export interface Trial {
  title: string;
  design: string;
  results: TrialResult[];
  note?: string;
  source: { label: string; url: string };
}
export interface ProductEvidence {
  arm: string; // legend label for the active group
  trials: Trial[];
  caveat: string;
  timeline: { when: string; text: string }[];
  faqs: FAQ[];
}

export const EVIDENCE: Record<string, ProductEvidence> = {
  ashwagandha: {
    arm: 'KSM-66, 600 mg a day',
    trials: [
      {
        title: 'Stress and cortisol',
        design: '64 adults with chronic stress, 60 days, randomized and placebo-controlled',
        results: [
          { label: 'Perceived stress score fell by', unit: '%', ours: 44, placebo: 5.5 },
          { label: 'Blood cortisol fell by', unit: '%', ours: 27.9, placebo: 7.9 },
        ],
        source: { label: 'Chandrasekhar et al., Indian Journal of Psychological Medicine, 2012', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3573577/' },
      },
      {
        title: 'Falling asleep (adults with insomnia)',
        design: '60 adults with insomnia, 10 weeks, randomized and placebo-controlled',
        results: [{ label: 'Time to fall asleep fell by', unit: 'min', ours: 13, placebo: 8 }],
        note: 'From about 42 to 29 minutes, versus 42 to 34 with placebo. Total sleep time was not significantly different.',
        source: { label: 'Langade et al., Cureus, 2019', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6827862/' },
      },
    ],
    caveat:
      'These trials were small, short and mostly run in India, often with extract supplied by the manufacturer. A 2025 meta-analysis found cortisol fell, but the change in perceived stress was not statistically significant.',
    timeline: [
      { when: 'Weeks 1–2', text: 'Take 2 capsules a day with food. Most people notice little at first, which is expected.' },
      { when: 'Weeks 4–8', text: 'The stress and cortisol results above were measured after 60 days of daily use.' },
      { when: 'Week 10', text: 'In the insomnia trial, people fell asleep about 5 minutes faster than with placebo after 10 weeks.' },
      { when: 'After 12 weeks', text: 'Safety beyond about 3 months hasn’t been well studied. Take a break, or check in with your doctor.' },
    ],
    faqs: [
      {
        q: 'Does ashwagandha cause emotional numbness?',
        a: 'Some people describe feeling flat or less motivated in online forums. Clinical trials haven’t measured this, so nobody knows how common it is. If you notice it, stop taking it and talk to your doctor.',
      },
      {
        q: 'Should I cycle ashwagandha?',
        a: 'No trial has tested a particular cycle. Studies lasted up to about 3 months and longer-term safety hasn’t been well studied, so many people take a break after 8–12 weeks.',
      },
      {
        q: 'Should I take it in the morning or at night?',
        a: 'Trials gave it once or twice a day. Drowsiness is a possible side effect, so some people prefer the evening. Take it with food.',
      },
      {
        q: 'What are the warning signs of a liver problem?',
        a: 'Liver injury from ashwagandha is rare. Stop taking it and see a doctor if you notice yellow skin or eyes, dark urine, pale stools, itching or unusual tiredness.',
      },
    ],
  },
};

export const evidenceFor = (slug: string) => EVIDENCE[slug];
