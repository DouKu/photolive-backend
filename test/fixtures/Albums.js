export default [
  {
    user_id: 1,
    name: '婚礼',
    avatar: 'hunli',
    banners: ['banner1', 'banner2'],
    activity_time: new Date(),
    location: `I don't konw`,
    album_type: 3,
    css_type: 1,
    interactive_setting: {
      comment: false,
      like: false,
      photo_message: true,
      hot_photo: false,
      count_down: false
    },
    water_mark: 'jb',
    created_at: new Date(),
    expired_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },
  {
    user_id: 1,
    name: '公司年会',
    avatar: 'gongsinianhui',
    banners: [],
    activity_time: new Date(),
    location: `I don't konw`,
    album_type: 3,
    css_type: 1,
    interactive_setting: {
      comment: false,
      like: false,
      photo_message: true,
      hot_photo: false,
      count_down: false
    },
    water_mark: 'jb',
    created_at: new Date('2017-04-02'),
    expired_at: new Date('2017-05-02')
  },
  {
    user_id: 1,
    name: '生日聚会',
    avatar: 'shengrijuhui',
    banners: [],
    activity_time: new Date(),
    location: `I don't konw`,
    album_type: 3,
    css_type: 1,
    interactive_setting: {
      comment: false,
      like: false,
      photo_message: true,
      hot_photo: false,
      count_down: false
    },
    water_mark: 'jb',
    created_at: new Date('2018-05-03'),
    expired_at: new Date('2022-05-03')
  }
];
