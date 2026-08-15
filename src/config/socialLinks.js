export const NTA_SOCIAL_LINKS = {
  facebook: {
    label: 'Facebook',
    url: 'https://www.facebook.com/newtechadvertising/',
  },
  instagram: {
    label: 'Instagram',
    url: 'https://www.instagram.com/hesse2882',
  },
  linkedin: {
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/rick-hesse-64755946/',
  },
  googleBusiness: {
    label: 'Google Business Profile',
    url: 'https://www.google.com/maps/place/New+Tech+Advertising+-+AI+Marketing+Agency/@44.879956,-93.3614534,6z/data=!3m1!4b1!4m6!3m5!1s0x87f1a9d9290e5555:0x1c02cedd2f9bc49f!8m2!3d44.879956!4d-93.3614534!16s%2Fg%2F11ghr024px?entry=ttu&g_ep=EgoyMDI2MDgxMi4wIKXMDSoASAFQAw%3D%3D',
  },
  youtube: {
    label: 'YouTube',
    url: 'https://www.youtube.com/channel/UCdGaYoTxcO-W6wuC3iDqFDg',
  },
};

export const NTA_SOCIAL_PROFILE_URLS = Object.values(NTA_SOCIAL_LINKS).map(({ url }) => url);

export const RICK_SOCIAL_PROFILE_URLS = [
  NTA_SOCIAL_LINKS.instagram.url,
  NTA_SOCIAL_LINKS.linkedin.url,
  NTA_SOCIAL_LINKS.youtube.url,
];
