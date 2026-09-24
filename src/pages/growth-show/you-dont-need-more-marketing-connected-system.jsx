import GrowthShowEpisode from '@/pages/GrowthShowEpisode';
import { getVideoWatchById } from '@/data/videoSeo.js';

export default function NativeGrowthShowEpisode() {
  return <GrowthShowEpisode initialVideo={getVideoWatchById('S-hRkzo6_3M')} />;
}
