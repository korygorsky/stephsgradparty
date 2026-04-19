import { PALETTE } from '@/lib/palette';
import { EVENT_NAME, EVENT_DATE_LABEL, VENUE } from '@/lib/event';
import SectionWrap from './SectionWrap';
import TicketStub from './primitives/TicketStub';

export default function DetailsSection() {
  return (
    <SectionWrap title="The Details" subtitle="here's what you need to know">
      <TicketStub name={EVENT_NAME} date={EVENT_DATE_LABEL} venue={VENUE} />
      <div
        style={{
          marginTop: 16,
          fontFamily: '"Kalam", cursive',
          fontSize: 14,
          color: PALETTE.ink,
          lineHeight: 1.6,
          padding: '0 4px',
        }}
      >
        Food &amp; drinks are à la carte — order whatever looks good, tell your server
        you&apos;re with {EVENT_NAME}&apos;s party. The patio&apos;s ours for the night, so
        linger.
      </div>
    </SectionWrap>
  );
}
