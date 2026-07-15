import { createClientFromRequest } from 'npm:@base44/sdk@0.8.39';
import PptxGenJS from 'npm:pptxgenjs@3.12.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection("microsoft_powerpoint");
    if (!accessToken) {
      return Response.json({ error: 'PowerPoint not connected' }, { status: 400 });
    }

    // Fetch tasks
    const tasks = await base44.entities.NTATask.filter({});
    
    const statusCounts = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {});
    
    const priorityCounts = tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {});

    // Create presentation
    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_16x9';
    
    // Title Slide
    const slide1 = pptx.addSlide();
    slide1.background = { color: '1A1A1A' };
    slide1.addText('Task Metrics Overview', {
      x: 1, y: 2, w: '80%', h: 1.5,
      fontSize: 44, color: 'FFFFFF', bold: true, align: 'center'
    });
    slide1.addText(`Generated on ${new Date().toLocaleDateString()}`, {
      x: 1, y: 3.5, w: '80%', h: 1,
      fontSize: 24, color: 'C43E1C', align: 'center'
    });

    // Status Slide
    const slide2 = pptx.addSlide();
    slide2.background = { color: 'FFFFFF' };
    slide2.addText('Tasks by Status', {
      x: 0.5, y: 0.5, w: '90%', h: 1,
      fontSize: 32, color: '1A1A1A', bold: true
    });
    
    const statusChartData = [{
      name: 'Status',
      labels: Object.keys(statusCounts),
      values: Object.values(statusCounts)
    }];
    
    slide2.addChart(pptx.ChartType.bar, statusChartData, {
      x: 0.5, y: 1.5, w: 8, h: 4,
      showLegend: true,
      chartColors: ['C43E1C', '1A1A1A', '6C9EFF', 'E5E7EB']
    });

    // Priority Slide
    const slide3 = pptx.addSlide();
    slide3.background = { color: 'FFFFFF' };
    slide3.addText('Tasks by Priority', {
      x: 0.5, y: 0.5, w: '90%', h: 1,
      fontSize: 32, color: '1A1A1A', bold: true
    });
    
    const priorityChartData = [{
      name: 'Priority',
      labels: Object.keys(priorityCounts),
      values: Object.values(priorityCounts)
    }];
    
    slide3.addChart(pptx.ChartType.pie, priorityChartData, {
      x: 0.5, y: 1.5, w: 8, h: 4,
      showLegend: true,
      chartColors: ['C43E1C', '1A1A1A', '6C9EFF', 'E5E7EB']
    });

    // Generate PPTX bytes
    const pptxBytes = await pptx.write('arraybuffer');

    // Upload to OneDrive
    const filename = `Task_Metrics_${Date.now()}.pptx`;
    const graphResponse = await fetch(`https://graph.microsoft.com/v1.0/me/drive/root:/${filename}:/content`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      },
      body: pptxBytes
    });

    if (!graphResponse.ok) {
      const errorText = await graphResponse.text();
      return Response.json({ error: `Graph API Error: ${errorText}` }, { status: 500 });
    }

    const driveItem = await graphResponse.json();

    return Response.json({ success: true, file: driveItem });
  } catch (error) {
    console.error('Function error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});