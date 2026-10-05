import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Shield } from 'lucide-react';

export const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | MRD CINEMA EDITZ</title>
      </Helmet>

      <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#121216] border border-[#24221C] space-y-6">
          <div className="flex items-center gap-3 text-[#F5C869]">
            <Shield className="w-8 h-8" />
            <h1 className="font-cinematic font-bold text-2xl sm:text-3xl text-white">PRIVACY POLICY</h1>
          </div>

          <p className="text-xs text-zinc-500">Last updated: October 2026</p>

          <section className="space-y-3 text-zinc-300 text-sm leading-relaxed">
            <h2 className="font-heading font-bold text-base text-white">1. Information We Collect</h2>
            <p>
              When you submit a project inquiry, create an account, or comment on videos on MRD CINEMA EDITZ, we may collect your name, email address, phone number, brand details, and IP address for security and spam prevention.
            </p>
          </section>

          <section className="space-y-3 text-zinc-300 text-sm leading-relaxed">
            <h2 className="font-heading font-bold text-base text-white">2. Video Media & Confidentiality</h2>
            <p>
              All client footage, raw assets, project files, and storyboards shared with MRD CINEMA EDITZ are kept strictly confidential under non-disclosure standards. We will never share or publish unreleased raw materials without written authorization.
            </p>
          </section>

          <section className="space-y-3 text-zinc-300 text-sm leading-relaxed">
            <h2 className="font-heading font-bold text-base text-white">3. Contact</h2>
            <p>
              For questions regarding this privacy policy, please contact us at <a href="mailto:contact@mrdcinemaeditz.com" className="text-[#F5C869]">contact@mrdcinemaeditz.com</a>.
            </p>
          </section>
        </div>
      </div>
    </>
  );
};
