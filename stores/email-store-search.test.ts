import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useEmailStore } from './email-store';
import { DEFAULT_SEARCH_FILTERS } from '@/lib/jmap/search-utils';

const emptyResult = { emails: [], hasMore: false, total: 0 };

function createClient() {
  return {
    searchEmails: vi.fn().mockResolvedValue(emptyResult),
    advancedSearchEmails: vi.fn().mockResolvedValue(emptyResult),
    getSomeEmails: vi.fn().mockResolvedValue([]),
  };
}

describe('email-store global search', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_GLOBAL_SEARCH_ENABLED = 'false';
    useEmailStore.setState({
      emails: [],
      selectedMailbox: 'inbox',
      viewingAccountId: null,
      isUnifiedView: false,
      unifiedRole: null,
      crossView: null,
      searchQuery: '',
      searchFilters: { ...DEFAULT_SEARCH_FILTERS },
      hasMoreEmails: false,
      isLoadingMore: false,
      scheduledSubmissionByEmailId: new Map(),
    });
  });

  it('defaults to the selected mailbox when global search is disabled', async () => {
    const client = createClient();

    await useEmailStore.getState().searchEmails(client as never, 'invoice');

    expect(client.searchEmails).toHaveBeenCalledWith('invoice', 'inbox', undefined, 50, 0);
  });

  it('searches every folder when global search is enabled', async () => {
    const client = createClient();
    process.env.NEXT_PUBLIC_GLOBAL_SEARCH_ENABLED = 'true';

    await useEmailStore.getState().searchEmails(client as never, 'invoice');

    expect(client.searchEmails).toHaveBeenCalledWith('invoice', undefined, undefined, 50, 0);
  });

  it('retains global scope when loading more results', async () => {
    const client = createClient();
    process.env.NEXT_PUBLIC_GLOBAL_SEARCH_ENABLED = 'true';
    useEmailStore.setState({
      searchQuery: 'invoice',
      hasMoreEmails: true,
    });

    await useEmailStore.getState().loadMoreEmails(client as never);

    expect(client.searchEmails).toHaveBeenCalledWith('invoice', undefined, undefined, 50, 0);
  });
});
