function sendEmail(email: string, message: string) {
  return fetch('https://formsubmit.co/ajax/484791fe7a5940d0627a35e328010aed', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      email,
      subject: 'New message from teaching website',
      message,
    }),
  }).then((r) => r.json());
}

export function getContactFormData() {
  const statuses = ['default', 'sending', 'success', 'error'] as const;

  type Status = (typeof statuses)[number];

  const obj = {
    email: '',
    content: '',
    status: 'default' as Status,
    statuses,
    showInvalidStyles: false,
    async onSubmit() {
      try {
        this.status = 'sending';

        (window as any).umami.track('Contact form submission data', { email: this.email, content: this.content });

        await sendEmail(this.email, this.content);

        this.email = '';
        this.content = '';
        this.status = 'success';
      } catch (error) {
        this.status = 'error';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).umami.track('Contact form error', { error: (error as any).message });
      } finally {
        this.showInvalidStyles = false;
        setTimeout(() => (this.status = 'default'), 5_000);
      }
    },
    statusText(status: Status) {
      return {
        default: null,
        sending: 'Sending',
        success: "Your message has been sent! I'll get back to you ASAP.",
        error: 'There was an error sending your message. Please try again later.',
      }[status];
    },
    statusClass(status: Status) {
      if (status === 'success') return 'alert alert-success';
      if (status === 'error') return 'alert alert-error';
      if (status === 'sending') return 'loading-text opacity-75';
      return null;
    },
  };

  return obj;
}
