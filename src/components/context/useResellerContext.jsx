import React, { createContext, useContext, useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

const ResellerContext = createContext();

export const useResellerContext = () => {
  const context = useContext(ResellerContext);
  if (!context) {
    throw new Error('useResellerContext must be used within ResellerProvider');
  }
  return context;
};

export const ResellerProvider = ({ children, resellerId }) => {
  const [reseller, setReseller] = useState(null);
  const [branding, setBranding] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResellerContext = async () => {
      try {
        const authenticatedUser = await base44.auth.me();
        setUser(authenticatedUser);

        if (resellerId) {
          const resellerData = await base44.entities.ResellerAccount?.read?.(resellerId);
          setReseller(resellerData);

          const brandingData = await base44.entities.ResellerBrandProfile?.filter?.({ reseller_id: resellerId }, null, 1);
          if (brandingData?.length > 0) {
            setBranding(brandingData[0]);
          }
        }
      } catch (error) {
        console.error('Failed to load reseller context:', error);
      } finally {
        setLoading(false);
      }
    };

    loadResellerContext();
  }, [resellerId]);

  const getTenantBranding = () => {
    return branding || {
      brand_name: reseller?.reseller_name,
      logo_url: reseller?.logo_url,
      primary_color: reseller?.primary_color || '#1F2937',
      secondary_color: reseller?.secondary_color || '#06B6D4',
      support_email: reseller?.support_email,
    };
  };

  const hasFeatureAccess = async (moduleName) => {
    if (!reseller) return false;
    try {
      const featureAccess = await base44.entities.ResellerFeatureAccess?.filter?.(
        { reseller_id: reseller.id, module_name: moduleName },
        null,
        1
      );
      return featureAccess?.length > 0 && featureAccess[0].enabled;
    } catch {
      return false;
    }
  };

  const canAccessAsReseller = (requiredRole) => {
    if (!user) return false;
    const userRole = user.reseller_role;
    const roleHierarchy = ['owner', 'admin', 'sales', 'content_manager', 'support', 'analyst'];
    return roleHierarchy.indexOf(userRole) <= roleHierarchy.indexOf(requiredRole);
  };

  return (
    <ResellerContext.Provider
      value={{
        reseller,
        branding: getTenantBranding(),
        user,
        loading,
        hasFeatureAccess,
        canAccessAsReseller,
      }}
    >
      {children}
    </ResellerContext.Provider>
  );
};