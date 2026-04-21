import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it } from 'vitest';
import PartSortSelect from '~/components/parts/PartSortSelect.vue';
import type { SortOption } from '~/types';

describe('PartSortSelect', () => {
  it('renders all four sort options', async () => {
    const wrapper = await mountSuspended(PartSortSelect, {
      props: { modelValue: 'name-asc' as SortOption },
    });
    const options = wrapper.findAll('option');
    expect(options).toHaveLength(4);
  });

  it('includes price-asc option', async () => {
    const wrapper = await mountSuspended(PartSortSelect, {
      props: { modelValue: 'name-asc' as SortOption },
    });
    const values = wrapper.findAll('option').map((o) => o.element.value);
    expect(values).toContain('price-asc');
  });

  it('includes price-desc option', async () => {
    const wrapper = await mountSuspended(PartSortSelect, {
      props: { modelValue: 'name-asc' as SortOption },
    });
    const values = wrapper.findAll('option').map((o) => o.element.value);
    expect(values).toContain('price-desc');
  });

  it('reflects modelValue as the selected option', async () => {
    const wrapper = await mountSuspended(PartSortSelect, {
      props: { modelValue: 'price-desc' as SortOption },
    });
    const select = wrapper.find('select');
    expect((select.element as HTMLSelectElement).value).toBe('price-desc');
  });

  it('emits update:modelValue with the chosen sort option', async () => {
    const wrapper = await mountSuspended(PartSortSelect, {
      props: { modelValue: 'name-asc' as SortOption },
    });
    const select = wrapper.find('select');
    await select.setValue('price-asc');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['price-asc']);
  });
});
