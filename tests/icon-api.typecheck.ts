import type { ComponentProps } from 'react';
import type { AppIcon } from '../src/components/AppIcon';

// tsc verifies the public API rejects library names, arbitrary colors and sizes.
type Props = ComponentProps<typeof AppIcon>;
const valid: Props = { name: 'week', size: 24, tone: 'primary', state: 'selected' };
// @ts-expect-error Library-specific names are not part of the app API.
const invalidName: Props = { name: 'CalendarDays' };
// @ts-expect-error Colors must be semantic token names.
const invalidTone: Props = { name: 'shopping', tone: '#F28C45' };
// @ts-expect-error Sizes must follow the shared scale.
const invalidSize: Props = { name: 'settings', size: 27 };
void [valid, invalidName, invalidTone, invalidSize];
