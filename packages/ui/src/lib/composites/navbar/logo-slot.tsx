import React from 'react';
import { useSelector } from 'react-redux';
import { selectSettingByKey } from '@inithium/store';
import { Box } from '../../components';

const LogoSlot: React.FC = () => {
  const logoUrlSetting = useSelector(selectSettingByKey('logo-asset'));
  
  const logoUrl = typeof logoUrlSetting?.value === 'string' ? logoUrlSetting.value : undefined;

  return (
    <Box flex align="center" className="h-[72px]">
      {logoUrl && (
        <Box flex align="center" className="h-[72px] py-2">
          <img 
            src={logoUrl} 
            alt="Logo" 
            className="max-h-full w-auto object-contain ml-2"
          />
        </Box>
      )}
    </Box>
  );
};

export default LogoSlot;