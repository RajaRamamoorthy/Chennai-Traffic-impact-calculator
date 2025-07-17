import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Share, RotateCcw, Clock, Users } from "lucide-react";
import { CalculationResult } from "@/types/calculator";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import { formatNumber } from "@/lib/utils";

interface ResultsStepProps {
  results: CalculationResult;
  onRestart: () => void;
}

export function ResultsStep({ results, onRestart }: ResultsStepProps) {
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const { toast } = useToast();
  const scoreCardRef = useRef<HTMLDivElement>(null);

  // Calculate comparison values for universal comparisons
  const calculateComparisons = () => {
    const monthlyCost = results.monthlyCost;
    const annualCost = monthlyCost * 12;
    const dailyCost = Math.round(monthlyCost / 22); // Assuming 22 working days
    
    // Chennai average costs (approximate)
    const activaEmi = 3500; // Approximate EMI for Honda Activa
    const mobileDataCost = 299; // Popular unlimited plan
    const movieTicket = 200; // Average multiplex ticket
    const ottMonthly = 149; // Basic streaming plan
    const mealCost = 120; // Decent meal at local restaurant
    const electricityUnit = 6; // Approximate cost per unit
    const gymMonthly = 1500; // Local gym membership
    
    // Calculate actual savings compared to Chennai average
    const chennaiAverageCommute = 2500; // Average monthly commute cost
    const savingsVsAverage = chennaiAverageCommute - monthlyCost;
    
    return {
      monthlyCost,
      annualCost,
      dailyCost,
      activaPercentage: Math.round((monthlyCost / activaEmi) * 100),
      mobileDataMonths: Math.round(monthlyCost / mobileDataCost),
      movieTickets: Math.round(monthlyCost / movieTicket),
      ottMonths: Math.round(monthlyCost / ottMonthly),
      meals: Math.round(monthlyCost / mealCost),
      electricityUnits: Math.round(monthlyCost / electricityUnit),
      gymMonths: Math.round(monthlyCost / gymMonthly),
      savingsVsAverage: Math.max(0, savingsVsAverage),
      isAboveAverage: monthlyCost > chennaiAverageCommute
    };
  };

  const comparisons = calculateComparisons();

  // Score-based messaging as per requirements
  const getScoreBasedMessaging = () => {
    const score = results.score;
    const monthlyCost = results.monthlyCost;
    const annualCost = monthlyCost * 12;
    const dailyCost = Math.round(monthlyCost / 22);
    const potentialSavings = Math.max(...results.alternatives.map(alt => alt.costSavings));
    
    if (score <= 30) {
      // EXCELLENT SCORE
      return {
        hero: "You've mastered the Chennai commute! 🎯",
        moneyLine: `Spending only ₹${formatNumber(monthlyCost)}/month`,
        context: comparisons.savingsVsAverage > 0 
          ? `That's ₹${formatNumber(comparisons.savingsVsAverage)} less than most commuters`
          : "Among Chennai's most efficient commuters",
        shareHook: "Share your commute hack",
        shareText: `My Chennai commute costs just ₹${formatNumber(monthlyCost)}/month ✨\nBelow city average! Calculate yours:`,
        theme: "green"
      };
    } else if (score <= 50) {
      // GOOD SCORE
      return {
        hero: "Smart commuting with room for optimization! 👀",
        moneyLine: `Currently spending ₹${formatNumber(monthlyCost)}/month`,
        context: "Better than 60% of Chennai, but could optimize further",
        shareHook: "Compare with friends",
        shareText: `Interesting - my Chennai commute: ₹${formatNumber(monthlyCost)}/month\nRight at city average. Check yours:`,
        theme: "blue"
      };
    } else if (score <= 70) {
      // MODERATE SCORE
      return {
        hero: `Your real commute cost: ₹${formatNumber(monthlyCost)}/month 💸`,
        moneyLine: `That's ₹${formatNumber(annualCost)} per year on just getting to work`,
        context: "Higher than 70% of Chennai commuters",
        shareHook: "This surprised me...",
        shareText: `Just calculated my Chennai commute cost: ₹${formatNumber(monthlyCost)}/month! 😮\nThat's more than I realized. What's yours?`,
        theme: "orange"
      };
    } else {
      // HIGH SCORE
      return {
        hero: `Whoa! ₹${formatNumber(monthlyCost)}/month on commuting? 🚨`,
        moneyLine: `That's ₹${formatNumber(dailyCost)} every single working day`,
        context: "Among Chennai's costliest 20% commutes",
        shareHook: "Check if yours is similar",
        shareText: `Just calculated my Chennai commute cost: ₹${formatNumber(monthlyCost)}/month! 😮\nThat's more than I realized. What's yours?`,
        theme: "red"
      };
    }
  };

  const messaging = getScoreBasedMessaging();

  // Theme configuration based on score
  const getThemeConfig = () => {
    const themeMap = {
      green: {
        primary: "text-green-600",
        bg: "bg-green-50",
        border: "border-green-200",
        gradient: "from-green-50 to-emerald-50",
        borderColor: "border-green-200"
      },
      blue: {
        primary: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-200",
        gradient: "from-blue-50 to-indigo-50",
        borderColor: "border-blue-200"
      },
      orange: {
        primary: "text-orange-600",
        bg: "bg-orange-50",
        border: "border-orange-200",
        gradient: "from-orange-50 to-yellow-50",
        borderColor: "border-orange-200"
      },
      red: {
        primary: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200",
        gradient: "from-red-50 to-orange-50",
        borderColor: "border-red-200"
      }
    };
    return themeMap[messaging.theme as keyof typeof themeMap];
  };

  const theme = getThemeConfig();

  const getScoreColor = (score: number) => {
    if (score <= 30) return "text-green-600 bg-green-50";
    if (score <= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getScoreLabel = (score: number) => {
    if (score <= 30) return "Low Impact";
    if (score <= 60) return "Medium Impact";
    return "High Impact";
  };

  const getConfidenceBadge = (level: string) => {
    const colors = {
      A: "bg-green-100 text-green-800",
      B: "bg-yellow-100 text-yellow-800",
      C: "bg-red-100 text-red-800"
    };
    return colors[level as keyof typeof colors] || colors.C;
  };

  const handleShare = async () => {
    // Prevent multiple simultaneous share operations
    if (isSharing) return;

    setIsSharing(true);

    try {
      const shareUrl = 'https://chennaitrafficcalc.in?utm_source=share';
      const shareText = messaging.shareText;
      const fullShareText = `${shareText} ${shareUrl}`;

      // Step 1: Copy text to clipboard first
      let textCopied = false;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(fullShareText);
          textCopied = true;
        } else {
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = fullShareText;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();

          if (document.execCommand('copy')) {
            textCopied = true;
          }

          document.body.removeChild(textArea);
        }
      } catch (clipboardError) {
        console.error('Clipboard copy failed:', clipboardError);
        // Continue to image sharing even if text copy fails
      }

      // Show toast that text is copied
      if (textCopied) {
        toast({
          title: "Text copied!",
          description: "Now sharing image. You can paste the text separately if needed.",
        });
      }

      // Step 2: Generate and share image
      let imageFile: File | null = null;
      if (scoreCardRef.current) {
        try {
          // Temporarily make the element visible for screenshot
          const element = scoreCardRef.current;
          element.style.visibility = 'visible';
          element.style.opacity = '1';
          element.style.position = 'fixed';
          element.style.top = '0';
          element.style.left = '0';
          element.style.zIndex = '9999';

          // Generate canvas
          const canvas = await html2canvas(element, {
            width: 600,
            height: element.scrollHeight,
            backgroundColor: '#ffffff',
            scale: 2, // Higher quality
            useCORS: true,
            logging: false
          });

          // Hide the element again
          element.style.visibility = 'hidden';
          element.style.opacity = '0';
          element.style.zIndex = '-1';

          // Convert canvas to blob
          const blob = await new Promise<Blob>((resolve) => {
            canvas.toBlob((blob) => {
              resolve(blob!);
            }, 'image/png', 0.9);
          });

          // Create file from blob
          imageFile = new File([blob], 'traffic-impact-score.png', { type: 'image/png' });
        } catch (imageError) {
          console.error('Image generation failed:', imageError);
        }
      }

      // Step 3: Share image (image-only to ensure compatibility)
      if (navigator.share && imageFile) {
        try {
          await navigator.share({
            title: 'My Chennai Traffic Impact Score',
            files: [imageFile]
          });

          // Show success message
          if (textCopied) {
            toast({
              title: "Shared successfully!",
              description: "Image shared and text copied to clipboard.",
            });
          } else {
            toast({
              title: "Image shared!",
              description: "Image shared successfully.",
            });
          }
          return;
        } catch (shareError) {
          console.error('Image share failed:', shareError);
          // Continue to fallback methods below
        }
      }

      // Fallback: Try text-only share if image sharing failed
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'My Chennai Traffic Impact Score',
            text: fullShareText
          });

          toast({
            title: "Shared successfully!",
            description: "Text shared successfully.",
          });
          return;
        } catch (shareError) {
          console.error('Text share failed:', shareError);
        }
      }

      // Final fallback: Just show that text was copied
      if (textCopied) {
        toast({
          title: "Text copied!",
          description: "Share text has been copied to your clipboard. Image sharing not available.",
        });
      } else {
        toast({
          title: "Share failed",
          description: "Unable to share results. Please try again.",
          variant: "destructive"
        });
      }

    } catch (error) {
      console.error('Share failed:', error);
      toast({
        title: "Share failed",
        description: "Unable to share results. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleFeedback = async (helpful: boolean) => {
    if (!results.calculationId) return;

    try {
      await api.submitFeedback({
        calculationId: results.calculationId,
        helpful
      });
      setFeedbackSubmitted(true);
      toast({
        title: "Thank you!",
        description: "Your feedback helps us improve our calculations.",
      });
    } catch (error) {
      toast({
        title: "Feedback failed",
        description: "Unable to submit feedback. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-8">
      {/* Hidden simplified screenshot container - only core score info */}
      <div 
        ref={scoreCardRef}
        className="fixed top-0 left-0 w-[600px] bg-white p-8 z-[-1] opacity-0 pointer-events-none"
        style={{ width: '600px', minHeight: 'auto', visibility: 'hidden' }}
      >
        {/* Website URL header for screenshot */}
        <div className={`text-center mb-6 py-4 bg-gradient-to-r ${theme.gradient} border-b-2 ${theme.borderColor}`}>
          <div className={`text-2xl font-bold ${theme.primary}`}>ChennaiTrafficCalc.in</div>
          <div className="text-sm text-slate-600">Calculate Your Chennai Commute Costs</div>
        </div>

        <div className="text-center mb-8">
          <h2 className={`text-3xl font-bold ${theme.primary} mb-3`}>{messaging.hero}</h2>
          <p className="text-lg text-slate-700">{messaging.moneyLine}</p>
          <p className="text-sm text-slate-600 mt-2">{messaging.context}</p>
        </div>

        {/* Score and Cost Display for Screenshot */}
        <div className={`p-8 text-center rounded-lg border-2 ${theme.border} ${theme.bg}`}>
          <div className="mb-6">
            <div className="text-4xl font-bold text-slate-700 mb-4">Impact Score: {results.score}/100</div>
          </div>
          <div className="border-t pt-6">
            <div className={`text-8xl font-bold ${theme.primary} mb-4`}>
              ₹{formatNumber(results.monthlyCost)}
            </div>
            <div className={`text-2xl mb-4 font-semibold ${theme.primary}`}>Monthly Transport Cost</div>
            <div className="text-base text-slate-600 mb-6 max-w-lg mx-auto leading-relaxed">
              {comparisons.annualCost > 0 ? 
                `That's ₹${formatNumber(comparisons.annualCost)} per year • ₹${formatNumber(comparisons.dailyCost)} per working day` :
                'Your sustainable transport choice saves money!'
              }
            </div>
          </div>
        </div>
      </div>

      {/* Visible responsive content */}
      <div>
        {/* Traffic Impact Score - Primary Display */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-slate-100 rounded-full px-4 py-2 mb-4">
            <span className="text-sm font-medium text-slate-700">Traffic Impact Score</span>
            <span className="text-xl font-bold text-slate-900">{results.score}/100</span>
          </div>
        </div>
        
        {/* Hero Section with Score-Based Messaging */}
        <div className="text-center mb-8">
          {results.transportMode === 'walking' || results.transportMode === 'cycling' ? (
            <>
              <h1 className="text-4xl font-bold text-green-700 mb-4">You're a Chennai eco-champion! 🌱</h1>
              <p className="text-2xl font-medium text-green-700 mb-2">Zero cost, zero emissions</p>
              <p className="text-lg text-slate-600">Your sustainable choice sets an example for others</p>
            </>
          ) : (
            <>
              <h1 className={`text-4xl font-bold ${theme.primary} mb-4`}>{messaging.hero}</h1>
              <p className={`text-2xl font-medium ${theme.primary} mb-2`}>{messaging.moneyLine}</p>
              <p className="text-lg text-slate-600">{messaging.context}</p>
            </>
          )}
        </div>

        {/* Primary Money Display - Large and Prominent */}
        {results.transportMode === 'walking' || results.transportMode === 'cycling' ? (
          <Card className="mb-8 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">{results.transportMode === 'walking' ? '🚶‍♂️' : '🚴‍♂️'}</div>
              <div className="text-5xl font-bold text-green-700 mb-4">
                Excellent choice!
              </div>
              <div className="text-2xl font-medium text-slate-700 mb-2">
                {results.transportMode === 'walking' ? 'Walking is' : 'Cycling is'} completely free
              </div>
              <div className="text-lg text-slate-600 mb-4">
                Save money, stay healthy, and help the environment all at once!
              </div>
              <div className="bg-white/50 rounded-lg p-4 text-sm text-slate-600">
                You're saving ₹1,500/month compared to a gym membership while staying fit!
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className={`mb-8 ${theme.border} ${theme.bg}`}>
            <CardContent className="p-8 text-center">
              <div className={`text-7xl font-bold ${theme.primary} mb-4`}>
                ₹{formatNumber(results.monthlyCost)}
              </div>
              <div className="text-2xl font-medium text-slate-700 mb-2">
                Your monthly commute cost
              </div>
              <div className="text-lg text-slate-600">
                {comparisons.annualCost > 0 ? 
                  `That's ₹${formatNumber(comparisons.annualCost)} per year • ₹${formatNumber(comparisons.dailyCost)} every working day` :
                  'Your sustainable transport choice saves money!'
                }
              </div>
            </CardContent>
          </Card>
        )}

        {/* NEW: Universal Comparisons Section */}
        {results.transportMode !== 'walking' && results.transportMode !== 'cycling' && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-6">
                Your ₹{formatNumber(results.monthlyCost)} monthly commute equals:
              </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {comparisons.activaPercentage > 0 && (
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                  <span className="text-2xl">🛵</span>
                  <div>
                    <div className="font-semibold text-slate-900">{comparisons.activaPercentage}% of a new Activa's EMI</div>
                    <div className="text-sm text-slate-600">₹{3500}/month reference</div>
                  </div>
                </div>
              )}
              
              {comparisons.mobileDataMonths > 0 && (
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                  <span className="text-2xl">📱</span>
                  <div>
                    <div className="font-semibold text-slate-900">{comparisons.mobileDataMonths} months of unlimited mobile data</div>
                    <div className="text-sm text-slate-600">₹299/month plans</div>
                  </div>
                </div>
              )}
              
              {comparisons.movieTickets > 0 && (
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                  <span className="text-2xl">🎬</span>
                  <div>
                    <div className="font-semibold text-slate-900">
                      {comparisons.movieTickets} movie tickets 
                      {comparisons.ottMonths > 0 && ` or ${comparisons.ottMonths} months of streaming`}
                    </div>
                    <div className="text-sm text-slate-600">Weekend multiplex prices</div>
                  </div>
                </div>
              )}
              
              {comparisons.meals > 0 && (
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                  <span className="text-2xl">🍛</span>
                  <div>
                    <div className="font-semibold text-slate-900">{comparisons.meals} restaurant meals</div>
                    <div className="text-sm text-slate-600">At local restaurants</div>
                  </div>
                </div>
              )}
              
              {comparisons.electricityUnits > 0 && (
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <div className="font-semibold text-slate-900">{comparisons.electricityUnits} units of electricity</div>
                    <div className="text-sm text-slate-600">Average household usage</div>
                  </div>
                </div>
              )}
              
              {comparisons.gymMonths > 0 && (
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                  <span className="text-2xl">🏃</span>
                  <div>
                    <div className="font-semibold text-slate-900">{comparisons.gymMonths} month{comparisons.gymMonths > 1 ? 's' : ''} at a local gym</div>
                    <div className="text-sm text-slate-600">Basic membership</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        )}



        {/* Time Framing with Impact */}
        <Card className="mb-8">
          <CardContent className="p-6 text-center">
            <div className="mb-4">
              <div className={`text-4xl font-bold ${theme.primary} mb-2`}>⏰ {results.monthlyTimeHours} hours/month</div>
              <div className="text-lg text-slate-700 mb-2">Time spent commuting</div>
              <div className="text-sm text-slate-600">
                <div className="mb-2">
                  That's {Math.round(results.monthlyTimeHours / 2)} movies worth of time monthly
                </div>
                <div className="font-semibold">
                  Annual commute time: {(results.monthlyTimeHours * 12 / 24).toFixed(1)} complete days
                </div>
                <div className="text-xs mt-2">Chennai average: ~45 hours/month</div>
              </div>
            </div>
          </CardContent>
        </Card>

      {/* Environmental Impact - Supporting Metric */}
      <Card className={`mb-8 ${theme.border} ${theme.bg}`}>
        <CardContent className="p-6 text-center">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center justify-center">
            <div className={`w-2 h-2 ${theme.primary.replace('text-', 'bg-')} rounded-full mr-2`}></div>
            Environmental Impact
          </h3>
          <div className="mb-4">
            <div className={`text-4xl font-bold ${theme.primary} mb-2`}>{results.monthlyEmissions}kg</div>
            <div className="text-base text-slate-600">Monthly CO₂ emissions</div>
          </div>
        </CardContent>
      </Card>

      {/* Impact Breakdown */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              How We Calculated Your Score
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-slate-900">Your Vehicle</span>
                  <p className="text-xs text-slate-600">Base environmental impact</p>
                </div>
                <span className="font-bold text-blue-600">{results.breakdown.vehicleImpact} pts</span>
              </div>
              
              {(results.breakdown.congestionFactor && results.breakdown.congestionFactor !== 1) && (
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-slate-900">Route Distance</span>
                    <p className="text-xs text-slate-600">Longer routes increase impact</p>
                  </div>
                  <span className="font-bold text-orange-600">×{Number(results.breakdown.congestionFactor).toFixed(1)}</span>
                </div>
              )}
              
              {(results.breakdown.timingMultiplier && results.breakdown.timingMultiplier !== 1) && (
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-slate-900">Peak Hours</span>
                    <p className="text-xs text-slate-600">Rush hour increases congestion</p>
                  </div>
                  <span className="font-bold text-red-600">×{Number(results.breakdown.timingMultiplier).toFixed(1)}</span>
                </div>
              )}
              
              {(results.breakdown.frequencyMultiplier && results.breakdown.frequencyMultiplier !== 1) && (
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-slate-900">Travel Frequency</span>
                    <p className="text-xs text-slate-600">How often you make this trip</p>
                  </div>
                  <span className="font-bold text-yellow-600">×{Number(results.breakdown.frequencyMultiplier).toFixed(1)}</span>
                </div>
              )}
              
              {(results.breakdown.occupancy && results.breakdown.occupancy > 1) && (
                <div className={`flex justify-between items-center p-3 ${theme.bg} rounded-lg`}>
                  <div>
                    <span className="text-sm font-medium text-slate-900">Sharing Ride</span>
                    <p className="text-xs text-slate-600">{results.breakdown.occupancy} people sharing reduces individual impact</p>
                  </div>
                  <span className={`font-bold ${theme.primary}`}>÷{results.breakdown.occupancy}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center border-t-2 border-slate-200 pt-4 mt-4 p-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg">
                <div>
                  <span className="text-base font-bold text-slate-900">Your Impact Score</span>
                  <p className="text-xs text-slate-600">Out of 100 points</p>
                </div>
                <span className="font-bold text-2xl text-slate-900">{results.score}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

        {/* Contextual Nuggets Section - Only show if there's content */}
        {(() => {
          // Check if any nugget content will be displayed
          const hasPeakHourInsight = results.breakdown.timingMultiplier && results.breakdown.timingMultiplier > 1;
          const hasShortDistanceInsight = results.transportMode === 'car' && results.distanceKm && results.distanceKm < 5;
          const hasSharingInsight = results.breakdown.occupancy === 1 && (results.transportMode === 'car' || results.transportMode === 'taxi');
          const hasAnyContent = hasPeakHourInsight || hasShortDistanceInsight || hasSharingInsight;
          
          return results.transportMode !== 'walking' && results.transportMode !== 'cycling' && hasAnyContent && (
            <Card className="mb-8">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Did you know?</h3>
                <div className="space-y-3">
                  {/* Peak hour insight */}
                  {hasPeakHourInsight && (
                    <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                      <span className="text-xl">💡</span>
                      <div>
                        <div className="font-medium text-slate-900">Peak hour adds ~40% to commute costs</div>
                        <div className="text-sm text-slate-600">Your current timing increases costs significantly</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Short distance car usage */}
                  {hasShortDistanceInsight && (
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <span className="text-xl">🚲</span>
                      <div>
                        <div className="font-medium text-slate-900">Fun fact: 65% choose two-wheelers for &lt;5km in Chennai</div>
                        <div className="text-sm text-slate-600">Your short distance is perfect for alternatives</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Solo vs shared costs */}
                  {hasSharingInsight && (
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <span className="text-xl">🚗</span>
                      <div>
                        <div className="font-medium text-slate-900">
                          Solo vs Shared: ₹{formatNumber(results.monthlyCost)} vs ₹{formatNumber(Math.round(results.monthlyCost / 2))}
                        </div>
                        <div className="text-sm text-slate-600">Sharing your ride could cut costs in half</div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })()}

        {/* Alternatives Section - Simplified */}
        {results.alternatives.length > 0 && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Better Options Available 📊
              </h3>
              <p className="text-sm text-slate-600 mb-6">
                {results.score <= 30 ? 
                  "You're already efficient! Here are other good options:" : 
                  `Here's how to save ₹${formatNumber(Math.max(...results.alternatives.map(alt => alt.costSavings)))}/month with better transport choices:`
                }
              </p>

              <div className="space-y-4">
                {results.alternatives.map((alternative, index) => {
                  const getIcon = (type: string) => {
                    switch (type) {
                      case 'metro': return '🚇';
                      case 'carpool': return <Users className="w-6 h-6" />;
                      case 'timing': return <Clock className="w-6 h-6" />;
                      default: return '🚌';
                    }
                  };

                  const getIconColor = (type: string) => {
                    switch (type) {
                      case 'metro': return 'text-green-500';
                      case 'carpool': return 'text-blue-500';
                      case 'timing': return 'text-yellow-500';
                      default: return 'text-gray-500';
                    }
                  };

                  return (
                    <Card key={index} className={theme.border}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <div className={`mr-4 ${getIconColor(alternative.type)}`}>
                              {typeof getIcon(alternative.type) === 'string' ? (
                                <div className="text-2xl">{getIcon(alternative.type)}</div>
                              ) : (
                                getIcon(alternative.type)
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium text-slate-900">{alternative.title}</h4>
                              <p className={`text-sm ${theme.primary} font-medium`}>
                                Save ₹{formatNumber(alternative.costSavings)}/month
                              </p>
                              <p className="text-xs text-blue-600 mt-1">{alternative.timeDelta} travel time</p>
                              <p className="text-xs text-slate-500 mt-1">Reduce emissions by {alternative.impactReduction}%</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${theme.primary}`}>{alternative.newScore}</div>
                            <div className="text-xs text-slate-500">New Score</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>{/* End of screenshot capture wrapper */}

      {/* Feedback Section */}
      {!feedbackSubmitted && results.calculationId && (
        <Card className="mb-8">
          <CardContent className="p-6 text-center">
            <h3 className="font-medium text-slate-900 mb-4">Was this calculation helpful?</h3>
            <div className="flex justify-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => handleFeedback(true)}
                className="px-6"
              >
                👍 Yes, helpful
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleFeedback(false)}
                className="px-6"
              >
                👎 Not helpful
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Balanced Share Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Button 
          onClick={handleShare} 
          className="w-full bg-primary text-white hover:bg-primary/90"
          disabled={isSharing}
        >
          <span className="mr-2">🔍</span>
          <span>{isSharing ? 'Preparing...' : messaging.shareHook}</span>
        </Button>
        <Button 
          onClick={handleShare}
          variant="outline"
          className="w-full"
          disabled={isSharing}
        >
          <span className="mr-2">👥</span>
          <span>Compare with friends</span>
        </Button>
        <Button 
          onClick={handleShare}
          variant="outline"
          className="w-full"
          disabled={isSharing}
        >
          <span className="mr-2">📢</span>
          <span>Spread the word</span>
        </Button>
      </div>
      
      {/* Calculate Again Button */}
      <div className="mb-8">
        <Button 
          onClick={onRestart}
          variant="outline"
          className="w-full"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Calculate Again
        </Button>
      </div>

      {/* Methodology Link */}
      <div className="text-center pt-6 border-t border-slate-200">
        <p className="text-sm text-slate-600">
          Learn more about our{" "}
          <a href="/methodology" className="text-primary hover:underline">
            calculation methodology
          </a>{" "}
          and{" "}
          <a href="/data-sources" className="text-primary hover:underline">
            data sources
          </a>
        </p>
        {results.disclaimer && (
          <p className="text-xs text-slate-500 mt-2">{results.disclaimer}</p>
        )}
      </div>
    </div>
  );
}