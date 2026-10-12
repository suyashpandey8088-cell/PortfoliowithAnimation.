import { useRef, useState } from 'react';
import { profile, formspreeId } from '@/content/profile';
import { isConfigured } from '@/lib/links';
import { MaskedText, FadeUp } from './Reveal';
import { CrossMark, Starburst, HandArrow } from './graphics/Primitives';
import SocialIcon from './SocialIcon';

/**
 * CONTACT
 * ─────────────────────────────────────────────────────────────────────────
 * The form never lies about what happened.
 *
 *   mode = 'formspree'     a real endpoint is configured → POST and report
 *                          the actual HTTP result.
 *   mode = 'mailto'        no endpoint but a real address → hand a prefilled
 *                          message to the visitor's mail client and say
 *                          exactly that.
 *   mode = 'unconfigured'  neither → the form is visibly disabled with setup
 *                          instructions, and a working alternative contact
 *                          route is offered instead.
 *
 * There is no code path that reports success without a confirmed send.
 */

type Mode = 'formspree' | 'mailto' | 'unconfigured';
type Status = 'idle' | 'sending' | 'sent' | 'error';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function resolveMode(): Mode {
  if (formspreeId) return 'formspree';
  if (isConfigured(profile.contactEmail) && !profile.contactEmail.includes('example.com')) {
    return 'mailto';
  }
  return 'unconfigured';
}

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const EMPTY: FormState = { name: '', email: '', subject: '', message: '' };

