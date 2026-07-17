import React, { useState } from 'react';
import { Box, Text, Input, Button } from '@inithium/ui';
import { MapPin, Phone, Mail, Clock, RefreshCw } from 'lucide-react';
import { SocialIcon } from 'react-social-icons';
import { useDispatch, useSelector } from 'react-redux';
import { selectActiveUser, showAlert } from '@inithium/store';

interface ContactFormState {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  captchaValue: string;
}

interface FormErrors {
  firstName: boolean;
  email: boolean;
  subject: boolean;
  message: boolean;
  captchaValue: boolean;
}

interface CaptchaChallenge {
  text: string;
  solution: string;
}

const generateChallenge = (): CaptchaChallenge => {
  const num1 = Math.floor(Math.random() * 9) + 1;
  const num2 = Math.floor(Math.random() * 9) + 1;
  return {
    text: `What is ${num1} + ${num2}?`,
    solution: String(num1 + num2),
  };
};

const createInitialFormState = (user: any): ContactFormState => ({
  firstName: user?.first_name ?? '',
  lastName: user?.last_name ?? '',
  email: user?.email ?? '',
  subject: '',
  message: '',
  captchaValue: '',
});

const createInitialErrors = (): FormErrors => ({
  firstName: false,
  email: false,
  subject: false,
  message: false,
  captchaValue: false,
});

