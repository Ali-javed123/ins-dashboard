export interface FeatureItem {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface AboutSectionData {
  badge: string;
  heading: string;
  description: string;
  highlightTitle: string;
  highlightDescription: string;
  features: FeatureItem[];
  colbtn: string;
}
