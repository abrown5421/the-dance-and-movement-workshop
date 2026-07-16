import React from 'react';
import { Box, Text } from '@inithium/ui';
import { useUserQuery } from '@inithium/store';
import type { Instructor } from '@inithium/types';

interface InstructorCardProps {
  instructor: Instructor;
  heightClass: string;
}

const getApiBaseUrl = (): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env['VITE_API_ORIGIN'] ?? 'http://localhost:3000';
  }
  return 'http://localhost:3000';
};

const getDefaultAvatar = (baseUrl: string): string => 
  `${baseUrl}/api/assets/by-key/69e44c5e-c9f3-4509-ad62-f500d6b2601c.webp`;

const getAvatarUrl = (baseUrl: string, avatarSrc?: string): string =>
  avatarSrc
    ? `${baseUrl}/${avatarSrc.replace(/^\//, '')}`
    : getDefaultAvatar(baseUrl);

export const InstructorCard: React.FC<InstructorCardProps> = ({ instructor, heightClass }) => {
  const { data: linkedUser } = useUserQuery(instructor.user_id!, {
    skip: !instructor.user_id,
  });

  const displayName = linkedUser
    ? `${linkedUser.first_name} ${linkedUser.last_name}`
    : `${instructor.firstName} ${instructor.lastName}`;

  const title = instructor.position1 ?? '';

  const imageUrl = getAvatarUrl(getApiBaseUrl(), linkedUser?.user_avatar?.src);

  const bio = linkedUser?.bio || 'Biography information forthcoming.';

  return (
    <Box
      borderRadius="lg"
      overrideClassName={`relative overflow-hidden group select-none shadow-md border border-surface3-contrast/5 bg-surface4 ${heightClass} w-full`}
    >
      <img
        src={imageUrl}
        alt={displayName}
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
          {displayName}
        </Text>
        <br />
        <Text variant="body2" overrideClassName="block text-white/80 text-sm mt-1">
          {title}
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
          {displayName}
        </Text>
        <br />
        <Text variant="subtitle2" overrideClassName="block text-primary font-medium text-center mb-4 uppercase tracking-wider text-xs mt-1">
          {title}
        </Text>
        <br />
        <Text variant="body" overrideClassName="text-white/90 text-sm text-center leading-relaxed max-w-prose">
          {bio}
        </Text>
      </Box>
    </Box>
  );
};