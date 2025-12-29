export interface HotWheelMock {
    id: string;
    name: string;
    brand: string;
    year: number;
    series?: string;
    image: string;
  }
  
  export const mockHotWheels: HotWheelMock[] = [
    {
      id: "1",
      name: "'71 Datsun 510",
      brand: "Hot Wheels",
      year: 2024,
      series: "Japan Historics",
      image: "https://placehold.co/400x300/1A1B4B/D9731A?text=Datsun+510",
    },
    {
      id: "2",
      name: "'67 Camaro",
      brand: "Hot Wheels",
      year: 2023,
      series: "Muscle Mania",
      image: "https://placehold.co/400x300/1A1B4B/BF247A?text=67+Camaro",
    },
    {
      id: "3",
      name: "Porsche 911 GT3",
      brand: "Hot Wheels",
      year: 2024,
      series: "Porsche Series",
      image: "https://placehold.co/400x300/1A1B4B/812B8C?text=911+GT3",
    },
    {
      id: "4",
      name: "Toyota AE86",
      brand: "Hot Wheels",
      year: 2023,
      series: "Japan Historics",
      image: "https://placehold.co/400x300/1A1B4B/D9731A?text=AE86",
    },
    {
      id: "5",
      name: "'55 Chevy Bel Air",
      brand: "Hot Wheels",
      year: 2022,
      series: "Classics",
      image: "https://placehold.co/400x300/1A1B4B/BF247A?text=Bel+Air",
    },
    {
      id: "6",
      name: "Mazda RX-7",
      brand: "Hot Wheels",
      year: 2024,
      series: "Japan Historics",
      image: "https://placehold.co/400x300/1A1B4B/812B8C?text=RX-7",
    },
    {
      id: "7",
      name: "Nissan Silvia S15",
      brand: "Hot Wheels",
      year: 2024,
      series: "Formula Drift",
      image: "https://placehold.co/400x300/1A1B4B/812B8C?text=Silvia",
    },
    {
      id: "8",
      name: "Dairy Delivery",
      brand: "Hot Wheels",
      year: 2024,
      series: "Hot Wheels Classics",
      image: "https://placehold.co/400x300/1A1B4B/812B8C?text=Dairy-Delivery",
    },
  ];