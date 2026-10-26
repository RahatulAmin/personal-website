export const publicationStatuses = ['published', 'in_press', 'under_review', 'in_preparation', 'completed'] as const;

export type PublicationStatus = (typeof publicationStatuses)[number];

export const publicationStatusMeta: Record<PublicationStatus, { label: string; tone: string }> = {
  published: { label: 'Published', tone: 'green' },
  in_press: { label: 'In press', tone: 'blue' },
  under_review: { label: 'Under review', tone: 'amber' },
  in_preparation: { label: 'In preparation', tone: 'grey' },
  completed: { label: 'Completed', tone: 'grey' },
};
