export const chatPortal = {
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
//# sourceMappingURL=chat.js.map