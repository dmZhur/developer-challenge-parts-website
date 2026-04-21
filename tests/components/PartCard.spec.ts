import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it } from 'vitest';
import PartCard from '~/components/parts/PartCard.vue';
import type { Part } from '~/types';

const mockPart: Part = {
  id: 'p1',
  name: 'DAF XF 106 Sideskirt Set',
  oem: '2119711',
  brand: 'DAF',
  condition: 'used',
  price: 795,
  inStock: true,
  category: 'Body',
  image: '/img/placeholder-part.svg',
};

describe('PartCard', () => {
  it('renders the part name', async () => {
    const wrapper = await mountSuspended(PartCard, { props: { part: mockPart } });
    expect(wrapper.text()).toContain('DAF XF 106 Sideskirt Set');
  });

  it('renders the OEM number', async () => {
    const wrapper = await mountSuspended(PartCard, { props: { part: mockPart } });
    expect(wrapper.text()).toContain('2119711');
  });

  it('renders the brand', async () => {
    const wrapper = await mountSuspended(PartCard, { props: { part: mockPart } });
    expect(wrapper.text()).toContain('DAF');
  });

  it('renders the formatted price', async () => {
    const wrapper = await mountSuspended(PartCard, { props: { part: mockPart } });
    expect(wrapper.text()).toContain('795');
  });

  it('shows In Stock badge when inStock is true', async () => {
    const wrapper = await mountSuspended(PartCard, { props: { part: mockPart } });
    expect(wrapper.text()).toContain('In Stock');
  });

  it('shows Out of Stock badge when inStock is false', async () => {
    const wrapper = await mountSuspended(PartCard, {
      props: { part: { ...mockPart, inStock: false } },
    });
    expect(wrapper.text()).toContain('Out of Stock');
  });

  it('disables Add to Quote button when out of stock', async () => {
    const wrapper = await mountSuspended(PartCard, {
      props: { part: { ...mockPart, inStock: false } },
    });
    const disabled = wrapper.find('[disabled]');
    expect(disabled.exists()).toBe(true);
  });

  it('renders a link to the detail page', async () => {
    const wrapper = await mountSuspended(PartCard, { props: { part: mockPart } });
    const link = wrapper.find('a[href="/parts/p1"]');
    expect(link.exists()).toBe(true);
  });

  it('renders the condition label', async () => {
    const wrapper = await mountSuspended(PartCard, { props: { part: mockPart } });
    expect(wrapper.text()).toContain('Used');
  });

  it('renders a new condition label', async () => {
    const wrapper = await mountSuspended(PartCard, {
      props: { part: { ...mockPart, condition: 'new' } },
    });
    expect(wrapper.text()).toContain('New');
  });
});
