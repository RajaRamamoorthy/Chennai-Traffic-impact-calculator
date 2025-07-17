
// Analytics service for Google Analytics 4 tracking
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export interface CalculationEventParams {
  transport_mode: string;
  vehicle_type?: string;
  distance_km: number;
  origin: string;
  destination: string;
  impact_score: number;
  timing: string;
  frequency: string;
  occupancy: number;
}

export interface RouteSearchParams {
  origin: string;
  destination: string;
  distance_km?: number;
  search_method: 'autocomplete' | 'manual';
}

export interface FeedbackEventParams {
  rating?: number;
  helpful?: boolean;
  calculation_id?: number;
  feedback_type: 'rating' | 'helpful' | 'comment';
}

export interface ContactEventParams {
  contact_method: 'form' | 'email';
  form_source?: string;
}

export interface DonationEventParams {
  amount: number;
  currency: string;
  payment_method: string;
  donation_source?: string;
}

export interface NavigationEventParams {
  page_name: string;
  from_page?: string;
  language: string;
}

export interface ResultsDisplayEventParams {
  impact_score: number;
  score_range: 'excellent' | 'good' | 'moderate' | 'high';
  monthly_cost: number;
  transport_mode: string;
  has_contextual_nuggets: boolean;
  alternatives_count: number;
}

export interface SharingEventParams {
  share_method: 'screenshot' | 'text';
  content_type: 'results' | 'calculation';
  impact_score: number;
  transport_mode: string;
}

class AnalyticsService {
  private isInitialized = false;

  constructor() {
    // Check if gtag is available
    if (typeof window !== 'undefined' && window.gtag) {
      this.isInitialized = true;
    }
  }

  private track(eventName: string, parameters: Record<string, any> = {}) {
    if (!this.isInitialized || typeof window === 'undefined' || !window.gtag) {
      console.warn('Analytics not initialized or gtag not available');
      return;
    }

    try {
      window.gtag('event', eventName, {
        ...parameters,
        timestamp: new Date().toISOString(),
      });
      console.log('Analytics event tracked:', eventName, parameters);
    } catch (error) {
      console.error('Error tracking analytics event:', error);
    }
  }

  // Page view tracking
  trackPageView(pageName: string, pageTitle?: string) {
    this.track('page_view', {
      page_title: pageTitle || document.title,
      page_location: window.location.href,
      page_name: pageName,
    });
  }

  // Calculator events
  trackCalculationStart(params: Partial<CalculationEventParams>) {
    this.track('calculation_start', {
      event_category: 'calculator',
      transport_mode: params.transport_mode,
      timing: params.timing,
      frequency: params.frequency,
    });
  }

  trackCalculationComplete(params: CalculationEventParams) {
    this.track('calculation_complete', {
      event_category: 'calculator',
      ...params,
      value: params.impact_score,
    });
  }

  trackVehicleTypeSelection(vehicleType: string, category: string) {
    this.track('vehicle_type_select', {
      event_category: 'calculator',
      vehicle_type: vehicleType,
      vehicle_category: category,
    });
  }

  trackTransportModeSelection(transportMode: string) {
    this.track('transport_mode_select', {
      event_category: 'calculator',
      transport_mode: transportMode,
    });
  }

  // Route and location events
  trackRouteSearch(params: RouteSearchParams) {
    this.track('route_search', {
      event_category: 'route',
      origin: params.origin,
      destination: params.destination,
      distance_km: params.distance_km,
      search_method: params.search_method,
    });
  }

  trackLocationAutocomplete(query: string, resultCount: number) {
    this.track('location_autocomplete', {
      event_category: 'route',
      search_term: query,
      result_count: resultCount,
    });
  }

  trackLocationSelect(location: string, locationType: 'origin' | 'destination') {
    this.track('location_select', {
      event_category: 'route',
      location: location,
      location_type: locationType,
    });
  }

  // Engagement events
  trackFeedback(params: FeedbackEventParams) {
    this.track('feedback_submit', {
      event_category: 'engagement',
      ...params,
    });
  }

  trackContactForm(params: ContactEventParams) {
    this.track('contact_form_submit', {
      event_category: 'engagement',
      ...params,
    });
  }

  // Donation and conversion events
  trackDonationStart(amount: number, currency: string = 'INR') {
    this.track('begin_checkout', {
      event_category: 'ecommerce',
      currency: currency,
      value: amount,
      items: [{
        item_id: 'donation',
        item_name: 'Website Donation',
        item_category: 'donation',
        quantity: 1,
        price: amount
      }]
    });
  }

