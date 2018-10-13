export default [
  {
    id: 1,
    userId: 1,
    albumType: 3,
    themeId: 1,
    name: '婚礼',
    avatar: 'hunli',
    activityTime: Date.now(),
    location: `I don't konw`,
    createdAt: Date.now(),
    expiredAt: Date.now() + 30 * 24 * 60 * 60 * 1000
  },
  {
    id: 2,
    userId: 1,
    albumType: 2,
    themeId: 1,
    name: '公司年会',
    avatar: 'gong si nian hui',
    activityTime: Date.now(),
    location: `I don't konw`,
    interactive: {
      comment: false,
      like: false,
      photoMessage: true,
      hotPhoto: false
    },
    createdAt: Date.now() - 400 * 24 * 60 * 60 * 1000,
    expiredAt: Date.now() - 370 * 24 * 60 * 60 * 1000
  },
  {
    id: 3,
    userId: 1,
    albumType: 1,
    themeId: 1,
    name: '同学会',
    avatar: '同学会',
    activityTime: Date.now(),
    location: `I don't konw`,
    createdAt: Date.now() - 50 * 24 * 60 * 60 * 1000,
    expiredAt: Date.now() + 1050 * 24 * 60 * 60 * 1000
  }
];
