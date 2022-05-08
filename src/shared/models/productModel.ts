export interface Product {
    id: number;
    name: string;
    brand: string;
    type: string;
    price: number;
    description: string;
    phone: string;
    images: string[];
    adType: AdType[];
    statusAd: StatusAd;
    address: {
      long: number;
      lat: number;
    }
  }


  export enum AdType {
    SALE = 'SALE',
    RENT = 'RENT',
  }
  
  export enum StatusAd {
    SOLD = 'SOLD',
    RENTED = 'RENTED',
    ANNOUNCED = 'ANNOUNCED',
  }
  
  