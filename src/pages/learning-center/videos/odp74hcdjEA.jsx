import VideoWatchPage from '@/components/video/VideoWatchPage';
import { getVideoWatchById } from '@/data/videoSeo.js';

export default function NativeVideoWatchPage() {
  return <VideoWatchPage video={getVideoWatchById('odp74hcdjEA')} />;
}
