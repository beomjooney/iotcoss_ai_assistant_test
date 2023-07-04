export interface InfoResponse {
  [key: string]: any;
  data: {
    data: Info;
  };
}

export interface Crmdata {
  company_name: string;
  company_number: string;
}

export interface Article {
  date: Date;
  title: string;
  thumbnail_url: string;
  image_url: string;
}

export interface Image {
  thumbnail_url: string;
  image_url: string;
}

export interface IntroductionByOwner {
  images: Image[];
  introduction_text: string;
}

export interface Info {
  min_order_amount: number;
  nutrition_fact_desktop_url: string;
  violations?: any;
  except_cash: boolean;
  description: string;
  tags: any[];
  opening_time_description: string;
  suspension_text?: any;
  allergy_info_mobile_url: string;
  phone: string;
  nutrition_fact_mobile_url: string;
  crmdata: Crmdata;
  address: string;
  article: Article;
  allergy_info_desktop_url: string;
  introduction_by_owner: IntroductionByOwner;
  lng: number;
  lat: number;
  country_origin: string;
}
