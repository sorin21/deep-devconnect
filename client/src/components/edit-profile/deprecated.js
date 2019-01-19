The whole getDerivedStateFromProps until this point in EditProfile.js:

static getDerivedStateFromProps(nextProps, prevState) {
  // if there is an error
  if (nextProps.errors) {
    // then add it to errors object
    return { errors: nextProps.errors };
  }

  if (nextProps.profile.profile) {
    const profile = nextProps.profile.profile;

    // Bring skills array back into CSV
    const skillsCSV = profile.skills.join(',');

    // If profile field doesn't exist, make empty string
    profile.company = !isEmpty(profile.company) ? profile.company : '';
    profile.website = !isEmpty(profile.website) ? profile.website : '';
    profile.location = !isEmpty(profile.location) ? profile.location : '';
    profile.status = !isEmpty(profile.status) ? profile.status : '';
    profile.skills = !isEmpty(profile.skills) ? profile.skills : '';
    profile.bio = !isEmpty(profile.bio) ? profile.bio : '';
    profile.github = !isEmpty(profile.github) ? profile.github : '';
    profile.social = !isEmpty(profile.social) ? profile.social : {};
    profile.youtube = !isEmpty(profile.social.youtube) ? profile.social.youtube : '';
    profile.twitter = !isEmpty(profile.social.twitter) ? profile.social.twitter : '';
    profile.facebook = !isEmpty(profile.social.facebook) ? profile.social.facebook : '';
    profile.linkedin = !isEmpty(profile.social.linkedin) ? profile.social.linkedin : '';
    profile.instagram = !isEmpty(profile.social.instagram) ? profile.social.instagram : '';

    // Set component fields state
    return {
      handle: profile.handle,
      company: profile.company,
      website: profile.website,
      location: profile.location,
      status: profile.status,
      skills: skillsCSV,
      bio: profile.bio,
      github: profile.github,
      twitter: profile.twitter,
      youtube: profile.youtube,
      facebook: profile.facebook,
      linkedin: profile.linkedin,
      instagram: profile.instagram,
    }
  }
  return null;
};


For errors you need to use componentDidUpdate:

componentDidUpdate(prevProps, prevState) {
  if (prevProps.errors !== this.props.errors) {
    this.setState({ errors: this.props.errors })
  }
}


Here you have more info about when to use getDerivedStateFromProps with componentDidUpdate.