"""Record initial HTTP HTML independently of rendered-browser verification.
Usage: python scripts/check-search-delivery.py --output /tmp/search-check.json
Use --all for the complete sitemap. Failed first responses remain in the record.
"""
import argparse, concurrent.futures, datetime, json, pathlib, urllib.request
from html.parser import HTMLParser
import xml.etree.ElementTree as ET

class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.title=[]; self.h1=[]; self.canonical=[]; self.robots=[]; self.schemas=[]; self.capture=None; self.jsonld=False; self.buffer=''
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag in ('title','h1'): self.capture=tag
        if tag=='link' and a.get('rel')=='canonical': self.canonical.append(a.get('href'))
        if tag=='meta' and a.get('name','').lower() in ('robots','googlebot'): self.robots.append(a.get('content',''))
        if tag=='script' and a.get('type')=='application/ld+json': self.jsonld=True; self.buffer=''
    def handle_data(self,data):
        if self.capture=='title': self.title.append(data)
        if self.capture=='h1': self.h1.append(data)
        if self.jsonld: self.buffer+=data
    def handle_endtag(self,tag):
        if tag==self.capture:self.capture=None
        if tag=='script' and self.jsonld:
            try:self.schemas.append(json.loads(self.buffer))
            except ValueError:pass
            self.jsonld=False

def check(task):
    url,kind=task
    ua={'googlebot':'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)', 'ordinary':'Mozilla/5.0 NTA-Search-Delivery-Verification'}[kind]
    result={'url':url,'request':kind,'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat()}
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent':ua}),timeout=35) as r:
            page=Page(); raw=r.read().decode();page.feed(raw)
            result.update(status=r.status, finalUrl=r.url, contentType=r.headers.get('Content-Type'), canonical=page.canonical, title=' '.join(' '.join(page.title).split()), h1=' '.join(' '.join(page.h1).split()), robots=page.robots, xRobotsTag=r.headers.get('X-Robots-Tag',''), snapshot='id="seo-snapshot"' in raw, videoSchemas=[o for o in page.schemas if isinstance(o,dict) and o.get('@type')=='VideoObject'])
            result['pass']=r.status==200 and page.canonical==[url] and bool(page.title) and bool(page.h1) and not any('noindex' in x.lower() for x in page.robots+[r.headers.get('X-Robots-Tag','')])
    except Exception as e:result.update(error=str(e),pass_=False)
    return result

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--all',action='store_true');parser.add_argument('--output',required=True);args=parser.parse_args()
    root=pathlib.Path(__file__).resolve().parent.parent
    if args.all:
        urls=[n.text for n in ET.parse(root/'public/sitemap.xml').findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
    else:
        urls=json.loads((root/'docs/releases/search-delivery-2026-10-28/initially-flagged-urls.json').read_text())
        urls+=['https://newtechadvertising.com/knowledge/ai-humanity/ai-is-a-mirror-not-a-god','https://newtechadvertising.com/growth-show/representation-or-deception','https://newtechadvertising.com/growth-show/show-me-before-you-sell-me','https://newtechadvertising.com/journal/the-free-ai-guy-comes-to-life']
    results=list(concurrent.futures.ThreadPoolExecutor(max_workers=8).map(check,[(u,k) for u in urls for k in ('googlebot','ordinary')]))
    pathlib.Path(args.output).write_text(json.dumps(results,indent=2)+'\n')
    print(json.dumps({'requests':len(results),'passed':sum(r.get('pass',False) for r in results),'failed':[{k:r.get(k) for k in ('url','request','canonical','error')} for r in results if not r.get('pass',False)]},indent=2))
