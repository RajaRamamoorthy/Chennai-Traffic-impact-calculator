import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Share, RotateCcw, Lightbulb, Users, Clock, DollarSign } from "lucide-react";
import { CalculationResult } from "@/types/calculator";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";

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
        <div className="text-center mb-6 py-4 bg-gradient-to-r from-green-50 to-blue-50 border-b-2 border-green-200">
          <div className="text-2xl font-bold text-green-700">ChennaiTrafficCalc.in</div>
          <div className="text-sm text-slate-600">Calculate Your Chennai Traffic Impact</div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Your Traffic Impact Score</h2>
          <p className="text-slate-600">Based on your commute pattern in Chennai</p>
        </div>

        {/* Impact Score Display Only */}
        <div className={`p-8 text-center rounded-lg border-2 ${getScoreColor(results.score)}`}>
          <div className="mb-4">
            <div className="text-8xl font-bold mb-4">{results.score}</div>
            <div className="text-2xl mb-4 font-semibold">{getScoreLabel(results.score)}</div>
            <div className="text-base text-slate-600 mb-6 max-w-lg mx-auto leading-relaxed">
              {results.score >= 70 ? (
                <span className="text-red-700 font-medium">
                  Your commute significantly contributes to Chennai's traffic congestion and pollution. 
                  Consider alternatives to reduce your impact.
                </span>
              ) : results.score >= 40 ? (
                <span className="text-yellow-700 font-medium">
                  Your commute has a moderate impact on Chennai's traffic. 
                  Small changes could make a meaningful difference.
                </span>
              ) : (
                <span className="text-green-700 font-medium">
                  Great job! Your transportation choices help keep Chennai's roads cleaner and less congested. 
                  You're making a positive difference.
                </span>
              )}
            </div>
            <div className={`inline-block px-4 py-2 rounded-full text-base font-medium ${getConfidenceBadge(results.confidence.level)}`}>
              Confidence {results.confidence.level}: {results.confidence.description}
            </div>
          </div>
        </div>
      </div>

      {/* Visible responsive content */}
      <div>
        {/* Website URL header for screenshot */}
        <div className="text-center mb-6 py-4 bg-gradient-to-r from-green-50 to-blue-50 border-b-2 border-green-200">
          <div className="text-xl font-bold text-green-700">ChennaiTrafficCalc.in</div>
          <div className="text-sm text-slate-600">Calculate Your Chennai Traffic Impact</div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Your Traffic Impact Score</h2>
          <p className="text-slate-600">Based on your commute pattern in Chennai</p>
        </div>

        {/* Impact Score Display */}
        <Card className={`mb-8 ${getScoreColor(results.score)}`}>
        <CardContent className="p-8 text-center">
          <div className="mb-4">
            <div className="text-6xl font-bold mb-2">{results.score}</div>
            <div className="text-lg mb-2">{getScoreLabel(results.score)}</div>
            <div className="text-sm text-slate-600 mb-4 max-w-md mx-auto">
              {results.score >= 70 ? (
                <span className="text-red-700 font-medium">
                  Your commute significantly contributes to Chennai's traffic congestion and pollution. 
                  Consider the alternatives below to reduce your impact.
                </span>
              ) : results.score >= 40 ? (
                <span className="text-yellow-700 font-medium">
                  Your commute has a moderate impact on Chennai's traffic. 
                  Small changes could make a meaningful difference.
                </span>
              ) : (
                <span className="text-green-700 font-medium">
                  Great job! Your transportation choices help keep Chennai's roads cleaner and less congested. 
                  You're making a positive difference.
                </span>
              )}
            </div>
            <Badge className={getConfidenceBadge(results.confidence.level)}>
              Confidence {results.confidence.level}: {results.confidence.description}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Impact Breakdown and Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Breakdown */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Impact Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Vehicle Base Impact</span>
                <span className="font-medium">{results.breakdown.vehicleImpact} pts</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Route Congestion</span>
                <span className="font-medium">×{results.breakdown.congestionFactor || 1}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Peak Hour Travel</span>
                <span className="font-medium">×{results.breakdown.timingMultiplier || 1}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Travel Frequency</span>
                <span className="font-medium">×{results.breakdown.frequencyMultiplier || 1}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">People Sharing</span>
                <span className="font-medium">÷{results.breakdown.occupancy || 1}</span>
              </div>
              <div className="flex justify-between items-center border-t pt-3 mt-3">
                <span className="text-sm font-semibold text-slate-900">Final Score</span>
                <span className="font-bold text-lg">{results.score} pts</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Impact */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Monthly Impact</h3>
            <div className="space-y-4">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">₹{results.monthlyCost}</div>
                <div className="text-sm text-slate-600">Fuel & maintenance cost</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{results.monthlyEmissions}kg</div>
                <div className="text-sm text-slate-600">CO₂ emissions</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{results.monthlyTimeHours} hrs</div>
                <div className="text-sm text-slate-600">Time in traffic</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

        {/* Alternatives Section */}
        {results.alternatives.length > 0 && (
          <Card className="mb-8 border-green-200">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                <Lightbulb className="inline w-5 h-5 text-green-500 mr-2" />
                Better Alternatives
              </h3>

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
                    <Card key={index} className="border-green-200">
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
                              <p className="text-sm text-slate-600">
                                Reduce impact by {alternative.impactReduction}% • Save ₹{alternative.costSavings}/month
                              </p>
                              <p className="text-xs text-green-600 mt-1">{alternative.timeDelta} travel time</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600">{alternative.newScore}</div>
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