#!/usr/bin/env python3
"""Attach audio to an existing GrowthShowEpisode; never create a second episode.
Uses installed ffmpeg/ffprobe (FFMPEG_PATH / FFPROBE_PATH may point to binaries).
Run in the repository. --check-only verifies conversion without changing records.
After reviewing the sound, --sound-reviewed plus --preview-base checks hosted bytes.
"""
import argparse, hashlib, json, os, pathlib, subprocess, tempfile, urllib.request
parser=argparse.ArgumentParser()
parser.add_argument('--youtube-id',required=True)
parser.add_argument('--master',required=True)
parser.add_argument('--source-url',required=True)
parser.add_argument('--check-only',action='store_true')
parser.add_argument('--sound-reviewed',action='store_true')
parser.add_argument('--preview-base')
args=parser.parse_args()
app='691f41a18de4a7f498c8f884'
api='https://base44.app/api/apps/'+app+'/entities/GrowthShowEpisode'
with urllib.request.urlopen(api,timeout=20) as response: body=json.load(response)
records=body if isinstance(body,list) else body.get('items',body.get('entities',[]))
matches=[r for r in records if r.get('youtube_video_id')==args.youtube_id]
if len(matches)!=1: raise SystemExit('Exactly one existing episode identity is required.')
record=matches[0]
ff=os.environ.get('FFMPEG_PATH','ffmpeg')
probe=os.environ.get('FFPROBE_PATH','ffprobe')
source=pathlib.Path(args.master)
info=json.loads(subprocess.check_output([probe,'-v','error','-show_entries','format=duration','-of','json',str(source)]))
expected=float(info['format']['duration'])
with tempfile.TemporaryDirectory() as temporary:
 output=pathlib.Path(temporary)/(args.youtube_id+'.mp3')
 subprocess.run([ff,'-v','error','-xerror','-i',str(source),'-map','0:a:0','-vn','-c:a','libmp3lame','-b:a','128k',str(output)],check=True)
 subprocess.run([ff,'-v','error','-xerror','-i',str(output),'-f','null','-'],check=True)
 info=json.loads(subprocess.check_output([probe,'-v','error','-show_entries','format=duration','-of','json',str(output)]))
 duration=float(info['format']['duration'])
 if abs(duration-expected)>1:raise SystemExit('Converted audio does not match the complete master duration.')
 data={'audio_status':'Review','audio_url':'https://newtechadvertising.com/audio/growth-show/'+args.youtube_id+'.mp3',
       'audio_content_type':'audio/mpeg','audio_byte_length':output.stat().st_size,
       'audio_duration_seconds':duration,'audio_source_url':args.source_url,
       'audio_complete':True,'audio_sound_checked':False,'audio_seek_checked':False,
       'audio_sha256':hashlib.sha256(output.read_bytes()).hexdigest()}
 if args.check_only:print(json.dumps(data,indent=2));raise SystemExit()
 token=os.environ.get('BASE44_USER_TOKEN')
 if not token:raise SystemExit('Authenticated owner token required for the existing episode update. No files or records were changed.')
 target=pathlib.Path('public/audio/growth-show')/output.name
 target.parent.mkdir(parents=True,exist_ok=True)
 target.write_bytes(output.read_bytes())
 if args.sound_reviewed:
  if not args.preview_base:raise SystemExit('Provide the preview base after listening to the full episode.')
  url=args.preview_base.rstrip('/')+'/audio/growth-show/'+output.name
  req=urllib.request.Request(url,headers={'Range':'bytes=100000-100999'})
  with urllib.request.urlopen(req,timeout=20) as response:
   if response.status!=206 or response.headers.get_content_type()!='audio/mpeg' or len(response.read())!=1000:raise SystemExit('Hosted audio failed seeking/content-type checks.')
  from datetime import datetime,timezone
  data.update(audio_status='Ready',audio_sound_checked=True,audio_seek_checked=True,
       audio_verified_at=datetime.now(timezone.utc).isoformat(),audio_verification_method='Full master decode, duration, owner listening review, hosted MIME and byte-range verification.')
 req=urllib.request.Request(api+'/'+record['id'],data=json.dumps(data).encode(),method='PUT',
       headers={'Authorization':'Bearer '+token,'Content-Type':'application/json'})
 with urllib.request.urlopen(req,timeout=20) as response:json.load(response)
 manifest=pathlib.Path('src/data/growthShowAudio.js')
 old=manifest.read_text()
 all_audio=json.loads(old[old.index('= ')+2:].rstrip().rstrip(';'))
 all_audio[args.youtube_id]=data
 manifest.write_text('// Audio metadata keyed by existing episode identity.\nexport const GROWTH_SHOW_AUDIO = '+json.dumps(all_audio,indent=2)+';\n')
 print('Existing episode audio updated. The website uses this same record; npm run build refreshes RSS. Owner Publish remains separate.')
