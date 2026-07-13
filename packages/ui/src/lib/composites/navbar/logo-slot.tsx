import React from 'react';
import { useSelector } from 'react-redux';
import { selectSettingByKey } from '@inithium/store';
import { Box, Text } from '../../components';

interface LogoSlotProps {
  pageTitle?: string;
}

const LogoSlot: React.FC<LogoSlotProps> = ({ pageTitle }) => {
  const logoUrlSetting = useSelector(selectSettingByKey('logo-asset'));
  const logoUrl = typeof logoUrlSetting?.value === 'string' ? logoUrlSetting.value : undefined;

  return (
    <Box flex align="center" className="h-[72px]">
      {logoUrl && (
        <Box flex align="center" className="h-[72px] py-2">
          <img 
            src={logoUrl} 
            alt="Logo" 
            className="max-h-full w-auto object-contain mx-2"
          />
          <Text variant="h5" color="surface-contrast" overrideClassName="primary-font">
            {pageTitle}
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default LogoSlot;