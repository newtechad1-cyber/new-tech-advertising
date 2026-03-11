/**
 * WHITE-LABEL CONFIGURATION ENGINE
 * 
 * Applies reseller branding and tenant-specific configuration to UI.
 * Prevents NTA branding from leaking into white-labeled portals.
 */

export const applyResellerBranding = (branding) => {
  if (!branding) return {};

  return {
    brandName: branding.brand_name || 'Platform',
    logo: branding.logo_url,
    favicon: branding.icon_url,
    primaryColor: branding.primary_color || '#1F2937',
    secondaryColor: branding.secondary_color || '#06B6D4',
    accentColor: branding.accent_color || '#0EA5E9',
    supportEmail: branding.support_email,
    supportPhone: branding.support_phone,
    footerText: branding.footer_text || '© 2026. All rights reserved.',
    loginTitle: branding.login_page_title || 'Welcome',
    portalWelcome: branding.portal_welcome_message || 'Welcome to your dashboard',
    emailHeader: branding.email_header_text || 'Marketing Platform',
    emailFooter: branding.email_footer_text || 'Powered by our platform',
    fontFamily: branding.font_preference === 'inter' ? 'font-inter' : 'font-system',
  };
};

export const getCSSVariables = (branding) => {
  const config = applyResellerBranding(branding);
  return `
    --primary-color: ${config.primaryColor};
    --secondary-color: ${config.secondaryColor};
    --accent-color: ${config.accentColor};
  `;
};

export const getPortalLayout = (branding) => {
  return {
    hideNTABranding: true,
    showResellerLogo: !!branding?.logo_url,
    customDomain: branding?.custom_domain,
    useResellerColors: true,
    resellerName: branding?.brand_name,
  };
};