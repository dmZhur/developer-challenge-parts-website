import { mountSuspended } from '@nuxt/test-utils/runtime';
import { beforeEach, describe, expect, it } from 'vitest';
import QuoteItem from '~/components/quote/QuoteItem.vue';
import type { QuoteItem as QuoteItemType } from '~/types';

const mockItem: QuoteItemType = {
  part: {
    id: 'p1',
    name: 'DAF XF 106 Sideskirt Set',
    oem: '2119711',
    brand: 'DAF',
    condition: 'used',
    price: 795,
    inStock: true,
    category: 'Body',
    image: '/img/placeholder-part.svg',
  },
  quantity: 2,
};

describe('QuoteItem', () => {
  beforeEach(() => {
    const { clearQuote } = useQuote();
    clearQuote();
  });

  it('renders the part name', async () => {
    const wrapper = await mountSuspended(QuoteItem, { props: { item: mockItem } });
    expect(wrapper.text()).toContain('DAF XF 106 Sideskirt Set');
  });

  it('renders the OEM number', async () => {
    const wrapper = await mountSuspended(QuoteItem, { props: { item: mockItem } });
    expect(wrapper.text()).toContain('2119711');
  });

  it('renders the current quantity', async () => {
    const wrapper = await mountSuspended(QuoteItem, { props: { item: mockItem } });
    expect(wrapper.text()).toContain('2');
  });

  it('renders the line subtotal (price × quantity)', async () => {
    const wrapper = await mountSuspended(QuoteItem, { props: { item: mockItem } });
    // 795 × 2 = 1590, formatted as "1,590"
    expect(wrapper.text()).toContain('1,590');
  });

  it('renders the unit price', async () => {
    const wrapper = await mountSuspended(QuoteItem, { props: { item: mockItem } });
    expect(wrapper.text()).toContain('795');
  });

  it('renders the unit price hint with "ea" label', async () => {
    const wrapper = await mountSuspended(QuoteItem, { props: { item: mockItem } });
    expect(wrapper.text()).toContain('ea');
  });

  it('has an accessible remove button', async () => {
    const wrapper = await mountSuspended(QuoteItem, { props: { item: mockItem } });
    expect(wrapper.find('[aria-label="Remove from quote"]').exists()).toBe(true);
  });

  it('has an accessible decrease-quantity button', async () => {
    const wrapper = await mountSuspended(QuoteItem, { props: { item: mockItem } });
    expect(wrapper.find('[aria-label="Decrease quantity"]').exists()).toBe(true);
  });

  it('has an accessible increase-quantity button', async () => {
    const wrapper = await mountSuspended(QuoteItem, { props: { item: mockItem } });
    expect(wrapper.find('[aria-label="Increase quantity"]').exists()).toBe(true);
  });

  it('removes the item from the quote when remove button is clicked', async () => {
    const { addToQuote, items } = useQuote();
    addToQuote(mockItem.part);
    const wrapper = await mountSuspended(QuoteItem, { props: { item: mockItem } });
    await wrapper.find('[aria-label="Remove from quote"]').trigger('click');
    expect(items.value).toHaveLength(0);
  });
});
