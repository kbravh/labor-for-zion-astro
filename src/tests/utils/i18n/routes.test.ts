import {describe, expect, it} from 'vitest';
import { getRouteTitle } from '../../../utils/i18n/routes';

describe('i18n Routes', () => {
  it('gets the correct route title for English', () => {
    expect(getRouteTitle({locale: 'en', slug: '/notes'})).toEqual('Notes')
  })
  it('gets the correct route title for Spanish', () => {
    expect(getRouteTitle({locale: 'es', slug: '/notes'})).toEqual('Notas')
  })
})
