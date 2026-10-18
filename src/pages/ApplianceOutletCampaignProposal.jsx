import React, { useEffect } from 'react';
import { Printer, ArrowLeft } from 'lucide-react';
const logo='https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/45ced7207_nta_logo_header_1600x320.png';
const sections=[
['01','The opportunity','Build awareness of Appliance Outlet Super Center across its practical shopping area while giving buyers a timely reason to visit. A steady brand message makes the store memorable; rotating promotions convert that attention into action.'],
['02','One campaign, two complementary messages','Proposed brand signature: “Big Brands. Smart Buys.” Recurring promotional feature: “The Appliance Outlet Hot Buy of the Week.” Don’s “Perfect Is Overpriced” can be used selectively for suitable cosmetic-imperfection offers, rather than defining every appliance in the store. All wording remains subject to Appliance Outlet approval.'],
['03','A coordinated commercial rotation','One 30-second image commercial introduces the store and its value proposition. Two or three 15-second Hot Buy spots highlight approved products, prices and genuine offer dates. An initial planning mix of roughly 40% brand and 60% promotional exposure is a starting point, not a fixed media schedule. Shared branding ties every spot together.'],
['04','The right geographic reach','Target roughly 50 miles around Mason City, including Clear Lake, Charles City, Forest City, Hampton, Osage, Austin and Albert Lea. Avoid unnecessary Rochester coverage where practical. Final targeting depends on platform inventory and available ZIP-level or market-level controls.'],
['05','Television first, digital working alongside it','Compare connected/streaming television and local broadcast opportunities for reach, frequency, pricing and geographic fit. Reuse approved video and offers on Facebook, Instagram, YouTube and the website. Concentrate the media budget where repeated exposure is achievable rather than scattering small amounts across too many outlets.'],
['06','Introductory media investment','Evaluate a $1,500/month starter media budget alongside a $3,000/month expanded option, beginning with a 30-day commitment and a 90-day strategic outlook. These are discussion figures, not approved spending or quoted delivery. Media costs are separate from the existing $1,500/month NTA video-first marketing arrangement. We will review actual inventory, reach and frequency estimates before any placement.'],
['07','Launch now, then build continuity','First featured offer: Whirlpool 36-inch, 24 cu. ft. side-by-side refrigerator, model WRS315SDHM — stated MSRP $1,777; Hot Buy $777; offer through October 28, 2026, while supplies last. Confirm stock, prices and deadline before release. Start available digital promotion promptly while television creative and placements undergo approval. Follow with new Hot Buys as inventory changes.']
];
export default function ApplianceOutletCampaignProposal(){
useEffect(()=>{document.title='Appliance Outlet | Introductory Advertising Proposal | NTA';const m=document.createElement('meta');m.name='robots';m.content='noindex,nofollow';document.head.appendChild(m);return()=>m.remove()},[]);
return <div className="nta-proposal"><style>{`
.nta-proposal{font-family:Inter,Arial,sans-serif;background:#eef3f8;color:#17304d;min-height:100vh;padding:32px 16px}
.nta-paper{max-width:860px;margin:auto;background:#fff;box-shadow:0 18px 60px #17304d1c}
.nta-head{background:#102e52;color:#fff;padding:35px 48px 42px;border-bottom:7px solid #e9b949}
.nta-head img{display:block;width:260px;max-width:100%;height:auto;margin-bottom:35px}
.nta-kicker{color:#f1c65d;text-transform:uppercase;letter-spacing:.15em;font-weight:700;font-size:12px}
.nta-head h1{font-size:36px;line-height:1.12;margin:10px 0 10px;font-weight:800;color:white}
.nta-head p{font-size:17px;color:#e0ebf6;max-width:650px;line-height:1.55}
.nta-body{padding:36px 48px 44px}
.nta-intro{border-left:4px solid #e9b949;padding:3px 0 3px 18px;font-size:18px;line-height:1.5;font-weight:600;margin-bottom:30px}
.nta-section{display:grid;grid-template-columns:46px 1fr;gap:14px;padding:20px 0;border-bottom:1px solid #dde6ef;break-inside:avoid}
.nta-num{color:#2370a6;font-weight:800;font-size:17px}
.nta-section h2{font-size:19px;margin:0 0 8px;color:#102e52;font-weight:800}
.nta-section p{font-size:14.5px;line-height:1.68;margin:0;color:#3d5167}
.nta-budget{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:18px 0}
.nta-budget div{background:#edf5fb;border-top:3px solid #2370a6;padding:14px}
.nta-budget strong{display:block;font-size:25px;color:#102e52}
.nta-budget span{font-size:13px}
.nta-next{background:#f3f7fa;padding:22px 26px;margin-top:28px;border-left:4px solid #e9b949;break-inside:avoid}
.nta-next h2{font-size:19px;margin:0 0 10px}
.nta-next p{font-size:14px;line-height:1.65;margin:0}
.nta-footer{font-size:12px;color:#58718a;margin-top:28px;border-top:1px solid #dce5ee;padding-top:18px}
.nta-toolbar{max-width:860px;margin:0 auto 14px;display:flex;justify-content:space-between;gap:10px}
.nta-toolbar button,.nta-toolbar a{background:#102e52;color:#fff;border:0;border-radius:8px;padding:11px 16px;display:flex;align-items:center;gap:8px;font-weight:700;cursor:pointer;text-decoration:none}
@media(max-width:600px){.nta-head{padding:27px 24px}.nta-head h1{font-size:29px}.nta-body{padding:25px 23px}.nta-section{grid-template-columns:32px 1fr}.nta-budget{grid-template-columns:1fr}}
@media print{@page{size:letter;margin:.55in}.nta-proposal{padding:0;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}.nta-toolbar{display:none!important}.nta-paper{max-width:none;box-shadow:none}.nta-head{padding:22px 30px 24px}.nta-head img{width:205px;margin-bottom:16px}.nta-head h1{font-size:28px}.nta-head p{font-size:13px}.nta-body{padding:19px 30px}.nta-intro{font-size:14px;margin-bottom:12px}.nta-section{padding:10px 0;gap:9px}.nta-section h2{font-size:15px;margin-bottom:4px}.nta-section p{font-size:11.5px;line-height:1.48}.nta-next{padding:14px 18px;margin-top:16px}.nta-next p{font-size:11.5px}.nta-footer{margin-top:15px}}
`}</style>
<div className="nta-toolbar"><a href="/"> <ArrowLeft size={16}/> NTA website</a><button onClick={()=>window.print()}><Printer size={17}/> Print proposal / Save as PDF</button></div>
<article className="nta-paper"><header className="nta-head"><img src={logo} alt="New Tech Advertising logo"/><div className="nta-kicker">Prepared for Don O'Connor · October 18, 2026</div><h1>Appliance Outlet Super Center</h1><p>Television-first advertising campaign<br/>Introductory proposal · New Tech Advertising</p></header>
<main className="nta-body"><div className="nta-intro">Make Appliance Outlet a name people recognize and remember—then give them a reason to shop this week.</div>
{sections.map(([num,title,copy])=><section className="nta-section" key={num}><div className="nta-num">{num}</div><div><h2>{title}</h2><p>{copy}</p>{num==='06'&&<div className="nta-budget"><div><span>Starter media option</span><strong>$1,500/mo</strong></div><div><span>Expanded media option</span><strong>$3,000/mo</strong></div></div>}</div></section>)}
<div className="nta-next"><h2>Decisions for our first working session</h2><p>Confirm the media investment; approve the campaign identity and creative direction; choose two additional Hot Buy appliances; verify the Whirlpool offer; and review actual media availability before authorizing placements. NTA will coordinate creative, setup, distribution and reporting within the agreed scope. Appliance Outlet approves offers, creative and media spend.</p></div>
<footer className="nta-footer">Prepared by New Tech Advertising · Introductory discussion proposal · No media purchase authorized by this document.</footer>
</main></article></div>
}