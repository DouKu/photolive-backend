export default [
  {
    user_id: 1,
    album_type: 3,
    css_type: 1,
    name: '婚礼',
    avatar: 'hunli',
    activity_time: Date.now(),
    location: `I don't konw`,
    top_ad: 'no top ad',
    bottom_ad: 'no bottom ad',
    banners: ['banner1', 'banner2'],
    share_avatar: 'no share',
    share_title: 'no share title',
    share_des: 'no share des',
    interactive_setting: {
      comment: false,
      like: false,
      photo_message: true,
      hot_photo: false,
      count_down: false
    },
    water_mark: 'jb',
    created_at: Date.now(),
    expired_at: Date.now() + 30 * 24 * 60 * 60 * 1000
  },
  {
    user_id: 1,
    album_type: 2,
    css_type: 1,
    name: '公司年会',
    avatar: 'gong si nian hui',
    activity_time: Date.now(),
    location: `I don't konw`,
    top_ad: 'no top ad',
    bottom_ad: 'no bottom ad',
    banners: ['banner1', 'banner2'],
    share_avatar: 'no share',
    share_title: 'no share title',
    share_des: 'no share des',
    interactive_setting: {
      comment: false,
      like: false,
      photo_message: true,
      hot_photo: false,
      count_down: false
    },
    water_mark: 'jb',
    created_at: Date.now() - 400 * 24 * 60 * 60 * 1000,
    expired_at: Date.now() - 370 * 24 * 60 * 60 * 1000
  },
  {
    user_id: 1,
    album_type: 1,
    css_type: 1,
    name: '同学会',
    avatar: '同学会',
    activity_time: Date.now(),
    location: `I don't konw`,
    top_ad: 'no top ad',
    bottom_ad: 'no bottom ad',
    banners: ['banner1', 'banner2'],
    share_avatar: 'no share',
    share_title: 'no share title',
    share_des: 'no share des',
    interactive_setting: {
      comment: false,
      like: false,
      photo_message: true,
      hot_photo: false,
      count_down: false
    },
    water_mark: 'jb',
    created_at: Date.now() - 50 * 24 * 60 * 60 * 1000,
    expired_at: Date.now() + 1050 * 24 * 60 * 60 * 1000
  }
];