  trackDonationSuccess(params: DonationEventParams) {
    this.track('purchase', {
      event_category: 'ecommerce',
      transaction_id: Date.now().toString(),
      value: params.amount,
      currency: params.currency,
      payment_type: params.payment_method,
      items: [{
        item_id: 'donation',
        item_name: 'Website Donation',
        item_category: 'donation',
        quantity: 1,
        price: params.amount
      }]
    });
    
    // Also track as conversion
    this.track('conversion', {
      event_category: 'conversion',
      conversion_type: 'donation',
      value: params.amount,
      currency: params.currency
    });
  }

  trackDonationFailure(amount: number, errorReason?: string) {
    this.track('donation_failed', {
      event_category: 'ecommerce',
      value: amount,
      currency: 'INR',
      error_reason: errorReason || 'unknown'
    });
  }

  trackDonationButtonClick(amount?: number, source?: string) {
    this.track('donation_button_click', {
      event_category: 'engagement',
      amount: amount,
      source: source || 'footer',
      currency: 'INR'
    });
  }

  // Enhanced Results Page Tracking
  trackResultsDisplay(params: ResultsDisplayEventParams) {
    this.track('results_display', {
      event_category: 'results',
      impact_score: params.impact_score,
      score_range: params.score_range,
      monthly_cost: params.monthly_cost,
      transport_mode: params.transport_mode,
      has_contextual_nuggets: params.has_contextual_nuggets,
      alternatives_count: params.alternatives_count,
    });
  }

  trackSectionView(sectionName: string, impactScore: number, transportMode: string) {
    this.track('section_view', {
      event_category: 'user_behavior',
      section_name: sectionName,
      impact_score: impactScore,
      transport_mode: transportMode,
    });
  }

  trackResultsShare(shareMethod: string, impactScore: number) {
    this.track('share', {
      event_category: 'engagement',
      method: shareMethod,
      content_type: 'calculation_results',
      impact_score: impactScore,
    });
  }

  trackRecommendationClick(recommendationType: string, transportMode: string) {
    this.track('recommendation_click', {
      event_category: 'engagement',
      recommendation_type: recommendationType,
      transport_mode: transportMode,
    });
  }

  // Navigation events
  trackNavigation(params: NavigationEventParams) {
    this.track('navigation', {
      event_category: 'navigation',
      ...params,
    });
  }

  trackLanguageChange(fromLanguage: string, toLanguage: string) {
    this.track('language_change', {
      event_category: 'user_preference',
      from_language: fromLanguage,
      to_language: toLanguage,
    });
  }

  // User behavior events
  trackStepProgression(step: number, stepName: string) {
    this.track('calculator_step_progress', {
      event_category: 'user_behavior',
      step_number: step,
      step_name: stepName,
    });
  }

  trackCalculationRestart() {
    this.track('calculation_restart', {
      event_category: 'user_behavior',
    });
  }

  trackErrorEncounter(errorType: string, errorMessage: string, location: string) {
    this.track('error_encounter', {
      event_category: 'errors',
      error_type: errorType,
      error_message: errorMessage,
      error_location: location,
    });
  }

  // Custom conversion events
  trackConversion(conversionType: 'calculation_completion' | 'contact_form' | 'feedback' | 'donation') {
    this.track('conversion', {
      event_category: 'conversion',
      conversion_type: conversionType,
      value: 1,
    });
  }

  // Performance tracking
  trackPerformance(metricName: string, value: number, unit: string) {
    this.track('performance_metric', {
      event_category: 'performance',
      metric_name: metricName,
      metric_value: value,
      metric_unit: unit,
    });
  }

  // Enhanced ecommerce-style events for impact calculator
  trackCalculationView(calculationId: string, impactScore: number) {
    this.track('view_item', {
      event_category: 'calculator',
      item_id: calculationId,
      item_name: 'Traffic Impact Calculation',
      item_category: 'calculation',
      value: impactScore,
    });
  }

  trackAlternativeView(alternativeMode: string, potentialSavings: number) {
    this.track('view_promotion', {
      event_category: 'alternatives',
      promotion_id: alternativeMode,
      promotion_name: `${alternativeMode} Alternative`,
      creative_name: 'impact_recommendation',
      value: potentialSavings,
    });
  }
}

export const analytics = new AnalyticsService();
