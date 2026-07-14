import React from 'react';
import { Box, Text } from '@inithium/ui';
import type { StaffMember } from '@inithium/types';

interface OurTeamCardProps {
  member: StaffMember;
  heightClass: string;
}

const getApiBaseUrl = (): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env['VITE_API_ORIGIN'] ?? 'http://localhost:3000';
  }
  return 'http://localhost:3000';
};

export const OurTeamCard: React.FC<OurTeamCardProps> = ({ member, heightClass }) => {
  const imageUrl = member.staffImageUrl 
    ? `${getApiBaseUrl()}/${member.staffImageUrl.replace(/^\//, '')}`
    : `${getApiBaseUrl()}/placeholder-profile.png`;

  return (
    <Box
      borderRadius="lg"
      overrideClassName={`relative overflow-hidden group select-none shadow-md border border-surface3-contrast/5 bg-surface4 ${heightClass} w-full`}
    >
      <img
        src={imageUrl}
        alt={member.profile?.first_name ?? 'Staff Member'}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <Box
        flex
        direction="col"
        justify="end"
        padding="md"
        overrideClassName="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/40 to-transparent pt-12 pb-4 px-4 z-10 pointer-events-none transition-opacity duration-300 group-hover:opacity-0"
      >
        <Text variant="h5" overrideClassName="block primary-font font-bold text-white">
          {member.profile?.first_name ?? 'Name Unavailable'}
        </Text>
        <br />
        <Text variant="body2" overrideClassName="block text-white/80 text-sm mt-1">
          {member.title}
        </Text>
      </Box>

      <Box
        flex
        direction="col"
        justify="center"
        align="center"
        padding="lg"
        overrideClassName="p-4 absolute inset-0 bg-black/85 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out z-20 overflow-y-auto"
      >
        <Text variant="h5" overrideClassName="block primary-font font-bold text-white text-center">
          {`${member.profile?.first_name ?? ''} ${member.profile?.last_name ?? ''}`.trim() || 'Name Unavailable'}
        </Text>
        <br />
        <Text variant="subtitle2" overrideClassName="block text-primary font-medium text-center mb-4 uppercase tracking-wider text-xs mt-1">
          {member.title}
        </Text>
        <br />
        <Text variant="body" overrideClassName="text-white/90 text-sm text-center leading-relaxed max-w-prose">
          {member.profile?.bio || 'Biography information forthcoming.'}
        </Text>
      </Box>
    </Box>
  );
};