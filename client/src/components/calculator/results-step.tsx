import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Share, RotateCcw, Lightbulb, Users, Clock, DollarSign } from "lucide-react";
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
  const [timing, setTiming] = useState<string>('');
  const [frequency, setFrequency] = useState<string>('');

  // Dynamic messaging based on transport mode and score
  const getMessagingContext = () => {
    const transportMode = results.transportMode || 'car'; // Default to car if not provided
    const score = results.score;
    
    // Determine efficiency level
    const isEfficient = (transportMode === 'metro' || transportMode === 'bus') && score <= 30;
    const isZeroCost = transportMode === 'walking' || transportMode === 'cycling';
    const isHighWaste = (transportMode === 'car' || transportMode === 'taxi') && score >= 60;
    const isMixedEfficiency = score > 30 && score < 60;
    
    // Calculate potential car cost for comparison (estimate)
    const potentialCarCost = results.monthlyCost * 2.5; // Conservative estimate
    const actualSavings = potentialCarCost - results.monthlyCost;
    
    return {
      transportMode,
      score,
      isEfficient,
      isZeroCost,
      isHighWaste,
      isMixedEfficiency,
      potentialCarCost,
      actualSavings: Math.max(0, actualSavings),
      maxSavings: Math.max(...results.alternatives.map(alt => alt.costSavings))
    };
  };

  const context = getMessagingContext();

  const getDynamicHeadline = () => {
    if (context.isZeroCost) {
      return `Zero transport costs! You're saving ₹${formatNumber(context.actualSavings)}/month vs driving`;
    }
    if (context.isEfficient) {
      return `You're saving ₹${formatNumber(context.actualSavings)}/month with smart transport choices!`;
    }
    if (context.isHighWaste) {
      return `Your commute costs ₹${formatNumber(results.monthlyCost)}/month extra`;
    }
    return `You could save an additional ₹${formatNumber(context.maxSavings)}/month`;
  };

  const getDynamicSubtitle = () => {
    if (context.isZeroCost || context.isEfficient) {
      return "Keep up the great work! You're making financially smart choices.";
    }
    if (context.isHighWaste) {
      return `That's ₹${formatNumber(results.monthlyCost * 12)} wasted annually on inefficient commuting`;
    }
    return "Small changes could unlock significant monthly savings";
  };

  const getDynamicTheme = () => {
    if (context.isZeroCost || context.isEfficient) {
      return {
        primary: "text-green-600",
        bg: "bg-green-50",
        border: "border-green-200",
        gradient: "from-green-50 to-emerald-50",
        borderColor: "border-green-200"
      };
    }
    if (context.isHighWaste) {
      return {
        primary: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200",
        gradient: "from-red-50 to-orange-50",
        borderColor: "border-red-200"
      };
    }
    return {
      primary: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-200",
      gradient: "from-orange-50 to-yellow-50",
      borderColor: "border-orange-200"
    };
  };

  const theme = getDynamicTheme();

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
      const shareText = `I calculated my traffic impact score: ${results.score}/100. See how your commute affects Chennai traffic!`;
      const fullShareText = `${shareText}\n\nCalculate yours at: ${shareUrl}`;

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
          <h2 className={`text-3xl font-bold ${theme.primary} mb-3`}>{getDynamicHeadline()}</h2>
          <p className="text-lg text-slate-700 mb-2">{getDynamicSubtitle()}</p>
          <p className="text-sm text-slate-600">Based on your commute pattern in Chennai</p>
        </div>

        {/* Score and Cost Display for Screenshot */}
        <div className={`p-8 text-center rounded-lg border-2 ${theme.border} ${theme.bg}`}>
          <div className="mb-6">
            <div className="text-4xl font-bold text-slate-700 mb-2">Impact Score: {results.score}/100</div>
            <div className={`inline-block px-4 py-2 rounded-full text-base font-medium ${getConfidenceBadge(results.confidence.level)} mb-6`}>
              Confidence {results.confidence.level}: {results.confidence.description}
            </div>
          </div>
          <div className="border-t pt-6">
            <div className={`text-8xl font-bold ${theme.primary} mb-4`}>
              {context.isZeroCost ? '₹0' : `₹${formatNumber(results.monthlyCost)}`}
            </div>
            <div className={`text-2xl mb-4 font-semibold ${theme.primary}`}>Monthly Transport Cost</div>
            <div className="text-base text-slate-600 mb-6 max-w-lg mx-auto leading-relaxed">
              {context.isZeroCost ? 
                `You're saving money by walking/cycling! Car users spend ₹${formatNumber(context.potentialCarCost)}/month on the same route.` :
                context.isEfficient ? 
                `Smart choice! You're spending significantly less than car users (₹${formatNumber(context.potentialCarCost)}/month) on the same route.` :
                `You're spending ${context.isHighWaste ? 'too much' : 'considerable amounts'} on transport. This comes from fuel consumption, maintenance, and time lost in traffic.`
              }
            </div>
          </div>
        </div>
      </div>

      {/* Visible responsive content */}
      <div>
        {/* Website URL header for screenshot */}
        <div className={`text-center mb-6 py-4 bg-gradient-to-r ${theme.gradient} border-b-2 ${theme.borderColor}`}>
          <div className={`text-xl font-bold ${theme.primary}`}>ChennaiTrafficCalc.in</div>
          <div className="text-sm text-slate-600">Calculate Your Chennai Commute Costs</div>
        </div>

        <div className="text-center mb-8">
          <h2 className={`text-3xl font-bold ${theme.primary} mb-3`}>{getDynamicHeadline()}</h2>
          <p className="text-lg text-slate-700 mb-2">{getDynamicSubtitle()}</p>
          <p className="text-sm text-slate-600">Based on your commute pattern in Chennai</p>
        </div>

        {/* Traffic Impact Score - First Display */}
        <Card className={`mb-8 ${getScoreColor(results.score)}`}>
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Traffic Impact Score
            </h3>
            <div className="mb-4">
              <div className="text-5xl font-bold mb-2">{results.score}/100</div>
              <div className="text-base mb-3 text-slate-700">{getScoreLabel(results.score)}</div>
              <Badge className={getConfidenceBadge(results.confidence.level)}>
                Confidence {results.confidence.level}: {results.confidence.description}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Cost Display - Primary Focus (Financial-First) */}
        <Card className={`mb-8 ${theme.border} ${theme.bg}`}>
          <CardContent className="p-8 text-center">
            <div className="mb-4">
              <div className={`text-6xl font-bold ${theme.primary} mb-2`}>
                {context.isZeroCost ? '₹0' : `₹${formatNumber(results.monthlyCost)}`}
              </div>
              <div className={`text-lg ${theme.primary} mb-2`}>
                {context.isZeroCost ? 'Monthly Transport Cost' : 
                 context.isEfficient ? 'Monthly Transport Cost' :
                 'Monthly Transport Cost'}
              </div>
              <div className="text-sm text-slate-600 mb-4 max-w-md mx-auto">
                {context.isZeroCost ? 
                  `You're saving money by walking/cycling! Car users spend ₹${formatNumber(context.potentialCarCost)}/month on the same route.` :
                  context.isEfficient ? 
                  `Smart choice! You're spending significantly less than car users (₹${formatNumber(context.potentialCarCost)}/month) on the same route.` :
                  `You're spending ${context.isHighWaste ? 'too much' : 'considerable amounts'} on transport. This comes from fuel consumption, maintenance, and time lost in traffic.`
                }
              </div>
            </div>
          </CardContent>
        </Card>

      {/* Time Wasted Display - Secondary Focus */}
      <Card className={`mb-8 ${theme.border} ${theme.bg}`}>
        <CardContent className="p-6 text-center">
          <div className="mb-4">
            <div className={`text-4xl font-bold ${theme.primary} mb-2`}>{results.monthlyTimeHours} hours/month</div>
            <div className={`text-lg ${theme.primary} mb-2`}>
              {context.isZeroCost || context.isEfficient ? 'Monthly Commute Time' : 'Time Wasted in Traffic'}
            </div>
            <div className="text-sm text-slate-600 mb-2">
              {context.isZeroCost || context.isEfficient ? 
                `You're making efficient use of your ${(results.monthlyTimeHours * 12 / 24).toFixed(1)} days annually for commuting` :
                <>That's <span className={`font-bold ${theme.primary}`}>{(results.monthlyTimeHours * 12 / 24).toFixed(1)} days</span> lost annually to inefficient commuting</>
              }
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

        {/* Alternatives Section */}
        {results.alternatives.length > 0 && (
          <Card className={`mb-8 ${theme.border}`}>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                {context.isZeroCost || context.isEfficient ? (
                  <><Clock className={`inline w-5 h-5 ${theme.primary} mr-2`} />
                  How to optimize your current smart choices</>
                ) : (
                  <><DollarSign className={`inline w-5 h-5 ${theme.primary} mr-2`} />
                  Why You're Losing Money</>
                )}
              </h3>
              <p className="text-sm text-slate-600 mb-6">
                {context.isZeroCost ? 
                  "You're already at zero cost! Here are route optimizations to save time:" :
                  context.isEfficient ? 
                  "Great job choosing efficient transport! Here are ways to optimize further:" :
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

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
        <Button onClick={handleShare} disabled={isSharing} className="px-8 py-3">
          {isSharing ? (
            <>
              <div className="mr-2 w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Sharing...
            </>
          ) : (
            <>
              <Share className="mr-2 w-4 h-4" />
              Share Results
            </>
          )}
        </Button>
        <Button variant="outline" onClick={onRestart} className="px-8 py-3">
          <RotateCcw className="mr-2 w-4 h-4" />
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