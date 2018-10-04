export default [
  {
    id: 1,
    user_id: 1,
    album_type: 3,
    theme_id: 1,
    created_at: Date.now(),
    expired_at: Date.now() + 30 * 24 * 60 * 60 * 1000
  },
  {
    id: 2,
    user_id: 1,
    album_type: 2,
    theme_id: 1,
    interactive: {
      comment: false,
      like: false,
      photo_message: true,
      hot_photo: false
    },
    created_at: Date.now() - 400 * 24 * 60 * 60 * 1000,
    expired_at: Date.now() - 370 * 24 * 60 * 60 * 1000
  },
  {
    id: 3,
    user_id: 1,
    album_type: 1,
    theme_id: 1,
    created_at: Date.now() - 50 * 24 * 60 * 60 * 1000,
    expired_at: Date.now() + 1050 * 24 * 60 * 60 * 1000
  }
];
