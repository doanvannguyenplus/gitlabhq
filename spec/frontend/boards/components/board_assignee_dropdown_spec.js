import { mount } from '@vue/test-utils';
import { GlDropdownItem, GlAvatarLink, GlAvatarLabeled } from '@gitlab/ui';
import BoardAssigneeDropdown from '~/boards/components/board_assignee_dropdown.vue';
import IssuableAssignees from '~/sidebar/components/assignees/issuable_assignees.vue';
import AssigneesDropdown from '~/vue_shared/components/sidebar/assignees_dropdown.vue';
import BoardEditableItem from '~/boards/components/sidebar/board_editable_item.vue';
import store from '~/boards/stores';
import getIssueParticipants from '~/vue_shared/components/sidebar/queries/getIssueParticipants.query.graphql';
import { participants } from '../mock_data';

describe('BoardCardAssigneeDropdown', () => {
  let wrapper;
  const iid = '111';
  const activeIssueName = 'test';
  const anotherIssueName = 'hello';

  const createComponent = () => {
    wrapper = mount(BoardAssigneeDropdown, {
      data() {
        return {
          selected: store.getters.getActiveIssue.assignees,
          participants,
        };
      },
      store,
      provide: {
        canUpdate: true,
        rootPath: '',
      },
    });
  };

  const unassign = async () => {
    wrapper.find('[data-testid="unassign"]').trigger('click');

    await wrapper.vm.$nextTick();
  };

  const openDropdown = async () => {
    wrapper.find('[data-testid="edit-button"]').trigger('click');

    await wrapper.vm.$nextTick();
  };

  const findByText = text => {
    return wrapper.findAll(GlDropdownItem).wrappers.find(x => x.text().indexOf(text) === 0);
  };

  beforeEach(() => {
    store.state.activeId = '1';
    store.state.issues = {
      '1': {
        iid,
        assignees: [{ username: activeIssueName, name: activeIssueName, id: activeIssueName }],
      },
    };

    jest.spyOn(store, 'dispatch').mockResolvedValue();
  });

  afterEach(() => {
    wrapper.destroy();
    wrapper = null;
  });

  describe('when mounted', () => {
    beforeEach(() => {
      createComponent();
    });

    it.each`
      text
      ${anotherIssueName}
      ${activeIssueName}
    `('finds item with $text', ({ text }) => {
      const item = findByText(text);

      expect(item.exists()).toBe(true);
    });

    it('renders gl-avatar-link in gl-dropdown-item', () => {
      const item = findByText('hello');

      expect(item.find(GlAvatarLink).exists()).toBe(true);
    });

    it('renders gl-avatar-labeled in gl-avatar-link', () => {
      const item = findByText('hello');

      expect(
        item
          .find(GlAvatarLink)
          .find(GlAvatarLabeled)
          .exists(),
      ).toBe(true);
    });
  });

  describe('when selected users are present', () => {
    it('renders a divider', () => {
      createComponent();

      expect(wrapper.find('[data-testid="selected-user-divider"]').exists()).toBe(true);
    });
  });

  describe('when collapsed', () => {
    it('renders IssuableAssignees', () => {
      createComponent();

      expect(wrapper.find(IssuableAssignees).isVisible()).toBe(true);
      expect(wrapper.find(AssigneesDropdown).isVisible()).toBe(false);
    });
  });

  describe('when dropdown is open', () => {
    beforeEach(async () => {
      createComponent();

      await openDropdown();
    });

    it('shows assignees dropdown', async () => {
      expect(wrapper.find(IssuableAssignees).isVisible()).toBe(false);
      expect(wrapper.find(AssigneesDropdown).isVisible()).toBe(true);
    });

    it('shows the issue returned as the activeIssue', async () => {
      expect(findByText(activeIssueName).props('isChecked')).toBe(true);
    });

    describe('when "Unassign" is clicked', () => {
      it('unassigns assignees', async () => {
        await unassign();

        expect(findByText('Unassign').props('isChecked')).toBe(true);
      });
    });

    describe('when an unselected item is clicked', () => {
      beforeEach(async () => {
        await unassign();
      });

      it('assigns assignee in the dropdown', async () => {
        wrapper.find('[data-testid="item_test"]').trigger('click');

        await wrapper.vm.$nextTick();

        expect(findByText(activeIssueName).props('isChecked')).toBe(true);
      });

      it('calls setAssignees with username list', async () => {
        wrapper.find('[data-testid="item_test"]').trigger('click');

        await wrapper.vm.$nextTick();

        document.body.click();

        await wrapper.vm.$nextTick();

        expect(store.dispatch).toHaveBeenCalledWith('setAssignees', [activeIssueName]);
      });
    });

    describe('when the user off clicks', () => {
      beforeEach(async () => {
        await unassign();

        document.body.click();

        await wrapper.vm.$nextTick();
      });

      it('calls setAssignees with username list', async () => {
        expect(store.dispatch).toHaveBeenCalledWith('setAssignees', []);
      });

      it('closes the dropdown', async () => {
        expect(wrapper.find(IssuableAssignees).isVisible()).toBe(true);
      });
    });
  });

  it('renders divider after unassign', () => {
    createComponent();

    expect(wrapper.find('[data-testid="unassign-divider"]').exists()).toBe(true);
  });

  it.each`
    assignees                                                                 | expected
    ${[{ id: 5, username: '', name: '' }]}                                    | ${'Assignee'}
    ${[{ id: 6, username: '', name: '' }, { id: 7, username: '', name: '' }]} | ${'2 Assignees'}
  `(
    'when assignees have a length of $assignees.length, it renders $expected',
    ({ assignees, expected }) => {
      store.state.issues['1'].assignees = assignees;

      createComponent();

      expect(wrapper.find(BoardEditableItem).props('title')).toBe(expected);
    },
  );

  describe('Apollo Schema', () => {
    beforeEach(() => {
      createComponent();
    });

    it('returns the correct query', () => {
      expect(wrapper.vm.$options.apollo.participants.query).toEqual(getIssueParticipants);
    });

    it('contains the correct variables', () => {
      const { variables } = wrapper.vm.$options.apollo.participants;
      const boundVariable = variables.bind(wrapper.vm);

      expect(boundVariable()).toEqual({ id: 'gid://gitlab/Issue/111' });
    });

    it('returns the correct data from update', () => {
      const node = { test: 1 };
      const { update } = wrapper.vm.$options.apollo.participants;

      expect(update({ issue: { participants: { nodes: [node] } } })).toEqual([node]);
    });
  });
});
