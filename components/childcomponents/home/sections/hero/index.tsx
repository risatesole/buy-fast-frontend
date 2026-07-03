import { HeroHeadline as Headline } from './HeroHeadline';

import { HeroPreheadline as Preheadline } from './HeroPreheadline';

type HeroSectionProps = {
  headline: string;
  preheadline: string;
};

export function HeroSection({ headline, preheadline }: HeroSectionProps) {
  return (
    <section
      style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '5rem 2rem 4rem',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '4rem',
        alignItems: 'end',
        borderBottom: '1px solid oklch(0.922 0 0)',
      }}
    >
      <div>
        <Preheadline text={preheadline} />
        <Headline text={headline} />
      </div>
    </section>
  );
}
