export const getProfileAvatar = (param) => {
  const { profileImg, displayName } = param;
  if (profileImg) {
    return <img src={profileImg} alt="profile image" />;
  } else {
    return displayName[0];
  }
};
