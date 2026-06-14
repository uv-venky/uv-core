import type { ServerTeam } from '@/components/sidebar/types';

export const chatPortal: ServerTeam = {
  name: 'Chat Portal',
  logo: 'MiniLogo',
  teamPath: '/chat',
  modules: [],
  oneLevelNav: [
    {
      title: 'New Chat',
      pagePath: '',
      icon: 'Bot',
      roles: ['admin', 'chat'],
      onClickAction: 'createNewChat',
    },
    {
      title: 'Schedules',
      pagePath: '/schedules',
      icon: 'Calendar',
      roles: ['admin', 'chat'],
      isHidden: () => true,
    },
  ],
};
