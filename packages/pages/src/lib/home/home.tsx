import { Box, Button, Text } from '@inithium/ui';
import React from 'react';
import { SocialIcon } from 'react-social-icons';

const Home: React.FC = () => {
  return (
    <Box padding="md" className='h-m-nav flex flex-col lg:flex-row'>
      <Box flex direction='col' justify='center' className='flex-1 px-5 md:px-10 lg:px-20'>
        <Text variant="h5" color="surface2-contrast" overrideClassName='primary-font'>The Dance & Movement Workshop</Text>
        <Text variant='body2'>The Dance and Movement Workshop is a community-focused studio offering classes for all ages. We foster a love of dance while building strong technical foundations. On weekends, we host inclusive workshops that welcome students from all studios, creating a shared space for growth, connection, and collaboration. Our Weekend Workshop classes are open to everyone ages 6 and up and are designed to make movement accessible, no matter your age or experience level. These classes are intended to allow all dance students to learn new styles of dance, workshop their weaknesses, and build confidence. Whether you're new to dance or a lifelong mover, this is a space to explore, create, and connect. Each week offers a fresh take on movement, led by passionate instructors who believe dance should be for every. body.</Text>
        <Box flex direction='row' fullWidth className='my-4'>
          <Box flex direction='col'>
            <Button color="primary" rounded>Contact</Button>
          </Box>
          <Box className='flex flex-row flex-1 items-center justify-start gap-4 pl-8'>
            <SocialIcon 
              url="https://www.facebook.com/thedanceandmovementworkshop?_rdr" 
              bgColor="#ea154a" 
              fgColor="#F5E9E6" 
              style={{ height: 25, width: 25 }}
            />
            <SocialIcon 
              url="https://www.instagram.com/thedanceandmovementworkshop/" 
              bgColor="#ea154a" 
              fgColor="#F5E9E6" 
              style={{ height: 25, width: 25 }}
            />
          </Box>
        </Box>
      </Box>
      <Box flex direction='col' justify='center' align='center' className='flex-1 min-h-0 px-5 md:px-40'>
        <img 
          src="http://localhost:3000/api/assets/by-key/e95b8553-01bd-484b-ab8f-e3697354b5b3.png" 
          className="h-full w-full max-h-full object-contain"
        />
      </Box>
    </Box>
  )
};

export default Home;