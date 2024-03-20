export interface Window {
  analytics: SegmentAnalytics.AnalyticsJS;
}

export interface DecodedIdToken {
  sub: string;
  email: string;
  'custom:date': string;
  'custom:subscription': string;
  // Add other properties as needed
}
