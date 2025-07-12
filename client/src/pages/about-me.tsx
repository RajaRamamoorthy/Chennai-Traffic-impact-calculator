import { useEffect } from "react";
import { SEO } from "@/components/seo";

export default function AboutMe() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO 
        title="About Me"
        description="Learn about Raja Ramamoorthy R, the creator of Chennai Traffic Impact Calculator, and his journey from experiencing Chennai traffic as a commuter to building this tool for sustainable transportation choices."
        keywords="about me, Raja Ramamoorthy, Chennai traffic, sustainability, product manager, commute journey, transportation choices"
        canonical="https://chennaitrafficcalc.in/about-me"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Raja Ramamoorthy R",
          "jobTitle": "Product Manager",
          "description": "Creator of Chennai Traffic Impact Calculator with 13 years experience in media and storytelling",
          "url": "https://chennaitrafficcalc.in/about-me",
          "knowsAbout": ["Chennai Traffic", "Product Management", "Sustainable Transportation", "Media", "Storytelling"],
          "alumniOf": "CIT",
          "workLocation": {
            "@type": "Place",
            "name": "Chennai, India"
          },
          "creator": {
            "@type": "WebApplication",
            "name": "Chennai Traffic Impact Calculator",
            "url": "https://chennaitrafficcalc.in"
          }
        }}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-slate max-w-none">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">About Me</h1>
            
            <div className="text-lg leading-relaxed text-slate-700 space-y-6">
              <p className="text-xl font-medium text-slate-900">
                Hi, I'm Raja Ramamoorthy R.
              </p>
              
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">My Chennai Commute Journey</h2>
                <p>
                  My relationship with Chennai traffic began in 2012 at CIT Nagar signal, strategically positioning myself to catch MTC buses to Mount Road. Standing in sun and rain, I'd watch for the right bus approaching, then navigate through auto-rickshaws and cars at the signal to reach the bus door. The real challenge was grabbing onto the footboard while the bus was still moving, squeezing between other passengers, and holding on tight as we weaved through traffic. Sometimes I'd have to jump off before my stop if the crowd was too much, then walk the remaining distance.
                </p>
                
                <p>
                  My journey evolved from walking to Saidapet Bus Stop instead of standing in CIT Nagar to get seats in the buses, to riding pillion with a friend from Tiruvallikeni, to bringing my sedan from hometown (only to realize how inefficient a large car is for one person in Chennai traffic). I sold the car, switched to two-wheeler, and now primarily use Metro for office.
                </p>
                
                <p>
                  In 12 years, I've experienced Chennai traffic from every angle: bus passenger, pillion rider, car driver, two-wheeler rider, Metro user, and auto passenger (my favorite for observing the city).
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">Who I Am</h2>
                <p>
                  I'm a Product Manager with 13 years in media and storytelling. My journalism background taught me to observe patterns and translate complex information into accessible insights, skills that proved invaluable building this calculator.
                </p>
                
                <p>
                  When not analyzing traffic, I ride around Chennai (quite the petrolhead despite environmental consciousness), learn guitar, game on PS5, or observe cats' curiosity. My preferred Chennai transport is actually auto. There's something peaceful about watching roads, people, and life unfold.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">Why This Project Exists</h2>
                <p>
                  Daily on Chennai roads, I see patterns: too many single-occupant cars, people driving while on phones (slowing traffic), and constant increase in traffic entropy that affects everyone. I understand personal vehicle needs, but where's the line? I've seen single drivers taking Porsche Cayennes to parks for walks and Fortuner SUVs for daily gym commutes.
                </p>
                
                <p>
                  Watching Chennai traffic evolve over the past decade, I felt compelled to help people introspect about commuting choices. The "aha moment": self-accountability is key to societal change.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">The Technical Journey</h2>
                <p>
                  I built this entire application using AI tools, pushing them to see how close they could get to production-ready. There were moments when everything broke and I rebuilt from scratch, but trial-and-error tested my patience too and taught me immense amounts about modern development.
                </p>
                
                <p>
                  Working weekends and evenings over two weeks, I created something combining Chennai-specific traffic data, real emission factors, and practical alternatives.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">My Philosophy</h2>
                <p>
                  I'm honest about my impact: my commute score is 53. Like everyone, I'm imperfect. But, I see an imperfect world trying to do perfect things, and that's okay. While not extensively environmentally conscious everywhere, I focus on things I can influence.
                </p>
                
                <p>
                  This tool isn't meant to preach, but help people introspect and realize small, conscious choices can create collective change in Chennai's traffic and air quality.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">Vision Forward</h2>
                <p>
                  No rigid long-term plan currently. I'd love this project to grow organically with collaborators and community input. Donations help cover API and hosting costs, keeping the tool free for all Chennai commuters.
                </p>
                
                <p>
                  I believe in planned transport infrastructure with predictable roads and more people choosing public transport. This calculator is one small step toward that vision.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">Let's Connect</h2>
                <p>
                  Ideas, feedback, or collaboration? Reach out at contact@chennaitrafficcalc.in. I'm open to partnerships and conversations about making Chennai traffic more sustainable.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 mt-6 mb-6">
                  <a 
                    href="https://www.linkedin.com/in/rajaramamoorthy/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn Profile
                  </a>
                  
                  <a 
                    href="https://substack.com/@rajaramamoorthy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
                    </svg>
                    Substack Newsletter
                  </a>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Other Projects & Demos</h3>
                  <div className="flex flex-col gap-3">
                    <a 
                      href="https://howmanymore.xyz/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      How Many More? | An interactive tool exposing Gaza Genocide
                    </a>
                    
                    <a 
                      href="https://gaza-counter.replit.app/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Gaza Population Crisis Tracker - Real-Time Humanitarian Data
                    </a>
                    
                    <a 
                      href="https://gaza-genocide-threshold.replit.app/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Gaza - The Genocide Recognition Calculator
                    </a>
                  </div>
                </div>
                
                <p>
                  P.S. I still choose autos for short trips. There's something magical about experiencing Chennai through those open windows.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}