import { CarData } from "../services/car.service";

/**
 * - PC: 1080 x 1080 px (1:1) o 1080 x 1350 px (4:5)
 * - CELULAR: 1080 x 1080 px (1:1) o 1080 x 810 px (4:3)
 */
export const curatedCars: CarData[] = [
  {
    carId: 1001,
    name: "Porsche Carrera GT",
    brand: "Porsche",
    manufacturer: "Hot Wheels",
    color: "Amarillo",
    scale: "1:64",
    series: "Timeless Icons",
    description:
      "El Porsche Carrera GT es un automóvil deportivo de alto rendimiento de producción limitada producido por el Dr. Ing. h.c. F.",
    ownerUsername: "EVERYONE",
    pictures: [
      "https://res.cloudinary.com/dyx7kjnjq/image/upload/v1767835523/CARRERAGTCOMPU_ckui64.png",
      "https://res.cloudinary.com/dyx7kjnjq/image/upload/v1767835526/CARRERAGTCELU_ii70ss.png",
    ],
  },
  {
    carId: 1002,
    name: "Porsche 911 GT3 RS",
    brand: "Porsche",
    manufacturer: "Hot Wheels",
    color: "Lizard Green",
    scale: "1:64",
    series: "Car Culture",
    description:
      "La precisión alemana capturada en escala 1:64. Un detalle excepcional en los alerones y tomas de aire.",
    ownerUsername: "admin",
    pictures: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600&h=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1080&h=1080&auto=format&fit=crop",
    ],
  },
  {
    carId: 1003,
    name: "Toyota Supra (A80)",
    brand: "Toyota",
    manufacturer: "Hot Wheels",
    color: "Renaissance Red",
    scale: "1:64",
    series: "The 90s",
    description:
      "Un icono del drift y la cultura JDM. Esta versión destaca por su alerón alto y rines de 5 radios.",
    ownerUsername: "admin",
    pictures: [
      "https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?q=80&w=1600&h=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?q=80&w=1080&h=1080&auto=format&fit=crop",
    ],
  },
  // ACA VAN EL RESTO DE VEHICULOS
];

export function getCuratedCarForCurrentMonth(): CarData {
  const now = new Date();
  const month = now.getMonth(); // 0-11
  const year = now.getFullYear();
  const yearOffset = (year % 2) * 12;
  const index = (yearOffset + month) % curatedCars.length;

  return curatedCars[index];
}
