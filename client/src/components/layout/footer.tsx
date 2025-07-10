import { Link } from "wouter";
import { useState } from "react";
import { FeedbackModal } from "@/components/ui/feedback-modal";
import { DonationButton } from "@/components/ui/donation-button";

export function Footer() {
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  return (
    <>
    <footer className="bg-white border-t border-slate-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div id="about-section">
            <h3 className="font-semibold text-slate-900 mb-4">About</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/how-it-works" className="hover:text-slate-900">How it works</Link></li>
              <li><Link href="/methodology" className="hover:text-slate-900">Methodology</Link></li>
              <li><Link href="/data-sources" className="hover:text-slate-900">Data sources</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <button 
                  onClick={() => setFeedbackModalOpen(true)}
                  className="hover:text-slate-900 text-left"
                >
                  Contact/Feedback
                </button>
              </li>
            </ul>
          </div>
          <div></div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Donate</h3>
            <div className="space-y-3">
              <p className="text-sm text-slate-600 leading-relaxed">
                Your donation helps pay our map-API bills and keeps the tool free for everyone. 🙏
              </p>
              <DonationButton />
              <div className="text-xs text-slate-500">
                <Link href="/support" className="hover:text-slate-700 underline">
                  Is my payment secure? Where does the money go?
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-200 mt-8 pt-8 text-center text-sm text-slate-600">
          <p>&copy; 2025 Chennai Traffic Impact Calculator. Made with ❤️ for Chennai commuters.</p>
        </div>
      </div>
    </footer>
    
    <FeedbackModal open={feedbackModalOpen} onOpenChange={setFeedbackModalOpen} />
    </>
  );
}
