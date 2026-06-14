import type { ServerTeam } from '@/components/sidebar/types';
import { CC_ADMIN_ROLES, CC_BASE_ROLES } from '@/lib/common/cc-constants';

export const commandCenterPortal: ServerTeam = {
  name: 'Command Center',
  logo: 'MiniLogo',
  teamPath: '/command-center',
  modules: [
    {
      title: '',
      modulePath: '/command-center',
      pageGroups: [
        {
          title: 'Settings',
          groupPath: '/settings',
          icon: 'Settings2',
          isExpanded: true,
          pages: [
            {
              title: 'Memories',
              pagePath: '/memories',
              icon: 'MemoryStick',
              roles: CC_ADMIN_ROLES,
            },
            {
              title: 'Skills',
              pagePath: '/skills',
              icon: 'Sparkles',
              roles: CC_ADMIN_ROLES,
            },
            {
              title: 'Knowledge Base',
              pagePath: '/knowledge-base',
              icon: 'BookOpen',
              roles: CC_ADMIN_ROLES,
            },
            {
              title: 'Domains',
              pagePath: '/domains',
              icon: 'Globe',
              roles: CC_ADMIN_ROLES,
            },
            {
              title: 'Domain Schemas',
              pagePath: '/domain-schemas',
              icon: 'Database',
              roles: CC_ADMIN_ROLES,
            },
            {
              title: 'Proposals',
              pagePath: '/proposals',
              icon: 'Inbox',
              roles: CC_ADMIN_ROLES,
            },
            {
              title: 'Business Rules',
              pagePath: '/business-rules',
              icon: 'Scale',
              roles: CC_ADMIN_ROLES,
            },
            {
              title: 'Example Queries',
              pagePath: '/example-queries',
              icon: 'MessageSquareCode',
              roles: CC_ADMIN_ROLES,
            },
            {
              title: 'Schedules',
              pagePath: '/schedules',
              icon: 'CalendarClock',
              roles: CC_ADMIN_ROLES,
            },
          ],
        },
        {
          title: 'Monitoring',
          groupPath: '/monitoring',
          icon: 'Monitor',
          isExpanded: true,
          pages: [
            {
              title: 'Invocations',
              pagePath: '/ai-invocations',
              icon: 'Bot',
              roles: CC_ADMIN_ROLES,
            },
            {
              title: 'Rule Effectiveness',
              pagePath: '/rule-effectiveness',
              icon: 'ChartLine',
              roles: CC_ADMIN_ROLES,
            },
          ],
        },
      ],
    },
  ],
  oneLevelNav: [
    {
      title: 'New Chat',
      pagePath: '',
      icon: 'Command',
      roles: [...CC_BASE_ROLES],
      onClickAction: 'createNewChat',
    },
    {
      title: 'Dashboards',
      pagePath: '/dashboards',
      icon: 'LayoutDashboard',
      roles: [...CC_BASE_ROLES],
    },
  ],
};
