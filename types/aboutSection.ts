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
  highlight_title: string;
  highlight_description: string;
  features: FeatureItem[];
  col_btn: string;
}
