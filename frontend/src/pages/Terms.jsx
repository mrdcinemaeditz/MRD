import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FileText } from 'lucide-react';

export const Terms = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service | MRD CINEMA EDITZ</title>
      </Helmet>

      <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#121216] border border-[#24221C] space-y-6">
          <div className="flex items-center gap-3 text-[#F5C869]">
            <FileText className="w-8 h-8" />
            <h1 className="font-cinematic font-bold text-2xl sm:text-3xl text-white">TERMS OF SERVICE</h1>
          </div>

          <p className="text-xs text-zinc-500">Last updated: October 2026</p>

          <section className="space-y-3 text-zinc-300 text-sm leading-relaxed">
            <h2 className="font-heading font-bold text-base text-white">1. Service Agreements & Turnaround</h2>
            <p>
              Video post-production timelines and deliverables are scoped upon proposal acceptance. Standard rush services may incur additional fees as agreed upon in the project statement of work.
            </p>
          </section>

          <section className="space-y-3 text-zinc-300 text-sm leading-relaxed">
            <h2 className="font-heading font-bold text-base text-white">2. Copyright & Intellectual Property</h2>
            <p>
              Upon final payment completion, clients receive full commercial usage rights to final rendered deliverables. MRD CINEMA EDITZ retains portfolio display rights unless an explicit white-label agreement is executed.
            </p>
          </section>
        </div>
      </div>
    </>
  );
};
