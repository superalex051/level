/**
 * Every string a person reads. Sentence case, verb plus object on buttons,
 * no emoji, no exclamation marks, no em or en dashes. See AGENTS.md.
 */
export const copy = {
  app: 'Level',

  tabs: { feed: 'Feed', circle: 'Circle', you: 'You' },

  welcome: {
    claim: 'No like counts. No follower counts. Nobody sees who is popular.',
    explain: 'You add people to your circle and see what they post. Only you can see how your own posts do.',
    nameLabel: 'What should your circle call you?',
    namePlaceholder: 'Your name',
    continue: 'Continue',
    rulesLine: 'By continuing you agree to the rules.',
    rulesLink: 'Read the rules',
    circleTitle: 'Start your circle',
    circleExplain: 'Your circle is the people whose posts you see. Add a few to fill your feed. Nobody is told.',
    circleDone: 'Open your feed',
    circleSkip: 'Skip for now',
  },

  feed: {
    newPost: 'New post',
    refreshing: 'Refreshing your feed',
  },

  reasons: {
    yours: 'Your post',
    circle: 'From your circle',
    author: (name: string) => `More from ${name}`,
    tag: (tag: string) => `Because you like ${tag}`,
    new: 'New',
    suggested: 'Suggested',
  },

  card: {
    like: 'Like',
    unlike: 'Remove like',
    send: 'Send to someone',
    save: 'Save',
    unsave: 'Remove from saved',
    insights: 'Insights',
    open: 'Open post',
    report: 'Report post',
    hide: 'Hide post',
    photo: 'Photo',
  },

  seenBy: {
    label: 'Seen by',
    none: 'Nobody yet. Your circle will see it soon.',
    sawThis: (names: string) => `${names} saw this`,
  },

  insights: {
    title: 'Insights',
    onlyYou: 'Only you can see this.',
    likes: 'Likes',
    shares: 'Shares',
    seenBy: 'Seen by',
    nothingYet: 'Nothing yet. Your circle will see it soon.',
  },

  circle: {
    title: 'Circle',
    yours: 'Your circle',
    toKnow: 'People to know',
    emptyTitle: 'Your circle is empty',
    emptyBody: 'Add a few people to fill your feed. Nobody is told.',
    add: 'Add to circle',
    added: 'In your circle',
    addShort: 'Add',
    addedShort: 'Added',
    remove: 'Remove from circle',
    removed: (name: string) => `Removed ${name} from your circle`,
    undo: 'Undo',
  },

  you: {
    title: 'You',
    circleRow: 'Your circle',
    noCounts: 'No follower counts here. Not even for you.',
    emptyTitle: 'Nothing posted yet',
    emptyBody: 'Post a photo and see who in your circle saw it.',
    post: 'Post a photo',
    more: 'More',
    rules: 'Rules',
    deleteAccount: 'Delete account',
    deleteTitle: 'Delete your account?',
    deleteBody: 'Your posts, circle, and name are removed from this phone.',
    deleteConfirm: 'Delete account',
    keep: 'Keep account',
    handle: (handle: string) => `@${handle}`,
    openCircle: 'Open your circle',
  },

  profile: {
    postsAbout: 'Posts about',
    block: 'Block',
    blockTitle: (name: string) => `Block ${name}?`,
    blockBody: 'Their posts disappear from your feed. They are not told.',
    blocked: (name: string) => `Blocked ${name}`,
    notFound: 'This person is not here.',
    notFoundBody: 'The link may be old.',
    noPosts: 'No posts yet.',
  },

  compose: {
    title: 'New post',
    choose: 'Choose a photo',
    change: 'Change photo',
    sample: 'Use a sample photo',
    captionPlaceholder: 'Write a caption',
    post: 'Post photo',
    posting: 'Posting to your circle',
    posted: 'Posted to your circle',
    keepEditing: 'Keep editing',
    discard: 'Discard post',
    discardTitle: 'Discard this post?',
    discardBody: 'The photo and caption are not kept.',
    close: 'Close',
  },

  send: {
    title: 'Send privately to',
    sent: (name: string) => `Sent to ${name}`,
    needCircle: 'Add people to your circle to send this',
    notNow: 'Not now',
  },

  moderation: {
    reported: 'Thanks. We will look at this post.',
    hidden: 'Post hidden',
  },

  rules: {
    title: 'The rules',
    intro: 'Level is small on purpose. Keep it worth being in.',
    items: [
      'Post your own photos, or photos you have permission to share.',
      'No harassment, hate, or threats. Report it if you see it.',
      'No nudity or sexual content.',
      'No spam, no selling, no follow-for-follow. There are no counts to farm.',
      'You must be 13 or older.',
    ],
    close: 'Done',
  },

  post: {
    title: 'Post',
    notFound: 'This post is not here.',
    notFoundBody: 'It may have been removed.',
  },

  common: {
    notNow: 'Not now',
    back: 'Back',
  },
} as const;
