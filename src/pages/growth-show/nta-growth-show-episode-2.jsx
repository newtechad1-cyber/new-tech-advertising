import GrowthShowEpisode from '@/pages/GrowthShowEpisode';
import { getVideoWatchById } from '@/data/videoSeo.js';

export default function NativeGrowthShowEpisode() {
  return <GrowthShowEpisode initialVideo={getVideoWatchById('Wz9Gqshyk3o')} />;
}
