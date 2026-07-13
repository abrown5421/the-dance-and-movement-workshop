import React, { useState } from 'react';
import { Box, Button, Text } from '@inithium/ui';
import { Calendar, Clock, MapPin, DollarSign, Users } from 'lucide-react';
import type { DanceClass } from '@inithium/types';
import { Dialog } from '@inithium/ui';
import {
  formatInstructors,
  formatMeetingDays,
  formatSessionRange,
  formatTimeRange,
} from './classes.utils';

export interface ClassCardProps {
  danceClass: DanceClass;
}

const openRegistration = (link: string, e: React.MouseEvent): void => {
  e.stopPropagation();
  window.open(link, '_blank', 'noopener,noreferrer');
};

export const ClassCard: React.FC<ClassCardProps> = ({ danceClass }) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const isOpen = danceClass.openings.calculated_openings > 0;

  return (
    <>
      <Box
        padding="md"
        borderRadius="lg"
        flex
        direction="col"
        justify="between"
        onClick={() => setIsDetailOpen(true)}
        overrideClassName="p-5 bg-surface4 w-full md:w-[calc(50%-8px)] lg:w-[calc(25%-12px)] shadow-md hover:shadow-xl hover:scale-[1.01] transition-all duration-200 cursor-pointer select-none border border-surface3-contrast/5"
      >
        <Box flex direction="col" className="gap-4 w-full">
          <Box flex direction="col" className="gap-2 items-start">
            
            <Text variant="h5" overrideClassName="primary-font font-bold tracking-tight text-surface4-contrast">
              {danceClass.name}
            </Text>
            <div className="w-fit bg-surface text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shadow-sm">
              {danceClass.category1}
            </div>
          </Box>

          <Box overrideClassName="grid grid-cols-2 gap-3 border-t border-surface3-contrast/10 pt-3 w-full text-xs">
            

            <Box flex direction="col" className="gap-2 text-left justify-start">
              <Box overrideClassName="flex items-start gap-1.5 opacity-80">
                <Clock size={13} className="shrink-0 mt-0.5" />
                <Box flex direction="col" className="leading-none">
                  <span className="font-semibold text-[11px]">{formatMeetingDays(danceClass.meeting_days)}</span>
                  <span className="text-[10px] opacity-70 mt-0.5">
                    {formatTimeRange(danceClass.start_time, danceClass.end_time)}
                  </span>
                </Box>
              </Box>

              <Box overrideClassName="flex items-start gap-1.5 opacity-80">
                <Calendar size={13} className="shrink-0 mt-0.5" />
                <Box flex direction="col" className="leading-none">
                  <span className="text-[10px] opacity-70">Session Dates</span>
                  <span className="font-medium text-[11px] mt-0.5">
                    {formatSessionRange(danceClass.start_date, danceClass.end_date)}
                  </span>
                </Box>
              </Box>
            </Box>
            <Box className="gap-1.5 flex flex-col items-end">
              <Box overrideClassName="flex items-center gap-1.5 text-primary font-bold text-xl">
                <DollarSign size={16} className="shrink-0" />
                <span>{danceClass.tuition.fee.toFixed(2)}</span>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box flex direction="row" justify="between" align="center" className="mt-4 border-t border-surface3-contrast/5 pt-3 w-full">
          <Box overrideClassName="flex items-center gap-1.5">
            <Users size={13} className={isOpen ? 'text-primary' : 'opacity-40'} />
            <Text variant="caption" color={isOpen ? 'primary' : 'surface'} overrideClassName="font-semibold text-xs">
              {isOpen
                ? `${danceClass.openings.calculated_openings} openings`
                : danceClass.waitlist
                  ? 'Waitlist available'
                  : 'Class full'}
            </Text>
          </Box>
          <Button
            variant={isOpen ? 'solid' : 'outline'}
            color="primary"
            size="sm"
            disabled={!isOpen}
            onClick={(e) => isOpen && openRegistration(danceClass.online_reg_link, e)}
          >
            {isOpen ? 'Register' : 'Full'}
          </Button>
        </Box>
      </Box>

      <Dialog
        open={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={danceClass.name}
        size="xl"
        actions={[
          {
            label: isOpen ? 'Complete Registration' : 'Class Full',
            color: 'primary',
            disabled: !isOpen,
            onClick: () => isOpen && window.open(danceClass.online_reg_link, '_blank', 'noopener,noreferrer'),
          },
        ]}
      >
        <Box flex direction="col" className="gap-5 py-2">
          <Box overrideClassName="flex flex-wrap items-center gap-2">
            <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-full">
              {danceClass.category1}
            </span>
            {danceClass.category2 && (
              <span className="bg-surface3-contrast/5 text-surface3-contrast/70 text-xs px-2.5 py-1 rounded-full">
                {danceClass.category2}
              </span>
            )}
          </Box>

          {danceClass.description && (
            <Box flex direction="col" className="gap-1.5">
              <Text variant="body2" overrideClassName="font-semibold opacity-60 text-xs uppercase tracking-wider">
                Overview
              </Text>
              <Text variant="body" overrideClassName="text-sm leading-relaxed whitespace-pre-wrap">
                {danceClass.description}
              </Text>
            </Box>
          )}

          <Box overrideClassName="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-surface3-contrast/5 p-4 rounded-xl text-sm">
            <Box flex direction="col" className="gap-3">
              <Box overrideClassName="flex items-center gap-2.5">
                <DollarSign size={16} className="text-primary" />
                <Box flex direction="col">
                  <span className="text-xs opacity-60">Tuition</span>
                  <span className="font-bold text-base text-primary">${danceClass.tuition.fee.toFixed(2)} / {danceClass.billing_cycle || 'Cycle'}</span>
                </Box>
              </Box>

              <Box overrideClassName="flex items-start gap-2.5">
                <Clock size={16} className="mt-0.5 opacity-70" />
                <Box flex direction="col">
                  <span className="text-xs opacity-60">Schedule</span>
                  <span className="font-semibold">{formatMeetingDays(danceClass.meeting_days)}</span>
                  <span className="text-xs opacity-70">{formatTimeRange(danceClass.start_time, danceClass.end_time)}</span>
                </Box>
              </Box>

              <Box overrideClassName="flex items-start gap-2.5">
                <Calendar size={16} className="mt-0.5 opacity-70" />
                <Box flex direction="col">
                  <span className="text-xs opacity-60">Dates & Session</span>
                  <span className="font-medium">{formatSessionRange(danceClass.start_date, danceClass.end_date)}</span>
                  {danceClass.session && <span className="text-xs opacity-70">{danceClass.session}</span>}
                </Box>
              </Box>
            </Box>

            <Box flex direction="col" className="gap-3 justify-start">
              <Box overrideClassName="flex items-center gap-2.5">
                <Users size={16} className="opacity-70" />
                <Box flex direction="col">
                  <span className="text-xs opacity-60">Availability</span>
                  <span className="font-semibold">
                    {isOpen ? `${danceClass.openings.calculated_openings} spots remaining` : 'No open spots'}
                  </span>
                </Box>
              </Box>

              <Box overrideClassName="flex items-start gap-2.5">
                <MapPin size={16} className="mt-0.5 opacity-70" />
                <Box flex direction="col">
                  <span className="text-xs opacity-60">Location / Room</span>
                  <span className="font-medium">{danceClass.location_name}</span>
                  {danceClass.room && <span className="text-xs opacity-70">Room: {danceClass.room}</span>}
                </Box>
              </Box>
            </Box>
          </Box>

          {danceClass.instructors?.length > 0 && (
            <Box flex direction="col" className="gap-1.5 border-t border-surface3-contrast/10 pt-3">
              <span className="text-xs opacity-60 font-semibold uppercase tracking-wider">Instructors</span>
              <span className="text-sm font-medium">{formatInstructors(danceClass.instructors)}</span>
            </Box>
          )}
        </Box>
      </Dialog>
    </>
  );
};