export default function Contact() {
  const mode = resolveMode();
  const [values, setValues] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [serverMessage, setServerMessage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const set = (key: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((prev) => ({ ...prev, [key]: event.target.value }));
    // Clear a field's error as soon as the visitor edits it.
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!values.name.trim()) next.name = 'Please tell me your name.';
    if (!values.email.trim()) next.email = 'An email address is required.';
    else if (!EMAIL_RE.test(values.email.trim())) next.email = 'That email address does not look valid.';
    if (!values.subject.trim()) next.subject = 'Add a short subject.';
    if (!values.message.trim()) next.message = 'The message is empty.';
    else if (values.message.trim().length < 10) next.message = 'A little more detail, please — at least 10 characters.';

    setErrors(next);
    if (Object.keys(next).length > 0) {
      // Move focus to the first invalid field so keyboard users are not stranded.
      const firstKey = Object.keys(next)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${firstKey}"]`)?.focus();
      return false;
    }
    return true;
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus('idle');
    setServerMessage('');
    if (!validate()) {
      setStatus('error');
      setServerMessage('Some fields still need attention.');
      return;
    }

    if (mode === 'mailto') {
      const body = `${values.message}\n\n— ${values.name}\n${values.email}`;
      const url = `mailto:${profile.contactEmail}?subject=${encodeURIComponent(
        `[Portfolio] ${values.subject}`,
      )}&body=${encodeURIComponent(body)}`;
      window.location.href = url;
      setStatus('sent');
      setServerMessage(
        'Your email client should now be open with the message prefilled. Nothing was sent from this page — hit send in your mail app to complete it.',
      );
      return;
    }

    setStatus('sending');
    try {
      const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? `Request failed with status ${response.status}.`);
      }
      setStatus('sent');
      setServerMessage('Message delivered. I will get back to you as soon as I can.');
      setValues(EMPTY);
    } catch (error) {
      setStatus('error');
      setServerMessage(
        error instanceof Error
          ? `Could not send that: ${error.message}. Try again, or reach me another way below.`
          : 'Could not send that. Try again, or reach me another way below.',
      );
    }
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative overflow-hidden bg-ember text-ink"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="halftone absolute inset-x-0 top-0 h-56 text-ink/[0.07]" />
        <Starburst
          rays={20}
          className="absolute -right-24 -bottom-24 h-[28rem] w-[28rem] animate-spin-slow text-cobalt/20"
        />
        <div className="grain-layer absolute inset-0" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-4 pt-24 sm:px-6 sm:pt-32 lg:px-10 lg:pt-40">
        <FadeUp className="mb-10 flex items-center gap-3 font-mono text-[0.6rem] tracking-[0.3em] text-ink/55">
          <CrossMark className="h-3 w-3 text-cobalt" />
          <span>06 / CONTACT</span>
          <span className="h-px w-16 bg-ink/20" />
        </FadeUp>

        <MaskedText
          as="h2"
          id="contact-heading"
          lines={[
            "LET'S MAKE",
            <span key="2" className="text-cobalt">
              SOMETHING WEIRD.
            </span>,
            'AND USEFUL.',
          ]}
          className="font-display text-[clamp(2rem,7vw,6.2rem)] leading-[0.9] tracking-[-0.035em]"
        />

        <FadeUp delay={0.12} className="mt-8 max-w-2xl">
          <p className="text-[clamp(0.95rem,1.9vw,1.15rem)] leading-relaxed text-ink/75">
            Internships, collaborations, a problem worth solving, or just an idea you cannot
            stop thinking about — send it over. I read everything.
          </p>
        </FadeUp>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          {/* ── Form ─────────────────────────────────────────────────── */}
          <div className="relative border-2 border-ink bg-cream p-5 shadow-block-lg sm:p-8">
            {mode === 'unconfigured' ? (
              <div className="mb-6 border-2 border-ink bg-volt p-4">
                <p className="font-display text-[0.95rem] leading-tight">
                  CONTACT FORM NOT CONNECTED YET
                </p>
                <p className="mt-2 text-[0.82rem] leading-snug text-ink/75">
                  Add <code className="font-mono">VITE_FORMSPREE_ID</code> or{' '}
                  <code className="font-mono">VITE_CONTACT_EMAIL</code> in your Vercel
                  environment variables and this form goes live. Until then, use a direct
                  channel below.
                </p>
              </div>
            ) : null}

            <form
              ref={formRef}
              onSubmit={onSubmit}
              noValidate
              className="space-y-5"
              aria-disabled={mode === 'unconfigured'}
            >
              <fieldset disabled={mode === 'unconfigured'} className="space-y-5">
                <Field
                  id="contact-name"
                  name="name"
                  label="Name"
                  value={values.name}
                  onChange={set('name')}
                  error={errors.name}
                  autoComplete="name"
                />
                <Field
                  id="contact-email"
                  name="email"
                  label="Email"
                  type="email"
                  value={values.email}
                  onChange={set('email')}
                  error={errors.email}
                  autoComplete="email"
                />
                <Field
                  id="contact-subject"
                  name="subject"
                  label="Subject"
                  value={values.subject}
                  onChange={set('subject')}
                  error={errors.subject}
                  autoComplete="off"
                />
                <Field
                  id="contact-message"
                  name="message"
                  label="Message"
                  textarea
                  rows={5}
                  value={values.message}
                  onChange={set('message')}
                  error={errors.message}
                />
              </fieldset>

              <button
                type="submit"
                disabled={mode === 'unconfigured' || status === 'sending'}
                className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden border-2 border-ink bg-ink px-6 py-4 font-mono text-[0.68rem] tracking-[0.24em] text-cream uppercase transition-colors duration-200 hover:bg-cobalt disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
              >
                <span className="relative z-10">
                  {status === 'sending' ? 'Sending…' : 'Send message'}
                </span>
                <span
                  className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  {status === 'sending' ? (
                    <span className="block h-4 w-4 animate-spin rounded-full border-2 border-cream/30 border-t-cream" />
                  ) : (
                    <HandArrow towards="right" className="h-4 w-4" />
                  )}
                </span>
              </button>
            </form>

            {/* Status — polite, so screen readers hear the outcome once. */}
            <p
              role="status"
              aria-live="polite"
              className={`mt-5 min-h-[1.5rem] text-[0.82rem] leading-snug ${
                status === 'error'
                  ? 'font-medium text-flare'
                  : status === 'sent'
                    ? 'font-medium text-cobalt'
                    : 'text-ink/55'
              }`}
            >
              {serverMessage}
            </p>
          </div>

          {/* ── Direct channels ──────────────────────────────────────── */}
          <div>
            <p className="mb-5 font-mono text-[0.58rem] tracking-[0.28em] text-ink/50">
              OR FIND ME HERE /
            </p>
            <ul className="space-y-3">
              {profile.socials.map((social) => {
                const live = isConfigured(social.url);
                return (
                  <li key={social.id}>
                    {live ? (
                      <a
                        href={social.url}
                        {...(social.url.startsWith('http')
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                        className="group flex items-center gap-4 border-2 border-ink bg-cream px-4 py-4 shadow-block transition-transform duration-200 hover:-translate-y-1"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-ink bg-ink text-cream transition-colors duration-200 group-hover:bg-cobalt">
                          <SocialIcon icon={social.icon} className="h-5 w-5" />
                        </span>
                        <span className="min-w-0">
                          <span className="block font-display text-[0.95rem] leading-tight">
                            {social.label}
                          </span>
                          <span className="block truncate font-mono text-[0.58rem] tracking-[0.1em] text-ink/55">
                            {social.handle}
                          </span>
                        </span>
                        <span
                          className="ml-auto h-5 w-5 shrink-0 transition-transform duration-300 group-hover:rotate-45"
                          aria-hidden="true"
                        >
                          <HandArrow towards="right" className="h-5 w-5" />
                        </span>
                      </a>
                    ) : (
                      <span className="flex items-center gap-4 border-2 border-dashed border-ink/35 px-4 py-4">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-dashed border-ink/35 text-ink/35">
                          <SocialIcon icon={social.icon} className="h-5 w-5" />
                        </span>
                        <span className="min-w-0">
                          <span className="block font-display text-[0.95rem] leading-tight text-ink/45">
                            {social.label}
                          </span>
                          <span className="block truncate font-mono text-[0.58rem] tracking-[0.1em] text-ink/35">
                            Not configured yet
                          </span>
                        </span>
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>

            <FadeUp delay={0.15} className="mt-8 border-2 border-ink bg-cobalt p-5 text-cream">
              <p className="font-display text-[1.05rem] leading-tight">CURRENTLY</p>
              <p className="mt-2 text-[0.88rem] leading-relaxed text-cream/80">
                {profile.availability} — open to internships, freelance builds and
                collaborations across AI, web and software solutions.
              </p>
              <p className="mt-3 font-mono text-[0.55rem] tracking-[0.16em] text-cream/55">
                {profile.location.toUpperCase()}
              </p>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}

interface FieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  type?: string;
  textarea?: boolean;
  rows?: number;
  autoComplete?: string;
}

function Field({
  id,
  name,
  label,
  value,
  onChange,
  error,
  type = 'text',
  textarea = false,
  rows = 4,
  autoComplete,
}: FieldProps) {
  const describedBy = error ? `${id}-error` : undefined;
  const shared = {
    id,
    name,
    value,
    onChange,
    'aria-invalid': Boolean(error),
    'aria-describedby': describedBy,
    required: true,
    autoComplete,
    className: `w-full border-2 border-ink bg-transparent px-4 py-3 text-[0.95rem] text-ink outline-none transition-colors placeholder:text-ink/35 focus:bg-volt/25 ${
      error ? 'border-flare' : ''
    }`,
  };

  return (
    <div>
      <label htmlFor={id} className="mb-2 block font-mono text-[0.55rem] tracking-[0.24em] uppercase">
        {label} <span className="text-flare">*</span>
      </label>
      {textarea ? (
        <textarea rows={rows} {...shared} />
      ) : (
        <input type={type} {...shared} />
      )}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-[0.75rem] font-medium text-flare">
          {error}
        </p>
      ) : null}
    </div>
  );
}
