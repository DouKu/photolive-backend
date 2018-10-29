export default [
  {
    id: 1,
    userId: 1,
    albumType: 3,
    themeId: 1,
    name: '婚礼',
    avatar: 'http://oqzgtjqen.bkt.clouddn.com/3E0A1646-tiny.jpg',
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
    avatar: 'http://oqzgtjqen.bkt.clouddn.com/_MG_8877%20%E6%8B%B7%E8%B4%9D-tiny.jpg',
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
    avatar: 'http://oqzgtjqen.bkt.clouddn.com/MEGA4250-tiny.jpg',
    activityTime: Date.now(),
    location: `I don't konw`,
    createdAt: Date.now() - 50 * 24 * 60 * 60 * 1000,
    expiredAt: Date.now() + 1050 * 24 * 60 * 60 * 1000
  }
];
