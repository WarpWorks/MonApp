import namespace from './../namespace';

export default (path) => namespace(`USER-PROFILE-NOTIFICATIONS${path ? `.${path}` : ''}`);
