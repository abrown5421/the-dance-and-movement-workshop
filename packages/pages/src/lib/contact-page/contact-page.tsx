import React, { useState } from 'react';
import { Box, Text, Input, Button } from '@inithium/ui';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { SocialIcon } from 'react-social-icons';

interface ContactFormState {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  captchaChecked: boolean;
}

const initialFormState: ContactFormState = {
  firstName: '',
  lastName: '',
  email: '',
  subject: '',
  message: '',
  captchaChecked: false,
};

const ContactPage: React.FC = () => {
  const [form, setForm] = useState<ContactFormState>(initialFormState);

  const updateField = (field: keyof ContactFormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const toggleCaptcha = () => {
    setForm((prev) => ({ ...prev, captchaChecked: !prev.captchaChecked }));
  };

  return (
    <Box padding="md" className="h-m-nav flex flex-col lg:flex-row gap-6">
      <Box
        flex
        direction="col"
        color="surface"
        padding="xl"
        borderRadius="lg"
        className="w-full lg:w-[60%] gap-5"
      >
        <Box flex direction="col" className="gap-1">
          <Text variant="h5" color="surface-contrast" overrideClassName='primary-font'>Get In Touch</Text>
          <Text variant="body2" color="surface2-contrast">
            Have a question about classes or events? Send us a message and we will get back to you soon.
          </Text>
        </Box>

        <Box flex direction="col" className="gap-4 md:flex-row">
          <Input
            label="First Name"
            value={form.firstName}
            onChange={updateField('firstName')}
            fullWidth
          />
          <Input
            label="Last Name"
            value={form.lastName}
            onChange={updateField('lastName')}
            fullWidth
          />
        </Box>

        <Input
          label="Email Address"
          leadingIcon="mail"
          value={form.email}
          onChange={updateField('email')}
          fullWidth
        />

        <Input
          label="Subject"
          value={form.subject}
          onChange={updateField('subject')}
          fullWidth
        />

        <textarea
          placeholder="Tell us how we can help..."
          value={form.message}
          onChange={updateField('message')}
          rows={6}
          className="w-full resize-none rounded-md border border-slate-300 bg-transparent px-4 py-3 text-sm text-surface-contrast placeholder-slate-400 outline-none transition-all duration-200 focus:border-2 focus:border-primary"
        />

        <Box
          flex
          align="center"
          className="gap-3 rounded-md border border-slate-300 bg-surface2 px-4 py-3 w-fit"
        >
          <button
            type="button"
            onClick={toggleCaptcha}
            aria-pressed={form.captchaChecked}
            className={`flex h-6 w-6 items-center justify-center rounded border-2 transition-colors ${
              form.captchaChecked ? 'border-primary bg-primary' : 'border-slate-400 bg-transparent'
            }`}
          >
            {form.captchaChecked && <span className="text-primary-contrast text-xs">✓</span>}
          </button>
          <Text variant="body2" color="surface-contrast">I&apos;m not a robot</Text>
        </Box>

        <Button color="primary" variant="solid" size="lg" fullWidth trailingIcon="send">
          Send Message
        </Button>
      </Box>

      <Box
        flex
        direction="col"
        color="surface4"
        padding="xl"
        borderRadius="lg"
        className="w-full lg:w-[40%] gap-6"
      >
        <Box flex direction="col" className="gap-1">
          <Text variant="h5" color="surface4-contrast" overrideClassName='primary-font'>Contact Information</Text>
          <Text variant="body2" color="surface4-contrast">
            We would love to hear from you. Reach out through any of the channels below.
          </Text>
        </Box>

        <Box flex direction="col" className="gap-4">
          <Box flex align="start" className="gap-3">
            <MapPin size={20} className="text-surface4-contrast shrink-0 mt-0.5" />
            <Text variant="body2" color="primary">64200 Van Dyke Ave, Washington, MI 48095</Text>
          </Box>
          <Box flex align="center" className="gap-3">
            <Phone size={20} className="text-surface4-contrast shrink-0" />
            <Text variant="body2" color="primary">555-555-5555</Text>
          </Box>
          <Box flex align="center" className="gap-3">
            <Mail size={20} className="text-surface4-contrast shrink-0" />
            <Text variant="body2" color="primary">thedanceandmovementworkshop@gmail.com</Text>
          </Box>
          <Box flex className="gap-3">
            <Clock size={20} className="text-surface4-contrast shrink-0" />
            <Box flex direction="col">
              <Text variant="body2" color="primary">Mon: 9AM - 7PM</Text>
              <Text variant="body2" color="primary">Tue: 9AM - 7PM</Text>
              <Text variant="body2" color="primary">Wed: 9AM - 7PM</Text>
              <Text variant="body2" color="primary">Thu: 9AM - 7PM</Text>
              <Text variant="body2" color="primary">Fri: 9AM - 7PM</Text>
              <Text variant="body2" color="primary">Sat: 9AM - 7PM</Text>
              <Text variant="body2" color="primary">Sun: 9AM - 7PM</Text>
            </Box>
          </Box>
        </Box>


        <Box borderRadius="lg" className="overflow-hidden w-full h-64">
          <iframe
            title="The Dance and Movement Workshop Location"
            src="https://www.google.com/maps?q=64200+Van+Dyke+Ave,+Washington,+MI+48095&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </Box>
        
        <Box flex align="center" className="gap-3">
          <SocialIcon 
            url="https://www.facebook.com/thedanceandmovementworkshop?_rdr" 
            bgColor="#ea154a" 
            fgColor="#F5E9E6" 
            style={{ height: 35, width: 35 }}
          />
          <SocialIcon 
            url="https://www.instagram.com/thedanceandmovementworkshop/" 
            bgColor="#ea154a" 
            fgColor="#F5E9E6" 
            style={{ height: 35, width: 35 }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ContactPage;