const ContactPage: React.FC = () => {
  const dispatch = useDispatch();
  const activeUser = useSelector(selectActiveUser);
  const [form, setForm] = useState<ContactFormState>(() => createInitialFormState(activeUser));
  const [errors, setErrors] = useState<FormErrors>(createInitialErrors);
  const [challenge, setChallenge] = useState<CaptchaChallenge>(generateChallenge);

  const handleRefreshCaptcha = () => {
    setChallenge(generateChallenge());
    setForm((prev) => ({ ...prev, captchaValue: '' }));
    setErrors((prev) => ({ ...prev, captchaValue: false }));
  };

  const updateField = (field: keyof ContactFormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: false }));
  };

  const handleValidationAndSubmit = () => {
    const isCaptchaInvalid = !form.captchaValue.trim() || form.captchaValue.trim() !== challenge.solution;

    const newErrors = {
      firstName: !form.firstName.trim(),
      email: !form.email.trim() || !form.email.includes('@') || !form.email.includes('.'),
      subject: !form.subject.trim(),
      message: !form.message.trim(),
      captchaValue: isCaptchaInvalid,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) {
      if (isCaptchaInvalid) {
        setChallenge(generateChallenge());
      }
      dispatch(
        showAlert({
          message: 'There was a problem submitting your form. Please correct the highlighted errors.',
          severity: 'danger',
          closeable: false,
          position: 'bottom-right',
          animation_object: {
            entry: 'fadeInRight',
            exit: 'fadeOutRight',
            entrySpeed: 'fast',
            exitSpeed: 'faster',
          },
        })
      );
      return;
    }

    dispatch(
      showAlert({
        message: 'Form verified and submitted successfully!',
        severity: 'success',
        closeable: true,
        position: 'bottom-right',
        animation_object: {
          entry: 'fadeInRight',
          exit: 'fadeOutRight',
          entrySpeed: 'fast',
          exitSpeed: 'faster',
        },
      })
    );
  };

  return (
    <Box padding="md" className="h-m-nav flex flex-col lg:flex-row gap-6">
      <Box
        flex
        direction="col"
        color="surface"
        borderRadius="lg"
        className="w-full lg:w-[60%] gap-5"
      >
        <Box flex direction="col" className="gap-1">
          <Text variant="h5" color="surface-contrast" overrideClassName="primary-font">Get In Touch</Text>
          <Text variant="body2" color="surface2-contrast">
            Have a question about classes or events? Send us a message and we will get back to you soon.
          </Text>
        </Box>

        <Box flex direction="col" className="gap-4 md:flex-row items-start">
          <Input
            label="First Name"
            value={form.firstName}
            onChange={updateField('firstName')}
            error={errors.firstName}
            helperText={errors.firstName ? 'First name is required.' : undefined}
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
          error={errors.email}
          helperText={errors.email ? 'Please provide a valid email address.' : undefined}
          fullWidth
        />

        <Input
          label="Subject"
          value={form.subject}
          onChange={updateField('subject')}
          error={errors.subject}
          helperText={errors.subject ? 'Subject field cannot be empty.' : undefined}
          fullWidth
        />

        <div className="w-full">
          <textarea
            placeholder="Tell us how we can help..."
            value={form.message}
            onChange={updateField('message')}
            rows={6}
            className={`w-full resize-none rounded-md border bg-transparent px-4 py-3 text-sm text-surface-contrast placeholder-slate-400 outline-none transition-all duration-200 focus:border-2 ${
              errors.message ? 'border-danger focus:border-danger' : 'border-slate-300 focus:border-primary'
            }`}
          />
          {errors.message && (
            <p className="mt-1 text-[11px] leading-tight text-danger">
              Message content is required.
            </p>
          )}
        </div>

        <Box 
          flex 
          direction="col" 
          className={`gap-3 rounded-md border w-full max-w-sm bg-surface2 px-4 py-3 ${
            errors.captchaValue ? 'border-danger!' : 'border-slate-300!'
          }`}
        >
          <Box flex align="center" justify="between" className="bg-white rounded px-3 py-2 border border-slate-200">
            <Text variant="body" color="primary" overrideClassName="font-mono font-bold tracking-wider select-none">
              {challenge.text}
            </Text>
            <button
              type="button"
              onClick={handleRefreshCaptcha}
              className="text-slate-500 hover:text-primary transition-colors p-1"
            >
              <RefreshCw size={16} />
            </button>
          </Box>
          <Input
            label="Security Verification"
            value={form.captchaValue}
            onChange={updateField('captchaValue')}
            error={errors.captchaValue}
            helperText={errors.captchaValue ? 'Incorrect code answer.' : undefined}
            fullWidth
          />
        </Box>

        <Button 
          onClick={handleValidationAndSubmit} 
          color="primary" 
          variant="solid" 
          size="lg" 
          fullWidth 
          trailingIcon="send"
        >
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
          <Text variant="h5" color="surface4-contrast" overrideClassName="primary-font">Contact Information</Text>
          <Text variant="body2" color="surface4-contrast">
            We would love to hear from you. Reach out through any of the channels below.
          </Text>
        </Box>

        <Box flex direction="col" className="gap-4">
          <Box flex align="start" className="gap-3">
            <MapPin size={20} className="text-surface4-contrast shrink-0 mt-0.5" />
            <Text variant="body2" color="primary">64007 Van Dyke Rd. Washington, MI 48095</Text>
          </Box>
          <Box flex align="center" className="gap-3">
            <Phone size={20} className="text-surface4-contrast shrink-0" />
            <Text variant="body2" color="primary">(586)-201-9347</Text>
          </Box>
          <Box flex align="center" className="gap-3">
            <Mail size={20} className="text-surface4-contrast shrink-0" />
            <Text variant="body2" color="primary">thedanceandmovementworkshop@gmail.com</Text>
          </Box>
          <Box flex className="gap-3">
            <Clock size={20} className="text-surface4-contrast shrink-0" />
            <Box flex direction="col">
              <Text variant="body2" color="primary">Mon: 3PM - 8:30PM</Text>
              <Text variant="body2" color="primary">Tue: 3PM - 8:30PM</Text>
              <Text variant="body2" color="primary">Wed: 3PM - 8:30PM</Text>
              <Text variant="body2" color="primary">Thu: 3PM - 8:30PM</Text>
              <Text variant="body2" color="primary">Fri: Closed</Text>
              <Text variant="body2" color="primary">Sat: 11AM - 3PM</Text>
              <Text variant="body2" color="primary">Sun: Closed</Text>
            </Box>
          </Box>
        </Box>

        <Box borderRadius="lg" className="overflow-hidden w-full h-64">
          <iframe
            title="The Dance and Movement Workshop Location"
            src="https://www.google.com/maps?q=64007+Van+Dyke+Rd,+Washington,+MI+48095&output=embed"
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