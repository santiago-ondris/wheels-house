export interface HotWheel {
    id: string;
    name: string;
    brand: string;
    manufacturer: string;
    year: number;
    color: string;
    imageUrl?: string;
    notes?: string;
    series?: string;
    castingNumber?: string;
    purchaseDate?: Date;
    purchasePrice?: number;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface Group {
    id: string;
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
  }